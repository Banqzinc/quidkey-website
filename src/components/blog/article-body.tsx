import type { BlogPost, BlogPostBlock } from '@/lib/blog-posts'
import { getYouTubeEmbedUrl } from '@/lib/blog-posts'
import { deriveSections } from '@/lib/blog-meta'

type LeadIsh = Extract<BlogPostBlock, { type: 'p' | 'html' }>

function isLeadEligible(b: BlogPostBlock): b is LeadIsh {
  return b.type === 'p' || b.type === 'html'
}

/** Index of the first paragraph/html block — gets `.aprose__lead` styling. */
function findLeadIndex(blocks: BlogPostBlock[]): number {
  return blocks.findIndex(isLeadEligible)
}

/**
 * Render the post body inside an `.aprose` container. Blocks map to native
 * elements with article-css styling. The first `p`/`html` block becomes the
 * lead (drop-cap + 21px), and every `h2` gets a stable id derived from its
 * text plus a numbered prefix matching the TOC.
 */
export function ArticleBody({ post }: { post: BlogPost }) {
  const sections = deriveSections(post.blocks)
  const leadIdx = findLeadIndex(post.blocks)

  // Walk blocks once, tracking which h2 we're on so we can stamp the matching
  // slug + numbered prefix from the derived sections.
  let h2Cursor = 0

  return (
    <div className="aprose">
      {post.blocks.map((block, idx) => {
        const leadClass = idx === leadIdx ? 'aprose__lead' : undefined

        if (block.type === 'h2') {
          const section = sections[h2Cursor++]
          return (
            <h2 key={idx} id={section?.id}>
              {block.text}
            </h2>
          )
        }
        if (block.type === 'h3') {
          return <h3 key={idx}>{block.text}</h3>
        }
        if (block.type === 'p') {
          return (
            <p key={idx} className={leadClass}>
              {block.text}
            </p>
          )
        }
        if (block.type === 'html') {
          // Content is hand-curated in src/lib/blog-posts.ts — never user input.
          // Same pattern as the existing $slug.tsx route prior to this redesign.
          const htmlProp = { __html: block.html }
          return (
            <div
              key={idx}
              className={leadClass}
              dangerouslySetInnerHTML={htmlProp}
            />
          )
        }
        if (block.type === 'ul') {
          return (
            <ul key={idx}>
              {block.items.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ul>
          )
        }
        if (block.type === 'ol') {
          return (
            <ol key={idx}>
              {block.items.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ol>
          )
        }
        if (block.type === 'table') {
          // .adata grid: header row first (styled by .adata__rows nth-child),
          // then data cells. Column count drives the grid template.
          const colCount = block.headers.length
          return (
            <div key={idx} className="adata">
              <div
                className="adata__rows"
                style={{
                  gridTemplateColumns: `1.2fr repeat(${Math.max(0, colCount - 1)}, 1fr)`,
                }}
              >
                {block.headers.map((h, i) => (
                  <div key={`h-${i}`}>{h}</div>
                ))}
                {block.rows.flatMap((row, rIdx) =>
                  row.map((cell, cIdx) => (
                    <div
                      key={`c-${rIdx}-${cIdx}`}
                      className={`adata__cell${cIdx > 0 ? ' adata__cell--num' : ''}`}
                    >
                      {cell}
                    </div>
                  )),
                )}
              </div>
            </div>
          )
        }
        if (block.type === 'youtube') {
          return (
            <figure key={idx}>
              <div className="ph__wrap">
                <iframe
                  width="100%"
                  height="100%"
                  src={getYouTubeEmbedUrl(block.videoId)}
                  title={block.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
              <figcaption>{block.title}</figcaption>
            </figure>
          )
        }
        return null
      })}
    </div>
  )
}
