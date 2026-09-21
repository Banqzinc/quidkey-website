// Markdown index of the whole site. The same document is published as
// /llms.txt (the convention LLM tooling reads) and /sitemap.md (the hierarchy
// overview some agent crawlers probe for): a title, a heading per section and
// one link per page or post.
export function renderSiteIndex({ siteOrigin, summary, pages, posts }) {
  const newestFirst = [...posts].sort((a, b) => b.dateISO.localeCompare(a.dateISO))
  return [
    '# Quidkey',
    '',
    `> ${summary}`,
    '',
    '## Pages',
    ...pages.map((p) => `- [${p.label}](${siteOrigin}${p.path})`),
    '',
    '## Blog',
    ...newestFirst.map((p) => `- [${p.title}](${siteOrigin}/blog/${p.slug}): ${p.dateISO}`),
    '',
    '## Developers',
    '- [API docs](https://docs.quidkey.com)',
    `- [OpenAPI](${siteOrigin}/openapi.json)`,
    `- [Agent skills](${siteOrigin}/.well-known/agent-skills/index.json)`,
    '',
  ].join('\n')
}
