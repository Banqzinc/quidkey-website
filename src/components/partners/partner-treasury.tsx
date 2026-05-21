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
