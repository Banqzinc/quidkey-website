// Illustrative FX savings maths for the /fx-check page.
//
// Stripe and Shopify convert international sales at about 2% for stores
// outside the US. Against that, Quidkey saves a flat 0.5% of the converted
// volume, so the page's working assumption is "conversion fees fall from 2%
// to 1.5%". Higher volumes are priced in a conversation, so the page quotes
// no other rate. Bank conversions save more, but the numbers stay on the
// conservative Stripe and Shopify rate. The exact figure comes from the
// merchant's own Stripe data via the console fx-check flow.
/** What Stripe and Shopify charge to convert, for stores outside the US. */
export const CURRENT_FEE_PERCENT = 2
/** How much of the converted volume Quidkey saves, in percentage points. */
export const SAVING_PERCENT = 0.5
/** What the same conversion costs with Quidkey. */
export const QUIDKEY_FEE_PERCENT = CURRENT_FEE_PERCENT - SAVING_PERCENT
/** Monthly volume from which the page invites merchants to talk to us instead. */
export const TALK_TO_US_FROM = 1_000_000

export type FxSavings = {
  monthlySaving: number
  yearlySaving: number
}

/** The saving on a given converted volume, whatever the period. */
export function savingOn(volume: number): number {
  const safe = Number.isFinite(volume) && volume > 0 ? volume : 0
  return (safe * SAVING_PERCENT) / 100
}

export function estimateFxSavings(monthlyVolume: number): FxSavings {
  const monthlySaving = savingOn(monthlyVolume)
  return { monthlySaving, yearlySaving: monthlySaving * 12 }
}
