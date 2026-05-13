import { createFileRoute, Link } from '@tanstack/react-router'

import { HomepageNav } from '@/components/layout/homepage-nav'
import { HomepageFooter } from '@/components/layout/homepage-footer'
import { AudienceProvider } from '@/context/audience'
import {
  getBlogPost,
  getYouTubeEmbedUrl,
} from '@/lib/blog-posts'
import { getBlogCategory } from '@/lib/blog-meta'
import { buildSeo, buildArticleSchema, buildVideoSchema, getSiteUrl } from '@/lib/seo'

import { ArticleProgressBar } from '@/components/blog/article-progress-bar'
import { ArticleBreadcrumb } from '@/components/blog/article-breadcrumb'
import { ArticleHero } from '@/components/blog/article-hero'
import { ArticleHeroFigure } from '@/components/blog/article-hero-figure'
import { ArticleTOC } from '@/components/blog/article-toc'
import { ArticleShareRail } from '@/components/blog/article-share-rail'
import { ArticleBody } from '@/components/blog/article-body'
import { ArticleFooter } from '@/components/blog/article-footer'
import { ArticleRelated } from '@/components/blog/article-related'
import { deriveSections } from '@/lib/blog-meta'

// Pull in the prefixed homepage CSS so the article body, nav, and footer all
// share the same .hp-scoped tokens. blog.css ships .bcard styles for the
// related-articles grid; article.css holds every editorial style for the
// article page itself.
import '@/styles/homepage/base.css'
import '@/styles/homepage/tm2.css'
import '@/styles/homepage/headings.css'
import '@/styles/homepage/integrations.css'
import '@/styles/homepage/treasury-head.css'
import '@/styles/homepage/mobile.css'
import '@/styles/homepage/section-padding.css'
import '@/styles/homepage/blog.css'
import '@/styles/homepage/article.css'
import '@/styles/homepage/overrides.css'

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Caveat:wght@500;600;700&family=Inter+Tight:ital,wght@0,100..900;1,100..900&display=swap'

function withHomepageFonts(seo: ReturnType<typeof buildSeo>) {
  return {
    ...seo,
    links: [
      ...(seo.links ?? []),
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'stylesheet', href: FONT_HREF },
    ],
  }
}

export const Route = createFileRoute('/blog/$slug')({
  head: ({ params }) => {
    const post = getBlogPost(params.slug)

    if (!post) {
      return withHomepageFonts(
        buildSeo({
          title: 'Blog | Quidkey',
          description:
            'Insights on pay by bank, clearing infrastructure, and programmable treasury.',
          path: '/blog',
        }),
      )
    }

    const siteUrl = getSiteUrl()
    // Use absolute URL for OG image
    const imageUrl = `${siteUrl}${post.image}`
    const articleSchema = buildArticleSchema({
      title: post.title,
      description: post.description,
      datePublished: post.dateISO,
      author: post.author,
      url: `${siteUrl}/blog/${post.slug}`,
      imageUrl,
      keywords: post.keyword,
    })
    const videoSchemas = post.blocks
      .filter((block): block is Extract<typeof block, { type: 'youtube' }> => block.type === 'youtube')
      .map((block) =>
        buildVideoSchema({
          name: block.title,
          description: `${block.title} — ${post.description}`,
          thumbnailUrl: `https://img.youtube.com/vi/${block.videoId}/maxresdefault.jpg`,
          uploadDate: post.dateISO,
          contentUrl: `https://www.youtube.com/watch?v=${block.videoId}`,
          embedUrl: getYouTubeEmbedUrl(block.videoId),
        }),
      )

    return withHomepageFonts(
      buildSeo({
        title: post.seoTitle,
        ogTitle: post.title,
        description: post.description,
        keywords: post.keyword,
        path: `/blog/${post.slug}` as `/${string}`,
        ogType: 'article',
        imageUrl,
        imageWidth: post.imageWidth,
        imageHeight: post.imageHeight,
        article: {
          datePublished: post.dateISO,
          author: post.author,
          headline: post.title,
        },
        structuredData: [articleSchema, ...videoSchemas],
      }),
    )
  },
  component: BlogPostPage,
})

function NotFound() {
  return (
    <div className="min-h-screen">
      <div className="hp">
        <HomepageNav />
      </div>
      <main className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border bg-secondary/20 p-8">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3">
              Post not found
            </h1>
            <p className="text-muted-foreground mb-6">
              This article doesn't exist yet. Head back to the blog index to browse
              available posts.
            </p>
            <Link to="/blog" className="text-primary hover:underline">
              Back to Blog
            </Link>
          </div>
        </div>
      </main>
      <div className="hp">
        <HomepageFooter />
      </div>
    </div>
  )
}

function BlogPostPage() {
  const { slug } = Route.useParams()
  const post = getBlogPost(slug)

  if (!post) {
    return (
      <AudienceProvider>
        <NotFound />
      </AudienceProvider>
    )
  }

  const category = getBlogCategory(post.slug)
  const sections = deriveSections(post.blocks)
  const canonical = `${getSiteUrl()}/blog/${post.slug}`

  return (
    <AudienceProvider>
      <div className="hp">
        <ArticleProgressBar />
        <HomepageNav />
        <div className="article-page">
          <ArticleBreadcrumb category={category} />
          <ArticleHero post={post} />
          <ArticleHeroFigure post={post} />
          <section className="abody">
            <div className="container">
              <div className="abody__grid">
                <ArticleTOC slug={post.slug} sections={sections} />
                <main id="main">
                  <ArticleBody post={post} />
                  <ArticleFooter post={post} />
                </main>
              </div>
            </div>
            <ArticleShareRail slug={post.slug} title={post.title} url={canonical} />
          </section>
          <ArticleRelated fromSlug={post.slug} relatedSlugs={post.relatedSlugs} />
        </div>
        <HomepageFooter />
      </div>
    </AudienceProvider>
  )
}
