import { describe, expect, it } from 'vitest'

import { KNOWN_REGIONS } from '@/lib/demo-region'

import { DEMO_LOCALES, bankLogoUrl } from './demo-locales'

describe('DEMO_LOCALES', () => {
  it('has a pack for every known region, keyed correctly', () => {
    for (const region of KNOWN_REGIONS) {
      expect(DEMO_LOCALES[region]).toBeTruthy()
      expect(DEMO_LOCALES[region].region).toBe(region)
    }
  })

  it('keeps each pack internally consistent with what the demo reads', () => {
    for (const region of KNOWN_REGIONS) {
      const locale = DEMO_LOCALES[region]
      expect(locale.banks.length).toBeGreaterThanOrEqual(4)
      for (const bank of locale.banks) {
        expect(bank.name).toBeTruthy()
        expect(bank.domain).toMatch(/\./)
        expect(bank.brandColor).toMatch(/^#[0-9a-fA-F]{6}$/)
      }
      // Exactly one authorise mode: a "Pay from" account picker or a PayID.
      const hasAccounts = (locale.accounts?.length ?? 0) >= 1
      const hasPayId = Boolean(locale.payId)
      expect(hasAccounts !== hasPayId).toBe(true)
      expect(locale.price).toBeTruthy()
      expect(locale.save).toBeTruthy()
      expect(locale.customer.name).toBeTruthy()
      expect(locale.customer.postcode).toBeTruthy()
      expect(locale.customer.email).toBeTruthy()
    }
  })

  it('predicts the expected bank per region (banks[0])', () => {
    expect(DEMO_LOCALES.US.banks[0].name).toBe('Chase')
    expect(DEMO_LOCALES.AU.banks[0].name).toBe('CommBank')
  })

  it('authorises via account picker for US and PayID for AU', () => {
    expect(DEMO_LOCALES.US.accounts?.length).toBeGreaterThanOrEqual(1)
    expect(DEMO_LOCALES.US.payId).toBeUndefined()
    expect(DEMO_LOCALES.AU.payId).toBeTruthy()
    expect(DEMO_LOCALES.AU.accounts).toBeUndefined()
  })
})

describe('bankLogoUrl', () => {
  it('builds a logo.dev URL with the token', () => {
    const url = bankLogoUrl('commbank.com.au')
    expect(url).toContain('img.logo.dev/commbank.com.au')
    expect(url).toContain('token=')
  })
})
