import { describe, expect, it } from 'vitest'

import { CONTACT_LIMITS, buildContactPayload, safePagePath, validateContact } from './submit-contact'

const valid = {
  name: 'Rabea Bader',
  email: 'Rabea@Quidkey.com',
  company: 'Quidkey',
  message: 'We convert about $2m a month.\nMostly USD to AUD.',
  topic: 'fx_high_volume',
}

describe('validateContact', () => {
  it('accepts a complete message and normalises it', () => {
    const result = validateContact({ ...valid, name: '  Rabea   Bader ', company: ' Quidkey  Ltd ' })
    expect(result).toEqual({
      ok: true,
      value: {
        name: 'Rabea Bader',
        email: 'rabea@quidkey.com',
        company: 'Quidkey Ltd',
        message: 'We convert about $2m a month.\nMostly USD to AUD.',
        topic: 'fx_high_volume',
      },
    })
  })

  it('keeps line breaks inside the message but trims its edges', () => {
    const result = validateContact({ ...valid, message: '\n  line one\n\nline two  \n' })
    expect(result.ok && result.value.message).toBe('line one\n\nline two')
  })

  it('treats company as optional', () => {
    const result = validateContact({ ...valid, company: undefined })
    expect(result.ok && result.value.company).toBe('')
  })

  it('names the first failing field', () => {
    expect(validateContact({ ...valid, name: '   ' })).toEqual({ ok: false, field: 'name' })
    expect(validateContact({ ...valid, email: 'not-an-email' })).toEqual({ ok: false, field: 'email' })
    expect(validateContact({ ...valid, message: '' })).toEqual({ ok: false, field: 'message' })
  })

  it('caps over-long fields instead of rejecting the whole message', () => {
    const result = validateContact({
      ...valid,
      name: 'x'.repeat(CONTACT_LIMITS.name + 50),
      message: 'y'.repeat(CONTACT_LIMITS.message + 50),
    })
    expect(result.ok && result.value.name.length).toBe(CONTACT_LIMITS.name)
    expect(result.ok && result.value.message.length).toBe(CONTACT_LIMITS.message)
  })

  it('falls back to the general topic when the hidden field is tampered with', () => {
    const result = validateContact({ ...valid, topic: '<script>' })
    expect(result.ok && result.value.topic).toBe('general')
  })
})

describe('safePagePath', () => {
  it('keeps an ordinary same-site path', () => {
    expect(safePagePath('/fx-savings')).toBe('/fx-savings')
  })

  it('drops the query string so nothing personal leaks into HubSpot page context', () => {
    expect(safePagePath('/surcharge-calculator?turnover=500000')).toBe('/surcharge-calculator')
  })

  it('falls back to the root for anything that is not a same-site path', () => {
    expect(safePagePath('')).toBe('/')
    expect(safePagePath(undefined)).toBe('/')
    expect(safePagePath('https://evil.example/')).toBe('/')
    expect(safePagePath('//evil.example')).toBe('/')
    expect(safePagePath(`/${'a'.repeat(300)}`)).toBe('/')
  })
})

describe('buildContactPayload', () => {
  const value = {
    name: 'Rabea Bader',
    email: 'rabea@quidkey.com',
    company: 'Quidkey',
    message: 'Hello',
    topic: 'fx_high_volume' as const,
  }

  it('maps the message to HubSpot form fields with the human-readable topic', () => {
    const payload = buildContactPayload(value, 'https://quidkey.com/fx-savings')
    expect(payload.fields).toEqual([
      { name: 'firstname', value: 'Rabea Bader' },
      { name: 'email', value: 'rabea@quidkey.com' },
      { name: 'company', value: 'Quidkey' },
      { name: 'message', value: 'Hello' },
      { name: 'contact_topic', value: 'FX: high volume' },
    ])
    expect(payload.context).toEqual({ pageUri: 'https://quidkey.com/fx-savings', pageName: 'Contact' })
  })

  it('omits the company field when the visitor left it blank', () => {
    const payload = buildContactPayload({ ...value, company: '' }, 'https://quidkey.com/contact')
    expect(payload.fields.map((f) => f.name)).toEqual(['firstname', 'email', 'message', 'contact_topic'])
  })
})
