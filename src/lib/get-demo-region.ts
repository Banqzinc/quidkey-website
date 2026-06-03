import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'

import {
  parseRegionOverride,
  regionFromHeaders,
  type DemoRegion,
  type RegionSource,
} from '@/lib/demo-region'

// Resolve the demo region during SSR (and on client navigation via a
// same-origin RPC the CSP permits): an explicit `?demo=` override wins,
// otherwise the edge geo header (cf-ipcountry behind Cloudflare in production,
// x-nf-geo on Netlify). Running this server-side means the region is decided
// before the demo renders — no client-side country.is fetch (which production's
// CSP blocks anyway), and the same value on server and client, so no hydration
// mismatch.
export const getDemoRegion = createServerFn({ method: 'GET' }).handler(
  (): { region: DemoRegion; source: RegionSource } => {
    const request = getRequest()
    const override = parseRegionOverride(new URL(request.url).search)
    if (override) return { region: override, source: 'override' }
    return regionFromHeaders((name) => request.headers.get(name))
  },
)
