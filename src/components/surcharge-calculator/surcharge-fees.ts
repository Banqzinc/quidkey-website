// Fee assumptions and math for the surcharge-ban calculator
// (/surcharge-calculator). Australia only, AUD.
//
// Context: from 1 October 2026 the RBA's surcharge ban means merchants absorb
// card processing fees instead of passing them to customers. This module models
// (a) the quick estimate the article uses — card turnover x blended rate — and
// (b) a per-card-type build-up, plus what steering volume to Pay by Bank saves.
//
// Intentionally pure (no React) so the math is unit-testable and SSR-safe,
// matching the Shopify calculator's fees.ts.

export type CardTypeId = 'debit' | 'credit' | 'business' | 'amex' | 'foreign'

export const MONTHS_PER_YEAR = 12

// ABS Average Weekly Earnings — median full-time adult ordinary time earnings,
// rounded. Used only for the "that's ~N salaries" comparator the article makes.
export const ABS_MEDIAN_FULL_TIME_SALARY = 88_400

export type CardMix = Record<CardTypeId, number>

// Starting share of card volume by value, as fractions. Editable in the table,
// so this is only the default a visitor sees before adjusting it.
export const DEFAULT_CARD_MIX: CardMix = {
  debit: 0.4,
  credit: 0.35,
  business: 0.1,
  amex: 0.08,
  foreign: 0.07,
}

export const CARD_TYPE_ORDER: CardTypeId[] = ['debit', 'credit', 'business', 'amex', 'foreign']

export const CARD_LABELS: Record<CardTypeId, string> = {
  debit: 'Domestic debit',
  credit: 'Domestic consumer credit',
  business: 'Business credit',
  amex: 'American Express',
  foreign: 'Foreign-issued cards',
}

// Domestic debit is not editable: it is the cheapest rail and the one the
// article tells merchants to steer toward, so it stays a fixed reference point.
export const DEBIT_PERCENT = 0.5

// Per-transaction component, applied to domestic debit/credit/business only.
// Amex and foreign-issued cards are modelled as percentage-only.
export const FIXED_PER_TRANSACTION = 0.3

// Quidkey Pay by Bank (PayTo) pricing.
export const PAYTO_PERCENT = 0.5
export const PAYTO_FIXED = 0.3

// Quidkey's international card rate, replacing a card acquirer's all-in
// foreign rate (card % + FX %).
export const QUIDKEY_FOREIGN_PERCENT = 2.0

// Card types that can be steered onto Pay by Bank. Amex and foreign-issued
// cards are excluded: a domestic bank rail is not a substitute for them.
const STEERABLE: CardTypeId[] = ['debit', 'credit', 'business']

const percent = (n: number) => n / 100

// Average order value only ever divides, so floor it to 1 to keep fixed-fee
// maths finite when a visitor clears the field.
const flooredAov = (aov: number) => (Number.isFinite(aov) && aov > 0 ? aov : 1)

export type QuickInput = {
  monthlyTurnover: number
  ratePercent: number
}

export type QuickResult = {
  annualVolume: number
  annualCost: number
  monthlyCost: number
  /** Annual cost expressed as a multiple of a median full-time salary. */
  salaryEquivalent: number
}

export function computeQuick({ monthlyTurnover, ratePercent }: QuickInput): QuickResult {
  const annualVolume = monthlyTurnover * MONTHS_PER_YEAR
  const annualCost = annualVolume * percent(ratePercent)
  return {
    annualVolume,
    annualCost,
    monthlyCost: annualCost / MONTHS_PER_YEAR,
    salaryEquivalent: annualCost / ABS_MEDIAN_FULL_TIME_SALARY,
  }
}

// The article's framing: an annual card-fee bill of roughly one median salary
// is "almost the cost of another full-time employee". Stating a bare multiple
// reads badly right around 1 ("about 1.0x a salary"), so describe it instead.
export function describeSalaryEquivalent(multiple: number): string | null {
  if (!Number.isFinite(multiple) || multiple < 0.15) return null
  if (multiple < 0.85) {
    return `That's about ${Math.round(multiple * 100)}% of a median full-time salary in Australia.`
  }
  if (multiple <= 1.2) {
    return "That's almost the cost of another full-time employee on Australia's median salary — without getting the extra help."
  }
  return `That's about ${multiple.toFixed(1)}× a median full-time salary in Australia — without getting the extra help.`
}

export type CardLine = {
  id: CardTypeId
  label: string
  /** Share of card volume by value, 0..1. */
  mixShare: number
  ratePercent: number
  fixedPerTransaction: number
  annualVolume: number
  annualTransactions: number
  annualCost: number
}

export type DetailedInput = {
  monthlyTurnover: number
  averageOrderValue: number
  /** Share of card volume by value per card type, as fractions. */
  mix: CardMix
  creditPercent: number
  businessPercent: number
  amexPercent: number
  foreignPercent: number
}

export type DetailedResult = {
  lines: CardLine[]
  /** Volume actually allocated across the mix — less than turnover if the
   *  shares don't add to 100%, which the UI surfaces rather than hides. */
  annualVolume: number
  annualCost: number
  effectiveRatePercent: number
  /** Sum of the entered shares, as a percentage. 100 when fully allocated. */
  mixTotalPercent: number
}

function ratesFor(input: DetailedInput): Record<CardTypeId, number> {
  return {
    debit: DEBIT_PERCENT,
    credit: input.creditPercent,
    business: input.businessPercent,
    amex: input.amexPercent,
    foreign: input.foreignPercent,
  }
}

const FIXED_FOR: Record<CardTypeId, number> = {
  debit: FIXED_PER_TRANSACTION,
  credit: FIXED_PER_TRANSACTION,
  business: FIXED_PER_TRANSACTION,
  amex: 0,
  foreign: 0,
}

export function computeDetailed(input: DetailedInput): DetailedResult {
  const turnoverVolume = input.monthlyTurnover * MONTHS_PER_YEAR
  const aov = flooredAov(input.averageOrderValue)
  const rates = ratesFor(input)

  const lines: CardLine[] = CARD_TYPE_ORDER.map((id) => {
    const mixShare = input.mix[id] ?? 0
    const lineVolume = turnoverVolume * mixShare
    const transactions = lineVolume / aov
    const fixedPerTransaction = FIXED_FOR[id]
    return {
      id,
      label: CARD_LABELS[id],
      mixShare,
      ratePercent: rates[id],
      fixedPerTransaction,
      annualVolume: lineVolume,
      annualTransactions: transactions,
      annualCost: lineVolume * percent(rates[id]) + transactions * fixedPerTransaction,
    }
  })

  const annualCost = lines.reduce((sum, line) => sum + line.annualCost, 0)
  // Volume follows the shares as entered: under-allocating shows up as a
  // smaller total rather than being silently scaled back to 100%.
  const annualVolume = lines.reduce((sum, line) => sum + line.annualVolume, 0)
  const mixTotalPercent = lines.reduce((sum, line) => sum + line.mixShare, 0) * 100

  return {
    lines,
    annualVolume,
    annualCost,
    effectiveRatePercent: annualVolume > 0 ? (annualCost / annualVolume) * 100 : 0,
    mixTotalPercent,
  }
}

export type SavingsInput = DetailedInput & {
  /** Share of steerable domestic volume moved to Pay by Bank, 0..100. */
  steerPercent: number
}

export type SavingsResult = {
  detailed: DetailedResult
  steeredVolume: number
  currentSteeredCost: number
  payToCost: number
  /** Raw lever value — can be <= 0. */
  steeringSavings: number
  /** Raw lever value — can be <= 0 if the entered foreign rate beats Quidkey's. */
  foreignCardSavings: number
  /** Sum of the levers with non-positive ones excluded, so displays reconcile. */
  totalSavings: number
  newAnnualCost: number
  savingsPercent: number
}

export function computeSavings(input: SavingsInput): SavingsResult {
  const detailed = computeDetailed(input)
  const aov = flooredAov(input.averageOrderValue)
  const steerShare = Math.min(Math.max(input.steerPercent, 0), 100) / 100

  const steerable = detailed.lines.filter((line) => STEERABLE.includes(line.id))
  const steeredVolume = steerable.reduce((sum, line) => sum + line.annualVolume, 0) * steerShare
  const currentSteeredCost = steerable.reduce((sum, line) => sum + line.annualCost, 0) * steerShare

  const payToCost = steeredVolume * percent(PAYTO_PERCENT) + (steeredVolume / aov) * PAYTO_FIXED
  const steeringSavings = currentSteeredCost - payToCost

  const foreign = detailed.lines.find((line) => line.id === 'foreign')
  const foreignCardSavings = foreign
    ? foreign.annualCost - foreign.annualVolume * percent(QUIDKEY_FOREIGN_PERCENT)
    : 0

  // Clamp per lever: a lever that costs more is shown as "no additional
  // saving" rather than quietly cancelling out the other one.
  const totalSavings = Math.max(0, steeringSavings) + Math.max(0, foreignCardSavings)

  return {
    detailed,
    steeredVolume,
    currentSteeredCost,
    payToCost,
    steeringSavings,
    foreignCardSavings,
    totalSavings,
    newAnnualCost: detailed.annualCost - totalSavings,
    savingsPercent: detailed.annualCost > 0 ? (totalSavings / detailed.annualCost) * 100 : 0,
  }
}
