import { createServerFn } from '@tanstack/react-start'

import { isBot, isValidEmail, normalizeEmail } from '@/lib/hubspot-forms'

// Footer newsletter sign-up. Forwarded to a Mailchimp audience via our Worker
// for the same reasons the HubSpot forms are (see hubspot-forms.ts): the
// production CSP would block a browser call, and the API key must stay on the
// server anyway.
//
// We use the plain "add member" call rather than Mailchimp's md5-keyed upsert:
// it needs no hashing (node:crypto cannot be imported from a module the client
// bundle also loads) and it never touches an existing member, so an address
// that unsubscribed before keeps its status, which is what consent law expects.
// Mailchimp answers a repeat sign-up with "Member Exists", which we report as
// success because, for the visitor, it is.

export type NewsletterInput = {
  email: string
  /** Honeypot. Bots fill hidden fields; humans never see this one. */
  hp?: string
}

export type NewsletterError = 'invalid_email' | 'server'
export type NewsletterResult = { ok: true } | { ok: false; error: NewsletterError }

export type MailchimpConfig = { apiKey: string; audienceId: string; dc: string }
type MailchimpEnv = { MAILCHIMP_API_KEY?: string; MAILCHIMP_AUDIENCE_ID?: string }
type MailchimpErrorBody = { title?: string; detail?: string }
type MailchimpRejection = NewsletterError | 'already_member'

/** Tag applied in Mailchimp so the audience shows where each member came from. */
const SOURCE_TAG = 'Website footer'
const MAILCHIMP_TIMEOUT_MS = 5_000
const LOG_PREFIX = '[subscribe-newsletter]'

/**
 * Mailchimp API keys end in "-<dc>" (e.g. "-us21"), and requests must go to
 * that data centre's host. Returns null for a key without one.
 */
export function mailchimpDataCenter(apiKey: string): string | null {
  const match = /-([a-z]{2,}\d+)$/.exec(apiKey)
  return match ? match[1] : null
}

export function mailchimpMembersUrl(dc: string, audienceId: string): string {
  return `https://${dc}.api.mailchimp.com/3.0/lists/${audienceId}/members`
}

export function buildMailchimpMember(email: string) {
  return {
    email_address: email,
    status: 'subscribed' as const,
    tags: [SOURCE_TAG],
  }
}

/**
 * Reads the API key and audience id from the Worker environment. Returns null
 * when either is missing or the key has no data centre suffix, so the caller
 * can decide how to degrade.
 */
export function resolveMailchimpConfig(env: MailchimpEnv): MailchimpConfig | null {
  const apiKey = env.MAILCHIMP_API_KEY
  const audienceId = env.MAILCHIMP_AUDIENCE_ID
  if (!apiKey || !audienceId) return null
  const dc = mailchimpDataCenter(apiKey)
  if (!dc) return null
  return { apiKey, audienceId, dc }
}

/**
 * Sorts a non-2xx answer. "Member Exists" means the address is already in the
 * audience. "Invalid Resource" is Mailchimp's verdict on a fake or malformed
 * address; our payload is fixed, so that title can only ever be about the
 * address. Anything else (compliance state, bad key, outage) is ours to fix.
 */
export function mapMailchimpRejection(status: number, body: MailchimpErrorBody): MailchimpRejection {
  if (status !== 400) return 'server'
  if (body.title === 'Member Exists') return 'already_member'
  if (body.title === 'Invalid Resource') return 'invalid_email'
  return 'server'
}

/**
 * POSTs one member to the audience. Never throws: every failure is logged with
 * the given prefix and reported so the form can show the visitor what to do.
 */
export async function postMailchimpMember(
  config: MailchimpConfig,
  email: string,
  logPrefix: string,
): Promise<NewsletterResult> {
  try {
    const response = await fetch(mailchimpMembersUrl(config.dc, config.audienceId), {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Basic ${btoa(`anystring:${config.apiKey}`)}`,
      },
      body: JSON.stringify(buildMailchimpMember(email)),
      signal: AbortSignal.timeout(MAILCHIMP_TIMEOUT_MS),
    })

    if (response.ok) return { ok: true }

    const body = (await response.json().catch(() => ({}))) as MailchimpErrorBody
    const rejection = mapMailchimpRejection(response.status, body)
    if (rejection === 'already_member') return { ok: true }
    if (rejection === 'server') {
      console.error(`${logPrefix} Mailchimp rejected the subscription`, {
        status: response.status,
        title: body.title,
        detail: body.detail,
      })
    }
    return { ok: false, error: rejection }
  } catch (error) {
    console.error(`${logPrefix} Mailchimp request failed`, error)
    return { ok: false, error: 'server' }
  }
}

export const subscribeNewsletter = createServerFn({ method: 'POST' })
  .inputValidator((data: NewsletterInput) => data)
  .handler(async ({ data }): Promise<NewsletterResult> => {
    // Drop bots silently: reporting success means they stop retrying, and a
    // honeypot hit never reaches Mailchimp.
    if (isBot(data.hp)) return { ok: true }

    const email = normalizeEmail(data.email)
    if (!isValidEmail(email)) return { ok: false, error: 'invalid_email' }

    // Worker vars land on process.env because compatibility_date is past
    // 2025-04-01 and nodejs_compat is on; locally they come from .dev.vars.
    const config = resolveMailchimpConfig({
      MAILCHIMP_API_KEY: process.env.MAILCHIMP_API_KEY,
      MAILCHIMP_AUDIENCE_ID: process.env.MAILCHIMP_AUDIENCE_ID,
    })
    if (!config) {
      // Local development without Mailchimp credentials: log the address and
      // report success so the whole flow can be exercised. This branch is
      // compiled out of the production bundle (import.meta.env.DEV is a
      // build-time constant), so a missing var in production fails closed and
      // the form asks the visitor to try again later.
      if (import.meta.env.DEV) {
        console.warn(`${LOG_PREFIX} Mailchimp not configured — accepting sign-up locally, not forwarding`, {
          email,
        })
        return { ok: true }
      }
      console.error(`${LOG_PREFIX} MAILCHIMP_API_KEY / MAILCHIMP_AUDIENCE_ID are not configured`)
      return { ok: false, error: 'server' }
    }

    return postMailchimpMember(config, email, LOG_PREFIX)
  })
