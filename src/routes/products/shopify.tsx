import { createFileRoute, Link } from '@tanstack/react-router'
import { PageLayout } from '@/components/layout/page-layout'
import { buttonVariants } from '@/components/ui/button'
import { DEMO_PLAYGROUND_URL } from '@/lib/urls'
import { cn } from '@/lib/utils'
import {
  ArrowRight,
  Check,
  Zap,
  Shield,
  TrendingUp,
  Clock,
  CreditCard,
  RotateCcw,
} from 'lucide-react'
import { buildSeo } from '@/lib/seo'

export const Route = createFileRoute('/products/shopify')({
  component: ShopifyPage,
  head: () =>
    buildSeo({
      title: 'Cut Shopify Payment Fees by 70% with Pay by Bank | Quidkey',
      description:
        'Official Shopify Payment Partner. Cut payment fees by up to 70%, eliminate chargebacks, and get instant settlement. Install the Quidkey Pay by Bank app in minutes.',
      path: '/products/shopify',
      keywords: [
        'shopify pay by bank',
        'shopify payment partner',
        'shopify open banking',
        'shopify payment app',
        'shopify lower payment fees',
        'shopify zero chargebacks',
      ],
    }),
})

/* ─── Merchant logos ─── */
const LOGO_DEV_TOKEN = 'pk_DsNHFndhT3yo-85c5vdKKg'
function logoUrl(domain: string, size: number) {
  return `https://img.logo.dev/${domain}?token=${LOGO_DEV_TOKEN}&size=${size}`
}

const SHOPIFY_APP_URL = 'https://apps.shopify.com/quidkey-checkout'

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
    icon: Zap,
    title: 'Bank Prediction',
    description:
      "Automatically detects your customer's bank for a one-tap payment experience. No manual selection needed.",
  },
  {
    num: '02',
    icon: Shield,
    title: 'Zero Chargebacks',
    description:
      'Every payment is bank-authenticated. No card data, no disputes, no chargeback fees. Ever.',
  },
  {
    num: '03',
    icon: TrendingUp,
    title: 'Lower Fees',
    description:
      'Save up to 70% compared to card processing. On $1M revenue, that\'s $25-45k back in your pocket annually.',
    link: { href: '/pricing', label: 'See pricing' },
  },
  {
    num: '04',
    icon: Clock,
    title: 'Fast Settlement',
    description:
      'Instant settlement in the UK and EU. 1-3 business days in the US. No more waiting for your money.',
  },
  {
    num: '05',
    icon: RotateCcw,
    title: 'Instant Refunds',
    description:
      'Process refunds back to your customer\'s bank account instantly. Better experience, fewer support tickets.',
    link: { href: '/products/refunds', label: 'Learn about refunds' },
  },
  {
    num: '06',
    icon: CreditCard,
    title: 'Works with Cards',
    description:
      'Pay by Bank sits alongside your existing payment methods. Customers choose. No disruption to your checkout.',
  },
]


/* ═══════════════════════════════════════════════════════════════════════════
 * Page
 * ═══════════════════════════════════════════════════════════════════════════ */
function ShopifyPage() {
  return (
    <PageLayout>
      {/* ── Hero ── */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" aria-hidden="true" />
        <div className="absolute inset-0 noise" aria-hidden="true" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Shopify Payments Partner badge */}
          <div className="inline-flex items-center gap-3 rounded-full bg-white border border-border shadow-sm px-5 py-2.5 mb-6">
            <img
              src={logoUrl('shopify.com', 24)}
              srcSet={`${logoUrl('shopify.com', 24)} 1x, ${logoUrl('shopify.com', 48)} 2x`}
              alt=""
              width={24}
              height={24}
              className="h-6 w-6 object-contain"
              aria-hidden="true"
            />
            <span className="text-sm font-medium tracking-tight">
              <span className="text-[#5E8E3E]">shopify</span>{' '}
              <span className="text-foreground/70 font-normal">payments</span>
              <span className="text-muted-foreground font-normal"> · official partner</span>
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
            <span className="text-foreground">
              Cut Your Shopify
              <br />
              Payment Fees By Up to{' '}
            </span>
            <span className="gradient-text">70%</span>
          </h1>

          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
            Bank-authenticated payments. Zero chargebacks. Instant settlement.
            Install in minutes and start saving today.
          </p>

          {/* Feature checklist */}
          <ul
            className="flex flex-wrap justify-center gap-x-5 gap-y-3 mb-10"
            role="list"
          >
            {['Shopify approved', 'One-click install', 'Zero chargebacks'].map(
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
              href={SHOPIFY_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'group shadow-lg shadow-primary/25 hover:shadow-primary/40',
              )}
            >
              Install on Shopify
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>
            <a
              href={DEMO_PLAYGROUND_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: 'outline', size: 'lg' })}
            >
              Get a demo
            </a>
          </div>
        </div>
      </section>

      {/* ── Merchant trust strip ── */}
      <section className="py-8 md:py-12 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground mb-6">
            Trusted by merchants worldwide
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
              How Pay by Bank{' '}
              <span className="gradient-text">Improves</span> Your Store
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* For customers */}
            <div className="bg-white rounded-2xl border border-border p-8 md:p-10">
              <h3 className="text-2xl font-semibold text-foreground mb-8">
                For Your Customers
              </h3>
              <div className="space-y-6">
                {[
                  {
                    icon: Zap,
                    title: 'Express checkout',
                    desc: 'Pre-filled details with bank prediction. Faster than typing card numbers.',
                  },
                  {
                    icon: Shield,
                    title: 'Bank-level security',
                    desc: 'Authenticated by their own bank app. No card details shared.',
                  },
                  {
                    icon: CreditCard,
                    title: 'Their choice',
                    desc: 'Pay by Bank sits alongside cards and PayPal. Customers pick what works.',
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

            {/* For store owners */}
            <div className="bg-white rounded-2xl border border-border p-8 md:p-10">
              <h3 className="text-2xl font-semibold text-foreground mb-8">
                For Store Owners
              </h3>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="text-4xl font-bold gradient-text mb-1">
                    -70%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    less payment costs with
                    <br />
                    Pay by Bank fees
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-bold gradient-text mb-1">
                    +37%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    higher conversion with
                    <br />
                    less friction at checkout
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-border">
                <div className="text-4xl font-bold gradient-text mb-1">0%</div>
                <div className="text-sm text-muted-foreground">
                  chargebacks. Bank authentication stops fraud and disputes
                  before they happen
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Integration simplicity ── */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-6 leading-[1.15]">
                <span className="gradient-text">
                  No need to change your checkout
                </span>{' '}
. Just add Pay by Bank like PayPal or Shop&nbsp;Pay.
              </h2>
            </div>
            <div>
              <p className="text-lg text-muted-foreground mb-6 text-pretty">
                Quidkey adds Pay by Bank as an additional payment method at your
                Shopify checkout. Your customers get one more way to pay, with
                lower fees and faster settlement for you.{' '}
                <Link
                  to="/solutions/ecommerce"
                  className="text-primary hover:underline font-medium"
                >
                  See how it works for ecommerce
                </Link>.
              </p>
              <ul className="space-y-3">
                {[
                  'Works with your existing checkout flow',
                  'No code changes required',
                  'Sits alongside cards, PayPal, and Shop Pay',
                  'Live in under 10 minutes',
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
              All-in-One Pay by Bank for Shopify
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to accept bank payments, reduce costs, and
              grow your store.
            </p>
          </div>

          {/* Horizontal numbered nav */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12">
            {numberedFeatures.map((f) => (
              <div
                key={f.num}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <span className="font-bold text-primary">{f.num}</span>
                <span className="font-medium">{f.title}</span>
              </div>
            ))}
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

      {/* ── How it works ── */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
              Live in 3 steps
            </h2>
            <p className="text-lg text-muted-foreground">
              Go from install to accepting bank payments in under 10 minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {/* Step 1 — with install link */}
            <div className="bg-white rounded-2xl border border-border p-6 md:p-8 text-center">
              <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-5">
                1
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Install the app
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                One click from the Shopify App Store. No developer needed.
              </p>
              <a
                href={SHOPIFY_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                Install now
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl border border-border p-6 md:p-8 text-center">
              <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-5">
                2
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Connect your bank
              </h3>
              <p className="text-sm text-muted-foreground">
                Link your business bank account to receive settlements.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl border border-border p-6 md:p-8 text-center">
              <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-5">
                3
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Go live
              </h3>
              <p className="text-sm text-muted-foreground">
                Pay by Bank appears at your checkout. Start saving immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 md:py-24 bg-foreground text-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
            Start saving today.
          </h2>
          <p className="text-lg text-background/70 mb-8 max-w-2xl mx-auto">
            Join merchants saving thousands on payment fees. Zero chargebacks.
            Live in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={SHOPIFY_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: 'lg', variant: 'secondary' }),
                'group',
              )}
            >
              Install on Shopify
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
            <a
              href={DEMO_PLAYGROUND_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: 'lg', variant: 'outline' }),
                'border-background/30 text-background hover:bg-background/10',
              )}
            >
              Get a demo
            </a>
          </div>
        </div>
      </section>

    </PageLayout>
  )
}
