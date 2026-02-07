import { createFileRoute } from '@tanstack/react-router'
import { PageLayout, PageHero, FeatureGrid, BenefitsSection, HowItWorksSteps, PageCTA } from '@/components/layout/page-layout'
import { Briefcase, Receipt, TrendingDown, Clock, Shield, Globe } from 'lucide-react'
import { buildSeo } from '@/lib/seo'

export const Route = createFileRoute('/solutions/professional-services')({
  component: ProfessionalServicesPage,
  head: () =>
    buildSeo({
      title: 'Professional Services | Quidkey',
      description:
        'Accept invoice payments at 1-3%. No card limits.',
      path: '/solutions/professional-services',
    }),
})

function ProfessionalServicesPage() {
  const features = [
    {
      icon: Receipt,
      title: 'Invoice payments',
      description: 'Payment links by email.',
    },
    {
      icon: TrendingDown,
      title: 'Lower fees',
      description: '1-3% on any amount.',
    },
    {
      icon: Clock,
      title: 'Fast settlement',
      description: 'Funds land quickly.',
    },
    {
      icon: Briefcase,
      title: 'B2B optimized',
      description: 'Business accounts work.',
    },
    {
      icon: Shield,
      title: 'No disputes',
      description: 'Authenticated payments.',
    },
    {
      icon: Globe,
      title: 'International',
      description: 'Accept cross-border.',
    },
  ]

  const benefits = [
    {
      stat: '60%',
      statLabel: 'fee savings',
      title: 'Better margins',
      description: 'On high-value invoices.',
    },
    {
      stat: 'No limits',
      statLabel: 'on invoices',
      title: 'Any size',
      description: 'Banks handle any amount.',
    },
    {
      stat: 'B2B native',
      statLabel: 'payment flow',
      title: 'Business friendly',
      description: 'No personal card needed.',
    },
  ]

  const steps = [
    {
      step: '1',
      title: 'Send link',
      description: 'Attach to invoice.',
    },
    {
      step: '2',
      title: 'Client pays',
      description: 'Bank auth. Done.',
    },
    {
      step: '3',
      title: 'Receive',
      description: 'Funds to your bank.',
    },
  ]

  return (
    <PageLayout>
      <PageHero
        badge="Professional Services"
        title="Invoice payments at"
        titleGradient="1-3%."
        description="Accept high-value invoice payments. No limits. No disputes."
        features={['No limits', 'No disputes', 'Fast settlement']}
      />

      <FeatureGrid
        title="Built for services"
        subtitle="Designed for B2B."
        features={features}
      />

      <BenefitsSection
        title="Why services choose Quidkey"
        subtitle="Better for high-value."
        benefits={benefits}
      />

      <HowItWorksSteps
        title="Get started"
        subtitle="Send links today."
        steps={steps}
      />

      <PageCTA />
    </PageLayout>
  )
}
