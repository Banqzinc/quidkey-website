import { Link } from '@tanstack/react-router'
import { openCookiebotPreferences } from '@/lib/cookiebot'

const LOGO_URL = '/quidkey-logo.svg'
const COPYRIGHT_YEAR = new Date().getFullYear()

export function Footer() {
  const footerLinks = {
    Products: [
      { label: 'Shopify', href: '/products/shopify' },
      { label: 'Payment Links', href: '/products/payment-links' },
      { label: 'Hosted Checkout', href: '/products/hosted-checkout' },
      { label: 'Multi Currency', href: '/products/multi-currency' },
      { label: 'Money Workflows', href: '/workflows' },
    ],
    'Who We Serve': [
      { label: 'Ecommerce', href: '/solutions/ecommerce' },
      { label: 'Travel', href: '/solutions/travel' },
      { label: 'SaaS Platforms', href: '/solutions/saas' },
      { label: 'Marketplaces', href: '/solutions/marketplaces' },
      { label: 'Fintechs', href: '/solutions/fintechs' },
    ],
    Developers: [
      { label: 'Documentation', href: 'https://docs.quidkey.com/' },
      { label: 'Status', href: 'https://status.quidkey.com' },
    ],
    Company: [
      { label: 'About Us', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
    Legal: [
      { label: 'Privacy Notice', href: '/privacy' },
      { label: 'Terms of Use', href: '/terms' },
      { label: 'Cookies', href: '/cookies' },
      { label: 'Complaints Procedure', href: '/complaints' },
    ],
  }

  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-medium text-background mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <li key={index}>
                    {category === 'Legal' && link.label === 'Cookies' ? (
                      <Link
                        to={link.href}
                        onClick={(event) => {
                          event.preventDefault()
                          openCookiebotPreferences({ fallbackUrl: link.href })
                        }}
                        className="text-sm text-background/60 hover:text-background transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : /^https?:\/\//.test(link.href) ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-background/60 hover:text-background transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-sm text-background/60 hover:text-background transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-background/20">
          {/* Logo and trust badge */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center">
              <img
                src={LOGO_URL}
                alt="Quidkey"
                width={96}
                height={24}
                loading="lazy"
                decoding="async"
                className="h-6 w-auto invert"
              />
            </Link>
            <div className="flex items-center gap-1.5 text-sm text-background/60">
              <span className="text-base">🛡️</span>
              <span>SOC 2 Type II</span>
            </div>
          </div>

          {/* Social & Contact */}
          <div className="flex items-center gap-6">
            <a
              href="mailto:support@quidkey.com"
              className="text-sm text-background/60 hover:text-background transition-colors"
            >
              support@quidkey.com
            </a>
            <a
              href="https://linkedin.com/company/quidkey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-background/60 hover:text-background transition-colors"
            >
              LinkedIn
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-background/60">
            © {COPYRIGHT_YEAR} Bnqz Inc. (Quidkey). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
