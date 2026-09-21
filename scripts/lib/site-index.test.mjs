import { describe, expect, it } from 'vitest'

import { renderSiteIndex } from './site-index.mjs'

const input = {
  siteOrigin: 'https://example.com',
  summary: 'What we do.',
  pages: [
    { path: '/', label: 'Home' },
    { path: '/blog', label: 'Blog' },
  ],
  posts: [
    { slug: 'older', dateISO: '2026-01-01', title: 'Older' },
    { slug: 'newer', dateISO: '2026-02-01', title: 'Newer' },
  ],
}

describe('renderSiteIndex', () => {
  it('is a markdown outline: one title, a heading per section, a link per entry', () => {
    const lines = renderSiteIndex(input).split('\n').filter(Boolean)

    expect(lines[0]).toBe('# Quidkey')
    expect(lines.filter((line) => line.startsWith('## '))).toEqual(['## Pages', '## Blog', '## Developers'])
    for (const line of lines.slice(1)) {
      expect(line).toMatch(/^(## |> |- \[[^\]]+\]\(https?:\/\/[^)]+\))/)
    }
  })

  it('links every page and lists posts newest first with their dates', () => {
    const md = renderSiteIndex(input)

    expect(md).toContain('- [Home](https://example.com/)')
    expect(md).toContain('- [Blog](https://example.com/blog)')
    expect(md.indexOf('[Newer](https://example.com/blog/newer): 2026-02-01')).toBeLessThan(
      md.indexOf('[Older](https://example.com/blog/older): 2026-01-01'),
    )
  })
})
