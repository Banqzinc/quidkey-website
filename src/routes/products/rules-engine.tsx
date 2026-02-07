import { createFileRoute } from '@tanstack/react-router'
import { PageLayout, PageHero, FeatureGrid, BenefitsSection, HowItWorksSteps, PageCTA } from '@/components/layout/page-layout'
import { Code, Zap, GitBranch, Bell, Shield, Settings } from 'lucide-react'
import { buildSeo } from '@/lib/seo'

export const Route = createFileRoute('/products/rules-engine')({
  component: RulesEnginePage,
  head: () =>
    buildSeo({
      title: 'Rules Engine | Quidkey',
      description:
        'Event-driven rules for money movement. Real-time triggers and actions.',
      path: '/products/rules-engine',
    }),
})

function RulesEnginePage() {
  const features = [
    {
      icon: Zap,
      title: 'Event triggers',
      description: 'React to payments, refunds, settlements.',
    },
    {
      icon: GitBranch,
      title: 'Conditions',
      description: 'If amount > $1000, if currency = EUR.',
    },
    {
      icon: Code,
      title: 'CEL expressions',
      description: 'Type-safe. Auditable.',
    },
    {
      icon: Bell,
      title: 'Webhooks',
      description: 'Notify external systems.',
    },
    {
      icon: Shield,
      title: 'Fraud rules',
      description: 'Flag suspicious patterns.',
    },
    {
      icon: Settings,
      title: 'Visual builder',
      description: 'No-code for simple rules.',
    },
  ]

  const benefits = [
    {
      stat: 'Real-time',
      statLabel: 'execution',
      title: 'Instant reactions',
      description: 'Rules fire as events occur.',
    },
    {
      stat: 'Unlimited',
      statLabel: 'rules',
      title: 'No limits',
      description: 'Create as many as needed.',
    },
    {
      stat: 'Full',
      statLabel: 'audit trail',
      title: 'Complete visibility',
      description: 'See what fired and why.',
    },
  ]

  const steps = [
    {
      step: '1',
      title: 'Pick trigger',
      description: 'Payment completed, refund initiated, etc.',
    },
    {
      step: '2',
      title: 'Set conditions',
      description: 'What must be true.',
    },
    {
      step: '3',
      title: 'Define action',
      description: 'What happens when triggered.',
    },
  ]

  return (
    <PageLayout>
      <PageHero
        badge="Programmable Treasury"
        title="Rules that react."
        titleGradient="Events that trigger action."
        description="Event-driven rules for money movement. Trigger on payments. Execute in real time."
        features={['Event-driven', 'Real-time', 'Auditable']}
      />

      <FeatureGrid
        title="Control money flow"
        subtitle="React to every event."
        features={features}
      />

      <BenefitsSection
        title="Power without complexity"
        subtitle="Simple rules. Powerful results."
        benefits={benefits}
      />

      <HowItWorksSteps
        title="Build rules in 3 steps"
        subtitle="Trigger to action."
        steps={steps}
      />

      <PageCTA />
    </PageLayout>
  )
}
