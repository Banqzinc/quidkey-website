import { createFileRoute } from '@tanstack/react-router'
import { PageLayout, PageHero, FeatureGrid, BenefitsSection, HowItWorksSteps, PageCTA } from '@/components/layout/page-layout'
import { Link as LinkIcon, Mail, Clock, Shield, Globe, BarChart3 } from 'lucide-react'
import { buildSeo } from '@/lib/seo'

export const Route = createFileRoute('/products/payment-links')({
  component: PaymentLinksPage,
  head: () =>
    buildSeo({
      title: 'Payment Links | Quidkey',
      description:
        'Create pay by bank links in seconds. Share anywhere. Get paid.',
      path: '/products/payment-links',
    }),
})

function PaymentLinksPage() {
  const features = [
    {
      icon: LinkIcon,
      title: 'No code',
      description: 'Create links from the dashboard.',
    },
    {
      icon: Mail,
      title: 'Share anywhere',
      description: 'Email, SMS, WhatsApp, social.',
    },
    {
      icon: Clock,
      title: 'Fast settlement',
      description: 'Instant in UK/EU. 1-3 days in US.',
    },
    {
      icon: Shield,
      title: 'Secure',
      description: 'Bank authentication. No chargebacks.',
    },
    {
      icon: Globe,
      title: 'Multi-currency',
      description: 'GBP, EUR, USD, AUD.',
    },
    {
      icon: BarChart3,
      title: 'Track everything',
      description: 'Opens, attempts, completions.',
    },
  ]

  const benefits = [
    {
      stat: '30 sec',
      statLabel: 'to create',
      title: 'Instant setup',
      description: 'Create, copy, share.',
    },
    {
      stat: '90%',
      statLabel: 'completion',
      title: 'High conversion',
      description: 'Bank prediction helps.',
    },
    {
      stat: '$0',
      statLabel: 'monthly',
      title: 'Pay per transaction',
      description: '1-3.5% when you get paid.',
    },
  ]

  const steps = [
    {
      step: '1',
      title: 'Create a link',
      description: 'Set amount, add description.',
    },
    {
      step: '2',
      title: 'Share it',
      description: 'Send to customer any way.',
    },
    {
      step: '3',
      title: 'Get paid',
      description: 'Funds settle to your account.',
    },
  ]

  return (
    <PageLayout>
      <PageHero
        badge="No-Code Payments"
        title="Payment links."
        titleGradient="Create. Share. Get paid."
        description="Generate pay by bank links in seconds. No code, no integration. Perfect for invoices and one-time payments."
        features={['No code', 'Share anywhere', 'Instant setup']}
      />

      <FeatureGrid
        title="Simple payments"
        subtitle="Everything you need to get paid."
        features={features}
      />

      <BenefitsSection
        title="Simple pricing"
        subtitle="No hidden fees."
        benefits={benefits}
      />

      <HowItWorksSteps
        title="Get paid in 3 steps"
        subtitle="Create your first link in under a minute."
        steps={steps}
      />

      <PageCTA />
    </PageLayout>
  )
}
