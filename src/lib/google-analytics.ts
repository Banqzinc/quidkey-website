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
    dataLayer?: unknown[]
    gtag?: (...args: any[]) => void
  }
}

type ConsentState = 'granted' | 'denied'

function readCookiebotConsent() {
  return window.Cookiebot?.consent
}

function callGtag(...args: any[]) {
  // Queue calls even if gtag isn't ready yet.
  window.dataLayer = window.dataLayer || []
  if (typeof window.gtag === 'function') {
    window.gtag(...args)
  } else {
    window.dataLayer.push(args)
  }
}

export function updateGoogleConsentFromCookiebot() {
  const consent = readCookiebotConsent()

  const analytics: ConsentState = consent?.statistics ? 'granted' : 'denied'
  const ads: ConsentState = consent?.marketing ? 'granted' : 'denied'

  // Consent Mode v2 params (Google Tag Platform docs, 2025-11 update)
  callGtag('consent', 'update', {
    analytics_storage: analytics,
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
  })

  return { analyticsGranted: analytics === 'granted' }
}

export function trackPageView(measurementId: string) {
  if (!measurementId) return

  callGtag('event', 'page_view', {
    page_location: window.location.href,
    page_path: window.location.pathname + window.location.search,
    page_title: document.title,
    send_to: measurementId,
  })
}
