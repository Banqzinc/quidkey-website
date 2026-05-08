import { useCallback } from 'react'

import type { Audience } from '@/context/audience'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[][] }
    lintrk?: (event: 'track', payload: { conversion_id: number }) => void
    Snitcher?: { track?: (name: string, properties?: Record<string, unknown>) => void } | unknown[]
  }
}

export type CtaLabel = 'get_started' | 'sign_in' | 'demo' | 'docs' | 'developers' | 'contact'
export type CtaLocation = 'nav' | 'hero' | 'closer' | 'pricing' | 'footer'
export type FlowKind = 'merchant' | 'fintech'
export type ToggleSource = 'nav' | 'hero'

export type HomepageEvent =
  | { name: 'homepage_cta_click'; location: CtaLocation; label: CtaLabel; audience: Audience }
  | { name: 'homepage_audience_toggle'; from: Audience; to: Audience; source: ToggleSource }
  | { name: 'homepage_hero_viz_stage'; flow: FlowKind; stage: number; stageName: string }
  | { name: 'homepage_faq_open'; question: string }
  | { name: 'homepage_pricing_cta_click'; tier: string; audience: Audience }
  | { name: 'homepage_treasury_view' }
  | { name: 'homepage_newsletter_submit'; outcome: 'success' | 'error'; reason?: string }
  | { name: 'homepage_outbound_click'; href: string; label: string }

// LinkedIn Campaign Manager conversion IDs. Replace TBD placeholders with the real
// numeric conversion IDs before this PR is merged. Until then, lintrk fanout is a no-op
// for those CTAs (we never send a TBD ID).
const LINKEDIN_CONVERSION_IDS: Partial<Record<CtaLabel, number>> = {
  // get_started: 0,
  // sign_in: 0,
  // demo: 0,
}

const LINKEDIN_TRACKED_LABELS: ReadonlySet<CtaLabel> = new Set(['get_started', 'sign_in', 'demo'])

function readConsent() {
  if (typeof window === 'undefined') return { statistics: false, marketing: false }
  const c = window.Cookiebot?.consent
  return {
    statistics: Boolean(c?.statistics),
    marketing: Boolean(c?.marketing),
  }
}

function eventParams(event: HomepageEvent): Record<string, unknown> {
  const { name, ...rest } = event
  void name
  return rest as Record<string, unknown>
}

function sendGa(event: HomepageEvent) {
  if (typeof window === 'undefined') return
  if (typeof window.gtag !== 'function') return
  try {
    window.gtag('event', event.name, eventParams(event))
  } catch {
    // best-effort
  }
}

function sendClarity(event: HomepageEvent) {
  if (typeof window === 'undefined') return
  if (typeof window.clarity !== 'function') return
  try {
    window.clarity('event', event.name)
    for (const [key, value] of Object.entries(eventParams(event))) {
      if (value === undefined || value === null) continue
      window.clarity('set', key, String(value))
    }
  } catch {
    // best-effort
  }
}

function sendLinkedIn(event: HomepageEvent) {
  if (typeof window === 'undefined') return
  if (typeof window.lintrk !== 'function') return
  if (event.name !== 'homepage_cta_click') return
  if (!LINKEDIN_TRACKED_LABELS.has(event.label)) return

  const conversionId = LINKEDIN_CONVERSION_IDS[event.label]
  if (typeof conversionId !== 'number') return

  try {
    window.lintrk('track', { conversion_id: conversionId })
  } catch {
    // best-effort
  }
}

function sendSnitcher(event: HomepageEvent) {
  if (typeof window === 'undefined') return
  const sn = window.Snitcher
  if (!sn) return
  // After Snitcher is fully bootstrapped, sn.track is a function. Before bootstrap,
  // sn is the queue array with a track method that pushes into the queue. Both shapes
  // expose .track on the same value, so this works in either state.
  const track = (sn as { track?: (name: string, properties?: Record<string, unknown>) => void }).track
  if (typeof track !== 'function') return
  try {
    track(event.name, eventParams(event))
  } catch {
    // best-effort
  }
}

export function track(event: HomepageEvent): void {
  if (typeof window === 'undefined') return

  const consent = readConsent()

  if (consent.statistics) {
    sendGa(event)
    sendClarity(event)
  }
  if (consent.marketing) {
    sendLinkedIn(event)
    sendSnitcher(event)
  }
}

export function useTrack(): (event: HomepageEvent) => void {
  return useCallback(track, [])
}
