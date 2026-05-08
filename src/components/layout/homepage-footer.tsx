import { Link } from '@tanstack/react-router'
import { type FormEvent, useState } from 'react'

import { useAudience } from '@/context/audience'
import { openCookiebotPreferences } from '@/lib/cookiebot'
import { track } from '@/lib/track'
import { DOCS_URL } from '@/lib/urls'

const STATUS_URL = 'https://status.quidkey.com'
const DEVELOPERS_URL = 'https://quidkey.dev'

type FooterLink = {
  label: string
  href: string
  external?: boolean
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void
}

function FooterColumn({ heading, links }: { heading: string; links: FooterLink[] }) {
  return (
    <div className="ft__col">
      <h4>{heading}</h4>
      <ul>
        {links.map((link) => (
          <li key={`${heading}-${link.label}`}>
            {link.external || link.href === '#' ? (
              <a
                href={link.href}
                {...(link.external && link.href !== '#'
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                onClick={link.onClick}
              >
                {link.label}
              </a>
            ) : (
              <Link to={link.href} onClick={link.onClick}>
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function HomepageFooter({ variant = 'home' }: { variant?: 'home' | 'legal' } = {}) {
  const { audience } = useAudience()
  const [newsletterSent, setNewsletterSent] = useState(false)

  const handleNewsletterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const input = form.querySelector('input') as HTMLInputElement | null
    const email = input?.value.trim()
    if (!email) {
      track({ name: 'homepage_newsletter_submit', outcome: 'error', reason: 'empty' })
      return
    }
    // Newsletter is a visual stub for now — wired (Mailchimp/Netlify form) before merge.
    form.classList.add('is-sent')
    if (input) input.value = ''
    setNewsletterSent(true)
    track({ name: 'homepage_newsletter_submit', outcome: 'success' })
  }

  const trackOutbound = (href: string, label: string) => () => {
    track({ name: 'homepage_outbound_click', href, label })
  }

  // Per design feedback (Claude design chat, May 2026): drop Shopify app from
  // Products, drop About/Careers/Press from Company, drop Changelog from
  // Developers, and use the same condensed column set on home and legal pages.
  // The fintech audience still gets a different Products column ("Partner
  // stack") since the home audience toggle remains.
  const homeProductLinks: FooterLink[] = audience === 'fintechs'
    ? [
        { label: 'Rails', href: '#' },
        { label: 'Embedded accounts', href: '#' },
        { label: 'Workflows', href: '#' },
      ]
    : [
        { label: 'Checkout', href: '/products/hosted-checkout' },
        { label: 'Treasury', href: '/workflows' },
        {
          label: 'API',
          href: DEVELOPERS_URL,
          external: true,
          onClick: trackOutbound(DEVELOPERS_URL, 'footer_api'),
        },
      ]

  const legalProductLinks: FooterLink[] = [
    { label: 'Checkout', href: '/products/hosted-checkout' },
    { label: 'Treasury', href: '/workflows' },
    {
      label: 'API',
      href: DEVELOPERS_URL,
      external: true,
      onClick: trackOutbound(DEVELOPERS_URL, 'footer_api'),
    },
  ]

  const productLinks = variant === 'legal' ? legalProductLinks : homeProductLinks

  const companyLinks: FooterLink[] = [{ label: 'Blog', href: '/blog' }]

  const developerLinks: FooterLink[] = [
    {
      label: 'Docs',
      href: DOCS_URL,
      external: true,
      onClick: trackOutbound(DOCS_URL, 'footer_docs'),
    },
    {
      label: 'Status',
      href: STATUS_URL,
      external: true,
      onClick: trackOutbound(STATUS_URL, 'footer_status'),
    },
    { label: 'GitHub', href: '#' },
  ]

  const legalLinks: FooterLink[] = [
    { label: 'Privacy Notice', href: '/privacy' },
    { label: 'End-User Privacy', href: '/end-user-privacy' },
    { label: 'Terms of Use', href: '/terms' },
    {
      label: 'Cookies',
      href: '/cookies',
      onClick: (event) => {
        // On the home variant, hijack the click to surface the Cookiebot
        // banner; on legal pages we want a normal navigation to /cookies.
        if (variant === 'legal') return
        event.preventDefault()
        openCookiebotPreferences({ fallbackUrl: '/cookies' })
      },
    },
    { label: 'Complaints Procedure', href: '/complaints' },
  ]

  const showNewsletter = variant !== 'legal'
  const productsHeading = variant === 'home' && audience === 'fintechs' ? 'Partner stack' : 'Products'

  return (
    <footer className="ft">
      <div className="container">
        <div className="ft__top">
          <div>
            <img src="/quidkey-logo.svg" alt="Quidkey" className="ft__brand-logo" />
            <p className="ft__tag">
              Pay by Bank checkout and programmable treasury, on one ledger.
            </p>
            {showNewsletter && (
              <form
                className={`ft__news${newsletterSent ? ' is-sent' : ''}`}
                onSubmit={handleNewsletterSubmit}
                noValidate
              >
                <label className="ft__news-lbl" htmlFor="ft-news-email">
                  Get product updates
                </label>
                <div className="ft__news-row">
                  <input
                    id="ft-news-email"
                    className="ft__news-input"
                    type="email"
                    required
                    placeholder="you@company.com"
                    autoComplete="email"
                  />
                  <button type="submit" className="ft__news-btn" aria-label="Subscribe">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14" />
                      <path d="M13 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <span className="ft__news-hint">Only product updates. No spam.</span>
                <span className="ft__news-ok">Thanks, you're on the list.</span>
              </form>
            )}
          </div>
          <div className="ft__cols">
            <FooterColumn heading={productsHeading} links={productLinks} />
            <FooterColumn heading="Company" links={companyLinks} />
            <FooterColumn heading="Developers" links={developerLinks} />
            <FooterColumn heading="Legal" links={legalLinks} />
          </div>
        </div>
        <div className="ft__bottom">
          <span>© Quidkey {new Date().getFullYear()} · Banqzinc Inc.</span>
          <span>SOC 2 Type II · ISO 27001</span>
          <span>London · New York · Berlin · Sydney</span>
        </div>
      </div>
    </footer>
  )
}
