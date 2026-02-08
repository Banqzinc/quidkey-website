import { promises as fs } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..')
const ROUTES_DIR = path.join(ROOT, 'src', 'routes')
const PUBLIC_DIR = path.join(ROOT, 'public')

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

async function extractBlogPosts() {
  const file = path.join(ROOT, 'src', 'lib', 'blog-posts.ts')
  const text = await fs.readFile(file, 'utf8')

  const posts = []
  const re = /slug:\s*'([^']+)'[\s\S]*?dateISO:\s*'([^']+)'/g
  let match
  while ((match = re.exec(text))) {
    posts.push({ slug: match[1], dateISO: match[2] })
  }
  return posts
}

async function extractCareerRoleIds() {
  const file = path.join(ROOT, 'src', 'routes', 'careers', 'index.tsx')
  const text = await fs.readFile(file, 'utf8')

  const ids = []
  const re = /\bid:\s*'([^']+)'/g
  let match
  while ((match = re.exec(text))) {
    ids.push(match[1])
  }
  return [...new Set(ids)]
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

  const blogPosts = await extractBlogPosts()
  const blogRoutes = blogPosts.map((p) => ({
    path: `/blog/${p.slug}`,
    lastmod: p.dateISO,
  }))

  const roleIds = await extractCareerRoleIds()
  const careerRoutes = roleIds.map((id) => ({
    path: `/careers/${id}`,
    lastmod: today,
  }))

  const entries = new Map()

  for (const p of staticRoutes) entries.set(p, { path: p, lastmod: today })
  for (const r of blogRoutes) entries.set(r.path, r)
  for (const r of careerRoutes) entries.set(r.path, r)

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

  const robots = [
    '# https://www.robotstxt.org/robotstxt.html',
    'User-agent: *',
    'Disallow:',
    '',
    `Sitemap: ${siteOrigin}/sitemap.xml`,
    '',
  ].join('\n')

  await fs.mkdir(PUBLIC_DIR, { recursive: true })
  await fs.writeFile(path.join(PUBLIC_DIR, 'sitemap.xml'), xml, 'utf8')
  await fs.writeFile(path.join(PUBLIC_DIR, 'robots.txt'), robots, 'utf8')

  // eslint-disable-next-line no-console
  console.log(`[generate-seo-files] Wrote sitemap.xml + robots.txt for ${siteOrigin} (${paths.length} URLs)`)
}

await generate()
