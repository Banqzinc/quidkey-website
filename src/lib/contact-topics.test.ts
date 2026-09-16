import { describe, expect, it } from 'vitest'

import { CONTACT_TOPICS, contactPath, isContactTopic, parseTopic } from './contact-topics'

describe('parseTopic', () => {
  it('returns a known topic unchanged', () => {
    expect(parseTopic('fx_high_volume')).toBe('fx_high_volume')
    expect(parseTopic('pricing_high_volume')).toBe('pricing_high_volume')
  })

  it('falls back to the general topic for anything unknown', () => {
    // The topic arrives from a hidden field and from the URL, so it must never
    // be trusted as free text.
    expect(parseTopic('nope')).toBe('general')
    expect(parseTopic(undefined)).toBe('general')
    expect(parseTopic(42)).toBe('general')
    expect(parseTopic('')).toBe('general')
  })
})

describe('isContactTopic', () => {
  it('narrows only to allowlisted keys', () => {
    expect(isContactTopic('fx')).toBe(true)
    expect(isContactTopic('__proto__')).toBe(false)
    expect(isContactTopic('constructor')).toBe(false)
  })
})

describe('CONTACT_TOPICS', () => {
  it('gives every topic a heading, a prompt, and a HubSpot label', () => {
    for (const copy of Object.values(CONTACT_TOPICS)) {
      expect(copy.heading.trim().length).toBeGreaterThan(0)
      expect(copy.prompt.trim().length).toBeGreaterThan(0)
      expect(copy.label.trim().length).toBeGreaterThan(0)
    }
  })
})

describe('contactPath', () => {
  it('keeps the general topic off the URL so the bare link stays bare', () => {
    expect(contactPath('general')).toBe('/contact')
  })

  it('carries any other topic as a search param', () => {
    expect(contactPath('fx_high_volume')).toBe('/contact?topic=fx_high_volume')
  })
})
