import { Code, Plug, Shield } from 'lucide-react'

export function DevelopersSection() {
  const features = [
    {
      icon: Code,
      title: 'Single API',
      description: 'One integration for pay by bank, clearing, and programmable treasury, US-first with global coverage.',
    },
    {
      icon: Plug,
      title: 'Webhooks & Events',
      description: 'Real-time notifications for every payment, split, and settlement. Build reactive workflows.',
    },
    {
      icon: Shield,
      title: 'Enterprise-grade',
      description: 'SOC 2 compliant. Deterministic execution with full audit trails. Zero ambiguity.',
    },
  ]

  return (
    <section id="developers" className="py-16 md:py-24 lg:py-32 bg-[oklch(0.15_0.02_260)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column - Content */}
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white mb-6">
              Built for developers.
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Modern APIs designed for the way you work. From prototype to production in days, not months.
            </p>

            {/* Feature list */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">{feature.title}</h3>
                    <p className="text-sm text-white/60">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column - Code example */}
          <div className="rounded-2xl bg-black/50 border border-white/10 overflow-hidden">
            {/* Code header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-xs text-white/40 font-mono">create-payment.ts</span>
            </div>

            {/* Code content */}
            <pre className="p-4 md:p-6 text-sm overflow-x-auto">
              <code className="text-white/80 font-mono">
{`const payment = await quidkey.payments.create({
  amount: 9999,
  currency: 'USD',
  customer: {
    email: 'customer@example.com'
  },
  workflow: {
    // Plain English treasury rules
    rules: [
      'Hold US sales tax by jurisdiction',
      'Split 80/20 with partner',
      'Convert remainder to USD'
    ]
  }
});

// Redirect to hosted checkout
redirect(payment.checkout_url);`}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}
