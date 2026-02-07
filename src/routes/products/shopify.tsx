import { createFileRoute } from '@tanstack/react-router'
import { PageLayout, PageHero, FeatureGrid, BenefitsSection, HowItWorksSteps, PageCTA } from '@/components/layout/page-layout'
import { ShoppingCart, Zap, Shield, TrendingUp, Clock, CreditCard } from 'lucide-react'
import { buildSeo } from '@/lib/seo'

export const Route = createFileRoute('/products/shopify')({
  component: ShopifyPage,
  head: () =>
    buildSeo({
      title: 'Shopify Pay by Bank | Quidkey',
      description:
        'Shopify-approved pay by bank app. Lower fees. Zero chargebacks. Install in minutes.',
      path: '/products/shopify',
    }),
})

function ShopifyPage() {
  const features = [
    {
      icon: ShoppingCart,
      title: 'Shopify native',
      description: 'Approved app that works directly with your checkout.',
    },
    {
      icon: Zap,
      title: 'Bank prediction',
      description: "Shows your customer's bank for one-click payment.",
    },
    {
      icon: Shield,
      title: 'Zero chargebacks',
      description: 'Bank authentication means no disputes.',
    },
    {
      icon: TrendingUp,
      title: 'Lower fees',
      description: 'Save up to 60% vs cards.',
    },
    {
      icon: Clock,
      title: 'Fast settlement',
      description: 'Instant in UK/EU. 1-3 days in US.',
    },
    {
      icon: CreditCard,
      title: 'Works with cards',
      description: 'Offer both options. Customer chooses.',
    },
  ]

  const benefits = [
    {
      stat: '60%',
      statLabel: 'lower fees',
      title: 'Cut payment costs',
      description: 'Save $25-45k annually on $1M revenue.',
    },
    {
      stat: '0%',
      statLabel: 'chargebacks',
      title: 'No disputes',
      description: 'Bank authentication stops fraud.',
    },
    {
      stat: '15%',
      statLabel: 'checkout share',
      title: 'Growing adoption',
      description: 'Customers choosing bank payments.',
    },
  ]

  const steps = [
    {
      step: '1',
      title: 'Install the app',
      description: 'One click from the Shopify App Store.',
    },
    {
      step: '2',
      title: 'Connect your bank',
      description: 'Link your business bank account.',
    },
    {
      step: '3',
      title: 'Go live',
      description: 'Pay by bank appears at checkout.',
    },
  ]

  return (
    <PageLayout>
      <PageHero
        badge="Shopify App"
        title="Pay by bank for Shopify."
        titleGradient="Lower fees. Zero chargebacks."
        description="Shopify-approved app. Install in minutes. Save 60% on payment fees."
        features={['Shopify approved', 'One-click install', 'Zero chargebacks']}
      />

      <FeatureGrid
        title="Built for Shopify"
        subtitle="Everything merchants need."
        features={features}
      />

      <BenefitsSection
        title="Real results"
        subtitle="What merchants are seeing."
        benefits={benefits}
      />

      <HowItWorksSteps
        title="Live in 3 steps"
        subtitle="Go live today."
        steps={steps}
      />

      <PageCTA />
    </PageLayout>
  )
}
