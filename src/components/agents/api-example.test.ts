import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import {
  AGENT_REGISTRATION_ENDPOINT,
  EXAMPLE_REQUEST,
  EXAMPLE_RESPONSE,
  exampleResponseJson,
  registrationCurl,
} from './api-example'

const DISCOVERY_FILE = new URL('../../../public/.well-known/agent-registration.json', import.meta.url)

describe('registration API example', () => {
  it('posts to the core host', () => {
    expect(AGENT_REGISTRATION_ENDPOINT).toBe('https://core.quidkey.com/api/v1/agents/registrations')
    expect(registrationCurl()).toContain(`curl -X POST ${AGENT_REGISTRATION_ENDPOINT}`)
  })

  it('shows a 201 whose handle echoes the request, reserved and awaiting the owner', () => {
    expect(EXAMPLE_RESPONSE.handle).toBe(EXAMPLE_REQUEST.handle)
    expect(EXAMPLE_RESPONSE.handle_status).toBe('reserved')
    expect(EXAMPLE_RESPONSE.status).toBe('pending_owner_approval')
    expect(exampleResponseJson()).toContain('201 Created')
  })

  it('points the owner at the page, handle in the query and the register anchor', () => {
    expect(EXAMPLE_RESPONSE.owner_registration_url).toBe(
      'https://quidkey.com/agents?handle=quid-pro-quo#register'
    )
    const url = new URL(EXAMPLE_RESPONSE.owner_registration_url)
    expect(`${url.host}${url.pathname}`).toBe('quidkey.com/agents')
    expect(url.searchParams.get('handle')).toBe('quid-pro-quo')
    expect(url.hash).toBe('#register')
  })

  it('returns nothing beyond the five documented fields', () => {
    expect(Object.keys(EXAMPLE_RESPONSE)).toEqual([
      'registration_id',
      'handle',
      'handle_status',
      'status',
      'owner_registration_url',
    ])
    expect(exampleResponseJson()).not.toContain('owner_onboarding_url')
  })

  it('matches the machine-readable discovery file agents fetch', () => {
    const discovery = JSON.parse(readFileSync(DISCOVERY_FILE, 'utf8'))
    expect(discovery.registration.url).toBe(AGENT_REGISTRATION_ENDPOINT)
    expect(discovery.registration.available).toBe(false)
    expect(Object.keys(discovery.registration.response.fields)).toEqual(Object.keys(EXAMPLE_RESPONSE))
    expect(Object.keys(discovery.registration.response.status_codes)).toEqual([
      '201',
      '400',
      '409',
      '429',
    ])
    expect(discovery.register_interest.url).toBe('https://quidkey.com/agents#register')
    expect(discovery.register_interest.note).toContain('owner_registration_url')
  })
})
