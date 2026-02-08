import { createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    context: {},

    // Disable automatic scroll restoration - we'll handle it manually
    scrollRestoration: false,
    defaultPreloadStaleTime: 0,
  })

  // Scroll to top on every navigation (new pages, back/forward all start at top)
  router.subscribe('onResolved', () => {
    window.scrollTo({ top: 0, left: 0 })
  })

  return router
}
