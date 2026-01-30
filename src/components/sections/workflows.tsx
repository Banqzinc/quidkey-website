export function WorkflowsSection() {
  const workflows = [
    {
      command: '"Hold sales tax by jurisdiction."',
      description: 'Automatic tax calculation and segregation by product and region. Funds held in isolated currency accounts.',
    },
    {
      command: '"Split 70/30 with supplier, hold 10% for returns."',
      description: 'Instant multi-party splits with escrow for refunds. Currency conversion and settlement to multiple parties.',
    },
    {
      command: '"Convert to USD weekly at best rate."',
      description: 'Automated FX at optimal rates. Net funds settled directly into your operating account.',
    },
  ]

  return (
    <section id="how-it-works" className="py-16 md:py-24 lg:py-32 bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Intent to execution.
          </h2>
          <p className="text-lg text-background/70">
            Define treasury workflows in plain English. Quidkey compiles them into deterministic, auditable execution.
          </p>
        </div>

        {/* Workflow examples */}
        <div className="space-y-6 md:space-y-8 max-w-3xl mx-auto">
          {workflows.map((workflow, index) => (
            <div
              key={index}
              className="rounded-2xl border border-background/20 bg-background/5 p-6 md:p-8 backdrop-blur-sm"
            >
              {/* Command */}
              <div className="font-mono text-lg md:text-xl text-background mb-4">
                {workflow.command}
              </div>

              {/* Arrow indicator */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-background/20" />
                <span className="text-sm text-background/50">compiles to</span>
                <div className="h-px flex-1 bg-background/20" />
              </div>

              {/* Description */}
              <p className="text-background/70">
                {workflow.description}
              </p>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="text-center text-sm text-background/50 mt-12 max-w-xl mx-auto">
          Not a GPT wrapper. LLMs parse natural language, but execution is deterministic. 
          Every workflow compiles to CEL (Common Expression Language) with zero ambiguity.
        </p>
      </div>
    </section>
  )
}
