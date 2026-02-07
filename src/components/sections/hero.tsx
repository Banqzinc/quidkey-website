import { Button } from '@/components/ui/button'
import { ArrowRight, Check, CreditCard } from 'lucide-react'
import { useState, useEffect } from 'react'

const LOGO_DEV_TOKEN = 'pk_DsNHFndhT3yo-85c5vdKKg'

// Bank data - using domain-based lookup
const banks = [
  { name: 'Chase', domain: 'chase.com' },
  { name: 'Bank of America', domain: 'bankofamerica.com' },
  { name: 'Wells Fargo', domain: 'wellsfargo.com' },
  { name: 'Citi', domain: 'citi.com' },
  { name: 'Capital One', domain: 'capitalone.com' },
  { name: 'U.S. Bank', domain: 'usbank.com' },
]

export function HeroSection() {
  const [currentBankIndex, setCurrentBankIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentBankIndex((prev) => (prev + 1) % banks.length)
        setIsTransitioning(false)
      }, 200)
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  const currentBank = banks[currentBankIndex]

  const benefits = [
    '1-3% all-in fees',
    'Intelligent bank prediction',
    'Programmable treasury workflows',
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
              AI-native global clearing house
            </div>

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              <span className="text-foreground">Pay by bank.</span>
              <br />
              <span className="gradient-text">Built for global commerce.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 text-pretty">
              Quidkey unifies intelligent checkout and automates what happens after payment, including tax calculation, splits, and FX, in one platform. Global coverage with a single integration.
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
                Get a demo
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </Button>
              <Button variant="outline" size="lg">
                Talk to sales
              </Button>
            </div>
          </div>

          {/* Right column - Bank Prediction Visual */}
          <div className="relative flex justify-center lg:justify-end" aria-hidden="true">
            <div className="relative animate-float" style={{ animationDelay: '0.5s' }}>
              {/* Phone mockup */}
              <div className="relative w-64 md:w-72">
                {/* Side buttons */}
                <div className="pointer-events-none absolute left-0 top-24 -translate-x-[10px] h-14 w-1.5 rounded-full bg-foreground/50 shadow-sm" />
                <div className="pointer-events-none absolute left-0 top-44 -translate-x-[10px] h-10 w-1.5 rounded-full bg-foreground/45 shadow-sm" />
                <div className="pointer-events-none absolute right-0 top-36 translate-x-[10px] h-16 w-1.5 rounded-full bg-foreground/55 shadow-sm" />

                <div className="relative rounded-[3rem] bg-gradient-to-b from-foreground to-foreground/80 p-[10px] shadow-2xl shadow-foreground/20 ring-1 ring-foreground/10">
                  <div className="relative rounded-[2.45rem] bg-white overflow-hidden">
                    {/* Screen reflection */}
                    <div className="pointer-events-none absolute inset-0">
                      <div className="absolute -left-16 -top-20 h-56 w-56 rotate-12 rounded-full bg-white/50 blur-2xl opacity-35" />
                      <div className="absolute -right-24 -bottom-28 h-72 w-72 rounded-full bg-primary/10 blur-3xl opacity-60" />
                    </div>

                    {/* Notch */}
                    <div className="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 h-7 w-28 rounded-full bg-foreground/95 shadow-sm">
                      <div className="flex h-full items-center justify-center gap-2">
                        <div className="h-1.5 w-12 rounded-full bg-white/20" />
                        <div className="h-2 w-2 rounded-full bg-white/15" />
                      </div>
                    </div>

                    <div className="relative pt-10">
                      {/* Product card */}
                      <div className="p-4 border-b border-border">
                        <div className="text-xs text-muted-foreground mb-1 font-mono">$149</div>
                        <div className="w-full h-32 bg-gradient-to-br from-secondary to-secondary/50 rounded-xl flex items-center justify-center">
                          <span className="text-7xl">👟</span>
                        </div>
                      </div>

                      {/* Payment options */}
                      <div className="p-4 space-y-3 pb-5">
                        {/* Bank prediction - highlighted with switching animation */}
                        <div className="flex items-center gap-3 p-3.5 bg-primary/5 rounded-lg border-2 border-primary">
                          <img
                            src={`https://img.logo.dev/${currentBank.domain}?token=${LOGO_DEV_TOKEN}`}
                            alt={`${currentBank.name} logo`}
                            width={40}
                            height={40}
                            className={`w-10 h-10 rounded-full object-contain transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}
                          />
                          <span
                            className={`text-sm font-semibold text-foreground transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}
                          >
                            Pay with {currentBank.name}
                          </span>
                        </div>

                        {/* Other options */}
                        <div className="flex items-center gap-3 p-3 rounded-xl border border-border/50 opacity-50">
                          <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <span className="text-sm text-muted-foreground">Credit Card</span>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-xl border border-border/50 opacity-50">
                          <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                            <img
                              src={`https://img.logo.dev/apple.com?token=${LOGO_DEV_TOKEN}`}
                              alt="Apple Pay logo"
                              width={20}
                              height={20}
                              className="w-5 h-5 object-contain"
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">Apple Pay</span>
                        </div>

                        {/* Home indicator */}
                        <div className="pt-1">
                          <div className="mx-auto h-1 w-24 rounded-full bg-foreground/10" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
