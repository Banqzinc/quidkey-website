import { describe, expect, it } from 'vitest'

import { buildHubspotPayload } from './submit-lead'

// The shared HubSpot plumbing (endpoint, email validation, honeypot, POST) is
// covered in hubspot-forms.test.ts. This file only covers the calculator's
// own field mapping.
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
