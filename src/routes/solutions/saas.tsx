import { createFileRoute } from '@tanstack/react-router'
import { PageLayout, PageHero, FeatureGrid, BenefitsSection, HowItWorksSteps, PageCTA } from '@/components/layout/page-layout'
import { Monitor, RefreshCw, TrendingDown, Globe, Code, Zap } from 'lucide-react'
import { buildSeo } from '@/lib/seo'

export const Route = createFileRoute('/solutions/saas')({
  component: SaaSPage,
  head: () =>
    buildSeo({
      title: 'SaaS Subscriptions | Quidkey',
      description:
        'Subscription billing made simple. Hosted checkout or iframe integration. Lower fees, no failed payments.',
      path: '/solutions/saas',
    }),
})

function SaaSPage() {
  const features = [
    {
      icon: RefreshCw,
      title: 'Flexible billing cycles',
      description: 'Weekly, monthly, annual.',
    },
    {
      icon: TrendingDown,
      title: 'Lower fees',
      description: '1-3% per transaction.',
    },
    {
      icon: Globe,
      title: 'Multi-currency',
      description: 'GBP, EUR, USD, AUD.',
    },
    {
      icon: Zap,
      title: 'Never fails',
      description: 'No expired cards.',
    },
    {
      icon: Monitor,
      title: 'Hosted checkout',
      description: 'Ready in minutes.',
    },
    {
      icon: Code,
      title: 'Iframe embed',
      description: 'Seamless integration.',
    },
  ]

  const benefits = [
    {
      stat: '< 1 day',
      statLabel: 'to launch',
      title: 'Fast integration',
      description: 'Hosted checkout or iframe.',
    },
    {
      stat: '0%',
      statLabel: 'failed renewals',
      title: 'No card failures',
      description: 'Bank payments never expire.',
    },
    {
      stat: '1-3%',
      statLabel: 'per transaction',
      title: 'Simple pricing',
      description: 'No hidden fees.',
    },
  ]

  const steps = [
    {
      step: '1',
      title: 'Choose integration',
      description: 'Hosted checkout or iframe.',
    },
    {
      step: '2',
      title: 'Set up plans',
      description: 'Define billing cycles.',
    },
    {
      step: '3',
      title: 'Start collecting',
      description: 'Automatic renewals.',
    },
  ]

  return (
    <PageLayout>
      <PageHero
        badge="SaaS"
        title="Subscription billing"
        titleGradient="made simple."
        description="Launch subscriptions fast. Hosted checkout or iframe integration. Lower fees, no failed payments."
        features={['Hosted checkout', 'Iframe embed', 'Auto renewals']}
      />

      <FeatureGrid
        title="Built for subscriptions"
        subtitle="Everything you need."
        features={features}
      />

      <BenefitsSection
        title="Why SaaS teams choose Quidkey"
        subtitle="Ship faster, collect more."
        benefits={benefits}
      />

      <HowItWorksSteps
        title="Go live quickly"
        subtitle="Simple setup options."
        steps={steps}
      />

      <PageCTA />
    </PageLayout>
  )
}
