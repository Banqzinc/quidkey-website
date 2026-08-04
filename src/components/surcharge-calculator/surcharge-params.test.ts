import { describe, expect, it } from 'vitest'

import { DEFAULTS, parseSearch } from './surcharge-params'

describe('parseSearch', () => {
  it('returns the defaults for an empty query', () => {
    expect(parseSearch({})).toEqual(DEFAULTS)
  })

  it('has the defaults from the spec', () => {
    expect(DEFAULTS).toEqual({
      turnover: 500_000,
      rate: 1.4,
      aov: 100,
      credit: 1.4,
      business: 1.8,
      amex: 2.2,
      foreign: 5.5,
      steer: 30,
    })
  })

  it('accepts numeric strings from the URL', () => {
    const r = parseSearch({ turnover: '250000', rate: '1.75', aov: '90', steer: '55' })
    expect(r.turnover).toBe(250_000)
    expect(r.rate).toBe(1.75)
    expect(r.aov).toBe(90)
    expect(r.steer).toBe(55)
  })

  it('falls back to defaults for junk, blank, and non-finite values', () => {
    const r = parseSearch({ turnover: 'abc', rate: '', aov: null, steer: undefined })
    expect(r.turnover).toBe(DEFAULTS.turnover)
    expect(r.rate).toBe(DEFAULTS.rate)
    expect(r.aov).toBe(DEFAULTS.aov)
    expect(r.steer).toBe(DEFAULTS.steer)
  })

  it('falls back to defaults for negative and out-of-range values', () => {
    const r = parseSearch({
      turnover: -1,
      rate: 50, // above the 10% ceiling
      aov: 0, // below the 1 floor
      foreign: 99, // above the 15% ceiling
      steer: 140, // above 100
    })
    expect(r.turnover).toBe(DEFAULTS.turnover)
    expect(r.rate).toBe(DEFAULTS.rate)
    expect(r.aov).toBe(DEFAULTS.aov)
    expect(r.foreign).toBe(DEFAULTS.foreign)
    expect(r.steer).toBe(DEFAULTS.steer)
  })

  it('honours an explicit zero where zero is meaningful', () => {
    const r = parseSearch({ turnover: 0, rate: 0, steer: 0 })
    expect(r.turnover).toBe(0)
    expect(r.rate).toBe(0)
    expect(r.steer).toBe(0)
  })

  it('ignores unknown params', () => {
    const r = parseSearch({ turnover: 100, nonsense: 'x' })
    expect(r).toEqual({ ...DEFAULTS, turnover: 100 })
    expect(Object.keys(r).sort()).toEqual(
      ['amex', 'aov', 'business', 'credit', 'foreign', 'rate', 'steer', 'turnover'].sort(),
    )
  })
})
