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

export type CardTypeId = 'credit' | 'business' | 'amex' | 'foreign'

export const MONTHS_PER_YEAR = 12

// ABS Average Weekly Earnings — median full-time adult ordinary time earnings,
// rounded. Used only for the "that's ~N salaries" comparator the article makes.
export const ABS_MEDIAN_FULL_TIME_SALARY = 88_400

export type CardMix = Record<CardTypeId, number>

// Starting share of card volume by value, as fractions — editable in the table,
// so this is only what a visitor sees before adjusting it. These are the four
// card types the surcharge ban actually makes expensive, rebalanced to total
// 100% (they were 35/10/8/7 of a mix that also carried 40% domestic debit).
export const DEFAULT_CARD_MIX: CardMix = {
  credit: 0.58,
  business: 0.17,
  amex: 0.13,
  foreign: 0.12,
}

export const CARD_TYPE_ORDER: CardTypeId[] = ['credit', 'business', 'amex', 'foreign']

export const CARD_LABELS: Record<CardTypeId, string> = {
  credit: 'Domestic consumer credit',
  business: 'Business credit',
  amex: 'American Express',
  foreign: 'Foreign-issued cards',
}

// Default per-transaction component: the fixed side of a card fee, not a
// Quidkey charge. Stripe's standard Australian pricing is 1.7% + $0.30, which
// is where the rate defaults come from too. Editable, and applied to domestic
// credit and business credit only: Amex and foreign-issued cards are modelled
// as percentage-only.
export const DEFAULT_FIXED_PER_TRANSACTION = 0.3

// Stripe's published standard Australian pricing for domestic cards. Used as
// the page's default because most AU merchants recognise it from their own
// statement. Attribution is only shown while the inputs still match these
// numbers, so an edited rate is never labelled as Stripe's.
export const STRIPE_AU_STANDARD = {
  ratePercent: 1.7,
  fixedPerTransaction: 0.3,
}

// Quidkey Pay by Bank (PayTo) pricing.
export const PAYTO_PERCENT = 0.5
export const PAYTO_FIXED = 0.3

// Quidkey's international card rate, replacing a card acquirer's all-in
// foreign rate (card % + FX %).
export const QUIDKEY_FOREIGN_PERCENT = 2.0

// Card types that can be steered onto Pay by Bank. Amex and foreign-issued
// cards are excluded: a domestic bank rail is not a substitute for them.
const STEERABLE: CardTypeId[] = ['credit', 'business']

const percent = (n: number) => n / 100

// Average order value only ever divides, so floor it to 1 to keep fixed-fee
// maths finite when a visitor clears the field.
const flooredAov = (aov: number) => (Number.isFinite(aov) && aov > 0 ? aov : 1)

export type QuickInput = {
  monthlyTurnover: number
  ratePercent: number
  averageOrderValue: number
  fixedPerTransaction: number
}

export type QuickResult = {
  annualVolume: number
  annualTransactions: number
  annualCost: number
  monthlyCost: number
  /** Annual cost expressed as a multiple of a median full-time salary. */
  salaryEquivalent: number
  /** Same volume priced at Quidkey Pay by Bank. */
  payByBankCost: number
  /**
   * Difference if ALL of this volume moved to Pay by Bank. A ceiling, not a
   * forecast, so the UI must label it "up to" — no merchant moves everything.
   */
  maxAnnualSaving: number
}

export function computeQuick({
  monthlyTurnover,
  ratePercent,
  averageOrderValue,
  fixedPerTransaction,
}: QuickInput): QuickResult {
  const annualVolume = monthlyTurnover * MONTHS_PER_YEAR
  const annualTransactions = annualVolume / flooredAov(averageOrderValue)
  const annualCost = annualVolume * percent(ratePercent) + annualTransactions * fixedPerTransaction
  const payByBankCost =
    annualVolume * percent(PAYTO_PERCENT) + annualTransactions * PAYTO_FIXED

  return {
    annualVolume,
    annualTransactions,
    annualCost,
    monthlyCost: annualCost / MONTHS_PER_YEAR,
    salaryEquivalent: annualCost / ABS_MEDIAN_FULL_TIME_SALARY,
    payByBankCost,
    maxAnnualSaving: Math.max(0, annualCost - payByBankCost),
  }
}

// The article's framing: an annual card-fee bill of roughly one median salary
// is "almost the cost of another full-time employee". Stating a bare multiple
// reads badly right around 1 ("about 1.0x a salary"), so describe it instead.
export function describeSalaryEquivalent(multiple: number): string | null {
  if (!Number.isFinite(multiple) || multiple < 0.15) return null
  if (multiple < 0.85) {
    return `That's about ${Math.round(multiple * 100)}% of a median full-time salary in Australia.`
  }
  if (multiple <= 1.2) {
    return "That's almost the cost of another full-time employee on Australia's median salary, without getting the extra help."
  }
  const shown =
    multiple < 10 ? multiple.toFixed(1) : Math.round(multiple).toLocaleString('en-AU')
  return `That's about ${shown}× a median full-time salary in Australia, without getting the extra help.`
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
  /** Share of card volume by value per card type, as fractions. */
  mix: CardMix
  /** Per-transaction fee on domestic credit and business credit. */
  fixedPerTransaction: number
  creditPercent: number
  businessPercent: number
  amexPercent: number
  foreignPercent: number
}

export type DetailedResult = {
  lines: CardLine[]
  /** Volume actually allocated across the mix — less than turnover if the
   *  shares don't add to 100%, which the UI surfaces rather than hides. */
  annualVolume: number
  annualCost: number
  effectiveRatePercent: number
  /** Sum of the entered shares, as a percentage. 100 when fully allocated. */
  mixTotalPercent: number
}

function ratesFor(input: DetailedInput): Record<CardTypeId, number> {
  return {
    credit: input.creditPercent,
    business: input.businessPercent,
    amex: input.amexPercent,
    foreign: input.foreignPercent,
  }
}

function fixedFor(input: DetailedInput): Record<CardTypeId, number> {
  return {
    credit: input.fixedPerTransaction,
    business: input.fixedPerTransaction,
    amex: 0,
    foreign: 0,
  }
}

export function computeDetailed(input: DetailedInput): DetailedResult {
  const turnoverVolume = input.monthlyTurnover * MONTHS_PER_YEAR
  const aov = flooredAov(input.averageOrderValue)
  const rates = ratesFor(input)
  const fixed = fixedFor(input)

  const lines: CardLine[] = CARD_TYPE_ORDER.map((id) => {
    const mixShare = input.mix[id] ?? 0
    const lineVolume = turnoverVolume * mixShare
    const transactions = lineVolume / aov
    const fixedPerTransaction = fixed[id]
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
  // Volume follows the shares as entered: under-allocating shows up as a
  // smaller total rather than being silently scaled back to 100%.
  const annualVolume = lines.reduce((sum, line) => sum + line.annualVolume, 0)
  const mixTotalPercent = lines.reduce((sum, line) => sum + line.mixShare, 0) * 100

  return {
    lines,
    annualVolume,
    annualCost,
    effectiveRatePercent: annualVolume > 0 ? (annualCost / annualVolume) * 100 : 0,
    mixTotalPercent,
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
