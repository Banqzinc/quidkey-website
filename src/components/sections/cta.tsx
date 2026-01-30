import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-primary via-[oklch(0.5_0.22_290)] to-[oklch(0.6_0.2_320)] p-8 md:p-12 lg:p-16 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
            <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-1/4 right-1/3 w-48 h-48 rounded-full bg-white blur-2xl" />
          </div>

          {/* Content */}
          <div className="relative text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4">
              Ready to see Quidkey in action?
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Get a US-first pay by bank checkout, plus a global clearing layer and programmable treasury, without giving up seller-of-record control.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="group bg-white text-primary hover:bg-white/90">
                Get a demo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Talk to sales
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
