// The Quidkey-hosted steps — the part of the flow that runs on
// pay.quidkey.com rather than on the merchant's site or in the bank's app.
//
// Which of these appear depends on the market (see demo-flows.ts):
//   AU  QkPayToScreen   sets up the PayTo agreement before the bank app.
//   US  QkVerifyScreen  proves the mobile before handing off to the bank,
//       QkAccountsScreen picks the funding account once the bank returns.
//   UK/EU  none — the bank does the SCA itself under Open Banking.
//
// Every field is pre-filled and the SMS code auto-fills: this is a demo, so the
// visitor should be able to walk the whole flow by tapping the primary button.

import { useEffect, useRef, useState } from 'react'

import { DEMO_MERCHANT } from '@/components/homepage/demo-merchant'
import { bankLogoUrl, type Bank, type DemoLocale } from '@/components/homepage/demo-locales'
import { UrlBar } from '@/components/homepage/demo/shared'

const OTP_CODE = '481920'

// The container passes a fresh arrow every render; depending on it inside an
// effect would restart the timer each render and never fire. Read it through a
// ref so the effects can depend only on the phase.
function useLatest<T>(value: T) {
  const ref = useRef(value)
  ref.current = value
  return ref
}

// Mask all but the last few digits, keeping the local formatting recognisable.
function maskPhone(phone: string): string {
  const tail = phone.replace(/\D/g, '').slice(-3)
  return `${phone.slice(0, 3)}•• ••• ${tail}`
}

function QkChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UrlBar host="pay.quidkey.com" path="/checkout" />
      <div className="qk__bar">
        <img className="qk__bar-logo" src="/quidkey-logo.svg" alt="Quidkey" width="76" height="18" />
        <span className="qk__bar-secure">
          <svg viewBox="0 0 12 14" width="11" height="12" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="2" y="6" width="8" height="7" rx="1" />
            <path d="M4 6V4a2 2 0 014 0v2" />
          </svg>
          Secure
        </span>
      </div>
      {children}
    </>
  )
}

// Shared six-digit code step. The code arrives on its own after a beat so the
// visitor never has to type — they just confirm.
function QkOtp({
  phone,
  title,
  blurb,
  cta,
  onVerified,
}: {
  phone: string
  title: string
  blurb: string
  cta: string
  onVerified: () => void
}) {
  const [code, setCode] = useState('')
  const filled = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    filled.current = setTimeout(() => setCode(OTP_CODE), 900)
    return () => {
      if (filled.current) clearTimeout(filled.current)
    }
  }, [])

  const ready = code.length === OTP_CODE.length

  return (
    <>
      <div className="phone__screen qk__screen">
        <h2 className="qk__h">{title}</h2>
        <p className="qk__p">{blurb}</p>

        <div className="qk__phone-row">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="6" y="2" width="12" height="20" rx="3" />
            <path d="M11 18h2" />
          </svg>
          <span className="qk__phone-num num">{maskPhone(phone)}</span>
        </div>

        <div className="qk__otp" aria-label="Six digit code">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className={`qk__otp-cell num ${code[i] ? 'is-filled' : ''}`}>
              {code[i] ?? ''}
            </span>
          ))}
        </div>
        <div className="qk__otp-note">{ready ? 'Code detected automatically' : 'Waiting for your code…'}</div>
      </div>
      <div className="phone__action">
        <button type="button" className="phone__action-cta" disabled={!ready} onClick={onVerified}>
          <span>{cta}</span>
        </button>
      </div>
    </>
  )
}

// ── AU: set up the PayTo agreement ───────────────────────────────────

type PayToPhase = 'entry' | 'verify' | 'waiting'

const PAYTO_STEPS = ['Add PayID details', 'Review in your bank', 'Confirm payment'] as const

export function QkPayToScreen({ locale, onDone }: { locale: DemoLocale; onDone: () => void }) {
  const [phase, setPhase] = useState<PayToPhase>('entry')
  const [idKind, setIdKind] = useState<'payid' | 'bsb'>('payid')

  // The waiting screen is the handoff: in production the bank pushes a PayTo
  // request and the shopper leaves for their banking app. Here the demo does
  // that for them after a beat.
  const done = useLatest(onDone)
  useEffect(() => {
    if (phase !== 'waiting') return
    const t = setTimeout(() => done.current(), 2600)
    return () => clearTimeout(t)
  }, [phase, done])

  if (phase === 'verify') {
    return (
      <QkChrome>
        <QkOtp
          phone={locale.phone}
          title="Verify your mobile number"
          blurb="Your PayTo agreement is tied to this number. You'll use it to pay in one tap next time, and to view or cancel the agreement."
          cta="Verify and continue"
          onVerified={() => setPhase('waiting')}
        />
      </QkChrome>
    )
  }

  if (phase === 'waiting') {
    return (
      <QkChrome>
        <div className="phone__screen qk__screen qk__screen--center">
          <h2 className="qk__h">Authorise your PayTo agreement to complete the payment</h2>
          <div className="qk__timer">
            <span className="qk__timer-dot" aria-hidden="true" />
            <span className="num">29:58</span> remaining
          </div>
          <ol className="qk__steps-list">
            <li>Log in to your banking app</li>
            <li>Review and authorise your PayTo agreement</li>
            <li>Return here and the payment completes automatically</li>
          </ol>
          <div className="qk__push">
            <div className="qk__push-head">
              <span className="qk__push-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 21h18" />
                  <path d="M5 21V9l7-5 7 5v12" />
                </svg>
              </span>
              <span className="qk__push-app">Your bank</span>
              <span className="qk__push-time">now</span>
            </div>
            <div className="qk__push-body">Quidkey has sent you a PayTo request to authorise</div>
            <div className="qk__push-foot">Appears from Quidkey, {DEMO_MERCHANT.name}'s payment partner.</div>
          </div>
          <div className="qk__waiting">
            <span className="bnk__spinner" aria-hidden="true" />
            <span>Waiting for your authorisation…</span>
          </div>
        </div>
      </QkChrome>
    )
  }

  return (
    <QkChrome>
      <div className="phone__screen qk__screen">
        <h2 className="qk__h">Pay directly from your bank</h2>

        <ol className="qk__steps">
          {PAYTO_STEPS.map((label, i) => (
            <li key={label} className={`qk__step ${i === 0 ? 'is-on' : ''}`}>
              <span className="qk__step-n num">{i + 1}</span>
              <span className="qk__step-l">{label}</span>
            </li>
          ))}
        </ol>

        <div className="qk__sec-h">Identify your account with</div>
        <div className="qk__idkind">
          <button
            type="button"
            className={`qk__idkind-opt ${idKind === 'payid' ? 'is-on' : ''}`}
            aria-pressed={idKind === 'payid'}
            onClick={() => setIdKind('payid')}
          >
            <span className="qk__idkind-t">PayID</span>
            <span className="qk__idkind-s">Mobile, email or ABN</span>
          </button>
          <button
            type="button"
            className={`qk__idkind-opt ${idKind === 'bsb' ? 'is-on' : ''}`}
            aria-pressed={idKind === 'bsb'}
            onClick={() => setIdKind('bsb')}
          >
            <span className="qk__idkind-t">BSB &amp; account</span>
            <span className="qk__idkind-s">Bank account details</span>
          </button>
        </div>

        {idKind === 'payid' ? (
          <div className="qk__field">
            <span className="qk__field-lbl">Mobile number</span>
            <span className="qk__field-val num">{locale.phone}</span>
            <span className="qk__field-ok">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              verified
            </span>
          </div>
        ) : (
          <div className="qk__field-pair">
            <div className="qk__field">
              <span className="qk__field-lbl">BSB</span>
              <span className="qk__field-val num">123-456</span>
            </div>
            <div className="qk__field">
              <span className="qk__field-lbl">Account number</span>
              <span className="qk__field-val num">1234 5678</span>
            </div>
          </div>
        )}

        <div className="qk__total">
          <span className="qk__total-amt num">{locale.price}</span>
          <span className="qk__total-to">to {DEMO_MERCHANT.name}</span>
        </div>
        <p className="qk__terms">
          By continuing you authorise a PayTo agreement on your account and this payment to be debited.
        </p>
      </div>
      <div className="phone__action">
        <button
          type="button"
          data-hint-id="qk-payto"
          className="phone__action-cta"
          onClick={() => setPhase('verify')}
        >
          <span>Send request to my bank</span>
        </button>
      </div>
    </QkChrome>
  )
}

// ── US: verify the mobile before the bank redirect ───────────────────

export function QkVerifyScreen({
  locale,
  activeBank,
  onDone,
}: {
  locale: DemoLocale
  activeBank: Bank
  onDone: () => void
}) {
  const [sent, setSent] = useState(false)

  if (sent) {
    return (
      <QkChrome>
        <QkOtp
          phone={locale.phone}
          title="Verify your mobile number"
          blurb={`We texted you a 6-digit code. Once it's confirmed we'll hand you to ${activeBank.name} to approve the payment.`}
          cta={`Continue to ${activeBank.name}`}
          onVerified={onDone}
        />
      </QkChrome>
    )
  }

  return (
    <QkChrome>
      <div className="phone__screen qk__screen">
        <div className="qk__parties">
          <span className="qk__parties-lbl">Connecting to</span>
          <img
            className="qk__parties-bank"
            src={bankLogoUrl(activeBank.domain)}
            alt=""
            width="24"
            height="24"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
          <span className="qk__parties-name">{activeBank.name}</span>
        </div>

        <h2 className="qk__h">Pay {DEMO_MERCHANT.name} from your bank</h2>
        <p className="qk__p">
          Quidkey processes this payment. You'll approve it in your {activeBank.name} app — your bank
          details are never shared with {DEMO_MERCHANT.name}.
        </p>

        <div className="qk__sec-h">Verify your mobile number</div>
        <div className="qk__field">
          <span className="qk__field-lbl">Mobile number</span>
          <span className="qk__field-val num">{locale.phone}</span>
        </div>
        <p className="qk__terms">We'll text you a 6-digit code to confirm it's you.</p>

        <div className="qk__total">
          <span className="qk__total-amt num">{locale.price}</span>
          <span className="qk__total-to">to {DEMO_MERCHANT.name}</span>
        </div>
      </div>
      <div className="phone__action">
        <button type="button" data-hint-id="qk-verify" className="phone__action-cta" onClick={() => setSent(true)}>
          <span>Text me a code</span>
        </button>
      </div>
    </QkChrome>
  )
}

// ── US: choose the connected account to pay from ─────────────────────

export function QkAccountsScreen({
  locale,
  activeBank,
  onDone,
}: {
  locale: DemoLocale
  activeBank: Bank
  onDone: () => void
}) {
  const accounts = locale.accounts ?? []
  const [pickedIdx, setPickedIdx] = useState(0)
  const [paying, setPaying] = useState(false)

  const done = useLatest(onDone)
  useEffect(() => {
    if (!paying) return
    const t = setTimeout(() => done.current(), 1200)
    return () => clearTimeout(t)
  }, [paying, done])

  if (paying) {
    return (
      <QkChrome>
        <div className="phone__screen qk__screen qk__screen--center">
          <span className="bnk__spinner" aria-hidden="true" />
          <div className="qk__paying">
            Paying {locale.price} to {DEMO_MERCHANT.name}…
          </div>
          <div className="qk__p">Debiting your {activeBank.name} account.</div>
        </div>
      </QkChrome>
    )
  }

  const picked = accounts[pickedIdx] ?? accounts[0]

  return (
    <QkChrome>
      <div className="phone__screen qk__screen">
        <h2 className="qk__h">Choose an account</h2>
        <p className="qk__p">You connected these at {activeBank.name}. Pick the one to pay from.</p>

        <div className="qk__accts" role="radiogroup" aria-label="Account to pay from">
          {accounts.map((a, i) => (
            <button
              type="button"
              key={a.id}
              role="radio"
              aria-checked={i === pickedIdx}
              className={`qk__acct ${i === pickedIdx ? 'is-on' : ''}`}
              onClick={() => setPickedIdx(i)}
            >
              <span className="qk__acct-logo">
                <img
                  src={bankLogoUrl(activeBank.domain)}
                  alt=""
                  width="22"
                  height="22"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </span>
              <span className="qk__acct-info">
                <span className="qk__acct-name">
                  {activeBank.name} {a.name}
                </span>
                <span className="qk__acct-sub num">{a.sub}</span>
              </span>
              <span className={`bnk__radio ${i === pickedIdx ? 'is-on' : ''}`}>
                <span />
              </span>
            </button>
          ))}
        </div>

        <p className="qk__terms">
          By paying you authorise {DEMO_MERCHANT.name} to debit the account ending {picked?.sub ?? ''}.
        </p>
      </div>
      <div className="phone__action">
        <button
          type="button"
          data-hint-id="qk-accounts"
          className="phone__action-cta"
          onClick={() => setPaying(true)}
        >
          <span>Pay {locale.price}</span>
        </button>
      </div>
    </QkChrome>
  )
}
