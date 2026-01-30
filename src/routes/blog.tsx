import { createFileRoute } from '@tanstack/react-router'
import { MegaMenu } from '@/components/layout/mega-menu'
import { Footer } from '@/components/layout/footer'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/blog')({
  component: BlogPage,
})

const blogPosts = [
  {
    date: 'December 12, 2025',
    title: 'Quidkey Achieves SOC 2 Type II Compliance, Strengthening Security for Global Payments',
    description: 'Bnqz Inc. (Quidkey), a leading provider of API-driven global payments infrastructure, proudly announces SOC 2 Type II compliance.',
    href: '/blog/soc2-compliance',
    featured: true,
  },
  {
    date: 'December 8, 2025',
    title: 'Quidkey: A Global Clearing House for Modern Payments',
    description: 'Chief Operating Officer Bhavna Saraf gives us the lowdown on the genesis of Quidkey and how it is leveraging APIs & AI to transform payments.',
    href: '/blog/global-clearing-house',
  },
  {
    date: 'October 29, 2025',
    title: 'Quidkey Announces Strategic Partnership with Tryp.com',
    description: 'Powering next-generation "Pay by Bank" travel payments for the growing travel tech sector.',
    href: '/blog/tryp-partnership',
  },
  {
    date: 'October 26, 2025',
    title: 'Refunds, Rewards, and Real-Time Settlement: Unlocking Merchant Payments',
    description: 'Quidkey empowers merchants with real-time settlements, seamless refunds, and loyalty rewards through Open Banking.',
    href: '/blog/refunds-rewards',
  },
  {
    date: 'October 14, 2025',
    title: 'Quidkey and TransferMate Drive Down Card Costs for Merchants',
    description: 'Strategic partnership with TransferMate, the world\'s leading cross-border payments infrastructure provider.',
    href: '/blog/transfermate-partnership',
  },
  {
    date: 'October 8, 2025',
    title: 'Pay by Bank: The Future of Payments',
    description: 'Skip the cards, go direct. Pay by Bank lets customers pay straight from their bank account with no intermediaries.',
    href: '/blog/pay-by-bank-future',
  },
  {
    date: 'September 10, 2025',
    title: 'Open Banking Payments in the UK',
    description: 'Ditch cards. Go bank-direct. Quidkey turns Open Banking into a high-converting, fraud-free payment experience.',
    href: '/blog/open-banking-uk',
  },
  {
    date: 'March 18, 2025',
    title: 'A2A Payments Explained: Why Traditional Payment Fees Hurt Merchant Profit Margins',
    description: 'Merchants are switching to A2A payments for 60% lower transaction fees and instant bank settlements.',
    href: '/blog/a2a-payments-explained',
  },
]

function BlogPage() {
  const featuredPost = blogPosts[0]
  const otherPosts = blogPosts.slice(1)

  return (
    <div className="min-h-screen">
      <MegaMenu />
      <main className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4">
              Blog
            </h1>
            <p className="text-lg text-muted-foreground">
              Get the latest insights on payments, A2A, and conversion optimization.
            </p>
          </div>

          {/* Featured post */}
          <Link
            to={featuredPost.href}
            className="group block mb-12 md:mb-16"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center bg-secondary/30 rounded-2xl p-6 md:p-8 card-hover">
              <div className="aspect-[16/9] bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center">
                <div className="text-6xl opacity-50">📰</div>
              </div>
              <div>
                <div className="inline-block text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded mb-3">
                  Featured
                </div>
                <div className="text-sm text-muted-foreground mb-2">{featuredPost.date}</div>
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-muted-foreground">
                  {featuredPost.description}
                </p>
              </div>
            </div>
          </Link>

          {/* Other posts grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherPosts.map((post, index) => (
              <Link
                key={index}
                to={post.href}
                className="group bg-white rounded-2xl border border-border overflow-hidden card-hover"
              >
                <div className="aspect-[16/9] bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center">
                  <div className="text-4xl opacity-30">📄</div>
                </div>
                <div className="p-6">
                  <div className="text-sm text-muted-foreground mb-2">{post.date}</div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
