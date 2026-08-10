import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

import { FxCheckCloser } from '@/components/fx-check/closer'
import { FX_CHECK_FAQS } from '@/components/fx-check/faq-items'
import { FxCheckHero } from '@/components/fx-check/hero'
import { FxCheckHowItWorks } from '@/components/fx-check/how-it-works'
import { FxCheckSavingsTeaser } from '@/components/fx-check/savings-teaser'
import { FxCheckTrust } from '@/components/fx-check/trust'
import { HomepageFooter } from '@/components/layout/homepage-footer'
import { HomepageNav } from '@/components/layout/homepage-nav'
import { Faq } from '@/components/sections/faq'
import { AudienceProvider } from '@/context/audience'
import { buildFaqSchema, buildSeo } from '@/lib/seo'
import { track } from '@/lib/track'

// Share the homepage's chrome (nav, footer, typography, container) plus the
// refreshed section styling, with fx-check.css loading last so its fxc-*
// rules win at equal specificity — same trick as calculator.css.
import '@/styles/homepage/base.css'
import '@/styles/homepage/headings.css'
import '@/styles/homepage/section-padding.css'
import '@/styles/homepage/mobile.css'
import '@/styles/homepage/overrides.css'
import '@/styles/homepage/refresh.css'
import '@/components/fx-check/fx-check.css'

export const Route = createFileRoute('/stripe-fx-check')({
  component: StripeFxCheckPage,
  head: () =>
    buildSeo({
      title: 'Free Stripe FX Fee Check · Quidkey',
      description:
        'Connect Stripe read-only and see what you’d save on currency-conversion fees with Quidkey. Free, no account needed, auto-disconnects within 48 hours.',
      keywords: [
        'Stripe FX fees',
        'Stripe currency conversion fee',
        'Stripe exchange rate fee',
        'reduce Stripe fees',
        'Stripe fee checker',
      ],
      path: '/stripe-fx-check',
      structuredData: [
        buildFaqSchema(FX_CHECK_FAQS.map((faq) => ({ question: faq.q, answer: faq.a }))),
      ],
    }),
})

function StripeFxCheckPage() {
  // One page-view event, fanned out to GA + Clarity + Snitcher via track().
  // Ref-guarded so React's dev StrictMode double-mount doesn't emit it twice.
  const fired = useRef(false)
  useEffect(() => {
    if (fired.current) return
    fired.current = true
    track({ name: 'fx_check_view' })
  }, [])

  // AudienceProvider is required because HomepageNav reads useAudience().
  return (
    <AudienceProvider>
      <div className="hp">
        <HomepageNav />
        <main id="main">
          <FxCheckHero />
          <FxCheckHowItWorks />
          <FxCheckSavingsTeaser />
          <FxCheckTrust />
          <Faq
            items={FX_CHECK_FAQS}
            heading="Fair questions, straight answers."
            onOpen={(question) => track({ name: 'fx_check_faq_open', question })}
          />
          <FxCheckCloser />
        </main>
        <HomepageFooter />
      </div>
    </AudienceProvider>
  )
}
