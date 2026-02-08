import { createFileRoute } from '@tanstack/react-router'
import { PageLayout, PageHero, FeatureGrid, BenefitsSection, HowItWorksSteps, PageCTA } from '@/components/layout/page-layout'
import { Code, Palette, Zap, Shield, Globe, Smartphone } from 'lucide-react'
import { buildSeo } from '@/lib/seo'

export const Route = createFileRoute('/products/iframe')({
  component: IframePage,
  head: () =>
    buildSeo({
      title: 'Embedded Pay by Bank iFrame Checkout | Quidkey',
      description:
        'Add a drop-in pay by bank iFrame to any checkout. White-label the experience, match your brand, and improve conversion with bank prediction and smart defaults.',
      path: '/products/iframe',
    }),
})

function IframePage() {
  const features = [
    {
      icon: Code,
      title: 'Simple code',
      description: 'A few lines. Works with any stack.',
    },
    {
      icon: Palette,
      title: 'Your brand',
      description: 'Match your colors and styling.',
    },
    {
      icon: Zap,
      title: 'Bank prediction',
      description: 'Shows customer\'s bank for one-click.',
    },
    {
      icon: Shield,
      title: 'No PCI scope',
      description: 'No card data. No compliance burden.',
    },
    {
      icon: Globe,
      title: 'Global',
      description: 'UK, EU, US, Australia.',
    },
    {
      icon: Smartphone,
      title: 'Mobile ready',
      description: 'Works on any device.',
    },
  ]

  const benefits = [
    {
      stat: '3 lines',
      statLabel: 'of code',
      title: 'Fast integration',
      description: 'Add script, configure, render.',
    },
    {
      stat: '100%',
      statLabel: 'white-label',
      title: 'Your checkout',
      description: 'Customers stay on your site.',
    },
    {
      stat: '4 regions',
      statLabel: 'one integration',
      title: 'Global ready',
      description: 'No region-specific code.',
    },
  ]

  const steps = [
    {
      step: '1',
      title: 'Add the script',
      description: 'Include our SDK in your page.',
    },
    {
      step: '2',
      title: 'Create session',
      description: 'Call API with payment details.',
    },
    {
      step: '3',
      title: 'Render',
      description: 'iFrame handles the rest.',
    },
  ]

  return (
    <PageLayout>
      <PageHero
        badge="Embedded Checkout"
        title="Embedded pay by bank."
        titleGradient="Your checkout. Our rails."
        description="Drop-in iFrame for any checkout. White-label, customizable, global."
        features={['3 lines of code', 'White-label', 'Global coverage']}
      />

      <FeatureGrid
        title="Complete checkout in one iFrame"
        subtitle="Embed pay by bank anywhere."
        features={features}
      />

      <BenefitsSection
        title="Why developers choose iFrame"
        subtitle="Fast, flexible, global."
        benefits={benefits}
      />

      <HowItWorksSteps
        title="3 step integration"
        subtitle="Go live in your checkout."
        steps={steps}
      />

      <PageCTA />
    </PageLayout>
  )
}
