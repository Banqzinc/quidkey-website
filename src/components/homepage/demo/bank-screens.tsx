// The bank's own surfaces during the handoff: the redirect splash, the app
// launch, the login + Face ID sheet, the authorise screen, and the two
// screens that bridge back to the merchant.
//
// The authorise screen is where the markets diverge — AU approves a standing
// PayTo agreement, everywhere else picks a funding account.

import { DEMO_MERCHANT } from '@/components/homepage/demo-merchant'
import { bankLogoUrl, type Bank, type DemoLocale } from '@/components/homepage/demo-locales'
import { SafariIcon, bankBrandColor, type FaceIdState } from '@/components/homepage/demo/shared'

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
        <div className="bnk__faceid-modal" role="dialog" aria-modal="true">
          <div className="bnk__faceid-sheet">
            <div className={`bnk__faceid-sheet-icon bnk__faceid-sheet-icon--${faceIdState}`}>
              {faceIdState === 'scanning' && (
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
              {faceIdState === 'approved' && (
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
              {faceIdState === 'scanning' && <span className="bnk__faceid-scanline" aria-hidden="true" />}
            </div>
            <div className="bnk__faceid-sheet-title">{faceIdState === 'scanning' ? 'Scanning…' : 'Approved'}</div>
            <div className="bnk__faceid-sheet-sub">
              {faceIdState === 'scanning'
                ? `Look at the camera to sign in to ${activeBank.name}`
                : `Signing you into ${activeBank.name}`}
            </div>
          </div>
        </div>
      )}
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
          <div className="bnk__pay-eyebrow">
            {locale.authorise === 'payto' ? 'Authorise agreement' : 'Authorise payment'}
          </div>
          <div className="bnk__pay-amt num">{locale.price}</div>
          <div className="bnk__pay-to">
            to <strong>{DEMO_MERCHANT.name}</strong> · via Quidkey
          </div>
        </div>

        {locale.authorise === 'payto' ? (
          // AU / PayTo: the shopper approves a standing agreement, so the bank
          // shows agreement terms rather than a one-off confirmation — who is
          // paying whom, how much, and how often.
          <>
            <div className="bnk__sec-h">PayTo agreement</div>
            <div className="bnk__payto">
              <img className="bnk__payto-logo" src="/homepage/payto-logo.webp" alt="PayTo" width="72" height="30" />
              <dl className="bnk__payto-rows">
                <div className="bnk__payto-row">
                  <dt>Status</dt>
                  <dd>Pending</dd>
                </div>
                <div className="bnk__payto-row">
                  <dt>PayID</dt>
                  <dd className="num">{DEMO_MERCHANT.payId}</dd>
                </div>
                <div className="bnk__payto-row">
                  <dt>Payee</dt>
                  <dd>{DEMO_MERCHANT.name}</dd>
                </div>
                <div className="bnk__payto-row">
                  <dt>Amount</dt>
                  <dd className="num">{locale.price}</dd>
                </div>
                <div className="bnk__payto-row">
                  <dt>Frequency</dt>
                  <dd>Single payment</dd>
                </div>
              </dl>
            </div>
          </>
        ) : (
          <>
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
          </>
        )}

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
          <span>
            {locale.authorise === 'payto' ? `Approve and pay ${locale.price}` : `Pay ${locale.price}`}
          </span>
        </button>
      </div>
    </>
  )
}

export function ProcessingScreen({ locale }: { locale: DemoLocale }) {
  return (
    <div className="bnk__splash">
      <div className="bnk__spinner" aria-hidden="true" />
      <div className="bnk__splash-title">Authorising payment…</div>
      <div className="bnk__splash-sub">
        Sending {locale.price} to {DEMO_MERCHANT.name}
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
