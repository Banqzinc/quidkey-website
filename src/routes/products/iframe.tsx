import { createFileRoute } from '@tanstack/react-router'
import { PageLayout, PageHero, FeatureGrid, BenefitsSection, HowItWorksSteps, PageCTA } from '@/components/layout/page-layout'
import { Code, Palette, Zap, Shield, Globe, Smartphone } from 'lucide-react'
import { buildSeo } from '@/lib/seo'

export const Route = createFileRoute('/products/iframe')({
  component: IframePage,
  head: () =>
    buildSeo({
      title: 'Embedded Pay by Bank iFrame | Quidkey',
      description:
        'Embed pay by bank directly into your checkout with our customizable iFrame. White-label, brand-matched bank payments for any platform.',
      path: '/products/iframe',
    }),
})

function IframePage() {
  const features = [
    {
      icon: Code,
      title: 'Simple Integration',
      description: 'Drop in a few lines of code and go live. Works with any tech stack, any checkout flow.',
    },
    {
      icon: Palette,
      title: 'Fully Customizable',
      description: 'Match your brand colors, fonts, and styling. The iFrame looks native to your checkout.',
    },
    {
      icon: Zap,
      title: 'Bank Prediction Built-in',
      description: 'AI predicts the customer\'s bank. Show their bank logo front and center for higher conversion.',
    },
    {
      icon: Shield,
      title: 'PCI-Free Security',
      description: 'No card data, no PCI compliance burden. Bank authentication happens in a secure, hosted flow.',
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'One iFrame works across UK, EU, US, and Australia. No region-specific code changes.',
    },
    {
      icon: Smartphone,
      title: 'Mobile Optimized',
      description: 'Responsive design works seamlessly on desktop, tablet, and mobile devices.',
    },
  ]

  const benefits = [
    {
      stat: '3 lines',
      statLabel: 'of code',
      title: 'Minimal integration effort',
      description: 'Add the iFrame script, configure your API key, and render. That\'s it.',
    },
    {
      stat: '100%',
      statLabel: 'white-label',
      title: 'Your brand, your checkout',
      description: 'Customers never leave your site. The payment flow feels completely native.',
    },
    {
      stat: '4 regions',
      statLabel: 'one integration',
      title: 'Global from day one',
      description: 'UK, EU, US, and Australia supported. Expand internationally without code changes.',
    },
  ]

  const steps = [
    {
      step: '1',
      title: 'Add the iFrame script',
      description: 'Include our lightweight JavaScript SDK in your checkout page. Under 15KB gzipped.',
    },
    {
      step: '2',
      title: 'Create a payment session',
      description: 'Call our API to create a payment session with amount, currency, and customer details.',
    },
    {
      step: '3',
      title: 'Render and redirect',
      description: 'The iFrame handles bank selection and authentication. Receive a webhook when payment completes.',
    },
  ]

  return (
    <PageLayout>
      <PageHero
        badge="Embedded Checkout"
        title="Embedded pay by bank."
        titleGradient="Your checkout. Our rails."
        description="Drop-in iFrame that adds pay by bank to any checkout. Fully customizable, white-label, and works across all major markets."
        features={['3 lines of code', 'White-label design', 'Global coverage']}
      />

      <FeatureGrid
        title="Everything you need in one iFrame"
        subtitle="A complete pay by bank checkout experience you can embed anywhere."
        features={features}
      />

      <BenefitsSection
        title="Why developers choose the iFrame"
        subtitle="Fast integration, complete control, global reach."
        benefits={benefits}
      />

      <HowItWorksSteps
        title="Integration in three steps"
        subtitle="Get embedded pay by bank live in your checkout."
        steps={steps}
      />

      <PageCTA />
    </PageLayout>
  )
}
