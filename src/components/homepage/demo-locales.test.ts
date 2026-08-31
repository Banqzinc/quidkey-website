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
      // The authorise mode and the accounts list have to agree: a PayTo
      // market approves an agreement and has no account picker.
      const hasAccounts = (locale.accounts?.length ?? 0) >= 1
      expect(hasAccounts).toBe(locale.authorise !== 'payto')
      expect(locale.phone).toBeTruthy()
      expect(locale.currencyCode).toMatch(/^[A-Z]{3}$/)
      expect(locale.price).toBeTruthy()
      expect(locale.save).toBeTruthy()
      expect(locale.customer.name).toBeTruthy()
      expect(locale.customer.postcode).toBeTruthy()
      expect(locale.customer.email).toBeTruthy()
    }
  })

  it('predicts the expected bank per region (banks[0])', () => {
    expect(DEMO_LOCALES.AU.banks[0].name).toBe('CommBank')
    expect(DEMO_LOCALES.UK.banks[0].name).toBe('Monzo')
    expect(DEMO_LOCALES.EU.banks[0].name).toBe('Deutsche Bank')
    expect(DEMO_LOCALES.US.banks[0].name).toBe('Chase')
  })

  it('authorises per market: PayTo in AU, account picker in UK/EU, account access in the US', () => {
    expect(DEMO_LOCALES.AU.authorise).toBe('payto')
    expect(DEMO_LOCALES.AU.accounts).toBeUndefined()
    for (const region of ['UK', 'EU'] as const) {
      expect(DEMO_LOCALES[region].authorise).toBe('accounts')
      expect(DEMO_LOCALES[region].accounts?.length).toBeGreaterThanOrEqual(1)
    }
    // The US bank leg connects accounts; at least one must be pre-connected
    // or Quidkey's picker would come up empty.
    expect(DEMO_LOCALES.US.authorise).toBe('connect')
    expect(DEMO_LOCALES.US.accounts?.some((a) => a.connected)).toBe(true)
  })

  it('gives every market its own currency', () => {
    const codes = KNOWN_REGIONS.map((r) => DEMO_LOCALES[r].currencyCode)
    expect(new Set(codes).size).toBe(codes.length)
  })
})

describe('bankLogoUrl', () => {
  it('builds a logo.dev URL with the token', () => {
    const url = bankLogoUrl('commbank.com.au')
    expect(url).toContain('img.logo.dev/commbank.com.au')
    expect(url).toContain('token=')
  })
})
