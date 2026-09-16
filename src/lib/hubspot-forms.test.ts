import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  hubspotEndpoint,
  isBot,
  isValidEmail,
  normalizeEmail,
  postHubspotForm,
  resolveHubspotForm,
} from './hubspot-forms'

describe('hubspotEndpoint', () => {
  it('defaults to the EU forms host, because the Quidkey portal is EU-hosted', () => {
    // A US-host submission from an EU portal is rejected, so this default matters.
    expect(hubspotEndpoint('145375174', 'abc-123')).toBe(
      'https://api-eu1.hsforms.com/submissions/v3/integration/submit/145375174/abc-123',
    )
  })

  it('honours an explicit host override', () => {
    expect(hubspotEndpoint('1', '2', 'api.hsforms.com')).toBe(
      'https://api.hsforms.com/submissions/v3/integration/submit/1/2',
    )
  })
})

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

describe('resolveHubspotForm', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns null when the portal id is missing', () => {
    vi.stubEnv('HUBSPOT_PORTAL_ID', '')
    expect(resolveHubspotForm('form-guid')).toBeNull()
  })

  it('returns null when the form guid is empty or undefined', () => {
    vi.stubEnv('HUBSPOT_PORTAL_ID', '145375174')
    expect(resolveHubspotForm('')).toBeNull()
    expect(resolveHubspotForm(undefined)).toBeNull()
  })

  it('returns the portal, guid, and optional host override when configured', () => {
    vi.stubEnv('HUBSPOT_PORTAL_ID', '145375174')
    vi.stubEnv('HUBSPOT_FORMS_HOST', 'api.hsforms.com')
    expect(resolveHubspotForm('form-guid')).toEqual({
      portalId: '145375174',
      formGuid: 'form-guid',
      host: 'api.hsforms.com',
    })
  })
})

describe('postHubspotForm', () => {
  const config = { portalId: '145375174', formGuid: 'form-guid', host: undefined }
  const payload = {
    fields: [{ name: 'email', value: 'rabea@quidkey.com' }],
    context: { pageUri: 'https://quidkey.com/contact', pageName: 'Contact' },
  }

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('posts the payload as JSON to the EU endpoint and reports success on 2xx', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    const result = await postHubspotForm(config, payload, '[test]')

    expect(result).toEqual({ ok: true })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe(
      'https://api-eu1.hsforms.com/submissions/v3/integration/submit/145375174/form-guid',
    )
    expect(init.method).toBe('POST')
    expect((init.headers as Record<string, string>)['content-type']).toBe('application/json')
    expect(JSON.parse(init.body as string)).toEqual(payload)
    expect(init.signal).toBeInstanceOf(AbortSignal)
  })

  it('reports a server error and logs the body when HubSpot rejects the submission', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('field not in form', { status: 400 })),
    )

    const result = await postHubspotForm(config, payload, '[test]')

    expect(result).toEqual({ ok: false, error: 'server' })
    expect(console.error).toHaveBeenCalledWith(
      '[test] HubSpot rejected the submission',
      expect.objectContaining({ status: 400, body: 'field not in form' }),
    )
  })

  it('reports a server error when the request itself fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('timeout')))

    const result = await postHubspotForm(config, payload, '[test]')

    expect(result).toEqual({ ok: false, error: 'server' })
    expect(console.error).toHaveBeenCalled()
  })
})
