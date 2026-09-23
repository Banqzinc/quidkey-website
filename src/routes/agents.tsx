import { createFileRoute, notFound } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

import { AgentsAccounts } from '@/components/agents/accounts'
import { AgentsCloser } from '@/components/agents/closer'
import { AGENTS_FAQ } from '@/components/agents/faq-items'
import { AgentsHero } from '@/components/agents/hero'
import { AgentsModel } from '@/components/agents/model'
import { AgentsPay } from '@/components/agents/pay'
import { AgentsProfile } from '@/components/agents/profile'
import { AgentsRegister } from '@/components/agents/register'
import { agentsHead } from '@/components/agents/seo'
import { HomepageFooter } from '@/components/layout/homepage-footer'
import { HomepageNav } from '@/components/layout/homepage-nav'
import { Faq } from '@/components/sections/faq'
import { AudienceProvider, useAudience } from '@/context/audience'
import { agentsPageVisible } from '@/lib/agents-launch'
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

type AgentsSearch = { preview?: string; handle?: string }

export const Route = createFileRoute('/agents')({
  component: AgentsPage,
  validateSearch: (search: Record<string, unknown>): AgentsSearch => ({
    ...(typeof search.preview === 'string' ? { preview: search.preview } : {}),
    ...(typeof search.handle === 'string' ? { handle: search.handle } : {}),
  }),
  // Hidden until launch: the site's 404, unless the URL carries the preview
  // token. Thrown from the loader, not beforeLoad: in this Start version a
  // notFound from beforeLoad renders as an empty 200 on the server.
  loaderDeps: ({ search }) => ({ preview: search.preview }),
  loader: ({ deps }) => {
    if (!agentsPageVisible(deps)) throw notFound()
  },
  head: ({ match }) => agentsHead(match.search),
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
