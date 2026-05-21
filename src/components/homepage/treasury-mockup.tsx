// Treasury product mockup — Quidkey's own take on a multi-currency dashboard.
// Maps to /tmp/quidkey-design/quidkey-new-homepage/project/v-draft-7/treasury-mockup.jsx.
//
// Layout (single-viewport):
//   ── Title row: "Balances £X,XXX,XXX" + action chips + view toggle
//   ── Account cards: GBP Receiving · USD Receiving · USD Tax · EUR Receiving
//      (USD Tax card highlighted with an "Auto-reserve" indicator)
//   ── Bottom row: Recent activity (wide) + Workflow rule (narrow)
//
// Lazy-imported by sections/products.tsx; fires homepage_treasury_view once
// per session when this component mounts.

import { useEffect, useState, type ReactElement } from 'react'

import { track } from '@/lib/track'

const TmIcon = {
  transfer: (
    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 5h9l-2.5-2.5M13 11H4l2.5 2.5" />
    </svg>
  ),
  send: (
    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2L7 9M14 2l-4.5 12L7 9 2 6.5 14 2z" />
    </svg>
  ),
  convert: (
    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="5.5" />
      <path d="M3 8h10M8 2.5c1.5 1.6 2.3 3.5 2.3 5.5S9.5 12.4 8 14M8 2.5C6.5 4.1 5.7 6 5.7 8S6.5 12.4 8 14" />
    </svg>
  ),
  deposit: (
    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 13h11M8 2v8M4.5 6.5L8 10l3.5-3.5" />
    </svg>
  ),
  arrowDown: (
    <svg viewBox="0 0 16 16" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3v10M3.5 8.5L8 13l4.5-4.5" />
    </svg>
  ),
  arrowUp: (
    <svg viewBox="0 0 16 16" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 13V3M3.5 7.5L8 3l4.5 4.5" />
    </svg>
  ),
  swap: (
    <svg viewBox="0 0 16 16" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h9.5L10 3.5M13 10H3.5L6 12.5" />
    </svg>
  ),
  routing: (
    <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="3.5" cy="3.5" r="1.5" />
      <circle cx="12.5" cy="12.5" r="1.5" />
      <path d="M3.5 5v3a3 3 0 0 0 3 3H11" />
    </svg>
  ),
  viewGrid: (
    <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
      <rect x="2.5" y="2.5" width="4.5" height="4.5" rx="0.8" />
      <rect x="9" y="2.5" width="4.5" height="4.5" rx="0.8" />
      <rect x="2.5" y="9" width="4.5" height="4.5" rx="0.8" />
      <rect x="9" y="9" width="4.5" height="4.5" rx="0.8" />
    </svg>
  ),
  viewList: (
    <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
      <rect x="2" y="3.5" width="12" height="2" rx="0.6" />
      <rect x="2" y="7" width="12" height="2" rx="0.6" />
      <rect x="2" y="10.5" width="12" height="2" rx="0.6" />
    </svg>
  ),
}

function TmCurrencyGlyph({ ccy }: { ccy: string }) {
  const sym: Record<string, string> = { GBP: '£', EUR: '€', USD: '$', AUD: 'A$' }
  return (
    <div className="tm2-cglyph">
      <span>{sym[ccy] ?? ccy}</span>
    </div>
  )
}

function TmAction({ icon, label }: { icon: ReactElement; label: string }) {
  return (
    <button type="button" className="tm2-act">
      <span className="tm2-act__icon">{icon}</span>
      <span className="tm2-act__lbl">{label}</span>
    </button>
  )
}

type Account = {
  ccy: string
  sym: string
  amt: string
  label: string
  accent: boolean
  tag?: string
}

const ACCOUNTS: Account[] = [
  { ccy: 'GBP', sym: '£', amt: '142,308.45', label: 'UK receiving account', accent: false },
  { ccy: 'USD', sym: '$', amt: '198,440.12', label: 'US receiving account', accent: false },
  {
    ccy: 'USD',
    sym: '$',
    amt: '64,118.07',
    label: 'US tax account',
    accent: true,
    tag: 'Auto-reserve · product, city & state',
  },
  { ccy: 'EUR', sym: '€', amt: '86,402.91', label: 'EU receiving account', accent: false },
]

function TmAccountCard({ a }: { a: Account }) {
  return (
    <div className={`tm2-acct ${a.accent ? 'tm2-acct--accent' : ''}`}>
      <div className="tm2-acct__top">
        <TmCurrencyGlyph ccy={a.ccy} />
        <span className="tm2-acct__ccy">{a.ccy}</span>
      </div>
      <div className="tm2-acct__amt">
        <span className="tm2-acct__sym">{a.sym}</span>
        {a.amt}
      </div>
      <div className="tm2-acct__lbl">{a.label}</div>
      {a.accent && a.tag && (
        <div className="tm2-acct__route">
          <span className="tm2-acct__route-icon">{TmIcon.routing}</span>
          <span>{a.tag}</span>
        </div>
      )}
    </div>
  )
}

type ActivityRow = {
  amt: string
  dir: 'in' | 'out' | 'tax' | 'fx'
  type: string
  from: string
  to: string
  date: string
}

const ACTIVITY: ActivityRow[] = [
  { amt: '+£12,480.00', dir: 'in', type: 'Payment', from: 'Shopify · order #41928', to: 'GBP · Receiving', date: '7 May' },
  { amt: '−$1,632.18', dir: 'tax', type: 'Reserve', from: 'USD · Receiving', to: 'USD · Tax', date: '7 May' },
  { amt: '−€4,210.00', dir: 'out', type: 'Payout', from: 'EUR · Receiving', to: 'Acme Studios', date: '7 May' },
  { amt: '+$8,920.50', dir: 'in', type: 'Payment', from: 'Stripe · batch 22-04', to: 'USD · Receiving', date: '6 May' },
  { amt: '−£2,150.00', dir: 'fx', type: 'Convert', from: 'GBP · Receiving', to: 'EUR · Receiving', date: '6 May' },
]

function dirIcon(dir: ActivityRow['dir']) {
  if (dir === 'in') return TmIcon.arrowDown
  if (dir === 'out') return TmIcon.arrowUp
  if (dir === 'fx') return TmIcon.swap
  return TmIcon.routing
}

function TmActivity() {
  const [tab, setTab] = useState<'all' | 'pay' | 'route'>('all')
  return (
    <div className="tm2-activity">
      <div className="tm2-activity__head">
        <div className="tm2-activity__title">Recent activity</div>
        <div className="tm2-tabs">
          <button type="button" className={`tm2-tab ${tab === 'all' ? 'is-on' : ''}`} onClick={() => setTab('all')}>
            All
          </button>
          <button type="button" className={`tm2-tab ${tab === 'pay' ? 'is-on' : ''}`} onClick={() => setTab('pay')}>
            Payments
          </button>
          <button type="button" className={`tm2-tab ${tab === 'route' ? 'is-on' : ''}`} onClick={() => setTab('route')}>
            Routing
          </button>
        </div>
      </div>
      <table className="tm2-table">
        <thead>
          <tr>
            <th className="tm2-th--amt">Amount</th>
            <th>Type</th>
            <th>From</th>
            <th>To</th>
            <th className="tm2-th--date">Date</th>
          </tr>
        </thead>
        <tbody>
          {ACTIVITY.map((r, i) => (
            <tr key={i}>
              <td className={`tm2-td--amt tm2-amt--${r.dir}`}>
                <span className="tm2-td--amt-inner">
                  <span className={`tm2-dot tm2-dot--${r.dir}`}>{dirIcon(r.dir)}</span>
                  {r.amt}
                </span>
              </td>
              <td className="tm2-td--type" data-from={r.from} data-to={r.to}>
                {r.type}
              </td>
              <td className="tm2-td--from">{r.from}</td>
              <td className="tm2-td--to">{r.to}</td>
              <td className="tm2-td--date">{r.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const RULE_STEPS = [
  { k: 'reserve', label: 'Reserve tax', meta: 'by product · city · state' },
  { k: 'fx', label: 'Convert to GBP', meta: 'USD → GBP · 0.7912' },
  { k: 'split', label: 'Split supplier cost', meta: '60% · supplier share' },
  { k: 'pay', label: 'Pay supplier', meta: 'GZBT Co Ltd · CNY' },
  { k: 'payout', label: 'Payout', meta: 'T+0 · Faster Payments' },
] as const

const TmCheckIcon = (
  <svg viewBox="0 0 16 16" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 8.5L6.5 12L13 4.5" />
  </svg>
)

function TmRule() {
  const [active, setActive] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setActive((s) => (s + 1) % (RULE_STEPS.length + 2)), 1100)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="tm2-rule">
      <div className="tm2-rule__head">
        <div className="tm2-rule__title">Workflows</div>
        <span className="tm2-rule__chip">on</span>
      </div>
      <div className="tm2-rule__trigger">
        <span className="tm2-rule__when">When</span>
        <span className="tm2-rule__cond">USD payment lands</span>
        <span className="tm2-rule__caret" aria-hidden="true">
          ▾
        </span>
      </div>
      <ol className="tm2-rule__steps">
        {RULE_STEPS.map((s, i) => {
          const done = i < active
          const isActive = i === active
          return (
            <li key={s.k} className={`tm2-rule__step ${done ? 'is-done' : ''} ${isActive ? 'is-active' : ''}`}>
              <span className="tm2-rule__bullet">
                {done ? TmCheckIcon : <span className="tm2-rule__num">{i + 1}</span>}
              </span>
              <span className="tm2-rule__lbl">{s.label}</span>
              <span className="tm2-rule__meta">{s.meta}</span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

type TreasuryViewEvent = 'homepage_treasury_view' | 'partners_treasury_view'

export default function TreasuryMockup({
  eventName = 'homepage_treasury_view',
}: { eventName?: TreasuryViewEvent } = {}) {
  useEffect(() => {
    track({ name: eventName })
  }, [eventName])

  const total = '£491,269.55'
  return (
    <div className="tm2">
      <div className="tm2__chrome">
        <div className="tm2__chrome-l">
          <span className="tm2__chrome-dot" />
          <span className="tm2__chrome-dot" />
          <span className="tm2__chrome-dot" />
        </div>
        <div className="tm2__chrome-path">treasury · acme studios</div>
        <div className="tm2__chrome-r">
          <span className="tm2__chrome-pill">
            <span className="tm2__chrome-pill-dot" />
            connected
          </span>
        </div>
      </div>

      <div className="tm2__body">
        <div className="tm2__title-row">
          <div className="tm2__title">
            <span className="tm2__title-lbl">Balances</span>
            <span className="tm2__title-amt">{total}</span>
          </div>
          <div className="tm2__actions">
            <TmAction icon={TmIcon.transfer} label="Transfer" />
            <TmAction icon={TmIcon.send} label="Send" />
            <TmAction icon={TmIcon.convert} label="Convert" />
            <TmAction icon={TmIcon.deposit} label="Deposit" />
          </div>
          <div className="tm2__view">
            <button type="button" className="tm2-view tm2-view--on" aria-label="Grid view">
              {TmIcon.viewGrid}
            </button>
            <button type="button" className="tm2-view" aria-label="List view">
              {TmIcon.viewList}
            </button>
          </div>
        </div>

        <div className="tm2__accts">
          {ACCOUNTS.map((a, i) => (
            <TmAccountCard key={i} a={a} />
          ))}
        </div>

        <div className="tm2__bottom">
          <TmActivity />
          <TmRule />
        </div>
      </div>
    </div>
  )
}
