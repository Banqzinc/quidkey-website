import { TrendingUp, Globe, Zap, Shield } from 'lucide-react'

export function WhyChooseSection() {
  const reasons = [
    {
      icon: TrendingUp,
      title: 'Higher margin, better unit economics',
      description: 'Replace 3-6% card fees and 6-10% MoR take rates with 1-3.5% all-in pay by bank.',
    },
    {
      icon: Globe,
      title: 'Sell into the US without giving up control',
      description: 'Stay seller-of-record while collecting and settling cross-border, built for global businesses expanding into the US.',
    },
    {
      icon: Zap,
      title: 'Treasury workflows, automated',
      description: 'Hold tax, split revenue, run FX, and schedule payouts automatically, defined in plain English and executed deterministically.',
    },
    {
      icon: Shield,
      title: 'AI risk + deterministic execution',
      description: 'Network-trained fraud intelligence improves outcomes across the platform. Workflows compile to CEL for audit-ready correctness.',
    },
  ]

  return (
    <section className="pt-8 pb-16 md:pt-12 md:pb-24 lg:pt-16 lg:pb-32 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Why Businesses Choose Quidkey
          </h2>
          <p className="text-lg text-muted-foreground">
            Infrastructure, not a fintech app. A category leader, not a feature.
          </p>
        </div>

        {/* Reasons grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-border p-6 card-hover"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                <reason.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {reason.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
