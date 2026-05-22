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
// pills) so /partners doesn't look like a different site. partners.css loads
// last so its section-specific rules win at equal specificity.
import '@/styles/homepage/base.css'
import '@/styles/homepage/headings.css'
import '@/styles/homepage/section-padding.css'
import '@/styles/homepage/mobile.css'
import '@/styles/homepage/overrides.css'
import '@/components/partners/partners.css'

export const Route = createFileRoute('/partners')({
  component: PartnersPage,
  head: () =>
    buildSeo({
      title: 'Partner program · Quidkey',
      description:
        'Pay by Bank for PSPs and fintechs. White-labeled rails, accounts, and merchant tooling across the US, UK, EU, and AU.',
      keywords: [
        'partner program',
        'Pay by Bank',
        'PSP',
        'fintech',
        'white-label',
        'US ACH',
        'UK FPS',
        'SEPA Instant',
        'PayTo',
      ],
      path: '/partners',
    }),
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
  // Mount-only auto-set: claim 'fintechs' once when the user lands on /partners.
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
