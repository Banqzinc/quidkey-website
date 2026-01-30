import { createFileRoute } from '@tanstack/react-router'
import { PageLayout, PageHero, FeatureGrid, BenefitsSection, HowItWorksSteps, PageCTA } from '@/components/layout/page-layout'
import { Link as LinkIcon, Mail, Clock, Shield, Globe, BarChart3 } from 'lucide-react'

export const Route = createFileRoute('/products/payment-links')({
  component: PaymentLinksPage,
  head: () => ({
    meta: [
      { title: 'Pay by Bank Payment Links | Quidkey' },
      { name: 'description', content: 'Create no-code pay by bank payment links in seconds. Share via email, SMS, or anywhere. Perfect for invoices, deposits, and one-time payments.' },
    ],
  }),
})

function PaymentLinksPage() {
  const features = [
    {
      icon: LinkIcon,
      title: 'No-Code Creation',
      description: 'Create payment links from the dashboard in seconds. No developer required.',
    },
    {
      icon: Mail,
      title: 'Share Anywhere',
      description: 'Email, SMS, WhatsApp, social media. Share your payment link wherever your customers are.',
    },
    {
      icon: Clock,
      title: 'Instant Settlement',
      description: 'Funds move directly from customer bank to yours. Instant in UK/EU, 1-3 days in US.',
    },
    {
      icon: Shield,
      title: 'Secure & Authenticated',
      description: 'Bank-level authentication protects every payment. No chargebacks, no disputes.',
    },
    {
      icon: Globe,
      title: 'Multi-Currency Support',
      description: 'Accept GBP, EUR, USD, and AUD. Automatic currency detection based on customer location.',
    },
    {
      icon: BarChart3,
      title: 'Real-Time Tracking',
      description: 'Track link opens, payment attempts, and completions. Know exactly where customers are.',
    },
  ]

  const benefits = [
    {
      stat: '30 sec',
      statLabel: 'to create',
      title: 'Go live instantly',
      description: 'Create a payment link, copy the URL, and start collecting payments. No integration needed.',
    },
    {
      stat: '90%',
      statLabel: 'completion rate',
      title: 'High conversion',
      description: 'Bank prediction and streamlined flow mean more customers complete their payments.',
    },
    {
      stat: '$0',
      statLabel: 'monthly fees',
      title: 'Pay only when you\'re paid',
      description: 'No monthly fees, no setup costs. Just 1-3.5% per successful transaction.',
    },
  ]

  const steps = [
    {
      step: '1',
      title: 'Create a payment link',
      description: 'Set the amount, add a description, and generate your unique payment link.',
    },
    {
      step: '2',
      title: 'Share with your customer',
      description: 'Send the link via email, SMS, or any channel. Embed it on your website or invoices.',
    },
    {
      step: '3',
      title: 'Get paid directly',
      description: 'Customer pays from their bank. Funds settle to your account automatically.',
    },
  ]

  return (
    <PageLayout>
      <PageHero
        badge="No-Code Payments"
        title="Payment links that work."
        titleGradient="Create. Share. Get paid."
        description="Generate pay by bank payment links in seconds. No code, no integration. Perfect for invoices, deposits, and one-time payments."
        features={['No code required', 'Share anywhere', 'Instant setup']}
      />

      <FeatureGrid
        title="Everything you need to get paid"
        subtitle="Simple, powerful payment links for any use case."
        features={features}
      />

      <BenefitsSection
        title="Simple pricing, real results"
        subtitle="No hidden fees. No monthly minimums. Just payments."
        benefits={benefits}
      />

      <HowItWorksSteps
        title="Get paid in three steps"
        subtitle="Create your first payment link in under a minute."
        steps={steps}
      />

      <PageCTA />
    </PageLayout>
  )
}
