import { describe, expect, it } from 'vitest'

import { DEFAULT_CARD_MIX, STRIPE_AU_STANDARD } from './surcharge-fees'
import { DEFAULTS, formatMix, parseMix, parseSearch } from './surcharge-params'

describe('parseMix / formatMix', () => {
  it('round-trips the default mix', () => {
    expect(formatMix(DEFAULT_CARD_MIX)).toBe('58,17,13,12')
    expect(parseMix('58,17,13,12')).toEqual(DEFAULT_CARD_MIX)
  })

  it('accepts a mix that does not add to 100', () => {
    // Under-allocation is a legitimate in-progress state while editing.
    expect(parseMix('10,10,10,10')).toEqual({
      credit: 0.1,
      business: 0.1,
      amex: 0.1,
      foreign: 0.1,
    })
  })

  it('falls back to the whole default mix for malformed input', () => {
    expect(parseMix('58,17,13')).toEqual(DEFAULT_CARD_MIX) // too few
    expect(parseMix('58,17,13,12,1')).toEqual(DEFAULT_CARD_MIX) // too many
    expect(parseMix('58,abc,13,12')).toEqual(DEFAULT_CARD_MIX) // not a number
    expect(parseMix('58,-5,13,12')).toEqual(DEFAULT_CARD_MIX) // negative
    expect(parseMix('58,150,13,12')).toEqual(DEFAULT_CARD_MIX) // above 100
    expect(parseMix(undefined)).toEqual(DEFAULT_CARD_MIX)
    expect(parseMix(42)).toEqual(DEFAULT_CARD_MIX)
  })

  it('formats fractional shares without floating-point noise', () => {
    expect(formatMix({ credit: 0.335, business: 0.335, amex: 0.22, foreign: 0.11 })).toBe(
      '33.5,33.5,22,11',
    )
  })
})

describe('parseSearch', () => {
  it('returns the defaults for an empty query', () => {
    expect(parseSearch({})).toEqual(DEFAULTS)
  })

  it('has the defaults from the spec', () => {
    expect(DEFAULTS).toEqual({
      turnover: 500_000,
      rate: 1.7,
      aov: 100,
      fixed: 0.3,
      credit: 1.7,
      business: 1.8,
      amex: 2.2,
      foreign: 5.5,
      steer: 30,
      mix: '58,17,13,12',
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

  it("defaults to Stripe's published Australian pricing", () => {
    // The page attributes the default figure to Stripe by name, so the defaults
    // and the quoted Stripe rate must never drift apart.
    expect(DEFAULTS.rate).toBe(STRIPE_AU_STANDARD.ratePercent)
    expect(DEFAULTS.fixed).toBe(STRIPE_AU_STANDARD.fixedPerTransaction)
  })

  it('takes a fixed fee in cents and rejects an implausible one', () => {
    expect(parseSearch({ fixed: '0.25' }).fixed).toBe(0.25)
    expect(parseSearch({ fixed: 0 }).fixed).toBe(0)
    expect(parseSearch({ fixed: 50 }).fixed).toBe(DEFAULTS.fixed)
  })

  it('accepts enterprise turnover up to ten digits', () => {
    // Merchants running over a billion a month are in scope, so the ceiling
    // must not reject their real figure.
    expect(parseSearch({ turnover: 1_000_000_000 }).turnover).toBe(1_000_000_000)
    expect(parseSearch({ turnover: 9_999_999_999 }).turnover).toBe(9_999_999_999)
    expect(parseSearch({ turnover: 10_000_000_000 }).turnover).toBe(DEFAULTS.turnover)
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
      [
        'amex',
        'aov',
        'business',
        'credit',
        'fixed',
        'foreign',
        'mix',
        'rate',
        'steer',
        'turnover',
      ].sort(),
    )
  })
})
