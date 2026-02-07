import { createFileRoute } from '@tanstack/react-router'
import { PageLayout, PageHero, FeatureGrid, BenefitsSection, HowItWorksSteps, PageCTA } from '@/components/layout/page-layout'
import { Plane, TrendingDown, Shield, Banknote, Globe, Clock } from 'lucide-react'
import { buildSeo } from '@/lib/seo'

export const Route = createFileRoute('/solutions/travel')({
  component: TravelPage,
  head: () =>
    buildSeo({
      title: 'Travel | Quidkey',
      description:
        'Accept high-value bookings with lower fees. No transaction limits.',
      path: '/solutions/travel',
    }),
})

function TravelPage() {
  const features = [
    {
      icon: Banknote,
      title: 'No limits',
      description: 'Accept $10k+ bookings.',
    },
    {
      icon: TrendingDown,
      title: 'Lower fees',
      description: 'Save up to 70% vs cards.',
    },
    {
      icon: Shield,
      title: 'Less fraud',
      description: 'Bank auth on high-value.',
    },
    {
      icon: Globe,
      title: 'Multi-currency',
      description: 'GBP, EUR, USD, AUD.',
    },
    {
      icon: Clock,
      title: 'Instant deposits',
      description: 'Confirm bookings now.',
    },
    {
      icon: Plane,
      title: 'Supplier payouts',
      description: 'Automate splits.',
    },
  ]

  const benefits = [
    {
      stat: '$45k',
      statLabel: 'saved per $1M',
      title: 'Big savings on volume',
      description: 'High AOV = high savings.',
    },
    {
      stat: 'No limits',
      statLabel: 'on bookings',
      title: 'Any size',
      description: 'Banks handle any amount.',
    },
    {
      stat: '15%',
      statLabel: 'at Tryp.com',
      title: 'Proven',
      description: 'Customers choosing bank.',
    },
  ]

  const steps = [
    {
      step: '1',
      title: 'Integrate',
      description: 'Add to booking flow.',
    },
    {
      step: '2',
      title: 'Accept',
      description: 'High-value bookings.',
    },
    {
      step: '3',
      title: 'Automate',
      description: 'Supplier payouts.',
    },
  ]

  return (
    <PageLayout>
      <PageHero
        badge="Travel"
        title="Built for high-value"
        titleGradient="travel bookings."
        description="Accept $5k+ bookings with lower fees. Multi-currency. Supplier payouts."
        features={['No limits', 'Multi-currency', 'Supplier automation']}
      />

      <FeatureGrid
        title="For travel tech"
        subtitle="Payments for travel."
        features={features}
      />

      <BenefitsSection
        title="Why travel chooses Quidkey"
        subtitle="Proven in hospitality."
        benefits={benefits}
      />

      <HowItWorksSteps
        title="Go live"
        subtitle="Integration to payouts."
        steps={steps}
      />

      <PageCTA />
    </PageLayout>
  )
}
