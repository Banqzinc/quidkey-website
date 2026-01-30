import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

import appCss from '../styles.css?url'

// Featurebase Feedback Widget uses your workspace subdomain/slug (e.g. https://quidkey.featurebase.app)
const FEATUREBASE_ORG_SLUG = 'quidkey'

// Featurebase SDK types
type FeaturebaseFunction = {
  (method: string, options: Record<string, unknown>): void
  q?: unknown[][]
}

declare global {
  interface Window {
    Featurebase: FeaturebaseFunction
  }
}

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

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  // Initialize Featurebase feedback widget
  useEffect(() => {
    // Define Featurebase queue function before loading script
    if (typeof window.Featurebase !== 'function') {
      window.Featurebase = function (...args: unknown[]) {
        ;(window.Featurebase.q = window.Featurebase.q || []).push(args)
      }
    }

    // Initialize the feedback widget with floating button
    window.Featurebase('initialize_feedback_widget', {
      organization: FEATUREBASE_ORG_SLUG,
      theme: 'dark',
      placement: 'right', // Shows floating "Feedback" button on right side
    })

    // Load the Featurebase SDK
    const scriptId = 'featurebase-sdk'
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://do.featurebase.app/js/sdk.js'
      script.async = true
      const firstScript = document.getElementsByTagName('script')[0]
      firstScript?.parentNode?.insertBefore(script, firstScript)
    }
  }, [])

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
