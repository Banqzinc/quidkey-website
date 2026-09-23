import { describe, expect, it } from 'vitest'

import type { AgentsLaunch } from '@/lib/agents-launch'

import { agentsHead } from './seo'

const hidden: AgentsLaunch = { live: false, previewToken: 'secret-token' }
const live: AgentsLaunch = { live: true, previewToken: 'secret-token' }

type Tag = { title?: string; name?: string; content?: string }
function titleOf(head: ReturnType<typeof agentsHead>) {
  return (head.meta as Tag[]).find((m) => m.title !== undefined)?.title
}
function metaNamed(head: ReturnType<typeof agentsHead>, name: string) {
  return (head.meta as Tag[]).find((m) => m.name === name)?.content
}

describe('the /agents head', () => {
  it('describes the page once live, indexable', () => {
    const head = agentsHead({}, live)
    expect(titleOf(head)).toBe('Financial infrastructure for AI agents · Quidkey')
    expect(metaNamed(head, 'description')).toContain('AI agents')
    expect(metaNamed(head, 'robots')).toBeUndefined()
    expect(head.links.some((l) => l.href === '/.well-known/agent-registration.json')).toBe(true)
  })

  it('describes the page on a preview, but keeps it out of the index', () => {
    const head = agentsHead({ preview: 'secret-token' }, hidden)
    expect(titleOf(head)).toBe('Financial infrastructure for AI agents · Quidkey')
    expect(metaNamed(head, 'robots')).toBe('noindex, nofollow')
  })

  it('gives away nothing about the page while it is hidden', () => {
    // The route answers 404, and the head must match: no title, description
    // or links that name the unlaunched offering.
    const head = agentsHead({}, hidden)
    expect(titleOf(head)).toBe('Page not found · Quidkey')
    expect(metaNamed(head, 'description')).toBeUndefined()
    expect(metaNamed(head, 'robots')).toBe('noindex, nofollow')
    expect(JSON.stringify(head)).not.toMatch(/agent/i)
  })
})
