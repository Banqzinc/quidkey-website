import { describe, expect, it } from 'vitest'

import {
  DEFAULT_CARD_MIX,
  DEFAULT_FIXED_PER_TRANSACTION,
  computeDetailed,
  computeQuick,
  computeSavings,
  isEnterpriseVolume,
} from './surcharge-fees'

// Every expected value below is hand-computed from the spec's rate table so a
// regression in the math shows up as a failing number, not a re-derived one.
// Defaults mirror Stripe AU standard pricing: $500,000/month card turnover at
// 1.7% + $0.30, $100 average transaction.
// Annual volume = 500,000 x 12 = 6,000,000, split 58/17/13/12 across consumer
// credit, business credit, Amex and foreign-issued cards.

describe('computeQuick', () => {
  const input = {
    monthlyTurnover: 500_000,
    ratePercent: 1.7,
    averageOrderValue: 100,
    fixedPerTransaction: DEFAULT_FIXED_PER_TRANSACTION,
  }

  it('adds the per-transaction fee to the percentage cost', () => {
    const r = computeQuick(input)
    expect(r.annualVolume).toBe(6_000_000)
    expect(r.annualTransactions).toBeCloseTo(60_000, 6)
    // 6,000,000 x 1.7% = 102,000, + 60,000 x $0.30 = 18,000
    expect(r.annualCost).toBeCloseTo(120_000, 6)
    expect(r.monthlyCost).toBeCloseTo(10_000, 6)
  })

  it("reproduces the article's percentage-only figure", () => {
    // The blog post works through $6m at 1.4% = $84,000 with no fixed fee.
    const r = computeQuick({ ...input, ratePercent: 1.4, fixedPerTransaction: 0 })
    expect(r.annualCost).toBeCloseTo(84_000, 6)
  })

  it('floors average transaction value to 1 rather than dividing by zero', () => {
    const r = computeQuick({ ...input, averageOrderValue: 0 })
    expect(Number.isFinite(r.annualCost)).toBe(true)
    expect(r.annualTransactions).toBeCloseTo(6_000_000, 6)
  })

  it('is all zeros at zero turnover', () => {
    const r = computeQuick({ ...input, monthlyTurnover: 0 })
    expect(r.annualVolume).toBe(0)
    expect(r.annualCost).toBe(0)
    expect(r.monthlyCost).toBe(0)
  })
})

describe('isEnterpriseVolume', () => {
  it('measures the $20m threshold against ANNUAL volume, not monthly', () => {
    // $1,666,667/month is $20,000,004 a year, so it just clears the line.
    expect(isEnterpriseVolume(1_666_667)).toBe(true)
    // $1,666,666/month is $19,999,992 a year, so it does not.
    expect(isEnterpriseVolume(1_666_666)).toBe(false)
    // The default $500,000/month ($6m a year) stays self-serve.
    expect(isEnterpriseVolume(500_000)).toBe(false)
    expect(isEnterpriseVolume(1_500_000)).toBe(false)
    expect(isEnterpriseVolume(1_000_000_000)).toBe(true)
    expect(isEnterpriseVolume(0)).toBe(false)
  })
})

describe('computeDetailed', () => {
  const input = {
    monthlyTurnover: 500_000,
    averageOrderValue: 100,
    mix: DEFAULT_CARD_MIX,
    fixedPerTransaction: DEFAULT_FIXED_PER_TRANSACTION,
    creditPercent: 1.7,
    businessPercent: 1.8,
    amexPercent: 2.2,
    foreignPercent: 5.5,
  }

  it('builds one line per card type with hand-computed annual costs', () => {
    const r = computeDetailed(input)
    const byId = Object.fromEntries(r.lines.map((l) => [l.id, l]))

    // credit: 3,480,000 vol / 34,800 txns -> 59,160 + 10,440
    expect(byId.credit.annualVolume).toBeCloseTo(3_480_000, 6)
    expect(byId.credit.annualTransactions).toBeCloseTo(34_800, 6)
    expect(byId.credit.annualCost).toBeCloseTo(69_600, 6)

    // business: 1,020,000 vol / 10,200 txns -> 18,360 + 3,060
    expect(byId.business.annualCost).toBeCloseTo(21_420, 6)

    // amex: 780,000 vol, percentage only -> 17,160
    expect(byId.amex.annualCost).toBeCloseTo(17_160, 6)
    expect(byId.amex.fixedPerTransaction).toBe(0)

    // foreign: 720,000 vol, percentage only -> 39,600
    expect(byId.foreign.annualCost).toBeCloseTo(39_600, 6)
    expect(byId.foreign.fixedPerTransaction).toBe(0)
  })

  it('has no domestic debit line', () => {
    // Debit is excluded from the model entirely: it is already the cheapest
    // card to accept, so it only diluted the table.
    expect(computeDetailed(input).lines.map((l) => l.id)).toEqual([
      'credit',
      'business',
      'amex',
      'foreign',
    ])
  })

  it('totals the lines and derives the blended effective rate', () => {
    const r = computeDetailed(input)
    // 69,600 + 21,420 + 17,160 + 39,600
    expect(r.annualCost).toBeCloseTo(147_780, 6)
    expect(r.annualVolume).toBeCloseTo(6_000_000, 6)
    expect(r.effectiveRatePercent).toBeCloseTo(2.463, 6)
  })

  it('floors average order value to 1 so fixed fees never divide by zero', () => {
    const r = computeDetailed({ ...input, averageOrderValue: 0 })
    expect(Number.isFinite(r.annualCost)).toBe(true)
    // credit: 3,480,000 txns x $0.30 = 1,044,000 + 59,160 percentage
    const credit = r.lines.find((l) => l.id === 'credit')!
    expect(credit.annualTransactions).toBeCloseTo(3_480_000, 6)
    expect(credit.annualCost).toBeCloseTo(1_103_160, 6)
  })

  it('reports a fully allocated default mix as 100%', () => {
    expect(computeDetailed(input).mixTotalPercent).toBeCloseTo(100, 8)
  })

  it('honours a custom mix instead of the default', () => {
    // All volume on consumer credit: 6,000,000 at 1.7% + 60,000 txns x $0.30
    const r = computeDetailed({
      ...input,
      mix: { credit: 1, business: 0, amex: 0, foreign: 0 },
    })
    expect(r.annualCost).toBeCloseTo(102_000 + 18_000, 6)
    expect(r.mixTotalPercent).toBeCloseTo(100, 8)
    expect(r.lines.find((l) => l.id === 'amex')!.annualCost).toBe(0)
  })

  it('under-allocates rather than silently scaling a mix that misses 100%', () => {
    // Half of each default share: totals halve, not normalised back up.
    const r = computeDetailed({
      ...input,
      mix: { credit: 0.29, business: 0.085, amex: 0.065, foreign: 0.06 },
    })
    expect(r.mixTotalPercent).toBeCloseTo(50, 8)
    expect(r.annualVolume).toBeCloseTo(3_000_000, 6)
    expect(r.annualCost).toBeCloseTo(147_780 / 2, 6)
    // The blended rate is unaffected, since both parts halved.
    expect(r.effectiveRatePercent).toBeCloseTo(2.463, 6)
  })
})

describe('computeSavings', () => {
  const input = {
    monthlyTurnover: 500_000,
    averageOrderValue: 100,
    mix: DEFAULT_CARD_MIX,
    fixedPerTransaction: DEFAULT_FIXED_PER_TRANSACTION,
    creditPercent: 1.7,
    businessPercent: 1.8,
    amexPercent: 2.2,
    foreignPercent: 5.5,
    steerPercent: 30,
  }

  it('computes both savings levers at a 30% steer', () => {
    const r = computeSavings(input)

    // steerable (credit + business) volume = 3,480,000 + 1,020,000 = 4,500,000
    // steered = 30% -> 1,350,000
    expect(r.steeredVolume).toBeCloseTo(1_350_000, 6)
    // steerable cost = 69,600 + 21,420 = 91,020; 30% -> 27,306
    expect(r.currentSteeredCost).toBeCloseTo(27_306, 6)
    // PayTo: 1,350,000 x 0.5% = 6,750 + 13,500 txns x $0.30 = 4,050
    expect(r.payToCost).toBeCloseTo(10_800, 6)
    expect(r.steeringSavings).toBeCloseTo(16_506, 6)
    // foreign: 39,600 today vs 720,000 x 2% = 14,400 with Quidkey
    expect(r.foreignCardSavings).toBeCloseTo(25_200, 6)
    expect(r.totalSavings).toBeCloseTo(41_706, 6)
    expect(r.newAnnualCost).toBeCloseTo(106_074, 6)
    expect(r.savingsPercent).toBeCloseTo(28.2217, 3)
  })

  it('reports a raw negative foreign lever but never a negative total', () => {
    // A foreign rate below Quidkey's 2% means switching costs more, not less.
    const r = computeSavings({ ...input, foreignPercent: 1.5 })
    // 720,000 x 1.5% = 10,800 today vs 14,400 with Quidkey
    expect(r.foreignCardSavings).toBeCloseTo(-3_600, 6)
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
