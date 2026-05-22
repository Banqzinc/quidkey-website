// Final CTA before the footer. The headline is intentionally split into two
// lines per chat50.md — the explicit <br /> + spans + the .closer__h-break CSS
// rule (preserved through the prefix pass) keep it on two lines on desktop
// while collapsing to a natural wrap on mobile.

import { AudienceToggle } from '@/components/homepage/audience-toggle'
import { track } from '@/lib/track'
import { DEMO_BOOKING_URL, DOCS_URL } from '@/lib/urls'

const CLOSER_COPY = {
  h: (
    <>
      Add a payment option that helps you
      <br className="closer__h-break" />
      <span className="closer__h-mute">convert more customers</span>
    </>
  ),
  sub:
    'Add Pay by Bank to your checkout in minutes. Lower fees, higher conversion, zero chargebacks.',
  primary: { label: 'Book a demo', href: DEMO_BOOKING_URL, cta: 'demo' as const, external: true },
  secondary: { label: 'Read the docs', href: DOCS_URL, cta: 'docs' as const },
}

export function Closer() {
  const c = CLOSER_COPY

  const trackCta = (label: 'get_started' | 'demo' | 'docs') => () => {
    track({ name: 'homepage_cta_click', location: 'closer', label, audience: 'merchants' })
  }

  return (
    <section className="closer">
      <div className="container closer__inner">
        <h2 className="closer__h">{c.h}</h2>
        <div className="closer__right">
          {c.sub && <p className="closer__sub">{c.sub}</p>}
          <div className="closer__ctas">
            <a
              href={c.primary.href}
              className="closer__cta closer__cta--primary"
              onClick={trackCta(c.primary.cta)}
              {...(c.primary.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {c.primary.label}
            </a>
            <a
              href={c.secondary.href}
              className="closer__cta closer__cta--secondary"
              onClick={trackCta(c.secondary.cta)}
            >
              {c.secondary.label}
            </a>
          </div>
          <div className="closer__switch">
            <span className="closer__switch-l">Not what you're looking for?</span>
            <AudienceToggle size="dark" source="hero" />
          </div>
        </div>
      </div>
    </section>
  )
}
