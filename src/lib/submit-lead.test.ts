import { describe, expect, it } from 'vitest'

import { buildHubspotPayload, isBot, isValidEmail, normalizeEmail } from './submit-lead'

describe('normalizeEmail', () => {
  it('trims and lowercases', () => {
    expect(normalizeEmail('  Rabea@Quidkey.COM  ')).toBe('rabea@quidkey.com')
  })

  it('returns an empty string for non-string input', () => {
    expect(normalizeEmail(undefined)).toBe('')
    expect(normalizeEmail(null)).toBe('')
    expect(normalizeEmail(42)).toBe('')
  })
})

describe('isValidEmail', () => {
  it('accepts ordinary work addresses', () => {
    expect(isValidEmail('rabea@quidkey.com')).toBe(true)
    expect(isValidEmail('first.last+tag@sub.example.co.au')).toBe(true)
  })

  it('rejects malformed addresses', () => {
    expect(isValidEmail('')).toBe(false)
    expect(isValidEmail('nope')).toBe(false)
    expect(isValidEmail('no@domain')).toBe(false)
    expect(isValidEmail('no domain@example.com')).toBe(false)
    expect(isValidEmail('@example.com')).toBe(false)
  })

  it('rejects addresses beyond the 254-character limit', () => {
    expect(isValidEmail(`${'a'.repeat(250)}@example.com`)).toBe(false)
  })
})

describe('isBot', () => {
  it('treats a filled honeypot as a bot', () => {
    expect(isBot('http://spam.example')).toBe(true)
  })

  it('treats empty, blank, and missing honeypots as human', () => {
    expect(isBot('')).toBe(false)
    expect(isBot('   ')).toBe(false)
    expect(isBot(undefined)).toBe(false)
  })
})

describe('buildHubspotPayload', () => {
  const input = { email: 'rabea@quidkey.com', turnover: 500_000, rate: 1.4 }

  it('maps the lead and its calculator context to HubSpot form fields', () => {
    const payload = buildHubspotPayload(input, 'https://quidkey.com/surcharge-calculator')
    expect(payload.fields).toEqual([
      { name: 'email', value: 'rabea@quidkey.com' },
      { name: 'monthly_card_turnover', value: '500000' },
      { name: 'average_card_fee_rate', value: '1.4' },
      { name: 'marketing_consent', value: 'false' },
    ])
    expect(payload.context.pageUri).toBe('https://quidkey.com/surcharge-calculator')
    expect(payload.context.pageName).toBe('Surcharge ban calculator')
  })

  it('records an explicit marketing opt-in', () => {
    const payload = buildHubspotPayload(
      { ...input, marketingConsent: true },
      'https://quidkey.com/surcharge-calculator',
    )
    expect(payload.fields).toContainEqual({ name: 'marketing_consent', value: 'true' })
  })

  it('defaults consent to false when the visitor left the box unticked', () => {
    const payload = buildHubspotPayload(
      { ...input, marketingConsent: undefined },
      'https://quidkey.com/surcharge-calculator',
    )
    expect(payload.fields).toContainEqual({ name: 'marketing_consent', value: 'false' })
  })
})
