import { Link } from '@tanstack/react-router'

import type { BlogPost } from '@/lib/blog-posts'
import { getRelatedPosts } from '@/lib/blog-posts'
import { formatBlogDate, getBlogCategory, getBlogReadMin } from '@/lib/blog-meta'
import { track } from '@/lib/track'

type Props = {
  fromSlug: string
  relatedSlugs?: string[]
}

function RelatedCard({ post, fromSlug }: { post: BlogPost; fromSlug: string }) {
  const category = getBlogCategory(post.slug)
  const readMin = getBlogReadMin(post)
  const fitClass = post.imageFit === 'contain' ? 'bcard__img--contain' : 'bcard__img--cover'

  return (
    <article className="bcard">
      <Link
        to="/blog/$slug"
        params={{ slug: post.slug }}
        className="bcard__link"
        onClick={() =>
          track({
            name: 'article_related_click',
            from_slug: fromSlug,
            to_slug: post.slug,
          })
        }
      >
        <div className="bcard__media">
          <img
            src={post.image}
            alt={post.title}
            className={`bcard__img ${fitClass}`}
            width={post.imageWidth ?? 1600}
            height={post.imageHeight ?? 900}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="bcard__body">
          <div className="bcard__meta">
            <span className="bcard__date">{formatBlogDate(post.dateISO)}</span>
            <span className="bcard__cat">{category}</span>
          </div>
          <h3 className="bcard__h">{post.title}</h3>
          <p className="bcard__sub">{post.description}</p>
          <div className="bcard__foot">
            <span>{readMin} min read</span>
            <span style={{ color: 'var(--faint)' }}>·</span>
            <span>Read article</span>
            <span className="bcard__foot-arrow">→</span>
          </div>
        </div>
      </Link>
    </article>
  )
}

export function ArticleRelated({ fromSlug, relatedSlugs }: Props) {
  if (!relatedSlugs?.length) return null
  const posts = getRelatedPosts(relatedSlugs)
  if (posts.length === 0) return null

  return (
    <section className="arelated">
      <div className="container">
        <div className="arelated__head">
          <h2 className="arelated__h">Keep reading</h2>
          <Link to="/blog" className="arelated__more">
            All articles →
          </Link>
        </div>
        <div className="arelated__grid">
          {posts.map((p) => (
            <RelatedCard key={p.slug} post={p} fromSlug={fromSlug} />
          ))}
        </div>
      </div>
    </section>
  )
}
