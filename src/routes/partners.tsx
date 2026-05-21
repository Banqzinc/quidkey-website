import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

import { HomepageFooter } from '@/components/layout/homepage-footer'
import { PartnerArchitecture } from '@/components/partners/partner-architecture'
import { PartnerCapabilities } from '@/components/partners/partner-capabilities'
import { PartnerCloser } from '@/components/partners/partner-closer'
import { PartnerHero } from '@/components/partners/partner-hero'
import { PartnerNav } from '@/components/partners/partner-nav'
import { PartnerOnboarding } from '@/components/partners/partner-onboarding'
import { PartnerUSFocus } from '@/components/partners/partner-us-focus'
import { AudienceProvider, useAudience } from '@/context/audience'
import { buildSeo } from '@/lib/seo'

// Homepage base.css supplies the `.hp .ft__*` rules the site footer needs.
import '@/styles/homepage/base.css'
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
    <div className="partners-root">
      <PartnerNav />
      <main id="main">
        <PartnerHero />
        <PartnerCapabilities />
        <PartnerUSFocus />
        <PartnerOnboarding />
        <PartnerArchitecture />
        <PartnerCloser />
      </main>
      <div className="hp">
        <HomepageFooter />
      </div>
    </div>
  )
}
