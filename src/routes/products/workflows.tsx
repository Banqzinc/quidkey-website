import { createFileRoute } from '@tanstack/react-router'
import { PageLayout, PageHero, FeatureGrid, BenefitsSection, HowItWorksSteps, PageCTA } from '@/components/layout/page-layout'
import { Workflow, MessageSquare, Cog, Shield, GitBranch, FileCheck } from 'lucide-react'
import { buildSeo } from '@/lib/seo'

export const Route = createFileRoute('/products/workflows')({
  component: WorkflowsPage,
  head: () =>
    buildSeo({
      title: 'Money Workflows | Quidkey',
      description:
        'Write simple rules. Money moves automatically. Tax, splits, FX, payouts.',
      path: '/products/workflows',
    }),
})

function WorkflowsPage() {
  const features = [
    {
      icon: MessageSquare,
      title: 'Plain English',
      description: 'Describe what you want.',
    },
    {
      icon: Cog,
      title: 'Automatic execution',
      description: 'Runs on every payment.',
    },
    {
      icon: GitBranch,
      title: 'Conditional logic',
      description: 'Branch on any field.',
    },
    {
      icon: Workflow,
      title: 'Multi-step',
      description: 'Chain operations together.',
    },
    {
      icon: Shield,
      title: 'Audit-ready',
      description: 'Full logs of every action.',
    },
    {
      icon: FileCheck,
      title: 'Version control',
      description: 'Track changes. Roll back.',
    },
  ]

  const benefits = [
    {
      stat: '10-20h',
      statLabel: 'saved monthly',
      title: 'Eliminate manual work',
      description: 'Automate treasury operations.',
    },
    {
      stat: '100%',
      statLabel: 'accuracy',
      title: 'No errors',
      description: 'Deterministic execution.',
    },
    {
      stat: 'Instant',
      statLabel: 'execution',
      title: 'Real-time',
      description: 'Runs as payments arrive.',
    },
  ]

  const steps = [
    {
      step: '1',
      title: 'Write your rule',
      description: 'What should happen after payment.',
    },
    {
      step: '2',
      title: 'Review',
      description: 'See the compiled logic.',
    },
    {
      step: '3',
      title: 'Go live',
      description: 'Runs automatically.',
    },
  ]

  return (
    <PageLayout>
      <PageHero
        badge="Money Workflows"
        title="Write simple rules."
        titleGradient="Money moves automatically."
        description="Tax, splits, FX, payouts. Describe it in plain English. It happens."
        features={['Plain English', 'Automatic', 'Audit-ready']}
      />

      <FeatureGrid
        title="Treasury automation"
        subtitle="Stop doing it manually."
        features={features}
      />

      <BenefitsSection
        title="Why workflows"
        subtitle="Automate what you do manually."
        benefits={benefits}
      />

      <HowItWorksSteps
        title="3 steps"
        subtitle="Write. Review. Go live."
        steps={steps}
      />

      <PageCTA />
    </PageLayout>
  )
}
