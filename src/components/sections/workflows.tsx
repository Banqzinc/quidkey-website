import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function WorkflowsSection() {
  const workflows = [
    {
      command: 'Hold US sales tax by state, county, and city and product type.',
      description: 'Tax is automatically calculated and saved in separate tax accounts.',
    },
    {
      command: 'Hold 10% for refunds. Per Jurisdiction.',
      description: 'Manage refunds by jurisdiction. Hold 10% for refunds, and release the rest to the business account.',
    },
    {
      command: 'Split 70/30 with seller.',
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

        {/* Translate-style workflow examples */}
        <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto">
          {workflows.map((workflow, index) => (
            <div
              key={index}
              className="rounded-2xl border border-background/20 bg-background/5 backdrop-blur-sm overflow-hidden"
            >
              <div className="grid md:grid-cols-2">
                {/* Left panel - You write */}
                <div className="p-5 md:p-6 border-b md:border-b-0 md:border-r border-background/10">
                  <div className="text-xs font-medium text-background/40 uppercase tracking-wider mb-3">
                    You write
                  </div>
                  <div className="font-mono text-base md:text-lg text-background leading-relaxed">
                    "{workflow.command}"
                  </div>
                </div>

                {/* Right panel - Quidkey executes */}
                <div className="p-5 md:p-6 bg-background/5">
                  <div className="text-xs font-medium text-background/40 uppercase tracking-wider mb-3">
                    Quidkey executes
                  </div>
                  <p className="text-background/80 leading-relaxed">
                    {workflow.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
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
