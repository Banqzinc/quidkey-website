// Typed URL search params for /surcharge-calculator, so a link reproduces the
// exact view and can be shared pre-filled with a merchant's numbers. The route
// validates incoming params with parseSearch() and mirrors changes back.
//
// Plain validation (no zod/valibot — the repo has neither): every field falls
// back to its default when missing, blank, non-numeric, or out of range, so
// junk links degrade safely instead of rendering NaN.

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
}

// Inclusive bounds. A value outside its range is treated as junk (a shared link
// someone edited by hand) and replaced by the default rather than clamped, so
// the URL and the rendered figure never disagree.
const RANGES: Record<keyof SurchargeSearch, { min: number; max: number }> = {
  turnover: { min: 0, max: 100_000_000 },
  rate: { min: 0, max: 10 },
  aov: { min: 1, max: 1_000_000 },
  credit: { min: 0, max: 10 },
  business: { min: 0, max: 10 },
  amex: { min: 0, max: 10 },
  foreign: { min: 0, max: 15 },
  steer: { min: 0, max: 100 },
}

function num(raw: unknown, key: keyof SurchargeSearch): number {
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
  }
}
