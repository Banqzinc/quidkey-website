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

function QkChrome({ payto = false, children }: { payto?: boolean; children: React.ReactNode }) {
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
      {payto && (
        <div className="qk__rails">
          <span>Pay by Bank with</span>
          <img src="/homepage/payto-logo.webp" alt="PayTo" width="43" height="18" />
        </div>
      )}
      {children}
      {payto && (
        <div className="qk__npp">
          Payments initiated by <strong>Quidkey</strong>, {DEMO_MERCHANT.name}&rsquo; payment partner.
          <br />
          PayID and PayTo are registered trade marks of NPP Australia Ltd.
        </div>
      )}
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
  footnote,
  onVerified,
}: {
  phone: string
  title: string
  blurb: string
  cta: string
  footnote?: string
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
        {footnote && <p className="qk__footnote">{footnote}</p>}
      </div>
    </>
  )
}

// ── AU: set up the PayTo agreement ───────────────────────────────────
//
// entry → (learn) → verify → code → waiting → notify. The last two are the
// handoff: in production the bank pushes a PayTo request and the shopper
// leaves for their banking app. Here the push banner drops in on its own and
// the demo follows it.

type PayToPhase = 'entry' | 'learn' | 'verify' | 'code' | 'waiting' | 'notify'

const PAYTO_STEPS = ['Add PayID details', 'Review in your bank', 'Confirm payment'] as const

// The waiting screen's authorisation window, live so the screen feels real.
function useCountdown(from: number, running: boolean) {
  const [remain, setRemain] = useState(from)
  useEffect(() => {
    if (!running) return
    const iv = setInterval(() => setRemain((r) => Math.max(0, r - 1)), 1000)
    return () => clearInterval(iv)
  }, [running])
  return remain
}

// The green tick on the pre-filled PayID: opens as a "✓ verified" pill, then
// collapses to just the tick after a beat — same as the prototype.
function VerifiedBadge() {
  const [expanded, setExpanded] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setExpanded(false), 2500)
    return () => clearTimeout(t)
  }, [])
  return (
    <span className={`qk__vbadge ${expanded ? 'is-open' : ''}`}>
      <span className="qk__vbadge-txt">verified</span>
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  )
}

// AU code beat: the prototype's single wide code box that fills digit by
// digit, with the resend countdown underneath and the CTA held disabled
// until the code is in.
function QkCode({
  phone,
  onVerified,
  onBack,
  onChange,
}: {
  phone: string
  onVerified: () => void
  onBack: () => void
  onChange: () => void
}) {
  const [code, setCode] = useState('')
  const resend = useCountdown(30, true)
  useEffect(() => {
    const start = setTimeout(() => {
      const iv = setInterval(() => {
        setCode((c) => {
          if (c.length >= OTP_CODE.length) {
            clearInterval(iv)
            return c
          }
          return OTP_CODE.slice(0, c.length + 1)
        })
      }, 120)
    }, 900)
    return () => clearTimeout(start)
  }, [])
  const ready = code.length === OTP_CODE.length
  const masked = maskPhone(phone)

  return (
    <>
      <div className="phone__screen qk__screen">
        <button type="button" className="qk__back" onClick={onBack}>
          <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M10 3l-5 5 5 5" />
          </svg>
          Back
        </button>
        <h2 className="qk__h">Verify your mobile number</h2>
        <p className="qk__p">
          Your PayTo® agreement will be tied to this number. You'll use it to pay in one tap next
          time, and to view or cancel the agreement.
        </p>
        <div className="qk__phone-row">
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="6" y="2" width="12" height="20" rx="3" />
            <path d="M11 18h2" />
          </svg>
          <span className="qk__phone-num num">{masked}</span>
          <button type="button" className="qk__change" onClick={onChange}>
            Change
          </button>
        </div>
        <div className="qk__lbl">Enter the 6-digit code</div>
        <div className={`qk__code num ${ready ? 'is-filled' : ''}`} aria-label="Six digit code">
          {code.padEnd(OTP_CODE.length, ' ').split('').map((ch, i) => (
            <span key={i} className={ch === ' ' ? 'qk__code-ph' : ''}>{ch === ' ' ? '0' : ch}</span>
          ))}
        </div>
        <div className="qk__code-note">
          <span>Code sent to {masked}</span>
          <span className="num">{resend > 0 ? `Resend in ${resend}s` : 'Resend'}</span>
        </div>
      </div>
      <div className="phone__action">
        <button type="button" className="phone__action-cta" disabled={!ready} onClick={onVerified}>
          <span>Verify and send to my bank</span>
        </button>
        <p className="qk__footnote">
          Nothing is sent to your bank and no money moves until your number is verified.
        </p>
      </div>
    </>
  )
}

export function QkPayToScreen({
  locale,
  activeBank,
  onDone,
  onCancel,
}: {
  locale: DemoLocale
  activeBank: Bank
  onDone: () => void
  onCancel: () => void
}) {
  const [phase, setPhase] = useState<PayToPhase>('entry')
  const [idKind, setIdKind] = useState<'payid' | 'bsb'>('payid')
  const windowLeft = useCountdown(30 * 60, phase === 'waiting' || phase === 'notify')
  const clock = `${Math.floor(windowLeft / 60)}:${String(windowLeft % 60).padStart(2, '0')}`

  // waiting: after a beat the bank's push notification lands (notify), then
  // the shopper "follows" it into the banking app.
  const done = useLatest(onDone)
  useEffect(() => {
    if (phase === 'waiting') {
      const t = setTimeout(() => setPhase('notify'), 1000)
      return () => clearTimeout(t)
    }
    if (phase === 'notify') {
      const t = setTimeout(() => done.current(), 2000)
      return () => clearTimeout(t)
    }
  }, [phase, done])

  if (phase === 'learn') {
    return (
      <QkChrome payto>
        <div className="phone__screen qk__screen">
          <h2 className="qk__h">How PayTo® works</h2>
          <p className="qk__p">Set up a PayTo agreement using your PayID, or BSB and account number.</p>
          <p className="qk__p">
            You'll need to authorise your PayTo agreement in your banking app before any money comes
            out of your account.
          </p>
          <p className="qk__p">
            Quidkey, {DEMO_MERCHANT.name}&rsquo; payment partner, initiates the request. We never
            see or store your banking login.
          </p>
        </div>
        <div className="phone__action">
          <button type="button" className="phone__action-cta" onClick={() => setPhase('entry')}>
            <span>Back to payment</span>
          </button>
        </div>
      </QkChrome>
    )
  }

  if (phase === 'verify') {
    return (
      <QkChrome payto>
        <div className="phone__screen qk__screen">
          <button type="button" className="qk__back" onClick={() => setPhase('entry')}>
            <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M10 3l-5 5 5 5" />
            </svg>
            Back
          </button>
          <h2 className="qk__h">Verify your mobile number</h2>
          <p className="qk__p">
            Your PayTo® agreement will be tied to this number. You'll use it to pay in one tap next
            time, and to view or cancel the agreement.
          </p>
          <div className="qk__phone-row">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="6" y="2" width="12" height="20" rx="3" />
              <path d="M11 18h2" />
            </svg>
            <span className="qk__phone-num num">{locale.phone}</span>
            <button type="button" className="qk__change" onClick={() => setPhase('entry')}>
              Change
            </button>
          </div>
        </div>
        <div className="phone__action">
          <button type="button" className="phone__action-cta" onClick={() => setPhase('code')}>
            <span>Send verification code</span>
          </button>
          <p className="qk__footnote">
            Nothing is sent to your bank and no money moves until your number is verified.
          </p>
        </div>
      </QkChrome>
    )
  }

  if (phase === 'code') {
    return (
      <QkChrome payto>
        <QkCode
          phone={locale.phone}
          onVerified={() => setPhase('waiting')}
          onBack={() => setPhase('verify')}
          onChange={() => setPhase('verify')}
        />
      </QkChrome>
    )
  }

  if (phase === 'waiting' || phase === 'notify') {
    return (
      <QkChrome payto>
        {phase === 'notify' && (
          <div className="qk__banner" role="status">
            <span className="qk__banner-icon">
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
            <span className="qk__banner-body">
              <span className="qk__banner-head">
                <span className="qk__banner-app">{activeBank.name}</span>
                <span className="qk__banner-time">now</span>
              </span>
              <span className="qk__banner-title">PayTo request</span>
              <span className="qk__banner-text">
                Quidkey has sent you a PayTo request to authorise. Tap to review.
              </span>
            </span>
          </div>
        )}
        <div className="phone__screen qk__screen qk__screen--center">
          <h2 className="qk__h">Authorise your PayTo® agreement to complete the payment</h2>
          <div className="qk__timer-wrap">
            <p className="qk__timer-note">You have 30 minutes to authorise</p>
            <div className="qk__timer">
              <span className="qk__timer-dot" aria-hidden="true" />
              <span className="num">{clock}</span> remaining
            </div>
          </div>
          <ol className="qk__steps-list">
            <li>Log in to your banking app</li>
            <li>Review and authorise your PayTo agreement</li>
            <li>Return here and the payment completes automatically</li>
          </ol>
          <span className="qk__help">Not sure where to find PayTo in your app? Find out how</span>
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
          <button type="button" className="qk__linkbtn" onClick={() => setPhase('entry')}>
            Cancel and use another method
          </button>
        </div>
      </QkChrome>
    )
  }

  return (
    <QkChrome payto>
      <div className="phone__screen qk__screen">
        <h2 className="qk__h">Pay directly from your bank</h2>
        <button type="button" className="qk__learn" onClick={() => setPhase('learn')}>
          How PayTo® works ›
        </button>

        <ol className="qk__steps">
          {PAYTO_STEPS.map((label, i) => (
            <li key={label} className={`qk__step ${i === 0 ? 'is-on' : ''}`}>
              <span className="qk__step-n num">{i + 1}</span>
              <span className="qk__step-l">{label}</span>
            </li>
          ))}
        </ol>

        <div className="qk__lbl">Identify your account with</div>
        <div className="qk__idkind">
          <button
            type="button"
            className={`qk__idkind-opt ${idKind === 'payid' ? 'is-on' : ''}`}
            aria-pressed={idKind === 'payid'}
            onClick={() => setIdKind('payid')}
          >
            <span className="qk__idkind-t">
              PayID<sup>®</sup>
            </span>
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
          <>
            <div className="qk__lbl qk__lbl--field">PayID type</div>
            <div className="qk__select-fake" aria-hidden="true">
              <span>Mobile number</span>
              <svg viewBox="0 0 12 8" width="12" height="8" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M1 1l5 5 5-5" />
              </svg>
            </div>
            <div className="qk__input">
              <span className="num">{locale.phone}</span>
              <VerifiedBadge />
            </div>
          </>
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
        <p className="qk__terms">
          By selecting &ldquo;Send request to my bank&rdquo;, I authorise a PayTo agreement to be set
          up on my account and this payment to be debited. I agree to the{' '}
          <span className="qk__terms-link">PayTo terms</span>.
        </p>
        <button type="button" className="qk__linkbtn" onClick={onCancel}>
          Cancel and return to {DEMO_MERCHANT.name}
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
