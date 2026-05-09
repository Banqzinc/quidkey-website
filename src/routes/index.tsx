import { createFileRoute } from '@tanstack/react-router'

import { AudienceProvider } from '@/context/audience'
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
  head: () => {
    const seo = buildSeo({
      title: 'Add Pay by Bank to your checkout. Increase conversion, lower fees.',
      description:
        'AI-native clearing house for pay by bank. Unify checkout, routing, and treasury workflows—tax, splits, FX, payouts—with one integration.',
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
  return (
    <AudienceProvider>
      <div className="hp">
        <HomepageNav />
        <main>
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
    </AudienceProvider>
  )
}
