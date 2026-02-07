import { TrendingUp, Globe, Zap, Shield } from 'lucide-react'

export function WhyChooseSection() {
  const reasons = [
    {
      icon: TrendingUp,
      title: 'Lower Fees',
      description: 'Pay less per transaction compared to cards and cross border payments.',
    },
    {
      icon: Globe,
      title: 'Sell Globally',
      description: 'Sell to multiple jurisdictions, without operational complexities',
    },
    {
      icon: Zap,
      title: 'Money Automation',
      description: 'Automatically split money, handle tax, and send payouts.',
    },
    {
      icon: Shield,
      title: 'Better CashFlow',
      description: 'Get paid faster without long settlement delays.',
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
