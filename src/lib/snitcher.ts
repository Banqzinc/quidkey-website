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
    Snitcher?: SnitcherQueue | undefined
  }
}

type SnitcherMethod =
  | 'track'
  | 'page'
  | 'identify'
  | 'group'
  | 'alias'
  | 'ready'
  | 'debug'
  | 'on'
  | 'off'
  | 'once'
  | 'trackClick'
  | 'trackSubmit'
  | 'trackLink'
  | 'trackForm'
  | 'pageview'
  | 'screen'
  | 'reset'
  | 'register'
  | 'setAnonymousId'
  | 'addSourceMiddleware'
  | 'addIntegrationMiddleware'
  | 'addDestinationMiddleware'
  | 'giveCookieConsent'

type SnitcherQueue = any[] & {
  initialized?: boolean
  _loaded?: boolean
  reset?: () => void
  giveCookieConsent?: () => void
  bootstrap?: () => void
} & {
  // Snitcher adds a bunch of callable methods onto the array queue.
  [K in SnitcherMethod]?: (...args: any[]) => unknown
}

type SnitcherSettings = {
  apiEndpoint: string
  cdn: string
  namespace: 'Snitcher'
  profileId: string
}

const RADAR_SCRIPT_ID = '__radar__'

let started = false

function isPreviewHost() {
  // Allow in local/dev + preview deploys where Cookiebot may not be configured.
  const host = window.location.hostname
  return host === 'localhost' || host.endsWith('.netlify.app')
}

function readCookiebotConsent() {
  return window.Cookiebot?.consent
}

function hasRadarScript() {
  return Boolean(document.getElementById(RADAR_SCRIPT_ID))
}

function ensureSnitcherBootstrapped(settings: SnitcherSettings) {
  const t = settings.namespace
  const existing = window[t]

  // Create/reuse the queue array, but keep the type as a "queue with methods".
  const queue: SnitcherQueue = Array.isArray(existing) ? (existing as SnitcherQueue) : ([] as unknown as SnitcherQueue)
  if (!Array.isArray(existing)) {
    window[t] = queue
  }

  // Prevent duplicate bootstraps.
  if ((queue as any).initialized || (queue as any)._loaded || hasRadarScript()) return

  ;(queue as any)._loaded = true

  const methods: SnitcherMethod[] = [
    'track',
    'page',
    'identify',
    'group',
    'alias',
    'ready',
    'debug',
    'on',
    'off',
    'once',
    'trackClick',
    'trackSubmit',
    'trackLink',
    'trackForm',
    'pageview',
    'screen',
    'reset',
    'register',
    'setAnonymousId',
    'addSourceMiddleware',
    'addIntegrationMiddleware',
    'addDestinationMiddleware',
    'giveCookieConsent',
  ]

  methods.forEach((method) => {
    ;(queue as any)[method] = (...args: any[]) => {
      const w = window[t] as any
      if (w?.initialized && typeof w[method] === 'function') return w[method](...args)
      const a = [method, ...args]
      ;(window[t] as any[]).push(a)
      return a
    }
  })

  const apiEndpoint = settings.apiEndpoint.includes('http') ? settings.apiEndpoint : `https://${settings.apiEndpoint}`
  const cdnPrefix = settings.cdn.includes('http') ? '' : 'https://'

  ;(queue as any).bootstrap = () => {
    const s = document.createElement('script')
    s.async = true
    s.type = 'text/javascript'
    s.id = RADAR_SCRIPT_ID
    s.setAttribute(
      'data-settings',
      JSON.stringify({
        ...settings,
        apiEndpoint,
      }),
    )
    s.src = `${cdnPrefix}${settings.cdn}/releases/latest/radar.min.js`

    const first = document.scripts?.[0]
    if (first?.parentNode) {
      first.parentNode.insertBefore(s, first)
    } else {
      ;(document.head || document.body).appendChild(s)
    }
  }

  ;(queue as any).bootstrap()
}

/**
 * Load Snitcher (Radar) only after Cookiebot "Marketing" consent is granted.
 *
 * If Cookiebot isn't present, we default to allowing load (useful for local dev).
 */
export function initSnitcherWithCookiebot(profileId: string, overrides?: Partial<Omit<SnitcherSettings, 'profileId'>>) {
  if (typeof window === 'undefined') return () => {}
  if (!profileId) return () => {}

  const settings: SnitcherSettings = {
    apiEndpoint: overrides?.apiEndpoint ?? 'radar.snitcher.com',
    cdn: overrides?.cdn ?? 'cdn.snitcher.com',
    namespace: 'Snitcher',
    profileId,
  }

  const apply = () => {
    const consent = readCookiebotConsent()

    // If Cookiebot exists, require "Marketing" consent. On preview hosts, allow.
    const allowed = isPreviewHost() || (consent ? Boolean(consent.marketing) : true)

    if (!allowed) {
      // Best-effort: if the SDK already started, try to reset.
      if (started && typeof window.Snitcher?.reset === 'function') {
        window.Snitcher.reset()
      }
      return
    }

    if (started) return

    ensureSnitcherBootstrapped(settings)
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
