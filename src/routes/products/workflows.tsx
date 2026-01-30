import { createFileRoute } from '@tanstack/react-router'
import { PageLayout, PageHero, FeatureGrid, BenefitsSection, HowItWorksSteps, PageCTA } from '@/components/layout/page-layout'
import { Workflow, MessageSquare, Cog, Shield, GitBranch, FileCheck } from 'lucide-react'
import { buildSeo } from '@/lib/seo'

export const Route = createFileRoute('/products/workflows')({
  component: WorkflowsPage,
  head: () =>
    buildSeo({
      title: 'Programmable Treasury Workflows (Tax, Splits, FX) | Quidkey',
      description:
        'Define how money moves after payment in plain English. Automate tax holds, splits, FX, and payouts with programmable treasury workflows.',
      path: '/products/workflows',
    }),
})

function WorkflowsPage() {
  const features = [
    {
      icon: MessageSquare,
      title: 'Plain English Programming',
      description: 'Describe what you want: "Hold 10% for refunds, split 70/30 with supplier." Quidkey executes it.',
    },
    {
      icon: Cog,
      title: 'Deterministic Execution',
      description: 'Workflows compile to CEL (Common Expression Language). Predictable, auditable, correct.',
    },
    {
      icon: GitBranch,
      title: 'Conditional Logic',
      description: 'Branch based on amount, currency, customer location, product type, or any custom field.',
    },
    {
      icon: Workflow,
      title: 'Multi-Step Flows',
      description: 'Chain operations: calculate tax, then split, then convert, then settle. All automatic.',
    },
    {
      icon: Shield,
      title: 'Audit-Ready Logs',
      description: 'Every workflow execution is logged with inputs, outputs, and decision paths.',
    },
    {
      icon: FileCheck,
      title: 'Version Control',
      description: 'Track changes to workflows over time. Roll back if needed. Full history preserved.',
    },
  ]

  const benefits = [
    {
      stat: '10-20h',
      statLabel: 'saved monthly',
      title: 'Eliminate manual work',
      description: 'CFOs spend 10-20 hours monthly on treasury operations. Automate it all.',
    },
    {
      stat: '100%',
      statLabel: 'accuracy',
      title: 'No human error',
      description: 'Deterministic execution means no missed steps, no calculation errors.',
    },
    {
      stat: 'Instant',
      statLabel: 'execution',
      title: 'Real-time automation',
      description: 'Workflows execute as payments arrive. No overnight batch processing.',
    },
  ]

  const steps = [
    {
      step: '1',
      title: 'Define your intent',
      description: 'Describe what should happen after payment: tax holds, splits, conversions, settlements.',
    },
    {
      step: '2',
      title: 'Quidkey compiles',
      description: 'Your plain English becomes executable workflow logic. Review and approve.',
    },
    {
      step: '3',
      title: 'Automatic execution',
      description: 'Every qualifying payment triggers the workflow. Monitor results in real time.',
    },
  ]

  return (
    <PageLayout>
      <PageHero
        badge="Programmable Treasury"
        title="Plain English becomes"
        titleGradient="deterministic execution."
        description="Define how money moves after payment. Tax holds, splits, FX, and settlements, all automated with programmable workflows."
        features={['Plain English input', 'CEL-compiled execution', 'Audit-ready logs']}
      />

      <FeatureGrid
        title="Treasury automation, reimagined"
        subtitle="Stop building spreadsheets. Start building workflows."
        features={features}
      />

      <BenefitsSection
        title="The future of treasury operations"
        subtitle="Automate what you currently do manually."
        benefits={benefits}
      />

      <HowItWorksSteps
        title="From intent to execution"
        subtitle="How programmable treasury works."
        steps={steps}
      />

      <PageCTA />
    </PageLayout>
  )
}
