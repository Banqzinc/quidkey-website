// Products section. Maps to Products() at app.jsx:2760-2829.
//   merchants -> ONE card (Treasury) with the lazy-loaded TreasuryMockup as
//                the centerpiece. Section id="treasury" so the nav anchor
//                from HomepageNav lands here.
//   fintechs  -> THREE cards (Rails, Accounts, Workflows) each with its own
//                mini-viz from VizFor.

import { Link } from '@tanstack/react-router'
import { Suspense, lazy, type ReactNode } from 'react'

import { VizFor } from '@/components/homepage/product-minis'
import { useAudience, type Audience } from '@/context/audience'

const TreasuryMockup = lazy(() => import('@/components/homepage/treasury-mockup'))

type Pill = { cls: string; label: string; noDot?: boolean }
type ProductCard = {
  id: string
  num: string
  title: string
  pill: Pill
  sub: string
  feats: string[]
  viz: 'checkout' | 'treasury' | 'accounts' | 'onboard'
  cta: string
}

type ProductCopy = {
  eyebrow: string
  h: ReactNode
  headPill?: Pill
  sub: string
  also?: string[]
  cards: ProductCard[]
}

const PRODUCT_COPY: Record<Audience, ProductCopy> = {
  merchants: {
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
    cards: [
      {
        id: 'treasury',
        num: '02 · Money out',
        title: 'Treasury',
        pill: { cls: 'pill--ink', label: 'beta' },
        sub: '',
        feats: [],
        viz: 'treasury',
        cta: 'Explore Treasury',
      },
    ],
  },
  fintechs: {
    eyebrow: 'Partner stack',
    h: (
      <>
        Three building blocks. <span style={{ color: 'var(--muted)' }}>Plug-and-play.</span>
      </>
    ),
    sub: 'Plug in what you need. White-label everything.',
    cards: [
      {
        id: 'rails',
        num: '01 · Pay by Bank',
        title: 'Rails',
        pill: { cls: 'pill--green', label: 'live' },
        sub: 'White-labelled Pay by Bank checkout your merchants embed under your brand.',
        feats: [
          'Branded checkout SDK',
          'Bank prediction & routing',
          'Multi-region coverage',
          'Shared dispute tooling',
          'Single webhook stream',
          'Co-branded or fully white-label',
        ],
        viz: 'checkout',
        cta: 'See rails',
      },
      {
        id: 'accounts',
        num: '02 · Embedded accounts',
        title: 'Accounts',
        pill: { cls: 'pill--green', label: 'live' },
        sub: 'Receiving accounts in EU, UK, US, AU, SG and more. One API.',
        feats: [
          'EU · UK · US · AU · SG · CA',
          'Partner portal with KYB',
          'API-first onboarding',
          'Per-merchant ledger',
          'Sub-accounts & reserves',
          'Compliance handled',
        ],
        viz: 'accounts',
        cta: 'See coverage',
      },
      {
        id: 'workflows',
        num: '03 · Workflows',
        title: 'Workflows',
        pill: { cls: 'pill--ink', label: 'beta' },
        sub: 'Automated treasury. Splits, FX, payouts and reserve sweeps.',
        feats: [
          'Programmable splits',
          'Multi-currency FX',
          'Scheduled & rule-based payouts',
          'Reserve & escrow patterns',
          'Audit-ready event log',
          'Webhooks for everything',
        ],
        viz: 'treasury',
        cta: 'See workflows',
      },
    ],
  },
}

function TreasuryMockupSkeleton() {
  return (
    <div className="tm2 tm2--loading" aria-busy="true">
      <div className="tm2__chrome">
        <div className="tm2__chrome-l">
          <span className="tm2__chrome-dot" />
          <span className="tm2__chrome-dot" />
          <span className="tm2__chrome-dot" />
        </div>
        <div className="tm2__chrome-path">treasury · acme studios</div>
      </div>
      <div className="tm2__body" />
    </div>
  )
}

export function Products() {
  const { audience } = useAudience()
  const c = PRODUCT_COPY[audience]
  const isSplit = c.cards.length === 1

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
            {c.headPill && (
              <span className={`pill pill--head ${c.headPill.cls}`}>
                {!c.headPill.noDot && <span className="pill__dot" />}
                {c.headPill.label}
              </span>
            )}
          </h2>
          <p className="products__subheader">{c.sub}</p>
          {c.also && c.also.length > 0 && (
            <div className="why__also products__also" aria-label="Treasury features">
              {c.also.map((a) => (
                <span key={a} className="why__also-item">
                  <span className="why__also-dot" aria-hidden="true" />
                  {a}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className={`products__grid products__grid--${c.cards.length}`}>
          {c.cards.map((card) => {
            const hasInnerCopy = !isSplit || (card.sub && card.sub.length > 0) || (card.feats && card.feats.length > 0)
            return (
              <div
                key={card.id}
                id={card.id}
                className={`product ${isSplit ? 'product--split product--stacked' : ''} ${
                  hasInnerCopy ? '' : 'product--viz-only'
                }`}
              >
                {hasInnerCopy && (
                  <div className="product__col product__col--copy">
                    <div className="product__head">
                      <div className="product__head-title">
                        {!isSplit && <div className="product__num">{card.num}</div>}
                        <div className="product__title-row">
                          <h3 className="product__title">{card.title}</h3>
                          {isSplit && (
                            <span className={`pill ${card.pill.cls}`}>
                              <span className="pill__dot" />
                              {card.pill.label}
                            </span>
                          )}
                        </div>
                      </div>
                      {!isSplit && (
                        <span className={`pill ${card.pill.cls}`}>
                          <span className="pill__dot" />
                          {card.pill.label}
                        </span>
                      )}
                    </div>
                    {card.sub && <p className="product__sub">{card.sub}</p>}
                    {card.feats && card.feats.length > 0 && (
                      <div className="product__feats">
                        {card.feats.map((f) => (
                          <div key={f} className="product__feat">
                            {f}
                          </div>
                        ))}
                      </div>
                    )}
                    {!isSplit && (
                      <Link to="/" hash="integrations" className="product__cta">
                        {card.cta}
                      </Link>
                    )}
                  </div>
                )}
                <div className="product__col product__col--viz">
                  {isSplit ? (
                    <div className="products__mockup-wrap">
                      <Suspense fallback={<TreasuryMockupSkeleton />}>
                        <TreasuryMockup />
                      </Suspense>
                    </div>
                  ) : (
                    <div className="product__viz">
                      <VizFor kind={card.viz} />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
