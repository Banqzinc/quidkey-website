import { describe, expect, it } from 'vitest'

import {
  computeDetailed,
  computeQuick,
  computeSavings,
  describeSalaryEquivalent,
} from './surcharge-fees'

// Every expected value below is hand-computed from the spec's rate table so a
// regression in the math shows up as a failing number, not a re-derived one.
// Defaults: $500,000/month card turnover, 1.4% blended rate, $100 AOV.
// Annual volume = 500,000 x 12 = 6,000,000.

describe('computeQuick', () => {
  it('matches the article worked example ($6m at 1.4% = $84,000/yr)', () => {
    const r = computeQuick({ monthlyTurnover: 500_000, ratePercent: 1.4 })
    expect(r.annualVolume).toBe(6_000_000)
    expect(r.annualCost).toBeCloseTo(84_000, 6)
    expect(r.monthlyCost).toBeCloseTo(7_000, 6)
    // 84,000 / 88,400 median full-time salary
    expect(r.salaryEquivalent).toBeCloseTo(0.950226, 5)
  })

  it('is all zeros at zero turnover', () => {
    const r = computeQuick({ monthlyTurnover: 0, ratePercent: 1.4 })
    expect(r.annualVolume).toBe(0)
    expect(r.annualCost).toBe(0)
    expect(r.monthlyCost).toBe(0)
    expect(r.salaryEquivalent).toBe(0)
  })
})

describe('describeSalaryEquivalent', () => {
  it('avoids the awkward "about 1.0x" phrasing near parity', () => {
    // The default $84,000 case lands at 0.95 salaries.
    const text = describeSalaryEquivalent(0.95)
    expect(text).toContain('almost the cost of another full-time employee')
    expect(text).not.toContain('1.0')
  })

  it('states a multiple once the bill is clearly more than one salary', () => {
    expect(describeSalaryEquivalent(1.9)).toContain('1.9×')
  })

  it('states a percentage when the bill is well under one salary', () => {
    expect(describeSalaryEquivalent(0.4)).toContain('40%')
  })

  it('says nothing at all for trivially small amounts', () => {
    expect(describeSalaryEquivalent(0.05)).toBeNull()
    expect(describeSalaryEquivalent(0)).toBeNull()
  })
})

describe('computeDetailed', () => {
  const input = {
    monthlyTurnover: 500_000,
    averageOrderValue: 100,
    creditPercent: 1.4,
    businessPercent: 1.8,
    amexPercent: 2.2,
    foreignPercent: 5.5,
  }

  it('builds one line per card type with hand-computed annual costs', () => {
    const r = computeDetailed(input)
    const byId = Object.fromEntries(r.lines.map((l) => [l.id, l]))

    // debit: 2,400,000 vol / 24,000 txns -> 12,000 + 7,200
    expect(byId.debit.annualVolume).toBeCloseTo(2_400_000, 6)
    expect(byId.debit.annualTransactions).toBeCloseTo(24_000, 6)
    expect(byId.debit.annualCost).toBeCloseTo(19_200, 6)

    // credit: 2,100,000 vol / 21,000 txns -> 29,400 + 6,300
    expect(byId.credit.annualCost).toBeCloseTo(35_700, 6)

    // business: 600,000 vol / 6,000 txns -> 10,800 + 1,800
    expect(byId.business.annualCost).toBeCloseTo(12_600, 6)

    // amex: 480,000 vol, percentage only -> 10,560
    expect(byId.amex.annualCost).toBeCloseTo(10_560, 6)
    expect(byId.amex.fixedPerTransaction).toBe(0)

    // foreign: 420,000 vol, percentage only -> 23,100
    expect(byId.foreign.annualCost).toBeCloseTo(23_100, 6)
    expect(byId.foreign.fixedPerTransaction).toBe(0)
  })

  it('totals the lines and derives the blended effective rate', () => {
    const r = computeDetailed(input)
    // 19,200 + 35,700 + 12,600 + 10,560 + 23,100
    expect(r.annualCost).toBeCloseTo(101_160, 6)
    expect(r.annualVolume).toBeCloseTo(6_000_000, 6)
    expect(r.effectiveRatePercent).toBeCloseTo(1.686, 6)
  })

  it('floors average order value to 1 so fixed fees never divide by zero', () => {
    const r = computeDetailed({ ...input, averageOrderValue: 0 })
    expect(Number.isFinite(r.annualCost)).toBe(true)
    // debit: 2,400,000 txns x $0.30 = 720,000 + 12,000 percentage
    const debit = r.lines.find((l) => l.id === 'debit')!
    expect(debit.annualTransactions).toBeCloseTo(2_400_000, 6)
    expect(debit.annualCost).toBeCloseTo(732_000, 6)
  })

  it('keeps the mix shares summing to 1', () => {
    const r = computeDetailed(input)
    const total = r.lines.reduce((sum, l) => sum + l.mixShare, 0)
    expect(total).toBeCloseTo(1, 10)
  })
})

describe('computeSavings', () => {
  const input = {
    monthlyTurnover: 500_000,
    averageOrderValue: 100,
    creditPercent: 1.4,
    businessPercent: 1.8,
    amexPercent: 2.2,
    foreignPercent: 5.5,
    steerPercent: 30,
  }

  it('computes both savings levers at a 30% steer', () => {
    const r = computeSavings(input)

    // domestic volume = 2,400,000 + 2,100,000 + 600,000 = 5,100,000
    // steered = 30% -> 1,530,000
    expect(r.steeredVolume).toBeCloseTo(1_530_000, 6)
    // domestic cost = 19,200 + 35,700 + 12,600 = 67,500; 30% -> 20,250
    expect(r.currentSteeredCost).toBeCloseTo(20_250, 6)
    // PayTo: 1,530,000 x 0.5% = 7,650 + 15,300 txns x $0.30 = 4,590
    expect(r.payToCost).toBeCloseTo(12_240, 6)
    expect(r.steeringSavings).toBeCloseTo(8_010, 6)
    // foreign: 23,100 today vs 420,000 x 2% = 8,400 with Quidkey
    expect(r.foreignCardSavings).toBeCloseTo(14_700, 6)
    expect(r.totalSavings).toBeCloseTo(22_710, 6)
    expect(r.newAnnualCost).toBeCloseTo(78_450, 6)
    expect(r.savingsPercent).toBeCloseTo(22.449585, 5)
  })

  it('reports a raw negative foreign lever but never a negative total', () => {
    // A foreign rate below Quidkey's 2% means switching costs more, not less.
    const r = computeSavings({ ...input, foreignPercent: 1.5 })
    // 420,000 x 1.5% = 6,300 today vs 8,400 with Quidkey
    expect(r.foreignCardSavings).toBeCloseTo(-2_100, 6)
    expect(r.totalSavings).toBeGreaterThan(0)
    // total excludes the negative lever entirely
    expect(r.totalSavings).toBeCloseTo(r.steeringSavings, 6)
  })

  it('saves nothing when no volume is steered and foreign matches Quidkey', () => {
    const r = computeSavings({ ...input, steerPercent: 0, foreignPercent: 2 })
    expect(r.steeringSavings).toBeCloseTo(0, 6)
    expect(r.foreignCardSavings).toBeCloseTo(0, 6)
    expect(r.totalSavings).toBeCloseTo(0, 6)
    expect(r.savingsPercent).toBeCloseTo(0, 6)
  })

  it('is all zeros at zero turnover', () => {
    const r = computeSavings({ ...input, monthlyTurnover: 0 })
    expect(r.totalSavings).toBe(0)
    expect(r.savingsPercent).toBe(0)
    expect(r.newAnnualCost).toBe(0)
  })
})
