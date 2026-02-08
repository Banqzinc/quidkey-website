import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useRouterState } from '@tanstack/react-router'

import appCss from '../styles.css?url'
import { initClarityWithCookiebot } from '@/lib/clarity'
import { trackPageView, updateGoogleConsentFromCookiebot } from '@/lib/google-analytics'
import { initUserbackWithCookiebot } from '@/lib/userback'

const ICON_URL = 'https://storage.googleapis.com/quidkey-resources-public/quidkey-logo-fav.png'
const COOKIEBOT_DOMAIN_GROUP_ID = 'bcd5bf4b-c074-47cb-b26a-a401acac39b6'
const CLARITY_PROJECT_ID = 'vdvvqtuvg2'
const GA_MEASUREMENT_ID = 'G-G2CG1D2Q1C'
const USERBACK_ACCESS_TOKEN = 'A-T4eFdwAnKc5Yq1y37td2cGRWR'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      // React expects `charSet` (not `charset`) when rendering <meta>.
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        name: 'theme-color',
        content: '#0a0a0a',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: ICON_URL,
      },
      {
        rel: 'apple-touch-icon',
        href: ICON_URL,
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
      },
    ],
  }),

  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid={COOKIEBOT_DOMAIN_GROUP_ID}
          data-blockingmode="manual"
          type="text/javascript"
        />
        {GA_MEASUREMENT_ID ? (
          <>
            {/* Google Consent Mode v2 defaults must run before any gtag config/event calls */}
            <script
              dangerouslySetInnerHTML={{
                __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500
});
`,
              }}
            />
            {/* Google tag (gtag.js) */}
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
`,
              }}
            />
          </>
        ) : null}
        <HeadContent />
      </head>
      {/* suppressHydrationWarning: TanStack Start's <Scripts /> can cause minor SSR/client differences */}
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <ClarityCookiebotBridge />
        <GoogleAnalyticsCookiebotBridge />
        <UserbackCookiebotBridge />
        <Scripts />
      </body>
    </html>
  )
}

function ClarityCookiebotBridge() {
  useEffect(() => {
    if (!CLARITY_PROJECT_ID) return
    return initClarityWithCookiebot(CLARITY_PROJECT_ID)
  }, [])

  return null
}

function GoogleAnalyticsCookiebotBridge() {
  const location = useRouterState({ select: (s) => s.location })

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return

    const apply = () => {
      const { analyticsGranted } = updateGoogleConsentFromCookiebot()
      if (analyticsGranted) {
        trackPageView(GA_MEASUREMENT_ID)
      }
    }

    window.addEventListener('CookiebotOnConsentReady', apply)
    window.addEventListener('CookiebotOnAccept', apply)
    window.addEventListener('CookiebotOnDecline', apply)

    // Try once on mount (covers already-ready cases).
    apply()

    return () => {
      window.removeEventListener('CookiebotOnConsentReady', apply)
      window.removeEventListener('CookiebotOnAccept', apply)
      window.removeEventListener('CookiebotOnDecline', apply)
    }
  }, [])

  // SPA pageviews: only emit when Statistics consent is granted.
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return
    if (!window.Cookiebot?.consent?.statistics) return
    trackPageView(GA_MEASUREMENT_ID)
  }, [location.pathname, location.search])

  return null
}

function UserbackCookiebotBridge() {
  useEffect(() => {
    if (!USERBACK_ACCESS_TOKEN) return
    return initUserbackWithCookiebot(USERBACK_ACCESS_TOKEN)
  }, [])

  return null
}
