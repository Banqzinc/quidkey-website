import { createFileRoute, Link } from '@tanstack/react-router'

import { HomepageNav } from '@/components/layout/homepage-nav'
import { HomepageFooter } from '@/components/layout/homepage-footer'
import { AudienceProvider } from '@/context/audience'
import { blogPosts } from '@/lib/blog-posts'
import { buildSeo } from '@/lib/seo'

// Pull in the prefixed homepage CSS so HomepageNav and HomepageFooter
// render correctly. The .hp wrapper class is scoped to just the nav and
// footer (not the article body) so the homepage's CSS reset doesn't mess
// with the blog post's Tailwind-styled typography.
import '@/styles/homepage/base.css'
import '@/styles/homepage/tm2.css'
import '@/styles/homepage/headings.css'
import '@/styles/homepage/integrations.css'
import '@/styles/homepage/treasury-head.css'
import '@/styles/homepage/mobile.css'
import '@/styles/homepage/section-padding.css'
import '@/styles/homepage/overrides.css'

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Caveat:wght@500;600;700&family=Inter+Tight:ital,wght@0,100..900;1,100..900&display=swap'

export const Route = createFileRoute('/blog/')({
  component: BlogPage,
  head: () => {
    const seo = buildSeo({
      title: 'Pay by Bank Blog: A2A & Open Banking Insights | Quidkey',
      description:
        'Expert insights on pay by bank, A2A payments, open banking, and cross-border payment infrastructure. Learn how to reduce fees and improve conversion.',
      path: '/blog',
    })
    return {
      ...seo,
      links: [
        ...(seo.links ?? []),
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
        { rel: 'stylesheet', href: FONT_HREF },
      ],
    }
  },
})

function BlogPage() {
  const featuredPost = blogPosts.find((p) => p.featured) ?? blogPosts[0]
  const otherPosts = blogPosts.filter((p) => p.slug !== featuredPost.slug)

  return (
    <AudienceProvider>
      <div className="min-h-screen">
        <div className="hp">
          <HomepageNav />
        </div>
        <main className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4">
              Blog
            </h1>
            <p className="text-lg text-muted-foreground">
              Insights on pay by bank, clearing infrastructure, and programmable treasury.
            </p>
          </div>

          {/* Featured post */}
          <Link
            to="/blog/$slug"
            params={{ slug: featuredPost.slug }}
            className="group block mb-12 md:mb-16"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center bg-secondary/30 rounded-2xl p-6 md:p-8 card-hover">
              <div className="aspect-[16/9] rounded-xl overflow-hidden">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  width={1200}
                  height={675}
                  loading="eager"
                  decoding="async"
                  className={`w-full h-full transition-transform duration-300 ${featuredPost.imageFit === 'contain' ? 'object-contain bg-secondary/20 p-4' : 'object-cover group-hover:scale-105'}`}
                />
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
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="group bg-white rounded-2xl border border-border overflow-hidden card-hover"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    width={1200}
                    height={675}
                    loading={index < 4 ? 'eager' : 'lazy'}
                    decoding="async"
                    className={`w-full h-full transition-transform duration-300 ${post.imageFit === 'contain' ? 'object-contain bg-secondary/20 p-4' : 'object-cover group-hover:scale-105'}`}
                  />
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
        <div className="hp">
          <HomepageFooter />
        </div>
      </div>
    </AudienceProvider>
  )
}
