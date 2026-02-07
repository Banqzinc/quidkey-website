import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

import appCss from '../styles.css?url'
import { initClarityWithCookiebot } from '@/lib/clarity'

const ICON_URL = 'https://storage.googleapis.com/quidkey-resources-public/quidkey-logo-fav.png'
const COOKIEBOT_DOMAIN_GROUP_ID = import.meta.env.VITE_COOKIEBOT_DOMAIN_GROUP_ID as string | undefined
const CLARITY_PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID as string | undefined

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
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
        {COOKIEBOT_DOMAIN_GROUP_ID ? (
          <script
            id="Cookiebot"
            src="https://consent.cookiebot.com/uc.js"
            data-cbid={COOKIEBOT_DOMAIN_GROUP_ID}
            data-blockingmode="manual"
            type="text/javascript"
          />
        ) : null}
        <HeadContent />
      </head>
      {/* suppressHydrationWarning: TanStack Start's <Scripts /> can cause minor SSR/client differences */}
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <ClarityCookiebotBridge />
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
