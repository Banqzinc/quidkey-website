import { createFileRoute } from '@tanstack/react-router'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import { buildSeo } from '@/lib/seo'
import { openCookiebotPreferences } from '@/lib/cookiebot'

const COOKIEBOT_DOMAIN_GROUP_ID = import.meta.env.VITE_COOKIEBOT_DOMAIN_GROUP_ID as string | undefined

export const Route = createFileRoute('/cookies')({
  component: CookiesPage,
  head: () =>
    buildSeo({
      title: 'Cookies | Quidkey',
      description: 'Manage your cookie preferences and view our cookie declaration.',
      path: '/cookies',
    }),
})

function CookiesPage() {
  return (
    <PageLayout>
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Cookies
          </h1>
          <p className="text-muted-foreground mb-8">
            You can update your cookie preferences at any time. If you’re in a region where
            consent is required, we won’t run analytics until you opt in.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <Button type="button" onClick={() => openCookiebotPreferences({ fallbackUrl: '/cookies' })}>
              Manage cookie preferences
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => window.location.assign('/privacy')}
            >
              Privacy notice
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-2">Cookie declaration</h2>
            <p className="text-sm text-muted-foreground mb-6">
              This section is provided by our consent manager (Cookiebot) and lists cookies
              by category.
            </p>

            {COOKIEBOT_DOMAIN_GROUP_ID ? (
              <>
                <div id="CookieDeclaration" />
                <script
                  id="CookieDeclaration"
                  src={`https://consent.cookiebot.com/${COOKIEBOT_DOMAIN_GROUP_ID}/cd.js`}
                  type="text/javascript"
                  async
                />
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Cookiebot isn’t configured for this environment (missing{' '}
                <code className="font-mono">VITE_COOKIEBOT_DOMAIN_GROUP_ID</code>).
              </p>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

