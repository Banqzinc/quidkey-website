import { Link } from '@tanstack/react-router'

import { NewsletterForm } from '@/components/layout/newsletter-form'
import { openCookiebotPreferences } from '@/lib/cookiebot'
import { track } from '@/lib/track'
import { DOCS_URL, GITHUB_URL } from '@/lib/urls'

const STATUS_URL = 'https://status.quidkey.com'
const DEVELOPERS_URL = 'https://quidkey.dev'

type FooterLink = {
  label: string
  href: string
  /** Optional in-page anchor (e.g. "treasury") for Link-based items. */
  hash?: string
  external?: boolean
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void
}

function FooterColumn({ heading, links }: { heading: string; links: FooterLink[] }) {
  return (
    <div className="ft__col">
      <h2>{heading}</h2>
      <ul>
        {links.map((link) => {
          const isMailto = link.href.startsWith('mailto:')
          if (link.external || link.href === '#' || isMailto) {
            return (
              <li key={`${heading}-${link.label}`}>
                <a
                  href={link.href}
                  {...(link.external && link.href !== '#' && !isMailto
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  onClick={link.onClick}
                >
                  {link.label}
                </a>
              </li>
            )
          }
          return (
            <li key={`${heading}-${link.label}`}>
              <Link to={link.href} hash={link.hash} onClick={link.onClick}>
                {link.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function HomepageFooter() {
  const trackOutbound = (href: string, label: string) => () => {
    track({ name: 'homepage_outbound_click', href, label })
  }

  // Per design feedback (Claude design chat, May 2026): drop Shopify app from
  // Products, drop About/Careers/Press from Company, drop Changelog from
  // Developers, and use the same condensed column set on home and legal pages.
  const productLinks: FooterLink[] = [
    { label: 'Checkout', href: '/', hash: 'integrations' },
    { label: 'Treasury', href: '/', hash: 'treasury' },
    { label: 'Marketplace', href: '/marketplace' },
    {
      label: 'API',
      href: DEVELOPERS_URL,
      external: true,
      onClick: trackOutbound(DEVELOPERS_URL, 'footer_api'),
    },
    { label: 'Calculator', href: '/calculator' },
    { label: 'FX savings check', href: '/fx-check' },
  ]

  const companyLinks: FooterLink[] = [
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ]

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
    {
      label: 'GitHub',
      href: GITHUB_URL,
      external: true,
      onClick: trackOutbound(GITHUB_URL, 'footer_github'),
    },
  ]

  // Cookies opens the Cookiebot consent banner rather than navigating to a
  // dedicated page (there isn't one).
  //
  // Privacy/Terms/Complaints now live in the console legal center rather than
  // on this site, so they're external links (the on-site pages 301 to the
  // same URLs for anyone hitting the old paths directly).
  const legalLinks: FooterLink[] = [
    {
      label: 'Privacy Notice',
      href: 'https://console.quidkey.com/legal/website-privacy',
      external: true,
      onClick: trackOutbound('https://console.quidkey.com/legal/website-privacy', 'footer_privacy'),
    },
    {
      label: 'End-User Privacy',
      href: 'https://console.quidkey.com/legal/end-user-privacy',
      external: true,
      onClick: trackOutbound('https://console.quidkey.com/legal/end-user-privacy', 'footer_end_user_privacy'),
    },
    {
      label: 'Terms of Use',
      href: 'https://console.quidkey.com/legal/end-user-terms',
      external: true,
      onClick: trackOutbound('https://console.quidkey.com/legal/end-user-terms', 'footer_terms'),
    },
    {
      label: 'Cookies',
      href: '#cookiebot',
      external: true,
      onClick: (event) => {
        event.preventDefault()
        openCookiebotPreferences()
      },
    },
    {
      label: 'Complaints Procedure',
      href: 'https://console.quidkey.com/legal/complaints',
      external: true,
      onClick: trackOutbound('https://console.quidkey.com/legal/complaints', 'footer_complaints'),
    },
  ]

  return (
    <footer className="ft">
      <div className="container">
        <div className="ft__top">
          <div>
            <img src="/quidkey-logo.svg" alt="Quidkey" className="ft__brand-logo" width="116" height="32" loading="lazy" decoding="async" />
            <p className="ft__tag">
              Pay by Bank checkout and programmable treasury, on one ledger.
            </p>
            <NewsletterForm />
          </div>
          <div className="ft__cols">
            <FooterColumn heading="Products" links={productLinks} />
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
