import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// The site's 404. Used twice: as the root route's notFoundComponent for paths
// that match nothing, and as the router's defaultNotFoundComponent for a
// route that throws notFound from its loader (the hidden /agents page), which
// the router renders in place rather than bubbling to the root.
export function NotFoundPage() {
  // Minimal 404 — no nav, no footer. The new-design pages (homepage, blog)
  // all use the .hp-scoped HomepageNav/HomepageFooter which require their
  // own CSS bundle that isn't loaded at the root level. A standalone
  // centered card keeps the 404 visually clean without dragging that
  // bundle onto every request.
  const quickLinks = [
    { href: '/', label: 'Homepage' },
    { href: '/blog', label: 'Blog' },
  ]

  return (
    <main className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 hero-gradient" aria-hidden="true" />
      <div className="absolute inset-0 noise" aria-hidden="true" />

      <div className="relative mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
        <p className="text-8xl sm:text-9xl font-bold gradient-text leading-none mb-6 select-none">
          404
        </p>

        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-3">
          Page not found
        </h1>
        <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto text-pretty">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/"
          className={cn(
            buttonVariants({ size: 'lg' }),
            'group shadow-lg shadow-primary/25 hover:shadow-primary/40 mb-12'
          )}
        >
          Back to homepage
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
        </Link>

        <div className="border-t border-border pt-8">
          <p className="text-sm text-muted-foreground mb-4">Or try one of these pages</p>
          <div className="flex flex-wrap justify-center gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
