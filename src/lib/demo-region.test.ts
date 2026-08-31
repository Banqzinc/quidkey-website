import { describe, expect, it } from 'vitest'

import { DEFAULT_REGION, KNOWN_REGIONS, isDemoRegion } from './demo-region'

describe('isDemoRegion', () => {
  it('accepts only the exact region codes', () => {
    for (const region of KNOWN_REGIONS) {
      expect(isDemoRegion(region)).toBe(true)
    }
    expect(isDemoRegion('au')).toBe(false)
    expect(isDemoRegion('FR')).toBe(false)
    expect(isDemoRegion('')).toBe(false)
    expect(isDemoRegion(null)).toBe(false)
    expect(isDemoRegion(undefined)).toBe(false)
  })
})

describe('KNOWN_REGIONS', () => {
  it('leads with the default region — the switcher renders in this order', () => {
    expect(KNOWN_REGIONS[0]).toBe(DEFAULT_REGION)
  })

  it('covers all four markets, with no duplicates', () => {
    expect([...KNOWN_REGIONS].sort()).toEqual(['AU', 'EU', 'UK', 'US'])
  })
})
