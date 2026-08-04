# Surcharge Ban Calculator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `/surcharge-calculator` — a standalone, AU-only calculator that estimates what the 1 October 2026 RBA surcharge ban will cost a business, with an email gate that captures leads into HubSpot along with the visitor's own numbers.

**Architecture:** Follows the existing `/calculator` page exactly: a pure React-free math module (`surcharge-fees.ts`) with hand-computed unit tests, URL search params as the single source of truth for inputs (`surcharge-params.ts`), one page-scoped CSS file, and a thin component that only formats. New for this feature: a same-origin TanStack `createServerFn({ method: 'POST' })` that forwards leads to the HubSpot Forms API server-side — same-origin because the production CSP (managed in Cloudflare, not this repo) silently blocks new client-side third-party fetches.

**Tech Stack:** TanStack Start 1.157 + React 19, TypeScript, Vitest 3, hand-written scoped CSS (no Tailwind on marketing pages), Cloudflare Worker deploy, HubSpot Forms API v3.

## Global Constraints

- **Spec:** `docs/superpowers/specs/2026-08-04-surcharge-calculator-design.md` is authoritative. Read it before starting.
- **Branch:** work on `feat/surcharge-calculator` (already created). Never push to `main` — open a PR.
- **AU only.** Currency AUD, locale `en-AU`, symbol `$`. No region switcher.
- **Rate constants (exact, from the user):** debit `0.5% + $0.30` (**not** editable); consumer credit `1.4% + $0.30`; business credit `1.8% + $0.30`; Amex `2.2%` (no fixed); foreign-issued `5.5%` all-in = 3.5% card + 2% FX (no fixed). Quidkey PayTo `0.5% + $0.30`. Quidkey international cards `2.0%` (no fixed).
- **Card mix by value (fixed constants, not editable in v1):** debit 40%, consumer credit 35%, business credit 10%, Amex 8%, foreign 7%.
- **Editable rates in the gated view:** credit, business, Amex, foreign. Debit stays locked.
- **No new dependencies.** No zod/valibot (repo has neither by choice), no form library, no Tailwind on this page.
- **CSS:** every rule scoped under the single root class `.sc-calc`. Imported last in the route, after the homepage CSS chain.
- **Tests:** Vitest, colocated `*.test.ts`. Math stays pure and React-free; the component only formats. Baseline before this work: 52 tests passing in 9 files.
- **Tracking:** all events go through `track()` in `src/lib/track.ts` and must be added to the `HomepageEvent` union first.
- **Never unlock the gate on a failed lead submission.** Silent lead loss is worse than asking the user to retry.

---

### Task 1: Pure fee math module

**Files:**
- Create: `src/components/surcharge-calculator/surcharge-fees.ts`
- Test: `src/components/surcharge-calculator/surcharge-fees.test.ts`

**Interfaces:**
- Consumes: nothing (leaf module).
- Produces: `CARD_MIX`, `CARD_TYPE_ORDER`, `CARD_LABELS`, `DEBIT_PERCENT`, `FIXED_PER_TRANSACTION`, `PAYTO_PERCENT`, `PAYTO_FIXED`, `QUIDKEY_FOREIGN_PERCENT`, `ABS_MEDIAN_FULL_TIME_SALARY`, `MONTHS_PER_YEAR`; types `CardTypeId`, `CardLine`, `QuickInput`, `QuickResult`, `DetailedInput`, `DetailedResult`, `SavingsInput`, `SavingsResult`; functions `computeQuick(input): QuickResult`, `computeDetailed(input): DetailedResult`, `computeSavings(input): SavingsResult`.

- [ ] **Step 1: Write the failing test**

Create `src/components/surcharge-calculator/surcharge-fees.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { computeDetailed, computeQuick, computeSavings } from './surcharge-fees'

// Every expected value below is hand-computed from the spec's rate table so a
// regression in the math shows up as a failing number, not a re-derived one.
// Defaults: $500,000/month card turnover, 1.4% blended rate, $100 AOV.
// Annual volume = 500,000 x 12 = 6,000,000.

describe('computeQuick', () => {
  it('matches the article worked example ($6m at 1.4% = $84,000/yr)', () => {
    const r = computeQuick({ monthlyTurnover: 500_000, ratePercent: 1.4 })
    expect(r.annualVolume).toBe(6_000_000)
    expect(r.annualCost).toBeCloseTo(84_000, 6)
    expect(r.monthlyCost).toBeCloseTo(7_000, 6)
    // 84,000 / 88,400 median full-time salary
    expect(r.salaryEquivalent).toBeCloseTo(0.950226, 5)
  })

  it('is all zeros at zero turnover', () => {
    const r = computeQuick({ monthlyTurnover: 0, ratePercent: 1.4 })
    expect(r.annualVolume).toBe(0)
    expect(r.annualCost).toBe(0)
    expect(r.monthlyCost).toBe(0)
    expect(r.salaryEquivalent).toBe(0)
  })
})

describe('computeDetailed', () => {
  const input = {
    monthlyTurnover: 500_000,
    averageOrderValue: 100,
    creditPercent: 1.4,
    businessPercent: 1.8,
    amexPercent: 2.2,
    foreignPercent: 5.5,
  }

  it('builds one line per card type with hand-computed annual costs', () => {
    const r = computeDetailed(input)
    const byId = Object.fromEntries(r.lines.map((l) => [l.id, l]))

    // debit: 2,400,000 vol / 24,000 txns -> 12,000 + 7,200
    expect(byId.debit.annualVolume).toBeCloseTo(2_400_000, 6)
    expect(byId.debit.annualTransactions).toBeCloseTo(24_000, 6)
    expect(byId.debit.annualCost).toBeCloseTo(19_200, 6)

    // credit: 2,100,000 vol / 21,000 txns -> 29,400 + 6,300
    expect(byId.credit.annualCost).toBeCloseTo(35_700, 6)

    // business: 600,000 vol / 6,000 txns -> 10,800 + 1,800
    expect(byId.business.annualCost).toBeCloseTo(12_600, 6)

    // amex: 480,000 vol, percentage only -> 10,560
    expect(byId.amex.annualCost).toBeCloseTo(10_560, 6)
    expect(byId.amex.fixedPerTransaction).toBe(0)

    // foreign: 420,000 vol, percentage only -> 23,100
    expect(byId.foreign.annualCost).toBeCloseTo(23_100, 6)
    expect(byId.foreign.fixedPerTransaction).toBe(0)
  })

  it('totals the lines and derives the blended effective rate', () => {
    const r = computeDetailed(input)
    // 19,200 + 35,700 + 12,600 + 10,560 + 23,100
    expect(r.annualCost).toBeCloseTo(101_160, 6)
    expect(r.annualVolume).toBeCloseTo(6_000_000, 6)
    expect(r.effectiveRatePercent).toBeCloseTo(1.686, 6)
  })

  it('floors average order value to 1 so fixed fees never divide by zero', () => {
    const r = computeDetailed({ ...input, averageOrderValue: 0 })
    expect(Number.isFinite(r.annualCost)).toBe(true)
    // debit: 2,400,000 txns x $0.30 = 720,000 + 12,000 percentage
    const debit = r.lines.find((l) => l.id === 'debit')!
    expect(debit.annualTransactions).toBeCloseTo(2_400_000, 6)
    expect(debit.annualCost).toBeCloseTo(732_000, 6)
  })

  it('keeps the mix shares summing to 1', () => {
    const r = computeDetailed(input)
    const total = r.lines.reduce((sum, l) => sum + l.mixShare, 0)
    expect(total).toBeCloseTo(1, 10)
  })
})

describe('computeSavings', () => {
  const input = {
    monthlyTurnover: 500_000,
    averageOrderValue: 100,
    creditPercent: 1.4,
    businessPercent: 1.8,
    amexPercent: 2.2,
    foreignPercent: 5.5,
    steerPercent: 30,
  }

  it('computes both savings levers at a 30% steer', () => {
    const r = computeSavings(input)

    // domestic volume = 2,400,000 + 2,100,000 + 600,000 = 5,100,000
    // steered = 30% -> 1,530,000
    expect(r.steeredVolume).toBeCloseTo(1_530_000, 6)
    // domestic cost = 19,200 + 35,700 + 12,600 = 67,500; 30% -> 20,250
    expect(r.currentSteeredCost).toBeCloseTo(20_250, 6)
    // PayTo: 1,530,000 x 0.5% = 7,650 + 15,300 txns x $0.30 = 4,590
    expect(r.payToCost).toBeCloseTo(12_240, 6)
    expect(r.steeringSavings).toBeCloseTo(8_010, 6)
    // foreign: 23,100 today vs 420,000 x 2% = 8,400 with Quidkey
    expect(r.foreignCardSavings).toBeCloseTo(14_700, 6)
    expect(r.totalSavings).toBeCloseTo(22_710, 6)
    expect(r.newAnnualCost).toBeCloseTo(78_450, 6)
    expect(r.savingsPercent).toBeCloseTo(22.449585, 5)
  })

  it('reports a raw negative foreign lever but never a negative total', () => {
    // A foreign rate below Quidkey's 2% means switching costs more, not less.
    const r = computeSavings({ ...input, foreignPercent: 1.5 })
    // 420,000 x 1.5% = 6,300 today vs 8,400 with Quidkey
    expect(r.foreignCardSavings).toBeCloseTo(-2_100, 6)
    expect(r.totalSavings).toBeGreaterThan(0)
    // total excludes the negative lever entirely
    expect(r.totalSavings).toBeCloseTo(r.steeringSavings, 6)
  })

  it('saves nothing when no volume is steered and foreign matches Quidkey', () => {
    const r = computeSavings({ ...input, steerPercent: 0, foreignPercent: 2 })
    expect(r.steeringSavings).toBeCloseTo(0, 6)
    expect(r.foreignCardSavings).toBeCloseTo(0, 6)
    expect(r.totalSavings).toBeCloseTo(0, 6)
    expect(r.savingsPercent).toBeCloseTo(0, 6)
  })

  it('is all zeros at zero turnover', () => {
    const r = computeSavings({ ...input, monthlyTurnover: 0 })
    expect(r.totalSavings).toBe(0)
    expect(r.savingsPercent).toBe(0)
    expect(r.newAnnualCost).toBe(0)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/surcharge-calculator/surcharge-fees.test.ts`
Expected: FAIL — "Failed to resolve import './surcharge-fees'".

- [ ] **Step 3: Write the implementation**

Create `src/components/surcharge-calculator/surcharge-fees.ts`:

```ts
// Fee assumptions and math for the surcharge-ban calculator
// (/surcharge-calculator). Australia only, AUD.
//
// Context: from 1 October 2026 the RBA's surcharge ban means merchants absorb
// card processing fees instead of passing them to customers. This module models
// (a) the quick estimate the article uses — card turnover x blended rate — and
// (b) a per-card-type build-up, plus what steering volume to Pay by Bank saves.
//
// Intentionally pure (no React) so the math is unit-testable and SSR-safe,
// matching the Shopify calculator's fees.ts.

export type CardTypeId = 'debit' | 'credit' | 'business' | 'amex' | 'foreign'

export const MONTHS_PER_YEAR = 12

// ABS Average Weekly Earnings — median full-time adult ordinary time earnings,
// rounded. Used only for the "that's ~N salaries" comparator the article makes.
export const ABS_MEDIAN_FULL_TIME_SALARY = 88_400

// Share of card volume by value. Fixed in v1 (surfaced in the assumptions copy
// rather than made editable) so the breakdown stays defensible.
export const CARD_MIX: Record<CardTypeId, number> = {
  debit: 0.4,
  credit: 0.35,
  business: 0.1,
  amex: 0.08,
  foreign: 0.07,
}

export const CARD_TYPE_ORDER: CardTypeId[] = ['debit', 'credit', 'business', 'amex', 'foreign']

export const CARD_LABELS: Record<CardTypeId, string> = {
  debit: 'Domestic debit',
  credit: 'Domestic consumer credit',
  business: 'Business credit',
  amex: 'American Express',
  foreign: 'Foreign-issued cards',
}

// Domestic debit is not editable: it is the cheapest rail and the one the
// article tells merchants to steer toward, so it stays a fixed reference point.
export const DEBIT_PERCENT = 0.5

// Per-transaction component, applied to domestic debit/credit/business only.
// Amex and foreign-issued cards are modelled as percentage-only.
export const FIXED_PER_TRANSACTION = 0.3

// Quidkey Pay by Bank (PayTo) pricing.
export const PAYTO_PERCENT = 0.5
export const PAYTO_FIXED = 0.3

// Quidkey's international card rate, replacing a card acquirer's all-in
// foreign rate (card % + FX %).
export const QUIDKEY_FOREIGN_PERCENT = 2.0

// Card types that can be steered onto Pay by Bank. Amex and foreign-issued
// cards are excluded: a domestic bank rail is not a substitute for them.
const STEERABLE: CardTypeId[] = ['debit', 'credit', 'business']

const percent = (n: number) => n / 100

// Average order value only ever divides, so floor it to 1 to keep fixed-fee
// maths finite when a visitor clears the field.
const flooredAov = (aov: number) => (Number.isFinite(aov) && aov > 0 ? aov : 1)

export type QuickInput = {
  monthlyTurnover: number
  ratePercent: number
}

export type QuickResult = {
  annualVolume: number
  annualCost: number
  monthlyCost: number
  /** Annual cost expressed as a multiple of a median full-time salary. */
  salaryEquivalent: number
}

export function computeQuick({ monthlyTurnover, ratePercent }: QuickInput): QuickResult {
  const annualVolume = monthlyTurnover * MONTHS_PER_YEAR
  const annualCost = annualVolume * percent(ratePercent)
  return {
    annualVolume,
    annualCost,
    monthlyCost: annualCost / MONTHS_PER_YEAR,
    salaryEquivalent: annualCost / ABS_MEDIAN_FULL_TIME_SALARY,
  }
}

export type CardLine = {
  id: CardTypeId
  label: string
  /** Share of card volume by value, 0..1. */
  mixShare: number
  ratePercent: number
  fixedPerTransaction: number
  annualVolume: number
  annualTransactions: number
  annualCost: number
}

export type DetailedInput = {
  monthlyTurnover: number
  averageOrderValue: number
  creditPercent: number
  businessPercent: number
  amexPercent: number
  foreignPercent: number
}

export type DetailedResult = {
  lines: CardLine[]
  annualVolume: number
  annualCost: number
  effectiveRatePercent: number
}

function ratesFor(input: DetailedInput): Record<CardTypeId, number> {
  return {
    debit: DEBIT_PERCENT,
    credit: input.creditPercent,
    business: input.businessPercent,
    amex: input.amexPercent,
    foreign: input.foreignPercent,
  }
}

const FIXED_FOR: Record<CardTypeId, number> = {
  debit: FIXED_PER_TRANSACTION,
  credit: FIXED_PER_TRANSACTION,
  business: FIXED_PER_TRANSACTION,
  amex: 0,
  foreign: 0,
}

export function computeDetailed(input: DetailedInput): DetailedResult {
  const annualVolume = input.monthlyTurnover * MONTHS_PER_YEAR
  const aov = flooredAov(input.averageOrderValue)
  const rates = ratesFor(input)

  const lines: CardLine[] = CARD_TYPE_ORDER.map((id) => {
    const mixShare = CARD_MIX[id]
    const lineVolume = annualVolume * mixShare
    const transactions = lineVolume / aov
    const fixedPerTransaction = FIXED_FOR[id]
    return {
      id,
      label: CARD_LABELS[id],
      mixShare,
      ratePercent: rates[id],
      fixedPerTransaction,
      annualVolume: lineVolume,
      annualTransactions: transactions,
      annualCost: lineVolume * percent(rates[id]) + transactions * fixedPerTransaction,
    }
  })

  const annualCost = lines.reduce((sum, line) => sum + line.annualCost, 0)

  return {
    lines,
    annualVolume,
    annualCost,
    effectiveRatePercent: annualVolume > 0 ? (annualCost / annualVolume) * 100 : 0,
  }
}

export type SavingsInput = DetailedInput & {
  /** Share of steerable domestic volume moved to Pay by Bank, 0..100. */
  steerPercent: number
}

export type SavingsResult = {
  detailed: DetailedResult
  steeredVolume: number
  currentSteeredCost: number
  payToCost: number
  /** Raw lever value — can be <= 0. */
  steeringSavings: number
  /** Raw lever value — can be <= 0 if the entered foreign rate beats Quidkey's. */
  foreignCardSavings: number
  /** Sum of the levers with non-positive ones excluded, so displays reconcile. */
  totalSavings: number
  newAnnualCost: number
  savingsPercent: number
}

export function computeSavings(input: SavingsInput): SavingsResult {
  const detailed = computeDetailed(input)
  const aov = flooredAov(input.averageOrderValue)
  const steerShare = Math.min(Math.max(input.steerPercent, 0), 100) / 100

  const steerable = detailed.lines.filter((line) => STEERABLE.includes(line.id))
  const steeredVolume = steerable.reduce((sum, line) => sum + line.annualVolume, 0) * steerShare
  const currentSteeredCost = steerable.reduce((sum, line) => sum + line.annualCost, 0) * steerShare

  const payToCost = steeredVolume * percent(PAYTO_PERCENT) + (steeredVolume / aov) * PAYTO_FIXED
  const steeringSavings = currentSteeredCost - payToCost

  const foreign = detailed.lines.find((line) => line.id === 'foreign')
  const foreignCardSavings = foreign
    ? foreign.annualCost - foreign.annualVolume * percent(QUIDKEY_FOREIGN_PERCENT)
    : 0

  // Clamp per lever: a lever that costs more is shown as "no additional
  // saving" rather than quietly cancelling out the other one.
  const totalSavings = Math.max(0, steeringSavings) + Math.max(0, foreignCardSavings)

  return {
    detailed,
    steeredVolume,
    currentSteeredCost,
    payToCost,
    steeringSavings,
    foreignCardSavings,
    totalSavings,
    newAnnualCost: detailed.annualCost - totalSavings,
    savingsPercent: detailed.annualCost > 0 ? (totalSavings / detailed.annualCost) * 100 : 0,
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/components/surcharge-calculator/surcharge-fees.test.ts`
Expected: PASS — 10 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/surcharge-calculator/surcharge-fees.ts src/components/surcharge-calculator/surcharge-fees.test.ts
git commit -m "Add surcharge calculator fee math"
```

---

### Task 2: URL search params

**Files:**
- Create: `src/components/surcharge-calculator/surcharge-params.ts`
- Test: `src/components/surcharge-calculator/surcharge-params.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: type `SurchargeSearch` with numeric fields `turnover`, `rate`, `aov`, `credit`, `business`, `amex`, `foreign`, `steer`; `DEFAULTS: SurchargeSearch`; `parseSearch(raw: Record<string, unknown>): SurchargeSearch`.

- [ ] **Step 1: Write the failing test**

Create `src/components/surcharge-calculator/surcharge-params.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { DEFAULTS, parseSearch } from './surcharge-params'

describe('parseSearch', () => {
  it('returns the defaults for an empty query', () => {
    expect(parseSearch({})).toEqual(DEFAULTS)
  })

  it('has the defaults from the spec', () => {
    expect(DEFAULTS).toEqual({
      turnover: 500_000,
      rate: 1.4,
      aov: 100,
      credit: 1.4,
      business: 1.8,
      amex: 2.2,
      foreign: 5.5,
      steer: 30,
    })
  })

  it('accepts numeric strings from the URL', () => {
    const r = parseSearch({ turnover: '250000', rate: '1.75', aov: '90', steer: '55' })
    expect(r.turnover).toBe(250_000)
    expect(r.rate).toBe(1.75)
    expect(r.aov).toBe(90)
    expect(r.steer).toBe(55)
  })

  it('falls back to defaults for junk, blank, and non-finite values', () => {
    const r = parseSearch({ turnover: 'abc', rate: '', aov: null, steer: undefined })
    expect(r.turnover).toBe(DEFAULTS.turnover)
    expect(r.rate).toBe(DEFAULTS.rate)
    expect(r.aov).toBe(DEFAULTS.aov)
    expect(r.steer).toBe(DEFAULTS.steer)
  })

  it('falls back to defaults for negative and out-of-range values', () => {
    const r = parseSearch({
      turnover: -1,
      rate: 50, // above the 10% ceiling
      aov: 0, // below the 1 floor
      foreign: 99, // above the 15% ceiling
      steer: 140, // above 100
    })
    expect(r.turnover).toBe(DEFAULTS.turnover)
    expect(r.rate).toBe(DEFAULTS.rate)
    expect(r.aov).toBe(DEFAULTS.aov)
    expect(r.foreign).toBe(DEFAULTS.foreign)
    expect(r.steer).toBe(DEFAULTS.steer)
  })

  it('honours an explicit zero where zero is meaningful', () => {
    const r = parseSearch({ turnover: 0, rate: 0, steer: 0 })
    expect(r.turnover).toBe(0)
    expect(r.rate).toBe(0)
    expect(r.steer).toBe(0)
  })

  it('ignores unknown params', () => {
    const r = parseSearch({ turnover: 100, nonsense: 'x' })
    expect(r).toEqual({ ...DEFAULTS, turnover: 100 })
    expect(Object.keys(r).sort()).toEqual(
      ['amex', 'aov', 'business', 'credit', 'foreign', 'rate', 'steer', 'turnover'].sort(),
    )
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/surcharge-calculator/surcharge-params.test.ts`
Expected: FAIL — cannot resolve `./surcharge-params`.

- [ ] **Step 3: Write the implementation**

Create `src/components/surcharge-calculator/surcharge-params.ts`:

```ts
// Typed URL search params for /surcharge-calculator, so a link reproduces the
// exact view and can be shared pre-filled with a merchant's numbers. The route
// validates incoming params with parseSearch() and mirrors changes back.
//
// Plain validation (no zod/valibot — the repo has neither): every field falls
// back to its default when missing, blank, non-numeric, or out of range, so
// junk links degrade safely instead of rendering NaN.

export type SurchargeSearch = {
  /** Monthly card turnover, AUD. */
  turnover: number
  /** Blended card fee rate, %. */
  rate: number
  /** Average order value, AUD. */
  aov: number
  /** Domestic consumer credit rate, %. */
  credit: number
  /** Business credit rate, %. */
  business: number
  /** American Express rate, %. */
  amex: number
  /** Foreign-issued all-in rate (card + FX), %. */
  foreign: number
  /** Share of steerable domestic volume moved to Pay by Bank, %. */
  steer: number
}

export const DEFAULTS: SurchargeSearch = {
  turnover: 500_000,
  rate: 1.4,
  aov: 100,
  credit: 1.4,
  business: 1.8,
  amex: 2.2,
  foreign: 5.5,
  steer: 30,
}

// Inclusive bounds. A value outside its range is treated as junk (a shared link
// someone edited by hand) and replaced by the default rather than clamped, so
// the URL and the rendered figure never disagree.
const RANGES: Record<keyof SurchargeSearch, { min: number; max: number }> = {
  turnover: { min: 0, max: 100_000_000 },
  rate: { min: 0, max: 10 },
  aov: { min: 1, max: 1_000_000 },
  credit: { min: 0, max: 10 },
  business: { min: 0, max: 10 },
  amex: { min: 0, max: 10 },
  foreign: { min: 0, max: 15 },
  steer: { min: 0, max: 100 },
}

function num(raw: unknown, key: keyof SurchargeSearch): number {
  const fallback = DEFAULTS[key]
  if (raw == null || (typeof raw === 'string' && raw.trim() === '')) return fallback
  const n = typeof raw === 'number' ? raw : Number(raw)
  if (!Number.isFinite(n)) return fallback
  const { min, max } = RANGES[key]
  if (n < min || n > max) return fallback
  return n
}

export function parseSearch(raw: Record<string, unknown>): SurchargeSearch {
  return {
    turnover: num(raw.turnover, 'turnover'),
    rate: num(raw.rate, 'rate'),
    aov: num(raw.aov, 'aov'),
    credit: num(raw.credit, 'credit'),
    business: num(raw.business, 'business'),
    amex: num(raw.amex, 'amex'),
    foreign: num(raw.foreign, 'foreign'),
    steer: num(raw.steer, 'steer'),
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/components/surcharge-calculator/surcharge-params.test.ts`
Expected: PASS — 7 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/surcharge-calculator/surcharge-params.ts src/components/surcharge-calculator/surcharge-params.test.ts
git commit -m "Add surcharge calculator URL params"
```

---

### Task 3: Lead capture server function

**Files:**
- Create: `src/lib/submit-lead.ts`
- Test: `src/lib/submit-lead.test.ts`
- Create: `.dev.vars.example`
- Modify: `wrangler.jsonc` (add a `vars` block)
- Modify: `.gitignore` (ignore `.dev.vars` if not already ignored)

**Interfaces:**
- Consumes: nothing.
- Produces: type `LeadInput = { email: string; hp?: string; turnover: number; rate: number }`; type `LeadResult = { ok: true } | { ok: false; error: 'invalid_email' | 'server' }`; pure helpers `normalizeEmail(raw: unknown): string`, `isValidEmail(email: string): boolean`, `isBot(hp: unknown): boolean`, `buildHubspotPayload(input: LeadInput, pageUri: string): object`; server fn `submitLead` callable as `submitLead({ data: LeadInput }): Promise<LeadResult>`.

- [ ] **Step 1: Write the failing test**

Create `src/lib/submit-lead.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { buildHubspotPayload, isBot, isValidEmail, normalizeEmail } from './submit-lead'

describe('normalizeEmail', () => {
  it('trims and lowercases', () => {
    expect(normalizeEmail('  Rabea@Quidkey.COM  ')).toBe('rabea@quidkey.com')
  })

  it('returns an empty string for non-string input', () => {
    expect(normalizeEmail(undefined)).toBe('')
    expect(normalizeEmail(null)).toBe('')
    expect(normalizeEmail(42)).toBe('')
  })
})

describe('isValidEmail', () => {
  it('accepts ordinary work addresses', () => {
    expect(isValidEmail('rabea@quidkey.com')).toBe(true)
    expect(isValidEmail('first.last+tag@sub.example.co.au')).toBe(true)
  })

  it('rejects malformed addresses', () => {
    expect(isValidEmail('')).toBe(false)
    expect(isValidEmail('nope')).toBe(false)
    expect(isValidEmail('no@domain')).toBe(false)
    expect(isValidEmail('no domain@example.com')).toBe(false)
    expect(isValidEmail('@example.com')).toBe(false)
  })

  it('rejects addresses beyond the 254-character limit', () => {
    expect(isValidEmail(`${'a'.repeat(250)}@example.com`)).toBe(false)
  })
})

describe('isBot', () => {
  it('treats a filled honeypot as a bot', () => {
    expect(isBot('http://spam.example')).toBe(true)
  })

  it('treats empty, blank, and missing honeypots as human', () => {
    expect(isBot('')).toBe(false)
    expect(isBot('   ')).toBe(false)
    expect(isBot(undefined)).toBe(false)
  })
})

describe('buildHubspotPayload', () => {
  const input = { email: 'rabea@quidkey.com', turnover: 500_000, rate: 1.4 }

  it('maps the lead and its calculator context to HubSpot form fields', () => {
    const payload = buildHubspotPayload(input, 'https://quidkey.com/surcharge-calculator')
    expect(payload.fields).toEqual([
      { name: 'email', value: 'rabea@quidkey.com' },
      { name: 'monthly_card_turnover', value: '500000' },
      { name: 'average_card_fee_rate', value: '1.4' },
    ])
    expect(payload.context.pageUri).toBe('https://quidkey.com/surcharge-calculator')
    expect(payload.context.pageName).toBe('Surcharge ban calculator')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/submit-lead.test.ts`
Expected: FAIL — cannot resolve `./submit-lead`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/submit-lead.ts`:

```ts
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'

// Lead capture for the surcharge calculator's email gate.
//
// The POST runs in our own Worker and the Worker calls HubSpot, rather than the
// browser calling HubSpot directly. Two reasons: production's CSP lives in
// Cloudflare (not this repo) and its connect-src allowlist silently blocks new
// third-party client fetches — it would work locally and fail in production —
// and a same-origin request keeps the visitor's data out of a cross-origin
// request the ad blockers also tend to eat.

export type LeadInput = {
  email: string
  /** Honeypot. Bots fill hidden fields; humans never see this one. */
  hp?: string
  turnover: number
  rate: number
}

export type LeadResult = { ok: true } | { ok: false; error: 'invalid_email' | 'server' }

const PAGE_PATH = '/surcharge-calculator'
const PAGE_NAME = 'Surcharge ban calculator'
const HUBSPOT_TIMEOUT_MS = 5_000
/** RFC-ish maximum length of an email address. */
const MAX_EMAIL_LENGTH = 254

export function normalizeEmail(raw: unknown): string {
  return typeof raw === 'string' ? raw.trim().toLowerCase() : ''
}

// Deliberately permissive: one @, no whitespace, a dot in the domain. Tighter
// regexes reject valid addresses, and HubSpot validates properly downstream.
export function isValidEmail(email: string): boolean {
  if (!email || email.length > MAX_EMAIL_LENGTH) return false
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(email)
}

export function isBot(hp: unknown): boolean {
  return typeof hp === 'string' && hp.trim() !== ''
}

export function buildHubspotPayload(
  input: Pick<LeadInput, 'email' | 'turnover' | 'rate'>,
  pageUri: string,
) {
  return {
    fields: [
      { name: 'email', value: input.email },
      { name: 'monthly_card_turnover', value: String(input.turnover) },
      { name: 'average_card_fee_rate', value: String(input.rate) },
    ],
    context: { pageUri, pageName: PAGE_NAME },
  }
}

function hubspotEndpoint(portalId: string, formGuid: string): string {
  return `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`
}

export const submitLead = createServerFn({ method: 'POST' })
  .inputValidator((data: LeadInput) => data)
  .handler(async ({ data }): Promise<LeadResult> => {
    // Drop bots silently: reporting success means they stop retrying, and a
    // honeypot hit is never forwarded to HubSpot.
    if (isBot(data.hp)) return { ok: true }

    const email = normalizeEmail(data.email)
    if (!isValidEmail(email)) return { ok: false, error: 'invalid_email' }

    const portalId = process.env.HUBSPOT_PORTAL_ID
    const formGuid = process.env.HUBSPOT_FORM_GUID
    if (!portalId || !formGuid) {
      console.error('[submit-lead] HUBSPOT_PORTAL_ID / HUBSPOT_FORM_GUID are not configured')
      return { ok: false, error: 'server' }
    }

    const origin = new URL(getRequest().url).origin
    const payload = buildHubspotPayload(
      { email, turnover: data.turnover, rate: data.rate },
      `${origin}${PAGE_PATH}`,
    )

    try {
      const response = await fetch(hubspotEndpoint(portalId, formGuid), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(HUBSPOT_TIMEOUT_MS),
      })

      if (!response.ok) {
        // Log the body: HubSpot explains field-name mismatches here, which is
        // the most likely misconfiguration.
        console.error('[submit-lead] HubSpot rejected the submission', {
          status: response.status,
          body: await response.text().catch(() => '<unreadable>'),
        })
        return { ok: false, error: 'server' }
      }

      return { ok: true }
    } catch (error) {
      console.error('[submit-lead] HubSpot request failed', error)
      return { ok: false, error: 'server' }
    }
  })
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/lib/submit-lead.test.ts`
Expected: PASS — 9 tests.

- [ ] **Step 5: Add the Worker configuration**

Edit `wrangler.jsonc` — insert a `vars` block after the `"observability"` line:

```jsonc
  "observability": { "enabled": true },

  // HubSpot Forms API target for the surcharge calculator's lead gate. Neither
  // value is a secret (both are public in any HubSpot embed snippet), so they
  // live here rather than in `wrangler secret`.
  "vars": {
    "HUBSPOT_PORTAL_ID": "",
    "HUBSPOT_FORM_GUID": ""
  },
```

Create `.dev.vars.example`:

```
# Copy to .dev.vars for local development (git-ignored).
# Both values come from the HubSpot form's embed code and are not secrets.
HUBSPOT_PORTAL_ID=
HUBSPOT_FORM_GUID=
```

Check `.gitignore` contains `.dev.vars`; append it if missing.

**Note for the implementer:** leave the `vars` values as empty strings. Rabea supplies the real portal ID and form GUID; until then `submitLead` returns `{ ok: false, error: 'server' }` by design, and the PR description must call this out as a merge blocker.

- [ ] **Step 6: Verify the whole suite still passes**

Run: `npm test`
Expected: PASS — 61 tests (52 baseline + 9).

- [ ] **Step 7: Commit**

```bash
git add src/lib/submit-lead.ts src/lib/submit-lead.test.ts wrangler.jsonc .dev.vars.example .gitignore
git commit -m "Add HubSpot lead capture server function"
```

---

### Task 4: Tracking events

**Files:**
- Modify: `src/lib/track.ts:21-34` (the `HomepageEvent` union)

**Interfaces:**
- Consumes: nothing.
- Produces: three new `HomepageEvent` variants — `{ name: 'surcharge_calculator_view' }`, `{ name: 'surcharge_calculator_input'; field: string }`, `{ name: 'surcharge_lead_submit'; outcome: 'success' | 'error' }`.

- [ ] **Step 1: Add the event variants**

In `src/lib/track.ts`, add these three lines to the `HomepageEvent` union immediately after the existing `| { name: 'calculator_view' }` line:

```ts
  | { name: 'surcharge_calculator_view' }
  | { name: 'surcharge_calculator_input'; field: string }
  | { name: 'surcharge_lead_submit'; outcome: 'success' | 'error' }
```

Note the existing union puts event params as flat sibling keys (not a nested `params` object) — `eventParams()` strips `name` and forwards the rest. Follow that shape.

- [ ] **Step 2: Verify the existing tracking tests still pass**

Run: `npx vitest run src/lib/track.test.ts`
Expected: PASS — 7 tests (the union widened; no behaviour changed).

- [ ] **Step 3: Commit**

```bash
git add src/lib/track.ts
git commit -m "Add surcharge calculator tracking events"
```

---

### Task 5: Route, page shell, and ungated quick estimate

**Files:**
- Create: `src/routes/surcharge-calculator.tsx`
- Create: `src/components/surcharge-calculator/surcharge-calculator.tsx`
- Create: `src/components/surcharge-calculator/surcharge-calculator.css`
- Modify: `src/lib/redirects.test.ts` (add the new route to the two existing assertions)

**Interfaces:**
- Consumes: `SurchargeSearch`, `DEFAULTS`, `parseSearch` (Task 2); `computeQuick` (Task 1); `track` + the `surcharge_calculator_view` / `surcharge_calculator_input` events (Task 4).
- Produces: `SurchargeCalculator` component accepting `{ state: SurchargeSearch; onChange: (patch: Partial<SurchargeSearch>) => void }`; the exported `Route` for `/surcharge-calculator`.

- [ ] **Step 1: Create the route**

Create `src/routes/surcharge-calculator.tsx`:

```tsx
import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

import { SurchargeCalculator } from '@/components/surcharge-calculator/surcharge-calculator'
import {
  DEFAULTS,
  parseSearch,
  type SurchargeSearch,
} from '@/components/surcharge-calculator/surcharge-params'
import { HomepageFooter } from '@/components/layout/homepage-footer'
import { HomepageNav } from '@/components/layout/homepage-nav'
import { AudienceProvider } from '@/context/audience'
import { buildSeo } from '@/lib/seo'
import { track } from '@/lib/track'

// Share the homepage's chrome (nav, footer, typography, container) so this page
// doesn't look like a different site. surcharge-calculator.css loads last so its
// .sc-calc-scoped rules win at equal specificity (same trick as calculator.css).
import '@/styles/homepage/base.css'
import '@/styles/homepage/headings.css'
import '@/styles/homepage/section-padding.css'
import '@/styles/homepage/mobile.css'
import '@/styles/homepage/overrides.css'
import '@/components/surcharge-calculator/surcharge-calculator.css'

export const Route = createFileRoute('/surcharge-calculator')({
  component: SurchargeCalculatorPage,
  // Inputs live in the URL so a link reproduces the exact view. Missing or
  // invalid params fall back to defaults (see surcharge-params.ts).
  validateSearch: (search: Record<string, unknown>): SurchargeSearch => parseSearch(search),
  // Keep the URL clean: strip params equal to the defaults so a bare link stays
  // bare and shared links carry only the changed inputs.
  search: { middlewares: [stripSearchParams(DEFAULTS)] },
  head: () =>
    buildSeo({
      title: 'Card Surcharge Ban Calculator · Quidkey',
      description:
        "From 1 October 2026 Australian businesses absorb card fees instead of surcharging. Estimate what that costs you, and what steering volume to Pay by Bank saves.",
      keywords: [
        'surcharge ban calculator',
        'card surcharge ban Australia',
        'RBA surcharge ban',
        'card processing fees Australia',
        'PayTo',
        'Pay by Bank',
      ],
      path: '/surcharge-calculator',
    }),
})

function SurchargeCalculatorPage() {
  // One page-view event, fanned out to GA + Clarity + Snitcher via track().
  // Ref-guarded so React's dev StrictMode double-mount doesn't emit it twice.
  const fired = useRef(false)
  useEffect(() => {
    if (fired.current) return
    fired.current = true
    track({ name: 'surcharge_calculator_view' })
  }, [])

  // URL is the source of truth for the inputs; mirror every change back with
  // replace so adjusting inputs doesn't pile up browser-history entries.
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const update = (patch: Partial<SurchargeSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true })

  // AudienceProvider is required because HomepageNav reads useAudience().
  return (
    <AudienceProvider>
      <div className="hp">
        <HomepageNav />
        <main id="main" className="sc-calc">
          <SurchargeCalculator state={search} onChange={update} />
        </main>
        <HomepageFooter />
      </div>
    </AudienceProvider>
  )
}
```

- [ ] **Step 2: Create the component with the header and quick estimate only**

Create `src/components/surcharge-calculator/surcharge-calculator.tsx`. This step builds the ungated half; Task 6 adds the gate and detailed view to the same file.

```tsx
import { useEffect, useMemo, useRef, useState } from 'react'

import { computeQuick } from './surcharge-fees'
import type { SurchargeSearch } from './surcharge-params'
import { track } from '@/lib/track'

// AUD only — this page is about an Australian regulatory change, so there is no
// region switcher and the currency is fixed.
const LOCALE = 'en-AU'

export const money = (n: number, dp = 0) =>
  '$' +
  (Number.isFinite(n) ? n : 0).toLocaleString(LOCALE, {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  })

export const count = (n: number) => Math.round(Number.isFinite(n) ? n : 0).toLocaleString(LOCALE)

/** Trims trailing zeros so 1.40 reads as "1.4%" and 2 as "2%". */
export const rateText = (n: number) => `${Number(n.toFixed(2))}%`

// Debounced input tracking: one event per field per pause, not per keystroke.
function useTrackInput() {
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  useEffect(() => {
    const pending = timers.current
    return () => {
      for (const timer of Object.values(pending)) clearTimeout(timer)
    }
  }, [])
  return (field: string) => {
    clearTimeout(timers.current[field])
    timers.current[field] = setTimeout(() => {
      track({ name: 'surcharge_calculator_input', field })
    }, 800)
  }
}

function CurrencyField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string
  hint?: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <div className="sc-field">
      <div className="sc-field__top">
        <label className="sc-field__label" htmlFor={`f-${label}`}>
          {label}
        </label>
        {hint ? <span className="sc-field__hint">{hint}</span> : null}
      </div>
      <div className="sc-field__input">
        <span className="sc-field__prefix">$</span>
        <input
          id={`f-${label}`}
          type="text"
          inputMode="numeric"
          className="num"
          value={value.toLocaleString(LOCALE)}
          onChange={(e) => {
            const digits = e.target.value.replace(/[^0-9]/g, '')
            onChange(digits === '' ? 0 : parseInt(digits, 10))
          }}
        />
      </div>
    </div>
  )
}

// Percent fields need decimals, so the raw text is held locally while the user
// types ("1." is not yet a number) and only valid values propagate up. On blur
// the draft clears so the field snaps back to the canonical value.
export function PercentField({
  label,
  hint,
  value,
  onChange,
  max,
  disabled,
}: {
  label: string
  hint?: string
  value: number
  onChange: (value: number) => void
  max: number
  disabled?: boolean
}) {
  const [draft, setDraft] = useState<string | null>(null)
  const id = `p-${label.replace(/\s+/g, '-').toLowerCase()}`

  return (
    <div className={`sc-field sc-field--pct ${disabled ? 'is-locked' : ''}`}>
      <div className="sc-field__top">
        <label className="sc-field__label" htmlFor={id}>
          {label}
        </label>
        {hint ? <span className="sc-field__hint">{hint}</span> : null}
      </div>
      <div className="sc-field__input">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          className="num"
          disabled={disabled}
          value={draft ?? String(value)}
          onChange={(e) => {
            // Keep digits and at most one decimal point.
            const raw = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
            setDraft(raw)
            const n = Number(raw)
            if (raw !== '' && Number.isFinite(n) && n >= 0 && n <= max) onChange(n)
          }}
          onBlur={() => setDraft(null)}
        />
        <span className="sc-field__suffix">%</span>
      </div>
    </div>
  )
}

export function SurchargeCalculator({
  state,
  onChange,
}: {
  state: SurchargeSearch
  onChange: (patch: Partial<SurchargeSearch>) => void
}) {
  const { turnover, rate } = state
  const trackInput = useTrackInput()

  const quick = useMemo(
    () => computeQuick({ monthlyTurnover: turnover, ratePercent: rate }),
    [turnover, rate],
  )

  return (
    <>
      <header className="sc-head">
        <div className="container">
          <span className="sc-chip">
            <span className="sc-chip__dot" />
            From 1 October 2026
          </span>
          <h1 className="sc-head__title">
            What will the surcharge ban <em>cost your business?</em>
          </h1>
          <p className="sc-head__sub">
            From 1 October you can no longer pass card processing fees to your customers. You pay
            them instead. Here's what that looks like on your volume.
          </p>
        </div>
      </header>

      <section className="sc-quick">
        <div className="container">
          <div className="sc-quick__card">
            <div className="sc-quick__inputs">
              <h2 className="sc-quick__title">Your card volume</h2>
              <CurrencyField
                label="Monthly card turnover"
                hint="per month"
                value={turnover}
                onChange={(v) => {
                  onChange({ turnover: v })
                  trackInput('turnover')
                }}
              />
              <PercentField
                label="Your average card fee rate"
                hint="check your merchant statement"
                value={rate}
                max={10}
                onChange={(v) => {
                  onChange({ rate: v })
                  trackInput('rate')
                }}
              />
              <p className="sc-quick__note">
                Not sure? Most Australian businesses land between 1.2% and 1.8% once every card type
                is averaged out.
              </p>
            </div>

            <div className="sc-quick__result">
              <div className="sc-quick__eyebrow">Card fees you'll absorb</div>
              <div className="sc-quick__big num">{money(quick.annualCost)}</div>
              <div className="sc-quick__unit">per year</div>
              <dl className="sc-quick__meta">
                <div>
                  <dt>Per month</dt>
                  <dd className="num">{money(quick.monthlyCost)}</dd>
                </div>
                <div>
                  <dt>On annual card volume</dt>
                  <dd className="num">{money(quick.annualVolume)}</dd>
                </div>
              </dl>
              {quick.salaryEquivalent >= 0.1 ? (
                <p className="sc-quick__compare">
                  That's about <b>{quick.salaryEquivalent.toFixed(1)}×</b> a median full-time salary
                  in Australia — without getting the extra help.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 3: Create the page CSS**

Create `src/components/surcharge-calculator/surcharge-calculator.css`:

```css
/* ───────────────────────────────────────────────────────────────────
   Quidkey — Card Surcharge Ban Calculator (/surcharge-calculator)
   Every rule is scoped under .sc-calc so it stays isolated from the
   shared .hp nav/footer chrome it renders inside, and so its tokens
   never leak site-wide. Tokens mirror calculator.css (same brand
   palette, Outfit already loaded globally) with one addition: amber
   marks cost/pain, green marks savings — the page tells a two-act
   story and the colour carries it.
   Imported LAST in the route so it wins at equal specificity.
   ─────────────────────────────────────────────────────────────────── */
.sc-calc {
  --bg: #ffffff;
  --bg-soft: #f9f9fb;
  --bg-mute: #f4f4f4;
  --line: #e8e8e8;
  --line-strong: #d4d4d4;
  --ink: #0a0a0a;
  --ink-soft: #1f1f1f;
  --muted: #6b6b6b;
  --faint: #9a9a9a;

  --green: #10b981;
  --green-ink: #065f46;
  --green-bg: #d1fae5;
  --amber: #f59e0b;
  --amber-ink: #92400e;
  --amber-bg: #fef3c7;
  --accent: #2e73f0;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
  --shadow-card: 0 1px 0 rgba(10, 10, 10, 0.02), 0 12px 28px -16px rgba(10, 10, 10, 0.1),
    0 36px 60px -32px rgba(10, 10, 10, 0.1);

  --sans: 'Outfit', system-ui, -apple-system, sans-serif;

  display: block;
  background: var(--bg-soft);
  color: var(--ink);
  font-family: var(--sans);
  font-size: 15px;
  line-height: 1.55;
}

.sc-calc ::selection {
  background: var(--ink);
  color: var(--bg);
}

.sc-calc .num {
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum';
}

.sc-calc .container {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 32px;
}
@media (max-width: 768px) {
  .sc-calc .container {
    padding: 0 20px;
  }
}

/* ─── Header ─── */
.sc-calc .sc-head {
  padding: 48px 0 32px;
  text-align: center;
}
@media (max-width: 768px) {
  .sc-calc .sc-head {
    padding: 28px 0 20px;
  }
}
.sc-calc .sc-chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 26px;
  padding: 0 12px;
  margin-bottom: 18px;
  border-radius: 999px;
  background: var(--amber-bg);
  color: var(--amber-ink);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: -0.005em;
}
.sc-calc .sc-chip__dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: currentColor;
}
.sc-calc .sc-head__title {
  font-size: clamp(30px, 4.6vw, 48px);
  line-height: 1.05;
  letter-spacing: -0.035em;
  font-weight: 600;
  margin: 0 auto 16px;
  max-width: 20ch;
  text-wrap: balance;
}
.sc-calc .sc-head__title em {
  font-style: normal;
  color: var(--muted);
}
.sc-calc .sc-head__sub {
  font-size: 18px;
  line-height: 1.55;
  color: var(--muted);
  max-width: 640px;
  margin: 0 auto;
  text-wrap: pretty;
}

/* ─── Cards ─── */
.sc-calc .sc-card {
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 18px;
  box-shadow: var(--shadow-card);
}

/* ─── Quick estimate ─── */
.sc-calc .sc-quick {
  padding-bottom: 40px;
}
.sc-calc .sc-quick__card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 18px;
  box-shadow: var(--shadow-card);
  overflow: hidden;
}
@media (max-width: 860px) {
  .sc-calc .sc-quick__card {
    grid-template-columns: 1fr;
  }
}
.sc-calc .sc-quick__inputs {
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.sc-calc .sc-quick__title {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin: 0;
}
.sc-calc .sc-quick__note {
  font-size: 13px;
  line-height: 1.5;
  color: var(--faint);
  margin: 0;
}
.sc-calc .sc-quick__result {
  padding: 28px;
  background: var(--ink);
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.sc-calc .sc-quick__eyebrow {
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: var(--amber);
  text-transform: uppercase;
}
.sc-calc .sc-quick__big {
  font-size: clamp(40px, 6vw, 60px);
  line-height: 1.02;
  letter-spacing: -0.04em;
  font-weight: 600;
  margin-top: 6px;
}
.sc-calc .sc-quick__unit {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.62);
}
.sc-calc .sc-quick__meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin: 20px 0 0;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.14);
}
.sc-calc .sc-quick__meta dt {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.56);
  margin-bottom: 3px;
}
.sc-calc .sc-quick__meta dd {
  margin: 0;
  font-size: 19px;
  font-weight: 600;
  letter-spacing: -0.02em;
}
.sc-calc .sc-quick__compare {
  font-size: 13.5px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.72);
  margin: 16px 0 0;
}
.sc-calc .sc-quick__compare b {
  color: #fff;
}

/* ─── Fields ─── */
.sc-calc .sc-field__top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 6px;
}
.sc-calc .sc-field__label {
  font-size: 13.5px;
  font-weight: 500;
  color: var(--ink-soft);
}
.sc-calc .sc-field__hint {
  font-size: 12px;
  color: var(--faint);
}
.sc-calc .sc-field__input {
  display: flex;
  align-items: center;
  height: 46px;
  padding: 0 14px;
  gap: 8px;
  background: var(--bg);
  border: 1px solid var(--line-strong);
  border-radius: 11px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.sc-calc .sc-field__input:focus-within {
  border-color: var(--ink);
  box-shadow: 0 0 0 3px rgba(10, 10, 10, 0.07);
}
.sc-calc .sc-field__prefix,
.sc-calc .sc-field__suffix {
  font-size: 15px;
  color: var(--faint);
  flex: none;
}
.sc-calc .sc-field__input input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: none;
  font: inherit;
  font-size: 16px;
  font-weight: 500;
  color: var(--ink);
  padding: 0;
}
.sc-calc .sc-field--pct .sc-field__input {
  max-width: 150px;
}
.sc-calc .sc-field.is-locked .sc-field__input {
  background: var(--bg-mute);
  border-color: var(--line);
}
.sc-calc .sc-field.is-locked input {
  color: var(--muted);
}
```

- [ ] **Step 4: Run the dev server and confirm the page renders**

Run: `npm run dev` (leave it running for Task 6 and Task 8)
Visit: `http://localhost:3000/surcharge-calculator`
Expected: nav + header + quick-estimate card showing **$84,000 per year** at the defaults. Editing turnover updates the number and the URL.

- [ ] **Step 5: Add the route to the redirects tests**

In `src/lib/redirects.test.ts`, add one line to each of the two existing assertion groups:

In the `'returns null for live routes (no redirect)'` test, after the `/calculator` line:

```ts
    expect(resolveRedirect('/surcharge-calculator')).toBeNull()
```

In the `'is must-revalidate everywhere else'` test, after the `/calculator` line:

```ts
    expect(resolveCacheControl('/surcharge-calculator')).toBe('public, max-age=0, must-revalidate')
```

- [ ] **Step 6: Run the full suite**

Run: `npm test`
Expected: PASS — 61 tests, including the two new assertions.

- [ ] **Step 7: Commit**

```bash
git add src/routes/surcharge-calculator.tsx src/components/surcharge-calculator/surcharge-calculator.tsx src/components/surcharge-calculator/surcharge-calculator.css src/lib/redirects.test.ts
git commit -m "Add surcharge calculator page with quick estimate"
```

---

### Task 6: Email gate, detailed breakdown, and savings scenario

**Files:**
- Modify: `src/components/surcharge-calculator/surcharge-calculator.tsx` (append the gate + gated sections)
- Modify: `src/components/surcharge-calculator/surcharge-calculator.css` (append the styles)

**Interfaces:**
- Consumes: `computeSavings`, `CARD_MIX`, `DEBIT_PERCENT`, `PAYTO_PERCENT`, `PAYTO_FIXED`, `QUIDKEY_FOREIGN_PERCENT`, `FIXED_PER_TRANSACTION` (Task 1); `submitLead`, `LeadResult` (Task 3); `surcharge_lead_submit` event (Task 4); `money`, `count`, `rateText`, `PercentField` (Task 5).
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Add the unlock hook and gate form**

In `src/components/surcharge-calculator/surcharge-calculator.tsx`, extend the imports:

```tsx
import { submitLead } from '@/lib/submit-lead'
import {
  CARD_MIX,
  DEBIT_PERCENT,
  FIXED_PER_TRANSACTION,
  PAYTO_FIXED,
  PAYTO_PERCENT,
  QUIDKEY_FOREIGN_PERCENT,
  computeQuick,
  computeSavings,
} from './surcharge-fees'
```

Then add, above `SurchargeCalculator`:

```tsx
const UNLOCK_KEY = 'qk_surcharge_unlocked'

// The gate stays locked through SSR and the first client render (same initial
// state on both, so no hydration mismatch), then unlocks in an effect if this
// visitor already gave us their email.
function useUnlocked() {
  const [unlocked, setUnlocked] = useState(false)
  useEffect(() => {
    try {
      if (window.localStorage.getItem(UNLOCK_KEY) === '1') setUnlocked(true)
    } catch {
      // Private-mode localStorage throws; the visitor just sees the gate again.
    }
  }, [])
  const unlock = () => {
    try {
      window.localStorage.setItem(UNLOCK_KEY, '1')
    } catch {
      // Non-fatal: unlock this session in memory regardless.
    }
    setUnlocked(true)
  }
  return { unlocked, unlock }
}

function LeadGate({
  turnover,
  rate,
  onUnlock,
}: {
  turnover: number
  rate: number
  onUnlock: () => void
}) {
  const [email, setEmail] = useState('')
  const [hp, setHp] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    try {
      const result = await submitLead({ data: { email, hp, turnover, rate } })
      if (result.ok) {
        track({ name: 'surcharge_lead_submit', outcome: 'success' })
        onUnlock()
        return
      }
      // A failed forward must never unlock — losing the lead silently is worse
      // than asking for a retry.
      setStatus('error')
      track({ name: 'surcharge_lead_submit', outcome: 'error' })
    } catch {
      setStatus('error')
      track({ name: 'surcharge_lead_submit', outcome: 'error' })
    }
  }

  return (
    <form className="sc-gate__form" onSubmit={submit} noValidate>
      <h2 className="sc-gate__title">See where your fees actually go</h2>
      <p className="sc-gate__sub">
        Get the breakdown by card type — including the three that get no fee relief on 1 October —
        and what steering volume to Pay by Bank would save you.
      </p>

      <label className="sc-gate__label" htmlFor="sc-email">
        Work email
      </label>
      <div className="sc-gate__row">
        <input
          id="sc-email"
          className="sc-gate__input"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@company.com.au"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-describedby={status === 'error' ? 'sc-gate-error' : 'sc-gate-privacy'}
        />
        <button className="sc-gate__btn" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'See my full breakdown'}
        </button>
      </div>

      {/* Honeypot: bots fill hidden inputs, humans never see this. */}
      <input
        className="sc-gate__hp"
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
      />

      {status === 'error' ? (
        <p className="sc-gate__error" id="sc-gate-error" role="alert">
          Something went wrong — please try again.
        </p>
      ) : (
        <p className="sc-gate__privacy" id="sc-gate-privacy">
          We'll also send occasional Quidkey updates. Unsubscribe anytime.
        </p>
      )}
    </form>
  )
}

// A masked stand-in for the gated table: same shape, no real figures, so the
// gate shows what's coming without putting the numbers in the DOM.
function GatePreview() {
  return (
    <div className="sc-gate__preview" aria-hidden="true" inert>
      {[0, 1, 2, 3, 4].map((i) => (
        <div className="sc-gate__prow" key={i}>
          <span className="sc-gate__pbar" style={{ width: `${58 - i * 6}%` }} />
          <span className="sc-gate__pval">$••,•••</span>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Add the detailed breakdown and savings sections**

Still in the same file, add above `SurchargeCalculator`:

```tsx
function Breakdown({
  state,
  onChange,
  onTrackInput,
}: {
  state: SurchargeSearch
  onChange: (patch: Partial<SurchargeSearch>) => void
  onTrackInput: (field: string) => void
}) {
  const { turnover, aov, credit, business, amex, foreign, steer } = state

  const result = useMemo(
    () =>
      computeSavings({
        monthlyTurnover: turnover,
        averageOrderValue: aov,
        creditPercent: credit,
        businessPercent: business,
        amexPercent: amex,
        foreignPercent: foreign,
        steerPercent: steer,
      }),
    [turnover, aov, credit, business, amex, foreign, steer],
  )
  const { detailed } = result

  const NO_RELIEF: Record<string, string> = {
    business: 'No interchange cut on 1 October',
    amex: 'No interchange cut, and no longer surchargeable',
    foreign: 'No cap until 1 April 2027',
  }

  return (
    <>
      <section className="sc-detail">
        <div className="container">
          <div className="sc-section__head">
            <h2 className="sc-section__title">Where your card fees go</h2>
            <p className="sc-section__sub">
              Built up from a typical Australian card mix. Adjust any rate to match your merchant
              statement — domestic debit stays fixed as the cheapest reference point.
            </p>
          </div>

          <div className="sc-card sc-detail__card">
            <div className="sc-detail__inputs">
              <CurrencyField
                label="Average order value"
                hint="per transaction"
                value={aov}
                onChange={(v) => {
                  onChange({ aov: v })
                  onTrackInput('aov')
                }}
              />
              <PercentField
                label="Consumer credit"
                value={credit}
                max={10}
                onChange={(v) => {
                  onChange({ credit: v })
                  onTrackInput('credit')
                }}
              />
              <PercentField
                label="Business credit"
                value={business}
                max={10}
                onChange={(v) => {
                  onChange({ business: v })
                  onTrackInput('business')
                }}
              />
              <PercentField
                label="American Express"
                value={amex}
                max={10}
                onChange={(v) => {
                  onChange({ amex: v })
                  onTrackInput('amex')
                }}
              />
              <PercentField
                label="Foreign cards"
                hint="card + FX"
                value={foreign}
                max={15}
                onChange={(v) => {
                  onChange({ foreign: v })
                  onTrackInput('foreign')
                }}
              />
              <PercentField label="Domestic debit" value={DEBIT_PERCENT} max={10} onChange={() => {}} disabled />
            </div>

            <table className="sc-table">
              <caption className="sc-table__caption">
                Estimated annual card fees by card type
              </caption>
              <thead>
                <tr>
                  <th scope="col">Card type</th>
                  <th scope="col" className="sc-table__num">
                    Share
                  </th>
                  <th scope="col" className="sc-table__num">
                    Rate
                  </th>
                  <th scope="col" className="sc-table__num">
                    Annual volume
                  </th>
                  <th scope="col" className="sc-table__num">
                    Annual cost
                  </th>
                </tr>
              </thead>
              <tbody>
                {detailed.lines.map((line) => (
                  <tr key={line.id}>
                    <th scope="row">
                      <span className="sc-table__label">{line.label}</span>
                      {NO_RELIEF[line.id] ? (
                        <span className="sc-table__flag">{NO_RELIEF[line.id]}</span>
                      ) : null}
                    </th>
                    <td className="sc-table__num num">{Math.round(line.mixShare * 100)}%</td>
                    <td className="sc-table__num num">
                      {rateText(line.ratePercent)}
                      {line.fixedPerTransaction > 0
                        ? ` + $${line.fixedPerTransaction.toFixed(2)}`
                        : ''}
                    </td>
                    <td className="sc-table__num num">{money(line.annualVolume)}</td>
                    <td className="sc-table__num num sc-table__cost">{money(line.annualCost)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row">
                    Total — detailed estimate
                    <span className="sc-table__flag">
                      Blended {rateText(detailed.effectiveRatePercent)} of card volume
                    </span>
                  </th>
                  <td className="sc-table__num num">100%</td>
                  <td />
                  <td className="sc-table__num num">{money(detailed.annualVolume)}</td>
                  <td className="sc-table__num num sc-table__cost">{money(detailed.annualCost)}</td>
                </tr>
              </tfoot>
            </table>
            <p className="sc-detail__foot">
              This builds your fees up card type by card type, so it can differ from the quick
              estimate above — that one applies a single blended rate you entered to all volume.
            </p>
          </div>
        </div>
      </section>

      <section className="sc-save">
        <div className="container">
          <div className="sc-section__head">
            <h2 className="sc-section__title">What you can still legally do</h2>
            <p className="sc-section__sub">
              You can't charge more for a card, but you can charge less for a bank payment. Move
              volume onto Pay by Bank and the fee goes with it.
            </p>
          </div>

          <div className="sc-card sc-save__card">
            <div className="sc-save__control">
              <label className="sc-field__label" htmlFor="sc-steer">
                Card volume steered to Pay by Bank
              </label>
              <div className="sc-save__slider">
                <input
                  id="sc-steer"
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={steer}
                  onChange={(e) => {
                    onChange({ steer: Number(e.target.value) })
                    onTrackInput('steer')
                  }}
                />
                <output className="sc-save__pct num" htmlFor="sc-steer">
                  {steer}%
                </output>
              </div>
              <p className="sc-save__hint">
                The RBA's own survey found over half of card users would switch for a 1% discount.
                Applies to domestic debit, consumer credit and business credit.
              </p>
            </div>

            <ul className="sc-levers">
              <li className="sc-lever">
                <div className="sc-lever__label">
                  Steering {money(result.steeredVolume)} to Pay by Bank
                  <span className="sc-lever__rate">
                    {rateText(PAYTO_PERCENT)} + ${PAYTO_FIXED.toFixed(2)} instead of card rates
                  </span>
                </div>
                <div className="sc-lever__val num">
                  {result.steeringSavings > 0 ? money(result.steeringSavings) : 'No saving'}
                </div>
              </li>
              <li className="sc-lever">
                <div className="sc-lever__label">
                  Foreign cards through Quidkey
                  <span className="sc-lever__rate">
                    {rateText(QUIDKEY_FOREIGN_PERCENT)} instead of {rateText(foreign)} all-in
                  </span>
                </div>
                <div className="sc-lever__val num">
                  {result.foreignCardSavings > 0
                    ? money(result.foreignCardSavings)
                    : 'No additional saving'}
                </div>
              </li>
            </ul>

            <div className="sc-outcome">
              <div className="sc-outcome__cell">
                <div className="sc-outcome__lbl">Estimated annual saving</div>
                <div className="sc-outcome__val num sc-outcome__val--green">
                  {money(result.totalSavings)}
                </div>
                <div className="sc-outcome__sub">
                  {Math.round(result.savingsPercent)}% off your card fees
                </div>
              </div>
              <div className="sc-outcome__cell">
                <div className="sc-outcome__lbl">New annual card cost</div>
                <div className="sc-outcome__val num">{money(result.newAnnualCost)}</div>
                <div className="sc-outcome__sub">
                  down from {money(detailed.annualCost)}
                </div>
              </div>
              <div className="sc-outcome__cell sc-outcome__cta">
                <p className="sc-outcome__pitch">
                  Quidkey lets you offer discounts, loyalty points or other rewards so customers
                  choose Pay by Bank — and share the saving instead of giving it to the card
                  networks.
                </p>
                <div className="sc-outcome__btns">
                  <a className="sc-btn sc-btn--primary" href={DEMO_BOOKING_URL} target="_blank" rel="noreferrer">
                    Book a demo
                  </a>
                  <a className="sc-btn sc-btn--ghost" href={MERCHANTS_SIGNUP_URL}>
                    Get started
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sc-notes">
        <div className="container">
          <h2 className="sc-notes__title">Assumptions</h2>
          <p className="sc-notes__body">
            <strong>Estimates only.</strong> Card mix by value is assumed to be{' '}
            {Math.round(CARD_MIX.debit * 100)}% domestic debit,{' '}
            {Math.round(CARD_MIX.credit * 100)}% domestic consumer credit,{' '}
            {Math.round(CARD_MIX.business * 100)}% business credit,{' '}
            {Math.round(CARD_MIX.amex * 100)}% American Express and{' '}
            {Math.round(CARD_MIX.foreign * 100)}% foreign-issued. Domestic debit, consumer credit
            and business credit include a ${FIXED_PER_TRANSACTION.toFixed(2)} per-transaction fee;
            American Express and foreign cards are modelled as a percentage only. Quidkey Pay by
            Bank is {rateText(PAYTO_PERCENT)} + ${PAYTO_FIXED.toFixed(2)} and Quidkey international
            cards {rateText(QUIDKEY_FOREIGN_PERCENT)}. Your actual fees depend on your merchant
            agreement, card mix, negotiated rates, refunds, chargebacks and FX.
          </p>
          <p className="sc-notes__body">
            The 1 October 2026 changes and the RBA's consumer-switching figures come from the RBA's{' '}
            <em>Review of Merchant Card Payment Costs and Surcharging — Conclusions Paper</em>{' '}
            (March 2026) and the RBA Consumer Payments Survey 2025. This is general information,
            not financial or legal advice — check your own merchant agreements and get advice on how
            you structure any discount.
          </p>
        </div>
      </section>
    </>
  )
}
```

Add the URL imports at the top of the file:

```tsx
import { DEMO_BOOKING_URL, MERCHANTS_SIGNUP_URL } from '@/lib/urls'
```

- [ ] **Step 3: Wire the gate into the main component**

In `SurchargeCalculator`, replace the closing `</>` region so the component ends with the gate or the breakdown. Add `const { unlocked, unlock } = useUnlocked()` next to the existing `trackInput` line, and append this after the `sc-quick` section:

```tsx
      {unlocked ? (
        <Breakdown state={state} onChange={onChange} onTrackInput={trackInput} />
      ) : (
        <section className="sc-gate">
          <div className="container">
            <div className="sc-card sc-gate__card">
              <LeadGate turnover={turnover} rate={rate} onUnlock={unlock} />
              <GatePreview />
            </div>
          </div>
        </section>
      )}
```

- [ ] **Step 4: Append the CSS for the gate, table, savings, and notes**

Append to `src/components/surcharge-calculator/surcharge-calculator.css`:

```css
/* ─── Section heads ─── */
.sc-calc .sc-section__head {
  max-width: 640px;
  margin: 0 0 20px;
}
.sc-calc .sc-section__title {
  font-size: clamp(22px, 2.6vw, 30px);
  line-height: 1.15;
  letter-spacing: -0.03em;
  font-weight: 600;
  margin: 0 0 8px;
}
.sc-calc .sc-section__sub {
  font-size: 16px;
  line-height: 1.55;
  color: var(--muted);
  margin: 0;
  text-wrap: pretty;
}

/* ─── Gate ─── */
.sc-calc .sc-gate {
  padding-bottom: 56px;
}
.sc-calc .sc-gate__card {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 32px;
  padding: 32px;
  align-items: center;
}
@media (max-width: 860px) {
  .sc-calc .sc-gate__card {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 24px;
  }
}
.sc-calc .sc-gate__title {
  font-size: clamp(21px, 2.4vw, 27px);
  line-height: 1.15;
  letter-spacing: -0.03em;
  font-weight: 600;
  margin: 0 0 8px;
}
.sc-calc .sc-gate__sub {
  font-size: 15.5px;
  line-height: 1.55;
  color: var(--muted);
  margin: 0 0 20px;
  text-wrap: pretty;
}
.sc-calc .sc-gate__label {
  display: block;
  font-size: 13.5px;
  font-weight: 500;
  color: var(--ink-soft);
  margin-bottom: 6px;
}
.sc-calc .sc-gate__row {
  display: flex;
  gap: 10px;
}
@media (max-width: 560px) {
  .sc-calc .sc-gate__row {
    flex-direction: column;
  }
}
.sc-calc .sc-gate__input {
  flex: 1;
  min-width: 0;
  height: 46px;
  padding: 0 14px;
  border: 1px solid var(--line-strong);
  border-radius: 11px;
  background: var(--bg);
  font: inherit;
  font-size: 16px;
  color: var(--ink);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.sc-calc .sc-gate__input:focus {
  outline: 0;
  border-color: var(--ink);
  box-shadow: 0 0 0 3px rgba(10, 10, 10, 0.07);
}
.sc-calc .sc-gate__btn {
  flex: none;
  height: 46px;
  padding: 0 20px;
  border: 0;
  border-radius: 11px;
  background: var(--ink);
  color: #fff;
  font: inherit;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.sc-calc .sc-gate__btn:hover:not(:disabled) {
  opacity: 0.88;
}
.sc-calc .sc-gate__btn:disabled {
  opacity: 0.55;
  cursor: default;
}
/* Visually hidden but still reachable by bots that parse the DOM. */
.sc-calc .sc-gate__hp {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}
.sc-calc .sc-gate__privacy,
.sc-calc .sc-gate__error {
  font-size: 12.5px;
  line-height: 1.5;
  margin: 10px 0 0;
}
.sc-calc .sc-gate__privacy {
  color: var(--faint);
}
.sc-calc .sc-gate__error {
  color: #b42318;
  font-weight: 500;
}
.sc-calc .sc-gate__preview {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 22px;
  border-radius: 14px;
  background: var(--bg-soft);
  border: 1px solid var(--line);
  filter: blur(2.5px);
  opacity: 0.75;
  user-select: none;
}
@media (max-width: 860px) {
  .sc-calc .sc-gate__preview {
    display: none;
  }
}
.sc-calc .sc-gate__prow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.sc-calc .sc-gate__pbar {
  height: 11px;
  border-radius: 999px;
  background: var(--line-strong);
}
.sc-calc .sc-gate__pval {
  font-size: 14px;
  font-weight: 600;
  color: var(--muted);
  flex: none;
}

/* ─── Detailed breakdown ─── */
.sc-calc .sc-detail,
.sc-calc .sc-save {
  padding-bottom: 48px;
}
.sc-calc .sc-detail__card {
  padding: 26px;
}
.sc-calc .sc-detail__inputs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(168px, 1fr));
  gap: 16px;
  padding-bottom: 24px;
  margin-bottom: 4px;
  border-bottom: 1px solid var(--line);
}
.sc-calc .sc-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14.5px;
}
.sc-calc .sc-table__caption {
  text-align: left;
  font-size: 13px;
  color: var(--faint);
  padding: 18px 0 10px;
}
.sc-calc .sc-table th,
.sc-calc .sc-table td {
  padding: 13px 10px;
  text-align: left;
  vertical-align: top;
  border-bottom: 1px solid var(--line);
}
.sc-calc .sc-table thead th {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  color: var(--faint);
  padding-bottom: 9px;
}
.sc-calc .sc-table__num {
  text-align: right;
}
.sc-calc .sc-table tbody th,
.sc-calc .sc-table tfoot th {
  font-weight: 500;
}
.sc-calc .sc-table__label {
  display: block;
}
.sc-calc .sc-table__flag {
  display: block;
  margin-top: 3px;
  font-size: 11.5px;
  font-weight: 500;
  color: var(--amber-ink);
}
.sc-calc .sc-table__cost {
  font-weight: 600;
}
.sc-calc .sc-table tfoot th,
.sc-calc .sc-table tfoot td {
  border-bottom: 0;
  border-top: 2px solid var(--ink);
  font-weight: 600;
  padding-top: 14px;
}
.sc-calc .sc-table tfoot .sc-table__flag {
  color: var(--muted);
  font-weight: 400;
}
.sc-calc .sc-detail__foot {
  font-size: 12.5px;
  line-height: 1.55;
  color: var(--faint);
  margin: 16px 0 0;
}
/* Tables are the one thing that must never force the page to scroll
   sideways; below this width the layout stacks instead. */
@media (max-width: 720px) {
  .sc-calc .sc-table thead {
    display: none;
  }
  .sc-calc .sc-table tr {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 2px 12px;
    padding: 14px 0;
    border-bottom: 1px solid var(--line);
  }
  .sc-calc .sc-table th,
  .sc-calc .sc-table td {
    border: 0;
    padding: 0;
  }
  .sc-calc .sc-table tbody th,
  .sc-calc .sc-table tfoot th {
    grid-column: 1;
  }
  .sc-calc .sc-table td {
    grid-column: 2;
    text-align: right;
    font-size: 13.5px;
    color: var(--muted);
  }
  .sc-calc .sc-table td.sc-table__cost {
    font-size: 16px;
    color: var(--ink);
  }
  .sc-calc .sc-table tfoot tr {
    border-bottom: 0;
    border-top: 2px solid var(--ink);
  }
}

/* ─── Savings scenario ─── */
.sc-calc .sc-save__card {
  padding: 26px;
}
.sc-calc .sc-save__slider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 10px 0 8px;
}
.sc-calc .sc-save__slider input[type='range'] {
  flex: 1;
  min-width: 0;
  accent-color: var(--green);
  height: 24px;
}
.sc-calc .sc-save__pct {
  flex: none;
  min-width: 62px;
  text-align: right;
  font-size: 26px;
  font-weight: 600;
  letter-spacing: -0.03em;
}
.sc-calc .sc-save__hint {
  font-size: 12.5px;
  line-height: 1.55;
  color: var(--faint);
  margin: 0;
  max-width: 620px;
}
.sc-calc .sc-levers {
  list-style: none;
  margin: 24px 0 0;
  padding: 0;
  border-top: 1px solid var(--line);
}
.sc-calc .sc-lever {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 20px;
  padding: 15px 0;
  border-bottom: 1px solid var(--line);
}
.sc-calc .sc-lever__label {
  font-size: 14.5px;
  font-weight: 500;
}
.sc-calc .sc-lever__rate {
  display: block;
  margin-top: 2px;
  font-size: 12.5px;
  font-weight: 400;
  color: var(--faint);
}
.sc-calc .sc-lever__val {
  flex: none;
  font-size: 17px;
  font-weight: 600;
  color: var(--green-ink);
}
.sc-calc .sc-outcome {
  display: grid;
  grid-template-columns: 1fr 1fr 1.4fr;
  gap: 24px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--line);
}
@media (max-width: 860px) {
  .sc-calc .sc-outcome {
    grid-template-columns: 1fr 1fr;
  }
  .sc-calc .sc-outcome__cta {
    grid-column: 1 / -1;
  }
}
@media (max-width: 520px) {
  .sc-calc .sc-outcome {
    grid-template-columns: 1fr;
  }
}
.sc-calc .sc-outcome__lbl {
  font-size: 12.5px;
  color: var(--muted);
  margin-bottom: 4px;
}
.sc-calc .sc-outcome__val {
  font-size: clamp(26px, 3.4vw, 34px);
  line-height: 1.05;
  letter-spacing: -0.035em;
  font-weight: 600;
}
.sc-calc .sc-outcome__val--green {
  color: var(--green-ink);
}
.sc-calc .sc-outcome__sub {
  font-size: 12.5px;
  color: var(--faint);
  margin-top: 5px;
}
.sc-calc .sc-outcome__pitch {
  font-size: 14px;
  line-height: 1.55;
  color: var(--muted);
  margin: 0 0 14px;
  text-wrap: pretty;
}
.sc-calc .sc-outcome__btns {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.sc-calc .sc-btn {
  display: inline-flex;
  align-items: center;
  height: 44px;
  padding: 0 18px;
  border-radius: 11px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.15s ease;
}
.sc-calc .sc-btn:hover {
  opacity: 0.88;
}
.sc-calc .sc-btn--primary {
  background: var(--ink);
  color: #fff;
}
.sc-calc .sc-btn--ghost {
  background: var(--bg);
  color: var(--ink);
  border: 1px solid var(--line-strong);
}

/* ─── Assumptions ─── */
.sc-calc .sc-notes {
  padding: 8px 0 64px;
}
.sc-calc .sc-notes__title {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin: 0 0 10px;
}
.sc-calc .sc-notes__body {
  font-size: 12.5px;
  line-height: 1.65;
  color: var(--faint);
  max-width: 860px;
  margin: 0 0 10px;
  text-wrap: pretty;
}

/* ─── Motion preference ─── */
@media (prefers-reduced-motion: reduce) {
  .sc-calc * {
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 5: Type-check and run the full suite**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm test`
Expected: PASS — 61 tests.

- [ ] **Step 6: Manually verify the gate flow in the browser**

With `npm run dev` running, visit `http://localhost:3000/surcharge-calculator`:
1. The gate shows with a blurred masked preview — no real figures in the DOM.
2. Submitting with no HubSpot vars configured shows "Something went wrong — please try again." and does **not** unlock. This is the correct behaviour before the vars are supplied.
3. To exercise the unlocked view, run `localStorage.setItem('qk_surcharge_unlocked','1')` in the console and reload. The breakdown, slider and CTAs render.

- [ ] **Step 7: Commit**

```bash
git add src/components/surcharge-calculator/surcharge-calculator.tsx src/components/surcharge-calculator/surcharge-calculator.css
git commit -m "Add lead gate, fee breakdown and Pay by Bank savings scenario"
```

---

### Task 7: Production build verification

**Files:** none created; this task verifies the whole feature builds and lands in the generated SEO files.

- [ ] **Step 1: Run the production build**

Run: `npm run build`
Expected: build succeeds. The `generate:seo` step runs before Vite.

- [ ] **Step 2: Confirm the route reached the sitemap**

Run: `grep -c 'surcharge-calculator' public/sitemap.xml`
Expected: `1` — the generator walks `src/routes/` so the new route is picked up with no manual edit.

- [ ] **Step 3: Commit the regenerated SEO files**

```bash
git add public/sitemap.xml public/robots.txt
git commit -m "Regenerate sitemap for surcharge calculator"
```

(If `git status` shows no change to these files, skip the commit.)

---

### Task 8: UX, visual, and accessibility verification with Playwright

**Files:** none created. Findings get fixed in `surcharge-calculator.tsx` / `.css` and committed.

**Interfaces:**
- Consumes: the running dev server and the finished page.
- Produces: screenshots in the scratchpad, plus fixes for anything found.

- [ ] **Step 1: Start the dev server if it isn't running**

Run: `npm run dev` (background). Confirm `http://localhost:3000/surcharge-calculator` responds.

- [ ] **Step 2: Check the locked desktop view**

Use the Playwright MCP tools: `browser_navigate` to `http://localhost:3000/surcharge-calculator`, `browser_resize` to 1440×900, then `browser_take_screenshot`.

Verify against this checklist and fix anything that fails:
- The `$84,000` headline is the dominant element on first paint.
- The dark result panel and the white input panel are equal height with no gap or overflow.
- The gate card's blurred preview sits beside the form without clipping.
- No horizontal page scroll: run `browser_evaluate` with `() => document.documentElement.scrollWidth <= window.innerWidth` and expect `true`.

- [ ] **Step 3: Check that typing updates the number and the URL**

`browser_fill` the "Monthly card turnover" field with `1000000`, then `browser_evaluate` `() => location.search` and confirm it contains `turnover=1000000`. Confirm the headline reads `$168,000` (1,000,000 × 12 × 1.4%).

- [ ] **Step 4: Verify the gate rejects and reports failure without unlocking**

`browser_fill` the email field with `test@example.com`, click "See my full breakdown", then `browser_wait_for` the text "Something went wrong". Confirm the breakdown table did **not** appear (`browser_evaluate` `() => !!document.querySelector('.sc-table')` → `false`). With no HubSpot vars set this is the expected path and proves the no-silent-unlock rule.

- [ ] **Step 5: Check the unlocked desktop view**

`browser_evaluate` `() => localStorage.setItem('qk_surcharge_unlocked','1')`, `browser_navigate` to reload, `browser_take_screenshot`.

Verify and fix:
- The table's five card rows plus the total row align on the right-hand numeric columns (tabular figures, no ragged decimals).
- The amber "no relief" flags appear on business credit, Amex and foreign only.
- The total row reads `$101,160` and the blended rate `1.69%` at the defaults.
- Dragging the steer slider updates both savings levers and the outcome figures. At 30% the saving reads `$22,710` and the new annual cost `$78,450`.
- Editing "Foreign cards" to `1.5` makes the foreign lever read "No additional saving" and the total saving stays positive.

- [ ] **Step 6: Check mobile at 390×844**

`browser_resize` to 390×844, screenshot both the locked and unlocked states.

Verify and fix:
- No horizontal scroll (same `scrollWidth` check).
- The table has collapsed to the stacked label/value layout — no cramped five-column grid.
- The slider is comfortably draggable and the percentage readout is visible.
- CTA buttons stack rather than overflow.

- [ ] **Step 7: Check keyboard and screen-reader basics**

- Tab from the top of the page: focus must reach every input, the submit button, the slider and both CTAs, with a visible focus ring on each.
- `browser_evaluate` `() => document.querySelectorAll('main input:not([aria-hidden]):not([id])').length` → `0` (every visible input has an id its label points at).
- Confirm the error message carries `role="alert"` so it is announced.
- Confirm the honeypot input is `aria-hidden` and not tab-reachable.

- [ ] **Step 8: Check the console is clean**

`browser_console_messages` — expect no errors and no React hydration warnings. Hydration warnings here would mean the locked/unlocked initial state diverged between server and client; fix by ensuring `useUnlocked` starts `false` and only unlocks in an effect.

- [ ] **Step 9: Commit any fixes**

```bash
git add -A src/components/surcharge-calculator
git commit -m "Polish surcharge calculator layout and accessibility"
```

- [ ] **Step 10: Open the PR**

```bash
git push -u origin feat/surcharge-calculator
gh pr create --title "Add card surcharge ban calculator with HubSpot lead gate" --body "$(cat <<'EOF'
## What

Adds `/surcharge-calculator`, a standalone lead-generating calculator for the 1 October 2026 RBA surcharge ban, as a companion to the forthcoming article.

- **Ungated quick estimate** — monthly card turnover x blended rate, showing the annual cost the business will absorb (the article's $6m at 1.4% = $84,000 example).
- **Email gate** — one field plus a honeypot, posting to a same-origin server function that forwards to the HubSpot Forms API with the visitor's turnover and rate attached. A failed forward never unlocks.
- **Gated breakdown** — annual fees per card type (debit, consumer credit, business credit, Amex, foreign), with editable rates for all but debit, flagging the three types that get no interchange relief.
- **Savings scenario** — a steering slider modelling volume moved to Pay by Bank at 0.5% + $0.30, plus foreign cards at Quidkey's 2% instead of a 5.5% all-in card rate.

Math lives in a pure, React-free module with hand-computed unit tests; inputs live in the URL so links are shareable.

## Merge blocker

`HUBSPOT_PORTAL_ID` and `HUBSPOT_FORM_GUID` in `wrangler.jsonc` are empty placeholders. The gate returns an error (and stays locked) until they are filled in from the HubSpot form's embed code.

## Testing

- `npm test` — 61 passing
- `npx tsc --noEmit` — clean
- `npm run build` — succeeds, route auto-added to the sitemap
- Playwright pass at 1440x900 and 390x844: no horizontal scroll, table collapses to a stacked layout on mobile, keyboard reachable with visible focus, clean console

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Self-Review

**1. Spec coverage.** Every spec section maps to a task: page & route → Task 5; state model incl. all eight params and the localStorage flag → Tasks 2, 6; ungated view incl. the salary comparator → Task 5; gate incl. honeypot and the never-unlock-on-failure rule → Task 6 (verified in Task 8 Step 4); gated breakdown with fixed mix and four editable rates → Task 6; PayTo scenario with both levers and clamped total → Tasks 1, 6; assumptions/disclaimer → Task 6; lead pipe incl. HubSpot fields, timeout, config → Task 3; tracking → Task 4; files list → Tasks 1–6; testing → per-task test steps; cache-control → Task 5 Step 5 (the existing default already covers it, so only test assertions were needed); non-goals → nothing in the plan implements them.

**2. Placeholder scan.** No TBD/TODO. Every code step contains complete code. The one intentionally empty value — the HubSpot vars — is called out as a merge blocker owned by Rabea, not a plan gap.

**3. Type consistency.** `SurchargeSearch` field names (`turnover`, `rate`, `aov`, `credit`, `business`, `amex`, `foreign`, `steer`) are identical in Tasks 2, 5 and 6. `computeSavings` returns `detailed`, `steeringSavings`, `foreignCardSavings`, `totalSavings`, `newAnnualCost`, `savingsPercent` in Task 1 and is consumed under those exact names in Task 6. `submitLead({ data })` returning `{ ok }` matches Task 3's `LeadResult`. `track({ name: 'surcharge_calculator_input', field })` uses the flat param shape the existing union requires (Task 4), and Task 5's `useTrackInput` calls it that way. Shared formatters `money`/`count`/`rateText` and `PercentField` are exported in Task 5 and reused in Task 6 — note `count` is exported but only used if a future row shows transaction counts; if it stays unused, delete it rather than leaving dead code.
