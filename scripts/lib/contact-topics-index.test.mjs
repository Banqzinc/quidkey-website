import { readFile } from 'node:fs/promises'

import { describe, expect, it } from 'vitest'

import { parseContactTopics } from './contact-topics-index.mjs'

const SAMPLE = `
export const CONTACT_TOPIC_KEYS = [
  'general',
  'fx',
  'marketplace',
] as const

export const DEFAULT_TOPIC: ContactTopic = 'general'
`

describe('parseContactTopics', () => {
  it('reads the topic keys and which one is the default', () => {
    expect(parseContactTopics(SAMPLE)).toEqual({ keys: ['general', 'fx', 'marketplace'], defaultTopic: 'general' })
  })

  it('ignores comments inside the array and refuses an entry it cannot read', () => {
    const commented = SAMPLE.replace("  'fx',\n", "  // 'legacy' was folded into general\n  'fx', /* the FX check */\n")
    expect(parseContactTopics(commented).keys).toEqual(['general', 'fx', 'marketplace'])

    const odd = SAMPLE.replace("  'fx',\n", "  'fx-provider',\n")
    expect(parseContactTopics(odd).keys).toEqual(['general', 'fx-provider', 'marketplace'])

    const broken = SAMPLE.replace("  'fx',\n", "  fx,\n")
    expect(() => parseContactTopics(broken)).toThrow(/fx/)
  })

  it('refuses a source it cannot read rather than emitting an empty list', () => {
    expect(() => parseContactTopics('export const OTHER = []')).toThrow(/CONTACT_TOPIC_KEYS/)
    expect(() => parseContactTopics(SAMPLE.replace(/export const DEFAULT_TOPIC.*\n/, ''))).toThrow(/DEFAULT_TOPIC/)
  })

  it('indexes the real topics file', async () => {
    const source = await readFile(new URL('../../src/lib/contact-topics.ts', import.meta.url), 'utf8')
    const { keys, defaultTopic } = parseContactTopics(source)

    expect(keys).toContain(defaultTopic)
    expect(keys.length).toBeGreaterThan(1)
  })
})
