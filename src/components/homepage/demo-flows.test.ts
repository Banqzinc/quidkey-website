import { describe, expect, it } from 'vitest'

import { KNOWN_REGIONS } from '@/lib/demo-region'

import { FLOWS, STAGE_NAMES, flowFor, nextStep, stageIndex, type FlowStep } from './demo-flows'

describe('FLOWS', () => {
  it('covers every market, starting at checkout and ending at success', () => {
    for (const region of KNOWN_REGIONS) {
      const flow = flowFor(region)
      expect(flow[0]).toBe('checkout')
      expect(flow[flow.length - 1]).toBe('success')
    }
  })

  it('never repeats a step within a market', () => {
    for (const region of KNOWN_REGIONS) {
      const flow = flowFor(region)
      expect(new Set(flow).size).toBe(flow.length)
    }
  })

  it('names every step it can reach', () => {
    for (const region of KNOWN_REGIONS) {
      for (const step of flowFor(region)) {
        expect(STAGE_NAMES[step]).toBeTruthy()
      }
    }
  })

  it('puts the Quidkey-hosted steps only where the rails need them', () => {
    // AU sets up a PayTo agreement before the bank; the US verifies the mobile
    // before and picks the funding account after; UK/EU hand straight over.
    expect(FLOWS.AU).toContain('qk-payto')
    expect(FLOWS.US).toContain('qk-verify')
    expect(FLOWS.US).toContain('qk-accounts')
    for (const region of ['UK', 'EU'] as const) {
      for (const step of ['qk-payto', 'qk-verify', 'qk-accounts'] as FlowStep[]) {
        expect(FLOWS[region]).not.toContain(step)
      }
    }
  })

  it('runs the US account picker after the bank, not before', () => {
    expect(FLOWS.US.indexOf('qk-accounts')).toBeGreaterThan(FLOWS.US.indexOf('bank'))
    expect(FLOWS.US.indexOf('qk-verify')).toBeLessThan(FLOWS.US.indexOf('redirect'))
  })

  it('gives AU the push-notification handoff: auto Face ID, no app launch or login', () => {
    // PayTo arrives as a bank push notification — the shopper is already in
    // the app, so AU never shows the login form. Everyone else still does.
    expect(FLOWS.AU).toContain('faceid')
    expect(FLOWS.AU).not.toContain('launch')
    expect(FLOWS.AU).not.toContain('login')
    for (const region of ['UK', 'EU', 'US'] as const) {
      expect(FLOWS[region]).toContain('login')
      expect(FLOWS[region]).not.toContain('faceid')
    }
  })
})

describe('nextStep', () => {
  it('walks a market through its whole flow', () => {
    for (const region of KNOWN_REGIONS) {
      const flow = flowFor(region)
      let step: FlowStep = 'checkout'
      const walked: FlowStep[] = [step]
      for (let i = 0; i < flow.length; i += 1) {
        const next = nextStep(region, step)
        if (next === step) break
        step = next
        walked.push(step)
      }
      expect(walked).toEqual([...flow])
    }
  })

  it('stops on the last step rather than falling off the end', () => {
    expect(nextStep('UK', 'success')).toBe('success')
  })

  it('leaves a step that is not in this market alone', () => {
    // qk-payto is AU-only; a stale UK transition must not strand the demo.
    expect(nextStep('UK', 'qk-payto')).toBe('qk-payto')
  })

  it('skips the steps a market does not have', () => {
    expect(nextStep('UK', 'checkout')).toBe('redirect')
    expect(nextStep('AU', 'checkout')).toBe('qk-payto')
    expect(nextStep('US', 'checkout')).toBe('qk-verify')
    expect(nextStep('AU', 'redirect')).toBe('faceid')
    expect(nextStep('AU', 'faceid')).toBe('bank')
    expect(nextStep('AU', 'bank')).toBe('processing')
    expect(nextStep('US', 'bank')).toBe('qk-accounts')
  })
})

describe('stageIndex', () => {
  it('is the position within the active market, so it renumbers per market', () => {
    expect(stageIndex('UK', 'redirect')).toBe(1)
    expect(stageIndex('AU', 'redirect')).toBe(2)
  })

  it('is -1 for a step the market never reaches', () => {
    expect(stageIndex('EU', 'qk-verify')).toBe(-1)
  })
})
