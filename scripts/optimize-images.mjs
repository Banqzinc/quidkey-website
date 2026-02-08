import { promises as fs } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..')
const PUBLIC_DIR = path.join(ROOT, 'public')

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

async function listFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  return entries.filter((e) => e.isFile()).map((e) => path.join(dir, e.name))
}

function toWebpPath(filePath) {
  const ext = path.extname(filePath)
  return filePath.slice(0, -ext.length) + '.webp'
}

async function convertToWebp({
  inputPath,
  outputPath,
  width,
  quality,
}) {
  await ensureDir(path.dirname(outputPath))

  const image = sharp(inputPath, { failOn: 'none' }).resize({
    width,
    withoutEnlargement: true,
  })

  await image.webp({ quality }).toFile(outputPath)
}

async function optimizeDirectory({ dir, width, quality, includeExts }) {
  const files = await listFiles(dir)
  const targets = files.filter((f) => includeExts.includes(path.extname(f).toLowerCase()))

  const results = []
  for (const inputPath of targets) {
    const outputPath = toWebpPath(inputPath)
    try {
      await convertToWebp({ inputPath, outputPath, width, quality })
      results.push({ inputPath, outputPath })
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(`[optimize-images] Failed: ${inputPath}`, e?.message ?? e)
    }
  }

  return results
}

async function optimize() {
  const blogDir = path.join(PUBLIC_DIR, 'images', 'blog')
  const teamDir = path.join(PUBLIC_DIR, 'images', 'team')

  const blog = await optimizeDirectory({
    dir: blogDir,
    width: 1600,
    quality: 75,
    includeExts: ['.jpg', '.jpeg', '.png'],
  })

  const team = await optimizeDirectory({
    dir: teamDir,
    width: 800,
    quality: 75,
    includeExts: ['.jpg', '.jpeg', '.png'],
  })

  // Convert large SVG map to a lightweight raster for better performance.
  const mapSvg = path.join(PUBLIC_DIR, 'global-map.svg')
  const mapWebp = path.join(PUBLIC_DIR, 'global-map.webp')
  try {
    await convertToWebp({
      inputPath: mapSvg,
      outputPath: mapWebp,
      width: 900,
      quality: 75,
    })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(`[optimize-images] Failed: ${mapSvg}`, e?.message ?? e)
  }

  // eslint-disable-next-line no-console
  console.log(
    `[optimize-images] Wrote ${blog.length} blog webp, ${team.length} team webp, plus global-map.webp`
  )
}

await optimize()
