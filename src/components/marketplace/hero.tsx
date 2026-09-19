import { useEffect, useState } from 'react'

import { useContactLink } from '@/context/contact'
import { track } from '@/lib/track'

const ProofCheck = (
  <svg
    className="hero__proof-check"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2.5 8.5l3.5 3.5 7-8" />
  </svg>
)

const PROOF = ['Buyer pays locally.', 'Seller gets paid directly.', 'The transaction stays with you.']

// Same split layout as the homepage and /fx-check heroes: copy left, the
// product right. The card is a Protected Pay order as the marketplace would
// see it in its own console, stepping through the flow on a loop.
export function MarketplaceHero() {
  const talk = useContactLink('marketplace', 'marketplace_hero')

  return (
    <section className="hero hero--split mkt-hero">
      <div className="container">
        <div className="hero__split">
          <div className="hero__copy mkt-hero__copy">
            <h1 className="hero__title">
              Keep B2B transactions <em>on your marketplace.</em>
            </h1>
            <p className="hero__sub">
              Give buyers protected bank payments, let sellers receive directly into their own
              accounts, and earn on every transaction and FX conversion.
            </p>
            <ul className="hero__proof">
              {PROOF.map((line) => (
                <li key={line} className="hero__proof-item">
                  {ProofCheck}
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <div className="hero__ctas">
              <a
                href={talk.href}
                className="btn btn--ink btn--xl"
                onClick={(event) => {
                  track({ name: 'marketplace_cta_click', location: 'hero', target: 'talk_to_us' })
                  talk.onClick(event)
                }}
              >
                Talk to us
                <span className="btn__arrow" aria-hidden="true">
                  <svg
                    viewBox="0 0 16 16"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </span>
              </a>
              <a
                href="#protected-pay"
                className="btn btn--ghost btn--xl"
                onClick={() =>
                  track({ name: 'marketplace_cta_click', location: 'hero', target: 'how_it_works' })
                }
              >
                See how it works
              </a>
            </div>
          </div>
          <OrderCard />
        </div>
      </div>
    </section>
  )
}

// The five states a Protected Pay order moves through. The status line names
// the state the funds are in, which is the whole point of the product.
const STAGES = [
  { label: 'Buyer pays by bank', status: 'Awaiting payment' },
  { label: 'Order funded, funds restricted', status: 'Funded · restricted' },
  { label: 'Seller fulfils', status: 'Funded · restricted' },
  { label: 'Delivery confirmed', status: 'Release pending' },
  { label: 'Restriction lifts, seller paid', status: 'Released to seller' },
] as const

const STAGE_MS = 1700
const LOOP_PAUSE_MS = 2600

function OrderCard() {
  // Server and first client render both start at stage 0, so hydration
  // matches; the loop starts after mount. Visitors who asked for reduced
  // motion get the order parked in its protected state instead.
  const [stage, setStage] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStage(2)
      return
    }
    let timer: ReturnType<typeof setTimeout>
    const advance = (current: number) => {
      const next = (current + 1) % STAGES.length
      const delay = current === STAGES.length - 1 ? LOOP_PAUSE_MS : STAGE_MS
      timer = setTimeout(() => {
        setStage(next)
        advance(next)
      }, delay)
    }
    advance(0)
    return () => clearTimeout(timer)
  }, [])

  const released = stage === STAGES.length - 1

  return (
    <figure className="mkt-order" aria-label="Example Protected Pay order">
      <figcaption className="mkt-order__head">
        <span className="mkt-order__tag">Protected Pay</span>
        <span className="mkt-order__id">Order PO-4821</span>
      </figcaption>

      <div className="mkt-order__parties">
        <div className="mkt-order__party">
          <span className="mkt-order__party-l">Buyer</span>
          <span className="mkt-order__party-n">Müller Werkzeug GmbH</span>
          <span className="mkt-order__party-m">Berlin · pays in EUR</span>
        </div>
        <span className="mkt-order__party-arrow" aria-hidden="true">
          <svg viewBox="0 0 24 16" width="24" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 8h19M16 3l5 5-5 5" />
          </svg>
        </span>
        <div className="mkt-order__party mkt-order__party--to">
          <span className="mkt-order__party-l">Seller</span>
          <span className="mkt-order__party-n">Kestrel Textiles Pty Ltd</span>
          <span className="mkt-order__party-m">Sydney · receives AUD</span>
        </div>
      </div>

      <div className="mkt-order__amount">
        <span className="mkt-order__amount-v">€48,200.00</span>
        <span className="mkt-order__amount-s">Seller receives A$79,530.00</span>
      </div>

      <div className="mkt-order__status" aria-live="polite">
        <span className={`mkt-order__status-dot${released ? ' is-released' : ''}`} aria-hidden="true" />
        {STAGES[stage].status}
      </div>

      <ol className="mkt-order__steps">
        {STAGES.map((s, i) => {
          const state = i < stage ? 'done' : i === stage ? 'active' : 'todo'
          return (
            <li key={s.label} className={`mkt-order__step is-${state}`}>
              <span className="mkt-order__step-mark" aria-hidden="true">
                {state === 'done' ? (
                  <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 6.5l2.6 2.5L10 3.5" />
                  </svg>
                ) : null}
              </span>
              <span className="mkt-order__step-l">{s.label}</span>
            </li>
          )
        })}
      </ol>

      <div className="mkt-order__foot">
        <span>Release rule</span>
        <span>On delivery confirmed</span>
      </div>
      <div className="mkt-order__foot">
        <span>Your fee</span>
        <span>€241.00 · collected in the flow</span>
      </div>
    </figure>
  )
}
