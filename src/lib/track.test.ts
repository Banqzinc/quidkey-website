import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { track } from './track'

type GtagFn = (...args: unknown[]) => void
type ClarityFn = (...args: unknown[]) => void
type LintrkFn = (event: 'track', payload: { conversion_id: number }) => void
type SnitcherTrack = (name: string, properties?: Record<string, unknown>) => void

type WindowShape = {
  gtag?: GtagFn
  clarity?: ClarityFn
  lintrk?: LintrkFn
  Snitcher?: { track?: SnitcherTrack }
  Cookiebot?: { consent?: { statistics?: boolean; marketing?: boolean } }
}

function setupWindow(consent: { statistics?: boolean; marketing?: boolean }) {
  const w: WindowShape = {}
  const calls = {
    gtag: vi.fn() as GtagFn & ReturnType<typeof vi.fn>,
    clarity: vi.fn() as ClarityFn & ReturnType<typeof vi.fn>,
    lintrk: vi.fn() as LintrkFn & ReturnType<typeof vi.fn>,
    snitcherTrack: vi.fn() as SnitcherTrack & ReturnType<typeof vi.fn>,
  }
  w.gtag = calls.gtag
  w.clarity = calls.clarity
  w.lintrk = calls.lintrk
  w.Snitcher = { track: calls.snitcherTrack }
  w.Cookiebot = { consent }

  // @ts-expect-error -- assigning to global window for the duration of the test
  globalThis.window = w
  return calls
}

describe('track()', () => {
  beforeEach(() => {
    // Each test sets up its own window; nothing to do here.
  })

  afterEach(() => {
    // @ts-expect-error -- tear down the synthetic window after each test
    delete globalThis.window
  })

  it('fans out a basic CTA click to GA and Clarity when statistics consent is granted', () => {
    const calls = setupWindow({ statistics: true, marketing: false })

    track({ name: 'homepage_cta_click', location: 'nav', label: 'sign_in', audience: 'merchants' })

    expect(calls.gtag).toHaveBeenCalledWith('event', 'homepage_cta_click', {
      location: 'nav',
      label: 'sign_in',
      audience: 'merchants',
    })
    expect(calls.clarity).toHaveBeenCalledWith('event', 'homepage_cta_click')
    expect(calls.clarity).toHaveBeenCalledWith('set', 'location', 'nav')
    expect(calls.clarity).toHaveBeenCalledWith('set', 'label', 'sign_in')
    expect(calls.clarity).toHaveBeenCalledWith('set', 'audience', 'merchants')
  })

  it('does not fan out to LinkedIn or Snitcher when marketing consent is denied', () => {
    const calls = setupWindow({ statistics: true, marketing: false })

    track({ name: 'homepage_cta_click', location: 'nav', label: 'sign_in', audience: 'merchants' })

    expect(calls.lintrk).not.toHaveBeenCalled()
    expect(calls.snitcherTrack).not.toHaveBeenCalled()
  })

  it('fans out to Snitcher when marketing consent is granted', () => {
    const calls = setupWindow({ statistics: false, marketing: true })

    track({ name: 'homepage_audience_toggle', from: 'merchants', to: 'fintechs', source: 'nav' })

    expect(calls.snitcherTrack).toHaveBeenCalledWith('homepage_audience_toggle', {
      from: 'merchants',
      to: 'fintechs',
      source: 'nav',
    })
    expect(calls.gtag).not.toHaveBeenCalled()
    expect(calls.clarity).not.toHaveBeenCalled()
  })

  it('does not fire LinkedIn for non-tracked CTA labels', () => {
    const calls = setupWindow({ statistics: true, marketing: true })

    track({ name: 'homepage_cta_click', location: 'footer', label: 'docs', audience: 'merchants' })

    expect(calls.lintrk).not.toHaveBeenCalled()
  })

  it('does not fire LinkedIn for tracked CTA labels until a real conversion ID is configured', () => {
    // The shipped LINKEDIN_CONVERSION_IDS map is empty (TBD until LinkedIn Campaign
    // Manager IDs are filled in pre-merge), so even a get_started click is a no-op
    // for lintrk. This test pins that behavior so we don't accidentally start firing
    // with placeholder IDs.
    const calls = setupWindow({ statistics: true, marketing: true })

    track({ name: 'homepage_cta_click', location: 'hero', label: 'get_started', audience: 'merchants' })

    expect(calls.lintrk).not.toHaveBeenCalled()
  })

  it('is a no-op when both consent categories are denied', () => {
    const calls = setupWindow({ statistics: false, marketing: false })

    track({ name: 'homepage_treasury_view' })

    expect(calls.gtag).not.toHaveBeenCalled()
    expect(calls.clarity).not.toHaveBeenCalled()
    expect(calls.lintrk).not.toHaveBeenCalled()
    expect(calls.snitcherTrack).not.toHaveBeenCalled()
  })

  it('never throws when a destination throws internally', () => {
    const calls = setupWindow({ statistics: true, marketing: true })
    calls.gtag.mockImplementation(() => {
      throw new Error('boom')
    })
    calls.clarity.mockImplementation(() => {
      throw new Error('boom')
    })
    calls.snitcherTrack.mockImplementation(() => {
      throw new Error('boom')
    })

    expect(() =>
      track({ name: 'homepage_faq_open', question: 'How fast does Quidkey settle?' })
    ).not.toThrow()
  })
})
