import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'

// Lead capture for the surcharge calculator's email gate.
//
// The POST runs in our own Worker and the Worker calls HubSpot, rather than the
// browser calling HubSpot directly. Two reasons: production's CSP lives in
// Cloudflare (not this repo) and its connect-src allowlist silently blocks new
// third-party client fetches — it would work locally and fail in production —
// and a same-origin request keeps the visitor's data out of a cross-origin
// request the ad blockers also tend to eat.

export type LeadInput = {
  email: string
  /** Honeypot. Bots fill hidden fields; humans never see this one. */
  hp?: string
  turnover: number
  rate: number
  /**
   * Explicit opt-in to marketing email. Optional by design: the gate unlocks
   * either way, because consent required to see a result is not freely given.
   */
  marketingConsent?: boolean
}

export type LeadResult = { ok: true } | { ok: false; error: 'invalid_email' | 'server' }

const PAGE_PATH = '/surcharge-calculator'
const PAGE_NAME = 'Surcharge ban calculator'
const HUBSPOT_TIMEOUT_MS = 5_000
/** RFC-ish maximum length of an email address. */
const MAX_EMAIL_LENGTH = 254

// The Forms API is region-specific. Quidkey's portal is EU-hosted (its UI is on
// app-eu1.hubspot.com), and EU portals must submit to api-eu1.hsforms.com — the
// US host rejects them. Override HUBSPOT_FORMS_HOST if the portal ever moves.
const DEFAULT_FORMS_HOST = 'api-eu1.hsforms.com'

export function normalizeEmail(raw: unknown): string {
  return typeof raw === 'string' ? raw.trim().toLowerCase() : ''
}

// Deliberately permissive: one @, no whitespace, a dot in the domain. Tighter
// regexes reject valid addresses, and HubSpot validates properly downstream.
export function isValidEmail(email: string): boolean {
  if (!email || email.length > MAX_EMAIL_LENGTH) return false
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(email)
}

export function isBot(hp: unknown): boolean {
  return typeof hp === 'string' && hp.trim() !== ''
}

export function buildHubspotPayload(
  input: Pick<LeadInput, 'email' | 'turnover' | 'rate' | 'marketingConsent'>,
  pageUri: string,
) {
  return {
    fields: [
      { name: 'email', value: input.email },
      { name: 'monthly_card_turnover', value: String(input.turnover) },
      { name: 'average_card_fee_rate', value: String(input.rate) },
      { name: 'marketing_consent', value: input.marketingConsent ? 'true' : 'false' },
    ],
    context: { pageUri, pageName: PAGE_NAME },
  }
}

export function hubspotEndpoint(portalId: string, formGuid: string, host = DEFAULT_FORMS_HOST) {
  return `https://${host}/submissions/v3/integration/submit/${portalId}/${formGuid}`
}

export const submitLead = createServerFn({ method: 'POST' })
  .inputValidator((data: LeadInput) => data)
  .handler(async ({ data }): Promise<LeadResult> => {
    // Drop bots silently: reporting success means they stop retrying, and a
    // honeypot hit is never forwarded to HubSpot.
    if (isBot(data.hp)) return { ok: true }

    const email = normalizeEmail(data.email)
    if (!isValidEmail(email)) return { ok: false, error: 'invalid_email' }

    // Worker vars land on process.env because compatibility_date is past
    // 2025-04-01 and nodejs_compat is on; locally they come from .dev.vars.
    const portalId = process.env.HUBSPOT_PORTAL_ID
    const formGuid = process.env.HUBSPOT_FORM_GUID
    if (!portalId || !formGuid) {
      // Local development without HubSpot credentials: log the lead and open the
      // gate so the whole flow can be exercised. This branch is compiled out of
      // the production bundle (import.meta.env.DEV is a build-time constant), so
      // a missing var in production still fails closed rather than pretending a
      // lead was captured.
      if (import.meta.env.DEV) {
        console.warn('[submit-lead] HubSpot not configured — accepting lead locally, not forwarding', {
          email,
          turnover: data.turnover,
          rate: data.rate,
          marketingConsent: data.marketingConsent === true,
        })
        return { ok: true }
      }
      console.error('[submit-lead] HUBSPOT_PORTAL_ID / HUBSPOT_FORM_GUID are not configured')
      return { ok: false, error: 'server' }
    }

    const origin = new URL(getRequest().url).origin
    const payload = buildHubspotPayload(
      {
        email,
        turnover: data.turnover,
        rate: data.rate,
        marketingConsent: data.marketingConsent === true,
      },
      `${origin}${PAGE_PATH}`,
    )

    try {
      const response = await fetch(hubspotEndpoint(portalId, formGuid, process.env.HUBSPOT_FORMS_HOST), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(HUBSPOT_TIMEOUT_MS),
      })

      if (!response.ok) {
        // Log the body: HubSpot explains field-name mismatches here, which is
        // the most likely misconfiguration.
        console.error('[submit-lead] HubSpot rejected the submission', {
          status: response.status,
          body: await response.text().catch(() => '<unreadable>'),
        })
        return { ok: false, error: 'server' }
      }

      return { ok: true }
    } catch (error) {
      console.error('[submit-lead] HubSpot request failed', error)
      return { ok: false, error: 'server' }
    }
  })
