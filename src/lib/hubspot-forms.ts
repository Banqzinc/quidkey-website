// Shared plumbing for HubSpot Forms API submissions.
//
// Every form on the site posts through our own Worker rather than from the
// browser. Two reasons: production's CSP lives in Cloudflare (not this repo)
// and its connect-src allowlist silently blocks new third-party client
// fetches — it would work locally and fail in production — and a same-origin
// request keeps the visitor's data out of a cross-origin request the ad
// blockers also tend to eat.

// The Forms API is region-specific. Quidkey's portal is EU-hosted (its UI is on
// app-eu1.hubspot.com), and EU portals must submit to api-eu1.hsforms.com — the
// US host rejects them. Override HUBSPOT_FORMS_HOST if the portal ever moves.
export const DEFAULT_FORMS_HOST = 'api-eu1.hsforms.com'
const HUBSPOT_TIMEOUT_MS = 5_000
/** RFC-ish maximum length of an email address. */
const MAX_EMAIL_LENGTH = 254

export type HubspotField = { name: string; value: string }
export type HubspotFormPayload = {
  fields: HubspotField[]
  context: { pageUri: string; pageName: string }
}
export type HubspotFormConfig = { portalId: string; formGuid: string; host: string | undefined }
export type HubspotSubmitResult = { ok: true } | { ok: false; error: 'server' }

export function normalizeEmail(raw: unknown): string {
  return typeof raw === 'string' ? raw.trim().toLowerCase() : ''
}

// Deliberately permissive: one @, no whitespace, a dot in the domain. Tighter
// regexes reject valid addresses, and HubSpot validates properly downstream.
export function isValidEmail(email: string): boolean {
  if (!email || email.length > MAX_EMAIL_LENGTH) return false
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(email)
}

/** Honeypot check: bots fill hidden fields, humans never see them. */
export function isBot(hp: unknown): boolean {
  return typeof hp === 'string' && hp.trim() !== ''
}

export function hubspotEndpoint(portalId: string, formGuid: string, host = DEFAULT_FORMS_HOST) {
  return `https://${host}/submissions/v3/integration/submit/${portalId}/${formGuid}`
}

/**
 * Reads the portal id (shared by every form) plus the given form's guid from
 * the Worker environment. Returns null when either is missing so the caller
 * can decide how to degrade.
 *
 * Worker vars land on process.env because compatibility_date is past
 * 2025-04-01 and nodejs_compat is on; locally they come from .dev.vars.
 */
export function resolveHubspotForm(formGuid: string | undefined): HubspotFormConfig | null {
  const portalId = process.env.HUBSPOT_PORTAL_ID
  if (!portalId || !formGuid) return null
  return { portalId, formGuid, host: process.env.HUBSPOT_FORMS_HOST || undefined }
}

/**
 * POSTs one submission to the HubSpot Forms API. Never throws: every failure
 * is logged with the given prefix and reported as a server error so the
 * caller can show the visitor a retry or a fallback.
 */
export async function postHubspotForm(
  config: HubspotFormConfig,
  payload: HubspotFormPayload,
  logPrefix: string,
): Promise<HubspotSubmitResult> {
  try {
    const response = await fetch(hubspotEndpoint(config.portalId, config.formGuid, config.host), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(HUBSPOT_TIMEOUT_MS),
    })

    if (!response.ok) {
      // Log the body: HubSpot explains field-name mismatches here, which is
      // the most likely misconfiguration.
      console.error(`${logPrefix} HubSpot rejected the submission`, {
        status: response.status,
        body: await response.text().catch(() => '<unreadable>'),
      })
      return { ok: false, error: 'server' }
    }

    return { ok: true }
  } catch (error) {
    console.error(`${logPrefix} HubSpot request failed`, error)
    return { ok: false, error: 'server' }
  }
}
