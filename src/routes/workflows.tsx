import { createFileRoute } from '@tanstack/react-router'
import { MegaMenu } from '@/components/layout/mega-menu'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check, MessageSquare, Cog, Shield, GitBranch, FileCheck, Zap, Calculator, ArrowRightLeft, Wallet, Users, RotateCcw } from 'lucide-react'
import { buildSeo } from '@/lib/seo'

export const Route = createFileRoute('/workflows')({
  component: WorkflowsPage,
  head: () =>
    buildSeo({
      title: 'Treasury Workflows (Plain English) | Quidkey',
      description:
        'Define treasury workflows in plain English. Quidkey compiles them into deterministic, auditable execution. Tax holds, splits, FX, and payouts automated.',
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
        <FeaturesSection />
        <UseCasesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}

function HeroSection() {
  const benefits = [
    'Plain English input',
    'Deterministic execution',
    'Audit-ready logs',
  ]

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 hero-gradient" aria-hidden="true" />
      <div className="absolute inset-0 noise" aria-hidden="true" />
      
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2.5 rounded-full bg-foreground/5 border border-foreground/10 px-4 py-2 text-sm font-medium text-foreground mb-6">
          Programmable Treasury
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
          <span className="text-foreground">Plain English becomes</span>
          <br />
          <span className="gradient-text">deterministic execution.</span>
        </h1>

        <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
          Define how money moves after payment. Tax holds, revenue splits, FX conversion, and settlements, all automated with programmable workflows.
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
          <Button size="lg" className="group shadow-lg shadow-primary/25 hover:shadow-primary/40">
            Get a demo
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </Button>
          <Button variant="outline" size="lg">
            Talk to sales
          </Button>
        </div>
      </div>
    </section>
  )
}

function WorkflowExamplesSection() {
  const workflows = [
    {
      command: '"Hold US sales tax by state, county, and city."',
      description: 'Automatically calculate and segregate tax at the moment of payment. Route funds into dedicated tax sub-accounts for clean remittance.',
      icon: Calculator,
    },
    {
      command: '"Split 70/30 with supplier, hold 10% for returns."',
      description: 'Automated splits with a returns reserve and dispute holds. Reconcile once, no spreadsheets, no manual payouts.',
      icon: GitBranch,
    },
    {
      command: '"Convert to USD weekly at best rate."',
      description: 'Schedule FX and settlement into your operating account. Deterministic execution with full audit trails.',
      icon: ArrowRightLeft,
    },
    {
      command: '"Pay supplier when customer delivery is confirmed."',
      description: 'Event-driven payouts tied to business milestones. Funds release automatically when conditions are met.',
      icon: Users,
    },
    {
      command: '"Refund to original bank account within 2 hours."',
      description: 'Instant refund processing back to customer bank accounts. No card network delays, no manual transfers.',
      icon: RotateCcw,
    },
    {
      command: '"Hold 5% reserve for 30 days on high-risk orders."',
      description: 'Risk-based reserve policies applied automatically. Release funds after the hold period expires.',
      icon: Shield,
    },
  ]

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Intent to execution.
          </h2>
          <p className="text-lg text-background/70">
            Define treasury workflows in plain English. Quidkey compiles them into deterministic, auditable execution.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {workflows.map((workflow, index) => (
            <div
              key={index}
              className="rounded-2xl border border-background/20 bg-background/5 p-6 md:p-8 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-background/10 flex items-center justify-center">
                  <workflow.icon className="h-5 w-5 text-background/70" />
                </div>
              </div>

              <div className="font-mono text-lg text-background mb-4">
                {workflow.command}
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-background/20" />
                <span className="text-xs text-background/50">compiles to</span>
                <div className="h-px flex-1 bg-background/20" />
              </div>

              <p className="text-sm text-background/70">
                {workflow.description}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-background/50 mt-12 max-w-xl mx-auto">
          Not a GPT wrapper. LLMs parse natural language, but execution is deterministic. 
          Every workflow compiles to CEL (Common Expression Language) with zero ambiguity.
        </p>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  const steps = [
    {
      step: '1',
      title: 'Describe your intent',
      description: 'Write what you want in plain English: "Hold 10% for refunds and split the rest 70/30 with my supplier." No code, no configuration files.',
    },
    {
      step: '2',
      title: 'Quidkey compiles to CEL',
      description: 'Your natural language is parsed and compiled into Common Expression Language (CEL). Deterministic, type-safe, and auditable.',
    },
    {
      step: '3',
      title: 'Review and approve',
      description: 'See exactly what will execute. Review the compiled logic, test with sample data, and approve when ready.',
    },
    {
      step: '4',
      title: 'Automatic execution',
      description: 'Every qualifying payment triggers your workflow. Tax is calculated, splits are applied, and funds route automatically.',
    },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
            From intent to execution
          </h2>
          <p className="text-lg text-muted-foreground">
            How programmable treasury actually works.
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

        <div className="mt-12 p-6 rounded-2xl bg-secondary/50 border border-border">
          <h4 className="font-semibold text-foreground mb-2">Why CEL?</h4>
          <p className="text-sm text-muted-foreground">
            Common Expression Language (CEL) is used by Google, Kubernetes, and major infrastructure platforms. 
            It's type-safe, sandboxed, and fast. Unlike arbitrary code execution, CEL is inherently safe and auditable. 
            Your workflows cannot have side effects beyond what Quidkey explicitly allows.
          </p>
        </div>
      </div>
    </section>
  )
}

function WorkflowTypesSection() {
  const types = [
    {
      icon: Calculator,
      title: 'Tax Compliance',
      description: 'Calculate and hold sales tax automatically by jurisdiction.',
      examples: [
        'US state, county, and city sales tax',
        'EU VAT by country',
        'Automatic tax account segregation',
        'Scheduled remittance preparation',
      ],
    },
    {
      icon: GitBranch,
      title: 'Multi-Party Splits',
      description: 'Distribute payments to multiple parties automatically.',
      examples: [
        'Supplier and vendor payments',
        'Marketplace seller splits',
        'Affiliate commission payouts',
        'Revenue share with partners',
      ],
    },
    {
      icon: ArrowRightLeft,
      title: 'FX & Settlement',
      description: 'Convert currencies and settle to your bank.',
      examples: [
        'Weekly batch conversion at best rate',
        'Instant conversion on receipt',
        'Multi-currency balance management',
        'Scheduled sweeps to operating account',
      ],
    },
    {
      icon: Wallet,
      title: 'Reserves & Holds',
      description: 'Manage risk with configurable fund holds.',
      examples: [
        'Return/refund reserves',
        'Dispute hold periods',
        'Risk-based reserve percentages',
        'Time-based release rules',
      ],
    },
    {
      icon: Users,
      title: 'Escrow & Milestones',
      description: 'Release funds based on business events.',
      examples: [
        'Delivery confirmation triggers',
        'Service completion payouts',
        'Approval-based releases',
        'Multi-signature requirements',
      ],
    },
    {
      icon: RotateCcw,
      title: 'Refunds & Returns',
      description: 'Automate refund processing and accounting.',
      examples: [
        'Instant bank refunds',
        'Partial refund calculations',
        'Return reserve drawdown',
        'Automated reconciliation',
      ],
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
            Workflow types
          </h2>
          <p className="text-lg text-muted-foreground">
            Common patterns for automating treasury operations.
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
              <p className="text-sm text-muted-foreground mb-4">
                {type.description}
              </p>
              <ul className="space-y-2">
                {type.examples.map((example, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {example}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    {
      icon: MessageSquare,
      title: 'Plain English Programming',
      description: 'No code required. Describe your intent in natural language and Quidkey handles the rest.',
    },
    {
      icon: Cog,
      title: 'Deterministic Execution',
      description: 'Every workflow compiles to CEL. Predictable, auditable, and correct every time.',
    },
    {
      icon: Shield,
      title: 'Audit-Ready Logs',
      description: 'Complete logs of every execution: inputs, outputs, and decision paths. Finance-team ready.',
    },
    {
      icon: GitBranch,
      title: 'Conditional Logic',
      description: 'Branch based on amount, currency, customer location, product type, or custom fields.',
    },
    {
      icon: Zap,
      title: 'Real-Time Execution',
      description: 'Workflows execute as payments arrive. No batch processing, no overnight jobs.',
    },
    {
      icon: FileCheck,
      title: 'Version Control',
      description: 'Track changes to workflows over time. Roll back if needed. Full history preserved.',
    },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
            Built for real treasury operations
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to automate financial workflows.
          </p>
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

function UseCasesSection() {
  const useCases = [
    {
      title: 'Ecommerce',
      stat: '10-20h',
      statLabel: 'saved monthly',
      description: 'Automate tax holds by jurisdiction, manage return reserves, and split payments to suppliers. Replace spreadsheets with workflows.',
    },
    {
      title: 'Marketplaces',
      stat: '1 click',
      statLabel: 'seller payouts',
      description: 'Split payments to sellers, hold platform fees, manage escrow for disputes, and schedule payouts automatically.',
    },
    {
      title: 'SaaS',
      stat: '100%',
      statLabel: 'tax compliance',
      description: 'Calculate and hold sales tax across jurisdictions. Stay seller-of-record while automating compliance.',
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
            Workflows for every business
          </h2>
          <p className="text-lg text-muted-foreground">
            Real results from real companies.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-border p-6 md:p-8"
            >
              <div className="mb-4">
                <div className="text-3xl font-bold gradient-text">{useCase.stat}</div>
                <div className="text-sm text-muted-foreground">{useCase.statLabel}</div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {useCase.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {useCase.description}
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
          Ready to automate your treasury?
        </h2>
        <p className="text-lg text-background/70 mb-8 max-w-2xl mx-auto">
          Stop building spreadsheets. Start building workflows. Get a demo to see programmable treasury in action.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" className="group">
            Get a demo
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Button>
          <Button size="lg" variant="outline" className="border-background/30 text-background hover:bg-background/10">
            Talk to sales
          </Button>
        </div>
      </div>
    </section>
  )
}
