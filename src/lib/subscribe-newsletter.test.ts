import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  buildMailchimpMember,
  mailchimpDataCenter,
  mailchimpMembersUrl,
  mapMailchimpRejection,
  postMailchimpMember,
  resolveMailchimpConfig,
} from './subscribe-newsletter'

// Email validation and the honeypot are shared with the HubSpot forms and
// covered in hubspot-forms.test.ts. This file covers the Mailchimp side.

describe('mailchimpDataCenter', () => {
  it('reads the data centre from the API key suffix', () => {
    // Not shaped like a real key on purpose: GitHub push protection flags
    // anything that looks like "<32 hex>-usNN", even in a test.
    expect(mailchimpDataCenter('example-key-us21')).toBe('us21')
  })

  it('returns null when the key carries no data centre', () => {
    expect(mailchimpDataCenter('')).toBeNull()
    expect(mailchimpDataCenter('examplekeywithoutsuffix')).toBeNull()
    expect(mailchimpDataCenter('not-a-real-key')).toBeNull()
  })
})

describe('mailchimpMembersUrl', () => {
  it('targets the audience members collection on the data centre from the key', () => {
    expect(mailchimpMembersUrl('us21', 'abc123')).toBe('https://us21.api.mailchimp.com/3.0/lists/abc123/members')
  })
})

describe('buildMailchimpMember', () => {
  it('subscribes the member immediately and tags the source', () => {
    expect(buildMailchimpMember('rabea@quidkey.com')).toEqual({
      email_address: 'rabea@quidkey.com',
      status: 'subscribed',
      tags: ['Website footer'],
    })
  })
})

describe('resolveMailchimpConfig', () => {
  it('returns null when the key or the audience is missing', () => {
    expect(resolveMailchimpConfig({})).toBeNull()
    expect(resolveMailchimpConfig({ MAILCHIMP_API_KEY: 'key-us21' })).toBeNull()
    expect(resolveMailchimpConfig({ MAILCHIMP_AUDIENCE_ID: 'abc123' })).toBeNull()
  })

  it('returns null when the key carries no data centre', () => {
    expect(resolveMailchimpConfig({ MAILCHIMP_API_KEY: 'nodc', MAILCHIMP_AUDIENCE_ID: 'abc123' })).toBeNull()
  })

  it('derives the data centre from the key', () => {
    expect(resolveMailchimpConfig({ MAILCHIMP_API_KEY: 'key-us21', MAILCHIMP_AUDIENCE_ID: 'abc123' })).toEqual({
      apiKey: 'key-us21',
      audienceId: 'abc123',
      dc: 'us21',
    })
  })
})

describe('mapMailchimpRejection', () => {
  it('treats an address that is already in the audience as subscribed', () => {
    expect(mapMailchimpRejection(400, { title: 'Member Exists' })).toBe('already_member')
  })

  it('blames the address when Mailchimp calls it fake or invalid', () => {
    expect(
      mapMailchimpRejection(400, {
        title: 'Invalid Resource',
        detail: 'nobody@example looks fake or invalid, please enter a real email address.',
      }),
    ).toBe('invalid_email')
  })

  it('treats every other rejection as our problem', () => {
    expect(mapMailchimpRejection(400, { title: 'Forgotten Email Not Subscribed' })).toBe('server')
    expect(mapMailchimpRejection(401, { title: 'API Key Invalid' })).toBe('server')
    expect(mapMailchimpRejection(500, {})).toBe('server')
  })
})

describe('postMailchimpMember', () => {
  const config = { apiKey: 'key-us21', audienceId: 'abc123', dc: 'us21' }

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('adds the member with basic auth and the fixed payload', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{"status":"subscribed"}', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    const result = await postMailchimpMember(config, 'rabea@quidkey.com', '[test]')

    expect(result).toEqual({ ok: true })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('https://us21.api.mailchimp.com/3.0/lists/abc123/members')
    expect(init.method).toBe('POST')
    expect((init.headers as Record<string, string>).authorization).toBe(
      `Basic ${Buffer.from('anystring:key-us21').toString('base64')}`,
    )
    expect((init.headers as Record<string, string>)['content-type']).toBe('application/json')
    expect(JSON.parse(init.body as string)).toEqual(buildMailchimpMember('rabea@quidkey.com'))
    expect(init.signal).toBeInstanceOf(AbortSignal)
  })

  it('reports success without logging when the address is already a member', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ title: 'Member Exists', detail: 'x is already a list member.' }), {
          status: 400,
        }),
      ),
    )

    const result = await postMailchimpMember(config, 'rabea@quidkey.com', '[test]')

    expect(result).toEqual({ ok: true })
    expect(console.error).not.toHaveBeenCalled()
  })

  it('reports an invalid address when Mailchimp rejects it as fake', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            title: 'Invalid Resource',
            detail: 'x looks fake or invalid, please enter a real email address.',
          }),
          { status: 400 },
        ),
      ),
    )

    const result = await postMailchimpMember(config, 'x@example.test', '[test]')

    expect(result).toEqual({ ok: false, error: 'invalid_email' })
  })

  it('reports a server error and logs the body when Mailchimp rejects for another reason', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ title: 'API Key Invalid', detail: 'Your API key may be invalid' }), {
          status: 401,
        }),
      ),
    )

    const result = await postMailchimpMember(config, 'rabea@quidkey.com', '[test]')

    expect(result).toEqual({ ok: false, error: 'server' })
    expect(console.error).toHaveBeenCalledWith(
      '[test] Mailchimp rejected the subscription',
      expect.objectContaining({ status: 401, title: 'API Key Invalid' }),
    )
  })

  it('reports a server error when the request itself fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('timeout')))

    const result = await postMailchimpMember(config, 'rabea@quidkey.com', '[test]')

    expect(result).toEqual({ ok: false, error: 'server' })
    expect(console.error).toHaveBeenCalled()
  })
})
