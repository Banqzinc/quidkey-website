import { describe, expect, it } from 'vitest'

import { buildFaqSchema, buildSeo } from './seo'

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
