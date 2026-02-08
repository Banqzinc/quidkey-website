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
    Userback?: {
      access_token?: string
      widget_settings?: Record<string, unknown>
      user_data?: Record<string, unknown>
      init?: (token: string, options?: Record<string, unknown>) => unknown
      destroy?: () => void
      showLauncher?: () => void
      hideLauncher?: () => void
      [key: string]: unknown
    }
  }
}

const USERBACK_SCRIPT_ID = 'userback-widget-v1'
const USERBACK_SCRIPT_SRC = 'https://static.userback.io/widget/v1.js'

let started = false

function readCookiebotConsent() {
  return window.Cookiebot?.consent
}

function hasUserbackScript() {
  return Boolean(document.getElementById(USERBACK_SCRIPT_ID))
}

function mountUserbackScript() {
  if (hasUserbackScript()) return

  const s = document.createElement('script')
  s.id = USERBACK_SCRIPT_ID
  s.async = true
  s.src = USERBACK_SCRIPT_SRC
  ;(document.head || document.body).appendChild(s)
}

/**
 * Loads the Userback feedback widget only (no surveys are triggered by code).
 *
 * We gate loading behind Cookiebot "Preferences" consent when Cookiebot is present.
 * If Cookiebot isn't present (e.g. local dev), we load as long as a token is provided.
 */
export function initUserbackWithCookiebot(accessToken: string) {
  if (typeof window === 'undefined') return () => {}
  if (!accessToken) return () => {}

  const apply = () => {
    const consent = readCookiebotConsent()

    // If Cookiebot exists, require "Preferences" consent for this widget.
    const allowed = consent ? Boolean(consent.preferences) : true

    if (!allowed) {
      if (started) {
        // Best-effort removal. If the SDK hasn't loaded yet, this is a no-op.
        window.Userback?.destroy?.()
        started = false
      }
      return
    }

    if (started) return

    window.Userback = window.Userback || {}
    window.Userback.access_token = accessToken

    mountUserbackScript()
    started = true
  }

  window.addEventListener('CookiebotOnConsentReady', apply)
  window.addEventListener('CookiebotOnAccept', apply)
  window.addEventListener('CookiebotOnDecline', apply)

  // Attempt once immediately (covers "already ready" cases).
  apply()

  return () => {
    window.removeEventListener('CookiebotOnConsentReady', apply)
    window.removeEventListener('CookiebotOnAccept', apply)
    window.removeEventListener('CookiebotOnDecline', apply)
  }
}

