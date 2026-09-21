// Indexes src/lib/blog-posts.ts as text so build scripts can list posts without
// compiling TypeScript. One chunk per post, anchored on the post-level `slug:`;
// every field is looked up inside its own chunk so a malformed post fails loudly
// instead of borrowing a neighbour's value.
const POST_START = /^ {4}slug: '([^']+)',$/gm

export function parseBlogPosts(source) {
  const starts = [...source.matchAll(POST_START)]
  return starts.map((match, i) => {
    const slug = match[1]
    const chunk = source.slice(match.index, starts[i + 1]?.index ?? source.length)
    const dateISO = /^ {4}dateISO: '(\d{4}-\d{2}-\d{2})',$/m.exec(chunk)?.[1]
    const title = /^ {4}title:\s*(['"])([\s\S]*?)\1,$/m.exec(chunk)?.[2]
    if (!dateISO) throw new Error(`Blog post "${slug}" has no dateISO`)
    if (!title) throw new Error(`Blog post "${slug}" has no title`)
    return { slug, dateISO, title }
  })
}
