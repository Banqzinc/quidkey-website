import { createFileRoute } from '@tanstack/react-router'
import { PageLayout, PageHero, FeatureGrid, BenefitsSection, HowItWorksSteps, PageCTA } from '@/components/layout/page-layout'
import { RotateCcw, Zap, Shield, Globe, Clock, CheckCircle } from 'lucide-react'
import { buildSeo } from '@/lib/seo'

export const Route = createFileRoute('/products/refunds')({
  component: RefundsPage,
  head: () =>
    buildSeo({
      title: 'Instant Pay by Bank Refunds | Quidkey',
      description:
        'Issue refunds directly back to customer bank accounts with faster settlement than cards. Keep a clean audit trail and automate reserves and refund workflows.',
      path: '/products/refunds',
    }),
})

function RefundsPage() {
  const features = [
    {
      icon: RotateCcw,
      title: 'One-click refund',
      description: 'Initiate with one API call or click.',
    },
    {
      icon: Zap,
      title: 'Same-day',
      description: 'Same day in UK/EU. 1-2 days US.',
    },
    {
      icon: Shield,
      title: 'No disputes',
      description: 'Clear audit trail. No chargebacks.',
    },
    {
      icon: Globe,
      title: 'Cross-border',
      description: 'Refund to any supported bank.',
    },
    {
      icon: Clock,
      title: 'Real-time status',
      description: 'Track from start to finish.',
    },
    {
      icon: CheckCircle,
      title: 'Partial refunds',
      description: 'Full or partial amounts.',
    },
  ]

  const benefits = [
    {
      stat: '< 24h',
      statLabel: 'to customer',
      title: 'Faster than cards',
      description: 'Cards take 5-10 days. Banks take hours.',
    },
    {
      stat: '$0',
      statLabel: 'dispute fees',
      title: 'No chargebacks',
      description: 'No unauthorized transactions.',
    },
    {
      stat: '1 click',
      statLabel: 'to process',
      title: 'Easy operations',
      description: 'No manual bank transfers.',
    },
  ]

  const steps = [
    {
      step: '1',
      title: 'Initiate refund',
      description: 'Select transaction. Set amount.',
    },
    {
      step: '2',
      title: 'Automatic routing',
      description: 'Routes to original bank account.',
    },
    {
      step: '3',
      title: 'Customer receives',
      description: 'Funds arrive. You get confirmation.',
    },
  ]

  return (
    <PageLayout>
      <PageHero
        badge="Treasury"
        title="Refunds that just work."
        titleGradient="Fast. Simple. Direct."
        description="Refunds back to customer bank accounts. Same-day in UK/EU. No disputes."
        features={['Same-day', 'No chargebacks', 'Cross-border']}
      />

      <FeatureGrid
        title="Better refunds"
        subtitle="Faster for customers. Simpler for you."
        features={features}
      />

      <BenefitsSection
        title="Why bank refunds"
        subtitle="Speed and simplicity."
        benefits={benefits}
      />

      <HowItWorksSteps
        title="3 step refunds"
        subtitle="Initiation to receipt."
        steps={steps}
      />

      <PageCTA />
    </PageLayout>
  )
}
