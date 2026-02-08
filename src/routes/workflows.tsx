import { createFileRoute, Link } from '@tanstack/react-router'
import { MegaMenu } from '@/components/layout/mega-menu'
import { Footer } from '@/components/layout/footer'
import { buttonVariants } from '@/components/ui/button'
import { DEMO_PLAYGROUND_URL } from '@/lib/urls'
import { cn } from '@/lib/utils'
import { ArrowRight, Check, Calculator, GitBranch, ArrowRightLeft, Wallet, Users, RotateCcw } from 'lucide-react'
import { buildSeo } from '@/lib/seo'

export const Route = createFileRoute('/workflows')({
  component: WorkflowsPage,
  head: () =>
    buildSeo({
      title: 'Money Workflows | Quidkey',
      description:
        'Write simple rules for how your money moves. Tax holds, splits, FX, and payouts - all automated.',
      path: '/workflows',
    }),
})

function WorkflowsPage() {
  return (
    <div className="min-h-screen">
      <MegaMenu />
      <main>
        <HeroSection />
        <WorkflowExamplesSection />
        <HowItWorksSection />
        <WorkflowTypesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}

function HeroSection() {
  const benefits = [
    'Plain English rules',
    'Automatic execution',
    'Full audit trail',
  ]

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 hero-gradient" aria-hidden="true" />
      <div className="absolute inset-0 noise" aria-hidden="true" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2.5 rounded-full bg-foreground/5 border border-foreground/10 px-4 py-2 text-sm font-medium text-foreground mb-6">
          Money Workflows
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
          <span className="text-foreground">Write simple rules.</span>
          <br />
          <span className="gradient-text">Money moves automatically.</span>
        </h1>

        <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
          Describe how your money should move in plain English. Tax, splits, payouts - Quidkey handles it.
        </p>

        <ul className="flex flex-wrap justify-center gap-x-5 gap-y-3 mb-10" role="list">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success flex-shrink-0" aria-hidden="true" />
              <span className="text-sm font-medium text-foreground/80">{benefit}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={DEMO_PLAYGROUND_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ size: 'lg' }), 'group shadow-lg shadow-primary/25 hover:shadow-primary/40')}
          >
            Get a demo
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </a>
          <Link
            to="/contact"
            hash="talk-to-sales"
            className={buttonVariants({ variant: 'outline', size: 'lg' })}
          >
            Talk to sales
          </Link>
        </div>
      </div>
    </section>
  )
}

function WorkflowExamplesSection() {
  const workflows = [
    {
      command: 'Hold US sales tax by state, county, and city.',
      description: 'Tax is calculated and saved in separate accounts automatically.',
      icon: Calculator,
    },
    {
      command: 'Split 70/30 with supplier, hold 10% for returns.',
      description: 'Payments split automatically. Returns reserve held separately.',
      icon: GitBranch,
    },
    {
      command: 'Convert to USD weekly at best rate.',
      description: 'Currency converts on schedule. Settles to your bank.',
      icon: ArrowRightLeft,
    },
    {
      command: 'Pay supplier when delivery is confirmed.',
      description: 'Funds release when conditions are met.',
      icon: Users,
    },
    {
      command: 'Refund to original bank account.',
      description: 'Instant refunds back to customer bank accounts.',
      icon: RotateCcw,
    },
    {
      command: 'Hold 5% reserve for 30 days on large orders.',
      description: 'Risk-based holds release automatically after the period.',
      icon: Wallet,
    },
  ]

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Write it. It happens.
          </h2>
          <p className="text-lg text-background/70">
            Describe what you want. Quidkey makes it happen automatically.
          </p>
        </div>

        {/* Translate-style workflow grid */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
          {workflows.map((workflow, index) => (
            <div
              key={index}
              className="rounded-2xl border border-background/20 bg-background/5 backdrop-blur-sm overflow-hidden"
            >
              {/* Icon header */}
              <div className="px-5 pt-5 md:px-6 md:pt-6">
                <div className="h-10 w-10 rounded-lg bg-background/10 flex items-center justify-center">
                  <workflow.icon className="h-5 w-5 text-background/70" />
                </div>
              </div>

              {/* Two-panel translate layout */}
              <div className="grid grid-cols-1 divide-y divide-background/10">
                {/* You write panel */}
                <div className="p-5 md:p-6">
                  <div className="text-xs font-medium text-background/40 uppercase tracking-wider mb-2">
                    You write
                  </div>
                  <div className="font-mono text-base text-background">
                    "{workflow.command}"
                  </div>
                </div>

                {/* Quidkey executes panel */}
                <div className="p-5 md:p-6 bg-background/5">
                  <div className="text-xs font-medium text-background/40 uppercase tracking-wider mb-2">
                    Quidkey executes
                  </div>
                  <p className="text-sm text-background/80">
                    {workflow.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  const steps = [
    {
      step: '1',
      title: 'Write your rule',
      description: 'Describe what should happen in plain English.',
    },
    {
      step: '2',
      title: 'Review the logic',
      description: 'See exactly what will execute before it goes live.',
    },
    {
      step: '3',
      title: 'It runs automatically',
      description: 'Every payment triggers your workflow. No manual work.',
    },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
            How it works
          </h2>
          <p className="text-lg text-muted-foreground">
            Three steps to automate your money.
          </p>
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

function WorkflowTypesSection() {
  const types = [
    {
      icon: Calculator,
      title: 'Tax',
      description: 'Calculate and hold sales tax by jurisdiction.',
    },
    {
      icon: GitBranch,
      title: 'Splits',
      description: 'Distribute payments to multiple parties.',
    },
    {
      icon: ArrowRightLeft,
      title: 'FX & Settlement',
      description: 'Convert currencies and settle to your bank.',
    },
    {
      icon: Wallet,
      title: 'Reserves',
      description: 'Hold funds for returns, disputes, or risk.',
    },
    {
      icon: Users,
      title: 'Escrow',
      description: 'Release funds when conditions are met.',
    },
    {
      icon: RotateCcw,
      title: 'Refunds',
      description: 'Send money back to customer bank accounts.',
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
            What you can automate
          </h2>
          <p className="text-lg text-muted-foreground">
            Common workflows businesses use.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {types.map((type, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-border p-6"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                <type.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {type.title}
              </h3>
              <p className="text-muted-foreground">
                {type.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-foreground text-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
          Ready to automate?
        </h2>
        <p className="text-lg text-background/70 mb-8 max-w-2xl mx-auto">
          Stop moving money manually. Start writing rules.
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
            hash="talk-to-sales"
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
