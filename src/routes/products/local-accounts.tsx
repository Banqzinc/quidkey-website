import { createFileRoute } from '@tanstack/react-router'
import { PageLayout, PageHero, FeatureGrid, BenefitsSection, HowItWorksSteps, PageCTA } from '@/components/layout/page-layout'
import { Building2, Globe, Shield, Banknote, ArrowRightLeft, FileCheck } from 'lucide-react'
import { buildSeo } from '@/lib/seo'

export const Route = createFileRoute('/products/local-accounts')({
  component: LocalAccountsPage,
  head: () =>
    buildSeo({
      title: 'Local Collection Accounts for Global Sales | Quidkey',
      description:
        'Collect in GBP, EUR, USD, and AUD without setting up local entities. Reduce FX costs, reconcile faster, and route funds into the right accounts automatically.',
      path: '/products/local-accounts',
    }),
})

function LocalAccountsPage() {
  const features = [
    {
      icon: Building2,
      title: 'No local entity',
      description: 'We provide the account. You receive funds.',
    },
    {
      icon: Globe,
      title: '4 currencies',
      description: 'GBP, EUR, USD, AUD.',
    },
    {
      icon: Shield,
      title: 'Fully compliant',
      description: 'Regulated partners. KYC handled.',
    },
    {
      icon: Banknote,
      title: 'Lower FX costs',
      description: 'Collect locally. Convert when optimal.',
    },
    {
      icon: ArrowRightLeft,
      title: 'Flexible settlement',
      description: 'Hold or sweep to home currency.',
    },
    {
      icon: FileCheck,
      title: 'Real-time reconciliation',
      description: 'Balances and history always current.',
    },
  ]

  const benefits = [
    {
      stat: 'Up to 70%',
      statLabel: 'FX savings',
      title: 'Cut currency costs',
      description: 'Batch conversions. Time your FX.',
    },
    {
      stat: 'Days',
      statLabel: 'not months',
      title: 'Fast activation',
      description: 'No local entity required.',
    },
    {
      stat: '4',
      statLabel: 'currencies',
      title: 'Global treasury',
      description: 'One dashboard. All currencies.',
    },
  ]

  const steps = [
    {
      step: '1',
      title: 'Verify',
      description: 'Submit business details. We handle compliance.',
    },
    {
      step: '2',
      title: 'Get accounts',
      description: 'Receive local account numbers.',
    },
    {
      step: '3',
      title: 'Collect',
      description: 'Funds flow in. Convert when ready.',
    },
  ]

  return (
    <PageLayout>
      <PageHero
        badge="Treasury"
        title="Local accounts. Global reach."
        titleGradient="No local entity required."
        description="Collect in GBP, EUR, USD, AUD. Reduce FX costs. No legal presence needed."
        features={['4 currencies', 'No entity', 'Lower FX']}
      />

      <FeatureGrid
        title="Global banking infrastructure"
        subtitle="What you need. Without the burden."
        features={features}
      />

      <BenefitsSection
        title="Why local accounts"
        subtitle="Reduce costs. Expand globally."
        benefits={benefits}
      />

      <HowItWorksSteps
        title="Get started"
        subtitle="Fast activation."
        steps={steps}
      />

      <PageCTA />
    </PageLayout>
  )
}
