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

  // Scroll to top on every navigation, except when the URL has a hash:
  // TanStack's handleHashScroll runs scrollIntoView on the target right after
  // this fires, and racing scrollTo({top:0}) against that scrollIntoView
  // breaks the smooth scroll when the page is already at scrollY=0 — anchor
  // clicks from the top silently fail to scroll.
  //
  // `behavior: 'instant'` is required because <html> has `scroll-smooth`
  // (used for anchor jumps within the same page). Without it, route
  // navigations animate from the previous page's scroll position to the
  // top of the new page — a visible "starts halfway, then scrolls up"
  // effect. Instant scroll makes the new page render at top with no
  // animation.
  router.subscribe('onResolved', (e) => {
    if (e.toLocation.hash) return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  })

  return router
}
