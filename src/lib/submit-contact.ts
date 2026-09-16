import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'

import { CONTACT_TOPICS, parseTopic, type ContactTopic } from '@/lib/contact-topics'
import {
  isBot,
  isValidEmail,
  normalizeEmail,
  postHubspotForm,
  resolveHubspotForm,
  type HubspotFormPayload,
} from '@/lib/hubspot-forms'

// Contact form submissions (the "Talk to us" dialog and the /contact page).
// Forwarded to a HubSpot form via our Worker; see hubspot-forms.ts for why the
// browser never calls HubSpot directly.
//
// The HubSpot form behind HUBSPOT_CONTACT_FORM_GUID must carry exactly these
// fields (HubSpot rejects submissions with fields that are not on the form):
//   firstname, email, company, message — standard contact properties
//   contact_topic — custom single-line text contact property, hidden on the form

export type ContactInput = {
  name: string
  email: string
  company?: string
  message: string
  /** A ContactTopic key. Validated server-side; unknown values become `general`. */
  topic: string
  /** Path of the page the dialog was opened on, e.g. "/fx-check". */
  page?: string
  /** Honeypot. Bots fill hidden fields; humans never see this one. */
  hp?: string
}

export type ContactField = 'name' | 'email' | 'message'

export type ContactResult =
  | { ok: true }
  | { ok: false; error: 'invalid'; field: ContactField }
  | { ok: false; error: 'server' }

export type CleanContact = {
  name: string
  email: string
  company: string
  message: string
  topic: ContactTopic
}

export const CONTACT_LIMITS = { name: 120, company: 120, message: 4000 } as const
const MAX_PAGE_PATH_LENGTH = 200
const PAGE_NAME = 'Contact'
const LOG_PREFIX = '[submit-contact]'

/** Trim, collapse runs of whitespace to one space, and cap the length. */
function singleLine(raw: unknown, max: number): string {
  if (typeof raw !== 'string') return ''
  return raw.trim().replace(/\s+/g, ' ').slice(0, max)
}

/** Trim the edges, keep the visitor's line breaks, and cap the length. */
function multiLine(raw: unknown, max: number): string {
  if (typeof raw !== 'string') return ''
  return raw.trim().slice(0, max)
}

export function validateContact(
  input: ContactInput,
): { ok: true; value: CleanContact } | { ok: false; field: ContactField } {
  const name = singleLine(input.name, CONTACT_LIMITS.name)
  if (!name) return { ok: false, field: 'name' }

  const email = normalizeEmail(input.email)
  if (!isValidEmail(email)) return { ok: false, field: 'email' }

  const message = multiLine(input.message, CONTACT_LIMITS.message)
  if (!message) return { ok: false, field: 'message' }

  return {
    ok: true,
    value: {
      name,
      email,
      company: singleLine(input.company, CONTACT_LIMITS.company),
      message,
      topic: parseTopic(input.topic),
    },
  }
}

/**
 * The page path we report to HubSpot as the submission's pageUri. Only a
 * same-site path without its query string is accepted, because the value
 * comes from the client and the query can carry calculator inputs.
 */
export function safePagePath(raw: unknown): string {
  if (typeof raw !== 'string') return '/'
  const path = raw.split(/[?#]/, 1)[0]
  if (!path.startsWith('/') || path.startsWith('//') || path.length > MAX_PAGE_PATH_LENGTH) return '/'
  return path
}

export function buildContactPayload(value: CleanContact, pageUri: string): HubspotFormPayload {
  return {
    fields: [
      { name: 'firstname', value: value.name },
      { name: 'email', value: value.email },
      ...(value.company ? [{ name: 'company', value: value.company }] : []),
      { name: 'message', value: value.message },
      { name: 'contact_topic', value: CONTACT_TOPICS[value.topic].label },
    ],
    context: { pageUri, pageName: PAGE_NAME },
  }
}

export const submitContact = createServerFn({ method: 'POST' })
  .inputValidator((data: ContactInput) => data)
  .handler(async ({ data }): Promise<ContactResult> => {
    // Drop bots silently: reporting success means they stop retrying, and a
    // honeypot hit is never forwarded to HubSpot.
    if (isBot(data.hp)) return { ok: true }

    const validated = validateContact(data)
    if (!validated.ok) return { ok: false, error: 'invalid', field: validated.field }

    const config = resolveHubspotForm(process.env.HUBSPOT_CONTACT_FORM_GUID)
    if (!config) {
      // Local development without HubSpot credentials: log the message and
      // report success so the whole flow can be exercised. This branch is
      // compiled out of the production bundle (import.meta.env.DEV is a
      // build-time constant), so a missing var in production still fails
      // closed — the dialog then shows the email address as the fallback.
      if (import.meta.env.DEV) {
        console.warn(`${LOG_PREFIX} HubSpot not configured — accepting message locally, not forwarding`, {
          ...validated.value,
          page: safePagePath(data.page),
        })
        return { ok: true }
      }
      console.error(`${LOG_PREFIX} HUBSPOT_PORTAL_ID / HUBSPOT_CONTACT_FORM_GUID are not configured`)
      return { ok: false, error: 'server' }
    }

    const origin = new URL(getRequest().url).origin
    const payload = buildContactPayload(validated.value, `${origin}${safePagePath(data.page)}`)
    return postHubspotForm(config, payload, LOG_PREFIX)
  })
