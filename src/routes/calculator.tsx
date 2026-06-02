import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

import { FeeCalculator } from '@/components/calculator/fee-calculator'
import { HomepageFooter } from '@/components/layout/homepage-footer'
import { HomepageNav } from '@/components/layout/homepage-nav'
import { AudienceProvider } from '@/context/audience'
import { buildSeo } from '@/lib/seo'
import { track } from '@/lib/track'

// Share the homepage's chrome (nav, footer, typography, container) so
// /calculator doesn't look like a different site. calculator.css loads last so
// its .fee-calc-scoped rules win at equal specificity (same trick as partners.css).
import '@/styles/homepage/base.css'
import '@/styles/homepage/headings.css'
import '@/styles/homepage/section-padding.css'
import '@/styles/homepage/mobile.css'
import '@/styles/homepage/overrides.css'
import '@/components/calculator/calculator.css'

export const Route = createFileRoute('/calculator')({
  component: CalculatorPage,
  head: () =>
    buildSeo({
      title: 'Shopify Fee Calculator · Quidkey',
      description:
        'Compare your estimated Shopify card fees against Quidkey Pay by Bank in seconds.',
      keywords: [
        'Shopify fee calculator',
        'Shopify fees',
        'Shopify Payments alternative',
        'Pay by Bank',
        'card processing fees',
      ],
      path: '/calculator',
    }),
})

function CalculatorPage() {
  // One page-view event, fanned out to GA + Clarity + Snitcher via track().
  // Ref-guarded so React's dev StrictMode double-mount doesn't emit it twice.
  const fired = useRef(false)
  useEffect(() => {
    if (fired.current) return
    fired.current = true
    track({ name: 'calculator_view' })
  }, [])

  // AudienceProvider is required because HomepageNav reads useAudience().
  return (
    <AudienceProvider>
      <div className="hp">
        <HomepageNav />
        <main id="main" className="fee-calc">
          <FeeCalculator />
        </main>
        <HomepageFooter />
      </div>
    </AudienceProvider>
  )
}
