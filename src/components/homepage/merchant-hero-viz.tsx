// Merchant hero viz — the interactive Pay-by-Bank demo in the hero.
//
// This file is the container only: it owns the flow state, the timer chains,
// the analytics, and the coach-mark orchestration. Every screen lives in
// ./demo, the per-market step order lives in demo-flows.ts, the market content
// in demo-locales.ts, and the merchant in demo-merchant.ts.
//
// The flow shape is market-dependent — AU and US pass through Quidkey-hosted
// screens that UK and EU don't have — so the demo never hardcodes "the next
// screen": it asks demo-flows for the step after the current one.
//
// Differences from the prototype:
// - The "scribble" tutorial overlay is a simplified port; tweaks.demoHint /
//   tweaks.demoChrome are dropped (design-time only).
// - Apple Pay / Card / PayPal stay visible but only the bank flows progress.
//
// Tracking: every flow-step transition fires homepage_hero_viz_stage with the
// stage index (within the active market's flow) and the stable stage name,
// throttled so re-renders never duplicate-fire.

import { useEffect, useRef, useState } from 'react'

import { DemoRegionSwitcher } from '@/components/homepage/demo-region-switcher'
import { DEMO_LOCALES, type Bank } from '@/components/homepage/demo-locales'
import { STAGE_NAMES, flowFor, nextStep, stageIndex, type FlowStep } from '@/components/homepage/demo-flows'
import { CheckoutScreen } from '@/components/homepage/demo/checkout-screen'
import {
  BankAppScreen,
  LaunchScreen,
  LoginScreen,
  ProcessingScreen,
  RedirectScreen,
  SafariLaunchScreen,
} from '@/components/homepage/demo/bank-screens'
import {
  QkAccountsScreen,
  QkPayToScreen,
  QkVerifyScreen,
} from '@/components/homepage/demo/quidkey-screens'
import { SuccessScreen } from '@/components/homepage/demo/success-screen'
import type { FaceIdState, PaymentMethod } from '@/components/homepage/demo/shared'
import { ScribbleHint, type ScribbleStage } from '@/components/homepage/scribble-hint'
import { useDemoRegion } from '@/context/demo-region'
import { track } from '@/lib/track'

// Steps that move on by themselves, and how long they linger first. Everything
// else waits for the visitor (or the screen's own internal phases).
const AUTO_ADVANCE_MS: Partial<Record<FlowStep, number>> = {
  redirect: 800,
  launch: 1100,
  processing: 1500,
  'app-launch-safari': 1000,
}

// Hand-drawn callouts overlaid on the viz. `screen` matches a FlowStep and `id`
// matches the data-hint-id on the target element inside the phone. Stages whose
// screen isn't in the active market's flow are filtered out, so the tour is
// three steps shorter in the UK and EU than it is in Australia.
const SCRIBBLE_STAGES: ScribbleStage[] = [
  { screen: 'checkout', id: 'predicted-bank', label: "Customer's predicted bank" },
  { screen: 'checkout', id: 'select-bank', label: 'They can still pick any other bank' },
  { screen: 'checkout', id: 'checkout-cta', label: 'One tap to pay' },
  { screen: 'qk-payto', id: 'qk-payto', label: 'Quidkey sets up the PayTo agreement' },
  { screen: 'qk-verify', id: 'qk-verify', label: 'Quidkey checks it’s really them' },
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
  { screen: 'qk-accounts', id: 'qk-accounts', label: 'Choose which account pays' },
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

  // Region drives the bank set, the currency, the receipt copy — and the flow.
  const { region } = useDemoRegion()
  const locale = DEMO_LOCALES[region]
  const banks = locale.banks
  const flow = flowFor(region)
  const stages = SCRIBBLE_STAGES.filter((s) => flow.includes(s.screen as FlowStep))

  const flowTimers = useRef<ReturnType<typeof setTimeout>[]>([])
  const queue = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms)
    flowTimers.current.push(id)
  }
  const clearTimers = () => {
    flowTimers.current.forEach(clearTimeout)
    flowTimers.current = []
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
      stage: stageIndex(region, flowStep),
      stageName: STAGE_NAMES[flowStep],
      region,
    })
    // The step guard above means a re-render won't re-fire; a region change
    // resets the demo to checkout, which is a real transition and does.
  }, [flowStep, region])

  const resetFlow = () => {
    clearTimers()
    setFlowStep('checkout')
    setBankAccountIdx(0)
    setFaceIdState('idle')
  }

  // Switching market mid-flow would otherwise strand the phone on a screen the
  // new market never renders (e.g. qk-payto in the UK). Start it over instead.
  useEffect(() => {
    clearTimers()
    setFlowStep('checkout')
    setBankAccountIdx(0)
    setFaceIdState('idle')
    setScribbleIdx(0)
  }, [region])

  // Move to a specific step, scheduling whatever it auto-advances to next.
  const goTo = (step: FlowStep) => {
    setFlowStep(step)
    const delay = AUTO_ADVANCE_MS[step]
    if (delay != null) queue(() => goTo(nextStep(region, step)), delay)
  }
  // Move to whatever comes after the step we're on in this market's flow.
  const advance = (from: FlowStep) => goTo(nextStep(region, from))

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
    advance('checkout')
  }

  const runFaceId = () => {
    setFaceIdState('scanning')
    queue(() => setFaceIdState('approved'), 1000)
    queue(() => {
      goTo(nextStep(region, 'login'))
      setFaceIdState('idle')
    }, 1900)
  }

  const handleFaceIdComplete = () => {
    noteUserAction()
    runFaceId()
  }

  const handleBankPay = () => {
    noteUserAction()
    advance('bank')
  }

  // ─── Scribble stage orchestration ─────────────────────────────────
  // Each checkout stage configures the demo's visual state so the label always
  // matches what the visitor is looking at on the phone screen.
  useEffect(() => {
    const stage = stages[scribbleIdx]
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
    // Intentional: only re-run when scribbleIdx changes. Including flowStep
    // would re-trigger the setup whenever the demo advances.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scribbleIdx])

  // When the demo advances to a new screen (the visitor taps the CTA, or a
  // timer chain moves flowStep), follow it. A functional updater keeps
  // scribbleIdx out of the deps so we don't fight manual prev/next clicks
  // within the same screen.
  useEffect(() => {
    setScribbleIdx((idx) => {
      const cur = stages[idx]
      if (cur && cur.screen === flowStep) return idx
      const next = stages.findIndex((s) => s.screen === flowStep)
      return next >= 0 ? next : idx
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowStep, region])

  // Next on a stage that maps to a demo action drives the DEMO, not just the
  // label. We inline the transitions rather than calling the handlers above
  // because those all call noteUserAction(), and counting scribble navigation
  // as user clicks would suppress the hint after 3 Next presses — which is
  // roughly enough to reach the success screen. The prototype does the same.
  const scribbleNext = () => {
    const stage = stages[scribbleIdx]
    if (!stage) return
    const screen = stage.screen as FlowStep

    // The last checkout stage is the one that starts the payment.
    const isLastCheckoutStage =
      screen === 'checkout' && stages[scribbleIdx + 1]?.screen !== 'checkout'

    if (screen === 'success') {
      resetFlow()
      setScribbleIdx(0)
      return
    }
    if (screen === 'login' && flowStep === 'login') {
      runFaceId()
      return
    }
    if ((isLastCheckoutStage || screen !== 'checkout') && screen === flowStep) {
      advance(screen)
      return
    }
    setScribbleIdx((i) => Math.min(i + 1, stages.length - 1))
  }

  const scribblePrev = () => {
    const newIdx = Math.max(scribbleIdx - 1, 0)
    const target = stages[newIdx]
    // If we're crossing into a different screen, rewind the phone there so the
    // visitor actually sees what the new stage's label points at. More
    // aggressive than the prototype (which just hides the scribble until
    // flowStep happens to match) but produces expected back-navigation.
    if (target && target.screen !== flowStep) {
      clearTimers()
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
      <DemoRegionSwitcher />
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

          {flowStep === 'qk-payto' && (
            <QkPayToScreen locale={locale} onDone={() => advance('qk-payto')} />
          )}
          {flowStep === 'qk-verify' && (
            <QkVerifyScreen locale={locale} activeBank={activeBank} onDone={() => advance('qk-verify')} />
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

          {flowStep === 'qk-accounts' && (
            <QkAccountsScreen locale={locale} activeBank={activeBank} onDone={() => advance('qk-accounts')} />
          )}

          {flowStep === 'processing' && <ProcessingScreen locale={locale} />}
          {flowStep === 'app-launch-safari' && <SafariLaunchScreen />}
          {flowStep === 'success' && (
            <SuccessScreen activeBank={activeBank} locale={locale} onReplay={resetFlow} />
          )}
        </div>
      </div>
      <ScribbleHint
        stages={stages}
        currentIdx={scribbleIdx}
        flowStep={flowStep}
        suppressed={hintSuppressed}
        onPrev={scribblePrev}
        onNext={scribbleNext}
      />
    </div>
  )
}
