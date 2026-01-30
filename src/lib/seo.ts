const SITE_URL = 'https://quidkey.com'
const DEFAULT_OG_IMAGE =
  'https://storage.googleapis.com/quidkey-resources-public/quidkey-logo-fav.png'

type BuildSeoInput = {
  title: string
  description: string
  /**
   * Absolute path for this page, e.g. "/", "/products/workflows".
   */
  path: `/${string}` | '/'
  /**
   * OpenGraph type ("website" by default; use "article" for blog posts).
   */
  ogType?: 'website' | 'article'
  /**
   * Optional override if a page needs a different image.
   */
  imageUrl?: string
  /**
   * Article-specific metadata for blog posts (enables Article schema).
   */
  article?: {
    datePublished: string // ISO 8601 format
    dateModified?: string // ISO 8601 format
    author: string
    headline: string
  }
}

export function buildSeo({
  title,
  description,
  path,
  ogType = 'website',
  imageUrl,
  article,
}: BuildSeoInput) {
  const url = new URL(path, SITE_URL).toString()
  const image = imageUrl ?? DEFAULT_OG_IMAGE

  const meta = [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: ogType },
    { property: 'og:url', content: url },
    { property: 'og:image', content: image },
    { property: 'og:site_name', content: 'Quidkey' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
    { name: 'twitter:site', content: '@quidkey' },
  ]

  // Add article-specific meta tags
  if (article) {
    meta.push(
      { property: 'article:published_time', content: article.datePublished },
      { property: 'article:author', content: article.author }
    )
    if (article.dateModified) {
      meta.push({ property: 'article:modified_time', content: article.dateModified })
    }
  }

  return {
    meta,
    links: [{ rel: 'canonical', href: url }],
  }
}

/**
 * Generates Article schema JSON-LD for blog posts.
 * Inject this into the page as a <script type="application/ld+json"> tag.
 */
export function buildArticleSchema({
  title,
  description,
  datePublished,
  dateModified,
  author,
  url,
  imageUrl,
}: {
  title: string
  description: string
  datePublished: string
  dateModified?: string
  author: string
  url: string
  imageUrl?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: imageUrl ?? DEFAULT_OG_IMAGE,
    datePublished: datePublished,
    dateModified: dateModified ?? datePublished,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Quidkey',
      logo: {
        '@type': 'ImageObject',
        url: DEFAULT_OG_IMAGE,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }
}

export { SITE_URL, DEFAULT_OG_IMAGE }
