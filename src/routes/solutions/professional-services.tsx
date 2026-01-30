import { createFileRoute } from '@tanstack/react-router'
import { PageLayout, PageHero, FeatureGrid, BenefitsSection, HowItWorksSteps, PageCTA } from '@/components/layout/page-layout'
import { Briefcase, Link as LinkIcon, FileText, Globe, Clock, Shield } from 'lucide-react'

export const Route = createFileRoute('/solutions/professional-services')({
  component: ProfessionalServicesPage,
  head: () => ({
    meta: [
      { title: 'Pay by Bank for Professional Services | Quidkey' },
      { name: 'description', content: 'Accept high-value invoice payments at 1-3.5%. Payment links for consultants, agencies, and service businesses. No code required.' },
    ],
  }),
})

function ProfessionalServicesPage() {
  const features = [
    {
      icon: LinkIcon,
      title: 'Payment Links',
      description: 'Create payment links in seconds. Add to invoices, emails, or anywhere clients see.',
    },
    {
      icon: FileText,
      title: 'Invoice Integration',
      description: 'Embed payment links in invoices. Clients click and pay directly from the document.',
    },
    {
      icon: Globe,
      title: 'International Clients',
      description: 'Accept GBP, EUR, USD, and AUD. Clients pay in their currency, you receive in yours.',
    },
    {
      icon: Clock,
      title: 'Faster Collection',
      description: 'Bank payments settle faster than card payments. Improve your cash flow.',
    },
    {
      icon: Shield,
      title: 'No Chargebacks',
      description: 'Service businesses face dispute risk. Bank payments eliminate chargebacks entirely.',
    },
    {
      icon: Briefcase,
      title: 'No Code Required',
      description: 'Create links from the dashboard. No developer, no integration, no technical work.',
    },
  ]

  const benefits = [
    {
      stat: '$0',
      statLabel: 'setup cost',
      title: 'Start for free',
      description: 'No monthly fees, no setup costs. Pay only when you\'re paid.',
    },
    {
      stat: '30 sec',
      statLabel: 'per link',
      title: 'Fast invoicing',
      description: 'Create a payment link, add to invoice, send. That\'s it.',
    },
    {
      stat: '1-3.5%',
      statLabel: 'all-in',
      title: 'Simple pricing',
      description: 'Transparent fees. No hidden costs, no monthly minimums.',
    },
  ]

  const steps = [
    {
      step: '1',
      title: 'Create an account',
      description: 'Sign up and verify your business. Takes minutes, not days.',
    },
    {
      step: '2',
      title: 'Generate payment links',
      description: 'Create links with amount, description, and your branding.',
    },
    {
      step: '3',
      title: 'Get paid',
      description: 'Add links to invoices. Clients pay, funds settle to your bank.',
    },
  ]

  return (
    <PageLayout>
      <PageHero
        badge="Professional Services"
        title="Get paid faster."
        titleGradient="No code required."
        description="Accept high-value invoice payments at 1-3.5%. Create payment links in seconds, add to invoices, and get paid directly to your bank."
        features={['No code', 'No setup fees', 'International clients']}
      />

      <FeatureGrid
        title="Built for service businesses"
        subtitle="Simple tools for consultants, agencies, and freelancers."
        features={features}
      />

      <BenefitsSection
        title="Simple, affordable, effective"
        subtitle="Payment tools that work for service businesses."
        benefits={benefits}
      />

      <HowItWorksSteps
        title="Start accepting payments today"
        subtitle="No technical setup required."
        steps={steps}
      />

      <PageCTA />
    </PageLayout>
  )
}
