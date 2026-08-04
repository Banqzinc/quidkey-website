import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

import { SurchargeCalculator } from '@/components/surcharge-calculator/surcharge-calculator'
import {
  DEFAULTS,
  parseSearch,
  type SurchargeSearch,
} from '@/components/surcharge-calculator/surcharge-params'
import { HomepageFooter } from '@/components/layout/homepage-footer'
import { HomepageNav } from '@/components/layout/homepage-nav'
import { AudienceProvider } from '@/context/audience'
import { buildSeo } from '@/lib/seo'
import { track } from '@/lib/track'

// Share the homepage's chrome (nav, footer, typography, container) so this page
// doesn't look like a different site. surcharge-calculator.css loads last so its
// .sc-calc-scoped rules win at equal specificity (same trick as calculator.css).
import '@/styles/homepage/base.css'
import '@/styles/homepage/headings.css'
import '@/styles/homepage/section-padding.css'
import '@/styles/homepage/mobile.css'
import '@/styles/homepage/overrides.css'
import '@/components/surcharge-calculator/surcharge-calculator.css'

export const Route = createFileRoute('/surcharge-calculator')({
  component: SurchargeCalculatorPage,
  // Inputs live in the URL so a link reproduces the exact view. Missing or
  // invalid params fall back to defaults (see surcharge-params.ts).
  validateSearch: (search: Record<string, unknown>): SurchargeSearch => parseSearch(search),
  // Keep the URL clean: strip params equal to the defaults so a bare link stays
  // bare and shared links carry only the changed inputs.
  search: { middlewares: [stripSearchParams(DEFAULTS)] },
  head: () =>
    buildSeo({
      title: 'Card Surcharge Ban Calculator · Quidkey',
      description:
        'From 1 October 2026 Australian businesses absorb card fees instead of surcharging. Estimate what that costs you, and what steering volume to Pay by Bank saves.',
      keywords: [
        'surcharge ban calculator',
        'card surcharge ban Australia',
        'RBA surcharge ban',
        'card processing fees Australia',
        'PayTo',
        'Pay by Bank',
      ],
      path: '/surcharge-calculator',
    }),
})

function SurchargeCalculatorPage() {
  // One page-view event, fanned out to GA + Clarity + Snitcher via track().
  // Ref-guarded so React's dev StrictMode double-mount doesn't emit it twice.
  const fired = useRef(false)
  useEffect(() => {
    if (fired.current) return
    fired.current = true
    track({ name: 'surcharge_calculator_view' })
  }, [])

  // URL is the source of truth for the inputs; mirror every change back with
  // replace so adjusting inputs doesn't pile up browser-history entries.
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const update = (patch: Partial<SurchargeSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true })

  // AudienceProvider is required because HomepageNav reads useAudience().
  return (
    <AudienceProvider>
      <div className="hp">
        <HomepageNav />
        <main id="main" className="sc-calc">
          <SurchargeCalculator state={search} onChange={update} />
        </main>
        <HomepageFooter />
      </div>
    </AudienceProvider>
  )
}
