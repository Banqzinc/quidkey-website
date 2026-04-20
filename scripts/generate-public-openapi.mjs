import { promises as fs } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..')
const SOURCE = path.resolve(ROOT, '..', 'quidkey-monorepo', 'apps', 'core', 'openapi.json')
const OUTPUT = path.join(ROOT, 'public', 'openapi.json')

const NON_PUBLIC_PATH_SEGMENTS = new Set(['admin', 'seeds'])
const NON_PUBLIC_SERVER_HOSTS = ['localhost', '127.0.0.1']

const PUBLIC_INFO_DESCRIPTION =
  'Public API surface for Quidkey — merchant integration endpoints. Internal administrative routes are not documented here.'

function isPublicPath(pathKey) {
  const segments = pathKey.split('/').filter(Boolean)
  return !segments.some((segment) => NON_PUBLIC_PATH_SEGMENTS.has(segment))
}

function isPublicServer(server) {
  try {
    const host = new URL(server.url).hostname
    return !NON_PUBLIC_SERVER_HOSTS.includes(host)
  } catch {
    return true
  }
}

async function main() {
  const raw = await fs.readFile(SOURCE, 'utf8')
  const spec = JSON.parse(raw)

  const originalPathCount = Object.keys(spec.paths ?? {}).length
  const publicPaths = Object.fromEntries(
    Object.entries(spec.paths ?? {}).filter(([key]) => isPublicPath(key))
  )

  const publicServers = (spec.servers ?? []).filter(isPublicServer)

  const sanitized = {
    ...spec,
    info: {
      ...spec.info,
      description: PUBLIC_INFO_DESCRIPTION,
    },
    servers: publicServers,
    paths: publicPaths,
  }

  await fs.mkdir(path.dirname(OUTPUT), { recursive: true })
  await fs.writeFile(OUTPUT, JSON.stringify(sanitized, null, 2) + '\n')

  const strippedPathCount = originalPathCount - Object.keys(publicPaths).length
  const strippedServerCount = (spec.servers ?? []).length - publicServers.length
  console.log(
    `Wrote ${OUTPUT} — ${Object.keys(publicPaths).length} public paths (stripped ${strippedPathCount}), ${publicServers.length} servers (stripped ${strippedServerCount}).`
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
