import { describe, expect, it } from 'vitest'

import { buildArticleSchema, buildFaqSchema, buildSeo, DEFAULT_OG_IMAGE, type JsonLdObject } from './seo'

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

    expect(graphOf(seo).some((node) => node['@type'] === 'FAQPage')).toBe(true)
  })
})

describe('buildArticleSchema', () => {
  const base = {
    title: 'Pay by Bank refunds',
    description: 'How refunds work.',
    datePublished: '2026-01-02',
    url: 'https://quidkey.com/blog/refunds',
  }

  it('anchors the article with a stable id and inlines the publisher, since validators do not follow references', () => {
    const schema = buildArticleSchema({ ...base, author: { kind: 'organization' } })

    expect(schema['@id']).toBe('https://quidkey.com/blog/refunds#article')
    expect(schema.publisher).toMatchObject({
      '@id': 'https://quidkey.com/#organization',
      name: 'Quidkey',
      logo: DEFAULT_OG_IMAGE,
    })
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

    expect(schema.author).toEqual(schema.publisher)
    expect(schema.author).toMatchObject({ '@id': 'https://quidkey.com/#organization', name: 'Quidkey' })
  })
})

function graphOf(seo: ReturnType<typeof buildSeo>): JsonLdObject[] {
  const blocks = seo.meta.flatMap((entry) => (entry['script:ld+json'] ? [entry['script:ld+json']] : []))
  expect(blocks).toHaveLength(1)
  return blocks[0]['@graph'] as JsonLdObject[]
}

describe('buildSeo structured data', () => {
  const seo = buildSeo({ title: 'Pricing | Quidkey', description: 'Transparent pricing.', path: '/pricing' })
  const byType = (type: string) => graphOf(seo).find((node) => node['@type'] === type)

  it('describes the page as a WebPage with a stable id, headline, description, url and modification date', () => {
    expect(import.meta.env.VITE_BUILD_DATE).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(byType('WebPage')).toMatchObject({
      '@id': 'https://quidkey.com/pricing',
      url: 'https://quidkey.com/pricing',
      name: 'Pricing | Quidkey',
      headline: 'Pricing | Quidkey',
      description: 'Transparent pricing.',
      dateModified: import.meta.env.VITE_BUILD_DATE,
      isPartOf: { '@id': 'https://quidkey.com/#website' },
    })
  })

  it('places the page inside the site, and the site under the organisation, in one graph', () => {
    expect(byType('WebSite')).toMatchObject({
      '@id': 'https://quidkey.com/#website',
      url: 'https://quidkey.com/',
      publisher: { '@id': 'https://quidkey.com/#organization' },
    })
    expect(byType('Organization')).toMatchObject({
      '@id': 'https://quidkey.com/#organization',
      url: 'https://quidkey.com/',
      logo: DEFAULT_OG_IMAGE,
      sameAs: ['https://github.com/Banqzinc'],
    })
  })

  it('dates an article page by the article, not by the build', () => {
    const article = buildSeo({
      title: 'T',
      description: 'D',
      path: '/blog/t',
      article: { datePublished: '2026-01-02', dateModified: '2026-01-05', author: 'A', headline: 'T' },
    })

    expect(graphOf(article).find((node) => node['@type'] === 'WebPage')?.dateModified).toBe('2026-01-05')
  })

  it('appends route-specific nodes to the same graph, each with an id anchored to the page', () => {
    const withFaq = buildSeo({
      title: 'T',
      description: 'D',
      path: '/faq',
      structuredData: [
        buildFaqSchema([{ question: 'Q', answer: 'A' }]),
        { '@type': 'VideoObject', name: 'one' },
        { '@type': 'VideoObject', name: 'two' },
      ],
    })

    const graph = graphOf(withFaq)
    expect(graph.map((node) => node['@type'])).toEqual(['WebPage', 'WebSite', 'Organization', 'FAQPage', 'VideoObject', 'VideoObject'])
    expect(graph.map((node) => node['@id'])).toEqual([
      'https://quidkey.com/faq',
      'https://quidkey.com/#website',
      'https://quidkey.com/#organization',
      'https://quidkey.com/faq#faqpage',
      'https://quidkey.com/faq#videoobject-1',
      'https://quidkey.com/faq#videoobject-2',
    ])
  })

  it('keeps an id a route node already carries', () => {
    const seo = buildSeo({
      title: 'T',
      description: 'D',
      path: '/x',
      structuredData: [{ '@type': 'Article', '@id': 'https://quidkey.com/x#article' }],
    })

    expect(graphOf(seo).at(-1)?.['@id']).toBe('https://quidkey.com/x#article')
  })
})
