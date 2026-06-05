// Pure, isomorphic helpers for the request-time redirect + cache-header layer.
// The TanStack Start middleware that applies these lives in src/start.ts; keeping
// the logic here (no framework imports) makes it trivially unit-testable — same
// split as demo-region.ts (pure) vs get-demo-region.ts (runtime glue).
//
// These rules port the [[redirects]] and the per-path Cache-Control [[headers]]
// that used to live in netlify.toml, which was removed in the Netlify ->
// Cloudflare Worker migration. CSP / Link / security headers are NOT here — those
// are applied at the edge by Cloudflare zone rules and are unchanged by the move.

// Legacy / retired paths -> their canonical destination (301, permanent). Keyed by
// the trailing-slash-normalized pathname (see normalizePath), so each route needs
// only one entry whether or not the request had a trailing slash.
export const REDIRECTS: Record<string, string> = {
  // Renamed blog posts — keep old URLs alive for external links + old sitemaps.
  '/blog/ai-native-clearing-house': '/blog/quidkey-a-global-clearing-house-for-modern-payments',
  '/blog/pay-by-bank-us': '/blog/pay-by-bank-the-future-of-payments',
  '/blog/seller-of-record-vs-mor': '/blog',
  '/blog/quidkey-achieves-soc-2-type-ii-compliance-strengthening-security-for-global-payments':
    '/blog/soc-2-type-ii-compliance-global-payments',
  '/blog/quidkey-announces-strategic-partnership-with-tryp-com-to-power-next-generation-pay-by-bank-travel-payments':
    '/blog/quidkey-tryp-pay-by-bank-travel-payments',
  '/blog/a2a-payments-explained-why-traditional-payment-fees-hurt-merchants-profit-margins-and-how-to-fix-it':
    '/blog/a2a-payments-cut-merchant-fees',
  // Retired pages -> homepage sections (the redesign folded these into `/`).
  '/about': '/',
  '/careers': '/',
  '/contact': '/',
  '/pricing': '/#pricing',
  '/workflows': '/#treasury',
  '/products/hosted-checkout': '/#integrations',
  '/products/iframe': '/#integrations',
  '/products/shopify': '/#integrations',
  '/products/local-accounts': '/#treasury',
  '/products/multi-currency': '/#treasury',
  '/products/payment-links': '/',
  '/products/refunds': '/',
  '/solutions/ecommerce': '/',
  '/solutions/fintechs': '/fintechs',
  '/partners': '/fintechs',
  '/solutions/marketplaces': '/',
  '/solutions/professional-services': '/',
  '/solutions/saas': '/',
  '/solutions/travel': '/',
}

// Drop a trailing slash (except the root "/") so "/about" and "/about/" resolve
// identically — matches Netlify's trailing-slash-insensitive redirect matching.
export function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.replace(/\/+$/, '')
  }
  return pathname
}

// Resolve the 301 target for a pathname, or null if it isn't a redirect.
export function resolveRedirect(pathname: string): string | null {
  const path = normalizePath(pathname)
  const exact = REDIRECTS[path]
  if (exact) return exact
  // `/careers/*` -> `/` — the only wildcard rule in the old netlify.toml.
  if (path === '/careers' || path.startsWith('/careers/')) return '/'
  return null
}

// Cache-Control for SSR-rendered HTML responses only (static assets are handled
// by public/_headers). Blog pages get a short edge cache + long
// stale-while-revalidate (the old netlify.toml /blog rule); everything else is
// must-revalidate so HTML is always fresh.
export function resolveCacheControl(pathname: string): string {
  const path = normalizePath(pathname)
  if (path === '/blog' || path.startsWith('/blog/')) {
    return 'public, max-age=600, stale-while-revalidate=86400'
  }
  return 'public, max-age=0, must-revalidate'
}
