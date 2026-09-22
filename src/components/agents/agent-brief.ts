// The brief an owner copies from /agents and pastes into their own agent. It
// is plain text, addressed to the agent, and sends it to the page in markdown
// for the offering and to the discovery file for the API, rather than
// restating either, so those two stay the single sources of truth.
// It branches on registration.available, so the same text is right before and
// after the endpoint goes live: until then the agent hands its owner the
// register-form link with its handle in the query, which the form prefills.

import { ownerRegistrationUrl } from './handle'

export const DISCOVERY_URL = 'https://quidkey.com/.well-known/agent-registration.json'

/** The page in markdown, for the agent to learn what is on offer before it acts. */
export const AGENTS_MARKDOWN_URL = 'https://quidkey.com/agents.md'

/** Stands in for the agent's handle in the owner link; the agent replaces it. */
export const OWNER_LINK_PLACEHOLDER = 'YOUR_HANDLE'

export function agentBrief(): string {
  return [
    "I'm your owner. Quidkey is building financial infrastructure for AI agents: a public handle that carries your reputation, accounts in several currencies with local receiving details, cards and payments, all under a budget and policy I set. Register interest for yourself.",
    '',
    `1. Read ${AGENTS_MARKDOWN_URL} to see what Quidkey offers you, then ${DISCOVERY_URL} for how to register.`,
    '2. Choose a handle: 3 to 30 letters, digits or hyphens. Write one or two sentences on what you do and what you would pay for or be paid for.',
    '3. If registration.available in that file is true, POST agent_name, handle and use_case to the registration URL it gives, then send me the owner_registration_url from the response.',
    `4. If it is false, send me this link with your handle in place of ${OWNER_LINK_PLACEHOLDER} so I can register interest for you: ${ownerRegistrationUrl(OWNER_LINK_PLACEHOLDER)}`,
    '',
    'Do not submit credentials, financial details or identity documents anywhere. Registration records interest only. It creates no account and moves no money.',
  ].join('\n')
}
