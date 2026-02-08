import { createFileRoute } from '@tanstack/react-router'
import { PageLayout, PageHero, FeatureGrid, BenefitsSection, HowItWorksSteps, PageCTA } from '@/components/layout/page-layout'
import { Wallet, ArrowRightLeft, TrendingUp, Clock, Shield, BarChart3 } from 'lucide-react'
import { buildSeo } from '@/lib/seo'

export const Route = createFileRoute('/products/multi-currency')({
  component: MultiCurrencyPage,
  head: () =>
    buildSeo({
      title: 'Multi-Currency Wallets & FX Conversion | Quidkey',
      description:
        'Hold, convert, and manage multiple currencies with transparent FX and real-time balances. Automate conversions and settlements as part of your money workflows.',
      path: '/products/multi-currency',
    }),
})

function MultiCurrencyPage() {
  const features = [
    {
      icon: Wallet,
      title: 'Currency wallets',
      description: 'Hold GBP, EUR, USD, AUD.',
    },
    {
      icon: ArrowRightLeft,
      title: 'Instant conversion',
      description: 'Convert with competitive rates.',
    },
    {
      icon: TrendingUp,
      title: 'Rate alerts',
      description: 'Convert at optimal times.',
    },
    {
      icon: Clock,
      title: 'Real-time balances',
      description: 'See updates as they happen.',
    },
    {
      icon: Shield,
      title: 'Protected funds',
      description: 'Held with regulated partners.',
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Track FX exposure and history.',
    },
  ]

  const benefits = [
    {
      stat: '0.25%',
      statLabel: 'FX margin',
      title: 'Competitive rates',
      description: 'Low margin. No hidden fees.',
    },
    {
      stat: 'Instant',
      statLabel: 'conversion',
      title: 'Fast execution',
      description: 'Convert in seconds.',
    },
    {
      stat: '24/7',
      statLabel: 'visibility',
      title: 'Always accessible',
      description: 'Manage currencies anytime.',
    },
  ]

  const steps = [
    {
      step: '1',
      title: 'Receive payments',
      description: 'Payments credit in original currency.',
    },
    {
      step: '2',
      title: 'Hold or convert',
      description: 'Keep or convert when ready.',
    },
    {
      step: '3',
      title: 'Withdraw',
      description: 'Transfer to your bank.',
    },
  ]

  return (
    <PageLayout>
      <PageHero
        badge="Treasury"
        title="Multi-currency made simple."
        titleGradient="Hold. Convert. Control."
        description="Manage currencies from one dashboard. Hold balances. Convert at competitive rates."
        features={['4 currencies', '0.25% FX margin', 'Instant conversion']}
      />

      <FeatureGrid
        title="Complete currency management"
        subtitle="Operate across currencies."
        features={features}
      />

      <BenefitsSection
        title="Better rates. Full control."
        subtitle="Stop losing money on FX."
        benefits={benefits}
      />

      <HowItWorksSteps
        title="How it works"
        subtitle="Simple flow."
        steps={steps}
      />

      <PageCTA />
    </PageLayout>
  )
}
