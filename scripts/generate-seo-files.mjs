import { promises as fs } from 'node:fs'
import path from 'node:path'

import { parseBlogPosts } from './lib/blog-post-index.mjs'
import { parseContactTopics } from './lib/contact-topics-index.mjs'
import { renderSiteIndex } from './lib/site-index.mjs'

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..')
const ROUTES_DIR = path.join(ROOT, 'src', 'routes')
const PUBLIC_DIR = path.join(ROOT, 'public')
const BLOG_POSTS_FILE = path.join(ROOT, 'src', 'lib', 'blog-posts.ts')
const CONTACT_TOPICS_FILE = path.join(ROOT, 'src', 'lib', 'contact-topics.ts')

const SITE_SUMMARY =
  'Add Pay by Bank to your checkout and automate what happens after payment: tax, splits, and FX. Global coverage, one integration.'

// One line per static route for the site index (llms.txt and sitemap.md). A
// route without an entry fails the build so a new page cannot ship unlabelled.
const PAGE_LABELS = {
  '/': 'Homepage: Pay by Bank checkout for merchants, coverage, pricing and integrations',
  '/agents': 'For AI agents: a public handle, multi-currency accounts and payments under a policy the owner sets',
  '/blog': 'Blog: articles on pay by bank, open banking, card fees and payments infrastructure',
  '/calculator': 'Fee calculator: compare Shopify card fees with Quidkey Pay by Bank',
  '/contact': 'Contact: talk to the Quidkey team',
  '/fintechs': 'For PSPs and fintechs: white-labelled Pay by Bank rails and treasury',
  '/fx-check': 'FX check: what Stripe or Shopify FX costs on cross-border sales',
  '/marketplace': 'For B2B marketplaces: Protected Pay between buyers and sellers',
  '/surcharge-calculator': 'Surcharge calculator: what the Australian card surcharge ban costs a business',
}

function normalizeOrigin(input) {
  try {
    return new URL(input).origin
  } catch {
    try {
      return new URL(`https://${input}`).origin
    } catch {
      return 'https://quidkey.com'
    }
  }
}

function resolveSiteOrigin() {
  // Netlify provides `URL` (site) and `DEPLOY_PRIME_URL` (this deploy).
  const raw =
    process.env.URL ??
    process.env.DEPLOY_PRIME_URL ??
    process.env.SITE_URL ??
    process.env.VITE_SITE_URL ??
    'https://quidkey.com'
  return normalizeOrigin(raw)
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await walk(full)))
    } else {
      files.push(full)
    }
  }
  return files
}

function routePathFromFile(filePath) {
  const rel = path.relative(ROUTES_DIR, filePath).replaceAll(path.sep, '/')
  if (!rel.endsWith('.tsx')) return null

  const withoutExt = rel.slice(0, -'.tsx'.length)
  const fileName = path.posix.basename(withoutExt)

  // Skip internal/generated/dynamic routes
  if (fileName.startsWith('__')) return null
  if (withoutExt.includes('$')) return null
  if (withoutExt.split('/').some((seg) => seg.startsWith('_'))) return null

  if (fileName === 'index') {
    const dir = path.posix.dirname(withoutExt)
    return dir === '.' ? '/' : `/${dir}`
  }

  return `/${withoutExt}`
}

function formatDateISO(date = new Date()) {
  return date.toISOString().slice(0, 10)
}

function escapeXml(s) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

async function generate() {
  const siteOrigin = resolveSiteOrigin()
  const today = formatDateISO()

  const routeFiles = (await walk(ROUTES_DIR)).filter((f) => f.endsWith('.tsx'))
  const staticRoutes = routeFiles
    .map(routePathFromFile)
    .filter(Boolean)
    // don't include error pages etc (none today), but keep deterministic ordering
    .sort((a, b) => a.localeCompare(b))

  const blogPosts = parseBlogPosts(await fs.readFile(BLOG_POSTS_FILE, 'utf8'))
  const blogRoutes = blogPosts.map((p) => ({
    path: `/blog/${p.slug}`,
    lastmod: p.dateISO,
  }))

  const entries = new Map()

  for (const p of staticRoutes) entries.set(p, { path: p, lastmod: today })
  for (const r of blogRoutes) entries.set(r.path, r)
  // Each non-default contact topic is its own canonical page (see routes/contact.tsx).
  const { keys, defaultTopic } = parseContactTopics(await fs.readFile(CONTACT_TOPICS_FILE, 'utf8'))
  for (const topic of keys.filter((k) => k !== defaultTopic)) {
    const p = `/contact?topic=${topic}`
    entries.set(p, { path: p, lastmod: today })
  }

  // Ensure homepage is first
  const paths = [...entries.keys()].sort((a, b) => {
    if (a === '/') return -1
    if (b === '/') return 1
    return a.localeCompare(b)
  })

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...paths.map((p) => {
      const { lastmod } = entries.get(p)
      const loc = `${siteOrigin}${p === '/' ? '/' : p}`
      return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${escapeXml(lastmod)}</lastmod>\n  </url>`
    }),
    '</urlset>',
    '',
  ].join('\n')

  const pages = staticRoutes.map((p) => {
    const label = PAGE_LABELS[p]
    if (!label) throw new Error(`No site index label for route ${p}; add it to PAGE_LABELS`)
    return { path: p, label }
  })
  const siteIndex = renderSiteIndex({ siteOrigin, summary: SITE_SUMMARY, pages, posts: blogPosts })

  const robots = [
    '# https://www.robotstxt.org/robotstxt.html',
    'User-agent: *',
    'Disallow:',
    'Content-Signal: ai-train=no, search=yes, ai-input=yes',
    '',
    `Sitemap: ${siteOrigin}/sitemap.xml`,
    '',
  ].join('\n')

  await fs.mkdir(PUBLIC_DIR, { recursive: true })
  await fs.writeFile(path.join(PUBLIC_DIR, 'sitemap.xml'), xml, 'utf8')
  await fs.writeFile(path.join(PUBLIC_DIR, 'robots.txt'), robots, 'utf8')
  await fs.writeFile(path.join(PUBLIC_DIR, 'llms.txt'), siteIndex, 'utf8')
  await fs.writeFile(path.join(PUBLIC_DIR, 'sitemap.md'), siteIndex, 'utf8')

  // eslint-disable-next-line no-console
  console.log(`[generate-seo-files] Wrote sitemap.xml, robots.txt, llms.txt and sitemap.md for ${siteOrigin} (${paths.length} URLs)`)
}

await generate()
