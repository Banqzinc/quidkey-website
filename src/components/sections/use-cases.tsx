import { ShoppingBag, Repeat, Building2 } from 'lucide-react'

export function UseCasesSection() {
  const useCases = [
    {
      icon: ShoppingBag,
      title: 'Cross-border eCommerce',
      description: 'Reduce fees from 6-10% to 1-3.5%. Eliminate chargebacks with pay-by-bank. Automate tax holds and supplier splits.',
      audience: '$1-100M revenue',
    },
    {
      icon: Repeat,
      title: 'Global SaaS',
      description: 'Skip merchant-of-record fees. Automate multi-jurisdiction tax compliance. Collect subscriptions via bank transfer.',
      audience: '$50k-$1M MRR',
    },
    {
      icon: Building2,
      title: 'Platforms & Marketplaces',
      description: 'Programmable escrow and multi-party payouts. Real-time splits with dispute holds. Complex reconciliation simplified.',
      audience: 'Coming soon',
    },
  ]

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            <span className="text-foreground">Built for </span>
            <span className="gradient-text">global businesses.</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From DTC brands to enterprise SaaS, Quidkey adapts to your business model.
          </p>
        </div>

        {/* Use cases grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="rounded-2xl border border-border bg-secondary/30 p-6 md:p-8 card-hover"
            >
              {/* Icon */}
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-6">
                <useCase.icon className="h-6 w-6 text-primary" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {useCase.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {useCase.audience}
              </p>
              <p className="text-muted-foreground">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
