import { describe, expect, it } from 'vitest'

import { getBlogPost, getRelatedPosts } from './blog-posts'

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
