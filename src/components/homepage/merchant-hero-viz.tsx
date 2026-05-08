// Merchant hero viz — interactive bank-tap demo. Maps to app.jsx:793-1697.
//
// Differences from the prototype:
// - The "scribble" tutorial overlay system (~150 lines of stage-tracking
//   logic + DemoHint component) is intentionally NOT ported. The base flow
//   already self-explains; we can add a simpler overlay later if needed.
// - tweaks.demoHint / tweaks.demoChrome are dropped (design-time only).
// - Apple Pay / Card / PayPal options stay visually but only the bank
//   flows progress through the demo (matches prototype behavior).
//
// Tracking: every flow-step transition fires homepage_hero_viz_stage
// with the stage index and stage name, throttled so re-renders never
// duplicate-fire.

import { useEffect, useRef, useState } from 'react'

import { ScribbleHint, useScribbleStages, type ScribbleStage } from '@/components/homepage/scribble-hint'
import { track } from '@/lib/track'

const LOGO_DEV_TOKEN = 'pk_DsNHFndhT3yo-85c5vdKKg'

const BANKS = [
  { name: 'Chase', domain: 'chase.com' },
  { name: 'Bank of America', domain: 'bankofamerica.com' },
  { name: 'Wells Fargo', domain: 'wellsfargo.com' },
  { name: 'Citi', domain: 'citi.com' },
  { name: 'Capital One', domain: 'capitalone.com' },
  { name: 'U.S. Bank', domain: 'usbank.com' },
] as const

type Bank = (typeof BANKS)[number]

const BANK_BRAND_COLORS: Record<string, string> = {
  Chase: '#0A2A66',
  'Bank of America': '#9C1B2E',
  'Wells Fargo': '#A8181E',
  Citi: '#003A6E',
  'Capital One': '#0E3A5F',
  'U.S. Bank': '#0E2A66',
}

function bankBrandColor(bank: Bank | null | undefined): string {
  if (!bank) return '#0A2A66'
  return BANK_BRAND_COLORS[bank.name] ?? '#0A2A66'
}

type FlowStep =
  | 'checkout'
  | 'redirect'
  | 'launch'
  | 'login'
  | 'bank'
  | 'processing'
  | 'bank-confirm'
  | 'app-close'
  | 'app-launch-safari'
  | 'success'

type PaymentMethod = 'predicted' | 'select' | 'apple' | 'card' | 'paypal'
type FaceIdState = 'idle' | 'scanning' | 'approved'

function SafariIcon() {
  // Faithful recreation of the iOS Safari icon: blue circular bezel with
  // tick marks, white inner face, red/white compass needle pointing NE.
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
      <defs>
        <radialGradient id="safari-bg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#1FA9F8" />
          <stop offset="100%" stopColor="#0A6FD3" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#safari-bg)" />
      <circle cx="32" cy="32" r="22" fill="#fff" />
      <polygon points="32,16 36,32 32,48 28,32" fill="#E33A3A" />
      <polygon points="32,16 32,32 36,32" fill="#FFFFFF" opacity="0.9" />
      <polygon points="32,48 32,32 28,32" fill="#FFFFFF" opacity="0.85" />
      <circle cx="32" cy="32" r="2.4" fill="#fff" stroke="#0A6FD3" strokeWidth="1" />
    </svg>
  )
}

const PayPalSvg = (
  <svg width="28" height="28" viewBox="0 0 30 31" fill="none" aria-hidden="true">
    <path
      d="M9.26555 29.1539L9.78855 25.8319L8.62355 25.8049H3.06055L6.92655 1.29193C6.93855 1.21793 6.97755 1.14893 7.03455 1.09993C7.09155 1.05093 7.16455 1.02393 7.24055 1.02393H16.6205C19.7345 1.02393 21.8835 1.67193 23.0055 2.95093C23.5315 3.55093 23.8665 4.17793 24.0285 4.86793C24.1985 5.59193 24.2015 6.45693 24.0355 7.51193L24.0235 7.58893V8.26493L24.5495 8.56293C24.9925 8.79793 25.3445 9.06693 25.6145 9.37493C26.0645 9.88793 26.3555 10.5399 26.4785 11.3129C26.6055 12.1079 26.5635 13.0539 26.3555 14.1249C26.1155 15.3569 25.7275 16.4299 25.2035 17.3079C24.7215 18.1169 24.1075 18.7879 23.3785 19.3079C22.6825 19.8019 21.8555 20.1769 20.9205 20.4169C20.0145 20.6529 18.9815 20.7719 17.8485 20.7719H17.1185C16.5965 20.7719 16.0895 20.9599 15.6915 21.2969C15.2925 21.6409 15.0285 22.1109 14.9475 22.6249L14.8925 22.9239L13.9685 28.7789L13.9265 28.9939C13.9155 29.0619 13.8965 29.0959 13.8685 29.1189C13.8435 29.1399 13.8075 29.1539 13.7725 29.1539H9.26555Z"
      fill="#253B80"
    />
    <path
      d="M25.0481 7.66699C25.0201 7.84599 24.9881 8.02899 24.9521 8.21699C23.7151 14.568 19.4831 16.762 14.0781 16.762H11.3261C10.6651 16.762 10.1081 17.242 10.0051 17.894L8.59614 26.83L8.19714 29.363C8.13014 29.791 8.46014 30.177 8.89214 30.177H13.7731C14.3511 30.177 14.8421 29.757 14.9331 29.187L14.9811 28.939L15.9001 23.107L15.9591 22.787C16.0491 22.215 16.5411 21.795 17.1191 21.795H17.8491C22.5781 21.795 26.2801 19.875 27.3621 14.319C27.8141 11.998 27.5801 10.06 26.3841 8.69699C26.0221 8.28599 25.5731 7.94499 25.0481 7.66699Z"
      fill="#179BD7"
    />
    <path
      d="M11.614 7.699C11.675 7.306 11.927 6.985 12.266 6.823C12.421 6.749 12.592 6.708 12.773 6.708H20.125C20.996 6.708 21.809 6.765 22.551 6.885C22.763 6.919 22.969 6.958 23.17 7.002C23.37 7.047 23.565 7.097 23.754 7.152C23.848 7.18 23.941 7.209 24.032 7.238C24.397 7.359 24.736 7.502 25.049 7.667C25.417 5.32 25.046 3.722 23.777 2.275C22.378 0.682 19.853 0 16.622 0H7.24199C6.58199 0 6.01899 0.48 5.91699 1.133L2.00999 25.898C1.93299 26.388 2.31099 26.83 2.80499 26.83H8.59599L10.05 17.605L11.614 7.699Z"
      fill="#253B80"
    />
  </svg>
)

const STAGE_NAMES: Record<FlowStep, string> = {
  checkout: 'checkout',
  redirect: 'redirect_to_bank',
  launch: 'bank_app_launching',
  login: 'bank_login',
  bank: 'bank_authorize',
  processing: 'bank_processing',
  'bank-confirm': 'bank_confirmed',
  'app-close': 'app_close',
  'app-launch-safari': 'safari_launching',
  success: 'merchant_success',
}

const STAGE_INDEX: Record<FlowStep, number> = {
  checkout: 0,
  redirect: 1,
  launch: 2,
  login: 3,
  bank: 4,
  processing: 5,
  'bank-confirm': 6,
  'app-close': 7,
  'app-launch-safari': 8,
  success: 9,
}

// Scribble guide stages — hand-drawn callouts overlaid on the hero viz.
// Each stage has a `screen` (matches FlowStep) and an `id` (matches the
// data-hint-id on the target element inside the phone).
const SCRIBBLE_STAGES: ScribbleStage[] = [
  { screen: 'checkout', id: 'predicted-bank', label: "Customer's predicted bank" },
  { screen: 'checkout', id: 'select-bank', label: 'They can still pick any other bank' },
  { screen: 'checkout', id: 'checkout-cta', label: 'One tap to pay' },
  {
    screen: 'login',
    id: 'face-id',
    label: (
      <>
        Authorise with
        <br />
        Face ID
      </>
    ),
  },
  { screen: 'bank', id: 'bank-pay', label: 'Confirm in the bank app' },
  { screen: 'success', id: 'replay', label: 'Done, replay?' },
]

export function MerchantHeroViz() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('predicted')
  const [pickedIdx, setPickedIdx] = useState<number | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [flowStep, setFlowStep] = useState<FlowStep>('checkout')
  const [faceIdState, setFaceIdState] = useState<FaceIdState>('idle')
  const [bankAccountIdx, setBankAccountIdx] = useState(0)
  const [userClicks, setUserClicks] = useState(0)
  const noteUserAction = () => setUserClicks((n) => n + 1)
  // After 3 deliberate clicks the engagement-based suppression kicks in,
  // matching the prototype's behavior so we don't backseat-drive engaged users.
  const hintSuppressed = userClicks >= 3
  const { currentIdx: scribbleIdx, next: scribbleNext, prev: scribblePrev } =
    useScribbleStages(SCRIBBLE_STAGES, flowStep)

  const flowTimers = useRef<ReturnType<typeof setTimeout>[]>([])
  const queue = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms)
    flowTimers.current.push(id)
  }
  useEffect(() => () => flowTimers.current.forEach(clearTimeout), [])

  // Fire homepage_hero_viz_stage once per actual flowStep transition.
  const lastTrackedStep = useRef<FlowStep | null>(null)
  useEffect(() => {
    if (lastTrackedStep.current === flowStep) return
    lastTrackedStep.current = flowStep
    track({
      name: 'homepage_hero_viz_stage',
      flow: 'merchant',
      stage: STAGE_INDEX[flowStep],
      stageName: STAGE_NAMES[flowStep],
    })
  }, [flowStep])

  const resetFlow = () => {
    flowTimers.current.forEach(clearTimeout)
    flowTimers.current = []
    setFlowStep('checkout')
    setBankAccountIdx(0)
    setFaceIdState('idle')
  }

  const isPredicted = paymentMethod === 'predicted'
  const isSelectMode = paymentMethod === 'select'
  const pickedBank: Bank | null = pickedIdx != null ? BANKS[pickedIdx] : null
  const activeBank: Bank = paymentMethod === 'select' && pickedBank ? pickedBank : BANKS[0]
  const miniBanks = BANKS.slice(1, 4)

  const selectBank = (i: number) => {
    noteUserAction()
    setPickedIdx(i)
    setPaymentMethod('select')
  }

  const pickNonBank = (m: 'apple' | 'card' | 'paypal') => {
    noteUserAction()
    setPaymentMethod(m)
    setExpanded(false)
  }

  const tapSelectBank = () => {
    noteUserAction()
    setPaymentMethod('select')
    setExpanded(true)
  }

  const ctaLabel =
    paymentMethod === 'predicted'
      ? `Pay with ${BANKS[0].name}`
      : paymentMethod === 'select'
      ? pickedBank
        ? `Pay with ${pickedBank.name}`
        : 'Choose a bank'
      : paymentMethod === 'apple'
      ? 'Pay with Apple Pay'
      : paymentMethod === 'card'
      ? 'Pay with card'
      : 'Pay with PayPal'

  const handleCheckoutCta = () => {
    if (paymentMethod !== 'predicted' && paymentMethod !== 'select') return
    if (paymentMethod === 'select' && !pickedBank) return
    noteUserAction()
    setFlowStep('redirect')
    queue(() => setFlowStep('launch'), 800)
    queue(() => setFlowStep('login'), 1900)
  }

  const handleFaceIdComplete = () => {
    noteUserAction()
    setFaceIdState('scanning')
    queue(() => setFaceIdState('approved'), 1000)
    queue(() => {
      setFlowStep('bank')
      setFaceIdState('idle')
    }, 1900)
  }

  const handleBankPay = () => {
    noteUserAction()
    setFlowStep('processing')
    queue(() => setFlowStep('app-launch-safari'), 1500)
    queue(() => setFlowStep('success'), 2500)
  }

  const onTapPredicted = () => {
    noteUserAction()
    setPaymentMethod('predicted')
    setExpanded(false)
  }

  return (
    <div className="hero__viz hero__viz--mobile hero__viz--scribble">
      <div className="phone-wrap">
        <div className={`phone phone--step-${flowStep}`}>
          <div className="phone__notch" aria-hidden="true" />
          <div className="phone__statusbar">
            <span className="phone__time">9:41</span>
            <span className="phone__icons" aria-hidden="true">
              <img src="/homepage/ios-cellular.svg" alt="" className="phone__icon phone__icon--cellular" />
              <img src="/homepage/ios-wifi.svg" alt="" className="phone__icon phone__icon--wifi" />
              <img src="/homepage/ios-battery.svg" alt="" className="phone__icon phone__icon--battery" />
            </span>
          </div>

          {flowStep === 'checkout' && (
            <CheckoutScreen
              paymentMethod={paymentMethod}
              isPredicted={isPredicted}
              isSelectMode={isSelectMode}
              expanded={expanded}
              pickedIdx={pickedIdx}
              ctaLabel={ctaLabel}
              miniBanks={miniBanks}
              onTapPredicted={onTapPredicted}
              tapSelectBank={tapSelectBank}
              selectBank={selectBank}
              pickNonBank={pickNonBank}
              handleCheckoutCta={handleCheckoutCta}
            />
          )}

          {flowStep === 'redirect' && <RedirectScreen activeBank={activeBank} />}
          {flowStep === 'launch' && <LaunchScreen activeBank={activeBank} />}
          {flowStep === 'login' && (
            <LoginScreen activeBank={activeBank} faceIdState={faceIdState} onSignIn={handleFaceIdComplete} />
          )}
          {flowStep === 'bank' && (
            <BankAppScreen
              activeBank={activeBank}
              bankAccountIdx={bankAccountIdx}
              setBankAccountIdx={setBankAccountIdx}
              onCancel={resetFlow}
              onPay={handleBankPay}
            />
          )}
          {flowStep === 'processing' && <ProcessingScreen />}
          {flowStep === 'app-launch-safari' && <SafariLaunchScreen />}
          {flowStep === 'success' && <SuccessScreen activeBank={activeBank} onReplay={resetFlow} />}
        </div>
      </div>
      <ScribbleHint
        stages={SCRIBBLE_STAGES}
        currentIdx={scribbleIdx}
        flowStep={flowStep}
        suppressed={hintSuppressed}
        onPrev={scribblePrev}
        onNext={scribbleNext}
      />
    </div>
  )
}

// ─── Screens ──────────────────────────────────────────────────────────

type CheckoutScreenProps = {
  paymentMethod: PaymentMethod
  isPredicted: boolean
  isSelectMode: boolean
  expanded: boolean
  pickedIdx: number | null
  ctaLabel: string
  miniBanks: ReadonlyArray<Bank>
  onTapPredicted: () => void
  tapSelectBank: () => void
  selectBank: (i: number) => void
  pickNonBank: (m: 'apple' | 'card' | 'paypal') => void
  handleCheckoutCta: () => void
}

function CheckoutScreen({
  paymentMethod,
  isPredicted,
  isSelectMode,
  expanded,
  pickedIdx,
  ctaLabel,
  miniBanks,
  onTapPredicted,
  tapSelectBank,
  selectBank,
  pickNonBank,
  handleCheckoutCta,
}: CheckoutScreenProps) {
  const pickedBank = pickedIdx != null ? BANKS[pickedIdx] : null
  return (
    <>
      <div className="phone__urlbar">
        <span className="phone__url-lock" aria-hidden="true">
          <svg viewBox="0 0 12 14" width="10" height="12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="6" width="8" height="7" rx="1" />
            <path d="M4 6V4a2 2 0 014 0v2" />
          </svg>
        </span>
        <span className="phone__url-host">northgate-goods.com</span>
        <span className="phone__url-path">/checkout</span>
      </div>
      <div className="phone__screen">
        <div className="mck__product">
          <div className="mck__product-img" aria-hidden="true">
            <img
              src="/homepage/product-shoe-blue.png"
              alt=""
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
          <div className="mck__product-body">
            <div className="mck__product-brand">NORTHGATE GOODS</div>
            <div className="mck__product-title">Court Runner, Blue</div>
            <div className="mck__product-meta">Size 10 · Qty 1 · Free returns</div>
            <div className="mck__product-price num">$149.00</div>
          </div>
        </div>

        <div className="mck__sec-h">
          <span>Payment</span>
          <span className="mck__sec-h-meta">Secured</span>
        </div>

        <button
          type="button"
          data-hint-id="predicted-bank"
          className={`mck__opt mck__opt--bank ${isPredicted ? 'mck__opt--active' : ''}`}
          onClick={onTapPredicted}
          style={{ height: '96px' }}
        >
          <div className="mck__opt-row">
            <span className={`mck__radio ${isPredicted ? 'is-on' : ''}`}>
              <span />
            </span>
            <div className="mck__opt-logo">
              <img src={`https://img.logo.dev/${BANKS[0].domain}?token=${LOGO_DEV_TOKEN}`} alt="" />
            </div>
            <div className="mck__opt-info">
              <div className="mck__opt-title">
                <span style={{ whiteSpace: 'nowrap' }}>Pay with {BANKS[0].name}</span>
              </div>
            </div>
            <span className="mck__save">Save $4.32</span>
          </div>
        </button>

        <div className={`mck__opt mck__select ${expanded ? 'is-open' : ''} ${isSelectMode ? 'mck__select--on' : ''}`}>
          <button
            type="button"
            data-hint-id="select-bank"
            className="mck__select-head"
            onClick={tapSelectBank}
            aria-expanded={expanded}
          >
            <span className={`mck__radio ${isSelectMode ? 'is-on' : ''}`}>
              <span />
            </span>
            <span className="mck__opt-logo mck__opt-logo--mute mck__select-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 18v-7" />
                <path d="M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z" />
                <path d="M14 18v-7" />
                <path d="M18 18v-7" />
                <path d="M3 22h18" />
                <path d="M6 18v-7" />
              </svg>
            </span>
            <span className="mck__select-toggle">
              <span className="mck__opt-title mck__select-title">Select bank</span>
              <span className="mck__select-mini" aria-hidden="true">
                {miniBanks.map((b) => (
                  <span key={b.name} className="mck__select-mini-chip">
                    <img src={`https://img.logo.dev/${b.domain}?token=${LOGO_DEV_TOKEN}`} alt="" />
                  </span>
                ))}
                <span className="mck__select-mini-plus" aria-hidden="true">+</span>
              </span>
              <span className={`mck__select-chev ${expanded ? 'is-open' : ''}`}>
                <svg viewBox="0 0 12 8" width="11" height="7" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M1 1l5 5 5-5" />
                </svg>
              </span>
            </span>
          </button>
          {expanded && (
            <div className="mck__select-body">
              <div className="mck__select-search">
                <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="7" cy="7" r="5" />
                  <path d="M11 11l3.5 3.5" />
                </svg>
                <span>Search</span>
              </div>
              <div className="mck__select-grid">
                {BANKS.map((b, i) => (
                  <button
                    type="button"
                    key={b.name}
                    className={`mck__select-bank ${i === pickedIdx ? 'is-on' : ''}`}
                    onClick={() => selectBank(i)}
                  >
                    <img src={`https://img.logo.dev/${b.domain}?token=${LOGO_DEV_TOKEN}`} alt="" />
                    <span>{b.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          className={`mck__opt ${paymentMethod === 'apple' ? 'mck__opt--picked' : ''}`}
          onClick={() => pickNonBank('apple')}
        >
          <span className={`mck__radio ${paymentMethod === 'apple' ? 'is-on' : ''}`}>
            <span />
          </span>
          <div className="mck__opt-logo mck__opt-logo--brand mck__opt-logo--applepay">
            <img src="/homepage/apple-pay-mark.svg" alt="Apple Pay" width="44" height="28" />
          </div>
          <div className="mck__opt-info">
            <div className="mck__opt-title">Apple Pay</div>
          </div>
        </button>

        <button
          type="button"
          className={`mck__opt ${paymentMethod === 'card' ? 'mck__opt--picked' : ''}`}
          onClick={() => pickNonBank('card')}
        >
          <span className={`mck__radio ${paymentMethod === 'card' ? 'is-on' : ''}`}>
            <span />
          </span>
          <div className="mck__opt-logo mck__opt-logo--brand mck__opt-logo--mute">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="2.5" y="5.5" width="19" height="13" rx="2" />
              <line x1="2.5" y1="10" x2="21.5" y2="10" />
            </svg>
          </div>
          <div className="mck__opt-info">
            <div className="mck__opt-title">Credit or debit card</div>
          </div>
        </button>

        <button
          type="button"
          className={`mck__opt ${paymentMethod === 'paypal' ? 'mck__opt--picked' : ''}`}
          onClick={() => pickNonBank('paypal')}
        >
          <span className={`mck__radio ${paymentMethod === 'paypal' ? 'is-on' : ''}`}>
            <span />
          </span>
          <div className="mck__opt-logo mck__opt-logo--brand">{PayPalSvg}</div>
          <div className="mck__opt-info">
            <div className="mck__opt-title">PayPal</div>
          </div>
        </button>
      </div>
      <div className="phone__action">
        <button
          type="button"
          data-hint-id="checkout-cta"
          className="phone__action-cta"
          disabled={paymentMethod === 'select' && !pickedBank}
          onClick={handleCheckoutCta}
        >
          <span>{ctaLabel}</span>
        </button>
      </div>
    </>
  )
}

function RedirectScreen({ activeBank }: { activeBank: Bank }) {
  return (
    <div className="bnk__splash">
      <div className="bnk__splash-mark" style={{ background: bankBrandColor(activeBank) }}>
        <img
          src={`https://img.logo.dev/${activeBank.domain}?token=${LOGO_DEV_TOKEN}`}
          alt=""
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

function LaunchScreen({ activeBank }: { activeBank: Bank }) {
  return (
    <div className="bnk__launch" style={{ ['--bnk-brand' as string]: bankBrandColor(activeBank) }}>
      <div className="bnk__launch-icon" aria-hidden="true">
        <img
          src={`https://img.logo.dev/${activeBank.domain}?token=${LOGO_DEV_TOKEN}`}
          alt=""
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      </div>
    </div>
  )
}

function LoginScreen({
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
            src={`https://img.logo.dev/${activeBank.domain}?token=${LOGO_DEV_TOKEN}`}
            alt={activeBank.name}
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

const BANK_ACCOUNTS = [
  { id: 'current', name: 'Current Account', sub: '••3082', bal: '$8,412.59' },
  { id: 'savings', name: 'Savings', sub: '••7714', bal: '$24,930.10' },
  { id: 'checking', name: 'Everyday Checking', sub: '••0461', bal: '$1,206.84' },
]

function BankAppScreen({
  activeBank,
  bankAccountIdx,
  setBankAccountIdx,
  onCancel,
  onPay,
}: {
  activeBank: Bank
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
              src={`https://img.logo.dev/${activeBank.domain}?token=${LOGO_DEV_TOKEN}`}
              alt=""
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
          <div className="bnk__pay-amt num">$149.00</div>
          <div className="bnk__pay-to">
            to <strong>Northgate Goods</strong> · via Quidkey
          </div>
        </div>

        <div className="bnk__sec-h">Pay from</div>
        <div className="bnk__accts">
          {BANK_ACCOUNTS.map((a, i) => (
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
            <span className="num">QK-NG-8842</span>
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
          <span>Pay $149.00</span>
        </button>
      </div>
    </>
  )
}

function ProcessingScreen() {
  return (
    <div className="bnk__splash">
      <div className="bnk__spinner" aria-hidden="true" />
      <div className="bnk__splash-title">Authorising payment…</div>
      <div className="bnk__splash-sub">Sending $149.00 to Northgate Goods</div>
    </div>
  )
}

function SafariLaunchScreen() {
  return (
    <div className="bnk__safari-launch">
      <div className="bnk__safari-launch-icon" aria-hidden="true">
        <SafariIcon />
      </div>
    </div>
  )
}

function SuccessScreen({ activeBank, onReplay }: { activeBank: Bank; onReplay: () => void }) {
  return (
    <>
      <div className="phone__urlbar">
        <span className="phone__url-lock" aria-hidden="true">
          <svg viewBox="0 0 12 14" width="10" height="12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="6" width="8" height="7" rx="1" />
            <path d="M4 6V4a2 2 0 014 0v2" />
          </svg>
        </span>
        <span className="phone__url-host">northgate-goods.com</span>
        <span className="phone__url-path">/order/confirmed</span>
      </div>
      <div className="phone__screen msuccess">
        <div className="msuccess__check" aria-hidden="true">
          <svg
            viewBox="0 0 48 48"
            width="36"
            height="36"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 24l9 9 19-19" />
          </svg>
        </div>
        <div className="msuccess__title">Payment successful</div>
        <div className="msuccess__sub">$149.00 paid from your {activeBank.name} account</div>

        <div className="msuccess__rcpt">
          <div className="msuccess__rcpt-row">
            <span>Order</span>
            <span className="num">#NG-44218</span>
          </div>
          <div className="msuccess__rcpt-row">
            <span>Paid with</span>
            <span>{activeBank.name} · Pay by Bank</span>
          </div>
          <div className="msuccess__rcpt-row">
            <span>Saved</span>
            <span className="msuccess__saved">$4.32 vs card</span>
          </div>
          <div className="msuccess__rcpt-row">
            <span>Shipping to</span>
            <span>Alex Marchetti · 02118</span>
          </div>
        </div>

        <div className="msuccess__hint">
          A receipt has been sent to alex@…
          <br />
          Estimated arrival Tue, May 12.
        </div>
      </div>
      <div className="phone__action">
        <button
          type="button"
          data-hint-id="replay"
          className="phone__action-cta phone__action-cta--ghost"
          onClick={onReplay}
        >
          <span>Replay demo</span>
        </button>
      </div>
    </>
  )
}
