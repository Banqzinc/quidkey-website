import { createFileRoute } from '@tanstack/react-router'
import { MegaMenu } from '@/components/layout/mega-menu'
import { Footer } from '@/components/layout/footer'
import { HeroSection } from '@/components/sections/hero'
import { TrustBadgesSection } from '@/components/sections/trust-badges'
import { StatsSection } from '@/components/sections/stats'
import { WhyChooseSection } from '@/components/sections/why-choose'
import { ProductLayersSection } from '@/components/sections/product-layers'
import { HowItWorksSection } from '@/components/sections/how-it-works'
import { WorkflowsSection } from '@/components/sections/workflows'
import { UseCasesSection } from '@/components/sections/use-cases'
import { DevelopersSection } from '@/components/sections/developers'
import { CTASection } from '@/components/sections/cta'
import { buildSeo } from '@/lib/seo'

export const Route = createFileRoute('/')({
  component: HomePage,
  head: () =>
    buildSeo({
      title: 'Quidkey | AI-native clearing house for pay by bank',
      description:
        'AI-native clearing house for pay by bank. Unify checkout, routing, and programmable treasury workflows—tax, splits, FX, payouts—with one integration and global coverage.',
      path: '/',
    }),
})

function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <MegaMenu />
      <main>
        <HeroSection />
        <TrustBadgesSection />
        <StatsSection />
        <HowItWorksSection />
        <WhyChooseSection />
        <ProductLayersSection />
        <WorkflowsSection />
        <UseCasesSection />
        <DevelopersSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
