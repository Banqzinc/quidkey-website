import { createFileRoute } from '@tanstack/react-router'
import { PageCTA, PageHero, PageLayout } from '@/components/layout/page-layout'
import { buildSeo } from '@/lib/seo'

// NOTE: In some editor/lint setups the generated router types lag behind new files.
// This is safe because the file path is still correct and the route is generated at build time.
export const Route = createFileRoute('/contact' as never)({
  component: ContactPage,
  head: () =>
    buildSeo({
      title: 'Contact | Quidkey',
      description: 'Talk to Quidkey about pay by bank, routing, and treasury workflows.',
      path: '/contact',
    }),
})

function ContactPage() {
  return (
    <PageLayout>
      <PageHero
        badge="Company"
        title="Contact"
        titleGradient="Quidkey"
        description="Questions about pricing, coverage, or integration? Reach out—we’ll get back quickly."
        features={[
          'Sales & partnerships',
          'Technical questions',
          'Support',
        ]}
        ctaPrimary={{ label: 'Email us', href: 'mailto:support@quidkey.com?subject=Quidkey%20website%20inquiry' }}
        ctaSecondary={{ label: 'See pricing', href: '/pricing' }}
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6">
            <div className="bg-white rounded-2xl border border-border p-6 md:p-8">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3">
                Email
              </h2>
              <p className="text-muted-foreground">
                For now, the fastest way is email.
              </p>
              <div className="mt-6">
                <a
                  href="mailto:support@quidkey.com?subject=Quidkey%20website%20inquiry"
                  className="text-primary font-medium hover:underline"
                >
                  support@quidkey.com
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border p-6 md:p-8">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3">
                Press
              </h2>
              <p className="text-muted-foreground">
                If you’re writing about pay by bank or clearing infrastructure, we’d love to help.
              </p>
              <div className="mt-6">
                <a
                  href="mailto:support@quidkey.com?subject=Press%20inquiry"
                  className="text-primary font-medium hover:underline"
                >
                  support@quidkey.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PageCTA />
    </PageLayout>
  )
}

