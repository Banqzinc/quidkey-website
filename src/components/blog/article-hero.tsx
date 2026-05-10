import type { BlogPost } from '@/lib/blog-posts'
import { formatBlogDate, getBlogCategory, getBlogReadMin } from '@/lib/blog-meta'

function authorInitials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('') || '?'
  )
}

export function ArticleHero({ post }: { post: BlogPost }) {
  const category = getBlogCategory(post.slug)
  const readMin = getBlogReadMin(post)
  const date = formatBlogDate(post.dateISO)

  return (
    <section className="ahero">
      <div className="container">
        <div className="ahero__meta">
          <span className="ahero__cat">{category}</span>
          <span className="ahero__dot" aria-hidden="true" />
          <span>{date}</span>
          <span className="ahero__dot" aria-hidden="true" />
          <span>{readMin} min read</span>
        </div>
        <h1 className="ahero__h">{post.title}</h1>
        <p className="ahero__sub">{post.description}</p>
        <div className="ahero__byline">
          <div className="ahero__author">
            <div className="ahero__avatar" aria-hidden="true">
              {authorInitials(post.author)}
            </div>
            <div>
              <div className="ahero__author-name">{post.author}</div>
              {post.authorRole ? (
                <div className="ahero__author-role">{post.authorRole}</div>
              ) : null}
            </div>
          </div>
          <div className="ahero__stat">
            <span className="ahero__stat-lbl">Published</span>
            <span className="ahero__stat-val">{date}</span>
          </div>
          <div className="ahero__stat">
            <span className="ahero__stat-lbl">Reading time</span>
            <span className="ahero__stat-val">{readMin} minutes</span>
          </div>
        </div>
      </div>
    </section>
  )
}
