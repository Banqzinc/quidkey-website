import { ArrowRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export function BlogPreviewSection() {
  const posts = [
    {
      date: 'December 12, 2025',
      title: 'Quidkey Achieves SOC 2 Type II Compliance',
      description: 'Strengthening security for global payments with enterprise-grade compliance.',
      href: '/blog/soc2-compliance',
      featured: true,
    },
    {
      date: 'December 8, 2025',
      title: 'A Global Clearing House for Modern Payments',
      description: 'How Quidkey is leveraging APIs & AI to transform payment infrastructure.',
      href: '/blog/global-clearing-house',
    },
    {
      date: 'October 29, 2025',
      title: 'Strategic Partnership with Tryp.com',
      description: 'Powering next-generation "Pay by Bank" travel payments.',
      href: '/blog/tryp-partnership',
    },
  ]

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-2">
              Latest from the Blog
            </h2>
            <p className="text-lg text-muted-foreground">
              Insights on payments, A2A, and conversion optimization.
            </p>
          </div>
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-1 text-primary hover:underline mt-4 md:mt-0"
          >
            View all posts
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Blog grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <Link
              key={index}
              to={post.href}
              className={`group bg-white rounded-2xl border border-border overflow-hidden card-hover ${
                post.featured ? 'md:col-span-1' : ''
              }`}
            >
              {/* Image placeholder */}
              <div className="aspect-[16/9] bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <div className="text-4xl opacity-50">📰</div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="text-sm text-muted-foreground mb-2">{post.date}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {post.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
