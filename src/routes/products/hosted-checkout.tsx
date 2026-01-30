import { createFileRoute } from '@tanstack/react-router'
import { PageLayout, PageHero, FeatureGrid, BenefitsSection, HowItWorksSteps, PageCTA } from '@/components/layout/page-layout'
import { ExternalLink, Palette, Zap, Shield, Clock, Settings } from 'lucide-react'
import { buildSeo } from '@/lib/seo'

export const Route = createFileRoute('/products/hosted-checkout')({
  component: HostedCheckoutPage,
  head: () =>
    buildSeo({
      title: 'Hosted Pay by Bank Checkout | Quidkey',
      description:
        'Ready-to-use hosted checkout page for pay by bank. Go live in minutes with our fully managed, conversion-optimized checkout experience.',
      path: '/products/hosted-checkout',
    }),
})

function HostedCheckoutPage() {
  const features = [
    {
      icon: ExternalLink,
      title: 'Redirect & Return',
      description: 'Create a checkout session, redirect the customer, and receive a webhook when they pay.',
    },
    {
      icon: Palette,
      title: 'Customizable Branding',
      description: 'Add your logo, colors, and messaging. The checkout feels like an extension of your site.',
    },
    {
      icon: Zap,
      title: 'Conversion Optimized',
      description: 'Bank prediction, smart defaults, and streamlined flow. Every element designed for conversion.',
    },
    {
      icon: Shield,
      title: 'Fully Hosted Security',
      description: 'We handle all security, compliance, and bank connections. You focus on your business.',
    },
    {
      icon: Clock,
      title: 'Live in Minutes',
      description: 'One API call creates a checkout session. No frontend code, no iFrame embedding.',
    },
    {
      icon: Settings,
      title: 'Flexible Configuration',
      description: 'Set success/cancel URLs, metadata, and expiration. Control the flow without code changes.',
    },
  ]

  const benefits = [
    {
      stat: '5 min',
      statLabel: 'to go live',
      title: 'Fastest path to production',
      description: 'One API call, one redirect. The hosted checkout handles everything else.',
    },
    {
      stat: 'Zero',
      statLabel: 'maintenance',
      title: 'We handle updates',
      description: 'Bank integrations, conversion optimization, and compliance updates happen automatically.',
    },
    {
      stat: '4 regions',
      statLabel: 'supported',
      title: 'Global out of the box',
      description: 'UK, EU, US, and Australia. Automatic bank selection based on customer location.',
    },
  ]

  const steps = [
    {
      step: '1',
      title: 'Create a checkout session',
      description: 'Call our API with amount, currency, and redirect URLs. Get back a checkout URL.',
    },
    {
      step: '2',
      title: 'Redirect your customer',
      description: 'Send the customer to the checkout URL. They select their bank and authenticate.',
    },
    {
      step: '3',
      title: 'Receive the webhook',
      description: 'Customer returns to your success URL. Webhook confirms payment completion.',
    },
  ]

  return (
    <PageLayout>
      <PageHero
        badge="Hosted Checkout"
        title="Pay by bank checkout."
        titleGradient="Ready in minutes."
        description="Fully hosted, conversion-optimized pay by bank checkout. One API call to create a session, one redirect to collect payment."
        features={['No frontend code', 'Conversion optimized', 'Fully managed']}
      />

      <FeatureGrid
        title="Everything handled for you"
        subtitle="A complete checkout experience, fully hosted and managed."
        features={features}
      />

      <BenefitsSection
        title="The fastest way to accept pay by bank"
        subtitle="Go live today without building a checkout."
        benefits={benefits}
      />

      <HowItWorksSteps
        title="Three steps to payments"
        subtitle="The simplest integration path to pay by bank."
        steps={steps}
      />

      <PageCTA />
    </PageLayout>
  )
}
