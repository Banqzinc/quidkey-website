import { describe, expect, it } from 'vitest'

import { appendSearch, normalizePath, resolveCacheControl, resolveRedirect } from './redirects'

describe('normalizePath', () => {
  it('strips a trailing slash except for root', () => {
    expect(normalizePath('/about/')).toBe('/about')
    expect(normalizePath('/about')).toBe('/about')
    expect(normalizePath('/')).toBe('/')
    expect(normalizePath('/blog/post/')).toBe('/blog/post')
  })
})

describe('resolveRedirect', () => {
  it('redirects retired pages to the homepage / its sections', () => {
    expect(resolveRedirect('/about')).toBe('/')
    expect(resolveRedirect('/contact')).toBe('/')
    expect(resolveRedirect('/pricing')).toBe('/#pricing')
    expect(resolveRedirect('/workflows')).toBe('/#treasury')
    expect(resolveRedirect('/products/shopify')).toBe('/#integrations')
    expect(resolveRedirect('/products/refunds')).toBe('/')
    expect(resolveRedirect('/partners')).toBe('/fintechs')
    expect(resolveRedirect('/solutions/fintechs')).toBe('/fintechs')
    expect(resolveRedirect('/solutions/saas')).toBe('/')
  })

  it('is trailing-slash insensitive', () => {
    expect(resolveRedirect('/about/')).toBe('/')
    expect(resolveRedirect('/pricing/')).toBe('/#pricing')
    expect(resolveRedirect('/solutions/fintechs/')).toBe('/fintechs')
  })

  it('redirects renamed blog posts', () => {
    expect(resolveRedirect('/blog/pay-by-bank-us')).toBe('/blog/pay-by-bank-the-future-of-payments')
    expect(resolveRedirect('/blog/seller-of-record-vs-mor')).toBe('/blog')
    expect(
      resolveRedirect(
        '/blog/quidkey-achieves-soc-2-type-ii-compliance-strengthening-security-for-global-payments',
      ),
    ).toBe('/blog/soc-2-type-ii-compliance-global-payments')
  })

  it('handles the /careers/* wildcard', () => {
    expect(resolveRedirect('/careers')).toBe('/')
    expect(resolveRedirect('/careers/')).toBe('/')
    expect(resolveRedirect('/careers/senior-platform-engineer')).toBe('/')
  })

  it('returns null for live routes (no redirect)', () => {
    expect(resolveRedirect('/')).toBeNull()
    expect(resolveRedirect('/blog')).toBeNull()
    expect(resolveRedirect('/fintechs')).toBeNull()
    expect(resolveRedirect('/calculator')).toBeNull()
    expect(resolveRedirect('/privacy')).toBeNull()
    // A redirect *target* must not itself be treated as a redirect source.
    expect(resolveRedirect('/blog/pay-by-bank-the-future-of-payments')).toBeNull()
  })
})

describe('resolveCacheControl', () => {
  it('uses short cache + SWR for the blog index and posts', () => {
    const swr = 'public, max-age=600, stale-while-revalidate=86400'
    expect(resolveCacheControl('/blog')).toBe(swr)
    expect(resolveCacheControl('/blog/')).toBe(swr)
    expect(resolveCacheControl('/blog/some-post')).toBe(swr)
  })

  it('is must-revalidate everywhere else', () => {
    expect(resolveCacheControl('/')).toBe('public, max-age=0, must-revalidate')
    expect(resolveCacheControl('/fintechs')).toBe('public, max-age=0, must-revalidate')
    expect(resolveCacheControl('/calculator')).toBe('public, max-age=0, must-revalidate')
  })
})

describe('appendSearch', () => {
  it('returns the target unchanged when there is no query', () => {
    expect(appendSearch('/', '')).toBe('/')
    expect(appendSearch('/fintechs', '')).toBe('/fintechs')
    expect(appendSearch('/#pricing', '')).toBe('/#pricing')
  })

  it('preserves the query string, inserted before any hash fragment', () => {
    expect(appendSearch('/fintechs', '?ref=abc')).toBe('/fintechs?ref=abc')
    expect(appendSearch('/#pricing', '?utm_source=x&y=1')).toBe('/?utm_source=x&y=1#pricing')
    expect(appendSearch('/', '?utm=x')).toBe('/?utm=x')
  })
})
