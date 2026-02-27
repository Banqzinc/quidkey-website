import { createFileRoute, Link } from '@tanstack/react-router'
import { MegaMenu } from '@/components/layout/mega-menu'
import { Footer } from '@/components/layout/footer'
import { LinkedInIcon } from '@/components/icons'
import { getBlogPost } from '@/lib/blog-posts'
import { MERCHANTS_SIGNUP_URL } from '@/lib/urls'
import { buildSeo, buildArticleSchema, getSiteUrl } from '@/lib/seo'

export const Route = createFileRoute('/blog/$slug')({
  head: ({ params }) => {
    const post = getBlogPost(params.slug)

    if (!post) {
      return buildSeo({
        title: 'Blog | Quidkey',
        description:
          'Insights on pay by bank, clearing infrastructure, and programmable treasury.',
        path: '/blog',
      })
    }

    const siteUrl = getSiteUrl()
    // Use absolute URL for OG image
    const imageUrl = `${siteUrl}${post.image}`

    return buildSeo({
      title: post.seoTitle,
      ogTitle: post.title,
      description: post.description,
      keywords: post.keyword,
      path: `/blog/${params.slug}` as const,
      ogType: 'article',
      imageUrl,
      article: {
        datePublished: post.dateISO,
        author: post.author,
        headline: post.title,
      },
    })
  },
  component: BlogPostPage,
})

function BlogPostPage() {
  const { slug } = Route.useParams()
  const post = getBlogPost(slug)
  const siteUrl = getSiteUrl()

  // Generate JSON-LD schema for the article
  const articleSchema = post
    ? buildArticleSchema({
        title: post.title,
        description: post.description,
        datePublished: post.dateISO,
        author: post.author,
        url: `${siteUrl}/blog/${post.slug}`,
        imageUrl: `${siteUrl}${post.image}`,
        keywords: post.keyword,
      })
    : null

  return (
    <div className="min-h-screen">
      <MegaMenu />

      {/* JSON-LD Structured Data */}
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}

      <main className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {!post ? (
            <div className="rounded-2xl border border-border bg-secondary/20 p-8">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3">
                Post not found
              </h1>
              <p className="text-muted-foreground mb-6">
                This article doesn't exist yet. Head back to the blog index to
                browse available posts.
              </p>
              <Link to="/blog" className="text-primary hover:underline">
                Back to Blog
              </Link>
            </div>
          ) : (
            <article>
              {/* Header */}
              <div className="mb-10">
                <Link
                  to="/blog"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  ← Back to Blog
                </Link>
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mt-4 mb-3">
                  {post.title}
                </h1>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <time dateTime={post.dateISO}>{post.date}</time>
                  <span>•</span>
                  <span>By {post.author}</span>
                  {post.authorLinkedIn && (
                    <a
                      href={post.authorLinkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
                      aria-label={`${post.author} on LinkedIn`}
                    >
                      <LinkedInIcon className="h-4 w-4" />
                      <span className="sr-only">LinkedIn</span>
                    </a>
                  )}
                </div>
                <p className="text-lg text-muted-foreground mt-4">
                  {post.description}
                </p>
              </div>

              {/* Featured Image */}
              <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-10">
                <img
                  src={post.image}
                  alt={post.title}
                  width={1200}
                  height={675}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="space-y-5">
                {post.blocks.map((block, idx) => {
                  if (block.type === 'h2') {
                    return (
                      <h2
                        key={idx}
                        className="text-2xl font-semibold tracking-tight text-foreground mt-10 mb-4 pt-6 border-t border-border first:mt-0 first:pt-0 first:border-t-0"
                      >
                        {block.text}
                      </h2>
                    )
                  }
                  if (block.type === 'h3') {
                    return (
                      <h3
                        key={idx}
                        className="text-xl font-semibold tracking-tight text-foreground mt-8 mb-3"
                      >
                        {block.text}
                      </h3>
                    )
                  }
                  if (block.type === 'p') {
                    return (
                      <p
                        key={idx}
                        className="text-base leading-7 text-muted-foreground"
                      >
                        {block.text}
                      </p>
                    )
                  }
                  if (block.type === 'ul') {
                    return (
                      <ul key={idx} className="space-y-2 pl-6 my-4">
                        {block.items.map((item, itemIdx) => (
                          <li
                            key={itemIdx}
                            className="text-base leading-7 text-muted-foreground relative before:content-['•'] before:absolute before:-left-4 before:text-primary before:font-bold"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    )
                  }
                  if (block.type === 'ol') {
                    return (
                      <ol key={idx} className="space-y-2 pl-6 my-4 list-decimal">
                        {block.items.map((item, itemIdx) => (
                          <li
                            key={itemIdx}
                            className="text-base leading-7 text-muted-foreground"
                          >
                            {item}
                          </li>
                        ))}
                      </ol>
                    )
                  }
                  if (block.type === 'html') {
                    return (
                      <div
                        key={idx}
                        className="text-base leading-7 text-muted-foreground [&_strong]:text-foreground [&_strong]:font-semibold [&_em]:italic [&_a]:text-primary [&_a]:hover:underline [&_a]:font-medium [&_ul]:space-y-2 [&_ul]:pl-6 [&_ul]:my-2 [&_li]:relative [&_li]:before:content-['•'] [&_li]:before:absolute [&_li]:before:-left-4 [&_li]:before:text-primary [&_li]:before:font-bold"
                        dangerouslySetInnerHTML={{ __html: block.html }}
                      />
                    )
                  }
                  if (block.type === 'table') {
                    return (
                      <div key={idx} className="my-6 overflow-x-auto rounded-xl border border-border">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border bg-secondary/50">
                              {block.headers.map((header, hIdx) => (
                                <th
                                  key={hIdx}
                                  className="px-4 py-3 text-left font-semibold text-foreground"
                                >
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {block.rows.map((row, rIdx) => (
                              <tr
                                key={rIdx}
                                className="border-b border-border last:border-b-0 even:bg-secondary/10"
                              >
                                {row.map((cell, cIdx) => (
                                  <td
                                    key={cIdx}
                                    className={`px-4 py-3 align-top leading-6 ${cIdx === 0 ? 'font-medium text-foreground w-[28%] text-sm' : 'text-muted-foreground'}`}
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )
                  }
                  if (block.type === 'youtube') {
                    return (
                      <div key={idx} className="my-8 aspect-video rounded-2xl overflow-hidden">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${block.videoId}?si=QmDNmc4uWlKMOvQK`}
                          title={block.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                      </div>
                    )
                  }
                  return null
                })}
              </div>

              {/* Footer CTA */}
              <div className="mt-16 pt-8 border-t border-border">
                <div className="bg-secondary/50 rounded-2xl p-6 md:p-8">
                  <h3 className="text-xl font-semibold mb-2">
                    Ready to get started?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Add Quidkey to your checkout and start accepting bank
                    payments today.
                  </p>
                  <a
                    href={MERCHANTS_SIGNUP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
                  >
                    Get Started
                  </a>
                </div>
              </div>
            </article>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
