import { describe, expect, it } from 'vitest'

import { DEFAULTS, parseSearch } from './calculator-params'

describe('parseSearch', () => {
  it('passes valid params through (string values, as they arrive from a URL)', () => {
    expect(
      parseSearch({
        region: 'US',
        domestic: '120000',
        intl: '0',
        aov: '80',
        plan: 'advanced',
        thirdParty: '1',
      })
    ).toEqual({
      region: 'US',
      domestic: 120000,
      intl: 0,
      aov: 80,
      plan: 'advanced',
      thirdParty: true,
    })
  })

  it('fills missing keys with defaults', () => {
    expect(parseSearch({})).toEqual(DEFAULTS)
  })

  it('falls back on junk enums, non-numbers, and blanks', () => {
    const r = parseSearch({ region: 'ZZ', plan: 'zzz', domestic: 'abc', intl: '', aov: 'NaN' })
    expect(r.region).toBe('AU')
    expect(r.plan).toBe('plus')
    expect(r.domestic).toBe(DEFAULTS.domestic)
    expect(r.intl).toBe(DEFAULTS.intl)
    expect(r.aov).toBe(DEFAULTS.aov)
  })

  it('treats negative amounts as junk (→ defaults) but keeps an explicit zero', () => {
    const r = parseSearch({ domestic: '-100', intl: -5, aov: '0' })
    expect(r.domestic).toBe(DEFAULTS.domestic)
    expect(r.intl).toBe(DEFAULTS.intl)
    expect(r.aov).toBe(0)
  })

  it('coerces the thirdParty boolean from URL/string/number forms', () => {
    expect(parseSearch({ thirdParty: 'true' }).thirdParty).toBe(true)
    expect(parseSearch({ thirdParty: '1' }).thirdParty).toBe(true)
    expect(parseSearch({ thirdParty: true }).thirdParty).toBe(true)
    expect(parseSearch({ thirdParty: '0' }).thirdParty).toBe(false)
    expect(parseSearch({ thirdParty: 'false' }).thirdParty).toBe(false)
    expect(parseSearch({}).thirdParty).toBe(false)
  })
})
