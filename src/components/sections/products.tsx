// Products section. Single Treasury card with the lazy-loaded TreasuryMockup
// as the centerpiece. Section id="treasury" so the nav anchor from
// HomepageNav lands here.

import { Suspense, lazy, type ReactNode } from 'react'

import { TreasuryMockupSkeleton } from '@/components/homepage/treasury-mockup-skeleton'

const TreasuryMockup = lazy(() => import('@/components/homepage/treasury-mockup'))

type Pill = { cls: string; label: string; noDot?: boolean }

const PRODUCT_COPY: {
  eyebrow: string
  h: ReactNode
  headPill: Pill
  sub: string
  also: string[]
  card: { id: string; title: string }
} = {
  eyebrow: 'Programmable treasury',
  h: (
    <>
      Beyond checkout: <span className="grad-text">Treasury</span>
    </>
  ),
  headPill: { cls: 'pill--ink', label: 'Beta', noDot: true },
  sub:
    'Connect the revenue streams you already use, from Stripe and Adyen to Amazon and Shop Pay, and decide what happens after each payment lands.',
  also: [
    'Programmable splits',
    'Automated tax routing',
    'Multi-currency · live FX',
    'Reserve & sweep accounts',
    'Audit-ready ledger',
    'Webhooks for everything',
  ],
  card: { id: 'treasury', title: 'Treasury' },
}

export function Products() {
  const c = PRODUCT_COPY

  return (
    <section id="treasury" className="products products--fit">
      <div className="container">
        <div className="products__head">
          <div className="section__eyebrow">
            <span className="section__eyebrow-dot" />
            {c.eyebrow}
          </div>
          <h2 className="section__h">
            {c.h}
            <span className={`pill pill--head ${c.headPill.cls}`}>
              {!c.headPill.noDot && <span className="pill__dot" />}
              {c.headPill.label}
            </span>
          </h2>
          <p className="products__subheader">{c.sub}</p>
          <div className="why__also products__also" aria-label="Treasury features">
            {c.also.map((a) => (
              <span key={a} className="why__also-item">
                <span className="why__also-dot" aria-hidden="true" />
                {a}
              </span>
            ))}
          </div>
        </div>

        <div className="products__grid products__grid--1">
          <div
            id={c.card.id}
            className="product product--split product--stacked product--viz-only"
          >
            <div className="product__col product__col--viz">
              <div className="products__mockup-wrap">
                <Suspense fallback={<TreasuryMockupSkeleton />}>
                  <TreasuryMockup />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
