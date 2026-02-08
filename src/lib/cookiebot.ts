declare global {
  interface Window {
    Cookiebot?: {
      renew?: () => void
      show?: () => void
    }
  }
}

export function openCookiebotPreferences(options?: { fallbackUrl?: string }) {
  const fallbackUrl = options?.fallbackUrl ?? '/cookies'

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

  // If Cookiebot isn't loaded for some reason, fall back to a real page.
  window.location.href = fallbackUrl
  return false
}

