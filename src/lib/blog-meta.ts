// Blog metadata that augments the existing posts in blog-posts.ts without
// touching the post records themselves. Keeps SEO / content / slugs intact.
//
// - Categories follow the editorial taxonomy from the Anthropic Claude Design
//   blog prototype (Engineering / Product / Leadership). Default for any new
//   post not listed here is 'Product'.
// - Read time is computed from the post's text blocks at ~200 words per
//   minute, rounded up, with a 4-minute floor.

import type { BlogPost } from '@/lib/blog-posts'

export type BlogCategory = 'Engineering' | 'Product' | 'Leadership'

export const BLOG_CATEGORIES: BlogCategory[] = ['Engineering', 'Product', 'Leadership']

const SLUG_TO_CATEGORY: Record<string, BlogCategory> = {
  'the-real-cost-of-card-processing-for-shopify-merchants': 'Product',
  'the-missing-primitive-in-the-agent-economy': 'Leadership',
  'payment-links-are-live-get-paid-instantly-with-just-a-link': 'Product',
  'open-finance-in-the-us-part-3-building-a-pay-by-bank-in-the-us': 'Engineering',
  'quidkey-is-live-on-shopify': 'Product',
  'open-finance-in-the-us-part-2-rule-1033': 'Leadership',
  'we-launched-a-new-website-in-a-day': 'Engineering',
  'open-finance-in-the-us-part-1': 'Leadership',
  'pay-by-bank-refunds-shopify-merchants': 'Product',
  'soc-2-type-ii-compliance-global-payments': 'Engineering',
  'quidkey-a-global-clearing-house-for-modern-payments': 'Leadership',
  'quidkey-tryp-pay-by-bank-travel-payments': 'Product',
  'refunds-rewards-and-real-time-settlement-unlocking-merchant-payments': 'Product',
  'quidkey-and-transfermate-drive-down-card-costs-for-merchants': 'Product',
  'pay-by-bank-the-future-of-payments': 'Leadership',
  'open-banking-payments-in-the-uk': 'Product',
  'a2a-payments-cut-merchant-fees': 'Leadership',
}

export function getBlogCategory(slug: string): BlogCategory {
  return SLUG_TO_CATEGORY[slug] ?? 'Product'
}

const WORDS_PER_MINUTE = 200

function countBlockWords(block: BlogPost['blocks'][number]): number {
  switch (block.type) {
    case 'h2':
    case 'h3':
    case 'p':
      return block.text.split(/\s+/).filter(Boolean).length
    case 'ul':
    case 'ol':
      return block.items.reduce((n, t) => n + t.split(/\s+/).filter(Boolean).length, 0)
    case 'html':
      return block.html
        .replace(/<[^>]+>/g, ' ')
        .split(/\s+/)
        .filter(Boolean).length
    case 'table':
      return [...block.headers, ...block.rows.flat()].reduce(
        (n, t) => n + t.split(/\s+/).filter(Boolean).length,
        0,
      )
    case 'youtube':
      return 30 // rough — a video block adds ~30s of context
    default:
      return 0
  }
}

export function getBlogReadMin(post: BlogPost): number {
  const words = post.blocks.reduce((n, b) => n + countBlockWords(b), 0)
  const min = Math.ceil(words / WORDS_PER_MINUTE)
  return Math.max(4, min)
}

/** Format a post's display date as "15 Apr 2026" to match the prototype. */
export function formatBlogDate(dateISO: string): string {
  const d = new Date(dateISO)
  if (Number.isNaN(d.getTime())) return dateISO
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d)
}

/** Total raw word count across all body blocks — used for the hero meta strip. */
export function countWords(blocks: BlogPost['blocks']): number {
  return blocks.reduce((n, b) => n + countBlockWords(b), 0)
}

/**
 * Convert a heading into a URL-safe slug for use as an in-page anchor.
 * Lowercases, strips non-word chars, collapses whitespace to hyphens.
 */
export function slugifyHeading(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip combining diacritics
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // drop punctuation
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export type BlogSection = {
  id: string
  title: string
  /** Two-digit sequence number ("01", "02", ...) for the prose H2 prefix. */
  num: string
}

/**
 * Derive table-of-contents entries from the post's `h2` blocks. IDs are
 * slugified from the heading text; collisions are disambiguated with `-2`,
 * `-3`, etc. The matching IDs are also injected on the rendered headings so
 * `#anchor` links work without any post-side bookkeeping.
 */
export function deriveSections(blocks: BlogPost['blocks']): BlogSection[] {
  const sections: BlogSection[] = []
  const seen = new Map<string, number>()
  for (const b of blocks) {
    if (b.type !== 'h2') continue
    const base = slugifyHeading(b.text) || 'section'
    const count = (seen.get(base) ?? 0) + 1
    seen.set(base, count)
    const id = count === 1 ? base : `${base}-${count}`
    sections.push({
      id,
      title: b.text,
      num: String(sections.length + 1).padStart(2, '0'),
    })
  }
  return sections
}
