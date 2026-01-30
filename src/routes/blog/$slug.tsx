import { createFileRoute, Link } from '@tanstack/react-router'
import { MegaMenu } from '@/components/layout/mega-menu'
import { Footer } from '@/components/layout/footer'
import { getBlogPost } from '@/lib/blog-posts'
import { buildSeo } from '@/lib/seo'

export const Route = createFileRoute('/blog/$slug')({
  head: ({ params }) => {
    const post = getBlogPost(params.slug)
    const title = post ? `${post.title} | Quidkey` : 'Blog | Quidkey'
    const description =
      post?.description ??
      'Insights on pay by bank, clearing infrastructure, and programmable treasury.'

    return buildSeo({
      title,
      description,
      path: post ? (`/blog/${params.slug}` as const) : '/blog',
      ogType: 'article',
    })
  },
  component: BlogPostPage,
})

function BlogPostPage() {
  const { slug } = Route.useParams()
  const post = getBlogPost(slug)

  return (
    <div className="min-h-screen">
      <MegaMenu />
      <main className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {!post ? (
            <div className="rounded-2xl border border-border bg-secondary/20 p-8">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3">
                Post not found
              </h1>
              <p className="text-muted-foreground mb-6">
                This article doesn’t exist yet. Head back to the blog index to browse available posts.
              </p>
              <Link to="/blog" className="text-primary hover:underline">
                Back to Blog
              </Link>
            </div>
          ) : (
            <article>
              <div className="mb-10">
                <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground">
                  ← Back to Blog
                </Link>
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mt-4 mb-3">
                  {post.title}
                </h1>
                <p className="text-sm text-muted-foreground">{post.date}</p>
                <p className="text-lg text-muted-foreground mt-4">{post.description}</p>
              </div>

              <div className="prose prose-slate max-w-none">
                {post.blocks.map((block, idx) => {
                  if (block.type === 'h2') return <h2 key={idx}>{block.text}</h2>
                  if (block.type === 'h3') return <h3 key={idx}>{block.text}</h3>
                  if (block.type === 'p') return <p key={idx}>{block.text}</p>
                  if (block.type === 'ul') {
                    return (
                      <ul key={idx}>
                        {block.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )
                  }
                  return null
                })}
              </div>
            </article>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

