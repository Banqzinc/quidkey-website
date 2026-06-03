import { describe, expect, it } from 'vitest'

import {
  isDemoRegion,
  normalizeCountryToRegion,
  parseRegionOverride,
  regionFromHeaders,
} from './demo-region'

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

describe('regionFromHeaders', () => {
  const fromMap =
    (map: Record<string, string>) =>
    (name: string): string | null =>
      map[name] ?? null

  it('reads cf-ipcountry first (Cloudflare / production)', () => {
    expect(regionFromHeaders(fromMap({ 'cf-ipcountry': 'AU' }))).toEqual({ region: 'AU', source: 'header' })
    expect(regionFromHeaders(fromMap({ 'cf-ipcountry': 'US' }))).toEqual({ region: 'US', source: 'header' })
  })

  it('ignores cf-ipcountry placeholders (XX unknown, T1 Tor)', () => {
    expect(regionFromHeaders(fromMap({ 'cf-ipcountry': 'XX' }))).toEqual({ region: 'US', source: 'default' })
    expect(regionFromHeaders(fromMap({ 'cf-ipcountry': 'T1' }))).toEqual({ region: 'US', source: 'default' })
  })

  it('falls back to Netlify x-nf-geo (base64 JSON)', () => {
    const geo = btoa(JSON.stringify({ country: { code: 'AU' } }))
    expect(regionFromHeaders(fromMap({ 'x-nf-geo': geo }))).toEqual({ region: 'AU', source: 'header' })
  })

  it('falls back to x-country', () => {
    expect(regionFromHeaders(fromMap({ 'x-country': 'au' }))).toEqual({ region: 'AU', source: 'header' })
  })

  it('prefers cf-ipcountry over Netlify headers', () => {
    const geo = btoa(JSON.stringify({ country: { code: 'US' } }))
    expect(regionFromHeaders(fromMap({ 'cf-ipcountry': 'AU', 'x-nf-geo': geo }))).toEqual({
      region: 'AU',
      source: 'header',
    })
  })

  it('returns the US default when no usable header is present', () => {
    expect(regionFromHeaders(fromMap({}))).toEqual({ region: 'US', source: 'default' })
    expect(regionFromHeaders(fromMap({ 'x-nf-geo': 'not-base64!!' }))).toEqual({ region: 'US', source: 'default' })
  })
})
