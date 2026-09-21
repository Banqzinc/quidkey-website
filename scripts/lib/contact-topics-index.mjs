// Reads the contact topic allowlist from src/lib/contact-topics.ts as text, so
// the sitemap can list each /contact?topic= page without compiling TypeScript.
// Every non-comment line of the array must be one quoted key, so a stray token
// throws instead of silently adding or dropping a page.
export function parseContactTopics(source) {
  const keysMatch = /export const CONTACT_TOPIC_KEYS = \[([\s\S]*?)\] as const/.exec(source)
  if (!keysMatch) throw new Error('CONTACT_TOPIC_KEYS not found in contact-topics.ts')
  const body = keysMatch[1].replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')
  const keys = body
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const entry = /^'([^']+)',?$/.exec(line)
      if (!entry) throw new Error(`Unreadable CONTACT_TOPIC_KEYS entry: ${line}`)
      return entry[1]
    })
  if (keys.length === 0) throw new Error('CONTACT_TOPIC_KEYS is empty')
  const defaultMatch = /export const DEFAULT_TOPIC[^=]*= '([^']+)'/.exec(source)
  if (!defaultMatch) throw new Error('DEFAULT_TOPIC not found in contact-topics.ts')
  return { keys, defaultTopic: defaultMatch[1] }
}
