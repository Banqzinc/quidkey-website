// Illustrative FX savings maths for the /fx-check hero calculator.
//
// Stripe and Shopify convert international sales at about 2% for stores
// outside the US. Against that, Quidkey saves a flat 0.5% of the converted
// volume. Higher volumes are priced in a conversation, so the page quotes no
// other rate. Bank conversions save more, but the calculator stays on the
// conservative Stripe and Shopify rate. The exact number comes from the
// merchant's own Stripe data via the console fx-check flow.
export const SAVING_PERCENT = 0.5
/** Monthly volume from which the page invites merchants to talk to us instead. */
export const TALK_TO_US_FROM = 1_000_000

export type FxSavings = {
  monthlySaving: number
  yearlySaving: number
}

export function estimateFxSavings(monthlyVolume: number): FxSavings {
  const volume = Number.isFinite(monthlyVolume) && monthlyVolume > 0 ? monthlyVolume : 0
  const monthlySaving = (volume * SAVING_PERCENT) / 100
  return { monthlySaving, yearlySaving: monthlySaving * 12 }
}
