// Mini-viz components used inside Products section cards. Each is an animated
// visualization. Maps to the prototype's CheckoutMini / TreasuryMini /
// OnboardMini / AccountsMini at app.jsx:2562-2707.

import { useEffect, useState } from 'react'

const LOGO_DEV_TOKEN = 'pk_DsNHFndhT3yo-85c5vdKKg'

const BANKS = [
  { name: 'Chase', domain: 'chase.com' },
  { name: 'Bank of America', domain: 'bankofamerica.com' },
  { name: 'Wells Fargo', domain: 'wellsfargo.com' },
  { name: 'Citi', domain: 'citi.com' },
  { name: 'Capital One', domain: 'capitalone.com' },
  { name: 'U.S. Bank', domain: 'usbank.com' },
]

export function CheckoutMini() {
  const [i, setI] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const t = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setI((v) => (v + 1) % BANKS.length)
        setFading(false)
      }, 220)
    }, 2400)
    return () => clearInterval(t)
  }, [])

  const bank = BANKS[i]
  return (
    <div className="cv">
      <div className="cv__total">
        <span className="cv__total-l">Total</span>
        <span className="cv__total-v num">$149.00</span>
      </div>
      <div className="cv__opt cv__opt--active">
        <div className="cv__logo">
          <img
            src={`https://img.logo.dev/${bank.domain}?token=${LOGO_DEV_TOKEN}`}
            alt={`${bank.name} logo`}
            className={fading ? 'is-fading' : ''}
          />
        </div>
        <span className={`cv__lbl ${fading ? 'is-fading' : ''}`}>Pay with {bank.name}</span>
        <span className="cv__check">✓</span>
      </div>
      <div className="cv__opt cv__opt--dim">
        <div className="cv__logo" style={{ background: 'var(--bg-mute)' }}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="2.5" y="5.5" width="19" height="13" rx="2" />
            <line x1="2.5" y1="10" x2="21.5" y2="10" />
          </svg>
        </div>
        <span className="cv__lbl">Credit card</span>
      </div>
      <div className="cv__opt cv__opt--dim">
        <div className="cv__logo" style={{ background: 'var(--bg-mute)' }}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M17.05 12.04c-.03-2.6 2.12-3.84 2.22-3.9-1.21-1.77-3.1-2.01-3.77-2.04-1.6-.16-3.13.94-3.94.94-.82 0-2.08-.92-3.42-.89-1.76.03-3.39 1.03-4.3 2.6-1.83 3.18-.47 7.88 1.32 10.47.87 1.26 1.91 2.68 3.27 2.63 1.31-.05 1.81-.85 3.4-.85 1.58 0 2.03.85 3.42.82 1.41-.02 2.31-1.28 3.18-2.55 1-1.46 1.42-2.88 1.44-2.95-.03-.01-2.76-1.06-2.79-4.2zM14.5 4.5c.72-.87 1.21-2.08 1.08-3.29-1.04.04-2.31.69-3.05 1.56-.67.77-1.25 2-1.1 3.18 1.16.09 2.34-.59 3.07-1.45z" />
          </svg>
        </div>
        <span className="cv__lbl">Apple Pay</span>
      </div>
    </div>
  )
}

export function TreasuryMini() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % 6), 1400)
    return () => clearInterval(t)
  }, [])

  const events = [
    { ts: '14:02:00.112', msg: 'rule matched · ca-8.25', amt: '-' },
    { ts: '14:02:00.118', msg: 'split · tax T-01', amt: '−$103.04' },
    { ts: '14:02:00.121', msg: 'fx · usd → eur · 0.9124', amt: '€1,045.64' },
    { ts: '14:02:00.124', msg: 'payout · operating', amt: '+$1,145.96' },
    { ts: '14:02:00.127', msg: 'journal #4821 · sealed', amt: 'cleared', ok: true },
  ]

  return (
    <div className="tv">
      <div className="tv__head">
        <div className="tv__head-l">
          <span className="tv__head-dot" />
          <span>workflow · order.paid</span>
        </div>
        <span>#N-55410</span>
      </div>
      <div className="tv__rule">
        <i>if</i> <b>state == "CA"</b> <i>then</i> split <b>8.25%</b> → tax
      </div>
      <div className="tv__events">
        {events.map((e, i) => (
          <div key={i} className={`tv__ev ${step >= i ? 'is-on' : ''}`}>
            <span className="tv__ev-ts">{e.ts}</span>
            <span className="tv__ev-msg">{e.msg}</span>
            <span className={`tv__ev-amt ${e.ok ? 'tv__ev-amt--ok' : ''}`}>{e.amt}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function OnboardMini() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % 5), 1100)
    return () => clearInterval(t)
  }, [])

  const events = [
    { ts: '09:14:02', msg: 'POST /v1/merchants', amt: '201' },
    { ts: '09:14:04', msg: 'kyb.documents.uploaded', amt: '4 docs' },
    { ts: '09:14:21', msg: 'kyb.review · auto-approved', amt: 'pass', ok: true },
    { ts: '09:14:23', msg: 'accounts.opened · USD, EUR', amt: '2', ok: true },
    { ts: '09:14:25', msg: 'webhook.merchant.live', amt: 'sent', ok: true },
  ]

  return (
    <div className="tv">
      <div className="tv__head">
        <div className="tv__head-l">
          <span className="tv__head-dot" />
          <span>onboarding · mch_8af2</span>
        </div>
        <span>23s elapsed</span>
      </div>
      <div className="tv__rule">
        <i>POST</i> <b>/v1/merchants</b> · region <b>EU</b> · auto-kyb <b>on</b>
      </div>
      <div className="tv__events">
        {events.map((e, i) => (
          <div key={i} className={`tv__ev ${step >= i ? 'is-on' : ''}`}>
            <span className="tv__ev-ts">{e.ts}</span>
            <span className="tv__ev-msg">{e.msg}</span>
            <span className={`tv__ev-amt ${e.ok ? 'tv__ev-amt--ok' : ''}`}>{e.amt}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const REGIONS = [
  { code: 'US', name: 'United States', currencies: ['USD'] },
  { code: 'UK', name: 'United Kingdom', currencies: ['GBP', 'EUR'] },
  { code: 'EU', name: 'European Union', currencies: ['EUR'] },
  { code: 'AU', name: 'Australia', currencies: ['AUD'] },
  { code: 'SG', name: 'Singapore', currencies: ['SGD', 'USD'] },
  { code: 'CA', name: 'Canada', currencies: ['CAD'] },
]

export function AccountsMini() {
  return (
    <div className="acc">
      <div className="acc__head">
        <span>Receiving accounts</span>
        <span className="num">142 open</span>
      </div>
      <div className="acc__list">
        {REGIONS.map((r) => (
          <div key={r.code} className="acc__row">
            <span className="acc__flag">{r.code}</span>
            <div className="acc__name">{r.name}</div>
            <div className="acc__ccy">
              {r.currencies.map((c) => (
                <span key={c} className="acc__ccy-pill">
                  {c}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function VizFor({ kind }: { kind: 'checkout' | 'treasury' | 'accounts' | 'onboard' }) {
  if (kind === 'checkout') return <CheckoutMini />
  if (kind === 'treasury') return <TreasuryMini />
  if (kind === 'accounts') return <AccountsMini />
  if (kind === 'onboard') return <OnboardMini />
  return null
}
