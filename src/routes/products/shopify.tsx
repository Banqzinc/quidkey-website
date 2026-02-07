import { createFileRoute } from '@tanstack/react-router'
import { PageLayout, PageHero, FeatureGrid, BenefitsSection, HowItWorksSteps, PageCTA } from '@/components/layout/page-layout'
import { ShoppingCart, Zap, Shield, TrendingUp, Clock, CreditCard } from 'lucide-react'
import { buildSeo } from '@/lib/seo'

export const Route = createFileRoute('/products/shopify')({
  component: ShopifyPage,
  head: () =>
    buildSeo({
      title: 'Shopify Pay by Bank App | Quidkey',
      description:
        'Shopify-approved pay by bank app. Reduce payment fees to 1-3.5% and eliminate chargebacks. One-click bank payments for your Shopify store.',
      path: '/products/shopify',
    }),
})

function ShopifyPage() {
  const features = [
    {
      icon: ShoppingCart,
      title: 'Native Shopify Integration',
      description: 'Approved Shopify Payments App that integrates directly with your checkout. No custom development required.',
    },
    {
      icon: Zap,
      title: 'Intelligent Bank Prediction',
      description: 'AI predicts your customer\'s bank for a one-click checkout experience. Higher conversion, lower abandonment.',
    },
    {
      icon: Shield,
      title: 'Zero Chargebacks',
      description: 'Bank-to-bank payments are authorized directly by the customer. No disputes, no chargeback fees.',
    },
    {
      icon: TrendingUp,
      title: '1-3% All-in Fees',
      description: 'Replace 3-6% card processing fees with flat, transparent pay by bank pricing.',
    },
    {
      icon: Clock,
      title: 'Fast Settlement',
      description: 'Instant settlement in UK/EU. 1-3 business day settlement in the US. Faster access to your money.',
    },
    {
      icon: CreditCard,
      title: 'Works Alongside Cards',
      description: 'Offer pay by bank as an additional option. Customers choose their preferred payment method.',
    },
  ]

  const benefits = [
    {
      stat: '60%',
      statLabel: 'lower fees',
      title: 'Reduce payment costs',
      description: 'Pay 1-3.5% instead of 3-6% card fees. On $1M annual revenue, that\'s $25-45k saved.',
    },
    {
      stat: '0%',
      statLabel: 'chargebacks',
      title: 'Eliminate disputes',
      description: 'Bank payments require customer authentication. No unauthorized transactions, no friendly fraud.',
    },
    {
      stat: '15%',
      statLabel: 'checkout share',
      title: 'Growing adoption',
      description: 'Pay by bank adoption is accelerating. Tryp.com sees 15% of customers choosing bank payments.',
    },
  ]

  const steps = [
    {
      step: '1',
      title: 'Install from Shopify App Store',
      description: 'Find Quidkey in the Shopify App Store and install with one click. No technical setup required.',
    },
    {
      step: '2',
      title: 'Connect your bank account',
      description: 'Link your business bank account to receive settlements. Secure, verified connection.',
    },
    {
      step: '3',
      title: 'Go live at checkout',
      description: 'Pay by bank appears automatically at checkout. Customers see their bank with one-click payment.',
    },
  ]

  return (
    <PageLayout>
      <PageHero
        badge="Shopify Payments App"
        title="Pay by bank for Shopify."
        titleGradient="Lower fees. Zero chargebacks."
        description="Shopify-approved pay by bank app that reduces payment fees to 1-3.5% and eliminates chargebacks. Install in minutes, go live today."
        features={['Shopify approved', 'Bank prediction AI', 'Zero chargebacks']}
      />

      <FeatureGrid
        title="Built for Shopify merchants"
        subtitle="Native integration with everything Shopify merchants need."
        features={features}
      />

      <BenefitsSection
        title="The numbers speak for themselves"
        subtitle="Real results from Shopify merchants using Quidkey."
        benefits={benefits}
      />

      <HowItWorksSteps
        title="Live in three steps"
        subtitle="Get started with pay by bank on your Shopify store."
        steps={steps}
      />

      <PageCTA />
    </PageLayout>
  )
}
