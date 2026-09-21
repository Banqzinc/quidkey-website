// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { formatBlogDate } from '@/lib/blog-meta'
import { blogPosts } from '@/lib/blog-posts'

import { ArticleHero } from './article-hero'

describe('ArticleHero', () => {
  afterEach(cleanup)

  it('marks the published date up as <time> carrying the ISO date the schema uses', () => {
    const post = blogPosts[0]
    const { container } = render(<ArticleHero post={post} />)

    const times = container.querySelectorAll(`time[datetime="${post.dateISO}"]`)
    expect(times.length).toBeGreaterThan(0)
    for (const time of times) expect(time.textContent).toBe(formatBlogDate(post.dateISO))
  })
})
