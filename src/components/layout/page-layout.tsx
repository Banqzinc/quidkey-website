import { MegaMenu } from './mega-menu'
import { Footer } from './footer'
import { Button, buttonVariants } from '@/components/ui/button'
import { DEMO_PLAYGROUND_URL } from '@/lib/urls'
import { cn } from '@/lib/utils'
import { ArrowRight, Check } from 'lucide-react'

interface PageLayoutProps {
  children: React.ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <MegaMenu />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

interface PageHeroProps {
  badge?: string
  title: string
  titleGradient?: string
  description: string
  features?: string[]
  ctaPrimary?: { label: string; href?: string }
  ctaSecondary?: { label: string; href?: string }
}

export function PageHero({
  badge,
  title,
  titleGradient,
  description,
  features,
  ctaPrimary = { label: 'Get a demo', href: DEMO_PLAYGROUND_URL },
  ctaSecondary = { label: 'Talk to sales' },
}: PageHeroProps) {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 hero-gradient" aria-hidden="true" />
      <div className="absolute inset-0 noise" aria-hidden="true" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        {badge && (
          <div className="inline-flex items-center gap-2.5 rounded-full bg-foreground/5 border border-foreground/10 px-4 py-2 text-sm font-medium text-foreground mb-6">
            {badge}
          </div>
        )}

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
          <span className="text-foreground">{title}</span>
          {titleGradient && (
            <>
              <br />
              <span className="gradient-text">{titleGradient}</span>
            </>
          )}
        </h1>

        <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
          {description}
        </p>

        {features && features.length > 0 && (
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-3 mb-10" role="list">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success flex-shrink-0" aria-hidden="true" />
                <span className="text-sm font-medium text-foreground/80">{feature}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={ctaPrimary.href ?? DEMO_PLAYGROUND_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ size: 'lg' }), 'group shadow-lg shadow-primary/25 hover:shadow-primary/40')}
          >
            {ctaPrimary.label}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </a>
          <Button variant="outline" size="lg">
            {ctaSecondary.label}
          </Button>
        </div>
      </div>
    </section>
  )
}

interface FeatureGridProps {
  title: string
  subtitle?: string
  features: {
    icon: React.ComponentType<{ className?: string }>
    title: string
    description: string
  }[]
}

export function FeatureGrid({ title, subtitle, features }: FeatureGridProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-border p-6 card-hover"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

interface BenefitsSectionProps {
  title: string
  subtitle?: string
  benefits: {
    title: string
    description: string
    stat?: string
    statLabel?: string
  }[]
}

export function BenefitsSection({ title, subtitle, benefits }: BenefitsSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-border p-6 md:p-8"
            >
              {benefit.stat && (
                <div className="mb-4">
                  <div className="text-3xl font-bold gradient-text">{benefit.stat}</div>
                  {benefit.statLabel && (
                    <div className="text-sm text-muted-foreground">{benefit.statLabel}</div>
                  )}
                </div>
              )}
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

interface HowItWorksSectionProps {
  title: string
  subtitle?: string
  steps: {
    step: string
    title: string
    description: string
  }[]
}

export function HowItWorksSteps({ title, subtitle, steps }: HowItWorksSectionProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <div className="space-y-8">
          {steps.map((item, index) => (
            <div key={index} className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {item.step}
                </div>
              </div>
              <div className="pt-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function PageCTA() {
  return (
    <section className="py-16 md:py-24 bg-foreground text-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
          Start saving today.
        </h2>
        <p className="text-lg text-background/70 mb-8 max-w-2xl mx-auto">
          1-3% fees. Zero chargebacks. Live in days.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={DEMO_PLAYGROUND_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ size: 'lg', variant: 'secondary' }), 'group')}
          >
            Get a demo
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </a>
          <Button size="lg" variant="outline" className="border-background/30 text-background hover:bg-background/10">
            Talk to sales
          </Button>
        </div>
      </div>
    </section>
  )
}
