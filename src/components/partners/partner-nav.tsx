import { AudienceToggle } from '@/components/homepage/audience-toggle'
import { track } from '@/lib/track'
import { DEMO_BOOKING_URL, PARTNERS_EMAIL } from '@/lib/urls'

const NAV_LINKS = [
  { href: '#capabilities', label: 'Capabilities' },
  { href: '#us', label: 'US focus' },
  { href: '#onboarding', label: 'Onboarding' },
  { href: '#architecture', label: 'Architecture' },
]

const MAILTO = `mailto:${PARTNERS_EMAIL}`

export function PartnerNav() {
  const trackBook = () => {
    track({ name: 'homepage_cta_click', location: 'nav', label: 'demo', audience: 'fintechs' })
  }

  const trackEmail = () => {
    track({ name: 'homepage_outbound_click', href: MAILTO, label: 'partners_email_nav' })
  }

  return (
    <nav className="nav">
      <div className="nav__inner">
        <a href="#" className="nav__brand">
          <img src="/quidkey-logo.svg" alt="Quidkey" className="nav__brand-logo" />
          <span className="nav__brand-tag">PARTNER PROGRAM</span>
        </a>
        <div className="nav__links">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
        <div className="nav__ctas">
          <AudienceToggle source="partner_nav" />
          <a href={MAILTO} className="btn btn--text" onClick={trackEmail}>
            {PARTNERS_EMAIL}
          </a>
          <a
            href={DEMO_BOOKING_URL}
            className="btn btn--ink"
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackBook}
          >
            Book a call
          </a>
        </div>
      </div>
    </nav>
  )
}
