import { track } from '@/lib/track'
import { DEMO_BOOKING_URL, PARTNERS_EMAIL } from '@/lib/urls'

const MAILTO = `mailto:${PARTNERS_EMAIL}`

export function PartnerCloser() {
  const trackBook = () => {
    track({ name: 'homepage_cta_click', location: 'closer', label: 'demo', audience: 'fintechs' })
  }

  const trackEmail = () => {
    track({ name: 'homepage_outbound_click', href: MAILTO, label: 'partners_email_closer' })
  }

  return (
    <section className="closer" id="book">
      <div className="container closer__inner">
        <span className="eyebrow">
          <span className="eyebrow__dot" /> NEXT STEP
        </span>
        <h2 className="closer__title">
          Become a partner. <em>Live in days.</em>
        </h2>
        <p className="closer__sub">
          We're onboarding PSPs and fintechs across the US, UK, EU, and AU. Book a 30-minute call
          to talk through your coverage gaps and a path to production.
        </p>
        <div className="closer__ctas">
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
          <a href={MAILTO} className="btn btn--ghost btn--xl" onClick={trackEmail}>
            Email {PARTNERS_EMAIL}
          </a>
        </div>
        <div className="closer__meta">
          <span>US · UK · EU · AU</span>
          <span>Live in days</span>
        </div>
      </div>
    </section>
  )
}
