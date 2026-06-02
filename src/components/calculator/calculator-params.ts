// Typed URL search params for /calculator, so a link reproduces the exact
// view and can be shared with merchants pre-filled. This is the source of
// truth for the calculator's inputs; the route validates incoming params with
// parseSearch() and the page mirrors changes back to the URL.
//
// Plain validation (no zod/valibot — the repo has neither): every field falls
// back to its default when missing or invalid, so junk links degrade safely.

import { COUNTRIES, SHOPIFY_FEES, type CountryId, type PlanId } from './fees'

export type CalculatorSearch = {
  region: CountryId
  domestic: number
  intl: number
  aov: number
  plan: PlanId
  thirdParty: boolean
}

export const DEFAULTS: CalculatorSearch = {
  region: 'AU',
  domestic: 50000,
  intl: 20000,
  aov: 100,
  plan: 'plus',
  thirdParty: false,
}

// Non-negative number, falling back to `fallback` for missing, blank,
// non-finite, or negative input (a negative amount is treated as junk). An
// explicit zero is honoured (e.g. a store with no international sales);
// compute() floors average order value to avoid divide-by-zero.
function num(raw: unknown, fallback: number): number {
  if (raw == null || (typeof raw === 'string' && raw.trim() === '')) return fallback
  const n = typeof raw === 'number' ? raw : Number(raw)
  if (!Number.isFinite(n) || n < 0) return fallback
  return n
}

function parseBool(raw: unknown): boolean {
  return raw === true || raw === 1 || raw === 'true' || raw === '1'
}

export function parseSearch(raw: Record<string, unknown>): CalculatorSearch {
  const region =
    typeof raw.region === 'string' && raw.region in COUNTRIES
      ? (raw.region as CountryId)
      : DEFAULTS.region
  const plan =
    typeof raw.plan === 'string' && raw.plan in SHOPIFY_FEES
      ? (raw.plan as PlanId)
      : DEFAULTS.plan

  return {
    region,
    domestic: num(raw.domestic, DEFAULTS.domestic),
    intl: num(raw.intl, DEFAULTS.intl),
    aov: num(raw.aov, DEFAULTS.aov),
    plan,
    thirdParty: parseBool(raw.thirdParty),
  }
}
