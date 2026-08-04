// Typed URL search params for /surcharge-calculator, so a link reproduces the
// exact view and can be shared pre-filled with a merchant's numbers. The route
// validates incoming params with parseSearch() and mirrors changes back.
//
// Plain validation (no zod/valibot — the repo has neither): every field falls
// back to its default when missing, blank, non-numeric, or out of range, so
// junk links degrade safely instead of rendering NaN.

import { CARD_TYPE_ORDER, DEFAULT_CARD_MIX, type CardMix } from './surcharge-fees'

export type SurchargeSearch = {
  /** Monthly card turnover, AUD. */
  turnover: number
  /** Blended card fee rate, %. */
  rate: number
  /** Average order value, AUD. */
  aov: number
  /** Domestic consumer credit rate, %. */
  credit: number
  /** Business credit rate, %. */
  business: number
  /** American Express rate, %. */
  amex: number
  /** Foreign-issued all-in rate (card + FX), %. */
  foreign: number
  /** Share of steerable domestic volume moved to Pay by Bank, %. */
  steer: number
  /**
   * Card mix as percentages in CARD_TYPE_ORDER, comma-separated
   * ("40,35,10,8,7"). One param rather than five keeps shared links readable.
   */
  mix: string
}

/** Serialises a mix to the `mix` param form, e.g. "40,35,10,8,7". */
export function formatMix(mix: CardMix): string {
  return CARD_TYPE_ORDER.map((id) => Number(((mix[id] ?? 0) * 100).toFixed(2))).join(',')
}

export const DEFAULTS: SurchargeSearch = {
  turnover: 500_000,
  rate: 1.4,
  aov: 100,
  credit: 1.4,
  business: 1.8,
  amex: 2.2,
  foreign: 5.5,
  steer: 30,
  mix: formatMix(DEFAULT_CARD_MIX),
}

/**
 * Parses the `mix` param into fractions. Any malformed entry falls back to the
 * whole default mix rather than a partly-applied one, so a mangled link can't
 * produce a half-sensible chart. Shares are NOT required to sum to 100 — an
 * under- or over-allocated mix is a state the UI reports back to the visitor.
 */
export function parseMix(raw: unknown): CardMix {
  if (typeof raw !== 'string') return DEFAULT_CARD_MIX
  const parts = raw.split(',')
  if (parts.length !== CARD_TYPE_ORDER.length) return DEFAULT_CARD_MIX

  const mix = {} as CardMix
  for (const [index, id] of CARD_TYPE_ORDER.entries()) {
    const n = Number(parts[index])
    if (!Number.isFinite(n) || n < 0 || n > 100) return DEFAULT_CARD_MIX
    mix[id] = n / 100
  }
  return mix
}

// Inclusive bounds. A value outside its range is treated as junk (a shared link
// someone edited by hand) and replaced by the default rather than clamped, so
// the URL and the rendered figure never disagree.
const RANGES: Record<Exclude<keyof SurchargeSearch, 'mix'>, { min: number; max: number }> = {
  // Ten digits: enterprise merchants running over a billion a month exist, and
  // a ceiling that rejects their real number is worse than a wide one.
  turnover: { min: 0, max: 9_999_999_999 },
  rate: { min: 0, max: 10 },
  aov: { min: 1, max: 1_000_000 },
  credit: { min: 0, max: 10 },
  business: { min: 0, max: 10 },
  amex: { min: 0, max: 10 },
  foreign: { min: 0, max: 15 },
  steer: { min: 0, max: 100 },
}

function num(raw: unknown, key: Exclude<keyof SurchargeSearch, 'mix'>): number {
  const fallback = DEFAULTS[key]
  if (raw == null || (typeof raw === 'string' && raw.trim() === '')) return fallback
  const n = typeof raw === 'number' ? raw : Number(raw)
  if (!Number.isFinite(n)) return fallback
  const { min, max } = RANGES[key]
  if (n < min || n > max) return fallback
  return n
}

export function parseSearch(raw: Record<string, unknown>): SurchargeSearch {
  return {
    turnover: num(raw.turnover, 'turnover'),
    rate: num(raw.rate, 'rate'),
    aov: num(raw.aov, 'aov'),
    credit: num(raw.credit, 'credit'),
    business: num(raw.business, 'business'),
    amex: num(raw.amex, 'amex'),
    foreign: num(raw.foreign, 'foreign'),
    steer: num(raw.steer, 'steer'),
    // Round-tripped through parseMix so an invalid value normalises to the
    // default string and gets stripped from the URL like any other default.
    mix: formatMix(parseMix(raw.mix)),
  }
}
