import { Link, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { useAudience, type Audience } from '@/context/audience'
import { track } from '@/lib/track'
import { AGENTS_PATH, DEMO_BOOKING_URL, FINTECHS_PATH, MERCHANTS_LOGIN_URL, MERCHANTS_SIGNUP_URL } from '@/lib/urls'

const DEVELOPERS_URL = 'https://quidkey.dev'

// The fintech and agent pages are one-pagers, so their nav is in-page anchors
// plus the blog. The merchant nav (the default) links back into the homepage.
const ANCHOR_LINKS: Record<Exclude<Audience, 'merchants'>, ReadonlyArray<{ href: string; label: string }>> = {
  fintechs: [
    { href: '#capabilities', label: 'Capabilities' },
    { href: '#us', label: 'US focus' },
    { href: '#onboarding', label: 'Onboarding' },
  ],
  agents: [
    { href: '#profile', label: 'Handle' },
    { href: '#accounts', label: 'Accounts' },
    { href: '#pay', label: 'Pay' },
    { href: '#api', label: 'API' },
  ],
}

function navVariant(path: string): Audience {
  if (path.startsWith(FINTECHS_PATH)) return 'fintechs'
  if (path.startsWith(AGENTS_PATH)) return 'agents'
  return 'merchants'
}

const ExternalIcon = ({ size, className }: { size: number; className?: string }) => (
  <svg className={className} viewBox="0 0 10 10" width={size} height={size} aria-hidden="true">
    <path d="M2.5 2.5h5v5M7.5 2.5l-5 5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)

export function HomepageNav() {
  const { audience } = useAudience()
  const path = useRouterState({ select: (s) => s.location.pathname })
  const variant = navVariant(path)
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
  const trackRegister = () => {
    track({ name: 'homepage_cta_click', location: 'nav', label: 'register', audience: 'agents' })
  }

  const links = (onClick?: () => void) =>
    variant === 'merchants' ? (
      <>
        <Link to="/" hash="why" onClick={onClick}>
          Why Quidkey
        </Link>
        <Link to="/" hash="integrations" onClick={onClick}>
          Integrations
        </Link>
        <Link to="/" hash="pricing" onClick={onClick}>
          Pricing
        </Link>
        <Link to="/" hash="treasury" onClick={onClick}>
          Treasury
        </Link>
        <a
          href={DEVELOPERS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={onClick ? undefined : 'nav__link-ext'}
          onClick={() => {
            trackDevelopers()
            onClick?.()
          }}
        >
          Developers
          {onClick ? (
            <span style={{ marginLeft: 6, opacity: 0.55, display: 'inline-flex' }}>
              <ExternalIcon size={11} />
            </span>
          ) : (
            <ExternalIcon size={9} className="nav__link-ext-icon" />
          )}
        </a>
        <Link to="/blog" onClick={onClick}>
          Blog
        </Link>
      </>
    ) : (
      <>
        {ANCHOR_LINKS[variant].map((link) => (
          <a key={link.href} href={link.href} onClick={onClick}>
            {link.label}
          </a>
        ))}
        <Link to="/blog" onClick={onClick}>
          Blog
        </Link>
      </>
    )

  const ctas = (mobile: boolean) => {
    const pill = mobile ? 'btn btn--ink btn--pill' : 'btn btn--ink btn--pill nav__cta-primary'
    const withClose = (fn: () => void) => () => {
      fn()
      if (mobile) closeMenu()
    }
    if (variant === 'fintechs') {
      return (
        <a
          href={DEMO_BOOKING_URL}
          className={pill}
          target="_blank"
          rel="noopener noreferrer"
          onClick={withClose(trackBook)}
          style={mobile ? { gridColumn: '1 / -1' } : undefined}
        >
          Book a call
        </a>
      )
    }
    if (variant === 'agents') {
      return (
        <a
          href="#register"
          className={pill}
          onClick={withClose(trackRegister)}
          style={mobile ? { gridColumn: '1 / -1' } : undefined}
        >
          Register interest
        </a>
      )
    }
    return (
      <>
        <a
          href={MERCHANTS_LOGIN_URL}
          className={mobile ? 'btn btn--ghost btn--pill' : 'btn btn--text nav__signin-desktop'}
          onClick={withClose(trackSignIn)}
          aria-label="Sign in to merchant dashboard"
        >
          Sign in
        </a>
        <a href={MERCHANTS_SIGNUP_URL} className={pill} onClick={withClose(trackGetStarted)}>
          Get started
        </a>
      </>
    )
  }

  return (
    <nav className={`nav ${scrolled ? 'is-scrolled' : ''} ${mobileOpen ? 'nav--menu-open' : ''}`}>
      <div className="container nav__inner">
        <Link to="/" className="nav__brand" onClick={closeMenu} aria-label="Quidkey home">
          <img src="/quidkey-logo.svg" alt="Quidkey" className="nav__brand-logo" width="116" height="32" />
        </Link>
        <div className="nav__right">
          <div className="nav__links">{links()}</div>
          <div className="nav__ctas">
            {ctas(false)}
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

      <div id="nav-mobile-menu" className={`nav__mobile ${mobileOpen ? 'is-open' : ''}`} inert={!mobileOpen}>
        <div className="nav__mobile-inner">
          <div className="nav__mobile-links">{links(closeMenu)}</div>
          <div className="nav__mobile-ctas">{ctas(true)}</div>
        </div>
      </div>

      {mobileOpen && <div className="nav__mobile-backdrop" onClick={closeMenu} aria-hidden="true" />}
    </nav>
  )
}
