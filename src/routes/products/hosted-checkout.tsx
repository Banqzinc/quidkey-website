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
        'Launch a ready-to-use hosted pay by bank checkout in minutes. Brand it, redirect customers to a secure payment session, and receive webhooks back—no frontend work.',
      path: '/products/hosted-checkout',
    }),
})

function HostedCheckoutPage() {
  const features = [
    {
      icon: ExternalLink,
      title: 'Redirect & return',
      description: 'Create session, redirect, receive webhook.',
    },
    {
      icon: Palette,
      title: 'Your branding',
      description: 'Add your logo and colors.',
    },
    {
      icon: Zap,
      title: 'High conversion',
      description: 'Bank prediction and smart defaults.',
    },
    {
      icon: Shield,
      title: 'Fully hosted',
      description: 'We handle security and compliance.',
    },
    {
      icon: Clock,
      title: 'Live in minutes',
      description: 'One API call. No frontend code.',
    },
    {
      icon: Settings,
      title: 'Flexible',
      description: 'Custom URLs, metadata, expiration.',
    },
  ]

  const benefits = [
    {
      stat: '5 min',
      statLabel: 'to go live',
      title: 'Fastest integration',
      description: 'One API call, one redirect.',
    },
    {
      stat: 'Zero',
      statLabel: 'maintenance',
      title: 'Always current',
      description: 'We update, you benefit.',
    },
    {
      stat: '4 regions',
      statLabel: 'supported',
      title: 'Global ready',
      description: 'UK, EU, US, Australia.',
    },
  ]

  const steps = [
    {
      step: '1',
      title: 'Create session',
      description: 'Call API with amount and URLs.',
    },
    {
      step: '2',
      title: 'Redirect customer',
      description: 'They select bank and pay.',
    },
    {
      step: '3',
      title: 'Receive webhook',
      description: 'Payment confirmed.',
    },
  ]

  return (
    <PageLayout>
      <PageHero
        badge="Hosted Checkout"
        title="Pay by bank checkout."
        titleGradient="Ready in minutes."
        description="One API call to create a session. One redirect to collect payment. No frontend code."
        features={['No frontend code', 'High conversion', 'Fully managed']}
      />

      <FeatureGrid
        title="Everything handled"
        subtitle="A complete checkout experience."
        features={features}
      />

      <BenefitsSection
        title="Why hosted"
        subtitle="The fastest path to pay by bank."
        benefits={benefits}
      />

      <HowItWorksSteps
        title="3 steps to payments"
        subtitle="The simplest integration."
        steps={steps}
      />

      <PageCTA />
    </PageLayout>
  )
}
