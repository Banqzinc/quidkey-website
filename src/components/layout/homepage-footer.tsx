import { Link } from '@tanstack/react-router'
import { type FormEvent, useState } from 'react'

import { useAudience } from '@/context/audience'
import { openCookiebotPreferences } from '@/lib/cookiebot'
import { track } from '@/lib/track'
import { DOCS_URL } from '@/lib/urls'

const STATUS_URL = 'https://status.quidkey.com'

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

export function HomepageFooter() {
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

  const productLinks: FooterLink[] = audience === 'fintechs'
    ? [
        { label: 'Rails', href: '#' },
        { label: 'Embedded accounts', href: '#' },
        { label: 'Workflows', href: '#' },
        { label: 'Partner portal', href: '#' },
      ]
    : [
        { label: 'Checkout', href: '/products/hosted-checkout' },
        { label: 'Treasury', href: '/workflows' },
        { label: 'Shopify app', href: '/products/shopify' },
        { label: 'API', href: '/products/iframe' },
      ]

  const companyLinks: FooterLink[] = [
    { label: 'About', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Blog', href: '/blog' },
    { label: 'Press', href: '#' },
  ]

  const developerLinks: FooterLink[] = [
    {
      label: 'Docs',
      href: DOCS_URL,
      external: true,
      onClick: trackOutbound(DOCS_URL, 'footer_docs'),
    },
    { label: 'Changelog', href: '#' },
    {
      label: 'Status',
      href: STATUS_URL,
      external: true,
      onClick: trackOutbound(STATUS_URL, 'footer_status'),
    },
    { label: 'GitHub', href: '#' },
  ]

  const legalLinks: FooterLink[] = [
    { label: 'Terms', href: '/terms' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Security', href: '#' },
    { label: 'Contact', href: '/contact' },
    {
      label: 'Cookies',
      href: '#cookiebot',
      external: true,
      onClick: (event) => {
        event.preventDefault()
        openCookiebotPreferences({ fallbackUrl: '/cookies' })
      },
    },
  ]

  return (
    <footer className="ft">
      <div className="container">
        <div className="ft__top">
          <div>
            <img src="/quidkey-logo.svg" alt="Quidkey" className="ft__brand-logo" />
            <p className="ft__tag">Pay by Bank checkout and programmable treasury, on one ledger.</p>
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
          </div>
          <div className="ft__cols">
            <FooterColumn
              heading={audience === 'fintechs' ? 'Partner stack' : 'Products'}
              links={productLinks}
            />
            <FooterColumn heading="Company" links={companyLinks} />
            <FooterColumn heading="Developers" links={developerLinks} />
            <FooterColumn heading="Legal" links={legalLinks} />
          </div>
        </div>
        <div className="ft__bottom">
          <span>© Quidkey {new Date().getFullYear()} · Banqzinc Inc.</span>
          <span>SOC 2 Type II · ISO 27001</span>
          <span>London · New York</span>
        </div>
      </div>
    </footer>
  )
}
