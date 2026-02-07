import { createFileRoute } from '@tanstack/react-router'
import { PageLayout, PageHero, FeatureGrid, BenefitsSection, HowItWorksSteps, PageCTA } from '@/components/layout/page-layout'
import { Monitor, RefreshCw, TrendingDown, Globe, FileCheck, Shield } from 'lucide-react'
import { buildSeo } from '@/lib/seo'

export const Route = createFileRoute('/solutions/saas')({
  component: SaaSPage,
  head: () =>
    buildSeo({
      title: 'SaaS | Quidkey',
      description:
        'Recurring payments at 1-3.5%. Stay seller-of-record. Automate tax.',
      path: '/solutions/saas',
    }),
})

function SaaSPage() {
  const features = [
    {
      icon: RefreshCw,
      title: 'Recurring payments',
      description: 'Automatic collection.',
    },
    {
      icon: TrendingDown,
      title: 'Lower than cards',
      description: '1-3.5% per renewal.',
    },
    {
      icon: Globe,
      title: 'Global',
      description: 'GBP, EUR, USD, AUD.',
    },
    {
      icon: FileCheck,
      title: 'Auto tax',
      description: 'Calculate by jurisdiction.',
    },
    {
      icon: Monitor,
      title: 'Stay seller-of-record',
      description: 'Keep your customers.',
    },
    {
      icon: Shield,
      title: 'No chargebacks',
      description: 'Zero is better.',
    },
  ]

  const benefits = [
    {
      stat: '5-10%',
      statLabel: 'vs MoR fees',
      title: 'Better than Paddle',
      description: '1-3.5% not 5-10%.',
    },
    {
      stat: '10-20h',
      statLabel: 'saved monthly',
      title: 'Automate treasury',
      description: 'Tax and FX handled.',
    },
    {
      stat: 'B2B ready',
      statLabel: 'no disputes',
      title: 'For business buyers',
      description: 'No personal card needed.',
    },
  ]

  const steps = [
    {
      step: '1',
      title: 'Connect billing',
      description: 'Works with any stack.',
    },
    {
      step: '2',
      title: 'Enable recurring',
      description: 'Customers authorize.',
    },
    {
      step: '3',
      title: 'Automate',
      description: 'Tax, FX, settlement.',
    },
  ]

  return (
    <PageLayout>
      <PageHero
        badge="SaaS"
        title="Subscriptions without"
        titleGradient="the MoR tax."
        description="1-3.5% recurring. Stay seller-of-record. Automate tax."
        features={['Recurring', 'Seller-of-record', 'Auto tax']}
      />

      <FeatureGrid
        title="Built for SaaS"
        subtitle="Maximize margin."
        features={features}
      />

      <BenefitsSection
        title="Why SaaS chooses Quidkey"
        subtitle="Better unit economics."
        benefits={benefits}
      />

      <HowItWorksSteps
        title="Launch recurring"
        subtitle="Integration to collections."
        steps={steps}
      />

      <PageCTA />
    </PageLayout>
  )
}
