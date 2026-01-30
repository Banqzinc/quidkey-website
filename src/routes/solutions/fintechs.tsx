import { createFileRoute } from '@tanstack/react-router'
import { PageLayout, PageHero, FeatureGrid, BenefitsSection, HowItWorksSteps, PageCTA } from '@/components/layout/page-layout'
import { Landmark, Palette, Zap, Globe, Code, Shield } from 'lucide-react'

export const Route = createFileRoute('/solutions/fintechs')({
  component: FintechsPage,
  head: () => ({
    meta: [
      { title: 'White-Label Pay by Bank for Fintechs | Quidkey' },
      { name: 'description', content: 'White-label pay by bank infrastructure for fintechs. Scale faster with our clearing house rails, your brand, your customer relationships.' },
    ],
  }),
})

function FintechsPage() {
  const features = [
    {
      icon: Palette,
      title: 'Fully White-Label',
      description: 'Your brand, your checkout, your customer relationships. Quidkey powers the rails invisibly.',
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'UK, EU, US, and Australia from day one. Expand internationally without new integrations.',
    },
    {
      icon: Zap,
      title: 'Fast Time-to-Market',
      description: 'Skip years of bank partnerships and regulatory work. Go live in weeks, not years.',
    },
    {
      icon: Code,
      title: 'API-First Design',
      description: 'RESTful APIs, webhooks, and SDKs. Build any payment experience on our infrastructure.',
    },
    {
      icon: Shield,
      title: 'Compliance Handled',
      description: 'We manage the regulatory complexity. You focus on product and growth.',
    },
    {
      icon: Landmark,
      title: 'Treasury Services',
      description: 'Offer local accounts, FX, and programmable payouts. Full stack financial services.',
    },
  ]

  const benefits = [
    {
      stat: 'Weeks',
      statLabel: 'not years',
      title: 'Accelerate your roadmap',
      description: 'Building bank connectivity takes years. Our infrastructure is ready now.',
    },
    {
      stat: '60%+',
      statLabel: 'gross margins',
      title: 'Better unit economics',
      description: 'Transparent pricing lets you build profitable products on our rails.',
    },
    {
      stat: 'Zero',
      statLabel: 'regulatory burden',
      title: 'We handle compliance',
      description: 'Regulated partners, AML, KYC—all managed. You stay focused on product.',
    },
  ]

  const steps = [
    {
      step: '1',
      title: 'Technical integration',
      description: 'Connect via API. Configure white-label branding, webhooks, and flows.',
    },
    {
      step: '2',
      title: 'Compliance onboarding',
      description: 'Complete partner verification. We handle the regulatory setup.',
    },
    {
      step: '3',
      title: 'Launch your product',
      description: 'Go live with your branded pay by bank product. Scale without infrastructure limits.',
    },
  ]

  return (
    <PageLayout>
      <PageHero
        badge="Fintechs"
        title="Scale faster with"
        titleGradient="white-label infrastructure."
        description="Full pay by bank infrastructure for fintechs. Your brand, our rails. Go live in weeks, scale without limits."
        features={['White-label ready', 'Global coverage', 'API-first']}
      />

      <FeatureGrid
        title="Infrastructure that scales with you"
        subtitle="Everything fintechs need to build payment products."
        features={features}
      />

      <BenefitsSection
        title="Why fintechs partner with Quidkey"
        subtitle="Focus on product, not infrastructure."
        benefits={benefits}
      />

      <HowItWorksSteps
        title="From integration to launch"
        subtitle="The path to your white-label product."
        steps={steps}
      />

      <PageCTA />
    </PageLayout>
  )
}
