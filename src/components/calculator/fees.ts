// Fee assumptions and the core savings calculation for the Shopify Fee
// Calculator. Ported verbatim from the approved Claude-design artifact
// ("Shopify Fee Calculator v2"). This module is intentionally pure (no React)
// so the math can be unit-tested in isolation and reused server-side.

export type PlanId = 'basic' | 'grow' | 'advanced' | 'plus'
export type CountryId = 'US' | 'UK' | 'EU' | 'AU'

export type Currency = {
  short: string
  region: string
  demonym: string
  symbol: string
  code: string
  locale: string
  tld: string
}

export type ShopifyFee = {
  label: string
  domesticPercent: number
  domesticFixed: number
  internationalCardPercent: number
  fxPercent: number
  crossBorderAllInPercent: number
  thirdPartyPercent: number
}

export type QuidkeyFee = {
  domesticPercent: number
  domesticFixed: number
  crossBorderPercent: number
  crossBorderFixed: number
}

// International is an ALL-IN rate: the international card % PLUS the 2% FX /
// currency-conversion fee, which stacks ON TOP of the card fee (not instead).
// e.g. Basic = 3.5% card + 2.0% FX = 5.5% + A$0.30.
export const SHOPIFY_FEES: Record<PlanId, ShopifyFee> = {
  basic: { label: 'Basic', domesticPercent: 1.75, domesticFixed: 0.3, internationalCardPercent: 3.5, fxPercent: 2.0, crossBorderAllInPercent: 5.5, thirdPartyPercent: 2.0 },
  grow: { label: 'Grow', domesticPercent: 1.6, domesticFixed: 0.3, internationalCardPercent: 3.4, fxPercent: 2.0, crossBorderAllInPercent: 5.4, thirdPartyPercent: 1.0 },
  advanced: { label: 'Advanced', domesticPercent: 1.4, domesticFixed: 0.3, internationalCardPercent: 3.3, fxPercent: 2.0, crossBorderAllInPercent: 5.3, thirdPartyPercent: 0.6 },
  plus: { label: 'Plus', domesticPercent: 1.2, domesticFixed: 0.3, internationalCardPercent: 3.0, fxPercent: 2.0, crossBorderAllInPercent: 5.0, thirdPartyPercent: 0.2 },
}

export const QUIDKEY_FEES: Record<PlanId, QuidkeyFee> = {
  plus: { domesticPercent: 0.5, domesticFixed: 0.3, crossBorderPercent: 2.0, crossBorderFixed: 0.3 },
  advanced: { domesticPercent: 0.8, domesticFixed: 0.3, crossBorderPercent: 2.0, crossBorderFixed: 0.3 },
  grow: { domesticPercent: 1.0, domesticFixed: 0.3, crossBorderPercent: 3.0, crossBorderFixed: 0.3 },
  basic: { domesticPercent: 1.0, domesticFixed: 0.3, crossBorderPercent: 3.0, crossBorderFixed: 0.3 },
}

export const PLAN_ORDER: PlanId[] = ['plus', 'advanced', 'grow', 'basic']

// Choosing a base just swaps the currency symbol, formatting locale and the
// regional wording. The underlying fee assumptions stay the same.
export const COUNTRIES: Record<CountryId, Currency> = {
  US: { short: 'United States', region: 'the US', demonym: 'US', symbol: '$', code: 'USD', locale: 'en-US', tld: '.com' },
  UK: { short: 'United Kingdom', region: 'the UK', demonym: 'UK', symbol: '£', code: 'GBP', locale: 'en-GB', tld: '.co.uk' },
  EU: { short: 'Europe', region: 'the EU', demonym: 'European', symbol: '€', code: 'EUR', locale: 'en-IE', tld: '.com' },
  AU: { short: 'Australia', region: 'Australia', demonym: 'Australian', symbol: 'A$', code: 'AUD', locale: 'en-AU', tld: '.com.au' },
}

export const COUNTRY_ORDER: CountryId[] = ['AU', 'US', 'UK', 'EU']

export type ComputeInput = {
  domesticVolume: number
  crossBorderVolume: number
  averageOrderValue: number
  plan: PlanId
  includeThirdPartyFee: boolean
}

export type ComputeResult = {
  f: ShopifyFee
  q: QuidkeyFee
  domesticTransactions: number
  crossBorderTransactions: number
  shopifyDomesticFee: number
  shopifyCrossBorderFee: number
  thirdPartyFee: number
  shopifyTotal: number
  quidkeyDomesticFee: number
  quidkeyCrossBorderFee: number
  quidkeyTotal: number
  monthlySavings: number
  annualSavings: number
  totalVolume: number
  shopifyEffectiveRate: number
  quidkeyEffectiveRate: number
}

// Calculation verbatim from the brief. Note: the third-party transaction fee is
// a charge Shopify levies when you process through a non-Shopify-Payments
// gateway, so it is added to the *Quidkey* total (the cost of switching), not
// the Shopify total. The Plus plan never pays it; that gating is applied by the
// caller (the calculator passes includeThirdPartyFee=false for Plus).
export function compute({
  domesticVolume,
  crossBorderVolume,
  averageOrderValue,
  plan,
  includeThirdPartyFee,
}: ComputeInput): ComputeResult {
  const f = SHOPIFY_FEES[plan]
  const q = QUIDKEY_FEES[plan] || QUIDKEY_FEES.basic
  const aov = averageOrderValue > 0 ? averageOrderValue : 1

  const domesticTransactions = domesticVolume / aov
  const crossBorderTransactions = crossBorderVolume / aov

  const shopifyDomesticFee =
    domesticVolume * (f.domesticPercent / 100) + domesticTransactions * f.domesticFixed
  const shopifyCrossBorderFee =
    crossBorderVolume * (f.crossBorderAllInPercent / 100) + crossBorderTransactions * f.domesticFixed
  const thirdPartyFee = includeThirdPartyFee
    ? (domesticVolume + crossBorderVolume) * (f.thirdPartyPercent / 100)
    : 0
  const shopifyTotal = shopifyDomesticFee + shopifyCrossBorderFee

  const quidkeyDomesticFee =
    domesticVolume * (q.domesticPercent / 100) + domesticTransactions * q.domesticFixed
  const quidkeyCrossBorderFee =
    crossBorderVolume * (q.crossBorderPercent / 100) + crossBorderTransactions * q.crossBorderFixed
  const quidkeyTotal = quidkeyDomesticFee + quidkeyCrossBorderFee + thirdPartyFee

  const monthlySavings = shopifyTotal - quidkeyTotal
  const annualSavings = monthlySavings * 12
  const totalVolume = domesticVolume + crossBorderVolume
  const shopifyEffectiveRate = totalVolume > 0 ? (shopifyTotal / totalVolume) * 100 : 0
  const quidkeyEffectiveRate = totalVolume > 0 ? (quidkeyTotal / totalVolume) * 100 : 0

  return {
    f,
    q,
    domesticTransactions,
    crossBorderTransactions,
    shopifyDomesticFee,
    shopifyCrossBorderFee,
    thirdPartyFee,
    shopifyTotal,
    quidkeyDomesticFee,
    quidkeyCrossBorderFee,
    quidkeyTotal,
    monthlySavings,
    annualSavings,
    totalVolume,
    shopifyEffectiveRate,
    quidkeyEffectiveRate,
  }
}
