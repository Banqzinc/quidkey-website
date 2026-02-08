import { Link } from '@tanstack/react-router'

const LOGO_URL = 'https://storage.googleapis.com/quidkey-resources-public/quidkey-logo-black.svg'
const COPYRIGHT_YEAR = new Date().getFullYear()

export function Footer() {
  const openCookiePreferences = () => {
    if (typeof window === 'undefined') return

    const cb = (window as any).Cookiebot as
      | {
          renew?: () => void
          show?: () => void
        }
      | undefined

    if (cb?.renew) return cb.renew()
    if (cb?.show) return cb.show()

    // Fallback if Cookiebot isn't loaded for some reason.
    window.location.href = '/cookies'
  }

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
      { label: 'Documentation', href: '/docs' },
      { label: 'API Reference', href: '/docs/api' },
      { label: 'SDKs', href: '/docs/sdks' },
      { label: 'Status', href: '/status' },
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
                      <button
                        type="button"
                        onClick={openCookiePreferences}
                        className="text-sm text-background/60 hover:text-background transition-colors"
                        aria-label="Cookie preferences"
                      >
                        {link.label}
                      </button>
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
                height={24}
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
