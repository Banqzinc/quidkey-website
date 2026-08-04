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
| `mix`      | Card mix %, CSV in card-type order        | 58,17,13,12 | each 0–100 |

`turnover` accepts up to ten digits ($9,999,999,999/month): enterprise merchants running over a billion a month are in scope, and a ceiling that rejects their real figure is worse than a wide one.

`mix` is one CSV param rather than five separate ones so shared links stay readable. A malformed value falls back to the whole default mix, never a partly-applied one.

Invalid, missing, or out-of-range values fall back to the default.

**Unlock state:** `localStorage["qk_surcharge_unlocked"] = "1"`, read after mount (SSR renders the locked view; no hydration mismatch — locked is the initial client state too, then a post-mount effect unlocks).

## Ungated view ("Quick estimate")

A tracked-caps typographic eyebrow ("SURCHARGE BAN / 1 OCTOBER 2026") sits above the headline — deliberately not a tinted pill with a leading dot, which is the one shape every generated landing page reaches for.

Inputs: `turnover`, `rate`. Live outputs as the user types:

- **Annual cost** = `turnover × 12 × rate` (headline, e.g. $84,000 at defaults)
- Monthly cost = annual / 12
- Comparator line derived from `annual / 88,400` (ABS median full-time salary, constant `ABS_MEDIAN_FULL_TIME_SALARY = 88_400` with source comment), phrased by `describeSalaryEquivalent()`: under 0.85 → "about N% of a median full-time salary"; 0.85–1.2 → "almost the cost of another full-time employee" (the article's own phrasing, because "about 1.0×" reads badly); above 1.2 → "about N.N×"; below 0.15 → omitted.

Below it, the gate: a blurred, non-interactive preview of the gated section with the email form overlaid.

## Gate

- Form: **email only** + hidden honeypot (`website` text input, visually hidden and `aria-hidden`, `tabIndex={-1}`, `autoComplete="off"`) + an **optional marketing-consent checkbox**.
- Submit button: "Open the advanced calculator". No emailed-PDF promise — the payoff is on-page; follow-up emails are a HubSpot workflow, not code.
- **Marketing consent is unticked by default and never required.** The breakdown unlocks whether or not it is ticked, and the boolean rides along to HubSpot as a `marketing_consent` field. Rationale: the Australian Spam Act would accept a conspicuous notice as inferred consent, but consent bundled into a form a visitor must submit to see their own result is not freely given under GDPR, so gating the unlock on the tick would be invalid for any EU/UK visitor. Microcopy states plainly that the box is optional.
- Follow-up option (not in v1): swapping the flat `marketing_consent` field for HubSpot's native `legalConsentOptions` gives a timestamped consent record, but needs a subscription type ID from the HubSpot account.
- Success → set localStorage flag, reveal gated content, `track surcharge_lead_submit {outcome: 'success'}`.
- Failure → inline error "Something went wrong — please try again.", stay locked, `track {outcome: 'error'}`. A failed HubSpot forward must **not** unlock (no silent lead loss).

## Gated view ("Advanced calculator")

Named an **advanced calculator**, not a "breakdown". A breakdown implies its total equals the quick estimate above, and it deliberately does not: the quick estimate applies one blended rate to all volume, while this builds up per card type from figures the visitor sets. Those are two independent models, and forcing them to agree would fight the visitor's own input. A footnote states the difference plainly.

### The table is the input

Every rate and every share is edited **in the table row it belongs to** — there is no duplicate row of rate fields above it. Only average order value sits outside the table, since it isn't per-card-type.

| Type                     | Default share | Default rate | Fixed/txn |
| ------------------------ | ------------- | ------------ | --------- |
| Domestic consumer credit | 58%           | 1.4%         | $0.30     |
| Business credit          | 17%           | 1.8%         | $0.30     |
| Amex                     | 13%           | 2.2%         | —         |
| Foreign-issued           | 12%           | 5.5% all-in  | —         |

Every share and every rate is editable — no locked cells.

**Domestic debit is excluded from the model.** It is already the cheapest card to accept, so it diluted the table without changing the argument. The four remaining shares are the old 35/10/8/7 rebalanced to total 100%. Steerable volume is now consumer credit + business credit.

No per-row regulatory annotations (no "no interchange cut", "no cap until 2027"): the article already covers which card types get no relief, and repeating it in the table crowded the numbers.

Math (annual): `vol_i = turnover × 12 × share_i`; `orders_i = vol_i / aov`; `line_i = vol_i × rate_i + orders_i × fixed_i`. Total = `Σ line_i`; blended rate = total ÷ allocated volume.

**Shares are not forced to 100%.** Volume follows the shares exactly as entered, so an under-allocated mix produces a smaller total rather than being silently normalised. The total row shows the share sum in amber when it isn't 100%, and a note states how much of the turnover is actually covered. Normalising behind the visitor's back would make the numbers untraceable to what they typed.

### PayTo savings scenario

One slider (`steer`, default 30%) and **one figure**: the estimated annual saving, with a supporting line giving the percentage and the before/after cost. The earlier per-lever breakdown (a row each for steering and foreign cards) was cut — it read as clutter, and its "No saving" / "No additional saving" states looked broken at low inputs. The savings math still combines both levers and still clamps each to zero independently.

Primary CTA is **Book a demo**, with Get started secondary.

### Enterprise hand-off above $10m/month

When monthly card turnover exceeds **$10,000,000**, the scenario is replaced by a sales hand-off: "We typically cut card costs by **over 70%**", copy explaining that at that volume pricing and routing are built around the merchant's actual mix rather than a rate card, and Book a demo / Talk to sales. No slider, no computed saving.

The reasoning: past that volume a self-serve percentage isn't a number the page can stand behind, and the lead is worth a conversation. Constants `ENTERPRISE_MONTHLY_TURNOVER` and `ENTERPRISE_SAVINGS_CLAIM_PERCENT` hold the threshold and the claim.

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
- Wiring the footer newsletter (the new pipe is reusable for it later)

## Delivery

Feature branch `feat/surcharge-calculator` → PR to `main` (PRs required; branch protection only warns — never push direct).
