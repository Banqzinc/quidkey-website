// Region selection for the merchant hero demo. Pure, isomorphic helpers only —
// the runtime glue lives in get-demo-region.ts (the SSR server function) and
// context/demo-region.tsx, so this file stays trivially unit-testable.

export type DemoRegion = 'US' | 'AU'

// Where the resolved region came from — lets us tell a forced (?demo=) view
// apart from real edge-detected geo.
export type RegionSource = 'override' | 'header' | 'default'

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

// Decode Netlify's base64-JSON `x-nf-geo` header to an ISO country code.
// Netlify deploy previews aren't behind Cloudflare, so this is the geo source
// there; production uses cf-ipcountry below.
function decodeNetlifyGeoCountry(value: string): string | null {
  try {
    const parsed = JSON.parse(atob(value)) as { country?: { code?: string } }
    return parsed.country?.code ?? null
  } catch {
    return null
  }
}

// Resolve the region from request headers (server-side only). Cloudflare fronts
// production, so cf-ipcountry is the most reliable signal for the real client;
// x-nf-geo / x-country cover Netlify directly. Returns the US default with
// source 'default' when no usable header is present.
export function regionFromHeaders(
  get: (name: string) => string | null | undefined,
): { region: DemoRegion; source: RegionSource } {
  const cf = get('cf-ipcountry')
  // XX = unknown, T1 = Tor — treat as "no signal".
  if (cf && cf !== 'XX' && cf !== 'T1') {
    return { region: normalizeCountryToRegion(cf), source: 'header' }
  }
  const nfGeo = get('x-nf-geo')
  if (nfGeo) {
    const code = decodeNetlifyGeoCountry(nfGeo)
    if (code) return { region: normalizeCountryToRegion(code), source: 'header' }
  }
  const xCountry = get('x-country')
  if (xCountry) return { region: normalizeCountryToRegion(xCountry), source: 'header' }
  return { region: DEFAULT_REGION, source: 'default' }
}
