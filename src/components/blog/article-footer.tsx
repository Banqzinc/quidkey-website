import { LinkedInIcon } from '@/components/icons'
import type { BlogPost } from '@/lib/blog-posts'

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

/**
 * Tags row + author bio block. Both render only when their data is present —
 * existing posts ship without these and the section is omitted entirely.
 */
export function ArticleFooter({ post }: { post: BlogPost }) {
  const hasTags = Boolean(post.tags?.length)
  const hasBio = Boolean(post.authorBio || post.authorRole)

  if (!hasTags && !hasBio) return null

  return (
    <div className="afooter">
      {hasTags ? (
        <div className="atags">
          <span className="atags__lbl">Tags</span>
          {post.tags!.map((t) => (
            <span key={t} className="atag">
              {t}
            </span>
          ))}
        </div>
      ) : null}
      {hasBio ? (
        <div className="abio">
          <div className="abio__avatar" aria-hidden="true">
            {authorInitials(post.author)}
          </div>
          <div>
            <div className="abio__name">{post.author}</div>
            {post.authorRole ? <div className="abio__role">{post.authorRole}</div> : null}
            {post.authorBio ? <p className="abio__bio">{post.authorBio}</p> : null}
            {post.authorLinkedIn ? (
              <div className="abio__links">
                <a
                  href={post.authorLinkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${post.author} on LinkedIn`}
                >
                  <LinkedInIcon className="inline-block h-3.5 w-3.5 align-text-bottom mr-1" />
                  LinkedIn ↗
                </a>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
