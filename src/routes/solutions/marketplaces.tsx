import { createFileRoute } from '@tanstack/react-router'
import { PageLayout, PageHero, FeatureGrid, BenefitsSection, HowItWorksSteps, PageCTA } from '@/components/layout/page-layout'
import { Store, GitBranch, Shield, Clock, Globe, Wallet } from 'lucide-react'
import { buildSeo } from '@/lib/seo'

export const Route = createFileRoute('/solutions/marketplaces')({
  component: MarketplacesPage,
  head: () =>
    buildSeo({
      title: 'Pay by Bank for Marketplaces | Quidkey',
      description:
        'Programmable splits, escrow, and payouts for marketplaces. Accept payments, split to sellers, and hold for disputes, all automated.',
      path: '/solutions/marketplaces',
    }),
})

function MarketplacesPage() {
  const features = [
    {
      icon: GitBranch,
      title: 'Programmable Splits',
      description: 'Split payments to multiple sellers automatically. Define percentages or fixed amounts.',
    },
    {
      icon: Wallet,
      title: 'Escrow & Holds',
      description: 'Hold funds for disputes, returns, or delivery confirmation. Release on your terms.',
    },
    {
      icon: Clock,
      title: 'Scheduled Payouts',
      description: 'Pay sellers daily, weekly, or on custom schedules. Batch payouts automatically.',
    },
    {
      icon: Shield,
      title: 'Platform Protection',
      description: 'Hold reserves for fraud, returns, and disputes. Protect platform economics.',
    },
    {
      icon: Globe,
      title: 'Multi-Currency Sellers',
      description: 'Sellers in different countries get paid in their currency. FX handled automatically.',
    },
    {
      icon: Store,
      title: 'Seller Onboarding',
      description: 'Add sellers with bank accounts. KYC and verification handled through the platform.',
    },
  ]

  const benefits = [
    {
      stat: '1 click',
      statLabel: 'splits',
      title: 'Automatic distribution',
      description: 'Define split rules once. Every payment distributes automatically.',
    },
    {
      stat: 'Flexible',
      statLabel: 'holds',
      title: 'Control fund release',
      description: 'Hold for delivery, approval, or dispute period. Release when ready.',
    },
    {
      stat: 'Global',
      statLabel: 'payouts',
      title: 'Pay sellers anywhere',
      description: 'Sellers in UK, EU, US, and Australia receive funds in local currency.',
    },
  ]

  const steps = [
    {
      step: '1',
      title: 'Onboard sellers',
      description: 'Add sellers with bank account details. Complete verification requirements.',
    },
    {
      step: '2',
      title: 'Configure splits',
      description: 'Define how payments divide: platform fee, seller share, tax holds, reserves.',
    },
    {
      step: '3',
      title: 'Automate payouts',
      description: 'Set payout schedules. Funds distribute automatically to seller accounts.',
    },
  ]

  return (
    <PageLayout>
      <PageHero
        badge="Marketplaces"
        title="End-to-end"
        titleGradient="marketplace payments."
        description="Accept payments, split to sellers, hold for disputes, and payout on schedule. Programmable treasury for complex marketplace flows."
        features={['Programmable splits', 'Escrow & holds', 'Global payouts']}
      />

      <FeatureGrid
        title="Built for marketplace complexity"
        subtitle="Everything multi-seller platforms need."
        features={features}
      />

      <BenefitsSection
        title="Why marketplaces choose Quidkey"
        subtitle="Complex flows, simple operations."
        benefits={benefits}
      />

      <HowItWorksSteps
        title="Launch marketplace payments"
        subtitle="From onboarding to automated payouts."
        steps={steps}
      />

      <PageCTA />
    </PageLayout>
  )
}
