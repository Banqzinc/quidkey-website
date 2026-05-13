import { createHash } from 'node:crypto'
import { promises as fs } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..')
const SKILLS_DIR = path.join(ROOT, 'public', '.well-known', 'agent-skills')
const INDEX_FILE = path.join(SKILLS_DIR, 'index.json')

const SCHEMA_URL = 'https://schemas.agentskills.io/discovery/0.2.0/schema.json'
const SKILL_NAME_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
  if (!match) return null
  const block = match[1]
  const out = {}
  // Simple key: value lines; values may span lines if indented, but the spec
  // we care about only uses single-line name + description, so this is enough.
  for (const line of block.split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z][\w-]*)\s*:\s*(.*)$/)
    if (m) out[m[1]] = m[2].trim()
  }
  return out
}

async function listSkillDirs() {
  let entries
  try {
    entries = await fs.readdir(SKILLS_DIR, { withFileTypes: true })
  } catch (err) {
    if (err.code === 'ENOENT') return []
    throw err
  }
  return entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort()
}

async function buildSkillEntry(dirName) {
  if (!SKILL_NAME_RE.test(dirName) || dirName.length > 64) {
    throw new Error(
      `[generate-agent-skills-index] Skill directory "${dirName}" is not a valid skill name (lowercase, hyphens, 1-64 chars).`,
    )
  }

  const skillFile = path.join(SKILLS_DIR, dirName, 'SKILL.md')
  const buf = await fs.readFile(skillFile)
  const front = parseFrontmatter(buf.toString('utf8'))

  if (!front || !front.name || !front.description) {
    throw new Error(
      `[generate-agent-skills-index] ${skillFile} is missing required frontmatter (name, description).`,
    )
  }
  if (front.name !== dirName) {
    throw new Error(
      `[generate-agent-skills-index] Frontmatter name "${front.name}" does not match directory "${dirName}".`,
    )
  }

  const digest = createHash('sha256').update(buf).digest('hex')

  return {
    name: front.name,
    type: 'skill-md',
    description: front.description,
    url: `/.well-known/agent-skills/${dirName}/SKILL.md`,
    digest: `sha256:${digest}`,
  }
}

async function generate() {
  const dirs = await listSkillDirs()
  const skills = []
  for (const dir of dirs) {
    skills.push(await buildSkillEntry(dir))
  }

  const index = { $schema: SCHEMA_URL, skills }
  await fs.mkdir(SKILLS_DIR, { recursive: true })
  await fs.writeFile(INDEX_FILE, JSON.stringify(index, null, 2) + '\n', 'utf8')

  // eslint-disable-next-line no-console
  console.log(
    `[generate-agent-skills-index] Wrote ${path.relative(ROOT, INDEX_FILE)} (${skills.length} skill${skills.length === 1 ? '' : 's'})`,
  )
}

await generate()
