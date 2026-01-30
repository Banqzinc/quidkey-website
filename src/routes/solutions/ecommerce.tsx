import { createFileRoute } from '@tanstack/react-router'
import { PageLayout, PageHero, FeatureGrid, BenefitsSection, HowItWorksSteps, PageCTA } from '@/components/layout/page-layout'
import { ShoppingCart, TrendingDown, Shield, Globe, Zap, BarChart3 } from 'lucide-react'
import { buildSeo } from '@/lib/seo'

export const Route = createFileRoute('/solutions/ecommerce')({
  component: EcommercePage,
  head: () =>
    buildSeo({
      title: 'Pay by Bank for Ecommerce | Quidkey',
      description:
        'Reduce payment fees to 1-3.5% and eliminate chargebacks for your ecommerce business. Pay by bank checkout with intelligent bank prediction.',
      path: '/solutions/ecommerce',
    }),
})

function EcommercePage() {
  const features = [
    {
      icon: TrendingDown,
      title: 'Cut Payment Costs',
      description: 'Replace 3-6% card fees with 1-3.5% pay by bank. On $1M revenue, save $25-45k annually.',
    },
    {
      icon: Shield,
      title: 'Zero Chargebacks',
      description: 'Bank authentication eliminates friendly fraud. No disputes, no chargeback fees, no headaches.',
    },
    {
      icon: Zap,
      title: 'Higher Conversion',
      description: 'Bank prediction shows the customer\'s bank at checkout. One-click payments convert better.',
    },
    {
      icon: Globe,
      title: 'Sell Globally',
      description: 'Accept payments in UK, EU, US, and Australia. One integration, four major markets.',
    },
    {
      icon: ShoppingCart,
      title: 'Platform Integrations',
      description: 'Native apps for Shopify. iFrame and hosted checkout for custom platforms.',
    },
    {
      icon: BarChart3,
      title: 'Treasury Automation',
      description: 'Automate tax holds, supplier splits, and settlements. Reduce manual finance work.',
    },
  ]

  const benefits = [
    {
      stat: '60%',
      statLabel: 'lower fees',
      title: 'Transform your unit economics',
      description: 'Every percentage point saved goes straight to margin. Pay by bank changes the math.',
    },
    {
      stat: '0%',
      statLabel: 'chargebacks',
      title: 'Eliminate fraud losses',
      description: 'Ecommerce averages 1-3% chargeback costs. Bank payments require customer authentication.',
    },
    {
      stat: '15%',
      statLabel: 'checkout share',
      title: 'Growing customer preference',
      description: 'Pay by bank adoption is accelerating. Offer the payment method customers want.',
    },
  ]

  const steps = [
    {
      step: '1',
      title: 'Connect your store',
      description: 'Install our Shopify app or integrate via API. Go live in minutes.',
    },
    {
      step: '2',
      title: 'Offer pay by bank',
      description: 'Customers see their bank at checkout with one-click payment option.',
    },
    {
      step: '3',
      title: 'Receive settlements',
      description: 'Funds settle directly to your bank. Automate tax and supplier payments.',
    },
  ]

  return (
    <PageLayout>
      <PageHero
        badge="Ecommerce"
        title="Better margins for"
        titleGradient="online retail."
        description="Reduce payment fees to 1-3.5% and eliminate chargebacks. Pay by bank checkout designed for high-volume ecommerce."
        features={['60% lower fees', 'Zero chargebacks', 'Shopify native']}
      />

      <FeatureGrid
        title="Built for ecommerce growth"
        subtitle="Everything online retailers need to scale profitably."
        features={features}
      />

      <BenefitsSection
        title="Real results for real stores"
        subtitle="Numbers that matter for ecommerce."
        benefits={benefits}
      />

      <HowItWorksSteps
        title="Get started in three steps"
        subtitle="From integration to live payments."
        steps={steps}
      />

      <PageCTA />
    </PageLayout>
  )
}
