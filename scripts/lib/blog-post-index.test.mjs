import { readFile } from 'node:fs/promises'

import { describe, expect, it } from 'vitest'

import { parseBlogPosts } from './blog-post-index.mjs'

const SAMPLE = `
export const blogPosts: BlogPost[] = [
  {
    slug: 'first-post',
    date: 'August 6, 2026',
    dateISO: '2026-08-06',
    title:
      "It's the first post",
    seoTitle: 'First | Quidkey',
    blocks: [{ type: 'youtube', videoId: 'x', title: 'Video title' }],
  },
  {
    slug: 'second-post',
    legacySlugs: ['old-second'],
    date: 'May 1, 2026',
    dateISO: '2026-05-01',
    title: 'Second "quoted" post',
  },
]
`

describe('parseBlogPosts', () => {
  it('reads slug, date and title for each post whichever quote style the title uses', () => {
    expect(parseBlogPosts(SAMPLE)).toEqual([
      { slug: 'first-post', dateISO: '2026-08-06', title: "It's the first post" },
      { slug: 'second-post', dateISO: '2026-05-01', title: 'Second "quoted" post' },
    ])
  })

  it("refuses a post with no title rather than borrowing the next post's", () => {
    const broken = SAMPLE.replace(`title:\n      "It's the first post",\n`, '')
    expect(() => parseBlogPosts(broken)).toThrow(/first-post/)
  })

  it('indexes every post in the real data file', async () => {
    const source = await readFile(new URL('../../src/lib/blog-posts.ts', import.meta.url), 'utf8')
    const posts = parseBlogPosts(source)

    expect(posts).toHaveLength((source.match(/^ {4}slug: /gm) ?? []).length)
    for (const post of posts) {
      expect(post.dateISO).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(post.title.length).toBeGreaterThan(0)
    }
  })
})
