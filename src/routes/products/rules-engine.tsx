import { createFileRoute } from '@tanstack/react-router'
import { PageLayout, PageHero, FeatureGrid, BenefitsSection, HowItWorksSteps, PageCTA } from '@/components/layout/page-layout'
import { Code, Zap, GitBranch, Bell, Shield, Settings } from 'lucide-react'

export const Route = createFileRoute('/products/rules-engine')({
  component: RulesEnginePage,
  head: () => ({
    meta: [
      { title: 'Event-Driven Rules Engine | Quidkey' },
      { name: 'description', content: 'Define event-driven rules for money movement. Trigger actions on payments, refunds, settlements, and custom events.' },
    ],
  }),
})

function RulesEnginePage() {
  const features = [
    {
      icon: Zap,
      title: 'Event-Driven Triggers',
      description: 'React to payment events in real time: completed, failed, refunded, settled.',
    },
    {
      icon: GitBranch,
      title: 'Conditional Logic',
      description: 'Define conditions: if amount > $1000, if currency = EUR, if customer.country = US.',
    },
    {
      icon: Code,
      title: 'CEL Expressions',
      description: 'Write rules in Common Expression Language. Powerful, type-safe, and auditable.',
    },
    {
      icon: Bell,
      title: 'Webhook Actions',
      description: 'Trigger webhooks to external systems. Notify your ERP, CRM, or custom backend.',
    },
    {
      icon: Shield,
      title: 'Fraud Prevention',
      description: 'Build custom fraud rules. Flag suspicious patterns, block high-risk transactions.',
    },
    {
      icon: Settings,
      title: 'No-Code Builder',
      description: 'Visual rule builder for simple cases. Code editor for complex logic. Your choice.',
    },
  ]

  const benefits = [
    {
      stat: 'Real-time',
      statLabel: 'execution',
      title: 'Instant reactions',
      description: 'Rules fire as events occur. No batch processing, no delays.',
    },
    {
      stat: 'Unlimited',
      statLabel: 'rules',
      title: 'Scale without limits',
      description: 'Create as many rules as needed. No per-rule pricing.',
    },
    {
      stat: 'Full',
      statLabel: 'audit trail',
      title: 'Complete visibility',
      description: 'See which rules fired, what conditions matched, and what actions executed.',
    },
  ]

  const steps = [
    {
      step: '1',
      title: 'Define the trigger',
      description: 'Select the event that starts the rule: payment.completed, refund.initiated, etc.',
    },
    {
      step: '2',
      title: 'Set conditions',
      description: 'Add conditions that must be true: amount thresholds, currencies, customer attributes.',
    },
    {
      step: '3',
      title: 'Specify actions',
      description: 'Define what happens when conditions match: route funds, send webhook, flag for review.',
    },
  ]

  return (
    <PageLayout>
      <PageHero
        badge="Programmable Treasury"
        title="Rules that react."
        titleGradient="Events that trigger action."
        description="Build event-driven rules for money movement. Trigger on payments, refunds, and settlements. Execute actions in real time."
        features={['Event-driven', 'CEL expressions', 'Real-time execution']}
      />

      <FeatureGrid
        title="Complete control over money flow"
        subtitle="React to every event with custom logic."
        features={features}
      />

      <BenefitsSection
        title="Power without complexity"
        subtitle="Simple rules, powerful results."
        benefits={benefits}
      />

      <HowItWorksSteps
        title="Build rules in three steps"
        subtitle="From event to action."
        steps={steps}
      />

      <PageCTA />
    </PageLayout>
  )
}
