import { createFileRoute } from '@tanstack/react-router'
import { PageLayout, PageCTA } from '@/components/layout/page-layout'
import { buttonVariants } from '@/components/ui/button'
import { MERCHANTS_SIGNUP_URL } from '@/lib/urls'
import { cn } from '@/lib/utils'
import { buildSeo } from '@/lib/seo'
import { Check, ArrowRight, Zap, Globe, Shield, Clock } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/pricing')({
  component: PricingPage,
  head: () =>
    buildSeo({
      title: 'Pricing for Pay by Bank Payments | Quidkey',
      description:
        'Transparent pricing for pay by bank checkout, global clearing, and money workflows. No setup fees or contracts—pay only when you get paid.',
      path: '/pricing',
    }),
})

type Currency = 'USD' | 'GBP' | 'EUR' | 'AUD'

const currencyConfig: Record<Currency, { symbol: string; fixedFee: string; label: string }> = {
  USD: { symbol: '$', fixedFee: '0.30', label: 'USD' },
  GBP: { symbol: '£', fixedFee: '0.20', label: 'GBP' },
  EUR: { symbol: '€', fixedFee: '0.25', label: 'EUR' },
  AUD: { symbol: 'A$', fixedFee: '0.45', label: 'AUD' },
}

function PricingPage() {
  const [currency, setCurrency] = useState<Currency>('USD')
  const { symbol, fixedFee } = currencyConfig[currency]

  const highlights = [
    'No Setup Fees',
    'No Contracts',
    'Predicted Bank at Checkout',
    'Cross Border Enabled',
  ]

  const domesticFeatures = [
    { text: 'Instant payouts', available: true },
    { text: 'Single & recurring payments', available: true },
    { text: 'UK, EU & US businesses', available: true },
    { text: 'UK, EU, US & AU consumers', available: true },
  ]

  const internationalFeatures = [
    { text: '1-5 business days settlement', available: true },
    { text: 'Single & recurring payments', available: true },
    { text: 'UK, EU, US & AU businesses', available: true },
    { text: 'UK, EU, US & AU consumers', available: true },
  ]

  const faqs = [
    {
      question: 'What is Quidkey and how does it work?',
      answer:
        "Quidkey is a bank-branded payment solution that predicts and auto-selects the customer's bank at checkout, simplifying the payment process while enhancing security and customer trust.",
    },
    {
      question: 'Where is Quidkey available?',
      answer:
        'Quidkey is available to businesses worldwide selling to UK, EU, US, and AU customers. We handle FX and cross-border payments seamlessly.',
    },
    {
      question: 'How long does it take to settle a payment?',
      answer:
        'Domestic transactions settle instantly in the UK and within one business day across the EU. Cross-border payments typically complete in 1-5 business days.',
    },
    {
      question: 'Is Quidkey secure?',
      answer:
        "Yes, Quidkey uses bank-level security with SCA (Strong Customer Authentication). Customers' banks handle identification and verification directly.",
    },
  ]

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative pt-24 pb-8 md:pt-32 md:pb-12 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" aria-hidden="true" />
        <div className="absolute inset-0 noise" aria-hidden="true" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
            <span className="text-foreground">Simple, Transparent</span>
            <br />
            <span className="gradient-text">Pricing</span>
          </h1>

          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
            No setup fees, monthly fees, or hidden fees. Pay only when you get paid.
          </p>

          {/* Highlights */}
          <div className="flex flex-wrap justify-center gap-3">
            {highlights.map((highlight) => (
              <div
                key={highlight}
                className="inline-flex items-center gap-2 rounded-full bg-foreground/5 border border-foreground/10 px-4 py-2 text-sm font-medium text-foreground"
              >
                <Check className="h-4 w-4 text-success" />
                {highlight}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Currency Selector */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-1 p-1 bg-secondary/50 rounded-full border border-border">
              {(Object.keys(currencyConfig) as Currency[]).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-full transition-all duration-200',
                    currency === curr
                      ? 'bg-white text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {currencyConfig[curr].label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12">
            {/* Domestic */}
            <div className="bg-white rounded-2xl border border-border p-8 md:p-10">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">Domestic</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl md:text-6xl font-bold gradient-text">1%</span>
                  <span className="text-2xl md:text-3xl font-semibold text-muted-foreground">+ {symbol}{fixedFee}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Per transaction</p>
              </div>

              <ul className="space-y-3">
                {domesticFeatures.map((feature) => (
                  <li key={feature.text} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* International */}
            <div className="bg-white rounded-2xl border border-border p-8 md:p-10">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">Cross Border</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl md:text-6xl font-bold gradient-text">3%</span>
                  <span className="text-2xl md:text-3xl font-semibold text-muted-foreground">+ {symbol}{fixedFee}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Per transaction</p>
              </div>

              <ul className="space-y-3">
                {internationalFeatures.map((feature) => (
                  <li key={feature.text} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Single CTA below cards */}
          <div className="text-center">
            <a
              href={MERCHANTS_SIGNUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ size: 'lg' }), 'group shadow-lg shadow-primary/25 hover:shadow-primary/40')}
            >
              Start accepting payments
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* Why Quidkey */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
              Why businesses choose Quidkey
            </h2>
            <p className="text-lg text-muted-foreground">
              Lower costs. Better security. Faster settlement.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="bg-white rounded-2xl border border-border p-6 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Instant Payouts</h3>
              <p className="text-sm text-muted-foreground">UK domestic transactions settle instantly.</p>
            </div>

            <div className="bg-white rounded-2xl border border-border p-6 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Zero Chargebacks</h3>
              <p className="text-sm text-muted-foreground">Bank authentication eliminates fraud.</p>
            </div>

            <div className="bg-white rounded-2xl border border-border p-6 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Global Coverage</h3>
              <p className="text-sm text-muted-foreground">Accept from UK, EU, US, and Australia.</p>
            </div>

            <div className="bg-white rounded-2xl border border-border p-6 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Live in Minutes</h3>
              <p className="text-sm text-muted-foreground">One-click Shopify install. Simple API.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="bg-white rounded-2xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PageCTA />
    </PageLayout>
  )
}
