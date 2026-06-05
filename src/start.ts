import { createMiddleware, createStart } from '@tanstack/react-start'
import { setResponseHeader } from '@tanstack/react-start/server'

import { appendSearch, resolveCacheControl, resolveRedirect } from '@/lib/redirects'

// Global request middleware — runs for every HTTP request before routing
// (createStartHandler executes startInstance.requestMiddleware ahead of the route
// handler, for both document and server-function requests). This replaces the
// netlify.toml [[redirects]] and per-path Cache-Control [[headers]].
//
// CSP, Link, and security headers are intentionally NOT set here: they are applied
// at the edge by Cloudflare zone rules (the CSP+Link Transform Rule and the
// add_security_headers Managed Transform), which sit in front of this Worker and
// are unchanged by the migration.
const edgeMiddleware = createMiddleware({ type: 'request' }).server(async ({ request, next }) => {
  const url = new URL(request.url)

  // 301 redirects short-circuit before any SSR work. Preserve the original query
  // string (e.g. UTM params) across the hop, matching Netlify's redirect behavior.
  const target = resolveRedirect(url.pathname)
  if (target) {
    return new Response(null, {
      status: 301,
      headers: { Location: appendSearch(target, url.search) },
    })
  }

  // Cache-Control for the SSR HTML response (asset caching lives in public/_headers).
  setResponseHeader('Cache-Control', resolveCacheControl(url.pathname))

  return next()
})

// The build's start entry must export `startInstance` — createStartHandler reads
// `entries.startEntry.startInstance.getOptions()`.
export const startInstance = createStart(() => ({
  requestMiddleware: [edgeMiddleware],
}))
