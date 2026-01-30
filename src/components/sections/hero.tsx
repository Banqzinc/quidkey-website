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
    <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 lg:pt-32 lg:pb-32 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 hero-gradient" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column - Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm text-secondary-foreground mb-6">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              AI-native clearing infrastructure
            </div>

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight mb-6">
              <span className="text-foreground">Pay by Bank. </span>
              <span className="gradient-text">Faster Settlements. Lower Fees. No Chargebacks.</span>
            </h1>

            {/* Benefits list */}
            <ul className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 mb-8">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-4 w-4 text-success flex-shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </li>
              ))}
            </ul>

            {/* Subheadline */}
            <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8">
              Pay 1–3.5% instead of 6–10%. Eliminate 10–20 hours of monthly treasury work. 
              Stay seller-of-record with full control of your customers and cash flow.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="group">
                Start Accepting Payments
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg">
                Contact Sales
              </Button>
            </div>
          </div>

          {/* Right column - Bank Prediction Visual */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Phone mockup */}
              <div className="w-64 md:w-72 bg-foreground rounded-[2.5rem] p-2 shadow-2xl">
                <div className="bg-white rounded-[2rem] overflow-hidden">
                  {/* Product card */}
                  <div className="p-4 border-b border-border">
                    <div className="text-xs text-muted-foreground mb-1">£115</div>
                    <div className="w-full h-32 bg-secondary rounded-lg flex items-center justify-center">
                      <div className="text-4xl">👟</div>
                    </div>
                  </div>
                  
                  {/* Payment options */}
                  <div className="p-4 space-y-3">
                    {/* Bank prediction - highlighted */}
                    <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg border-2 border-primary">
                      <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">🏦</span>
                      </div>
                      <span className="text-sm font-medium">Pay with Lloyds</span>
                    </div>
                    
                    {/* Other options */}
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-border opacity-60">
                      <div className="w-8 h-8 bg-secondary rounded flex items-center justify-center text-xs">💳</div>
                      <span className="text-sm text-muted-foreground">Credit Card</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-border opacity-60">
                      <div className="w-8 h-8 bg-foreground rounded flex items-center justify-center">
                        <span className="text-white text-xs"></span>
                      </div>
                      <span className="text-sm text-muted-foreground">Apple Pay</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating annotation */}
              <div className="absolute -right-4 top-1/3 bg-white rounded-lg shadow-lg border border-border p-3 max-w-[180px]">
                <div className="text-xs font-medium text-foreground mb-1">Payment Intelligence</div>
                <div className="text-xs text-muted-foreground">AI predicts customer's bank for one-click checkout</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
