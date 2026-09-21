// Dollar formatting shared by the calculator card and the sample result.
// The page speaks in "$" without naming a currency, like the calculator's
// input, so both stay on the same en-US grouping.

/** $1,250 */
export const money = (n: number) =>
  '$' + Math.round(n).toLocaleString('en-US', { maximumFractionDigits: 0 })

/** Short labels for the preset pills and the high-volume line: $100k, $250k, $1m. */
export const compact = (n: number) => (n >= 1_000_000 ? `$${n / 1_000_000}m` : `$${n / 1_000}k`)
