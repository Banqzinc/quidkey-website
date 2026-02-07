import Clarity from '@microsoft/clarity'

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
  }
}

let clarityStarted = false

function getCookiebotConsent() {
  return window.Cookiebot?.consent
}

function computeConsentV2(consent: ReturnType<typeof getCookiebotConsent>) {
  const analyticsGranted = Boolean(consent?.statistics)
  const adGranted = Boolean(consent?.marketing)

  return {
    analyticsGranted,
    adGranted,
    consentV2: {
      // Clarity uses these exact keys (per npm README)
      analytics_Storage: analyticsGranted ? 'granted' : 'denied',
      ad_Storage: adGranted ? 'granted' : 'denied',
    } as const,
  }
}

/**
 * Initialize Clarity only after Cookiebot "Statistics" consent is granted.
 * Also keeps Clarity's consent state (v2) in sync with Cookiebot.
 *
 * If Cookiebot isn't present (e.g. local dev without the script), this does nothing.
 */
export function initClarityWithCookiebot(projectId: string) {
  if (typeof window === 'undefined') return () => {}
  if (!projectId) return () => {}

  const applyConsent = () => {
    const { analyticsGranted, consentV2 } = computeConsentV2(getCookiebotConsent())

    // Only start Clarity once the user has accepted "Statistics"
    if (!clarityStarted && analyticsGranted) {
      Clarity.init(projectId)
      clarityStarted = true
    }

    // If it is running (or once it starts), keep consent in sync.
    if (clarityStarted) {
      Clarity.consentV2(consentV2)
    }
  }

  // Cookiebot fires these window events as consent state changes.
  window.addEventListener('CookiebotOnConsentReady', applyConsent)
  window.addEventListener('CookiebotOnAccept', applyConsent)
  window.addEventListener('CookiebotOnDecline', applyConsent)

  // Attempt once immediately (covers "already ready" cases).
  applyConsent()

  return () => {
    window.removeEventListener('CookiebotOnConsentReady', applyConsent)
    window.removeEventListener('CookiebotOnAccept', applyConsent)
    window.removeEventListener('CookiebotOnDecline', applyConsent)
  }
}

