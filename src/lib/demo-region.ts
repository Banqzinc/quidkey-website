// Region selection for the merchant hero demo. Pure, isomorphic helpers only —
// the React/runtime glue (URL override, country.is fetch, session cache) lives
// in use-demo-region.ts so this file stays trivially unit-testable.

export type DemoRegion = 'US' | 'AU'

// Where the resolved region came from — surfaced in analytics so we can tell
// real geo traffic apart from forced (?demo=) views.
export type RegionSource = 'override' | 'geo' | 'default'

// Every other country falls back to US "for now"; AU is the only localized set.
export const DEFAULT_REGION: DemoRegion = 'US'

export const KNOWN_REGIONS = ['US', 'AU'] as const

export function isDemoRegion(value: unknown): value is DemoRegion {
  return value === 'US' || value === 'AU'
}

// Map an ISO 3166-1 alpha-2 country code (e.g. from country.is or an edge
// header) to a demo region.
export function normalizeCountryToRegion(code: string | null | undefined): DemoRegion {
  return (code ?? '').trim().toUpperCase() === 'AU' ? 'AU' : DEFAULT_REGION
}

// Parse a `?demo=AU` / `?demo=us` override out of a location search string.
// Case-insensitive; returns null for missing or unrecognised values so callers
// can fall through to geo detection. Accepts the search with or without `?`.
export function parseRegionOverride(search: string | null | undefined): DemoRegion | null {
  if (!search) return null
  const qs = search.startsWith('?') ? search : `?${search}`
  let raw: string | null
  try {
    raw = new URLSearchParams(qs).get('demo')
  } catch {
    return null
  }
  if (!raw) return null
  const upper = raw.trim().toUpperCase()
  return isDemoRegion(upper) ? upper : null
}
