import { createFileRoute, Link } from '@tanstack/react-router'
import { PageLayout } from '@/components/layout/page-layout'
import { buildSeo } from '@/lib/seo'

export const Route = createFileRoute('/terms')({
  component: TermsPage,
  head: () =>
    buildSeo({
      title: 'Website Terms of Use: Acceptable Use | Quidkey',
      description:
        "Read Quidkey's website terms, acceptable use rules, disclaimers, and third-party link guidance, plus how to contact us with questions.",
      path: '/terms',
    }),
})

function TermsPage() {
  return (
    <PageLayout>
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Terms of Use</h1>
          <p className="text-muted-foreground mb-8">
            These terms apply to your use of this website. For product and merchant terms, please
            contact our team. If you have questions, email{' '}
            <a className="text-primary hover:underline" href="mailto:legal@quidkey.com">
              legal@quidkey.com
            </a>
            .
          </p>

          <div className="rounded-2xl border border-border bg-white p-6 md:p-8 space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-2">Acceptable use</h2>
              <p className="text-sm text-muted-foreground">
                Don&apos;t attempt to disrupt the site, scrape or reverse engineer services, or use
                the site to distribute malicious content. We may restrict access to protect
                reliability and security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">No warranties</h2>
              <p className="text-sm text-muted-foreground">
                This website is provided &quot;as is&quot; without warranties of any kind. We may
                update content at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Third-party links</h2>
              <p className="text-sm text-muted-foreground">
                This site links to third-party websites (for example, documentation). We&apos;re
                not responsible for their content or practices. See our{' '}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Notice
                </Link>{' '}
                for more.
              </p>
            </section>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

