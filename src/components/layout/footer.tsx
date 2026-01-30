import { Link } from '@tanstack/react-router'

const LOGO_URL = 'https://storage.googleapis.com/quidkey-resources-public/quidkey-logo-black.svg'

export function Footer() {
  const footerLinks = {
    Products: [
      { label: 'Payments', href: '/products/payments' },
      { label: 'Payment Links', href: '/products/payment-links' },
      { label: 'Hosted Checkout', href: '/products/hosted-checkout' },
      { label: 'Treasury', href: '/products/treasury' },
      { label: 'Money Workflows', href: '/products/workflows' },
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
                    <Link
                      to={link.href}
                      className="text-sm text-background/60 hover:text-background transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-background/20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={LOGO_URL} 
              alt="Quidkey" 
              height={24} 
              className="h-6 w-auto invert"
            />
          </Link>

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
            © {new Date().getFullYear()} Bnqz Inc. (Quidkey). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
