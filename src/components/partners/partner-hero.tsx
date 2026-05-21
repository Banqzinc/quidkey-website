import { HeroAudienceToggle } from '@/components/homepage/audience-toggle'
import { track } from '@/lib/track'
import { DEMO_BOOKING_URL } from '@/lib/urls'

const PROOF = [
  { strong: 'White-labeled', rest: 'under your brand' },
  { strong: 'US, UK, EU, AU', rest: 'market access' },
  { strong: 'API first,', rest: 'portal optional' },
  { strong: 'SOC 2 Type II', rest: 'audited' },
]

export function PartnerHero() {
  const trackBook = () => {
    track({ name: 'homepage_cta_click', location: 'hero', label: 'demo', audience: 'fintechs' })
  }

  const trackAnchor = () => {
    track({ name: 'homepage_cta_click', location: 'hero', label: 'anchor', audience: 'fintechs' })
  }

  return (
    <header className="hero">
      <div className="container hero__inner">
        <HeroAudienceToggle source="hero" />
        <h1 className="hero__title">
          Extend your Pay by Bank coverage <em>where you don't have rails.</em>
        </h1>
        <p className="hero__sub">
          Quidkey gives PSPs and fintechs the rails, accounts, and merchant tooling to launch Pay by
          Bank, US local settlement, embedded checkout, and Shopify access without rebuilding their
          stack.
        </p>
        <ul className="hero__proof">
          {PROOF.map((item) => (
            <li key={item.strong} className="hero__proof-item">
              <svg
                className="hero__proof-check"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 8.5 7 12l6.5-8" />
              </svg>
              <span>
                <strong>{item.strong}</strong> {item.rest}
              </span>
            </li>
          ))}
        </ul>
        <div className="hero__ctas">
          <a
            href={DEMO_BOOKING_URL}
            className="btn btn--ink btn--xl"
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackBook}
          >
            Book a partnership call
            <span className="btn__arrow" aria-hidden="true">
              <svg
                viewBox="0 0 16 16"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </span>
          </a>
          <a href="#capabilities" className="btn btn--ghost btn--xl" onClick={trackAnchor}>
            Partner offering
          </a>
        </div>
      </div>
    </header>
  )
}
