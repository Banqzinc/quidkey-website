import { HeadContent, Outlet, Scripts, createRootRoute, useLocation } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

import appCss from '../styles.css?url'

const ICON_URL = 'https://storage.googleapis.com/quidkey-resources-public/quidkey-logo-fav.png'

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

/** Tracks whether the last navigation was browser back/forward so we don't override scroll restoration. */
let lastNavWasPop = false
if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    lastNavWasPop = true
  })
}

function ScrollToTop() {
  const { pathname } = useLocation()
  const prevPathname = useRef<string | null>(null)

  useEffect(() => {
    // Only scroll on pathname change (link navigation), not on back/forward
    if (prevPathname.current !== null && prevPathname.current !== pathname && !lastNavWasPop) {
      const scrollToTop = () => {
        window.scrollTo(0, 0)
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
      }
      // Run after paint so we run after any router scroll logic; helps mobile avoid showing old scroll position
      requestAnimationFrame(() => {
        scrollToTop()
        requestAnimationFrame(scrollToTop)
      })
    }
    if (lastNavWasPop) lastNavWasPop = false
    prevPathname.current = pathname
  }, [pathname])

  return null
}

function RootComponent() {
  return (
    <RootDocument>
      <ScrollToTop />
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <HeadContent />
      </head>
      {/* suppressHydrationWarning: TanStack Start's <Scripts /> can cause minor SSR/client differences */}
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
