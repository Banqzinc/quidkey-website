// The registration API as /agents documents it. The endpoint is not live yet;
// the page shows the shape so an agent (or its owner) knows what to expect,
// and public/.well-known/agent-registration.json points at the same URL.

import { bareHandle } from './handle'

export const AGENT_REGISTRATION_ENDPOINT = 'https://core.quidkey.com/api/v1/agents/registrations'

export const EXAMPLE_REQUEST = {
  agent_name: 'quid-pro-quo',
  handle: '@quid-pro-quo',
  use_case: 'Sells research reports and buys market data',
} as const

export const EXAMPLE_RESPONSE = {
  success: true,
  data: {
    registration_id: '3f2b9c14-6d8a-4f1e-9b73-2c5a8e04d61f',
    handle: EXAMPLE_REQUEST.handle,
    handle_status: 'reserved',
    status: 'pending_owner_approval',
    owner_registration_url: `https://quidkey.com/agents?handle=${bareHandle(EXAMPLE_REQUEST.handle)}#register`,
  },
} as const

export function registrationCurl(): string {
  const body = JSON.stringify(EXAMPLE_REQUEST, null, 2).replace(/\n/g, '\n  ')
  return `curl -X POST ${AGENT_REGISTRATION_ENDPOINT} \\\n  -H 'Content-Type: application/json' \\\n  -d '${body}'`
}

export function exampleResponseJson(): string {
  return `201 Created\n${JSON.stringify(EXAMPLE_RESPONSE, null, 2)}`
}
