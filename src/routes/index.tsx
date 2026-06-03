import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

import { AudienceProvider, readStoredAudience, useAudience } from '@/context/audience'
import { DemoRegionProvider } from '@/context/demo-region'
import { getDemoRegion } from '@/lib/get-demo-region'
import { HomepageNav } from '@/components/layout/homepage-nav'
import { HomepageFooter } from '@/components/layout/homepage-footer'
import { HeroSection } from '@/components/sections/hero'
import { Logos } from '@/components/sections/logos'
import { WhatIsPayByBank } from '@/components/sections/what-is-pay-by-bank'
import { WhyQuidkey } from '@/components/sections/why-quidkey'
import { CrossBorderProof } from '@/components/sections/cross-border-proof'
import { Developer } from '@/components/sections/developer'
import { PricingSection } from '@/components/sections/pricing-section'
import { Products } from '@/components/sections/products'
import { Faq } from '@/components/sections/faq'
import { Closer } from '@/components/sections/closer'
import { buildSeo } from '@/lib/seo'

import '@/styles/homepage/base.css'
import '@/styles/homepage/tm2.css'
import '@/styles/homepage/headings.css'
import '@/styles/homepage/integrations.css'
import '@/styles/homepage/treasury-head.css'
import '@/styles/homepage/mobile.css'
import '@/styles/homepage/section-padding.css'
import '@/styles/homepage/overrides.css'

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Caveat:wght@500;600;700&family=Inter+Tight:ital,wght@0,100..900;1,100..900&display=swap'

export const Route = createFileRoute('/')({
  component: HomePage,
  // Resolve the demo region from the edge geo header during SSR so the hero
  // demo shows the right bank set on first paint (no client-side geo fetch).
  loader: () => getDemoRegion(),
  head: () => {
    const seo = buildSeo({
      title: 'Add Pay by Bank to your checkout | Quidkey',
      description:
        'Add Pay by Bank to your checkout and automate what happens after payment: tax, splits, and FX. Global coverage, one integration.',
      path: '/',
      keywords: ['pay by bank', 'AI clearing house', 'open banking payments'],
    })
    return {
      ...seo,
      links: [
        ...(seo.links ?? []),
        // Homepage uses Outfit / Caveat / Inter Tight. The site-wide fonts
        // (Space Grotesk, DM Sans, JetBrains Mono) loaded by __root.tsx still
        // load — they're just unused on this page.
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
        { rel: 'stylesheet', href: FONT_HREF },
      ],
    }
  },
})

function HomePage() {
  const initialRegion = Route.useLoaderData()
  return (
    <DemoRegionProvider initial={initialRegion}>
      <AudienceProvider>
        <HomePageContent />
      </AudienceProvider>
    </DemoRegionProvider>
  )
}

function HomePageContent() {
  const { setAudience } = useAudience()
  // The homepage always renders the merchant variant. If a prior /fintechs
  // visit left 'fintechs' in localStorage, claim merchants so the audience-
  // driven toggle thumb matches the page. Read localStorage directly rather
  // than the React state: HomePageContent's effect fires before the parent
  // AudienceProvider's hydration effect (child effects run first), and even
  // a setTimeout(0) deferral isn't reliable — React 18's scheduler can fire
  // the timer before flushing the state update from hydration, leaving a
  // ref-based check seeing stale 'merchants'.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = readStoredAudience(window.localStorage)
    if (stored !== 'merchants') {
      setAudience('merchants')
    }
  }, [setAudience])

  return (
    <div className="hp">
      <HomepageNav />
      <main id="main">
        <HeroSection />
        <Logos />
        <WhatIsPayByBank />
        <WhyQuidkey />
        <CrossBorderProof />
        <Developer />
        <PricingSection />
        <Products />
        <Faq />
        <Closer />
      </main>
      <HomepageFooter />
    </div>
  )
}
