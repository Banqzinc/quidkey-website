import { Button } from '@/components/ui/button'
import { ArrowRight, Check } from 'lucide-react'

export function HeroSection() {
  const benefits = [
    'No Setup Fees',
    'No Contracts',
    'Predicted Bank at Checkout',
    'Cross Border Enabled',
  ]

  return (
    <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 lg:pt-36 lg:pb-32 overflow-hidden">
      {/* Atmospheric gradient background */}
      <div className="absolute inset-0 hero-gradient" aria-hidden="true" />
      <div className="absolute inset-0 noise" aria-hidden="true" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left column - Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full bg-foreground/5 border border-foreground/10 px-4 py-2 text-sm font-medium text-foreground mb-8">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" aria-hidden="true" />
              AI-Native Clearing Infrastructure
            </div>

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              <span className="text-foreground">Pay by Bank.</span>
              <br />
              <span className="gradient-text">Faster. Cheaper. Safer.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 text-pretty">
              Pay 1–3.5% instead of 6–10%. Eliminate chargebacks and 10–20 hours of monthly treasury work. 
              Stay seller-of-record with full control.
            </p>

            {/* Benefits list */}
            <ul className="flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-3 mb-10" role="list">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-success flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm font-medium text-foreground/80">{benefit}</span>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="group shadow-lg shadow-primary/25 hover:shadow-primary/40">
                Start Accepting Payments
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </Button>
              <Button variant="outline" size="lg">
                Contact Sales
              </Button>
            </div>
          </div>

          {/* Right column - Bank Prediction Visual */}
          <div className="relative flex justify-center lg:justify-end" aria-hidden="true">
            <div className="relative animate-float" style={{ animationDelay: '0.5s' }}>
              {/* Phone mockup */}
              <div className="w-64 md:w-72 bg-foreground rounded-[2.5rem] p-2 shadow-2xl shadow-foreground/20">
                <div className="bg-white rounded-[2rem] overflow-hidden">
                  {/* Product card */}
                  <div className="p-4 border-b border-border">
                    <div className="text-xs text-muted-foreground mb-1 font-mono">£115</div>
                    <div className="w-full h-32 bg-gradient-to-br from-secondary to-secondary/50 rounded-xl flex items-center justify-center">
                      <span className="text-5xl">👟</span>
                    </div>
                  </div>
                  
                  {/* Payment options */}
                  <div className="p-4 space-y-3">
                    {/* Bank prediction - highlighted */}
                    <div className="flex items-center gap-3 p-3.5 bg-primary/5 rounded-xl border-2 border-primary transition-all duration-300 hover:bg-primary/10">
                      <div className="w-9 h-9 bg-[#024731] rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">L</span>
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-foreground block">Pay with Lloyds</span>
                        <span className="text-xs text-muted-foreground">Predicted for you</span>
                      </div>
                    </div>
                    
                    {/* Other options */}
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-border/50 opacity-50">
                      <div className="w-9 h-9 bg-secondary rounded-lg flex items-center justify-center text-sm">💳</div>
                      <span className="text-sm text-muted-foreground">Credit Card</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-border/50 opacity-50">
                      <div className="w-9 h-9 bg-foreground rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm"></span>
                      </div>
                      <span className="text-sm text-muted-foreground">Apple Pay</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating annotation */}
              <div className="absolute -right-4 md:-right-8 top-1/4 bg-white rounded-xl shadow-soft border border-border/50 p-4 max-w-[200px] animate-fade-in" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-xs font-semibold text-foreground uppercase tracking-wide">AI Prediction</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Bank auto-selected for one-click checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
