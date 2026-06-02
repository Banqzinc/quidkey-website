import { describe, expect, it } from 'vitest'

import { compute } from './fees'

describe('compute', () => {
  // Canonical scenario the calculator opens with: Plus plan, A$50k domestic +
  // A$20k international per month at A$100 AOV. The calculator passes
  // includeThirdPartyFee=false for Plus (Plus never pays the third-party fee).
  it('matches the hand-computed Plus-plan baseline', () => {
    const c = compute({
      domesticVolume: 50000,
      crossBorderVolume: 20000,
      averageOrderValue: 100,
      plan: 'plus',
      includeThirdPartyFee: false,
    })

    // 500 domestic orders, 200 international orders at A$100 AOV.
    expect(c.domesticTransactions).toBe(500)
    expect(c.crossBorderTransactions).toBe(200)

    // Shopify Plus: 1.2% + $0.30 domestic, 5.0% all-in + $0.30 international.
    expect(c.shopifyDomesticFee).toBe(750) // 50000*1.2% + 500*0.30
    expect(c.shopifyCrossBorderFee).toBe(1060) // 20000*5.0% + 200*0.30
    expect(c.shopifyTotal).toBe(1810)

    // Quidkey Plus: 0.5% + $0.30 domestic, 2.0% + $0.30 international.
    expect(c.quidkeyDomesticFee).toBe(400) // 50000*0.5% + 500*0.30
    expect(c.quidkeyCrossBorderFee).toBe(460) // 20000*2.0% + 200*0.30
    expect(c.thirdPartyFee).toBe(0)
    expect(c.quidkeyTotal).toBe(860)

    expect(c.monthlySavings).toBe(950)
    expect(c.annualSavings).toBe(11400)
    expect(c.totalVolume).toBe(70000)
    expect(c.shopifyEffectiveRate).toBeCloseTo(2.586, 3)
    expect(c.quidkeyEffectiveRate).toBeCloseTo(1.229, 3)
  })

  // The third-party transaction fee is a Shopify charge for using a non-Shopify
  // gateway, so it lands on the Quidkey (cost-of-switching) side only when
  // requested.
  it('applies the third-party fee to the Quidkey total only when included', () => {
    const base = {
      domesticVolume: 50000,
      crossBorderVolume: 20000,
      averageOrderValue: 100,
      plan: 'advanced',
    } as const

    const without = compute({ ...base, includeThirdPartyFee: false })
    const withFee = compute({ ...base, includeThirdPartyFee: true })

    expect(without.thirdPartyFee).toBe(0)
    expect(withFee.thirdPartyFee).toBe(420) // 70000 * 0.6%
    expect(withFee.quidkeyTotal).toBeCloseTo(without.quidkeyTotal + 420, 6)
    // The third-party fee never touches the Shopify side.
    expect(withFee.shopifyTotal).toBe(without.shopifyTotal)
  })

  it('avoids divide-by-zero when average order value is zero', () => {
    const c = compute({
      domesticVolume: 10000,
      crossBorderVolume: 0,
      averageOrderValue: 0,
      plan: 'basic',
      includeThirdPartyFee: false,
    })
    expect(Number.isFinite(c.shopifyTotal)).toBe(true)
    expect(Number.isFinite(c.quidkeyTotal)).toBe(true)
    // AOV floored to 1 → 10000 domestic "orders".
    expect(c.domesticTransactions).toBe(10000)
  })
})
