import { describe, expect, it } from 'vitest'

import type { AgentsLaunch } from './agents-launch'
import { CONTACT_TOPICS, contactPath, isContactTopic, parseTopic } from './contact-topics'

const hidden: AgentsLaunch = { live: false, previewToken: 't' }
const live: AgentsLaunch = { live: true, previewToken: 't' }

describe('parseTopic', () => {
  it('returns a known topic unchanged', () => {
    expect(parseTopic('fx_high_volume')).toBe('fx_high_volume')
    expect(parseTopic('pricing_high_volume')).toBe('pricing_high_volume')
    expect(parseTopic('marketplace')).toBe('marketplace')
  })

  it('keeps the agents topic only while the agents page is live', () => {
    // The topic's page carries the "Register your agent" heading, so it must
    // not be reachable by URL while the page itself is hidden. The form on the
    // hidden page's preview still submits it: this guards the URL, not the field.
    expect(parseTopic('agents', live)).toBe('agents')
    expect(parseTopic('agents', hidden)).toBe('general')
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
    expect(contactPath('marketplace')).toBe('/contact?topic=marketplace')
  })
})

describe('CONTACT_TOPICS page metadata', () => {
  it('gives every topic its own page title', () => {
    const titles = Object.values(CONTACT_TOPICS).map((copy) => copy.title)

    for (const title of titles) expect(title.trim().length).toBeGreaterThan(0)
    expect(new Set(titles).size).toBe(titles.length)
  })

  it('gives every topic its own meta description at a length search engines show in full', () => {
    const descriptions = Object.values(CONTACT_TOPICS).map((copy) => copy.description)

    for (const description of descriptions) {
      expect(description.length).toBeGreaterThanOrEqual(120)
      expect(description.length).toBeLessThanOrEqual(160)
    }
    expect(new Set(descriptions).size).toBe(descriptions.length)
  })
})

describe('agents topic', () => {
  it('is an allowlisted topic with its own contact path', () => {
    // Allowlisted regardless of the launch switch: the hidden page's preview
    // form submits it. Its page is reachable by URL only once live (see parseTopic).
    expect(isContactTopic('agents')).toBe(true)
    expect(parseTopic('agents', live)).toBe('agents')
    expect(contactPath('agents')).toBe('/contact?topic=agents')
  })
})
