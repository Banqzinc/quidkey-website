declare global {
  interface Window {
    Cookiebot?: {
      renew?: () => void
      show?: () => void
    }
  }
}

// Opens the Cookiebot consent banner. Used by the "Cookies" link in the
// footer and legal-shell tab strip. The site has no dedicated cookies page
// any more — if the script can't surface the banner, the click is a no-op
// (logged in dev) rather than navigating somewhere broken.
export function openCookiebotPreferences(options?: { fallbackUrl?: string }) {
  if (typeof window === 'undefined') return false

  const cb = window.Cookiebot
  if (cb?.renew) {
    cb.renew()
    return true
  }
  if (cb?.show) {
    cb.show()
    return true
  }

  if (options?.fallbackUrl) {
    window.location.href = options.fallbackUrl
    return false
  }

  if (typeof console !== 'undefined') {
    console.warn(
      '[cookiebot] preferences requested but window.Cookiebot is unavailable; banner script may not have loaded yet.'
    )
  }
  return false
}

