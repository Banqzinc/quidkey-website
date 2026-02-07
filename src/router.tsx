import { createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    context: {},

    scrollRestoration: true,
    // Key scroll restoration by pathname so each page starts at top, but back/forward restores correctly
    getScrollRestorationKey: (location) => location.pathname,
    defaultPreloadStaleTime: 0,
  })

  return router
}
