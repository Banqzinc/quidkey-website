import { describe, expect, it } from 'vitest'

import { NotFoundPage } from '@/components/not-found-page'

import { getRouter } from './router'
import { routeTree } from './routeTree.gen'

describe('not found pages', () => {
  it('renders the same 404 page for an unmatched path and for a route that throws notFound', () => {
    // An unmatched path is caught by the root's notFoundComponent. A route that
    // throws notFound from its loader (the hidden /agents page) is rendered in
    // place by the router's default, so both must be the one component or the
    // second case falls back to the framework's bare "Not Found" paragraph.
    expect(routeTree.options.notFoundComponent).toBe(NotFoundPage)
    expect(getRouter().options.defaultNotFoundComponent).toBe(NotFoundPage)
  })
})
