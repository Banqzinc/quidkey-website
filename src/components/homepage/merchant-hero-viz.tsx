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

import { ScribbleHint, type ScribbleStage } from '@/components/homepage/scribble-hint'
import { DEMO_LOCALES, type Bank, type DemoLocale } from '@/components/homepage/demo-locales'
import { useDemoRegion } from '@/context/demo-region'
import { track } from '@/lib/track'

const LOGO_DEV_TOKEN = 'pk_DsNHFndhT3yo-85c5vdKKg'

// Brand color now travels on each Bank in the locale pack (demo-locales.ts);
// this wrapper preserves the original call sites: bankBrandColor(activeBank).
function bankBrandColor(bank: Bank | null | undefined): string {
  return bank?.brandColor ?? '#0A2A66'
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
  const [scribbleIdx, setScribbleIdx] = useState(0)

  // Region drives which bank set / currency / receipt copy the demo shows.
  const { region } = useDemoRegion()
  const locale = DEMO_LOCALES[region]
  const banks = locale.banks

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
      region,
    })
    // The step guard above means a later region flip (geo lookup resolving)
    // won't re-fire; the event captures whatever region was set at first fire.
  }, [flowStep, region])

  const resetFlow = () => {
    flowTimers.current.forEach(clearTimeout)
    flowTimers.current = []
    setFlowStep('checkout')
    setBankAccountIdx(0)
    setFaceIdState('idle')
  }

  const isPredicted = paymentMethod === 'predicted'
  const isSelectMode = paymentMethod === 'select'
  const pickedBank: Bank | null = pickedIdx != null ? banks[pickedIdx] : null
  const activeBank: Bank = paymentMethod === 'select' && pickedBank ? pickedBank : banks[0]
  const miniBanks = banks.slice(1, 4)

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
      ? `Pay with ${banks[0].name}`
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

  // ─── Scribble stage orchestration ─────────────────────────────────
  // Each scribble stage configures the demo's visual state so the label
  // always matches what the user is looking at on the phone screen.
  // Maps to app.jsx:1521-1551.
  useEffect(() => {
    const stage = SCRIBBLE_STAGES[scribbleIdx]
    if (!stage || stage.screen !== 'checkout') return
    if (flowStep !== 'checkout') resetFlow()

    if (scribbleIdx === 0) {
      setPaymentMethod('predicted')
      setExpanded(false)
      setPickedIdx(null)
    } else if (scribbleIdx === 1) {
      setPaymentMethod('select')
      setExpanded(true)
      setPickedIdx(null)
      const t = setTimeout(() => setPickedIdx(1), 600)
      return () => clearTimeout(t)
    } else if (scribbleIdx === 2) {
      setPaymentMethod('predicted')
      setExpanded(false)
      setPickedIdx(null)
    }
    // Intentional: only re-run when scribbleIdx changes. Including
    // flowStep would re-trigger the setup whenever the demo advances.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scribbleIdx])

  // When the demo advances to a new screen (e.g. user manually clicks the
  // CTA, or a setTimeout chain advances flowStep), follow it. Use a
  // functional updater so we don't need scribbleIdx in the deps and
  // therefore don't fight manual prev/next clicks within the same screen.
  // Maps to app.jsx:1500-1510.
  useEffect(() => {
    setScribbleIdx((idx) => {
      const cur = SCRIBBLE_STAGES[idx]
      if (cur && cur.screen === flowStep) return idx
      const next = SCRIBBLE_STAGES.findIndex((s) => s.screen === flowStep)
      return next >= 0 ? next : idx
    })
  }, [flowStep])

  // Clicking Next on the scribble can also advance the DEMO when the user
  // is on a stage that maps to a flow action. Maps to runStageNextAction
  // at app.jsx:1554-1575.
  //
  // Importantly: we inline setFlowStep + queue() here rather than calling
  // handleCheckoutCta / handleFaceIdComplete / handleBankPay — those
  // helpers all call noteUserAction(), and counting scribble navigation
  // as user clicks would suppress the hint after 3 Next presses (which
  // is exactly enough to drive the demo to the success screen). The
  // prototype handles this the same way.
  const scribbleNext = () => {
    const fromIdx = scribbleIdx
    if (fromIdx === 2 && flowStep === 'checkout') {
      setFlowStep('redirect')
      queue(() => setFlowStep('launch'), 800)
      queue(() => setFlowStep('login'), 1900)
      return
    }
    if (fromIdx === 3 && flowStep === 'login') {
      setFaceIdState('scanning')
      queue(() => setFaceIdState('approved'), 1000)
      queue(() => {
        setFlowStep('bank')
        setFaceIdState('idle')
      }, 1900)
      return
    }
    if (fromIdx === 4 && flowStep === 'bank') {
      setFlowStep('processing')
      queue(() => setFlowStep('app-launch-safari'), 1500)
      queue(() => setFlowStep('success'), 2500)
      return
    }
    if (fromIdx === 5) {
      // Replay — reset the demo and start over from stage 0.
      resetFlow()
      setScribbleIdx(0)
      return
    }
    setScribbleIdx((i) => Math.min(i + 1, SCRIBBLE_STAGES.length - 1))
  }

  const scribblePrev = () => {
    const newIdx = Math.max(scribbleIdx - 1, 0)
    const target = SCRIBBLE_STAGES[newIdx]
    // If we're crossing into a different screen, rewind the phone there
    // so the user actually sees what the new stage's label points at.
    // This is more aggressive than the prototype (which just hides the
    // scribble until the demo flowStep happens to match) but produces
    // expected UX for back navigation.
    if (target && target.screen !== flowStep) {
      flowTimers.current.forEach(clearTimeout)
      flowTimers.current = []
      setFaceIdState('idle')
      setBankAccountIdx(0)
      setFlowStep(target.screen as FlowStep)
    }
    setScribbleIdx(newIdx)
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
              <svg
                className="phone__icon phone__icon--cellular"
                width="20"
                height="13"
                viewBox="0 0 20 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M19.2 1.14623C19.2 0.513183 18.7224 0 18.1333 0H17.0667C16.4776 0 16 0.513183 16 1.14623V11.0802C16 11.7132 16.4776 12.2264 17.0667 12.2264H18.1333C18.7224 12.2264 19.2 11.7132 19.2 11.0802V1.14623ZM11.7659 2.44528H12.8326C13.4217 2.44528 13.8992 2.97078 13.8992 3.61902V11.0527C13.8992 11.7009 13.4217 12.2264 12.8326 12.2264H11.7659C11.1768 12.2264 10.6992 11.7009 10.6992 11.0527V3.61902C10.6992 2.97078 11.1768 2.44528 11.7659 2.44528ZM7.43411 5.09433H6.36745C5.77834 5.09433 5.30078 5.62652 5.30078 6.28301V11.0377C5.30078 11.6942 5.77834 12.2264 6.36745 12.2264H7.43411C8.02322 12.2264 8.50078 11.6942 8.50078 11.0377V6.28301C8.50078 5.62652 8.02322 5.09433 7.43411 5.09433ZM2.13333 7.53962H1.06667C0.477563 7.53962 0 8.06421 0 8.71132V11.0547C0 11.7018 0.477563 12.2264 1.06667 12.2264H2.13333C2.72244 12.2264 3.2 11.7018 3.2 11.0547V8.71132C3.2 8.06421 2.72244 7.53962 2.13333 7.53962Z"
                  fill="currentColor"
                />
              </svg>
              <svg
                className="phone__icon phone__icon--wifi"
                width="18"
                height="13"
                viewBox="0 0 18 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.5713 2.46628C11.0584 2.46639 13.4504 3.38847 15.2529 5.04195C15.3887 5.1696 15.6056 5.16799 15.7393 5.03834L17.0368 3.77487C17.1045 3.70911 17.1422 3.62004 17.1417 3.52735C17.1411 3.43467 17.1023 3.34603 17.0338 3.28104C12.3028 -1.09368 4.83907 -1.09368 0.108056 3.28104C0.039524 3.34598 0.000639766 3.4346 7.82398e-06 3.52728C-0.000624118 3.61996 0.0370483 3.70906 0.104689 3.77487L1.40255 5.03834C1.53615 5.16819 1.75327 5.1698 1.88893 5.04195C3.69167 3.38836 6.08395 2.46628 8.5713 2.46628ZM8.56795 6.68656C9.92527 6.68647 11.2341 7.19821 12.2403 8.12234C12.3763 8.2535 12.5907 8.25065 12.7234 8.11593L14.0106 6.79663C14.0784 6.72742 14.1161 6.63355 14.1151 6.536C14.1141 6.43844 14.0746 6.34536 14.0054 6.27757C10.9416 3.38672 6.19688 3.38672 3.13305 6.27757C3.06384 6.34536 3.02435 6.43849 3.02345 6.53607C3.02254 6.63366 3.06028 6.72752 3.12822 6.79663L4.41513 8.11593C4.54778 8.25065 4.76215 8.2535 4.89823 8.12234C5.90368 7.19882 7.21152 6.68713 8.56795 6.68656ZM11.0924 9.48011C11.0943 9.58546 11.0572 9.68703 10.9899 9.76084L8.81327 12.2156C8.74946 12.2877 8.66247 12.3283 8.5717 12.3283C8.48093 12.3283 8.39394 12.2877 8.33013 12.2156L6.1531 9.76084C6.08585 9.68697 6.04886 9.58537 6.05085 9.48002C6.05284 9.37467 6.09365 9.27491 6.16364 9.20429C7.55374 7.8904 9.58966 7.8904 10.9798 9.20429C11.0497 9.27497 11.0904 9.37476 11.0924 9.48011Z"
                  fill="currentColor"
                />
              </svg>
              <svg
                className="phone__icon phone__icon--battery"
                width="28"
                height="13"
                viewBox="0 0 28 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect opacity="0.35" x="0.5" y="0.5" width="24" height="12" rx="3.8" stroke="currentColor" />
                <path
                  opacity="0.4"
                  d="M26 4.78125V8.85672C26.8047 8.51155 27.328 7.70859 27.328 6.81899C27.328 5.92938 26.8047 5.12642 26 4.78125"
                  fill="currentColor"
                />
                <rect x="2" y="2" width="21" height="9" rx="2.5" fill="currentColor" />
              </svg>
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
              banks={banks}
              miniBanks={miniBanks}
              locale={locale}
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
              locale={locale}
              bankAccountIdx={bankAccountIdx}
              setBankAccountIdx={setBankAccountIdx}
              onCancel={resetFlow}
              onPay={handleBankPay}
            />
          )}
          {flowStep === 'processing' && <ProcessingScreen locale={locale} />}
          {flowStep === 'app-launch-safari' && <SafariLaunchScreen />}
          {flowStep === 'success' && (
            <SuccessScreen activeBank={activeBank} locale={locale} onReplay={resetFlow} />
          )}
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
  banks: ReadonlyArray<Bank>
  miniBanks: ReadonlyArray<Bank>
  locale: DemoLocale
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
  banks,
  miniBanks,
  locale,
  onTapPredicted,
  tapSelectBank,
  selectBank,
  pickNonBank,
  handleCheckoutCta,
}: CheckoutScreenProps) {
  const pickedBank = pickedIdx != null ? banks[pickedIdx] : null
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
              src="/homepage/product-shoe-blue.webp"
              alt="Northgate Goods Court Runner sneaker in blue"
              width="800"
              height="800"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
          <div className="mck__product-body">
            <div className="mck__product-brand">NORTHGATE GOODS</div>
            <div className="mck__product-title">Court Runner, Blue</div>
            <div className="mck__product-meta">Size 10 · Qty 1 · Free returns</div>
            <div className="mck__product-price num">{locale.price}</div>
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
              <img src={`https://img.logo.dev/${banks[0].domain}?token=${LOGO_DEV_TOKEN}`} alt={`${banks[0].name} logo`} width="38" height="38" />
            </div>
            <div className="mck__opt-info">
              <div className="mck__opt-title">
                <span style={{ whiteSpace: 'nowrap' }}>Pay with {banks[0].name}</span>
              </div>
            </div>
            <span className="mck__save">Save {locale.save}</span>
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
                    <img src={`https://img.logo.dev/${b.domain}?token=${LOGO_DEV_TOKEN}`} alt={`${b.name} logo`} width="18" height="18" />
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
                {banks.map((b, i) => (
                  <button
                    type="button"
                    key={b.name}
                    className={`mck__select-bank ${i === pickedIdx ? 'is-on' : ''}`}
                    onClick={() => selectBank(i)}
                  >
                    <img src={`https://img.logo.dev/${b.domain}?token=${LOGO_DEV_TOKEN}`} alt={`${b.name} logo`} width="22" height="22" />
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

function LaunchScreen({ activeBank }: { activeBank: Bank }) {
  return (
    <div className="bnk__launch" style={{ ['--bnk-brand' as string]: bankBrandColor(activeBank) }}>
      <div className="bnk__launch-icon" aria-hidden="true">
        <img
          src={`https://img.logo.dev/${activeBank.domain}?token=${LOGO_DEV_TOKEN}`}
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

function BankAppScreen({
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
              src={`https://img.logo.dev/${activeBank.domain}?token=${LOGO_DEV_TOKEN}`}
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
            to <strong>Northgate Goods</strong> · via Quidkey
          </div>
        </div>

        {locale.payId ? (
          // AU / Osko: the official PayID confirmation pattern — the PayID mark,
          // who the PayID resolves to (the merchant), and the handle. The bank
          // (CommBank) stays in the top bar.
          <>
            <div className="bnk__sec-h">PayID</div>
            <div className="bnk__payid">
              <img className="bnk__payid-logo" src="/homepage/payid-logo.png" alt="PayID" width="63" height="30" />
              <span className="bnk__payid-label">This PayID is registered to</span>
              <span className="bnk__payid-name">Northgate Goods</span>
              <span className="bnk__payid-handle">{locale.payId}</span>
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
          <span>Pay {locale.price}</span>
        </button>
      </div>
    </>
  )
}

function ProcessingScreen({ locale }: { locale: DemoLocale }) {
  return (
    <div className="bnk__splash">
      <div className="bnk__spinner" aria-hidden="true" />
      <div className="bnk__splash-title">Authorising payment…</div>
      <div className="bnk__splash-sub">Sending {locale.price} to Northgate Goods</div>
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

function SuccessScreen({
  activeBank,
  locale,
  onReplay,
}: {
  activeBank: Bank
  locale: DemoLocale
  onReplay: () => void
}) {
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
        <div className="msuccess__sub">{locale.price} paid from your {activeBank.name} account</div>

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
            <span className="msuccess__saved">{locale.save} vs card</span>
          </div>
          <div className="msuccess__rcpt-row">
            <span>Shipping to</span>
            <span>
              {locale.customer.name} · {locale.customer.postcode}
            </span>
          </div>
        </div>

        <div className="msuccess__hint">
          A receipt has been sent to {locale.customer.email}
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
