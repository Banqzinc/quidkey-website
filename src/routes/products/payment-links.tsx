import { createFileRoute, Link } from '@tanstack/react-router'
import { PageLayout } from '@/components/layout/page-layout'
import { buttonVariants } from '@/components/ui/button'
import { DEMO_PLAYGROUND_URL } from '@/lib/urls'
import { cn } from '@/lib/utils'
import {
  ArrowRight,
  Check,
  Link as LinkIcon,
  Mail,
  Clock,
  Shield,
  Globe,
  BarChart3,
} from 'lucide-react'
import { buildSeo } from '@/lib/seo'
import type { JsonLdObject } from '@/lib/seo'

const paymentLinksSchema: JsonLdObject = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Quidkey Payment Links',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'No monthly fees. Pay per transaction.',
  },
  description:
    'Send payment links for invoices and one-off payments. Your customer pays by bank right away. No cards. No integration. Lower fees.',
  featureList:
    'Create a link, Send anywhere, Pay by bank, Lower fees, Multi currency, Track payments',
  provider: {
    '@type': 'Organization',
    name: 'Quidkey',
    url: 'https://quidkey.com',
  },
}

export const Route = createFileRoute('/products/payment-links')({
  component: PaymentLinksPage,
  head: () =>
    buildSeo({
      title: 'Payment Links for Invoices. Send a Link. Get Paid | Quidkey',
      description:
        'Send a payment link instead of bank details. Your customer pays by bank right away. No cards. No integration. Lower fees.',
      path: '/products/payment-links',
      keywords: [
        'pay by bank payment links',
        'bank payment link',
        'no code payment link',
        'payment link generator',
        'invoice payment link',
      ],
      structuredData: [paymentLinksSchema],
    }),
})

/* ─── Merchant logos ─── */
const LOGO_DEV_TOKEN = 'pk_DsNHFndhT3yo-85c5vdKKg'
function logoUrl(domain: string, size: number) {
  return `https://img.logo.dev/${domain}?token=${LOGO_DEV_TOKEN}&size=${size}`
}

const merchants = [
  { name: 'Grace & Co', domain: 'graceandcojewellery.co.uk' },
  { name: 'Tryp.com', domain: 'tryp.com' },
  { name: 'TransferMate', domain: 'transfermate.com' },
  { name: 'SKUTopia', domain: 'skutopia.com' },
  { name: 'Manière De Voir', domain: 'manieredevoir.com' },
]

/* ─── Numbered features ─── */
const numberedFeatures = [
  {
    num: '01',
    icon: LinkIcon,
    title: 'Create in seconds',
    description:
      'Make a payment link in the dashboard. Add the amount, a reference, and what it is for.',
  },
  {
    num: '02',
    icon: Mail,
    title: 'Send anywhere',
    description:
      'Put the link in an email, text, WhatsApp message, or on the invoice itself.',
  },
  {
    num: '03',
    icon: Clock,
    title: 'Paid by bank',
    description:
      'Your customer clicks the link and pays with Pay by Bank. No card form to fill in.',
  },
  {
    num: '04',
    icon: Shield,
    title: 'Bank approved',
    description:
      'They confirm the payment in their own bank app, so it feels simple and safe.',
  },
  {
    num: '05',
    icon: Globe,
    title: 'Get paid in more places',
    description:
      'Get paid in GBP, EUR, USD, and AUD from customers in the UK, EU, US, and AU.',
    link: { href: '/products/multi-currency', label: 'See multi currency' },
  },
  {
    num: '06',
    icon: BarChart3,
    title: 'See what happened',
    description:
      'Track when a link is sent, opened, paid, or still waiting.',
  },
]

/* ═══════════════════════════════════════════════════════════════════════════
 * Page
 * ═══════════════════════════════════════════════════════════════════════════ */
function PaymentLinksPage() {
  return (
    <PageLayout>
      {/* ── Hero ── */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" aria-hidden="true" />
        <div className="absolute inset-0 noise" aria-hidden="true" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full bg-foreground/5 border border-foreground/10 px-4 py-2 text-sm font-medium text-foreground mb-6">
            Payment Links
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
            <span className="text-foreground">
              Payment Links for invoices.
            </span>
            <br />
            <span className="gradient-text">Send a link. Get paid.</span>
          </h1>

          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
            Need to get paid for an invoice? Send a Quidkey payment link. Your
            customer pays by bank right away.
          </p>

          {/* Feature checklist */}
          <ul
            className="flex flex-wrap justify-center gap-x-5 gap-y-3 mb-10"
            role="list"
          >
            {['No manual transfers', 'No integration', 'No cards'].map(
              (feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check
                    className="h-4 w-4 text-success flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium text-foreground/80">
                    {feature}
                  </span>
                </li>
              ),
            )}
          </ul>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={DEMO_PLAYGROUND_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'group shadow-lg shadow-primary/25 hover:shadow-primary/40',
              )}
            >
              Create a link
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>
            <Link
              to="/contact"
              hash="talk-to-sales"
              className={buttonVariants({ variant: 'outline', size: 'lg' })}
            >
              Talk to sales
            </Link>
          </div>
        </div>
      </section>

      {/* ── Merchant trust strip ── */}
      <section className="py-8 md:py-12 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground mb-6">
            Used by businesses worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {merchants.map((m) => (
              <div
                key={m.domain}
                className="flex items-center gap-2 opacity-50 hover:opacity-80 transition-opacity duration-200"
              >
                <img
                  src={logoUrl(m.domain, 24)}
                  srcSet={`${logoUrl(m.domain, 24)} 1x, ${logoUrl(m.domain, 48)} 2x`}
                  alt={`${m.name} logo`}
                  width={24}
                  height={24}
                  loading="lazy"
                  decoding="async"
                  className="h-6 w-6 object-contain"
                />
                <span className="text-sm font-medium text-muted-foreground">
                  {m.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Two-sided value proposition ── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
              Better for them.{' '}
              <span className="gradient-text">Better for you.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* How it helps */}
            <div className="bg-white rounded-2xl border border-border p-8 md:p-10">
              <h3 className="text-2xl font-semibold text-foreground mb-8">
                For your customer
              </h3>
              <div className="space-y-6">
                {[
                  {
                    icon: LinkIcon,
                    title: 'Open the link',
                    desc: 'They click the link and go straight to a simple payment page.',
                  },
                  {
                    icon: Shield,
                    title: 'Pay by bank',
                    desc: 'They approve the payment in their bank app. That is it.',
                  },
                  {
                    icon: Globe,
                    title: 'Pay in their currency',
                    desc: 'They can pay in GBP, EUR, USD, or AUD.',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground mb-1">
                        {item.title}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-2xl border border-border p-8 md:p-10">
              <h3 className="text-2xl font-semibold text-foreground mb-8">
                For your business
              </h3>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="text-4xl font-bold gradient-text mb-1">
                    30s
                  </div>
                  <div className="text-sm text-muted-foreground">
                    to make a link.
                    <br />
                    Add amount and reference
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-bold gradient-text mb-1">
                    4
                  </div>
                  <div className="text-sm text-muted-foreground">
                    markets.
                    <br />
                    UK, EU, US, and AU
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-border">
                <div className="text-4xl font-bold gradient-text mb-1">$0</div>
                <div className="text-sm text-muted-foreground">
                  monthly fees. Pay only when you get paid.{' '}
                  <Link
                    to="/pricing"
                    className="text-primary hover:underline font-medium"
                  >
                    See pricing
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Simplicity section ── */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-6 leading-[1.15]">
                <span className="gradient-text">
                  No setup pain.
                </span>{' '}
                Just make a link and send it.
              </h2>
            </div>
            <div>
              <p className="text-lg text-muted-foreground mb-6 text-pretty">
                Payment Links are built for invoices, one-off payments, and
                teams that want a simple way to get paid by bank. You do not
                need a website, checkout, or app.{' '}
                <Link
                  to="/solutions/professional-services"
                  className="text-primary hover:underline font-medium"
                >
                  See how it works for professional services
                </Link>.
              </p>
              <ul className="space-y-3">
                {[
                  'No website needed',
                  'Send by email, SMS, WhatsApp, or social',
                  'Set the amount and reference',
                  'See when it has been paid',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <Check
                      className="h-4 w-4 text-success flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-sm font-medium text-foreground/80">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Numbered features ── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
              What you get with Payment Links
            </h2>
            <p className="text-lg text-muted-foreground">
              Simple for you. Simple for your customer.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 stagger-children">
            {numberedFeatures.map((f) => (
              <div
                key={f.num}
                className="bg-white rounded-2xl border border-border p-6 card-hover"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold text-primary/60">
                    {f.num}
                  </span>
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.description}
                </p>
                {'link' in f && f.link && (
                  <Link
                    to={f.link.href}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline mt-3"
                  >
                    {f.link.label}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Global coverage ── */}
      <section className="py-16 md:py-20 bg-foreground text-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-6">
            Get paid from the UK, EU, US, and AU.
          </h2>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {['United States', 'United Kingdom', 'Europe', 'Australia'].map(
              (region) => (
                <span
                  key={region}
                  className="rounded-full border border-background/20 px-4 py-1.5 text-sm font-medium text-background/80"
                >
                  {region}
                </span>
              ),
            )}
          </div>
          <p className="text-background/60 max-w-xl mx-auto">
            Create one way to get paid and let customers pay in their own
            currency.
          </p>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
              How it works
            </h2>
            <p className="text-lg text-muted-foreground">
              Three simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl border border-border p-6 md:p-8 text-center">
              <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-5">
                1
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Create a link
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add the amount, reference, and what it is for. It takes about
                30 seconds.
              </p>
              <a
                href={DEMO_PLAYGROUND_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                Try it now
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl border border-border p-6 md:p-8 text-center">
              <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-5">
                2
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Send it
              </h3>
              <p className="text-sm text-muted-foreground">
                Put it in the invoice or send it in an email, text, or WhatsApp
                message.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl border border-border p-6 md:p-8 text-center">
              <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-5">
                3
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Get paid
              </h3>
              <p className="text-sm text-muted-foreground">
                Your customer pays by bank and the money lands in your account.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 md:py-24 bg-foreground text-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
            Stop sending bank details.
          </h2>
          <p className="text-lg text-background/70 mb-8 max-w-2xl mx-auto">
            Send a payment link instead. No integration. No cards. Just a simpler
            way to get paid.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={DEMO_PLAYGROUND_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: 'lg', variant: 'secondary' }),
                'group',
              )}
            >
              Create a link
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
            <Link
              to="/contact"
              hash="talk-to-sales"
              className={cn(
                buttonVariants({ size: 'lg', variant: 'outline' }),
                'border-background/30 text-background hover:bg-background/10',
              )}
            >
              Talk to sales
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
