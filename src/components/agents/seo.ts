import { agentsLaunch, agentsPageVisible, type AgentsLaunch } from '@/lib/agents-launch'
import { buildSeo } from '@/lib/seo'

// Mirrors the homepage's font bundle so the shared chrome renders identically.
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Caveat:wght@500;600;700&family=Inter+Tight:ital,wght@0,100..900;1,100..900&display=swap'

type Seo = ReturnType<typeof buildSeo>
type Link = { rel: string; href: string; type?: string; title?: string; crossOrigin?: 'anonymous' | 'use-credentials' }
export type AgentsHead = { meta: Seo['meta']; links: Link[] }

const NOINDEX = { name: 'robots', content: 'noindex, nofollow' }

/**
 * The /agents <head>. While the page is hidden it answers 404, and the head
 * matches: a not-found title and nothing that names the offering. On a
 * preview before launch it describes the page but keeps it out of the index.
 */
export function agentsHead(search: Record<string, unknown>, launch: AgentsLaunch = agentsLaunch): AgentsHead {
  if (!agentsPageVisible(search, launch)) {
    return { meta: [{ title: 'Page not found · Quidkey' }, NOINDEX], links: [] }
  }
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
    meta: [...seo.meta, ...(launch.live ? [] : [NOINDEX])],
    links: [
      ...(seo.links ?? []),
      { rel: 'alternate', type: 'application/json', href: '/.well-known/agent-registration.json', title: 'Agent registration instructions' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'stylesheet', href: FONT_HREF },
    ],
  }
}
