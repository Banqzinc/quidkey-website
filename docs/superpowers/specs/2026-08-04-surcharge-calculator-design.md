# Surcharge Ban Calculator — Design

**Date:** 2026-08-04
**Status:** Awaiting spec review
**Owner:** Rabea Bader

## Goal

A standalone, lead-generating calculator page companion to the blog article *"On 1 October, the card fee stops being your customer's problem and becomes yours"* (RBA surcharge ban, effective 1 October 2026, Australia). Visitors estimate what absorbing card fees will cost them; a partial email gate captures leads into HubSpot with the visitor's own numbers attached.

## Context

- Site is TanStack Start v1.132 + React 19, file-based routes under `src/routes/`, deployed as a Cloudflare Worker.
- The existing Shopify calculator (`/calculator`) is the template: pure tested math module, URL-as-state, per-page scoped CSS, no form library.
- The site has **no lead-capture infrastructure today** (footer newsletter is a stub). This feature builds the first pipe: same-origin server function → HubSpot Forms API. Same-origin matters: the prod CSP lives in Cloudflare and silently blocks new client-side third-party fetches.
- AU-only, AUD. No region switcher.

## Page & route

- Route `/surcharge-calculator`, file `src/routes/surcharge-calculator.tsx`.
- Shell (copy `/calculator`): `AudienceProvider` → `div.hp` → `HomepageNav` → `main#main` (page root class `.sc-calc`) → `HomepageFooter`.
- SEO via `buildSeo({ title, description, keywords, path })`; title ≈ "Card Surcharge Ban Cost Calculator | Quidkey". Sitemap picks the route up automatically at build.
- CSS in `src/components/surcharge-calculator/surcharge-calculator.css`, every rule scoped under `.sc-calc`, imported after the homepage CSS chain (`base → headings → section-padding → mobile → overrides → page`).
- Cache-Control: mirror whatever `/calculator` gets in `src/lib/redirects.ts` / `resolveCacheControl()`, with a matching case in `redirects.test.ts`.

## State model

All calculator inputs live in the URL query string (shareable links), validated with a hand-rolled parser (no zod, matching `calculator-params.ts`), defaults stripped via `stripSearchParams(DEFAULTS)`, written back with `navigate({ replace: true })`. No `useState` for inputs.

| Param      | Meaning                                   | Default | Accepted range |
| ---------- | ----------------------------------------- | ------- | -------------- |
| `turnover` | Monthly card turnover, AUD                | 500000  | 0–100,000,000  |
| `rate`     | Average card fee rate, %                  | 1.4     | 0–10           |
| `aov`      | Average order value, AUD                  | 100     | 1–1,000,000    |
| `credit`   | Domestic consumer credit rate, %          | 1.4     | 0–10           |
| `business` | Business credit rate, %                   | 1.8     | 0–10           |
| `amex`     | Amex rate, %                              | 2.2     | 0–10           |
| `foreign`  | Foreign-issued card all-in rate, %        | 5.5     | 0–15           |
| `steer`    | Share of domestic volume steered to PayTo | 30      | 0–100          |

Invalid, missing, or out-of-range values fall back to the default.

**Unlock state:** `localStorage["qk_surcharge_unlocked"] = "1"`, read after mount (SSR renders the locked view; no hydration mismatch — locked is the initial client state too, then a post-mount effect unlocks).

## Ungated view ("Quick estimate")

Inputs: `turnover`, `rate`. Live outputs as the user types:

- **Annual cost** = `turnover × 12 × rate` (headline, e.g. $84,000 at defaults)
- Monthly cost = annual / 12
- Comparator line: `annual / 88,400` (ABS median full-time salary, constant `ABS_MEDIAN_FULL_TIME_SALARY = 88_400` with source comment) → "≈ 0.9 full-time salaries", one decimal.

Below it, the gate: a blurred, non-interactive preview of the gated section with the email form overlaid.

## Gate

- Form: **email only** + hidden honeypot (`website` text input, visually hidden and `aria-hidden`, `tabIndex={-1}`, `autoComplete="off"`).
- Submit button: "See my full breakdown". Microcopy: "We'll also send occasional Quidkey updates. Unsubscribe anytime." No emailed-PDF promise — the payoff is on-page; follow-up emails are a HubSpot workflow, not code.
- Success → set localStorage flag, reveal gated content, `track surcharge_lead_submit {outcome: 'success'}`.
- Failure → inline error "Something went wrong — please try again.", stay locked, `track {outcome: 'error'}`. A failed HubSpot forward must **not** unlock (no silent lead loss).

## Gated view ("Detailed estimate")

### Cost breakdown by card type — direct computation, no scaling

Card mix by value is a **fixed constant** in v1 (shown in the assumptions copy, not editable):

| Type                     | Mix | Rate default | Rate editable? | Fixed/txn |
| ------------------------ | --- | ------------ | -------------- | --------- |
| Domestic debit           | 40% | 0.5%         | **No**         | $0.30     |
| Domestic consumer credit | 35% | 1.4%         | Yes            | $0.30     |
| Business credit          | 10% | 1.8%         | Yes            | $0.30     |
| Amex                     | 8%  | 2.2%         | Yes            | —         |
| Foreign-issued           | 7%  | 5.5% all-in  | Yes            | —         |

Foreign 5.5% is presented as "3.5% card + 2% FX" in helper text. Editable fields edit the % component only; the $0.30 fixed components are constants.

Math (annual): `vol_i = turnover × 12 × mix_i`; `orders_i = vol_i / aov`; `line_i = vol_i × rate_i + orders_i × fixed_i`. Detailed total = `Σ line_i`; effective blended rate = total ÷ annual volume.

The table shows per-type share, rate, and annual cost, with callouts on business credit and Amex (no interchange relief on 1 Oct) and foreign cards (no cap until 1 April 2027). The detailed total is labeled **"Detailed estimate"** and may legitimately differ from the quick estimate above — both stay visible, clearly labeled as two models (user's blended rate vs. per-type build-up).

### PayTo savings scenario

Slider `steer` (default 30%): share of **domestic** card volume (debit + consumer credit + business credit) steered to Pay by Bank.

- `steeredVol = steer × (vol_debit + vol_credit + vol_business)`
- `currentSteeredCost = steer × (line_debit + line_credit + line_business)`
- `payToCost = steeredVol × 0.5% + (steeredVol / aov) × $0.30` (Quidkey PayTo: **0.5% + $0.30**)
- `steeringSavings = currentSteeredCost − payToCost`
- `foreignSavings = line_foreign − vol_foreign × 2.0%` (Quidkey international card rate: **2% flat**)
- `totalSavings = max(0, steeringSavings) + max(0, foreignSavings)` — a component can be ≤ 0 (e.g. a user enters a foreign rate below 2%); the math module returns the raw per-component values *and* this clamped total. New annual cost = detailed total − totalSavings; savings also shown as %.

The two savings levers render as separate labeled lines (steering + international processing) for transparency; a non-positive component displays as "no additional saving". All displayed totals use the clamped `totalSavings`, so the numbers on screen always reconcile.

CTAs after the scenario: **Book a demo** (`DEMO_BOOKING_URL`) and **Get started** (`MERCHANTS_SIGNUP_URL`) from `src/lib/urls.ts`.

### Assumptions & disclaimer

Estimates-only block modeled on the Shopify calculator's: lists the card mix, all rate defaults, PayTo 0.5% + $0.30, Quidkey foreign 2%, and cites the RBA Conclusions Paper (March 2026) for the 1 Oct changes. "General information, not financial or legal advice."

## Lead pipe

`src/lib/submit-lead.ts` — `createServerFn({ method: 'POST' })`.

- **Input:** `{ email, hp, turnover, rate }`.
- **Validation** (pure functions, exported, unit-tested): email trimmed, length ≤ 254, matches `/^\S+@\S+\.\S+$/`. Honeypot `hp` must be empty; if filled, return `{ ok: true }` **without forwarding** (silent bot drop).
- **Forward:** `POST https://api.hsforms.com/submissions/v3/integration/submit/{PORTAL_ID}/{FORM_GUID}` with fields `email`, `monthly_card_turnover`, `average_card_fee_rate`, plus `context.pageUri`/`pageName`. 5-second timeout.
- **Response:** `{ ok: true }` or `{ ok: false, error: 'invalid_email' | 'server' }`. Any HubSpot non-2xx → `'server'`.
- **Config:** `HUBSPOT_PORTAL_ID`, `HUBSPOT_FORM_GUID` as Worker vars in `wrangler.jsonc` (not secrets — they're public in any embed snippet), `.dev.vars` for local dev. If unset, the server fn returns `'server'` — so the vars must be wired before merge.

**Manual prerequisite (Rabea):** create a HubSpot form "Surcharge calculator leads" with an email field plus `monthly_card_turnover` and `average_card_fee_rate` properties, and provide the portal ID + form GUID.

## Tracking

New variants in the `HomepageEvent` union (`src/lib/track.ts`), fanned out by the existing consent-gated `track()` (GA + Clarity + LinkedIn + Snitcher):

- `{ name: 'surcharge_calculator_view' }` — once on mount (ref-guarded, as `/calculator` does)
- `{ name: 'surcharge_calculator_input', params: { field } }` — debounced 800 ms per field
- `{ name: 'surcharge_lead_submit', params: { outcome: 'success' | 'error' } }`

## Files

```
src/routes/surcharge-calculator.tsx            route: SEO head, search validation, shell, view event
src/components/surcharge-calculator/
  surcharge-calculator.tsx                     all UI (locked + unlocked states, form)
  surcharge-fees.ts                            pure math + rate/mix constants (React-free)
  surcharge-fees.test.ts                       hand-computed cases
  surcharge-params.ts                          URL param parse/defaults/strip
  surcharge-params.test.ts
  surcharge-calculator.css                     scoped under .sc-calc
src/lib/submit-lead.ts                         server fn + pure validation
src/lib/submit-lead.test.ts                    validation matrix, honeypot behaviour
src/lib/track.ts                               (edit) new event variants
wrangler.jsonc                                 (edit) HubSpot vars
src/lib/redirects.test.ts                      (edit) cache header case for the new route
```

## Testing

- `surcharge-fees.test.ts`: defaults ($500k, 1.4% → $84,000 quick estimate; detailed total; 30% steer scenario) with hand-computed expected values; AOV floor of 1; zero turnover; foreign rate below 2% producing negative `foreignSavings`.
- `surcharge-params.test.ts`: defaults, invalid/out-of-range fallback, default stripping.
- `submit-lead.test.ts`: email validation matrix, honeypot short-circuit (pure parts only; the HTTP forward is not unit-tested).
- Follow the repo pattern: math stays pure and React-free; the component only formats.

## Non-goals (v1)

- Publishing the article to the blog (separate task; the article links here once live)
- Turnstile (upgrade path if spam appears; requires a Cloudflare CSP edit, so it's a deliberate follow-up)
- Transactional/result emails (HubSpot workflow handles follow-up)
- Region switcher / non-AU currencies
- Editable card mix (fixed constants v1)
- Wiring the footer newsletter (the new pipe is reusable for it later)

## Delivery

Feature branch `feat/surcharge-calculator` → PR to `main` (PRs required; branch protection only warns — never push direct).
