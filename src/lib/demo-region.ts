// Region selection for the merchant hero demo. Pure, isomorphic helpers only —
// the React state lives in context/demo-region.tsx.
//
// The region is NOT geo-detected. Every visitor starts on AU and switches by
// hand via the demo's region switcher, so the value is a constant on first
// render and server and client always agree.

export type DemoRegion = 'AU' | 'UK' | 'EU' | 'US'

export const DEFAULT_REGION: DemoRegion = 'AU'

// Also the left-to-right order of the demo's region switcher — default first.
export const KNOWN_REGIONS = ['AU', 'UK', 'EU', 'US'] as const

export function isDemoRegion(value: unknown): value is DemoRegion {
  return value === 'AU' || value === 'UK' || value === 'EU' || value === 'US'
}
