import { describe, expect, it } from 'vitest'

import { isDemoRegion, normalizeCountryToRegion, parseRegionOverride } from './demo-region'

describe('normalizeCountryToRegion', () => {
  it('maps AU (any case / surrounding whitespace) to AU', () => {
    expect(normalizeCountryToRegion('AU')).toBe('AU')
    expect(normalizeCountryToRegion('au')).toBe('AU')
    expect(normalizeCountryToRegion('  Au ')).toBe('AU')
  })

  it('maps every other country (and empty input) to the US default', () => {
    for (const code of ['US', 'GB', 'NZ', 'DE', 'XX', '', null, undefined]) {
      expect(normalizeCountryToRegion(code)).toBe('US')
    }
  })
})

describe('parseRegionOverride', () => {
  it('reads ?demo= case-insensitively, with or without a leading ?', () => {
    expect(parseRegionOverride('?demo=AU')).toBe('AU')
    expect(parseRegionOverride('demo=au')).toBe('AU')
    expect(parseRegionOverride('?foo=1&demo=US')).toBe('US')
  })

  it('returns null for missing or unrecognised values', () => {
    expect(parseRegionOverride('')).toBeNull()
    expect(parseRegionOverride('?x=1')).toBeNull()
    expect(parseRegionOverride('?demo=FR')).toBeNull()
    expect(parseRegionOverride('?demo=')).toBeNull()
    expect(parseRegionOverride(null)).toBeNull()
    expect(parseRegionOverride(undefined)).toBeNull()
  })
})

describe('isDemoRegion', () => {
  it('accepts only the exact region codes', () => {
    expect(isDemoRegion('US')).toBe(true)
    expect(isDemoRegion('AU')).toBe(true)
    expect(isDemoRegion('us')).toBe(false)
    expect(isDemoRegion('FR')).toBe(false)
    expect(isDemoRegion(null)).toBe(false)
    expect(isDemoRegion(undefined)).toBe(false)
  })
})
