import { HeadContent, Link, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useRouterState } from '@tanstack/react-router'

import appCss from '../styles.css?url'
import { initClarityWithCookiebot } from '@/lib/clarity'
import { trackPageView, updateGoogleConsentFromCookiebot } from '@/lib/google-analytics'
import { initUserbackWithCookiebot } from '@/lib/userback'
import { initSnitcherWithCookiebot } from '@/lib/snitcher'
import { initLinkedInWithCookiebot } from '@/lib/linkedin'
import { MegaMenu } from '@/components/layout/mega-menu'
import { Footer } from '@/components/layout/footer'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'

const ICON_URL = 'https://storage.googleapis.com/quidkey-resources-public/quidkey-logo-fav.png'
const COOKIEBOT_DOMAIN_GROUP_ID = 'bcd5bf4b-c074-47cb-b26a-a401acac39b6'
const CLARITY_PROJECT_ID = 'vdvvqtuvg2'
const GA_MEASUREMENT_ID = 'G-G2CG1D2Q1C'
const USERBACK_ACCESS_TOKEN = 'A-T4eFdwAnKc5Yq1y37td2cGRWR'
const SNITCHER_PROFILE_ID = '8436518'
const LINKEDIN_PARTNER_ID = '9711353'

const ENABLE_TRACKERS =
  (import.meta.env.VITE_ENABLE_TRACKERS as string | undefined) === 'true' ||
  import.meta.env.PROD

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
        rel: 'preload',
        href: '/quidkey-logo.svg',
        as: 'image',
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
  notFoundComponent: NotFoundPage,
})

function NotFoundPage() {
  const quickLinks = [
    { href: '/', label: 'Homepage' },
    { href: '/products/shopify', label: 'Shopify App' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <MegaMenu />
      <main className="flex-1 relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 hero-gradient" aria-hidden="true" />
        <div className="absolute inset-0 noise" aria-hidden="true" />

        <div className="relative mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
          <p className="text-8xl sm:text-9xl font-bold gradient-text leading-none mb-6 select-none">
            404
          </p>

          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-3">
            Page not found
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto text-pretty">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <Link
            to="/"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'group shadow-lg shadow-primary/25 hover:shadow-primary/40 mb-12'
            )}
          >
            Back to homepage
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </Link>

          <div className="border-t border-border pt-8">
            <p className="text-sm text-muted-foreground mb-4">Or try one of these pages</p>
            <div className="flex flex-wrap justify-center gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

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
        {ENABLE_TRACKERS ? (
          <>
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
          </>
        ) : null}
        <HeadContent />
      </head>
      {/* suppressHydrationWarning: TanStack Start's <Scripts /> can cause minor SSR/client differences */}
      <body className="antialiased" suppressHydrationWarning>
        {children}
        {ENABLE_TRACKERS ? (
          <>
            <ClarityCookiebotBridge />
            <GoogleAnalyticsCookiebotBridge />
            <UserbackCookiebotBridge />
            <SnitcherCookiebotBridge />
            <LinkedInCookiebotBridge />
          </>
        ) : null}
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

function SnitcherCookiebotBridge() {
  useEffect(() => {
    if (!SNITCHER_PROFILE_ID) return
    return initSnitcherWithCookiebot(SNITCHER_PROFILE_ID)
  }, [])

  return null
}

function LinkedInCookiebotBridge() {
  useEffect(() => {
    if (!LINKEDIN_PARTNER_ID) return
    return initLinkedInWithCookiebot(LINKEDIN_PARTNER_ID)
  }, [])

  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: 'none' }}
        alt=""
        src={`https://px.ads.linkedin.com/collect/?pid=${LINKEDIN_PARTNER_ID}&fmt=gif`}
      />
    </noscript>
  )
}
