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
import { BlogPreviewSection } from '@/components/sections/blog-preview'
import { CTASection } from '@/components/sections/cta'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="min-h-screen">
      <MegaMenu />
      <main>
        <HeroSection />
        <TrustBadgesSection />
        <StatsSection />
        <WhyChooseSection />
        <HowItWorksSection />
        <ProductLayersSection />
        <WorkflowsSection />
        <UseCasesSection />
        <DevelopersSection />
        <BlogPreviewSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
