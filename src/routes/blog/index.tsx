import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

import { HomepageNav } from '@/components/layout/homepage-nav'
import { HomepageFooter } from '@/components/layout/homepage-footer'
import { AudienceProvider } from '@/context/audience'
import { blogPosts, type BlogPost } from '@/lib/blog-posts'
import {
  BLOG_CATEGORIES,
  formatBlogDate,
  getBlogCategory,
  getBlogReadMin,
  type BlogCategory,
} from '@/lib/blog-meta'
import { buildSeo } from '@/lib/seo'

import '@/styles/homepage/base.css'
import '@/styles/homepage/tm2.css'
import '@/styles/homepage/headings.css'
import '@/styles/homepage/integrations.css'
import '@/styles/homepage/treasury-head.css'
import '@/styles/homepage/mobile.css'
import '@/styles/homepage/section-padding.css'
import '@/styles/homepage/blog.css'
import '@/styles/homepage/overrides.css'

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Caveat:wght@500;600;700&family=Inter+Tight:ital,wght@0,100..900;1,100..900&display=swap'

type ViewFilter = 'All' | BlogCategory

export const Route = createFileRoute('/blog/')({
  component: BlogPage,
  head: () => {
    const seo = buildSeo({
      title: 'Pay by Bank Blog: A2A & Open Banking Insights | Quidkey',
      description:
        'Expert insights on pay by bank, A2A payments, open banking, and cross-border payment infrastructure. Learn how to reduce fees and improve conversion.',
      path: '/blog',
    })
    return {
      ...seo,
      links: [
        ...(seo.links ?? []),
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
        { rel: 'stylesheet', href: FONT_HREF },
      ],
    }
  },
})

function PostCard({ post }: { post: BlogPost }) {
  const category = getBlogCategory(post.slug)
  const readMin = getBlogReadMin(post)
  const fitClass = post.imageFit === 'contain' ? 'bcard__img--contain' : 'bcard__img--cover'

  return (
    <article className="bcard">
      <Link to="/blog/$slug" params={{ slug: post.slug }} className="bcard__link">
        <div className="bcard__media">
          <img
            src={post.image}
            alt={post.title}
            className={`bcard__img ${fitClass}`}
            width={post.imageWidth ?? 1600}
            height={post.imageHeight ?? 900}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="bcard__body">
          <div className="bcard__meta">
            <span className="bcard__date">{formatBlogDate(post.dateISO)}</span>
            <span className="bcard__cat">{category}</span>
          </div>
          <h3 className="bcard__h">{post.title}</h3>
          <p className="bcard__sub">{post.description}</p>
          <div className="bcard__foot">
            <span>{readMin} min read</span>
            <span style={{ color: 'var(--faint)' }}>·</span>
            <span>Read article</span>
            <span className="bcard__foot-arrow">→</span>
          </div>
        </div>
      </Link>
    </article>
  )
}

function BlogHero({ post }: { post: BlogPost }) {
  const category = getBlogCategory(post.slug)
  const readMin = getBlogReadMin(post)
  const fitClass = post.imageFit === 'contain' ? 'bcard__img--contain' : 'bcard__img--cover'

  return (
    <section className="bhero">
      <div className="container">
        <div className="bhero__head">
          <div>
            <h1 className="bhero__title">From the Quidkey newsroom.</h1>
            <p className="bhero__lede">
              Insights on pay by bank, clearing infrastructure, and programmable treasury.
            </p>
          </div>
        </div>
        <Link
          to="/blog/$slug"
          params={{ slug: post.slug }}
          className="bhero__card-link"
        >
          <article className="bhero__card">
            <div className="bhero__copy">
              <div className="bhero__meta">
                <span style={{ color: 'var(--ink)', fontWeight: 600 }}>Latest</span>
                <span className="bhero__meta-dot" />
                <span>{formatBlogDate(post.dateISO)}</span>
                <span className="bhero__meta-dot" />
                <span>{category}</span>
                <span className="bhero__meta-dot" />
                <span>{readMin} min read</span>
              </div>
              <h2 className="bhero__h">{post.title}</h2>
              {post.description && <p className="bhero__sub">{post.description}</p>}
              <span className="btn btn--ink btn--lg bhero__cta" aria-hidden="true">
                Read more
                <span className="btn__arrow">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    width="14"
                    height="14"
                  >
                    <path d="M5 12h14" />
                    <path d="M13 5l7 7-7 7" />
                  </svg>
                </span>
              </span>
            </div>
            <div className="bhero__media">
              <img
                src={post.image}
                alt={post.title}
                className={`bcard__img ${fitClass}`}
                loading="eager"
                width={post.imageWidth ?? 1600}
                height={post.imageHeight ?? 900}
              />
            </div>
          </article>
        </Link>
      </div>
    </section>
  )
}

function FilterPills({
  value,
  onChange,
  counts,
}: {
  value: ViewFilter
  onChange: (next: ViewFilter) => void
  counts: Record<ViewFilter, number>
}) {
  const options: ViewFilter[] = ['All', ...BLOG_CATEGORIES]
  return (
    <div className="bpills" role="tablist" aria-label="Filter articles by category">
      {options.map((c) => {
        const active = value === c
        return (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={active}
            className={`bpill ${active ? 'is-on' : ''}`}
            onClick={() => onChange(c)}
          >
            <span className="bpill__lbl">{c}</span>
            <span className="bpill__count">{counts[c] ?? 0}</span>
          </button>
        )
      })}
    </div>
  )
}

function BlogPage() {
  const [view, setView] = useState<ViewFilter>('All')

  const sorted = useMemo(
    () => [...blogPosts].sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1)),
    [],
  )
  const hero = sorted[0]
  const rest = sorted.slice(1)

  const filtered = view === 'All' ? rest : rest.filter((p) => getBlogCategory(p.slug) === view)

  const counts = useMemo<Record<ViewFilter, number>>(() => {
    const c: Record<ViewFilter, number> = { All: rest.length, Engineering: 0, Product: 0, Leadership: 0 }
    for (const p of rest) c[getBlogCategory(p.slug)] += 1
    return c
  }, [rest])

  return (
    <AudienceProvider>
      <div className="hp">
        <div className="blog-page">
          <HomepageNav />
          <main id="main">
            <BlogHero post={hero} />
            <section className="barticles">
              <div className="container">
                <div className="bfilter">
                  <FilterPills value={view} onChange={setView} counts={counts} />
                  <span className="bfilter__count">
                    {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
                  </span>
                </div>
                {filtered.length === 0 ? (
                  <div className="bempty">No articles in this category yet — check back soon.</div>
                ) : (
                  <div className="barticles__grid">
                    {filtered.map((post) => (
                      <PostCard key={post.slug} post={post} />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </main>
          <HomepageFooter />
        </div>
      </div>
    </AudienceProvider>
  )
}
