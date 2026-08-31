// The bank's own surfaces during the handoff: the redirect splash, the app
// launch, the login + Face ID sheet, the authorise screen, and the two
// screens that bridge back to the merchant.
//
// The authorise screen is where the markets diverge — AU reviews and approves
// a standing PayTo agreement (PayToAgreementScreen), everywhere else picks a
// funding account (BankAppScreen). AU also skips the login form: the bank's
// push notification put the shopper in the app, so FaceIdScreen runs the
// biometric on its own.

import { useEffect, useRef, useState } from 'react'

import { DEMO_MERCHANT } from '@/components/homepage/demo-merchant'
import { bankLogoUrl, type Bank, type DemoLocale } from '@/components/homepage/demo-locales'
import { SafariIcon, bankBrandColor, type FaceIdState } from '@/components/homepage/demo/shared'

// The date printed on the PayTo agreement. Fixed, like the phone's 9:41
// status bar, so the demo (and its screenshots) never drift.
const AGREEMENT_DATE = '26 September 2026'

export function RedirectScreen({ activeBank }: { activeBank: Bank }) {
  return (
    <div className="bnk__splash">
      <div className="bnk__splash-mark" style={{ background: bankBrandColor(activeBank) }}>
        <img
          src={bankLogoUrl(activeBank.domain)}
          alt={`${activeBank.name} logo`}
          width="38"
          height="38"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      </div>
      <div className="bnk__splash-title">Opening {activeBank.name}…</div>
      <div className="bnk__splash-sub">Securely connecting via Quidkey</div>
      <div className="bnk__splash-bar" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

export function LaunchScreen({ activeBank }: { activeBank: Bank }) {
  return (
    <div className="bnk__launch" style={{ ['--bnk-brand' as string]: bankBrandColor(activeBank) }}>
      <div className="bnk__launch-icon" aria-hidden="true">
        <img
          src={bankLogoUrl(activeBank.domain)}
          alt={`${activeBank.name} logo`}
          width="60"
          height="60"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      </div>
    </div>
  )
}

export function LoginScreen({
  activeBank,
  faceIdState,
  onSignIn,
}: {
  activeBank: Bank
  faceIdState: FaceIdState
  onSignIn: () => void
}) {
  return (
    <div className="bnk__login" style={{ ['--bnk-brand' as string]: bankBrandColor(activeBank) }}>
      <div className="bnk__login-hero">
        <div className="bnk__login-logo">
          <img
            src={bankLogoUrl(activeBank.domain)}
            alt={activeBank.name}
            width="56"
            height="56"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
        <div className="bnk__login-name">{activeBank.name}</div>
      </div>
      <div className="bnk__login-card">
        <label className="bnk__field">
          <span className="bnk__field-lbl">Username</span>
          <span className="bnk__field-val bnk__field-val--placeholder">Enter username</span>
        </label>
        <label className="bnk__field">
          <span className="bnk__field-lbl">Password</span>
          <span className="bnk__field-val bnk__field-val--placeholder">Enter password</span>
        </label>
        <div className="bnk__login-row">
          <span className="bnk__login-check">
            <span className="bnk__login-check-box bnk__login-check-box--off" />
            <span>Remember me</span>
          </span>
          <span className="bnk__login-link">Forgot?</span>
        </div>
        <button type="button" className="bnk__login-btn" onClick={onSignIn}>
          Sign in
        </button>
        <div className="bnk__login-or">
          <span>or</span>
        </div>
        <button type="button" data-hint-id="face-id" className="bnk__login-faceid" onClick={onSignIn}>
          <svg
            viewBox="0 0 48 48"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M8 16V12a4 4 0 014-4h4" />
            <path d="M40 16V12a4 4 0 00-4-4h-4" />
            <path d="M8 32v4a4 4 0 004 4h4" />
            <path d="M40 32v4a4 4 0 01-4 4h-4" />
            <path d="M18 20v3" />
            <path d="M30 20v3" />
            <path d="M24 20v8h-2" />
            <path d="M18 32c1.8 1.5 4 2.2 6 2.2s4.2-.7 6-2.2" />
          </svg>
          <span>Sign in with Face ID</span>
        </button>
      </div>
      <div className="bnk__login-foot">
        <span>Sign up</span>
        <span>·</span>
        <span>Open an account</span>
        <span>·</span>
        <span>Privacy</span>
      </div>

      {faceIdState !== 'idle' && (
        <FaceIdSheet
          state={faceIdState}
          title={faceIdState === 'scanning' ? 'Scanning…' : 'Approved'}
          sub={
            faceIdState === 'scanning'
              ? `Look at the camera to sign in to ${activeBank.name}`
              : `Signing you into ${activeBank.name}`
          }
        />
      )}
    </div>
  )
}

function FaceIdSheet({ state, title, sub }: { state: FaceIdState; title: string; sub: string }) {
  return (
    <div className="bnk__faceid-modal" role="dialog" aria-modal="true">
      <div className="bnk__faceid-sheet">
        <div className={`bnk__faceid-sheet-icon bnk__faceid-sheet-icon--${state}`}>
          {state === 'scanning' && (
            <svg
              viewBox="0 0 48 48"
              width="42"
              height="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 16V12a4 4 0 014-4h4" />
              <path d="M40 16V12a4 4 0 00-4-4h-4" />
              <path d="M8 32v4a4 4 0 004 4h4" />
              <path d="M40 32v4a4 4 0 01-4 4h-4" />
              <path d="M18 20v3" />
              <path d="M30 20v3" />
              <path d="M24 20v8h-2" />
              <path d="M18 32c1.8 1.5 4 2.2 6 2.2s4.2-.7 6-2.2" />
            </svg>
          )}
          {state === 'approved' && (
            <svg
              viewBox="0 0 48 48"
              width="42"
              height="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 24l9 9 19-19" />
            </svg>
          )}
          {state === 'scanning' && <span className="bnk__faceid-scanline" aria-hidden="true" />}
        </div>
        <div className="bnk__faceid-sheet-title">{title}</div>
        <div className="bnk__faceid-sheet-sub">{sub}</div>
      </div>
    </div>
  )
}

// AU only — the PayTo handoff arrives as a push notification, so there is no
// login form: the bank app opens straight onto Face ID, which scans and
// approves on its own before handing over to the agreement screen.
export function FaceIdScreen({ activeBank, onDone }: { activeBank: Bank; onDone: () => void }) {
  const [state, setState] = useState<FaceIdState>('scanning')
  const done = useRef(onDone)
  done.current = onDone

  useEffect(() => {
    const t1 = setTimeout(() => setState('approved'), 1100)
    const t2 = setTimeout(() => done.current(), 2100)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  return (
    <div
      className="bnk__login bnk__login--auto"
      style={{ ['--bnk-brand' as string]: bankBrandColor(activeBank) }}
    >
      <div className="bnk__login-hero">
        <div className="bnk__login-logo">
          <img
            src={bankLogoUrl(activeBank.domain)}
            alt={activeBank.name}
            width="56"
            height="56"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
        <div className="bnk__login-name">{activeBank.name}</div>
      </div>
      <div className="bnk__login-foot">
        <span>Sign up</span>
        <span>·</span>
        <span>Open an account</span>
        <span>·</span>
        <span>Privacy</span>
      </div>
      <div data-hint-id="face-id" className="bnk__faceid-target" aria-hidden="true" />
      <FaceIdSheet
        state={state}
        title={state === 'scanning' ? 'Face ID' : 'Approved'}
        sub={
          state === 'scanning'
            ? `Look at the camera to log on to ${activeBank.name}`
            : `Logging you on to ${activeBank.name}`
        }
      />
    </div>
  )
}

export function BankAppScreen({
  activeBank,
  locale,
  bankAccountIdx,
  setBankAccountIdx,
  onCancel,
  onPay,
}: {
  activeBank: Bank
  locale: DemoLocale
  bankAccountIdx: number
  setBankAccountIdx: (i: number) => void
  onCancel: () => void
  onPay: () => void
}) {
  return (
    <>
      <div className="bnk__topbar">
        <button type="button" className="bnk__back" onClick={onCancel} aria-label="Back to merchant">
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M10 3l-5 5 5 5" />
          </svg>
          <span>Cancel</span>
        </button>
        <div className="bnk__topbar-brand">
          <span className="bnk__topbar-mark" style={{ background: bankBrandColor(activeBank) }}>
            <img
              src={bankLogoUrl(activeBank.domain)}
              alt={`${activeBank.name} logo`}
              width="16"
              height="16"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </span>
          <span>{activeBank.name}</span>
        </div>
        <span className="bnk__topbar-spacer" aria-hidden="true" />
      </div>
      <div className="bnk__screen">
        <div className="bnk__pay-head">
          <div className="bnk__pay-eyebrow">Authorise payment</div>
          <div className="bnk__pay-amt num">{locale.price}</div>
          <div className="bnk__pay-to">
            to <strong>{DEMO_MERCHANT.name}</strong> · via Quidkey
          </div>
        </div>

        <div className="bnk__sec-h">Pay from</div>
        <div className="bnk__accts">
          {locale.accounts?.map((a, i) => (
            <button
              type="button"
              key={a.id}
              className={`bnk__acct ${i === bankAccountIdx ? 'is-on' : ''}`}
              onClick={() => setBankAccountIdx(i)}
            >
              <span className={`bnk__radio ${i === bankAccountIdx ? 'is-on' : ''}`}>
                <span />
              </span>
              <span className="bnk__acct-info">
                <span className="bnk__acct-name">{a.name}</span>
                <span className="bnk__acct-sub num">{a.sub}</span>
              </span>
              <span className="bnk__acct-bal num">{a.bal}</span>
            </button>
          ))}
        </div>

        <div className="bnk__detail">
          <div className="bnk__detail-row">
            <span>Reference</span>
            <span className="num">{DEMO_MERCHANT.reference}</span>
          </div>
          <div className="bnk__detail-row">
            <span>Arrives</span>
            <span>Instantly</span>
          </div>
        </div>
      </div>
      <div className="phone__action">
        <button
          type="button"
          data-hint-id="bank-pay"
          className="phone__action-cta phone__action-cta--bank"
          onClick={onPay}
          style={{ background: bankBrandColor(activeBank) }}
        >
          <span>Pay {locale.price}</span>
        </button>
      </div>
    </>
  )
}

// AU only — the bank-branded PayTo agreement the shopper reviews after Face
// ID. A standing agreement rather than a one-off payment, so it shows the
// full agreement record — who pays whom, from which PayID, how much, how
// often — with an explicit Decline / Approve pair instead of a pay button.
export function PayToAgreementScreen({
  activeBank,
  locale,
  onApprove,
  onDecline,
}: {
  activeBank: Bank
  locale: DemoLocale
  onApprove: () => void
  onDecline: () => void
}) {
  const rows: Array<[string, string, boolean?]> = [
    ['Status', 'Pending'],
    ['PayID', locale.phone, true],
    ['PayID Name', locale.customer.name],
    ['Payee', DEMO_MERCHANT.name.toUpperCase()],
    ['Payment amount', locale.price, true],
    ['Payment frequency', 'Single'],
    ['Start date', AGREEMENT_DATE],
    ['First payment', AGREEMENT_DATE],
  ]

  return (
    <div className="bnk__agree">
      <div className="bnk__agree-bar">
        <span className="bnk__agree-mark" style={{ background: bankBrandColor(activeBank) }}>
          <img
            src={bankLogoUrl(activeBank.domain)}
            alt={`${activeBank.name} logo`}
            width="18"
            height="18"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </span>
        <span className="bnk__agree-bank">{activeBank.name}</span>
        <span className="bnk__agree-avatar" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="9" r="3.5" />
            <path d="M5 21c1.5-4 4-6 7-6s5.5 2 7 6" />
          </svg>
        </span>
      </div>
      <div className="bnk__agree-body">
        <h2 className="bnk__agree-h">PayTo agreement</h2>
        <div className="bnk__agree-sub">Awaiting authorisation</div>
        <div className="bnk__agree-sec">Payment agreement details</div>
        <dl className="bnk__payto-rows">
          {rows.map(([k, v, isNum]) => (
            <div key={k} className="bnk__payto-row">
              <dt>{k}</dt>
              <dd className={isNum ? 'num' : undefined}>{v}</dd>
            </div>
          ))}
        </dl>
        <div className="bnk__agree-due">Action required by {AGREEMENT_DATE}</div>
        <div className="bnk__agree-actions">
          <button type="button" className="bnk__agree-decline" onClick={onDecline}>
            Decline
          </button>
          <button type="button" data-hint-id="bank-pay" className="bnk__agree-approve" onClick={onApprove}>
            Approve
          </button>
        </div>
      </div>
    </div>
  )
}

export function ProcessingScreen({ locale }: { locale: DemoLocale }) {
  const payto = locale.authorise === 'payto'
  return (
    <div className="bnk__splash">
      <div className="bnk__spinner" aria-hidden="true" />
      <div className="bnk__splash-title">{payto ? 'Authorising PayTo agreement…' : 'Authorising payment…'}</div>
      <div className="bnk__splash-sub">
        {payto ? 'Paying' : 'Sending'} {locale.price} to {DEMO_MERCHANT.name}
      </div>
    </div>
  )
}

export function SafariLaunchScreen() {
  return (
    <div className="bnk__safari-launch">
      <div className="bnk__safari-launch-icon" aria-hidden="true">
        <SafariIcon />
      </div>
    </div>
  )
}
