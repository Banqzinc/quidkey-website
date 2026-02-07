import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function WorkflowsSection() {
  const workflows = [
    {
      command: '"Hold US sales tax by state, county, and city."',
      description: 'Automatically calculate and segregate tax at the moment of payment. Route funds into dedicated tax sub-accounts for clean remittance.',
    },
    {
      command: '"Hold 10% for refunds. Per Jurisdiction."',
      description: 'Manage refunds by jurisdiction. Hold 10% for refunds, and release the rest to the business account.',
    },
    {
      command: '"Split 70/30 with seller."',
      description: 'A marketplace splits payments to sellers, and holds a platform fee.',
    },
  ]

  return (
    <section id="workflows" className="py-16 md:py-24 lg:py-32 bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Write simple rules for how your money moves.
          </h2>
          <p className="text-lg text-background/70">
            Describe how your money should move in plain English. Quidkey handles it automatically.
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
                <span className="text-sm text-background/50">Translates to</span>
                <div className="h-px flex-1 bg-background/20" />
              </div>

              {/* Description */}
              <p className="text-background/70">
                {workflow.description}
              </p>
            </div>
          ))}
        </div>

        {/* Note and CTA */}
        <div className="text-center mt-12 space-y-6">
          <p className="text-sm text-background/50 max-w-xl mx-auto">
            Not a GPT wrapper. LLMs parse natural language, but execution is deterministic.
            Every workflow compiles to CEL (Common Expression Language) with zero ambiguity.
          </p>

          <Link to="/workflows">
            <Button variant="secondary" size="lg" className="group">
              Explore all workflows
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
