import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

import { FxSavingsCloser } from '@/components/fx-savings/closer'
import { FX_SAVINGS_FAQS } from '@/components/fx-savings/faq-items'
import { FxSavingsHero } from '@/components/fx-savings/hero'
import { FxSavingsHowItWorks } from '@/components/fx-savings/how-it-works'
import { FxSavingsProviders } from '@/components/fx-savings/providers'
import { HomepageFooter } from '@/components/layout/homepage-footer'
import { HomepageNav } from '@/components/layout/homepage-nav'
import { Faq } from '@/components/sections/faq'
import { AudienceProvider } from '@/context/audience'
import { buildFaqSchema, buildSeo } from '@/lib/seo'
import { track } from '@/lib/track'

// Share the homepage's chrome (nav, footer, typography, container), with
// fx-savings.css loading last so its fxs-* rules win at equal specificity.
// Same trick as calculator.css.
import '@/styles/homepage/base.css'
import '@/styles/homepage/headings.css'
import '@/styles/homepage/section-padding.css'
import '@/styles/homepage/mobile.css'
import '@/styles/homepage/overrides.css'
import '@/components/fx-savings/fx-savings.css'

// This page used to live at /fx-check and offered the console's Connect Stripe
// check. That check is not offered on the website until it is finished and
// tested, so every call to action here opens the contact dialog instead. The
// old path 301s here (see src/lib/redirects.ts).
export const Route = createFileRoute('/fx-savings')({
  component: FxSavingsPage,
  head: () =>
    buildSeo({
      title: 'Save money on FX fees · Quidkey',
      description:
        'Selling or paying abroad? Stripe and Shopify charge about 2% to convert your sales, and banks often more. Quidkey saves you 0.5%, and more on bank conversions. Tell us what you convert and we’ll work out your saving.',
      keywords: [
        'Stripe FX fees',
        'Stripe currency conversion fee',
        'Shopify currency conversion fee',
        'cross-border payment fees',
        'reduce FX fees',
        'international payments FX',
      ],
      path: '/fx-savings',
      structuredData: [
        buildFaqSchema(FX_SAVINGS_FAQS.map((faq) => ({ question: faq.q, answer: faq.a }))),
      ],
    }),
})

function FxSavingsPage() {
  // One page-view event, fanned out to GA + Clarity + Snitcher via track().
  // Ref-guarded so React's dev StrictMode double-mount doesn't emit it twice.
  const fired = useRef(false)
  useEffect(() => {
    if (fired.current) return
    fired.current = true
    track({ name: 'fx_savings_view' })
  }, [])

  // AudienceProvider is required because HomepageNav reads useAudience().
  return (
    <AudienceProvider>
      <div className="hp">
        <HomepageNav />
        <main id="main">
          <FxSavingsHero />
          <FxSavingsProviders />
          <FxSavingsHowItWorks />
          <Faq
            items={FX_SAVINGS_FAQS}
            heading="Fair questions, straight answers."
            onOpen={(question) => track({ name: 'fx_savings_faq_open', question })}
          />
          <FxSavingsCloser />
        </main>
        <HomepageFooter />
      </div>
    </AudienceProvider>
  )
}
