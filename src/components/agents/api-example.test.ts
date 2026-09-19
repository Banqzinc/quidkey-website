import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import {
  AGENT_REGISTRATION_ENDPOINT,
  EXAMPLE_REQUEST,
  EXAMPLE_RESPONSE,
  registrationCurl,
} from './api-example'

const DISCOVERY_FILE = new URL('../../../public/.well-known/agent-registration.json', import.meta.url)

describe('registration API example', () => {
  it('posts to the core host', () => {
    expect(AGENT_REGISTRATION_ENDPOINT).toBe('https://core.quidkey.com/api/v1/agents/registrations')
    expect(registrationCurl()).toContain(`curl -X POST ${AGENT_REGISTRATION_ENDPOINT}`)
  })

  it('shows a request whose handle the response echoes back, with no account created', () => {
    expect(EXAMPLE_RESPONSE.handle).toBe(EXAMPLE_REQUEST.handle)
    expect(EXAMPLE_RESPONSE.status).toBe('pending_owner_approval')
    expect(EXAMPLE_RESPONSE.financial_account_created).toBe(false)
  })

  it('matches the machine-readable discovery file agents fetch', () => {
    const discovery = JSON.parse(readFileSync(DISCOVERY_FILE, 'utf8'))
    expect(discovery.registration.url).toBe(AGENT_REGISTRATION_ENDPOINT)
    expect(discovery.registration.available).toBe(false)
    expect(discovery.register_interest.url).toBe('https://quidkey.com/agents#register')
  })
})
