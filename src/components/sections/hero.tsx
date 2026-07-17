// Homepage Hero — merchants only. Fintechs land on /partners via the
// audience toggle, so this page no longer renders a fintech variant.

import { Suspense, lazy } from 'react'

import { HeroAudienceToggle } from '@/components/homepage/audience-toggle'
import { track } from '@/lib/track'
import { DEMO_BOOKING_URL, MERCHANTS_SIGNUP_URL } from '@/lib/urls'

// Lazy-imported so the hero's HTML/text content paints first; the
// interactive demo (~600 lines + multiple inline SVGs) hydrates a beat
// later. Skeleton matches the phone-frame footprint to avoid layout shift.
const MerchantHeroViz = lazy(() =>
  import('@/components/homepage/merchant-hero-viz').then((m) => ({ default: m.MerchantHeroViz }))
)

const ArrowIcon = (
  <span className="btn__arrow" aria-hidden="true">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 8h11" />
      <path d="M9.5 4l4 4-4 4" />
    </svg>
  </span>
)

function HeroVizSkeleton() {
  // Matches the phone-frame footprint of MerchantHeroViz so the hero
  // grid doesn't reflow when the lazy chunk hydrates.
  return (
    <div className="hero__viz hero__viz--mobile" aria-hidden="true">
      <div className="phone-wrap">
        <div className="phone phone--step-checkout phone--loading" />
      </div>
    </div>
  )
}

export function HeroSection() {
  const trackPrimary = () => {
    track({ name: 'homepage_cta_click', location: 'hero', label: 'get_started', audience: 'merchants' })
  }
  const trackSecondary = () => {
    track({ name: 'homepage_cta_click', location: 'hero', label: 'demo', audience: 'merchants' })
  }

  return (
    <section className="hero hero--split">
      <div className="container">
        <div className="hero__split">
          <div className="hero__copy">
            <HeroAudienceToggle source="hero" />
            <h1 className="hero__title">
              Pay by Bank for <em>your checkout.</em>
            </h1>
            <p className="hero__sub">
              Let customers pay straight from their bank account. Lower fees than cards, instant
              settlement, zero chargebacks — one integration, global coverage.
            </p>
            <div className="hero__ctas">
              <a
                href={MERCHANTS_SIGNUP_URL}
                className="btn btn--xl btn--ink"
                onClick={trackPrimary}
              >
                Add Pay by Bank to your checkout
                {ArrowIcon}
              </a>
              <a
                href={DEMO_BOOKING_URL}
                className="btn btn--xl btn--ghost"
                target="_blank"
                rel="noopener noreferrer"
                onClick={trackSecondary}
              >
                Book a demo
              </a>
            </div>
            <ul className="hero__proof">
              <li className="hero__proof-item">
                <svg className="hero__proof-check" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.5 8.5l3.5 3.5 7-8" /></svg>
                <span><strong>1%</strong> flat domestic rate</span>
              </li>
              <li className="hero__proof-item">
                <svg className="hero__proof-check" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.5 8.5l3.5 3.5 7-8" /></svg>
                <span>Live in minutes on <strong>Shopify</strong></span>
              </li>
              <li className="hero__proof-item">
                <svg className="hero__proof-check" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.5 8.5l3.5 3.5 7-8" /></svg>
                <span>US, UK, EU &amp; AU coverage</span>
              </li>
            </ul>
          </div>
          <Suspense fallback={<HeroVizSkeleton />}>
            <MerchantHeroViz />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
