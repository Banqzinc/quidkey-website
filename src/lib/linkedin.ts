declare global {
  interface Window {
    Cookiebot?: {
      consent?: {
        necessary?: boolean
        preferences?: boolean
        statistics?: boolean
        marketing?: boolean
      }
    }
    _linkedin_data_partner_ids?: string[]
    lintrk?: ((...args: any[]) => void) & { q?: any[][] }
  }
}

const INSIGHT_SCRIPT_ID = '__linkedin_insight__'

let started = false

function readCookiebotConsent() {
  return window.Cookiebot?.consent
}

function hasInsightScript() {
  return Boolean(document.getElementById(INSIGHT_SCRIPT_ID))
}

function loadInsightTag(partnerId: string) {
  window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || []
  if (!window._linkedin_data_partner_ids.includes(partnerId)) {
    window._linkedin_data_partner_ids.push(partnerId)
  }

  if (!window.lintrk) {
    window.lintrk = function (a: any, b: any) {
      window.lintrk!.q!.push([a, b])
    }
    window.lintrk.q = []
  }

  if (hasInsightScript()) return

  const s = document.getElementsByTagName('script')[0]
  const b = document.createElement('script')
  b.type = 'text/javascript'
  b.async = true
  b.id = INSIGHT_SCRIPT_ID
  b.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js'
  s?.parentNode?.insertBefore(b, s)
}

/**
 * Load the LinkedIn Insight Tag only after Cookiebot "Marketing" consent is granted.
 *
 * If Cookiebot isn't present (e.g. local dev), this does nothing.
 */
export function initLinkedInWithCookiebot(partnerId: string) {
  if (typeof window === 'undefined') return () => {}
  if (!partnerId) return () => {}

  const apply = () => {
    const consent = readCookiebotConsent()
    const allowed = consent ? Boolean(consent.marketing) : false

    if (!allowed) return
    if (started) return

    loadInsightTag(partnerId)
    started = true
  }

  window.addEventListener('CookiebotOnConsentReady', apply)
  window.addEventListener('CookiebotOnAccept', apply)
  window.addEventListener('CookiebotOnDecline', apply)

  apply()

  return () => {
    window.removeEventListener('CookiebotOnConsentReady', apply)
    window.removeEventListener('CookiebotOnAccept', apply)
    window.removeEventListener('CookiebotOnDecline', apply)
  }
}
