import { createFileRoute } from '@tanstack/react-router'
import { PageLayout, PageHero, FeatureGrid, BenefitsSection, HowItWorksSteps, PageCTA } from '@/components/layout/page-layout'
import { Monitor, RefreshCw, TrendingDown, Globe, FileCheck, Shield } from 'lucide-react'
import { buildSeo } from '@/lib/seo'

export const Route = createFileRoute('/solutions/saas')({
  component: SaaSPage,
  head: () =>
    buildSeo({
      title: 'Pay by Bank for SaaS & Subscriptions | Quidkey',
      description:
        'Accept recurring payments at 1-3.5% fees. Stay seller-of-record while automating tax, FX, and settlements across global markets.',
      path: '/solutions/saas',
    }),
})

function SaaSPage() {
  const features = [
    {
      icon: RefreshCw,
      title: 'Recurring Payments',
      description: 'Variable recurring payments (VRP) for subscriptions. Automatic collection on your schedule.',
    },
    {
      icon: TrendingDown,
      title: 'Lower Than Cards',
      description: 'SaaS margins matter. Pay 1-3.5% instead of 3-6% card fees on every renewal.',
    },
    {
      icon: Globe,
      title: 'Global Subscriptions',
      description: 'Collect in GBP, EUR, USD, and AUD. Local currency for local customers.',
    },
    {
      icon: FileCheck,
      title: 'Automatic Tax Compliance',
      description: 'Calculate and hold sales tax by jurisdiction. No more manual tax operations.',
    },
    {
      icon: Monitor,
      title: 'Stay Seller-of-Record',
      description: 'Keep your customer relationships. Avoid 5-10% MoR fees from Paddle/Fastspring.',
    },
    {
      icon: Shield,
      title: 'No Chargebacks',
      description: 'B2B SaaS has low chargeback risk anyway, but zero is still better.',
    },
  ]

  const benefits = [
    {
      stat: '5-10%',
      statLabel: 'vs MoR fees',
      title: 'Better than Paddle/Fastspring',
      description: 'Keep seller-of-record status and pay 1-3.5% instead of MoR take rates.',
    },
    {
      stat: '10-20h',
      statLabel: 'saved monthly',
      title: 'Automate treasury',
      description: 'Tax, FX, and settlement workflows run automatically. CFO time freed up.',
    },
    {
      stat: 'B2B ready',
      statLabel: 'no disputes',
      title: 'Built for business buyers',
      description: 'Business customers often prefer bank payments. No personal card needed.',
    },
  ]

  const steps = [
    {
      step: '1',
      title: 'Connect billing system',
      description: 'Integrate with your subscription platform. API works with any billing stack.',
    },
    {
      step: '2',
      title: 'Enable recurring payments',
      description: 'Customers authorize variable recurring payments. Collections happen automatically.',
    },
    {
      step: '3',
      title: 'Automate operations',
      description: 'Configure tax workflows, FX rules, and settlement schedules.',
    },
  ]

  return (
    <PageLayout>
      <PageHero
        badge="SaaS & Subscriptions"
        title="Subscriptions without"
        titleGradient="the MoR tax."
        description="Accept recurring payments at 1-3.5%. Stay seller-of-record, automate tax compliance, and scale globally without operational complexity."
        features={['Recurring payments', 'Stay seller-of-record', 'Automatic tax']}
      />

      <FeatureGrid
        title="Built for SaaS economics"
        subtitle="Maximize margin while minimizing operations."
        features={features}
      />

      <BenefitsSection
        title="Why SaaS companies choose Quidkey"
        subtitle="Better unit economics, less work."
        benefits={benefits}
      />

      <HowItWorksSteps
        title="Launch recurring pay by bank"
        subtitle="From integration to automated collections."
        steps={steps}
      />

      <PageCTA />
    </PageLayout>
  )
}
