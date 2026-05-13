// Pricing section. Maps to the prototype's Pricing() at app.jsx:4058-4194.
// The 'compare' cards in PRICING_COPY are filtered out of the main grid (line
// 4092) and the prototype's "Hero argument" block at 4130 is gated by
// `{false && ...}` ("Hero argument removed per design feedback."), so neither
// is ported.

import { useState, type ReactNode } from 'react'

import { useAudience, type Audience } from '@/context/audience'
import { track } from '@/lib/track'

type Currency = {
  code: 'USD' | 'EUR' | 'GBP' | 'AUD'
  sym: string
  fixed: string
}

const PRICING_CURRENCIES: Currency[] = [
  { code: 'USD', sym: '$', fixed: '0.30' },
  { code: 'EUR', sym: '€', fixed: '0.25' },
  { code: 'GBP', sym: '£', fixed: '0.20' },
  { code: 'AUD', sym: 'A$', fixed: '0.45' },
]

type RateCard = {
  kind: 'rate'
  main?: boolean
  lbl: string
  pct: string
  sub: string
  list: string[]
}
type FlatCard = {
  kind: 'flat'
  main?: boolean
  lbl: string
  val: string
  unit?: string
  sub: string
  list: string[]
}
type Card = RateCard | FlatCard

type PricingCopy = {
  h: ReactNode
  cards: Card[]
}

const PRICING_COPY: Record<Audience, PricingCopy> = {
  merchants: {
    h: (
      <>
        Simple, <span style={{ color: '#6b6b6b' }}>Transparent</span> Pricing.
      </>
    ),
    cards: [
      {
        kind: 'rate',
        main: true,
        lbl: 'Domestic · per transaction',
        pct: '1%',
        sub: 'In your home currency.',
        list: ['No lock-in contracts', 'Unlimited volume', 'No charge for refunds', 'Shopify, Woo, BigCommerce'],
      },
      {
        kind: 'rate',
        lbl: 'Cross-border · per transaction',
        pct: '3%',
        sub: 'Mid-market FX, no markup on your customer.',
        list: [
          'Mid-market FX, zero markup',
          'No FX fee on the buyer',
          'Multi-currency settlement',
          'Local acquiring where possible',
        ],
      },
    ],
  },
  fintechs: {
    h: (
      <>
        Built around your <span style={{ color: 'var(--muted)' }}>economics.</span>
      </>
    ),
    cards: [
      {
        kind: 'flat',
        main: true,
        lbl: 'Partner platform',
        val: 'Custom',
        sub: 'Tiered by volume.',
        list: [
          'Unlimited merchants',
          'White-label portal & console',
          'Partner-scoped API & webhooks',
          'Dedicated solution engineer',
        ],
      },
      {
        kind: 'flat',
        lbl: 'Per merchant',
        val: '$0',
        unit: '/mo',
        sub: 'No per-seat fees.',
        list: ['Unlimited sub-accounts', 'KYB included', 'Audit logs included', 'Sandbox + prod environments'],
      },
    ],
  },
}

function RateCardView({ card, currency }: { card: RateCard; currency: Currency }) {
  const parts = card.lbl.split(' · ')
  return (
    <div className={`pricing__card ${card.main ? 'pricing__card--main' : ''}`}>
      <div className="pricing__card-lbl pricing__card-lbl--rate">
        <span className="pricing__card-badge">{parts[0]}</span>
        {parts[1] && <span className="pricing__card-lbl-rest">{parts[1]}</span>}
      </div>
      <div className="pricing__rate">
        <span className="pricing__rate-pct">{card.pct}</span>
        <span className="pricing__rate-plus">+</span>
        <span className="pricing__rate-fixed">
          <span className="pricing__rate-sym">{currency.sym}</span>
          {currency.fixed}
        </span>
      </div>
      <div className="pricing__card-sub">{card.sub}</div>
      <ul className="pricing__list">
        {card.list.map((li) => (
          <li key={li}>{li}</li>
        ))}
      </ul>
    </div>
  )
}

function FlatCardView({ card }: { card: FlatCard }) {
  return (
    <div className={`pricing__card ${card.main ? 'pricing__card--main' : ''}`}>
      <div className="pricing__card-lbl">{card.lbl}</div>
      <div className="pricing__card-val">
        {card.val}
        {card.unit && <span className="pricing__card-unit">{card.unit}</span>}
      </div>
      <div className="pricing__card-sub">{card.sub}</div>
      <ul className="pricing__list">
        {card.list.map((li) => (
          <li key={li}>{li}</li>
        ))}
      </ul>
    </div>
  )
}

export function PricingSection() {
  const { audience } = useAudience()
  const c = PRICING_COPY[audience]
  const [curCode, setCurCode] = useState<Currency['code']>('USD')
  const cur = PRICING_CURRENCIES.find((x) => x.code === curCode) ?? PRICING_CURRENCIES[0]

  const trackHighVolume = () => {
    track({ name: 'homepage_pricing_cta_click', tier: 'high_volume', audience })
  }

  return (
    <section id="pricing" className="section section--soft section--pricing-fit">
      <div className="container">
        <div className="pbb__head">
          <span className="section__eyebrow pbb__eyebrow">
            <span className="section__eyebrow-dot" aria-hidden="true" />
            Pricing
          </span>
          <h2 className="section__h pbb__h">{c.h}</h2>
          <p className="pbb__lede">No setup fees, monthly fees, or hidden fees. Pay only when you get paid.</p>
        </div>

        {audience === 'merchants' && (
          <div className="pricing__cur">
            <span className="pricing__cur-lbl">Show in</span>
            <div className="pricing__cur-tabs" role="tablist">
              {PRICING_CURRENCIES.map((x) => (
                <button
                  key={x.code}
                  type="button"
                  role="tab"
                  aria-selected={x.code === curCode}
                  className={`pricing__cur-tab ${x.code === curCode ? 'is-on' : ''}`}
                  onClick={() => setCurCode(x.code)}
                >
                  {x.code}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="pricing__grid pricing__grid--rates">
          {c.cards.map((card, i) =>
            card.kind === 'rate' ? (
              <RateCardView key={i} card={card} currency={cur} />
            ) : (
              <FlatCardView key={i} card={card} />
            )
          )}
        </div>

        {audience === 'merchants' && (
          <a className="pricing__highvol" href="/contact" onClick={trackHighVolume}>
            <div className="pricing__highvol-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="7" width="18" height="13" rx="2" />
                <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                <path d="M3 12h18" />
              </svg>
            </div>
            <div className="pricing__highvol-l">
              <div className="pricing__highvol-h">High volume?</div>
              <div className="pricing__highvol-sub">
                Talk to us. We&rsquo;ll build pricing that fits your book, bespoke per-transaction rates, settlement
                terms, and SLAs.
              </div>
            </div>
            <div className="pricing__highvol-actions">
              <span className="pricing__highvol-btn">Get in touch</span>
            </div>
          </a>
        )}
      </div>
    </section>
  )
}
