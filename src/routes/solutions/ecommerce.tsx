import { createFileRoute } from '@tanstack/react-router'
import { PageLayout, PageHero, FeatureGrid, BenefitsSection, HowItWorksSteps, PageCTA } from '@/components/layout/page-layout'
import { ShoppingCart, TrendingDown, Shield, Globe, Zap, BarChart3 } from 'lucide-react'
import { buildSeo } from '@/lib/seo'

export const Route = createFileRoute('/solutions/ecommerce')({
  component: EcommercePage,
  head: () =>
    buildSeo({
      title: 'Pay by Bank for Ecommerce Brands | Quidkey',
      description:
        'Accept pay by bank for ecommerce with lower fees and zero chargebacks. Improve conversion with bank prediction and automate post-payment workflows.',
      path: '/solutions/ecommerce',
    }),
})

function EcommercePage() {
  const features = [
    {
      icon: TrendingDown,
      title: 'Lower fees',
      description: 'Save up to 70% vs cards.',
    },
    {
      icon: Shield,
      title: 'Zero chargebacks',
      description: 'Bank auth. No disputes.',
    },
    {
      icon: Zap,
      title: 'Higher conversion',
      description: 'Bank prediction. One-click.',
    },
    {
      icon: Globe,
      title: 'Sell globally',
      description: 'UK, EU, US, Australia.',
    },
    {
      icon: ShoppingCart,
      title: 'Platform integrations',
      description: 'Shopify, iFrame, hosted.',
    },
    {
      icon: BarChart3,
      title: 'Treasury automation',
      description: 'Tax, splits, settlements.',
    },
  ]

  const benefits = [
    {
      stat: '70%',
      statLabel: 'lower fees',
      title: 'Better margins',
      description: 'Savings go straight to profit.',
    },
    {
      stat: '0%',
      statLabel: 'chargebacks',
      title: 'No fraud losses',
      description: 'Bank payments are authenticated.',
    },
    {
      stat: '15%',
      statLabel: 'checkout share',
      title: 'Growing adoption',
      description: 'Customers choosing bank.',
    },
  ]

  const steps = [
    {
      step: '1',
      title: 'Connect',
      description: 'Shopify app or API.',
    },
    {
      step: '2',
      title: 'Offer bank pay',
      description: 'Customers see their bank.',
    },
    {
      step: '3',
      title: 'Settle',
      description: 'Funds to your bank.',
    },
  ]

  return (
    <PageLayout>
      <PageHero
        badge="Ecommerce"
        title="Better margins for"
        titleGradient="online retail."
        description="Lower fees. Zero chargebacks. Pay by bank checkout for ecommerce."
        features={['70% lower fees', 'Zero chargebacks', 'Shopify native']}
      />

      <FeatureGrid
        title="Built for ecommerce"
        subtitle="Scale profitably."
        features={features}
      />

      <BenefitsSection
        title="Real results"
        subtitle="What stores are seeing."
        benefits={benefits}
      />

      <HowItWorksSteps
        title="Get started"
        subtitle="Live today."
        steps={steps}
      />

      <PageCTA />
    </PageLayout>
  )
}
