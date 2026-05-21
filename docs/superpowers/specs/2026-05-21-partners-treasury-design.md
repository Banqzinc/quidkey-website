# /partners — Treasury section design

**Date:** 2026-05-21
**Branch:** `feat/partners-treasury` (to be created)
**Status:** Approved by user, ready for implementation plan.

## Goal

Bring the homepage Treasury mockup into the `/partners` page so partners (PSPs, fintechs) can see the post-payment console they would ship to their merchants under their own brand. Quiet the surrounding chrome so the section feels native to the partner narrative rather than copy-pasted from the homepage.

## Why this fits /partners now

The Treasury mockup is the strongest visual asset on the site. Partners care most about what their merchants will actually see — the screenshot is concrete proof of the depth of the post-payment surface they would resell. Today the partners page describes this only as one of six capability cards ("Merchant console & ledger"). Promoting it to a full section, with partner-specific framing, lets us show rather than tell.

## Scope

In scope:

1. New `PartnerTreasury` section component reusing the existing `TreasuryMockup`.
2. Partner-specific section chrome (eyebrow / title / sub / wrapper) styled to match the rest of `/partners`.
3. Insertion into the `/partners` route between `PartnerUSFocus` and `PartnerOnboarding`.
4. Reframing of `PartnerCapabilities` card #06 to remove overlap with the new section.
5. Tracking event `partners_treasury_view` fired on mount, plumbed through the existing `track()` fan-out (GA + Clarity + LinkedIn + Snitcher).

Out of scope:

- Any changes to the homepage Treasury section.
- Mobile-specific redesign work (mobile inherits the homepage mockup behavior; we only restyle the wrapper, which uses partners.css responsive rules already in place).
- New nav anchor in the partner nav (recently trimmed to logo + anchor links; we don't add to it).

## Files touched

| File | Change |
|---|---|
| `src/components/partners/partner-treasury.tsx` | **New.** Wrapper section, lazy-loads `TreasuryMockup`, fires `partners_treasury_view` event on mount. |
| `src/components/homepage/treasury-mockup-skeleton.tsx` | **New.** Extracted skeleton component, reused by both homepage `products.tsx` and `partner-treasury.tsx`. |
| `src/components/homepage/treasury-mockup.tsx` | Add optional `eventName` prop (default `'homepage_treasury_view'`) so the partners variant can pass `'partners_treasury_view'`. |
| `src/components/sections/products.tsx` | Remove inline `TreasuryMockupSkeleton`, import the new shared one. |
| `src/components/partners/partners.css` | Add `.ptreasury` block (~60–90 lines): section padding, head layout, title/sub typography matching `.feat`/`.us`/`.onb`/`.arch`, mockup wrap. |
| `src/components/partners/partner-capabilities.tsx` | Reframe card #06 from "Merchant console & ledger" → "Audit-ready ledger" with tighter copy and tags. |
| `src/routes/partners.tsx` | Import and render `<PartnerTreasury />` between `<PartnerUSFocus />` and `<PartnerOnboarding />`. |

## Component architecture

### `PartnerTreasury`

```
<section className="ptreasury" id="partner-treasury">
  <div className="container">
    <div className="ptreasury__head">
      <span className="eyebrow">
        <span className="eyebrow__dot" /> PARTNER OFFERING · MERCHANT CONSOLE
      </span>
      <h2 className="ptreasury__title">The console behind your brand.</h2>
      <p className="ptreasury__sub">
        Merchants connect Stripe, Shopify, and bank feeds. You ship the
        post-payment surface — splits, FX, reserves, payouts — without
        building it.
      </p>
    </div>
    <div className="ptreasury__mockup-wrap">
      <Suspense fallback={<TreasuryMockupSkeleton />}>
        <TreasuryMockup eventName="partners_treasury_view" />
      </Suspense>
    </div>
  </div>
</section>
```

**Skeleton fallback:** Extract `TreasuryMockupSkeleton` from `sections/products.tsx` into a co-located module next to the mockup component (e.g., `src/components/homepage/treasury-mockup-skeleton.tsx`) and import it from both `products.tsx` and `partner-treasury.tsx`. The skeleton lives next to the thing it represents and only one source of truth exists. No duplication.

### `TreasuryMockup` prop addition

Change the existing default-exported `TreasuryMockup` to accept an optional `eventName` prop:

```ts
export default function TreasuryMockup({
  eventName = 'homepage_treasury_view',
}: { eventName?: string } = {}) {
  useEffect(() => {
    track({ name: eventName })
  }, [eventName])
  // …rest unchanged
}
```

This keeps backwards compatibility (homepage usage continues to fire `homepage_treasury_view` with no code change) while letting the partners variant override it.

### Tracking event

`partners_treasury_view` is added to the existing `track()` call. Per project preference, `track()` already fans out to GA + Clarity + LinkedIn + Snitcher, so no separate hookup is needed — the new event name flows through automatically.

## Visual treatment ("subtle")

The mockup itself is unchanged — same size, same content, same chrome dots, same activity table, same workflow animation. Only the section surrounding it changes:

| Aspect | Homepage version | Partner version |
|---|---|---|
| Eyebrow | "Programmable treasury" | "PARTNER OFFERING · MERCHANT CONSOLE" |
| Eyebrow style | `.section__eyebrow` (homepage component) | `.eyebrow` with `.eyebrow__dot` (matches `.feat`/`.us`/`.onb`/`.arch`) |
| Headline | `<h2>Beyond checkout: <span class="grad-text">Treasury</span></h2>` + BETA pill | `<h2>The console behind your brand.</h2>` — no gradient, no pill |
| Sub copy | 1 sentence + 6 mini feature bullets | 1 sentence, no bullet row |
| Title size | `.section__h` (homepage clamp) | partners' `clamp(36px, 4.5vw, 56px)` matching `.feat__title`/`.us__title`/`.onb__title`/`.arch__title` |
| Padding | homepage `.products` (~96px+) | partners' standard 88px |
| Background | homepage gradient via `.products` | `var(--bg)` (white) — sits cleanly between US (dark) and Onboarding (white) |
| Mockup wrap | `.products__mockup-wrap` (homepage) | `.ptreasury__mockup-wrap` (partners) — same outer card chrome but no gradient surround |

## Placement

In `routes/partners.tsx`, the new section sits between `PartnerUSFocus` and `PartnerOnboarding`:

```
PartnerHero
Logos
PartnerCapabilities
PartnerUSFocus
PartnerTreasury        ← NEW
PartnerOnboarding
PartnerArchitecture
PartnerCloser
```

Rationale: the US focus section is the "strategic depth" sales pitch. The treasury mockup is the "here's the depth you're reselling" proof. Onboarding then transitions to "and here's how you integrate." This lands as a natural pivot from value to mechanics.

Section `id="partner-treasury"` (not `id="treasury"`) — the homepage already owns `#treasury` and is reachable from anywhere via `/#treasury`. Keeping the partner section id distinct avoids any ambiguity if either page is later wired to a nav anchor.

## Capabilities card #06 reframe

Card #06 today reads:

> **06 · Merchant console & ledger** — Tools to send payment links, manage accounts, view transactions, and handle FX, splits, refunds, payouts, and reconciliation. Tags: `Ledger`, `FX`, `Splits`, `Recon`

With the Treasury section showing the merchant console UI directly, this card becomes a verbal restatement of the same idea. Reframe it to lean into the under-the-hood story the mockup doesn't fully tell:

> **06 · Audit-ready ledger** — Event log, reconciliation, and webhook stream for every move the console makes. Wire into your accounting, dispute, or risk stack. Tags: `Event log`, `Recon`, `Webhooks`

Treasury section owns the UI/UX story. Card 06 owns the data/audit story. No orphan in the 3-col grid (we keep 6 cards), no redundancy.

## CSS plan

Add a single `.ptreasury` block to `partners.css` after the `.us` block (so it sits in section order). Approximate structure:

```css
.partners-root .ptreasury {
  padding: 88px 0;
  background: var(--bg);
  border-bottom: 1px solid var(--line);
}
.partners-root .ptreasury__head {
  max-width: 700px;
  margin-bottom: 48px;
}
.partners-root .ptreasury__title {
  font-size: clamp(36px, 4.5vw, 56px);
  line-height: 1.05;
  letter-spacing: -0.025em;
  font-weight: 600;
  margin: 12px 0;
  max-width: 22ch;
  text-wrap: balance;
}
.partners-root .ptreasury__sub {
  font-size: 19px;
  line-height: 1.55;
  color: var(--muted);
  margin: 0;
  max-width: 60ch;
  text-wrap: pretty;
}
@media (max-width: 899px) {
  .partners-root .ptreasury__title {
    font-size: clamp(28px, 7.6vw, 40px);
    line-height: 1.1;
    letter-spacing: -0.02em;
    max-width: 100%;
  }
  .partners-root .ptreasury__sub { font-size: 16.5px; max-width: 100%; }
}
.partners-root .ptreasury__mockup-wrap {
  /* Match the homepage's mockup container chrome (rounded card, soft shadow)
     but without the gradient surround the homepage applies in .products. */
  border-radius: 18px;
  overflow: hidden;
}
```

Exact values may shift slightly during implementation to match neighboring sections precisely; the spec above sets the direction, not pixel-perfect values.

Add to `print` media query at the bottom of `partners.css`:

```css
.partners-root .ptreasury {
  padding: 24px 0;
  border-bottom: 1px solid #ccc;
}
```

## Branch & workflow

- **Branch name:** `feat/partners-treasury`
- **PR-first:** push branch, open PR via `gh pr create`. No direct push to `main` (project rule).
- **Verification:** `npm run dev`, visit `/partners`, screenshot mobile (390) + desktop (1440) to confirm visual rhythm matches the rest of the page and the mockup hasn't regressed on the homepage.
- **Tests:** No new unit tests — this is a presentational composition of existing components. The existing `lib/track.test.ts` already covers `track()` behavior; the new event name flows through that same function.

## Success criteria

1. `/partners` renders the Treasury section between US Focus and Onboarding.
2. The mockup is visually identical to the homepage mockup.
3. The section chrome (eyebrow, title, sub, padding, background) reads as native to the partners page — same rhythm as `.feat`/`.us`/`.onb`/`.arch`.
4. Capability card #06 has been reframed; no orphaned grid cell.
5. Homepage `/` continues to render its Treasury section identically with no regression and still fires `homepage_treasury_view`.
6. `/partners` mount fires `partners_treasury_view` once per session.
7. Mobile (390px) and desktop (1440px) screenshots look good.
8. PR opens via `gh pr create` against `main`.

## Open questions for implementation

None. Design is complete and approved.
