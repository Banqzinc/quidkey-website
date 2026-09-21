import { describe, expect, it } from 'vitest'

import { buildArticleSchema, buildFaqSchema, buildSeo } from './seo'

describe('buildSeo', () => {
  it('injects JSON-LD via route meta descriptors', () => {
    const seo = buildSeo({
      title: 'Pricing for Pay by Bank Payments | Quidkey',
      description: 'Transparent pricing for pay by bank payments.',
      path: '/pricing',
      structuredData: [
        buildFaqSchema([
          {
            question: 'How does Quidkey work?',
            answer: 'Quidkey predicts the customer bank at checkout.',
          },
        ]),
      ],
    })

    expect(
      seo.meta.some(
        (entry) =>
          'script:ld+json' in entry &&
          (entry['script:ld+json'] as { ['@type']?: string })['@type'] === 'FAQPage'
      )
    ).toBe(true)
  })
})

describe('buildArticleSchema', () => {
  const base = {
    title: 'Pay by Bank refunds',
    description: 'How refunds work.',
    datePublished: '2026-01-02',
    url: 'https://quidkey.com/blog/refunds',
  }

  it('anchors the article, the publisher and its logo with stable ids', () => {
    const schema = buildArticleSchema({ ...base, author: { kind: 'organization' } })

    expect(schema['@id']).toBe('https://quidkey.com/blog/refunds#article')
    expect(schema.publisher['@id']).toBe('https://quidkey.com/#organization')
    expect(schema.publisher.logo['@id']).toBe('https://quidkey.com/#logo')
  })

  it('links a named author to their profile', () => {
    const url = 'https://www.linkedin.com/in/rabea-bader/'
    const schema = buildArticleSchema({
      ...base,
      author: { kind: 'person', name: 'Rabea Bader', url },
    })

    expect(schema.author).toEqual({
      '@type': 'Person',
      '@id': 'https://quidkey.com/#person-rabea-bader',
      name: 'Rabea Bader',
      url,
      sameAs: [url],
    })
  })

  it('omits profile links for an author without one', () => {
    const schema = buildArticleSchema({ ...base, author: { kind: 'person', name: 'Jenny Zeko' } })

    expect(schema.author['@id']).toBe('https://quidkey.com/#person-jenny-zeko')
    expect(schema.author).not.toHaveProperty('url')
    expect(schema.author).not.toHaveProperty('sameAs')
  })

  it('credits the company as author with the same node as the publisher', () => {
    const schema = buildArticleSchema({ ...base, author: { kind: 'organization' } })

    expect(schema.author['@id']).toBe('https://quidkey.com/#organization')
    expect(schema.author['@id']).toBe(schema.publisher['@id'])
  })
})
