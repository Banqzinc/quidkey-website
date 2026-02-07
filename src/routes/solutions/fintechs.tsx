import { createFileRoute } from '@tanstack/react-router'
import { PageLayout, PageHero, FeatureGrid, BenefitsSection, HowItWorksSteps, PageCTA } from '@/components/layout/page-layout'
import { Building2, Zap, Globe, Shield, Code2, BarChart3 } from 'lucide-react'
import { buildSeo } from '@/lib/seo'

export const Route = createFileRoute('/solutions/fintechs')({
  component: FintechsPage,
  head: () =>
    buildSeo({
      title: 'Fintechs | Quidkey',
      description:
        'White-label payments. One integration. Multi-region.',
      path: '/solutions/fintechs',
    }),
})

function FintechsPage() {
  const features = [
    {
      icon: Code2,
      title: 'One API',
      description: 'Multi-region from one codebase.',
    },
    {
      icon: Globe,
      title: 'Global',
      description: 'UK, EU, US, AU covered.',
    },
    {
      icon: Building2,
      title: 'White-label',
      description: 'Your brand, our rails.',
    },
    {
      icon: Shield,
      title: 'Compliant',
      description: 'SOC 2 Type II.',
    },
    {
      icon: Zap,
      title: 'Real-time',
      description: 'Webhooks. Instant status.',
    },
    {
      icon: BarChart3,
      title: 'Treasury tools',
      description: 'Rules engine. FX. Payouts.',
    },
  ]

  const benefits = [
    {
      stat: '1',
      statLabel: 'integration',
      title: 'Ship faster',
      description: 'One API. Four regions.',
    },
    {
      stat: 'SOC 2',
      statLabel: 'Type II',
      title: 'Enterprise ready',
      description: 'Pass security reviews.',
    },
    {
      stat: 'White-label',
      statLabel: 'everything',
      title: 'Your brand',
      description: 'Customers see you.',
    },
  ]

  const steps = [
    {
      step: '1',
      title: 'Integrate',
      description: 'Single API call.',
    },
    {
      step: '2',
      title: 'Configure',
      description: 'Regions, branding, flows.',
    },
    {
      step: '3',
      title: 'Launch',
      description: 'Your product, our rails.',
    },
  ]

  return (
    <PageLayout>
      <PageHero
        badge="Fintechs"
        title="Infrastructure for"
        titleGradient="fintech products."
        description="One API. Multi-region. White-label. SOC 2."
        features={['One integration', 'White-label', 'SOC 2 Type II']}
      />

      <FeatureGrid
        title="Built for fintechs"
        subtitle="Ship faster."
        features={features}
      />

      <BenefitsSection
        title="Why fintechs choose Quidkey"
        subtitle="Build, don't stitch."
        benefits={benefits}
      />

      <HowItWorksSteps
        title="Get started"
        subtitle="API to launch."
        steps={steps}
      />

      <PageCTA />
    </PageLayout>
  )
}
