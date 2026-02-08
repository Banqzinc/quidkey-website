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

export const Route = createFileRoute('/contact')({
  component: ContactPage,
  head: () =>
    buildSeo({
      title: 'Contact | Quidkey',
      description: 'Talk to Quidkey about pay by bank, routing, and treasury workflows.',
      path: '/contact',
    }),
})

const contactOptions = [
  {
    title: 'General inquiries',
    description: 'For now, the fastest way is email.',
    subject: 'Website inquiry',
  },
  {
    title: 'Press',
    description: "If you're writing about pay by bank or clearing infrastructure, we'd love to help.",
    subject: 'Press inquiry',
  },
]

function ContactPage() {
  return (
    <PageLayout>
      <PageHero
        badge="Company"
        title="Contact"
        titleGradient="Quidkey"
        description="Questions about pricing, coverage, or integration? Reach out—we'll get back quickly."
        features={['Sales & partnerships', 'Technical questions', 'Support']}
        ctaPrimary={{
          label: 'Email us',
          href: buildMailto('Website inquiry'),
          external: true,
        }}
        ctaSecondary={{ label: 'See pricing', href: '/pricing' }}
      />

      <ContentSection>
        <div className="max-w-3xl mx-auto grid gap-6">
          {contactOptions.map((option) => (
            <ContentCard
              key={option.title}
              title={option.title}
              description={option.description}
            >
              <div className="mt-6">
                <a
                  href={buildMailto(option.subject)}
                  className="text-primary font-medium hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
            </ContentCard>
          ))}
        </div>
      </ContentSection>

      <PageCTA />
    </PageLayout>
  )
}
