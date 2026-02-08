import { createFileRoute } from '@tanstack/react-router'
import { PageLayout, PageHero, FeatureGrid, BenefitsSection, HowItWorksSteps, PageCTA } from '@/components/layout/page-layout'
import { Network, TrendingDown, Shield, Banknote, Zap, FileCheck } from 'lucide-react'
import { buildSeo } from '@/lib/seo'

export const Route = createFileRoute('/solutions/marketplaces')({
  component: MarketplacesPage,
  head: () =>
    buildSeo({
      title: 'Pay by Bank Splits & Payouts for Marketplaces | Quidkey',
      description:
        'Collect with lower fees and automatically split payouts to sellers. Build programmable escrow, dispute holds, and reconciliation-ready marketplace money workflows.',
      path: '/solutions/marketplaces',
    }),
})

function MarketplacesPage() {
  const features = [
    {
      icon: Network,
      title: 'Automated splits',
      description: 'Revenue to sellers.',
    },
    {
      icon: TrendingDown,
      title: 'Lower fees',
      description: 'Save up to 70% vs cards.',
    },
    {
      icon: Banknote,
      title: 'Seller payouts',
      description: 'Instant or scheduled.',
    },
    {
      icon: Shield,
      title: 'No chargebacks',
      description: 'Authenticated payments.',
    },
    {
      icon: FileCheck,
      title: 'Tax automation',
      description: 'Hold and remit.',
    },
    {
      icon: Zap,
      title: 'Fast integration',
      description: 'API or hosted.',
    },
  ]

  const benefits = [
    {
      stat: '70%',
      statLabel: 'lower cost',
      title: 'Better take rate',
      description: 'Keep more per sale.',
    },
    {
      stat: 'Instant',
      statLabel: 'seller payouts',
      title: 'Happy sellers',
      description: 'Fast money = loyalty.',
    },
    {
      stat: 'Auto',
      statLabel: 'tax handling',
      title: 'No manual work',
      description: 'Hold, calculate, remit.',
    },
  ]

  const steps = [
    {
      step: '1',
      title: 'Connect',
      description: 'API integration.',
    },
    {
      step: '2',
      title: 'Collect',
      description: 'Buyer pays by bank.',
    },
    {
      step: '3',
      title: 'Split',
      description: 'Sellers get paid.',
    },
  ]

  return (
    <PageLayout>
      <PageHero
        badge="Marketplaces"
        title="Collect, split,"
        titleGradient="payout automatically."
        description="Lower collection fees. Auto splits. Instant seller payouts."
        features={['Auto splits', 'Instant payouts', 'Tax handled']}
      />

      <FeatureGrid
        title="Built for marketplaces"
        subtitle="End-to-end money movement."
        features={features}
      />

      <BenefitsSection
        title="Why marketplaces choose Quidkey"
        subtitle="Better economics."
        benefits={benefits}
      />

      <HowItWorksSteps
        title="Get started"
        subtitle="Collection to payout."
        steps={steps}
      />

      <PageCTA />
    </PageLayout>
  )
}
