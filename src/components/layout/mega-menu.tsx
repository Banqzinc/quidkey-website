import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  CreditCard,
  Link as LinkIcon,
  Building2,
  ArrowLeftRight,
  Code,
  ShoppingCart,
  Plane,
  Landmark,
  Monitor,
  Store,
  Briefcase,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const LOGO_URL = 'https://storage.googleapis.com/quidkey-resources-public/quidkey-logo-black.svg'

interface MenuItem {
  label: string
  href: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
}

interface MenuSection {
  title?: string
  items: MenuItem[]
}

interface MegaMenuData {
  [key: string]: MenuSection[]
}

const menuData: MegaMenuData = {
  Products: [
    {
      title: 'Payments',
      items: [
        { label: 'Shopify', href: '/products/shopify', description: 'Shopify approved pay by bank app', icon: ShoppingCart },
        { label: 'iFrame', href: '/products/iframe', description: 'Embedded pay by bank checkout', icon: Code },
        { label: 'Payment Links', href: '/products/payment-links', description: 'No code pay by bank links', icon: LinkIcon },
        { label: 'Hosted Checkout', href: '/products/hosted-checkout', description: 'Ready to use checkout in minutes', icon: CreditCard },
      ],
    },
    {
      title: 'Treasury',
      items: [
        { label: 'Local Accounts', href: '/products/local-accounts', description: 'Local collection accounts', icon: Building2 },
        { label: 'Multi Currency', href: '/products/multi-currency', description: 'Multi currency wallets and balances', icon: ArrowLeftRight },
        { label: 'Refunds', href: '/products/refunds', description: 'Fast bank to bank refunds', icon: ArrowLeftRight },
      ],
    },
  ],
  'Who We Serve': [
    {
      items: [
        { label: 'Ecommerce', href: '/solutions/ecommerce', description: 'Online E-commerce businesses', icon: ShoppingCart },
        { label: 'Travel', href: '/solutions/travel', description: 'Travel tech and hospitality', icon: Plane },
        { label: 'Fintechs', href: '/solutions/fintechs', description: 'Scale faster with white-label solutions', icon: Landmark },
        { label: 'SaaS Platforms', href: '/solutions/saas', description: 'Embedded A2A payments for SaaS', icon: Monitor },
        { label: 'Marketplaces', href: '/solutions/marketplaces', description: 'End to end programmable payouts and splits', icon: Store },
        { label: 'Professional Services', href: '/solutions/professional-services', description: 'Accept and move money without code', icon: Briefcase },
      ],
    },
  ],
}

export function MegaMenu() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img 
              src={LOGO_URL} 
              alt="Quidkey" 
              height={28} 
              className="h-7 w-auto transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Products dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveMenu('Products')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button className="flex items-center gap-1 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                Products
                <ChevronDown className={cn('h-4 w-4 transition-transform', activeMenu === 'Products' && 'rotate-180')} />
              </button>
              
              {activeMenu === 'Products' && (
                <div className="absolute top-full left-0 pt-2">
                  <div className="w-[480px] bg-white rounded-xl shadow-lg border border-border p-6 grid grid-cols-2 gap-8">
                    {menuData.Products.map((section, idx) => (
                      <div key={idx}>
                        {section.title && (
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                            {section.title}
                          </h4>
                        )}
                        <div className="space-y-1">
                          {section.items.map((item) => (
                            <Link
                              key={item.label}
                              to={item.href}
                              className="block p-2 -mx-2 rounded-lg hover:bg-secondary transition-colors group"
                            >
                              <div className="flex items-center gap-3">
                                {item.icon && <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary" />}
                                <div>
                                  <div className="text-sm font-medium text-foreground">{item.label}</div>
                                  {item.description && (
                                    <div className="text-xs text-muted-foreground">{item.description}</div>
                                  )}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Who We Serve dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveMenu('Who We Serve')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button className="flex items-center gap-1 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                Who We Serve
                <ChevronDown className={cn('h-4 w-4 transition-transform', activeMenu === 'Who We Serve' && 'rotate-180')} />
              </button>
              
              {activeMenu === 'Who We Serve' && (
                <div className="absolute top-full left-0 pt-2">
                  <div className="w-[480px] bg-white rounded-xl shadow-lg border border-border p-5">
                    <div className="grid grid-cols-2 gap-1">
                      {menuData['Who We Serve'][0].items.map((item) => (
                        <Link
                          key={item.label}
                          to={item.href}
                          className="block p-3 rounded-lg hover:bg-secondary transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            {item.icon && <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary" />}
                            <div>
                              <div className="text-sm font-medium text-foreground">{item.label}</div>
                              {item.description && (
                                <div className="text-xs text-muted-foreground">{item.description}</div>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Simple links */}
            <Link to="/workflows" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              Workflows
            </Link>
            <a href="#developers" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              Developers
            </a>
            <Link to="/blog" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              Blog
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Button variant="ghost" size="sm">
              Login
            </Button>
            <Button size="sm">
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 -mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-white max-h-[80vh] overflow-y-auto">
          <nav className="px-4 py-4 space-y-4">
            {/* Products */}
            <div>
              <h3 className="font-medium text-foreground mb-2">Products</h3>
              <div className="space-y-1 pl-4">
                {menuData.Products.flatMap((section) => section.items).map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="block py-2 text-sm text-muted-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Who We Serve */}
            <div>
              <h3 className="font-medium text-foreground mb-2">Who We Serve</h3>
              <div className="space-y-1 pl-4">
                {menuData['Who We Serve'][0].items.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="block py-2 text-sm text-muted-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Simple links */}
            <Link to="/workflows" className="block py-2 font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>
              Workflows
            </Link>
            <a href="#developers" className="block py-2 font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>
              Developers
            </a>
            <Link to="/blog" className="block py-2 font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>
              Blog
            </Link>

            {/* CTAs */}
            <div className="pt-4 border-t border-border space-y-3">
              <Button variant="outline" className="w-full">
                Login
              </Button>
              <Button className="w-full">
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
