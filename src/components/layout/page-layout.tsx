import { Link } from '@tanstack/react-router'
import { MegaMenu } from './mega-menu'
import { Footer } from './footer'
import { buttonVariants } from '@/components/ui/button'
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
  ctaPrimary?: { label: string; href?: string; external?: boolean }
  ctaSecondary?: { label: string; href?: string; external?: boolean }
}

export function PageHero({
  badge,
  title,
  titleGradient,
  description,
  features,
  ctaPrimary = { label: 'Get a demo', href: DEMO_PLAYGROUND_URL, external: true },
  ctaSecondary = { label: 'Talk to sales', href: '/contact' },
}: PageHeroProps) {
  const isExternalPrimary = ctaPrimary.external ?? ctaPrimary.href?.startsWith('http') ?? ctaPrimary.href?.startsWith('mailto')
  const isExternalSecondary = ctaSecondary.external ?? ctaSecondary.href?.startsWith('http') ?? ctaSecondary.href?.startsWith('mailto')

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
          {isExternalPrimary ? (
            <a
              href={ctaPrimary.href ?? DEMO_PLAYGROUND_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ size: 'lg' }), 'group shadow-lg shadow-primary/25 hover:shadow-primary/40')}
            >
              {ctaPrimary.label}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </a>
          ) : (
            <Link
              to={ctaPrimary.href ?? '/'}
              className={cn(buttonVariants({ size: 'lg' }), 'group shadow-lg shadow-primary/25 hover:shadow-primary/40')}
            >
              {ctaPrimary.label}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          )}
          {isExternalSecondary ? (
            <a
              href={ctaSecondary.href}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: 'outline', size: 'lg' })}
            >
              {ctaSecondary.label}
            </a>
          ) : (
            <Link
              to={ctaSecondary.href ?? '/contact'}
              className={buttonVariants({ variant: 'outline', size: 'lg' })}
            >
              {ctaSecondary.label}
            </Link>
          )}
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
          Zero chargebacks. Global coverage. Live in days.
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
          <Link
            to="/contact"
            className={cn(
              buttonVariants({ size: 'lg', variant: 'outline' }),
              'border-background/30 text-background hover:bg-background/10'
            )}
          >
            Talk to sales
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Section Components
 * ─────────────────────────────────────────────────────────────────────────── */

interface SectionHeaderProps {
  title: string
  subtitle?: string
  className?: string
}

export function SectionHeader({ title, subtitle, className }: SectionHeaderProps) {
  return (
    <div className={cn('text-center max-w-3xl mx-auto mb-12 md:mb-16', className)}>
      <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-muted-foreground">{subtitle}</p>
      )}
    </div>
  )
}

interface ContentCardProps {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export function ContentCard({ title, description, children, className }: ContentCardProps) {
  return (
    <div className={cn('bg-white rounded-2xl border border-border p-6 md:p-8', className)}>
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground">{description}</p>
      )}
      {children}
    </div>
  )
}

interface ContentSectionProps {
  children: React.ReactNode
  background?: 'default' | 'muted' | 'dark'
  className?: string
}

export function ContentSection({ children, background = 'default', className }: ContentSectionProps) {
  return (
    <section
      className={cn(
        'py-16 md:py-24',
        background === 'muted' && 'bg-secondary/30',
        background === 'dark' && 'bg-foreground text-background',
        className
      )}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Team Section
 * ─────────────────────────────────────────────────────────────────────────── */

interface TeamMember {
  name: string
  role: string
  bio?: string
  linkedinUrl?: string
  imageSrc: string
}

interface TeamSectionProps {
  title?: string
  subtitle?: string
  members: TeamMember[]
}

export function TeamSection({
  title = 'Team',
  subtitle = 'Building reliable infrastructure for global commerce.',
  members,
}: TeamSectionProps) {
  return (
    <ContentSection>
      <SectionHeader title={title} subtitle={subtitle} />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {members.map((member) => (
          <div key={member.name} className="bg-white rounded-2xl border border-border overflow-hidden">
            <div className="aspect-[4/3] bg-secondary/30">
              <img
                src={member.imageSrc}
                alt={member.name}
                loading="lazy"
                className="h-full w-full object-cover object-[center_20%]"
              />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold text-foreground">{member.name}</div>
                  <div className="text-sm text-muted-foreground">{member.role}</div>
                </div>
                {member.linkedinUrl && (
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    LinkedIn
                  </a>
                )}
              </div>
              {member.bio && (
                <p className="mt-4 text-sm text-muted-foreground text-pretty">
                  {member.bio}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </ContentSection>
  )
}
