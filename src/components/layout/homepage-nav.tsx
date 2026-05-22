import { Link, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { useAudience } from '@/context/audience'
import { track } from '@/lib/track'
import { DEMO_BOOKING_URL, MERCHANTS_LOGIN_URL, MERCHANTS_SIGNUP_URL } from '@/lib/urls'

const DEVELOPERS_URL = 'https://quidkey.dev'

const PARTNER_LINKS = [
  { href: '#capabilities', label: 'Capabilities' },
  { href: '#us', label: 'US focus' },
  { href: '#onboarding', label: 'Onboarding' },
] as const

export function HomepageNav() {
  const { audience } = useAudience()
  const path = useRouterState({ select: (s) => s.location.pathname })
  const isPartners = path.startsWith('/partners')
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock the page while the mobile menu is open. We toggle a class on
  // <html> and rely on touch-action: none in CSS, rather than setting
  // body.style.overflow = 'hidden'. The overflow trick silently cancels
  // position: sticky on the nav (see src/styles.css comment near
  // overflow-x: clip), which used to push the nav and menu sheet off-
  // screen whenever the menu opened while scrolled past the hero.
  useEffect(() => {
    if (!mobileOpen) return
    document.documentElement.classList.add('nav-menu-open')
    return () => {
      document.documentElement.classList.remove('nav-menu-open')
    }
  }, [mobileOpen])

  // Close the menu on Escape.
  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  const closeMenu = () => setMobileOpen(false)

  const trackSignIn = () => {
    track({ name: 'homepage_cta_click', location: 'nav', label: 'sign_in', audience })
  }
  const trackGetStarted = () => {
    track({ name: 'homepage_cta_click', location: 'nav', label: 'get_started', audience })
  }
  const trackDevelopers = () => {
    track({ name: 'homepage_outbound_click', href: DEVELOPERS_URL, label: 'developers_nav' })
  }
  const trackBook = () => {
    track({ name: 'homepage_cta_click', location: 'nav', label: 'demo', audience: 'fintechs' })
  }

  return (
    <nav className={`nav ${scrolled ? 'is-scrolled' : ''} ${mobileOpen ? 'nav--menu-open' : ''}`}>
      <div className="container nav__inner">
        <Link to="/" className="nav__brand" onClick={closeMenu} aria-label="Quidkey home">
          <img src="/quidkey-logo.svg" alt="Quidkey" className="nav__brand-logo" width="116" height="32" />
        </Link>
        <div className="nav__right">
          <div className="nav__links">
            {isPartners ? (
              PARTNER_LINKS.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              ))
            ) : (
              <>
                <Link to="/" hash="why">Why Quidkey</Link>
                <Link to="/" hash="integrations">Integrations</Link>
                <Link to="/" hash="pricing">Pricing</Link>
                <Link to="/" hash="treasury">Treasury</Link>
                <a
                  href={DEVELOPERS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav__link-ext"
                  onClick={trackDevelopers}
                >
                  Developers
                  <svg
                    className="nav__link-ext-icon"
                    viewBox="0 0 10 10"
                    width="9"
                    height="9"
                    aria-hidden="true"
                  >
                    <path
                      d="M2.5 2.5h5v5M7.5 2.5l-5 5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </a>
                <Link to="/blog">Blog</Link>
              </>
            )}
          </div>
          <div className="nav__ctas">
            {isPartners ? (
              <a
                href={DEMO_BOOKING_URL}
                className="btn btn--ink btn--pill nav__cta-primary"
                target="_blank"
                rel="noopener noreferrer"
                onClick={trackBook}
              >
                Book a call
              </a>
            ) : (
              <>
                <a
                  href={MERCHANTS_LOGIN_URL}
                  className="btn btn--text nav__signin-desktop"
                  onClick={trackSignIn}
                  aria-label="Sign in to merchant dashboard"
                >
                  Sign in
                </a>
                <a
                  href={MERCHANTS_SIGNUP_URL}
                  className="btn btn--ink btn--pill nav__cta-primary"
                  onClick={trackGetStarted}
                >
                  Get started
                </a>
              </>
            )}
            <button
              type="button"
              className="nav__burger"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="nav-mobile-menu"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span className={`nav__burger-icon ${mobileOpen ? 'is-open' : ''}`} aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </div>

      <div
        id="nav-mobile-menu"
        className={`nav__mobile ${mobileOpen ? 'is-open' : ''}`}
        inert={!mobileOpen}
      >
        <div className="nav__mobile-inner">
          <div className="nav__mobile-links">
            {isPartners ? (
              PARTNER_LINKS.map((link) => (
                <a key={link.href} href={link.href} onClick={closeMenu}>
                  {link.label}
                </a>
              ))
            ) : (
              <>
                <Link to="/" hash="why" onClick={closeMenu}>
                  Why Quidkey
                </Link>
                <Link to="/" hash="integrations" onClick={closeMenu}>
                  Integrations
                </Link>
                <Link to="/" hash="pricing" onClick={closeMenu}>
                  Pricing
                </Link>
                <Link to="/" hash="treasury" onClick={closeMenu}>
                  Treasury
                </Link>
                <a
                  href={DEVELOPERS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackDevelopers()
                    closeMenu()
                  }}
                >
                  Developers
                  <svg
                    viewBox="0 0 10 10"
                    width="11"
                    height="11"
                    aria-hidden="true"
                    style={{ marginLeft: 6, opacity: 0.55 }}
                  >
                    <path
                      d="M2.5 2.5h5v5M7.5 2.5l-5 5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </a>
                <Link to="/blog" onClick={closeMenu}>
                  Blog
                </Link>
              </>
            )}
          </div>
          <div className="nav__mobile-ctas">
            {isPartners ? (
              <a
                href={DEMO_BOOKING_URL}
                className="btn btn--ink btn--pill"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackBook()
                  closeMenu()
                }}
                style={{ gridColumn: '1 / -1' }}
              >
                Book a call
              </a>
            ) : (
              <>
                <a
                  href={MERCHANTS_LOGIN_URL}
                  className="btn btn--ghost btn--pill"
                  onClick={() => {
                    trackSignIn()
                    closeMenu()
                  }}
                  aria-label="Sign in to merchant dashboard"
                >
                  Sign in
                </a>
                <a
                  href={MERCHANTS_SIGNUP_URL}
                  className="btn btn--ink btn--pill"
                  onClick={() => {
                    trackGetStarted()
                    closeMenu()
                  }}
                >
                  Get started
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="nav__mobile-backdrop" onClick={closeMenu} aria-hidden="true" />
      )}
    </nav>
  )
}
