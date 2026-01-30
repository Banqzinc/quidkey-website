import { createFileRoute } from '@tanstack/react-router'
import { MegaMenu } from '@/components/layout/mega-menu'
import { Footer } from '@/components/layout/footer'
import { Link } from '@tanstack/react-router'
import { blogPosts } from '@/lib/blog-posts'

export const Route = createFileRoute('/blog')({
  component: BlogPage,
})

function BlogPage() {
  const featuredPost = blogPosts.find((p) => p.featured) ?? blogPosts[0]
  const otherPosts = blogPosts.filter((p) => p.slug !== featuredPost.slug)

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
                to="/blog/$slug"
                params={{ slug: post.slug }}
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
