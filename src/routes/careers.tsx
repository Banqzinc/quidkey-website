import { createFileRoute } from '@tanstack/react-router'
import {
  PageCTA,
  PageHero,
  PageLayout,
  ContentSection,
  ContentCard,
} from '@/components/layout/page-layout'
import { buildSeo } from '@/lib/seo'
import { CONTACT_EMAIL, buildMailto } from '@/lib/urls'

export const Route = createFileRoute('/careers')({
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
        description="We're building reliable infrastructure for global commerce. If you care about payments, AI, and real-world systems, we should talk."
        features={[
          'Mission-driven, product-first',
          'Serious engineering',
          'Global by default',
        ]}
        ctaPrimary={{
          label: 'Email us',
          href: buildMailto('Careers at Quidkey'),
          external: true,
        }}
        ctaSecondary={{ label: 'See About', href: '/about' }}
      />

      <ContentSection>
        <div className="max-w-3xl mx-auto">
          <ContentCard
            title="Open roles"
            description="We're keeping the website simple. If you're interested, send a short intro and what you'd like to work on."
          >
            <div className="mt-6">
              <a
                href={buildMailto('Careers at Quidkey')}
                className="text-primary font-medium hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          </ContentCard>
        </div>
      </ContentSection>

      <PageCTA />
    </PageLayout>
  )
}
