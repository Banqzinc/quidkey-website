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
}

export function buildSeo({ title, description, path, ogType = 'website', imageUrl }: BuildSeoInput) {
  const url = new URL(path, SITE_URL).toString()
  const image = imageUrl ?? DEFAULT_OG_IMAGE

  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: ogType },
      { property: 'og:url', content: url },
      { property: 'og:image', content: image },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ],
    links: [{ rel: 'canonical', href: url }],
  }
}

export { SITE_URL, DEFAULT_OG_IMAGE }
