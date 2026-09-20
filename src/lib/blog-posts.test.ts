import { describe, expect, it } from 'vitest'

import { articleAuthor, blogPosts, getBlogPost, getRelatedPosts, getYouTubeEmbedUrl } from './blog-posts'

describe('blog post slug resolution', () => {
  it('resolves canonical posts from legacy slugs', () => {
    const post = getBlogPost(
      'quidkey-achieves-soc-2-type-ii-compliance-strengthening-security-for-global-payments'
    )

    expect(post?.slug).toBe('soc-2-type-ii-compliance-global-payments')
  })

  it('resolves related posts using canonical slugs', () => {
    const posts = getRelatedPosts([
      'soc-2-type-ii-compliance-global-payments',
      'a2a-payments-cut-merchant-fees',
    ])

    expect(posts).toHaveLength(2)
    expect(posts[0]?.slug).toBe('soc-2-type-ii-compliance-global-payments')
    expect(posts[1]?.slug).toBe('a2a-payments-cut-merchant-fees')
  })
})

describe('youtube embeds', () => {
  it('uses the privacy-enhanced YouTube embed domain', () => {
    expect(getYouTubeEmbedUrl('abc123')).toBe('https://www.youtube-nocookie.com/embed/abc123')
  })
})

describe('articleAuthor', () => {
  it('credits the company byline to the organisation, not a person', () => {
    const post = blogPosts.find((p) => p.author === 'Quidkey Team')

    expect(post).toBeDefined()
    expect(articleAuthor(post!)).toEqual({ kind: 'organization' })
  })

  it('credits a named byline to that person with their profile link', () => {
    const post = getBlogPost('the-missing-primitive-in-the-agent-economy')

    expect(articleAuthor(post!)).toEqual({
      kind: 'person',
      name: 'Rabea Bader',
      url: 'https://www.linkedin.com/in/rabea-bader/',
    })
  })
})

describe('author profile links', () => {
  it('are LinkedIn profile URLs wherever a post sets one', () => {
    for (const post of blogPosts) {
      if (post.authorLinkedIn) {
        expect(post.authorLinkedIn).toMatch(/^https:\/\/www\.linkedin\.com\/in\/[^/]+\/$/)
      }
    }
  })
})
