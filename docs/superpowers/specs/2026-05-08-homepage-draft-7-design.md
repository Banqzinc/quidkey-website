# Homepage Draft 7 — Design Spec

**Date:** 2026-05-08
**Owner:** Rabea Bader
**Status:** Approved for implementation planning

## Goal

Replace the live homepage (`quidkey.com/`) with the design shipped as `Homepage. Draft 7.html` from the Anthropic Claude Design bundle. Implementation is a branch-and-replace; the merge of the homepage redesign PR is the cutover. Other site pages (`/pricing`, `/about`, `/blog`, etc.) are untouched in this project.

## Source material

- Bundle URL: `https://api.anthropic.com/v1/design/h/yKplYM8d9M8y7pAGhLMVUw` (gzipped tar)
- Local extraction: `/tmp/quidkey-design/quidkey-new-homepage/`
- Primary file: `project/Homepage. Draft 7.html`
- Imports:
  - `project/styles-v4-draft.css` (8,162 lines — base styles)
  - `project/styles-v4-tm2.css` (595 lines — variant overrides)
  - `project/v-draft-7/headings-standard.css` (251)
  - `project/v-draft-7/integrations-redesign.css` (294)
  - `project/v-draft-7/treasury-head.css` (53)
  - `project/v-draft-7/mobile.css` (632)
  - `project/v-draft-7/section-padding-fix.css` (42)
  - `project/v-draft-7/app.jsx` (4,568 lines — main React tree, babel-standalone)
  - `project/v-draft-7/treasury-mockup.jsx` (287)
  - `project/v-draft-7/globe-v10.jsx` (552 — **dead code in Draft 7, dropped**)
  - `project/tweaks-panel.jsx` (design-time only — **dropped**)
- Fonts: Outfit, Caveat, Inter Tight (Google Fonts)
- Chat transcripts: `chats/chat1.md` … `chats/chat51.md` — `chat50.md` (closer headline 2-line fix) and `chat51.md` (Why Quidkey reorder) are load-bearing for final copy.

## Stack decisions

- **Framework:** keep TanStack Start + React 19 + Tailwind v4 + Framer Motion + Lucide + Vite + Netlify SSR (the existing stack). The prototype's babel-standalone JSX is a prototype convention, not a production target.
- **Approach:** Section-based port. Each top-level component from the prototype's `App()` becomes its own React file under `src/components/sections/` or `src/components/layout/`. No 4,500-line monolith.
- **CSS:** Scoped verbatim copy. Every selector from the prototype's CSS is prefixed with a `.hp` root class so it cannot bleed into other routes. Fonts load only on the homepage route. Tailwind tokens are not modified by this project.
- **Hosting:** Long-lived `homepage-redesign` branch off `main`. Netlify deploy previews provide review URLs. Merge replaces `routes/index.tsx`. No `/v2` route, no feature flag.

## Composition (top-level)

The homepage's render tree is exactly the prototype's `App()` composition (verified at `app.jsx:4546`):

```
<AudienceProvider>
  <HomepageNav />
  <Hero />
  <Logos variant="customers" />
  <WhatIsPayByBank />
  <WhyQuidkey />
  <CrossBorderProof />
  <Developer />
  <Pricing />
  <Products />          {/* contains lazy <TreasuryMockup /> */}
  <Faq />
  <Closer />
  <HomepageFooter />
</AudienceProvider>
```

Wrapper: `<div className="hp">` on the route's root.

`AudienceProvider` reads/writes `localStorage` to remember the merchant-vs-fintechs toggle and exposes `useAudience()`. Several sections branch on this (Hero, Developer, Products, Footer).

Functions defined in the prototype's `app.jsx` but **not rendered** by `App()` and therefore **not ported**: `How`, `HowLegacy`, `MoreThan`, `MerchantsTrustUs`, `BuiltFor`, `QuidkeyTweaks`, `TweaksProvider` (and the entire `tweaks-panel.jsx` file).

## File structure

```
src/
├── routes/
│   └── index.tsx                     # replaces existing — composes the homepage
│
├── components/
│   ├── layout/
│   │   ├── header.tsx                # existing — UNTOUCHED (used by other routes)
│   │   ├── mega-menu.tsx             # existing — UNTOUCHED
│   │   ├── footer.tsx                # existing — UNTOUCHED
│   │   ├── homepage-nav.tsx          # NEW — Nav() port, used only on homepage
│   │   └── homepage-footer.tsx       # NEW — Footer() port, used only on homepage
│   ├── sections/                     # existing files stay; new homepage sections are added here
│   │   ├── hero.tsx                  # NEW (overwrites existing) — Hero + MerchantHeroViz + FintechHeroViz + HeroAudienceToggle
│   │   │                             #   Verify no other route imports the existing hero.tsx before overwriting; if any do, rename new one.
│   │   ├── logos.tsx                 # NEW — Logos + Marquee + LogoMark + PlatformGlyph
│   │   ├── what-is-pay-by-bank.tsx   # NEW — WhatIsPayByBank + PbbFlow
│   │   ├── why-quidkey.tsx           # NEW — WhyQuidkey 6-card grid (chat51 ordering)
│   │   ├── cross-border-proof.tsx    # NEW — CrossBorderProof
│   │   ├── developer.tsx             # NEW — Developer + FintechDeveloper + CodePreview + integration mocks
│   │   ├── pricing.tsx               # NEW — Pricing
│   │   ├── products.tsx              # NEW — Products + CheckoutMini + TreasuryMini + OnboardMini + AccountsMini + VizFor
│   │   ├── faq.tsx                   # NEW — Faq
│   │   └── closer.tsx                # NEW — Closer
│   │   # Existing files (blog-preview, cta, developers, how-it-works, product-layers,
│   │   # stats, trust-badges, use-cases, why-choose, workflows) are NOT used by the new
│   │   # homepage. They stay in the repo for now in case other routes use them; remove
│   │   # in a follow-up cleanup PR after verifying they have no other consumers.
│   ├── homepage/                     # NEW — homepage-only sub-components
│   │   ├── treasury-mockup.tsx       # ← lazy-imported by products.tsx
│   │   ├── audience-toggle.tsx       # AudienceToggle + HeroAudienceToggle
│   │   ├── stage-pill.tsx            # StagePill + VizHead + VizSidebar + SideIcon
│   │   ├── money-value.tsx           # MoneyValue + StatusFlicker
│   │   ├── scribble-hint.tsx         # ScribbleHint + DemoHint (hero overlays)
│   │   └── icons.tsx                 # SafariIcon + SearchIcon + IntegrationIcon + others
│   └── ...
│
├── context/                          # NEW
│   └── audience.tsx                  # AudienceProvider + useAudience hook + localStorage
│
├── styles/
│   └── homepage/                     # NEW — imported only from routes/index.tsx
│       ├── base.css                  # styles-v4-draft.css, prefixed with .hp
│       ├── tm2.css                   # styles-v4-tm2.css, prefixed with .hp
│       ├── headings.css              # headings-standard.css
│       ├── integrations.css          # integrations-redesign.css
│       ├── treasury-head.css
│       ├── mobile.css
│       └── section-padding.css
│
└── public/homepage/                  # NEW — image/SVG assets the prototype references
    └── ...
```

## CSS isolation (the load-bearing detail)

The prototype's CSS includes element-level resets, body styles, font-family declarations, and global utility classes. To prevent leakage into other routes:

1. **Prefix every selector with `.hp`** during port. A simple PostCSS pass that wraps each rule's selector list:
   - `body { ... }` → `.hp { ... }`
   - `.nav__brand { ... }` → `.hp .nav__brand { ... }`
   - `@keyframes`, `:root` custom properties, `@font-face` are kept at top level (they're naturally scoped or load-once).
2. **Wrap the homepage** in `<div className="hp">` at the root of `routes/index.tsx`'s rendered tree.
3. **Import CSS only inside `routes/index.tsx`.** Vite still bundles it into a stylesheet that loads document-wide, but the `.hp` prefix means selectors only match inside the homepage's wrapper.
4. **Fonts.** Add `<link>` tags to Outfit, Caveat, Inter Tight via TanStack Router's `head()` config in `routes/index.tsx` only. Other routes don't fetch them.
5. **Tailwind v4.** Untouched. Existing pages and any homepage components that opt in still get Tailwind utilities. The prototype's classes are namespaced enough (`.nav__brand`, `.section__h`) that they don't collide with Tailwind utilities.

## Wiring decisions

### HomepageNav links

| Prototype label | Wires to |
|---|---|
| Why Quidkey | `#why-quidkey` (in-page anchor) |
| Integrations | `#integrations` (in-page anchor) |
| Pricing | `#pricing` (in-page anchor) |
| Treasury | `#treasury` (in-page anchor) |
| Developers ↗ | `https://quidkey.dev` (existing external) |
| Blog | `/blog` (existing route) |
| Sign in | existing console URL (matches current site's Sign in link) |
| Get started | existing CTA URL (matches current site's primary CTA) |

### HomepageFooter links

| Column | Label | Wires to |
|---|---|---|
| Products | Checkout | `/products/hosted-checkout` |
| Products | Treasury | `/workflows` (no `/products/treasury` exists yet) |
| Products | Shopify app | `/products/shopify` |
| Products | API | `/products/iframe` |
| Company | About | `#` (leave stub; wire at follow-up) |
| Company | Careers | `#` (leave stub) |
| Company | Blog | `/blog` |
| Company | Press | `#` (no press page) |
| Developers | Docs | `https://docs.quidkey.com/` |
| Developers | Changelog | `#` (no changelog page) |
| Developers | Status | `https://status.quidkey.com` |
| Developers | GitHub | `#` (no public GitHub org page) |
| Legal | Terms | `/terms` |
| Legal | Privacy | `/privacy` |
| Legal | Security | `#` (no security page) |
| Legal | Contact | `/contact` |

When `AudienceProvider` is set to `fintechs`, the Products column swaps to a "Partner stack" column with labels Rails / Embedded accounts / Workflows / Partner portal. None of these have a current matching route — leave all four as `#` until those product pages exist.

### Footer newsletter form

Mailchimp is **not currently connected** to the website. Two paths:

- **Pre-merge stub (default):** keep the prototype's behavior — the form animates to "Thanks, you're on the list" without actually submitting. Ships in this state if not wired before merge.
- **Pre-merge wiring (preferred if Mailchimp audience exists):** wire to a Mailchimp embedded form (audience ID + form action URL) or a Netlify form (`<form data-netlify="true">`). Decision deferred until before merge; not a design-spec blocker.

## Section-by-section notes

| Section | Source lines (`app.jsx`) | Special notes |
|---|---|---|
| `AudienceProvider` (context) | 191–219 | localStorage key, type as `'merchants' \| 'fintechs'`. |
| `HomepageNav` (Nav) | 268–387 | scroll-aware shadow, mobile burger, audience pill toggle. |
| `Hero` | 1896–1997 + viz functions | Heaviest interactivity. Includes `MerchantHeroViz` (793–1697, ~900 lines, bank-tap demo) and `FintechHeroViz` (1721–1810). The `chat50.md` 2-line headline fix lives here. `ScribbleHint` / `DemoHint` overlays must port with the hero. |
| `Logos` | 2113–2150 + helpers | CSS-driven marquee, no JS animation lib. |
| `WhatIsPayByBank` | 2269–2461 | Contains decorative `pbbflow__globe` div (CSS-only — keep className intact). |
| `WhyQuidkey` | 2463–2504 | The exact 6-card order from `chat51.md`: bolt → target → dashboard → shield → clock → coin. Don't reshuffle. |
| `CrossBorderProof` | 2506–2560 | Pure CSS/SVG, no JS animation. |
| `Developer` | 3790–3947 | Audience-aware. Merchant view: `PaymentLinkMock` + `ShopifyInstallMock`. Fintech view: `FintechDeveloper` + `CodePreview` (interactive tabbed code viewer, 3772–3788). |
| `Pricing` | 4058–4248 | Pricing values live in this file — flag any divergence from live `/pricing` route at port time. |
| `Products` | 2760–2852 | 4 product surfaces. **`<TreasuryMockup />` is `React.lazy`-imported with skeleton fallback.** |
| `Faq` | 4299–4341 | Accordion. Use `useState` with `false` initial — don't `useEffect`-set on mount (SSR hydration). |
| `Closer` | 4343–4364 | The "Add a payment option…" 2-line headline fix from `chat50.md`. |
| `HomepageFooter` (Footer) | 4366–4450 | Audience-aware columns (Products vs Partner Stack switches). |

## Lazy loading

- `TreasuryMockup` is dynamically imported via `React.lazy` from inside `products.tsx`, with a small skeleton fallback that matches the mockup's outer dimensions. Treasury sits below the fold; deferring its bundle improves first paint without affecting perceived load.
- All other sections are top-level imports. The route is already code-split by TanStack Router.

## SEO

- Existing SEO infrastructure (`buildSeo` in `lib/seo.ts`) used unchanged. Title and description for `/` are the existing ones in `routes/index.tsx`'s `head()` — no changes unless the design calls for them.
- Sitemap and robots stay as-is (the homepage was always indexable).

## Analytics and tracking

`__root.tsx` is untouched, so all existing tracking continues to fire on the new homepage with no changes:

- Microsoft Clarity (`lib/clarity.ts`)
- Google Analytics (`lib/google-analytics.ts`)
- LinkedIn Insight Tag (`lib/linkedin.ts`)
- Snitcher (`lib/snitcher.ts`)
- Userback (`lib/userback.ts`)
- Cookiebot consent (`lib/cookiebot.ts`)

Any in-page event tracking (e.g. CTA button clicks) needed for the new sections is added in a follow-up project.

## Build sequence

1. **Cut branch.** `git checkout -b homepage-redesign`. Push an initial empty/placeholder commit so Netlify generates a deploy preview URL; confirm the preview matches `main` visually.
2. **Scaffold.** Create `src/components/homepage/`, `src/context/`, `src/styles/homepage/`, `src/public/homepage/`. Touch nothing else.
3. **Audience context.** Port `AudienceProvider` + `useAudience` to `src/context/audience.tsx`. Add a unit test that the localStorage round-trip works. Commit. Verify deploy preview unchanged.
4. **CSS pipeline.** Copy all 7 CSS files into `src/styles/homepage/`. Write a one-shot PostCSS script at `scripts/prefix-homepage-css.mjs` that prefixes every selector with `.hp` (skip `@keyframes`, `@font-face`, and `:root`). Run it once locally; commit the **prefixed CSS files** to the repo. The script itself can be committed for documentation, but is not part of the build pipeline. Confirm `import` statements for these CSS files appear only in `routes/index.tsx`. Verify deploy preview: existing pages visually unchanged.
5. **Layout shell.** Port `HomepageNav` → `src/components/layout/homepage-nav.tsx`. Port `HomepageFooter` → `src/components/layout/homepage-footer.tsx`. Wire links per the tables above. Newsletter as stub. Replace `routes/index.tsx` body with `<AudienceProvider><div className="hp"><HomepageNav /><main /><HomepageFooter /></div></AudienceProvider>`. Verify deploy preview: nav + footer render at `/`, other pages still render their existing chrome.
6. **Hero (the heaviest section first to de-risk).** Port `Hero` + `MerchantHeroViz` + `FintechHeroViz` + `ScribbleHint` + `DemoHint` + `HeroAudienceToggle`. Verify chat50 headline fix lands intact. Mount under `<main>` in step 5. Commit.
7. **Sections in order, one commit each:** `Logos` → `WhatIsPayByBank` (with `PbbFlow`) → `WhyQuidkey` (chat51 ordering) → `CrossBorderProof` → `Developer` (both audiences) → `Pricing` → `Products` (with lazy `TreasuryMockup`) → `Faq` → `Closer`.
8. **Asset audit.** Walk every `<img src=…>` and SVG reference in the ported components. Copy referenced assets to `public/homepage/`. Update paths in JSX.
9. **Visual diff pass.** Open the prototype HTML in a browser side by side with the deploy preview. Walk top-to-bottom at desktop (1440, 1024) and mobile (390, 360) breakpoints. Note divergences, fix.
10. **Lighthouse + a11y pass.** Run Lighthouse on the deploy preview. Check a11y violations: keyboard nav, focus rings, contrast, aria-labels on icon buttons. Fix.
11. **Newsletter wiring decision.** Either keep stub or wire Mailchimp/Netlify form. Document the choice in the PR description.
12. **Open PR.** Title: "Replace homepage with Draft 7 design." Body: lists what's new, what's removed, and the visual-diff/lighthouse/a11y results.
13. **Pre-merge cleanup (optional).** If the unused `src/components/sections/*` files (`blog-preview`, `cta`, `developers`, `how-it-works`, `product-layers`, `stats`, `trust-badges`, `use-cases`, `why-choose`, `workflows`) have no other consumers, mark them for a follow-up deletion PR. Keep this PR focused on the redesign.
14. **Merge.** Cutover happens at merge.

## Risks and open items

- **Visual whiplash between routes.** New homepage uses Outfit/Caveat/Inter Tight and a different visual language; `/pricing`, `/about`, etc. still use the existing site chrome. Acceptable for shipping the homepage first; flag in the PR description so stakeholders know.
- **Long-lived branch drift.** Rebase `homepage-redesign` against `main` weekly. The homepage code is self-contained (no shared utility changes), so rebases should be clean.
- **Mailchimp wiring not blocking.** Decision deferred until before merge.
- **`/pricing` divergence.** Prototype's `Pricing` section has its own values — verify they match the live `/pricing` page at port time. If they diverge, ask before changing.
- **Asset copyright.** The prototype references customer logos and bank brand marks. Confirm we have license to use each one in production before the merge. Replace any unlicensed marks with placeholders or acquired equivalents.
- **Treasury route.** Footer links Treasury → `/workflows` because no dedicated treasury page exists. Worth creating one in a separate project.

## Out of scope

- Redesigning other site pages (`/pricing`, `/about`, `/blog`, products, solutions, etc.).
- Replacing the existing `MegaMenu` or existing `Footer` outside the homepage.
- Building a `/products/treasury` route.
- Wiring Mailchimp as a site-wide newsletter (out of scope until the homepage ships).
- Animation polish beyond what the prototype contains.
- Adding new sections not present in `Homepage. Draft 7.html`.
