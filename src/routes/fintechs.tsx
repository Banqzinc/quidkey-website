import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

import { HomepageFooter } from '@/components/layout/homepage-footer'
import { HomepageNav } from '@/components/layout/homepage-nav'
import { Logos } from '@/components/sections/logos'
import { PartnerCapabilities } from '@/components/partners/partner-capabilities'
import { PartnerCloser } from '@/components/partners/partner-closer'
import { PartnerHero } from '@/components/partners/partner-hero'
import { PartnerOnboarding } from '@/components/partners/partner-onboarding'
import { PartnerTreasury } from '@/components/partners/partner-treasury'
import { PartnerUSFocus } from '@/components/partners/partner-us-focus'
import { AudienceProvider, useAudience } from '@/context/audience'
import { buildSeo } from '@/lib/seo'

// Share the homepage's chrome (nav, footer, typography, container, buttons,
// pills) so /fintechs doesn't look like a different site. partners.css loads
// last so its section-specific rules win at equal specificity.
import '@/styles/homepage/base.css'
import '@/styles/homepage/headings.css'
import '@/styles/homepage/section-padding.css'
import '@/styles/homepage/mobile.css'
import '@/styles/homepage/overrides.css'
import '@/components/partners/partners.css'

// Mirrors the homepage's font bundle. The hero now embeds MerchantHeroViz,
// whose ScribbleHint callout uses Caveat — without this stylesheet it falls
// back to the system cursive and looks visibly different from /.
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Caveat:wght@500;600;700&family=Inter+Tight:ital,wght@0,100..900;1,100..900&display=swap'

export const Route = createFileRoute('/fintechs')({
  component: PartnersPage,
  head: () => {
    const seo = buildSeo({
      title: 'Pay by Bank for fintechs · Quidkey',
      description:
        'Pay by Bank for PSPs and fintechs. White-labeled rails, accounts, and merchant tooling across the US, UK, EU, and AU.',
      keywords: [
        'Pay by Bank for fintechs',
        'Pay by Bank',
        'PSP',
        'fintech',
        'white-label',
        'US ACH',
        'UK FPS',
        'SEPA Instant',
        'PayTo',
      ],
      path: '/fintechs',
    })
    return {
      ...seo,
      links: [
        ...(seo.links ?? []),
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
        { rel: 'stylesheet', href: FONT_HREF },
      ],
    }
  },
})

function PartnersPage() {
  return (
    <AudienceProvider>
      <PartnersPageContent />
    </AudienceProvider>
  )
}

function PartnersPageContent() {
  const { audience, setAudience } = useAudience()
  // Mount-only auto-set: claim 'fintechs' once when the user lands on /fintechs.
  // Without the ref guard, the effect would re-run after the user toggles to
  // 'merchants' (which navigates away) and undo their choice before navigation
  // completes.
  const claimed = useRef(false)

  useEffect(() => {
    if (claimed.current) return
    claimed.current = true
    if (audience !== 'fintechs') {
      setAudience('fintechs')
    }
  }, [audience, setAudience])

  return (
    <div className="hp partners-root">
      <HomepageNav />
      <main id="main">
        <PartnerHero />
        <Logos />
        <PartnerCapabilities />
        <PartnerUSFocus />
        <PartnerTreasury />
        <PartnerOnboarding />
        <PartnerCloser />
      </main>
      <HomepageFooter />
    </div>
  )
}
