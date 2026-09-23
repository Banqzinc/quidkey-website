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
    const lines = renderSiteIndex({ ...input, agents: true }).split('\n').filter(Boolean)

    expect(lines[0]).toBe('# Quidkey')
    expect(lines.filter((line) => line.startsWith('## '))).toEqual([
      '## Pages',
      '## Blog',
      '## Developers',
      '## For agents',
    ])
    for (const line of lines.slice(1)) {
      expect(line).toMatch(/^(## |> |- \[[^\]]+\]\(https?:\/\/[^)]+\))/)
    }
  })

  it('leaves out the For agents section while the agents page is hidden', () => {
    const lines = renderSiteIndex({ ...input, agents: false }).split('\n').filter(Boolean)

    expect(lines.filter((line) => line.startsWith('## '))).toEqual(['## Pages', '## Blog', '## Developers'])
    expect(renderSiteIndex({ ...input, agents: false })).not.toContain('agents.md')
  })

  it('points agents at the offering in markdown and the registration file, on this origin', () => {
    const md = renderSiteIndex({ ...input, agents: true })

    expect(md).toContain('- [What Quidkey offers AI agents, in markdown](https://example.com/agents.md)')
    expect(md).toContain(
      '- [Agent registration instructions](https://example.com/.well-known/agent-registration.json)',
    )
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
