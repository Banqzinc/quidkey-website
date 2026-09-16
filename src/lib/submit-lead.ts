import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'

import {
  isBot,
  isValidEmail,
  normalizeEmail,
  postHubspotForm,
  resolveHubspotForm,
  type HubspotFormPayload,
} from '@/lib/hubspot-forms'

// Lead capture for the surcharge calculator's email gate. Forwarded to a
// HubSpot form via our Worker; see hubspot-forms.ts for why the browser never
// calls HubSpot directly.

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
const LOG_PREFIX = '[submit-lead]'

// Re-exported for the calculator's client-side pre-check, which imports them
// from here alongside submitLead.
export { isValidEmail, normalizeEmail }

export function buildHubspotPayload(
  input: Pick<LeadInput, 'email' | 'turnover' | 'rate' | 'marketingConsent'>,
  pageUri: string,
): HubspotFormPayload {
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

export const submitLead = createServerFn({ method: 'POST' })
  .inputValidator((data: LeadInput) => data)
  .handler(async ({ data }): Promise<LeadResult> => {
    // Drop bots silently: reporting success means they stop retrying, and a
    // honeypot hit is never forwarded to HubSpot.
    if (isBot(data.hp)) return { ok: true }

    const email = normalizeEmail(data.email)
    if (!isValidEmail(email)) return { ok: false, error: 'invalid_email' }

    const config = resolveHubspotForm(process.env.HUBSPOT_FORM_GUID)
    if (!config) {
      // Local development without HubSpot credentials: log the lead and open the
      // gate so the whole flow can be exercised. This branch is compiled out of
      // the production bundle (import.meta.env.DEV is a build-time constant), so
      // a missing var in production still fails closed rather than pretending a
      // lead was captured.
      if (import.meta.env.DEV) {
        console.warn(`${LOG_PREFIX} HubSpot not configured — accepting lead locally, not forwarding`, {
          email,
          turnover: data.turnover,
          rate: data.rate,
          marketingConsent: data.marketingConsent === true,
        })
        return { ok: true }
      }
      console.error(`${LOG_PREFIX} HUBSPOT_PORTAL_ID / HUBSPOT_FORM_GUID are not configured`)
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
    return postHubspotForm(config, payload, LOG_PREFIX)
  })
