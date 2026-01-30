import { Zap, GitBranch, Workflow } from 'lucide-react'

export function ProductLayersSection() {
  const layers = [
    {
      icon: Zap,
      title: 'Payment Intelligence',
      subtitle: 'The Wedge',
      description:
        'AI bank prediction + risk decisions that improve with every transaction. Win checkout conversion while cutting costs versus cards.',
      features: ['Predictive bank selection', 'Cross-business fraud intelligence', 'One integration: US + EU + UK + AU'],
      gradient: 'from-[oklch(0.7_0.18_40)] to-[oklch(0.6_0.2_30)]',
    },
    {
      icon: GitBranch,
      title: 'Clearing & Routing',
      subtitle: 'The Infrastructure',
      description:
        'A global clearing layer that orchestrates regulated partners to collect, clear, and route funds into the right accounts automatically.',
      features: ['Automatic tax routing', 'Local + cross-border settlement', 'Fast refunds and reversals'],
      gradient: 'from-[oklch(0.6_0.22_320)] to-[oklch(0.5_0.22_290)]',
    },
    {
      icon: Workflow,
      title: 'Programmable Treasury',
      subtitle: 'The Moat',
      description:
        'Plain English intent becomes deterministic execution. Automate tax holds, FX, splits, and payouts without building a finance ops team.',
      features: ['Plain-English workflows', 'CEL-compiled execution', 'Audit-ready ledgers'],
      gradient: 'from-[oklch(0.55_0.2_270)] to-[oklch(0.45_0.22_280)]',
    },
  ]

  return (
    <section id="product" className="py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm text-secondary-foreground mb-4">
            Global AI Clearing House
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            <span className="text-foreground">Three layers. </span>
            <span className="gradient-text">One platform.</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Quidkey unifies payment collection, intelligent routing, and programmable treasury into a single AI-native clearing stack.
          </p>
        </div>

        {/* Layers grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {layers.map((layer, index) => (
            <div
              key={index}
              className="relative group rounded-2xl border border-border bg-background p-6 md:p-8 card-hover"
            >
              {/* Icon */}
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${layer.gradient} mb-4`}>
                <layer.icon className="h-6 w-6 text-white" />
              </div>

              {/* Subtitle */}
              <div className="text-xs font-medium text-primary uppercase tracking-wider mb-2">
                {layer.subtitle}
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {layer.title}
              </h3>
              <p className="text-muted-foreground mb-6">
                {layer.description}
              </p>

              {/* Features */}
              <ul className="space-y-2">
                {layer.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-sm text-muted-foreground mt-12 max-w-xl mx-auto">
          Quidkey does not hold funds or act as a bank. We orchestrate regulated partners and own the intelligence, workflow logic, and clearing orchestration layer.
        </p>
      </div>
    </section>
  )
}
