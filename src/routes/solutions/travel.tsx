import { createFileRoute } from '@tanstack/react-router'
import { PageLayout, PageHero, FeatureGrid, BenefitsSection, HowItWorksSteps, PageCTA } from '@/components/layout/page-layout'
import { Plane, TrendingDown, Shield, Banknote, Globe, Clock } from 'lucide-react'

export const Route = createFileRoute('/solutions/travel')({
  component: TravelPage,
  head: () => ({
    meta: [
      { title: 'Pay by Bank for Travel & Hospitality | Quidkey' },
      { name: 'description', content: 'Accept high-value travel bookings at 1-3.5% fees. Handle deposits, multi-currency payments, and supplier payouts with programmable treasury.' },
    ],
  }),
})

function TravelPage() {
  const features = [
    {
      icon: Banknote,
      title: 'Higher Transaction Limits',
      description: 'Bank payments support larger bookings than cards. Accept $10k+ bookings without limits.',
    },
    {
      icon: TrendingDown,
      title: 'Lower Fees on High Values',
      description: 'Pay 1-3.5% on $5k bookings instead of 3-6%. The savings compound at scale.',
    },
    {
      icon: Shield,
      title: 'Reduced Fraud Risk',
      description: 'Bank authentication reduces fraud on high-value bookings. No chargebacks from stolen cards.',
    },
    {
      icon: Globe,
      title: 'Multi-Currency Bookings',
      description: 'Accept GBP, EUR, USD, and AUD. Let customers pay in their currency.',
    },
    {
      icon: Clock,
      title: 'Instant Deposits',
      description: 'Collect deposits instantly. Reduce no-shows with confirmed bank payments.',
    },
    {
      icon: Plane,
      title: 'Supplier Payments',
      description: 'Automate hotel, airline, and transfer payments. Split bookings to multiple suppliers.',
    },
  ]

  const benefits = [
    {
      stat: '$45k',
      statLabel: 'saved per $1M',
      title: 'Massive savings on volume',
      description: 'Travel has high average order values. Every percentage point saved is significant.',
    },
    {
      stat: 'No limits',
      statLabel: 'on bookings',
      title: 'Accept any booking size',
      description: 'Cards decline high-value transactions. Bank payments handle any amount.',
    },
    {
      stat: '15%',
      statLabel: 'at Tryp.com',
      title: 'Proven in travel',
      description: 'Tryp.com sees 15% of customers choosing pay by bank. Growing every month.',
    },
  ]

  const steps = [
    {
      step: '1',
      title: 'Integrate checkout',
      description: 'Add pay by bank to your booking flow. iFrame, hosted checkout, or custom integration.',
    },
    {
      step: '2',
      title: 'Accept bookings',
      description: 'Customers pay from their bank. High-value transactions complete without friction.',
    },
    {
      step: '3',
      title: 'Automate payouts',
      description: 'Configure supplier splits and settlement rules. Payments flow automatically.',
    },
  ]

  return (
    <PageLayout>
      <PageHero
        badge="Travel & Hospitality"
        title="Built for high-value"
        titleGradient="travel bookings."
        description="Accept $5k+ bookings at 1-3.5% fees. Handle multi-currency payments, deposits, and supplier payouts with programmable treasury."
        features={['No transaction limits', 'Multi-currency', 'Supplier automation']}
      />

      <FeatureGrid
        title="Designed for travel tech"
        subtitle="Payments infrastructure for travel businesses."
        features={features}
      />

      <BenefitsSection
        title="Why travel companies choose Quidkey"
        subtitle="Proven results in travel and hospitality."
        benefits={benefits}
      />

      <HowItWorksSteps
        title="Go live with travel payments"
        subtitle="From integration to automated payouts."
        steps={steps}
      />

      <PageCTA />
    </PageLayout>
  )
}
