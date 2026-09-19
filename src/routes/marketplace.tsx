import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

import { HomepageFooter } from '@/components/layout/homepage-footer'
import { HomepageNav } from '@/components/layout/homepage-nav'
import { MarketplaceAgentic } from '@/components/marketplace/agentic'
import { MarketplaceCloser } from '@/components/marketplace/closer'
import { MarketplaceCompared } from '@/components/marketplace/compared'
import { MarketplaceEconomics } from '@/components/marketplace/economics'
import { MarketplaceGlobal } from '@/components/marketplace/global-a2a'
import { MarketplaceHero } from '@/components/marketplace/hero'
import { MarketplaceProblem } from '@/components/marketplace/problem'
import { MarketplaceProtectedPay } from '@/components/marketplace/protected-pay'
import { MarketplaceSellerOfRecord } from '@/components/marketplace/seller-of-record'
import { MarketplaceWhiteLabel } from '@/components/marketplace/white-label'
import { MarketplaceWorkflows } from '@/components/marketplace/workflows'
import { AudienceProvider } from '@/context/audience'
import { buildSeo } from '@/lib/seo'
import { track } from '@/lib/track'

// Share the homepage's chrome (nav, footer, typography, container), with
// marketplace.css loading last so its mkt-* rules win at equal specificity.
// Same trick as fx-check.css.
import '@/styles/homepage/base.css'
import '@/styles/homepage/headings.css'
import '@/styles/homepage/section-padding.css'
import '@/styles/homepage/mobile.css'
import '@/styles/homepage/overrides.css'
import '@/components/marketplace/marketplace.css'

export const Route = createFileRoute('/marketplace')({
  component: MarketplacePage,
  head: () =>
    buildSeo({
      title: 'Protected Pay for B2B marketplaces · Quidkey',
      description:
        'Keep B2B transactions on your marketplace. Buyers pay by bank with funds restricted in the seller’s own account until delivery is confirmed. You earn on every order and FX conversion, without becoming the merchant or holding funds.',
      keywords: [
        'B2B marketplace payments',
        'marketplace escrow alternative',
        'protected bank payments',
        'account-to-account payments marketplace',
        'marketplace payment workflows',
        'seller of record marketplace',
        'agentic purchasing',
      ],
      path: '/marketplace',
    }),
})

function MarketplacePage() {
  // One page-view event, fanned out to GA + Clarity + Snitcher via track().
  // Ref-guarded so React's dev StrictMode double-mount doesn't emit it twice.
  const fired = useRef(false)
  useEffect(() => {
    if (fired.current) return
    fired.current = true
    track({ name: 'marketplace_view' })
  }, [])

  // AudienceProvider is required because HomepageNav reads useAudience().
  return (
    <AudienceProvider>
      <div className="hp mkt">
        <HomepageNav />
        <main id="main">
          <MarketplaceHero />
          <MarketplaceProblem />
          <MarketplaceProtectedPay />
          <MarketplaceEconomics />
          <MarketplaceGlobal />
          <MarketplaceWorkflows />
          <MarketplaceSellerOfRecord />
          <MarketplaceCompared />
          <MarketplaceWhiteLabel />
          <MarketplaceAgentic />
          <MarketplaceCloser />
        </main>
        <HomepageFooter />
      </div>
    </AudienceProvider>
  )
}
