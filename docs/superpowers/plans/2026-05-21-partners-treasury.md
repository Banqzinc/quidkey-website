# /partners Treasury Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Treasury section to `/partners` that reuses the homepage Treasury mockup but is framed for partners ("the console behind your brand") with quieter section chrome, and reframe the now-redundant Capabilities card #06.

**Architecture:** New `PartnerTreasury` component lives in `src/components/partners/`, lazy-loads the existing `TreasuryMockup`, fires a new `partners_treasury_view` event via the shared `track()` fan-out. Visual chrome (eyebrow, title, padding, background) matches the rest of the partners page rather than the homepage. The mockup itself is untouched. The shared skeleton component is extracted so both the homepage `Products` section and the new partner section use the same source.

**Tech Stack:** React 19, TanStack Router, Vite, Vitest. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-05-21-partners-treasury-design.md`

**Branch:** `feat/partners-treasury` (already created and active; the spec is the first commit on it).

---

## File Structure

| File | Status | Responsibility |
|---|---|---|
| `src/components/homepage/treasury-mockup-skeleton.tsx` | NEW | Shared loading-state skeleton matching the `.tm2` chrome. Imported by both homepage and partners. |
| `src/components/homepage/treasury-mockup.tsx` | MODIFY | Add optional `eventName` prop (default `'homepage_treasury_view'`). |
| `src/components/sections/products.tsx` | MODIFY | Remove inline `TreasuryMockupSkeleton`, import the shared one. |
| `src/components/partners/partner-treasury.tsx` | NEW | Partner-framed Treasury section: eyebrow + headline + sub + lazy mockup. |
| `src/components/partners/partners.css` | MODIFY | Add `.ptreasury` block matching `.feat`/`.us`/`.onb`/`.arch` visual rhythm. |
| `src/components/partners/partner-capabilities.tsx` | MODIFY | Reframe card #06 from "Merchant console & ledger" → "Audit-ready ledger". |
| `src/routes/partners.tsx` | MODIFY | Import and render `<PartnerTreasury />` between `<PartnerUSFocus />` and `<PartnerOnboarding />`. |

---

## Task 1: Extract `TreasuryMockupSkeleton` into a shared module

**Files:**
- Create: `src/components/homepage/treasury-mockup-skeleton.tsx`
- Modify: `src/components/sections/products.tsx` (remove inline `TreasuryMockupSkeleton`, import from new file)

- [ ] **Step 1: Create the shared skeleton component**

Create `src/components/homepage/treasury-mockup-skeleton.tsx` with:

```tsx
// Loading-state skeleton for the lazy-loaded Treasury mockup. Shared by
// homepage `Products` section and `PartnerTreasury` so both pages render
// the same placeholder chrome while the mockup chunk loads.

export function TreasuryMockupSkeleton() {
  return (
    <div className="tm2 tm2--loading" aria-busy="true">
      <div className="tm2__chrome">
        <div className="tm2__chrome-l">
          <span className="tm2__chrome-dot" />
          <span className="tm2__chrome-dot" />
          <span className="tm2__chrome-dot" />
        </div>
        <div className="tm2__chrome-path">treasury · acme studios</div>
      </div>
      <div className="tm2__body" />
    </div>
  )
}
```

- [ ] **Step 2: Update `products.tsx` to import the shared skeleton**

In `src/components/sections/products.tsx`:

1. Remove the local `TreasuryMockupSkeleton` function (lines ~133-147, the entire `function TreasuryMockupSkeleton()` block).
2. Add an import after the existing imports near the top of the file:

```tsx
import { TreasuryMockupSkeleton } from '@/components/homepage/treasury-mockup-skeleton'
```

The `<Suspense fallback={<TreasuryMockupSkeleton />}>` usage stays as-is.

- [ ] **Step 3: Verify build still passes**

Run: `npm run build`
Expected: build succeeds (no TS errors, no missing imports).

If you want a faster smoke check before the full build, you can also run `npm run dev` and visit `http://localhost:3000/` — the homepage Treasury section should render exactly as before.

- [ ] **Step 4: Verify existing tests still pass**

Run: `npm test`
Expected: all existing tests pass. No new tests added in this task.

- [ ] **Step 5: Commit**

```bash
git add src/components/homepage/treasury-mockup-skeleton.tsx src/components/sections/products.tsx
git commit -m "$(cat <<'EOF'
Extract TreasuryMockupSkeleton into shared module

Pulls the lazy-load placeholder out of sections/products.tsx so the
upcoming PartnerTreasury section can reuse it. No behavior change.
EOF
)"
```

---

## Task 2: Add `eventName` prop to `TreasuryMockup`

**Files:**
- Modify: `src/components/homepage/treasury-mockup.tsx`

- [ ] **Step 1: Add the optional prop**

In `src/components/homepage/treasury-mockup.tsx`, change the `export default function TreasuryMockup()` signature and the `useEffect` body. Replace:

```tsx
export default function TreasuryMockup() {
  useEffect(() => {
    track({ name: 'homepage_treasury_view' })
  }, [])
```

with:

```tsx
export default function TreasuryMockup({
  eventName = 'homepage_treasury_view',
}: { eventName?: string } = {}) {
  useEffect(() => {
    track({ name: eventName })
  }, [eventName])
```

Everything else in the file (the icon constants, `TmAccountCard`, `TmActivity`, `TmRule`, the JSX body) stays the same.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build succeeds. The default-parameter form keeps the existing homepage call site (`<TreasuryMockup />`) working unchanged.

- [ ] **Step 3: Verify homepage still fires `homepage_treasury_view`**

Run: `npm run dev`, open `http://localhost:3000/`, open the browser console with Network tab.
Expected: scroll to the Treasury section; `homepage_treasury_view` should be sent via the `track()` fan-out as before. (You can also grep `window.dataLayer` if you don't want to inspect outbound network calls.)

If you prefer a unit test over manual verification, see Task 2.5 below. Otherwise skip to commit.

- [ ] **Step 4: Commit**

```bash
git add src/components/homepage/treasury-mockup.tsx
git commit -m "$(cat <<'EOF'
Make TreasuryMockup event name overridable

Adds optional eventName prop so the upcoming partner variant can fire
partners_treasury_view through the same component without duplicating
the mockup itself. Homepage default behavior unchanged.
EOF
)"
```

---

## Task 3: Add `.ptreasury` CSS block to `partners.css`

**Files:**
- Modify: `src/components/partners/partners.css` (insert new block after the `.us` block, before `.onb`)

- [ ] **Step 1: Insert the new section block**

Open `src/components/partners/partners.css`. Find the closing comment of the US focus block (the line `   .partners-root .us .eyebrow { color: #555; }` is at the very bottom of the file in the print media query; the section-level `.us` rules end around line 285 with `.partners-root .us__card-foot { ... }` block). Insert this new block **after line 285** (after the `.us__card-foot` rule) and **before the `/* ─── Onboarding two-up (API vs Portal) ──── */` comment**:

```css
/* ─── Partner Treasury (merchant console mockup) ─────────────────
   Lives between US focus (dark) and Onboarding (white). Reuses the
   homepage `.tm2` mockup component verbatim — only the surrounding
   section chrome is partner-specific. */
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
  border-radius: 18px;
  overflow: hidden;
}
```

- [ ] **Step 2: Add the print rule**

In the same file, scroll to the bottom `@media print {` block (around line 725). Inside that block, add `.partners-root .ptreasury` to the existing list of selectors that get reduced padding:

Replace:

```css
  .partners-root .feat,
  .partners-root .onb,
  .partners-root .arch,
  .partners-root .closer,
  .partners-root .us {
    padding: 24px 0;
    border-bottom: 1px solid #ccc;
  }
```

with:

```css
  .partners-root .feat,
  .partners-root .ptreasury,
  .partners-root .onb,
  .partners-root .arch,
  .partners-root .closer,
  .partners-root .us {
    padding: 24px 0;
    border-bottom: 1px solid #ccc;
  }
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: build succeeds; no CSS errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/partners/partners.css
git commit -m "$(cat <<'EOF'
Add .ptreasury section styles for /partners

Section padding, head layout, and title/sub typography matching the
existing .feat/.us/.onb/.arch rhythm. The mockup wrap keeps the same
rounded card chrome as the homepage but without the gradient surround.
EOF
)"
```

---

## Task 4: Create `PartnerTreasury` component

**Files:**
- Create: `src/components/partners/partner-treasury.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/partners/partner-treasury.tsx` with:

```tsx
// Partner-framed Treasury section. Reuses the homepage TreasuryMockup
// verbatim — only the surrounding chrome (eyebrow, headline, sub, padding,
// background) is partner-specific. Visual rhythm matches PartnerCapabilities,
// PartnerUSFocus, PartnerOnboarding, PartnerArchitecture.
//
// Lazy-imports the mockup so the chunk only loads when this section enters
// the page. Fires `partners_treasury_view` once on mount via the shared
// track() fan-out (GA + Clarity + LinkedIn + Snitcher).

import { Suspense, lazy } from 'react'

import { TreasuryMockupSkeleton } from '@/components/homepage/treasury-mockup-skeleton'

const TreasuryMockup = lazy(() => import('@/components/homepage/treasury-mockup'))

export function PartnerTreasury() {
  return (
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
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run build`
Expected: build succeeds. Note that the component is created but not yet rendered anywhere; the build will tree-shake it out for now.

- [ ] **Step 3: Commit**

```bash
git add src/components/partners/partner-treasury.tsx
git commit -m "$(cat <<'EOF'
Add PartnerTreasury section component

New section that lazy-loads the homepage Treasury mockup with partner-
framed chrome: 'The console behind your brand.' Lives next to the other
partner sections and uses partners.css visual tokens. Fires
partners_treasury_view via the shared track() fan-out on mount.
EOF
)"
```

---

## Task 5: Render `PartnerTreasury` in the `/partners` route

**Files:**
- Modify: `src/routes/partners.tsx`

- [ ] **Step 1: Add the import**

In `src/routes/partners.tsx`, add an import line in the imports block, alphabetically with the other partner imports. After the line:

```tsx
import { PartnerOnboarding } from '@/components/partners/partner-onboarding'
```

add:

```tsx
import { PartnerTreasury } from '@/components/partners/partner-treasury'
```

- [ ] **Step 2: Insert into the section list**

In the JSX inside `PartnersPageContent()`, the `<main>` body currently looks like:

```tsx
<main id="main">
  <PartnerHero />
  <Logos />
  <PartnerCapabilities />
  <PartnerUSFocus />
  <PartnerOnboarding />
  <PartnerArchitecture />
  <PartnerCloser />
</main>
```

Insert `<PartnerTreasury />` between `<PartnerUSFocus />` and `<PartnerOnboarding />`:

```tsx
<main id="main">
  <PartnerHero />
  <Logos />
  <PartnerCapabilities />
  <PartnerUSFocus />
  <PartnerTreasury />
  <PartnerOnboarding />
  <PartnerArchitecture />
  <PartnerCloser />
</main>
```

- [ ] **Step 3: Run dev server and verify rendering**

Run: `npm run dev`
Open: `http://localhost:3000/partners`
Expected:
- A new section appears between US Focus (dark) and Onboarding (white).
- Section background is white (`var(--bg)`).
- Eyebrow reads "PARTNER OFFERING · MERCHANT CONSOLE" with a green dot.
- Headline reads "The console behind your brand." — no gradient text, no BETA pill.
- The full Treasury mockup is rendered below the headline.
- Console shows `partners_treasury_view` event firing (or you can confirm in `window.dataLayer` / Network).
- Homepage `/` Treasury section still fires `homepage_treasury_view` and renders identically.

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/routes/partners.tsx
git commit -m "$(cat <<'EOF'
Render PartnerTreasury between US Focus and Onboarding

Slots the new section into the partner narrative: US Focus pitches the
strategic depth, Treasury proves it with the merchant console mockup,
then Onboarding pivots to integration mechanics.
EOF
)"
```

---

## Task 6: Reframe Capabilities card #06

**Files:**
- Modify: `src/components/partners/partner-capabilities.tsx`

- [ ] **Step 1: Replace card #06 contents**

In `src/components/partners/partner-capabilities.tsx`, find the 6th entry in the `CARDS` array (it currently has `num: '06'`). Replace it.

Current:

```tsx
{
  num: '06',
  title: 'Merchant console & ledger',
  desc: 'Tools to send payment links, manage accounts, view transactions, and handle FX, splits, refunds, payouts, and reconciliation.',
  tags: ['Ledger', 'FX', 'Splits', 'Recon'],
},
```

Replace with:

```tsx
{
  num: '06',
  title: 'Audit-ready ledger',
  desc: 'Event log, reconciliation, and webhook stream for every move the console makes. Wire into your accounting, dispute, or risk stack.',
  tags: ['Event log', 'Recon', 'Webhooks'],
},
```

- [ ] **Step 2: Verify rendering**

Run: `npm run dev`
Open: `http://localhost:3000/partners`
Expected:
- Capabilities grid still has 6 cards (no orphan in the 3-col layout).
- Card #06 now reads "Audit-ready ledger" with the new tags.
- New Treasury section below (added in Task 5) tells the UI/UX story; card #06 tells the data/audit story. No verbal overlap.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/partners/partner-capabilities.tsx
git commit -m "$(cat <<'EOF'
Reframe Capabilities card #06 to lean into ledger/audit

The new Treasury section owns the merchant-console UI story, so card
#06 narrows to the data/audit layer that the mockup doesn't fully show
(event log, reconciliation, webhooks). Keeps the 3-col grid full.
EOF
)"
```

---

## Task 7: Visual verification at desktop + mobile

**Files:** None (verification only).

- [ ] **Step 1: Desktop screenshot (1440px)**

Run: `npm run dev` (if not already running)
Open: `http://localhost:3000/partners` at 1440px width.

Take a full-page screenshot (browser dev tools → command palette → "Capture full size screenshot", or use the project's existing screenshot pattern: prior `verify-partners-*.png` files in the repo root suggest the project uses Playwright or Chrome devtools for this).

Save as `verify-partners-treasury-desktop-1440.png` at the repo root (matches existing naming convention).

Expected:
- New Treasury section sits cleanly between US Focus (dark) and Onboarding (white).
- Eyebrow, headline, sub, and mockup all visible and aligned with the 1240px container.
- Mockup looks identical to the homepage version.

- [ ] **Step 2: Mobile screenshot (390px)**

Resize the browser (or use device emulation) to 390px width. Reload `/partners`.

Save as `verify-partners-treasury-mobile-390.png` at the repo root.

Expected:
- Section padding shrinks per the `@media (max-width: 899px)` rule.
- Title font-size clamps down.
- Mockup remains usable on narrow viewports (the existing `.tm2` responsive rules handle this).

- [ ] **Step 3: Homepage regression check**

Open: `http://localhost:3000/`
Expected:
- Treasury section renders identically to before this PR.
- `homepage_treasury_view` event still fires on scroll into view.
- No visual diff vs. main.

- [ ] **Step 4: Tests + final build**

Run: `npm test && npm run build`
Expected: all tests pass, build succeeds.

- [ ] **Step 5: Commit screenshots**

```bash
git add verify-partners-treasury-desktop-1440.png verify-partners-treasury-mobile-390.png
git commit -m "$(cat <<'EOF'
Add verification screenshots for /partners Treasury section

Desktop (1440px) and mobile (390px) captures confirming the new section
sits in the partner page rhythm and the homepage hasn't regressed.
EOF
)"
```

---

## Task 8: Push branch and open PR

**Files:** None (git operations only).

- [ ] **Step 1: Push the branch to origin**

```bash
git push -u origin feat/partners-treasury
```

Expected: branch pushed; tracking set.

- [ ] **Step 2: Open the PR**

```bash
gh pr create --title "Add Treasury section to /partners" --body "$(cat <<'EOF'
## Summary
- Brings the homepage Treasury mockup into /partners with partner-specific framing ("The console behind your brand.")
- Quieter section chrome — no gradient title, no BETA pill, shorter copy — so it reads as native to the partner page rather than copy-pasted from the homepage
- Reframes Capabilities card #06 from "Merchant console & ledger" → "Audit-ready ledger" to remove overlap with the new section
- Adds `partners_treasury_view` tracking event (fans out via existing GA + Clarity + LinkedIn + Snitcher pipeline)
- Extracts the lazy-load skeleton into a shared module so both pages render the same placeholder

## Test plan
- [ ] /partners renders the new Treasury section between US Focus and Onboarding
- [ ] Section eyebrow, headline, sub typography matches surrounding partner sections
- [ ] Treasury mockup renders identically to the homepage version
- [ ] Capabilities grid still shows 6 cards; card #06 reframed to "Audit-ready ledger"
- [ ] Homepage `/` Treasury section unchanged (still fires `homepage_treasury_view`)
- [ ] `partners_treasury_view` fires once on /partners mount
- [ ] Screenshots: verify-partners-treasury-desktop-1440.png, verify-partners-treasury-mobile-390.png

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 3: Confirm PR URL**

The command prints the PR URL. Share it with the user.

---

## Self-Review (filled in during plan authoring)

**Spec coverage:**
- ✅ New `PartnerTreasury` section → Task 4 + Task 5
- ✅ Shared skeleton → Task 1
- ✅ `eventName` prop on `TreasuryMockup` → Task 2
- ✅ `.ptreasury` CSS → Task 3
- ✅ Reframe card #06 → Task 6
- ✅ Insert into route between US Focus and Onboarding → Task 5
- ✅ Section id `partner-treasury` → Task 4
- ✅ Tracking event `partners_treasury_view` → Task 2 + Task 4 (prop wired)
- ✅ Verification at desktop + mobile → Task 7
- ✅ PR via `gh pr create` → Task 8
- ✅ Print media query update → Task 3 Step 2

**Placeholder scan:** No "TBD", "TODO", or vague guidance. Every step has either runnable code, an exact command, or an exact file/line operation.

**Type consistency:** `TreasuryMockup` accepts `{ eventName?: string }` (Task 2). `PartnerTreasury` passes `eventName="partners_treasury_view"` (Task 4). `TreasuryMockupSkeleton` is exported as a named export from the new file (Task 1) and imported by name in `products.tsx` (Task 1) and `partner-treasury.tsx` (Task 4). Consistent.
