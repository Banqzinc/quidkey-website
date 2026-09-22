import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import { AGENTS_MARKDOWN_URL, DISCOVERY_URL } from './agent-brief'
import { AGENT_REGISTRATION_ENDPOINT } from './api-example'
import { AGENTS_FAQ } from './faq-items'

const MARKDOWN_FILE = new URL('../../../public/agents.md', import.meta.url)
const DISCOVERY_FILE = new URL('../../../public/.well-known/agent-registration.json', import.meta.url)

// The markdown copy of /agents an agent reads to learn what is on offer. It is
// hand-written, so these checks hold it to the page and the discovery file.
describe('public/agents.md', () => {
  const md = readFileSync(MARKDOWN_FILE, 'utf8')
  const discovery = JSON.parse(readFileSync(DISCOVERY_FILE, 'utf8'))

  it('is the agents page for agents, served at the URL the brief and discovery file give', () => {
    expect(md.startsWith('# Financial infrastructure for AI agents')).toBe(true)
    expect(AGENTS_MARKDOWN_URL).toBe('https://quidkey.com/agents.md')
    expect(discovery.about).toBe(AGENTS_MARKDOWN_URL)
    expect(md).toContain('https://quidkey.com/agents')
  })

  it('answers every question the page answers, in the same words', () => {
    for (const { q, a } of AGENTS_FAQ) {
      expect(md).toContain(`### ${q}`)
      expect(md).toContain(a)
    }
  })

  it('states how to register the way the discovery file does', () => {
    expect(md).toContain(AGENT_REGISTRATION_ENDPOINT)
    expect(md).toContain(DISCOVERY_URL)
    expect(md).toContain('3 to 30 letters, digits or hyphens')
    for (const field of discovery.registration.schema.required) {
      expect(md).toContain(field)
    }
    expect(md).toContain('https://quidkey.com/agents#register')
    expect(md).toContain('not live yet')
  })

  it('carries the rules the discovery file gives agents, word for word', () => {
    for (const rule of discovery.instructions) {
      expect(md).toContain(rule)
    }
  })

  it('does not state a fee, rate or price', () => {
    expect(md).not.toMatch(/\d+(\.\d+)?\s?%/)
    expect(md).not.toMatch(/\bfee of\b|\bper transaction\b/i)
  })
})
