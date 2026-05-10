import { useEffect, useState } from 'react'

import type { BlogSection } from '@/lib/blog-meta'
import { track } from '@/lib/track'

type Props = {
  slug: string
  sections: BlogSection[]
}

/**
 * Sticky left-rail table of contents. Only rendered when the article has
 * at least 2 H2 sections — short posts skip the TOC entirely so the prose
 * gets the full content column. Active section is tracked via
 * IntersectionObserver, mirroring the legal-shell.tsx pattern.
 */
export function ArticleTOC({ slug, sections }: Props) {
  const [activeId, setActiveId] = useState<string | undefined>(sections[0]?.id)

  useEffect(() => {
    if (sections.length === 0) return
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length === 0) return
        visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        setActiveId(visible[0].target.id)
      },
      { rootMargin: '-100px 0px -70% 0px', threshold: 0 },
    )
    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [sections])

  if (sections.length < 2) return null

  return (
    <aside className="atoc" aria-label="On this page">
      <h4 className="atoc__h">On this page</h4>
      <ol className="atoc__list">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={s.id === activeId ? 'is-on' : ''}
              aria-current={s.id === activeId ? 'location' : undefined}
              onClick={() => track({ name: 'article_toc_click', slug, section_id: s.id })}
            >
              <span className="atoc__num">{s.num}</span>
              <span>{s.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </aside>
  )
}
