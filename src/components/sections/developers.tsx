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
            <pre className="p-4 md:p-6 text-sm overflow-x-auto font-mono leading-relaxed">
              <code>
                <span className="text-purple-400">const</span>{' '}
                <span className="text-blue-300">payment</span>{' '}
                <span className="text-pink-400">=</span>{' '}
                <span className="text-purple-400">await</span>{' '}
                <span className="text-blue-300">quidkey</span>
                <span className="text-white/60">.</span>
                <span className="text-blue-300">payments</span>
                <span className="text-white/60">.</span>
                <span className="text-yellow-300">create</span>
                <span className="text-white/60">{'({'}</span>
                {'\n'}
                {'  '}<span className="text-cyan-300">amount</span>
                <span className="text-white/60">:</span>{' '}
                <span className="text-orange-300">9999</span>
                <span className="text-white/60">,</span>
                {'\n'}
                {'  '}<span className="text-cyan-300">currency</span>
                <span className="text-white/60">:</span>{' '}
                <span className="text-green-400">'USD'</span>
                <span className="text-white/60">,</span>
                {'\n'}
                {'  '}<span className="text-cyan-300">customer</span>
                <span className="text-white/60">:</span>{' '}
                <span className="text-white/60">{'{'}</span>
                {'\n'}
                {'    '}<span className="text-cyan-300">email</span>
                <span className="text-white/60">:</span>{' '}
                <span className="text-green-400">'customer@example.com'</span>
                {'\n'}
                {'  '}<span className="text-white/60">{'},'}</span>
                {'\n'}
                {'  '}<span className="text-cyan-300">workflow</span>
                <span className="text-white/60">:</span>{' '}
                <span className="text-white/60">{'{'}</span>
                {'\n'}
                {'    '}<span className="text-white/40">{'// Plain English treasury rules'}</span>
                {'\n'}
                {'    '}<span className="text-cyan-300">rules</span>
                <span className="text-white/60">:</span>{' '}
                <span className="text-white/60">{'['}</span>
                {'\n'}
                {'      '}<span className="text-green-400">'Hold US sales tax by jurisdiction'</span>
                <span className="text-white/60">,</span>
                {'\n'}
                {'      '}<span className="text-green-400">'Split 80/20 with partner'</span>
                <span className="text-white/60">,</span>
                {'\n'}
                {'      '}<span className="text-green-400">'Convert remainder to USD'</span>
                {'\n'}
                {'    '}<span className="text-white/60">{']'}</span>
                {'\n'}
                {'  '}<span className="text-white/60">{'}'}</span>
                {'\n'}
                <span className="text-white/60">{'});'}</span>
                {'\n\n'}
                <span className="text-white/40">{'// Redirect to hosted checkout'}</span>
                {'\n'}
                <span className="text-yellow-300">redirect</span>
                <span className="text-white/60">(</span>
                <span className="text-blue-300">payment</span>
                <span className="text-white/60">.</span>
                <span className="text-cyan-300">checkout_url</span>
                <span className="text-white/60">);</span>
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}
