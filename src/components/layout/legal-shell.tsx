// Shared chrome for the five legal pages — a TS port of the prototype's
// legal-shell.jsx (Claude Design bundle). Composes the homepage nav and
// footer with a documenty hero, sibling-page tab strip, sticky TOC, and a
// numbered-section helper. Page content lives in the route files.

import { Link, type LinkProps } from '@tanstack/react-router'
import { useEffect, useState, type ReactNode } from 'react'

import { AudienceProvider } from '@/context/audience'
import { HomepageFooter } from './homepage-footer'
import { HomepageNav } from './homepage-nav'

// Same prefixed CSS bundle the homepage uses, plus the legal-page styles.
// Vite dedupes these so loading them here is fine even if the route also
// imports them directly.
import '@/styles/homepage/base.css'
import '@/styles/homepage/tm2.css'
import '@/styles/homepage/headings.css'
import '@/styles/homepage/mobile.css'
import '@/styles/homepage/legal.css'
import '@/styles/homepage/overrides.css'

export type LegalPageId =
  | 'privacy'
  | 'end-user-privacy'
  | 'terms'
  | 'complaints'

export type LegalSectionDef = { id: string; title: string }
export type LegalHeroMeta = { k: string; v: string }
export type LegalHero = {
  title: string
  lede: ReactNode
  meta: LegalHeroMeta[]
}

// Tab order — the four real legal pages. Cookies is intentionally not a
// sibling page: it's the consent banner, surfaced from the footer link.
type LegalPageEntry = { id: LegalPageId; to: LinkProps['to']; label: string }
export const LEGAL_PAGES: LegalPageEntry[] = [
  { id: 'privacy', to: '/privacy', label: 'Privacy Notice' },
  { id: 'end-user-privacy', to: '/end-user-privacy', label: 'End-User Privacy' },
  { id: 'terms', to: '/terms', label: 'Terms of Use' },
  { id: 'complaints', to: '/complaints', label: 'Complaints Procedure' },
]

function PageHero({ hero }: { hero: LegalHero }) {
  return (
    <section className="legal-hero">
      <div className="container">
        <div className="legal-hero__inner">
          <div className="legal-hero__l">
            <div className="legal-hero__crumbs">
              <Link to="/">Quidkey</Link>
              <span className="legal-hero__crumbs-sep">/</span>
              <span>Legal</span>
              <span className="legal-hero__crumbs-sep">/</span>
              <span className="legal-hero__crumbs-active">{hero.title}</span>
            </div>
            <h1 className="legal-hero__title">{hero.title}</h1>
            <p className="legal-hero__lede">{hero.lede}</p>
          </div>
          <div className="legal-hero__meta" aria-label="Document metadata">
            {hero.meta.map((m) => (
              <div key={m.k} className="legal-hero__meta-row">
                <span>{m.k}</span>
                <span>{m.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function PageTabs({ pageId }: { pageId: LegalPageId }) {
  return (
    <div className="legal-tabs">
      <div className="container">
        <div className="legal-tabs__inner">
          {LEGAL_PAGES.map((p) => (
            <Link key={p.id} to={p.to} className={p.id === pageId ? 'is-on' : ''}>
              {p.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function TOC({ sections }: { sections: LegalSectionDef[] }) {
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
      { rootMargin: '-160px 0px -70% 0px', threshold: 0 }
    )
    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [sections])

  return (
    <aside className="legal-toc" aria-label="On this page">
      <div className="legal-toc__h">On this page</div>
      <ol className="legal-toc__list">
        {sections.map((s, i) => (
          <li key={s.id}>
            <a href={`#${s.id}`} className={s.id === activeId ? 'is-on' : ''}>
              <span className="legal-toc__num">{String(i + 1).padStart(2, '0')}</span>
              <span>{s.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </aside>
  )
}

// Numbered-section helper: <S id num title>…</S> renders the design's
// "§ NN  Title" H2 over the children block. Mirrors legal-shell.jsx:202-209.
export function LegalSection({
  id,
  num,
  title,
  children,
}: {
  id: string
  num: number
  title: string
  children: ReactNode
}) {
  return (
    <section id={id}>
      <h2>
        <span className="legal-h2__num">§ {String(num).padStart(2, '0')}</span>
        <span>{title}</span>
      </h2>
      {children}
    </section>
  )
}

// Inline contact card rendered at the bottom of every legal page. The
// "File a complaint" CTA always points at /complaints, so on the complaints
// page itself the second button can be hidden via prop.
export function ContactCard({
  topic = 'this notice',
  email = 'legal@quidkey.com',
  showComplaintsLink = true,
}: {
  topic?: string
  email?: string
  showComplaintsLink?: boolean
}) {
  return (
    <div className="legal-contact">
      <div className="legal-contact__l">
        <h4>Questions about {topic}?</h4>
        <p>
          Our team can usually answer within two working days. Use the contact details below or
          write to us at the address in the document metadata.
        </p>
      </div>
      <div className="legal-contact__r">
        <a href={`mailto:${email}`} className="btn btn--ink btn--pill">
          Email {email}
        </a>
        {showComplaintsLink && (
          <Link to="/complaints" className="btn btn--ghost btn--pill">
            File a complaint
          </Link>
        )}
      </div>
    </div>
  )
}

export function LegalShell({
  pageId,
  hero,
  sections,
  children,
}: {
  pageId: LegalPageId
  hero: LegalHero
  sections: LegalSectionDef[]
  children: ReactNode
}) {
  // Set body[data-page="<id>"] so per-page styles/instrumentation can target
  // it. Restore the previous value on unmount in case multiple legal pages
  // mount during a route transition.
  useEffect(() => {
    const prev = document.body.dataset.page
    document.body.dataset.page = pageId
    return () => {
      if (prev !== undefined) document.body.dataset.page = prev
      else delete document.body.dataset.page
    }
  }, [pageId])

  // HomepageNav and HomepageFooter both call useAudience(), so the legal
  // routes must mount their own AudienceProvider just like the homepage does.
  return (
    <AudienceProvider>
      <div className="hp legal-page">
        <HomepageNav />
        <PageHero hero={hero} />
        <PageTabs pageId={pageId} />
        <div className="legal-body">
          <div className="container">
            <div className="legal-body__grid">
              <TOC sections={sections} />
              <article className="legal-article">{children}</article>
            </div>
          </div>
        </div>
        <HomepageFooter variant="legal" />
      </div>
    </AudienceProvider>
  )
}
