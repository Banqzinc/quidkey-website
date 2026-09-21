import type { JSX } from 'react'

import { slugify } from './slugify'
import { GITHUB_URL } from './urls'

function normalizeOrigin(input: string) {
  // Accept both full origins and full URLs.
  // Always return an origin (no path/query/hash), without trailing slash.
  try {
    const url = new URL(input)
    return url.origin
  } catch {
    // Try adding scheme if user passed "example.com"
    try {
      const url = new URL(`https://${input}`)
      return url.origin
    } catch {
      return 'https://quidkey.com'
    }
  }
}

/**
 * Best-effort site origin used for canonical URLs and OG tags.
 *
 * Priority:
 * - `VITE_SITE_URL` (set in Netlify/Vite env)
 * - `window.location.origin` (client-side)
 * - default production origin
 */
export function getSiteUrl() {
  const envUrl = import.meta.env.VITE_SITE_URL as string | undefined
  if (envUrl) return normalizeOrigin(envUrl)
  return 'https://quidkey.com'
}

const DEFAULT_OG_IMAGE =
  'https://storage.googleapis.com/quidkey-resources-public/quidkey-logo-fav.png'

type JsonLdPrimitive = string | number | boolean | null
type JsonLdValue = JsonLdPrimitive | JsonLdValue[] | { [key: string]: JsonLdValue | undefined }
export type JsonLdObject = { [key: string]: JsonLdValue | undefined }

// What a route head's `meta` accepts, plus the JSON-LD entry TanStack Start renders as a <script>.
type HeadMeta = JSX.IntrinsicElements['meta'] & { 'script:ld+json'?: JsonLdObject }

type BuildSeoInput = {
  title: string
  /**
   * Override for og:title and twitter:title when the sharing title should
   * differ from the <title> tag (e.g. full article headline vs short SEO title).
   */
  ogTitle?: string
  description: string
  /**
   * Optional keyword(s) for this page.
   * Note: modern search engines don't rely heavily on meta keywords, but we use
   * it for completeness and to power Article tags + schema keywords.
   */
  keywords?: string | string[]
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
   * Optional image dimensions for richer Open Graph previews.
   */
  imageWidth?: number
  imageHeight?: number
  /**
   * Article-specific metadata for blog posts (enables Article schema).
   */
  article?: {
    datePublished: string // ISO 8601 format
    dateModified?: string // ISO 8601 format
    author: string
    headline: string
  }
  structuredData?: JsonLdObject[]
}

export function buildSeo({
  title,
  ogTitle,
  description,
  keywords,
  path,
  ogType = 'website',
  imageUrl,
  imageWidth,
  imageHeight,
  article,
  structuredData,
}: BuildSeoInput) {
  const url = new URL(path, getSiteUrl()).toString()
  const image = imageUrl ?? DEFAULT_OG_IMAGE
  const keywordsContent =
    typeof keywords === 'string' ? keywords : keywords?.filter(Boolean).join(', ')
  const sharingTitle = ogTitle ?? title

  const meta: HeadMeta[] = [
    { title },
    { name: 'description', content: description },
    ...(keywordsContent ? [{ name: 'keywords', content: keywordsContent }] : []),
    { property: 'og:title', content: sharingTitle },
    { property: 'og:description', content: description },
    { property: 'og:type', content: ogType },
    { property: 'og:url', content: url },
    { property: 'og:image', content: image },
    ...(imageWidth ? [{ property: 'og:image:width', content: String(imageWidth) }] : []),
    ...(imageHeight ? [{ property: 'og:image:height', content: String(imageHeight) }] : []),
    { property: 'og:site_name', content: 'Quidkey' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: sharingTitle },
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
    if (keywordsContent) {
      meta.push({ property: 'article:tag', content: keywordsContent })
    }
    if (article.dateModified) {
      meta.push({ property: 'article:modified_time', content: article.dateModified })
    }
  }

  // One graph per page: the page itself, the site it belongs to, the
  // organisation behind the site, then whatever the route adds (Article,
  // FAQPage, VideoObject). An article page is dated by the article, anything
  // else by the build.
  const site = getSiteUrl()
  const page = {
    '@type': 'WebPage',
    '@id': url,
    url,
    name: title,
    headline: title,
    description,
    dateModified: article ? (article.dateModified ?? article.datePublished) : buildDate(),
    isPartOf: { '@id': `${site}/#website` },
  }
  meta.push({
    'script:ld+json': {
      '@context': 'https://schema.org',
      '@graph': [page, webSiteNode(), organizationNode(), ...anchoredToPage(url, structuredData ?? [])],
    },
  })

  return {
    // TanStack Router supports a dedicated `title` field; keep it separate from `meta`.
    title,
    meta,
    links: [{ rel: 'canonical', href: url }],
  }
}

// Route nodes are built without knowing their page; give any that lack an @id
// one under the page URL so the graph holds no blank nodes.
function anchoredToPage(url: string, nodes: JsonLdObject[]): JsonLdObject[] {
  const seen = new Map<string, number>()
  const repeats = new Map<string, number>()
  for (const node of nodes) {
    const type = String(node['@type']).toLowerCase()
    seen.set(type, (seen.get(type) ?? 0) + 1)
  }
  return nodes.map((node) => {
    if (node['@id']) return node
    const type = String(node['@type']).toLowerCase()
    if ((seen.get(type) ?? 0) === 1) return { '@id': `${url}#${type}`, ...node }
    const n = (repeats.get(type) ?? 0) + 1
    repeats.set(type, n)
    return { '@id': `${url}#${type}-${n}`, ...node }
  })
}

function buildDate(): string {
  const date = import.meta.env.VITE_BUILD_DATE
  if (typeof date !== 'string') throw new Error('VITE_BUILD_DATE is not defined; vite.config.ts stamps it')
  return date
}

export type ArticleAuthor =
  | { kind: 'person'; name: string; url?: string }
  | { kind: 'organization' }

function organizationRef() {
  return { '@id': `${getSiteUrl()}/#organization` }
}

// Validators want `logo` as a URL string, not an ImageObject.
function organizationNode() {
  const site = getSiteUrl()
  return {
    '@type': 'Organization' as const,
    ...organizationRef(),
    name: 'Quidkey',
    url: `${site}/`,
    sameAs: [GITHUB_URL],
    logo: DEFAULT_OG_IMAGE,
  }
}

function webSiteNode() {
  const site = getSiteUrl()
  return {
    '@type': 'WebSite' as const,
    '@id': `${site}/#website`,
    url: `${site}/`,
    name: 'Quidkey',
    publisher: organizationRef(),
  }
}

function personNode({ name, url }: { name: string; url?: string }) {
  return {
    '@type': 'Person' as const,
    '@id': `${getSiteUrl()}/#person-${slugify(name)}`,
    name,
    ...(url ? { url, sameAs: [url] } : {}),
  }
}

function authorNode(author: ArticleAuthor) {
  return author.kind === 'organization' ? organizationNode() : personNode(author)
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
  keywords,
}: {
  title: string
  description: string
  datePublished: string
  dateModified?: string
  author: ArticleAuthor
  url: string
  imageUrl?: string
  keywords?: string | string[]
}) {
  const keywordsValue = typeof keywords === 'string' ? keywords : keywords?.filter(Boolean)

  return {
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: title,
    description: description,
    image: imageUrl ?? DEFAULT_OG_IMAGE,
    datePublished: datePublished,
    dateModified: dateModified ?? datePublished,
    ...(keywordsValue ? { keywords: keywordsValue } : {}),
    // Inline rather than a reference: validators check the Article node alone.
    author: authorNode(author),
    publisher: organizationNode(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }
}

/**
 * Generates VideoObject schema JSON-LD for blog posts with embedded videos.
 * Inject this into the page as a <script type="application/ld+json"> tag.
 */
export function buildVideoSchema({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  contentUrl,
  embedUrl,
}: {
  name: string
  description: string
  thumbnailUrl: string
  uploadDate: string
  contentUrl: string
  embedUrl: string
}) {
  return {
    '@type': 'VideoObject',
    name,
    description,
    thumbnailUrl,
    uploadDate,
    contentUrl,
    embedUrl,
  }
}

export function buildFaqSchema(
  faqs: Array<{
    question: string
    answer: string
  }>
): JsonLdObject {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export { DEFAULT_OG_IMAGE }
