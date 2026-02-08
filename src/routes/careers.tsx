import { createFileRoute } from '@tanstack/react-router'
import { PageCTA, PageHero, PageLayout } from '@/components/layout/page-layout'
import { buildSeo } from '@/lib/seo'

// NOTE: In some editor/lint setups the generated router types lag behind new files.
// This is safe because the file path is still correct and the route is generated at build time.
export const Route = createFileRoute('/careers' as never)({
  component: CareersPage,
  head: () =>
    buildSeo({
      title: 'Careers | Quidkey',
      description:
        'Help us build AI-native clearing infrastructure for pay by bank. Join Quidkey.',
      path: '/careers',
    }),
})

function CareersPage() {
  return (
    <PageLayout>
      <PageHero
        badge="Company"
        title="Careers"
        titleGradient="at Quidkey"
        description="We’re building reliable infrastructure for global commerce. If you care about payments, AI, and real-world systems, we should talk."
        features={[
          'Mission-driven, product-first',
          'Serious engineering',
          'Global by default',
        ]}
        ctaPrimary={{ label: 'Email us', href: 'mailto:support@quidkey.com?subject=Careers%20at%20Quidkey' }}
        ctaSecondary={{ label: 'See About', href: '/about' }}
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-border p-6 md:p-8">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3">
              Open roles
            </h2>
            <p className="text-muted-foreground">
              We’re keeping the website simple. If you’re interested, send a short intro and what you’d like to work on.
            </p>
            <div className="mt-6">
              <a
                href="mailto:support@quidkey.com?subject=Careers%20at%20Quidkey"
                className="text-primary font-medium hover:underline"
              >
                support@quidkey.com
              </a>
            </div>
          </div>
        </div>
      </section>

      <PageCTA />
    </PageLayout>
  )
}
