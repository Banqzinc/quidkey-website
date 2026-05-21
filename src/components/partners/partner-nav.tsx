import { track } from '@/lib/track'
import { DEMO_BOOKING_URL } from '@/lib/urls'

const NAV_LINKS = [
  { href: '#capabilities', label: 'Capabilities' },
  { href: '#us', label: 'US focus' },
  { href: '#onboarding', label: 'Onboarding' },
  { href: '#architecture', label: 'Architecture' },
]

export function PartnerNav() {
  const trackBook = () => {
    track({ name: 'homepage_cta_click', location: 'nav', label: 'demo', audience: 'fintechs' })
  }

  return (
    <nav className="nav">
      <div className="nav__inner">
        <a href="#" className="nav__brand">
          <img src="/quidkey-logo.svg" alt="Quidkey" className="nav__brand-logo" />
        </a>
        <div className="nav__links">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
        <div className="nav__ctas">
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
