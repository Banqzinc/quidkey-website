import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'

import appCss from '../styles.css?url'

const LOGO_URL = 'https://storage.googleapis.com/quidkey-resources-public/quidkey-logo-fav.png'
const SITE_URL = 'https://quidkey.com'

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
        title: 'Quidkey | AI-native clearing house for pay by bank',
      },
      {
        name: 'description',
        content:
          'Quidkey is an AI-native global clearing house for pay by bank. Unify payment collection, intelligent routing, and programmable treasury into a single stack. Pay 1-3.5% all-in.',
      },
      { property: 'og:title', content: 'Quidkey | AI-native clearing house for pay by bank' },
      {
        property: 'og:description',
        content:
          'AI-native global clearing house for pay by bank. Unify payment collection, routing, and programmable treasury into a single stack. Pay 1-3.5% all-in.',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: SITE_URL },
      { property: 'og:image', content: LOGO_URL },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Quidkey | AI-native clearing house for pay by bank' },
      {
        name: 'twitter:description',
        content:
          'AI-native global clearing house for pay by bank. Unify collection, routing, and programmable treasury into a single stack.',
      },
      { name: 'twitter:image', content: LOGO_URL },
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
        rel: 'canonical',
        href: SITE_URL,
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: LOGO_URL,
      },
      {
        rel: 'apple-touch-icon',
        href: LOGO_URL,
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
        <HeadContent />
      </head>
      <body className="antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
