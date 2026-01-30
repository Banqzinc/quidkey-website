import { createFileRoute } from '@tanstack/react-router'
import { PageLayout, PageHero, FeatureGrid, BenefitsSection, HowItWorksSteps, PageCTA } from '@/components/layout/page-layout'
import { RotateCcw, Zap, Shield, Globe, Clock, CheckCircle } from 'lucide-react'
import { buildSeo } from '@/lib/seo'

export const Route = createFileRoute('/products/refunds')({
  component: RefundsPage,
  head: () =>
    buildSeo({
      title: 'Fast Bank-to-Bank Refunds | Quidkey',
      description:
        'Process refunds instantly back to customer bank accounts. No card network delays, no disputes. Fast, transparent, and cost-effective.',
      path: '/products/refunds',
    }),
})

function RefundsPage() {
  const features = [
    {
      icon: RotateCcw,
      title: 'Instant Initiation',
      description: 'Initiate refunds with one API call or click. No manual bank transfers, no waiting.',
    },
    {
      icon: Zap,
      title: 'Same-Day Settlement',
      description: 'Refunds reach customer accounts the same day in UK/EU. 1-2 days in the US.',
    },
    {
      icon: Shield,
      title: 'No Disputes',
      description: 'Bank-to-bank refunds eliminate chargeback risk. Clear audit trail for every transaction.',
    },
    {
      icon: Globe,
      title: 'Cross-Border Support',
      description: 'Refund to any bank account in supported regions. FX handled automatically if needed.',
    },
    {
      icon: Clock,
      title: 'Real-Time Status',
      description: 'Track refund status from initiation to completion. Know exactly when funds arrive.',
    },
    {
      icon: CheckCircle,
      title: 'Partial Refunds',
      description: 'Full or partial refunds supported. Flexible amounts for complex return scenarios.',
    },
  ]

  const benefits = [
    {
      stat: '< 24h',
      statLabel: 'to customer',
      title: 'Faster than cards',
      description: 'Card refunds take 5-10 business days. Bank refunds arrive in hours.',
    },
    {
      stat: '$0',
      statLabel: 'dispute fees',
      title: 'No chargebacks',
      description: 'Bank authentication means no unauthorized transactions. No disputes to manage.',
    },
    {
      stat: '1 click',
      statLabel: 'to process',
      title: 'Effortless operations',
      description: 'Process refunds from the dashboard or via API. No manual bank transfers.',
    },
  ]

  const steps = [
    {
      step: '1',
      title: 'Initiate the refund',
      description: 'Select the original transaction and specify the refund amount. Full or partial.',
    },
    {
      step: '2',
      title: 'Automatic routing',
      description: 'Quidkey routes the refund back to the original customer bank account.',
    },
    {
      step: '3',
      title: 'Customer receives funds',
      description: 'Funds arrive in the customer\'s account. You receive confirmation.',
    },
  ]

  return (
    <PageLayout>
      <PageHero
        badge="Treasury"
        title="Refunds that just work."
        titleGradient="Fast. Simple. Direct."
        description="Process refunds instantly back to customer bank accounts. No card network delays, no dispute risk. Same-day settlement in UK/EU."
        features={['Same-day settlement', 'No chargebacks', 'Cross-border support']}
      />

      <FeatureGrid
        title="Better refunds for everyone"
        subtitle="Faster for customers, simpler for you."
        features={features}
      />

      <BenefitsSection
        title="Why bank refunds win"
        subtitle="Speed, simplicity, and zero disputes."
        benefits={benefits}
      />

      <HowItWorksSteps
        title="Refunds in three steps"
        subtitle="From initiation to customer receipt."
        steps={steps}
      />

      <PageCTA />
    </PageLayout>
  )
}
