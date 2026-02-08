import { createFileRoute, Link } from '@tanstack/react-router'
import { PageLayout } from '@/components/layout/page-layout'
import { buildSeo } from '@/lib/seo'

export const Route = createFileRoute('/privacy')({
  component: PrivacyPage,
  head: () =>
    buildSeo({
      title: 'Website Privacy Notice: Data Use & Rights | Quidkey',
      description:
        'How Quidkey collects, uses, and protects personal data when you browse this website, contact our team, or apply for a role.',
      path: '/privacy',
    }),
})

function PrivacyPage() {
  return (
    <PageLayout>
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Privacy Notice</h1>
          <p className="text-muted-foreground mb-8">
            This notice describes how we handle personal data on this website (for example, when you
            submit a contact form or apply for a role). If you need a copy of our full privacy
            documentation, email{' '}
            <a className="text-primary hover:underline" href="mailto:privacy@quidkey.com">
              privacy@quidkey.com
            </a>
            .
          </p>

          <div className="rounded-2xl border border-border bg-white p-6 md:p-8 space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-2">What we collect</h2>
              <p className="text-sm text-muted-foreground">
                Information you submit via forms (name, email, company, message) and, for job
                applications, optional fields like phone number, LinkedIn profile URL, and your
                resume/CV file.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">How we use it</h2>
              <p className="text-sm text-muted-foreground">
                To respond to inquiries, schedule demos, evaluate applications, and operate and
                secure this website. We do not sell your personal data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Analytics and cookies</h2>
              <p className="text-sm text-muted-foreground">
                Where required, analytics and other non-essential cookies only run after consent.
                You can review and update your preferences at any time on the{' '}
                <Link to="/cookies" className="text-primary hover:underline">
                  Cookies
                </Link>{' '}
                page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Your rights</h2>
              <p className="text-sm text-muted-foreground">
                Depending on your location, you may have rights to access, correct, or delete your
                data. Contact us at{' '}
                <a className="text-primary hover:underline" href="mailto:privacy@quidkey.com">
                  privacy@quidkey.com
                </a>{' '}
                and we&apos;ll help.
              </p>
            </section>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
