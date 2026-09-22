import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

import { AgentsAccounts } from '@/components/agents/accounts'
import { AgentsCloser } from '@/components/agents/closer'
import { AGENTS_FAQ } from '@/components/agents/faq-items'
import { AgentsHero } from '@/components/agents/hero'
import { AgentsModel } from '@/components/agents/model'
import { AgentsPay } from '@/components/agents/pay'
import { AgentsProfile } from '@/components/agents/profile'
import { AgentsRegister } from '@/components/agents/register'
import { HomepageFooter } from '@/components/layout/homepage-footer'
import { HomepageNav } from '@/components/layout/homepage-nav'
import { Faq } from '@/components/sections/faq'
import { AudienceProvider, useAudience } from '@/context/audience'
import { buildSeo } from '@/lib/seo'
import { track } from '@/lib/track'

// Share the homepage's chrome (nav, footer, typography, container, buttons,
// pills, .why cards, .closer, .faq, code block) so /agents reads as the same
// site. agents.css loads last so its ag- rules win at equal specificity. The
// register section embeds the contact form, so its stylesheet loads here too.
import '@/styles/homepage/base.css'
import '@/styles/homepage/headings.css'
import '@/styles/homepage/section-padding.css'
import '@/styles/homepage/mobile.css'
import '@/styles/homepage/overrides.css'
import '@/components/contact/contact.css'
import '@/components/agents/agents.css'

// Mirrors the homepage's font bundle so the shared chrome renders identically.
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Caveat:wght@500;600;700&family=Inter+Tight:ital,wght@0,100..900;1,100..900&display=swap'

export const Route = createFileRoute('/agents')({
  component: AgentsPage,
  head: () => {
    const seo = buildSeo({
      title: 'Financial infrastructure for AI agents · Quidkey',
      description:
        'Accounts in multiple currencies, local receiving details, disposable cards and payments for AI agents, under the budget and policy an owner sets. Register your interest.',
      keywords: [
        'financial infrastructure for AI agents',
        'AI agent payments',
        'AI agent bank account',
        'agent wallet',
        'agentic commerce',
        'disposable virtual cards for agents',
      ],
      path: '/agents',
    })
    return {
      ...seo,
      links: [
        ...(seo.links ?? []),
        { rel: 'alternate', type: 'application/json', href: '/.well-known/agent-registration.json', title: 'Agent registration instructions' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
        { rel: 'stylesheet', href: FONT_HREF },
      ],
    }
  },
})

function AgentsPage() {
  return (
    <AudienceProvider>
      <AgentsPageContent />
    </AudienceProvider>
  )
}

function AgentsPageContent() {
  const { audience, setAudience } = useAudience()
  // Mount-only: claim 'agents' once on landing. The ref guard stops the effect
  // undoing a toggle to another audience before its navigation completes
  // (same pattern as /fintechs).
  const claimed = useRef(false)
  useEffect(() => {
    if (claimed.current) return
    claimed.current = true
    track({ name: 'agents_view' })
    if (audience !== 'agents') {
      setAudience('agents')
    }
  }, [audience, setAudience])

  return (
    <div className="hp agents-root">
      <HomepageNav />
      <main id="main">
        <AgentsHero />
        <AgentsProfile />
        <AgentsModel />
        <AgentsAccounts />
        <AgentsPay />
        <AgentsRegister />
        <Faq items={AGENTS_FAQ} heading="Before you register." />
        <AgentsCloser />
      </main>
      <HomepageFooter />
    </div>
  )
}
