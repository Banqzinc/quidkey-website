import { createFileRoute } from '@tanstack/react-router'
import { PageLayout, PageHero, FeatureGrid, BenefitsSection, HowItWorksSteps, PageCTA } from '@/components/layout/page-layout'
import { Wallet, ArrowRightLeft, TrendingUp, Clock, Shield, BarChart3 } from 'lucide-react'

export const Route = createFileRoute('/products/multi-currency')({
  component: MultiCurrencyPage,
  head: () => ({
    meta: [
      { title: 'Multi-Currency Wallets & Balances | Quidkey' },
      { name: 'description', content: 'Hold, convert, and manage multiple currencies in one place. Real-time balances, competitive FX rates, and automated currency operations.' },
    ],
  }),
})

function MultiCurrencyPage() {
  const features = [
    {
      icon: Wallet,
      title: 'Multi-Currency Wallets',
      description: 'Hold GBP, EUR, USD, and AUD in dedicated currency wallets. One dashboard, complete visibility.',
    },
    {
      icon: ArrowRightLeft,
      title: 'Instant Conversion',
      description: 'Convert between currencies with competitive mid-market rates. Execute instantly or schedule.',
    },
    {
      icon: TrendingUp,
      title: 'Rate Optimization',
      description: 'Monitor rates and convert at optimal times. Set rate alerts and automated conversion rules.',
    },
    {
      icon: Clock,
      title: 'Real-Time Balances',
      description: 'See your balances update in real time as payments arrive and conversions execute.',
    },
    {
      icon: Shield,
      title: 'Segregated Funds',
      description: 'Your funds are held separately with regulated banking partners. Full protection and transparency.',
    },
    {
      icon: BarChart3,
      title: 'Currency Analytics',
      description: 'Track currency exposure, conversion history, and FX impact on your business.',
    },
  ]

  const benefits = [
    {
      stat: '0.5%',
      statLabel: 'FX margin',
      title: 'Competitive rates',
      description: 'We add just 0.5% to the mid-market rate. No hidden fees, no spread manipulation.',
    },
    {
      stat: 'Instant',
      statLabel: 'conversion',
      title: 'Execute in seconds',
      description: 'Convert currencies instantly during market hours. Funds available immediately.',
    },
    {
      stat: '24/7',
      statLabel: 'visibility',
      title: 'Always accessible',
      description: 'View balances, schedule conversions, and manage currencies anytime.',
    },
  ]

  const steps = [
    {
      step: '1',
      title: 'Receive payments',
      description: 'Payments arrive in their original currency and credit to the appropriate wallet.',
    },
    {
      step: '2',
      title: 'Hold or convert',
      description: 'Keep funds in local currency or convert to your home currency when ready.',
    },
    {
      step: '3',
      title: 'Withdraw to your bank',
      description: 'Transfer funds to your bank account in any supported currency.',
    },
  ]

  return (
    <PageLayout>
      <PageHero
        badge="Treasury"
        title="Multi-currency made simple."
        titleGradient="Hold. Convert. Control."
        description="Manage multiple currencies from one dashboard. Hold balances, convert at competitive rates, and maintain full control of your global treasury."
        features={['4 currencies', '0.5% FX margin', 'Instant conversion']}
      />

      <FeatureGrid
        title="Complete currency management"
        subtitle="Everything you need to operate across currencies."
        features={features}
      />

      <BenefitsSection
        title="Better rates, complete control"
        subtitle="Stop losing money to hidden FX costs."
        benefits={benefits}
      />

      <HowItWorksSteps
        title="How multi-currency works"
        subtitle="Simple flow from payment to payout."
        steps={steps}
      />

      <PageCTA />
    </PageLayout>
  )
}
