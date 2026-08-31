// Which screens the hero demo walks through, per market.
//
// The markets differ in where Quidkey sits, not just in bank branding:
//
//   AU  PayTo. Quidkey hosts the agreement setup (pay.quidkey.com) before the
//       bank app, where the shopper approves a standing PayTo agreement.
//   US  Open Banking over ACH. Quidkey verifies the mobile before handing off,
//       then picks the funding account after the bank returns.
//   UK  Open Banking / Faster Payments. The bank does the SCA, so there is no
//   EU  Open Banking / SEPA Instant.   Quidkey-hosted step at all.
//
// The demo advances with advance() — "next step in this region's flow" — so the
// timer chains in merchant-hero-viz.tsx stay market-agnostic.

import type { DemoRegion } from '@/lib/demo-region'

export type FlowStep =
  | 'checkout'
  | 'qk-payto' // AU — Quidkey-hosted PayTo setup (entry → verify → waiting)
  | 'qk-verify' // US — Quidkey-hosted mobile verification
  | 'redirect'
  | 'launch'
  | 'login'
  | 'faceid' // AU — bank push handoff: Face ID runs on its own, no login form
  | 'bank'
  | 'qk-accounts' // US — Quidkey-hosted funding-account picker
  | 'processing'
  | 'app-launch-safari'
  | 'success'

const BANK_HANDOFF = ['redirect', 'launch', 'login', 'bank'] as const
const RETURN_TO_MERCHANT = ['processing', 'app-launch-safari', 'success'] as const

export const FLOWS: Record<DemoRegion, readonly FlowStep[]> = {
  // AU has no app launch or login form: the bank's PayTo push notification put
  // the shopper straight into the app, so Face ID fires by itself.
  AU: ['checkout', 'qk-payto', 'redirect', 'faceid', 'bank', ...RETURN_TO_MERCHANT],
  UK: ['checkout', ...BANK_HANDOFF, ...RETURN_TO_MERCHANT],
  EU: ['checkout', ...BANK_HANDOFF, ...RETURN_TO_MERCHANT],
  // The US bank leg CONNECTS accounts rather than paying: redirect lands on
  // the login surface (no app-icon zoom) where Face ID runs on its own, the
  // consent is authorised, the "connecting account" splash plays, and only
  // then does Quidkey's picker take the actual payment.
  US: ['checkout', 'qk-verify', 'redirect', 'login', 'bank', 'processing', 'qk-accounts', 'app-launch-safari', 'success'],
}

// Stable analytics names — these do NOT renumber when a market's flow changes,
// unlike the stage index, which is the position within the active flow.
export const STAGE_NAMES: Record<FlowStep, string> = {
  checkout: 'checkout',
  'qk-payto': 'quidkey_payto_setup',
  'qk-verify': 'quidkey_verify_mobile',
  redirect: 'redirect_to_bank',
  launch: 'bank_app_launching',
  login: 'bank_login',
  faceid: 'bank_faceid',
  bank: 'bank_authorize',
  'qk-accounts': 'quidkey_choose_account',
  processing: 'bank_processing',
  'app-launch-safari': 'safari_launching',
  success: 'merchant_success',
}

export function flowFor(region: DemoRegion): readonly FlowStep[] {
  return FLOWS[region]
}

export function stageIndex(region: DemoRegion, step: FlowStep): number {
  return FLOWS[region].indexOf(step)
}

// The step after `step` in this region's flow. Returns `step` unchanged when it
// is already the last one (or somehow not in the flow), so a stray advance()
// can never strand the demo on a screen the region doesn't render.
export function nextStep(region: DemoRegion, step: FlowStep): FlowStep {
  const flow = FLOWS[region]
  const i = flow.indexOf(step)
  if (i < 0 || i === flow.length - 1) return step
  return flow[i + 1]
}
