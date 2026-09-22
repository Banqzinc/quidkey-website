import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import { agentBrief, AGENTS_MARKDOWN_URL, OWNER_LINK_PLACEHOLDER } from './agent-brief'
import { handlePrefillMessage } from './handle'

const DISCOVERY_FILE = new URL('../../../public/.well-known/agent-registration.json', import.meta.url)
const discovery = JSON.parse(readFileSync(DISCOVERY_FILE, 'utf8'))

describe('the brief an owner pastes into their agent', () => {
  const brief = agentBrief()

  it('sends the agent to the offering in markdown first, then to the discovery file', () => {
    expect(brief).toContain(
      `Read ${AGENTS_MARKDOWN_URL} to see what Quidkey offers you, then https://quidkey.com/.well-known/agent-registration.json for how to register.`,
    )
    expect(brief.indexOf(AGENTS_MARKDOWN_URL)).toBeLessThan(brief.indexOf('agent-registration.json'))
  })

  it('states the handle rule the discovery file enforces', () => {
    expect(brief).toContain('3 to 30 letters, digits or hyphens')
    const pattern = new RegExp(discovery.registration.schema.properties.handle.pattern)
    expect(pattern.test('abc')).toBe(true)
    expect(pattern.test('a'.repeat(30))).toBe(true)
    expect(pattern.test('ab')).toBe(false)
    expect(pattern.test('a'.repeat(31))).toBe(false)
  })

  it('names every field the registration requires', () => {
    for (const field of discovery.registration.schema.required) {
      expect(brief).toContain(field)
    }
  })

  it('branches on the availability flag so the same text works before and after launch', () => {
    expect(brief).toContain('If registration.available in that file is true')
    expect(brief).toContain('send me the owner_registration_url from the response')
    expect(brief).toContain('If it is false, send me this link')
  })

  it('gives an owner link that prefills the register form once the agent fills in its handle', () => {
    const link = `https://quidkey.com/agents?handle=${OWNER_LINK_PLACEHOLDER}#register`
    expect(brief).toContain(link)
    const filled = new URL(link.replace(OWNER_LINK_PLACEHOLDER, 'quid-pro-quo'))
    expect(filled.hash).toBe('#register')
    expect(handlePrefillMessage(filled.searchParams.get('handle'))).toBe('My agent reserved @quid-pro-quo.')
  })

  it('prefills nothing when an agent leaves the placeholder in the link', () => {
    expect(handlePrefillMessage(OWNER_LINK_PLACEHOLDER)).toBeUndefined()
  })

  it('carries the no-credentials warning the discovery file gives agents', () => {
    expect(brief).toContain('Do not submit credentials, financial details or identity documents')
    expect(brief).toContain('It creates no account and moves no money.')
  })

  it('is plain text with no markdown or HTML for the paste to carry', () => {
    expect(brief).not.toMatch(/[<>*`]/)
    expect(brief).not.toMatch(/^#/m)
    expect(brief.endsWith('\n')).toBe(false)
  })
})
