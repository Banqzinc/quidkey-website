#!/usr/bin/env node
// One-shot script: scope every selector in the prototype's CSS files under `.hp`
// so that the new homepage's CSS cannot leak into other routes. The output goes
// into src/styles/homepage/ and is committed alongside the prefixed files.
//
// This is intentionally a one-time port. We do NOT run it as part of the build
// pipeline — the prefixed CSS is the source of truth in the repo. If the
// prototype updates, re-run this script and recommit the diff.
//
// Usage:
//   node scripts/prefix-homepage-css.mjs [<prototype-project-dir>]
//
// Defaults the prototype project dir to /tmp/quidkey-design/quidkey-new-homepage/project.

import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DEFAULT_SRC = '/tmp/quidkey-design/quidkey-new-homepage/project'
const SRC = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_SRC
const OUT_DIR = path.join(ROOT, 'src/styles/homepage')

const PREFIX = '.hp'

const FILES = [
  { in: 'styles-v4-draft.css', out: 'base.css' },
  { in: 'styles-v4-tm2.css', out: 'tm2.css' },
  { in: 'v-draft-7/headings-standard.css', out: 'headings.css' },
  { in: 'v-draft-7/integrations-redesign.css', out: 'integrations.css' },
  { in: 'v-draft-7/treasury-head.css', out: 'treasury-head.css' },
  { in: 'v-draft-7/mobile.css', out: 'mobile.css' },
  { in: 'v-draft-7/section-padding-fix.css', out: 'section-padding.css' },
  { in: 'blog.css', out: 'blog.css' },
  { in: 'article.css', out: 'article.css' },
]

/**
 * Convert one selector (no commas) into its prefixed form.
 *
 *   body                  -> .hp
 *   body.foo              -> .hp.foo
 *   html                  -> .hp
 *   *                     -> .hp *
 *   :root                 -> :root           (preserve so CSS variables stay global)
 *   .nav__brand           -> .hp .nav__brand
 *   .nav__brand:hover     -> .hp .nav__brand:hover
 *   .nav__brand::before   -> .hp .nav__brand::before
 *   .a > .b               -> .hp .a > .b
 *   :is(.a, .b)           -> .hp :is(.a, .b)
 */
function prefixSingleSelector(sel) {
  const trimmed = sel.trim()
  if (!trimmed) return trimmed

  // Preserve :root so CSS custom properties remain document-global.
  if (trimmed === ':root' || trimmed.startsWith(':root ') || trimmed.startsWith(':root.') || trimmed.startsWith(':root,')) {
    return trimmed
  }

  // Map body/html to the wrapper itself so any element-level styles apply to
  // the homepage container.
  if (trimmed === 'body' || trimmed === 'html') return PREFIX
  if (trimmed.startsWith('body.') || trimmed.startsWith('body#') || trimmed.startsWith('body[')) {
    return `${PREFIX}${trimmed.slice(4)}`
  }
  if (trimmed.startsWith('html.') || trimmed.startsWith('html#') || trimmed.startsWith('html[')) {
    return `${PREFIX}${trimmed.slice(4)}`
  }
  if (trimmed.startsWith('body ') || trimmed.startsWith('body>') || trimmed.startsWith('body~') || trimmed.startsWith('body+')) {
    return `${PREFIX}${trimmed.slice(4)}`
  }
  if (trimmed.startsWith('html ') || trimmed.startsWith('html>') || trimmed.startsWith('html~') || trimmed.startsWith('html+')) {
    return `${PREFIX}${trimmed.slice(4)}`
  }

  return `${PREFIX} ${trimmed}`
}

/**
 * Split a comma-separated selector list, respecting parentheses (so commas inside
 * :is(...), :where(...), :not(...), [attr="a,b"] don't cause a split).
 */
function splitSelectors(list) {
  const out = []
  let depth = 0
  let buf = ''
  for (let i = 0; i < list.length; i += 1) {
    const ch = list[i]
    if (ch === '(' || ch === '[') depth += 1
    else if (ch === ')' || ch === ']') depth -= 1
    if (ch === ',' && depth === 0) {
      out.push(buf)
      buf = ''
      continue
    }
    buf += ch
  }
  if (buf.length > 0) out.push(buf)
  return out
}

function prefixSelectorList(list) {
  return splitSelectors(list).map(prefixSingleSelector).join(', ')
}

/**
 * Walk the source character by character. Top-level state machine:
 *   - reading a "prelude" (selector list or @-rule head) until we hit `{`
 *   - on `{`:
 *       - if the prelude starts with @keyframes or @font-face, copy the entire
 *         block verbatim (do NOT prefix anything inside)
 *       - if the prelude starts with @media or @supports (or another nested
 *         at-rule), copy the prelude as-is and recurse into the block to prefix
 *         inner rules
 *       - otherwise it's a selector list; prefix each selector and copy the
 *         block content (declarations) verbatim
 *
 * Comments and string literals are preserved verbatim and don't disturb the
 * brace tracker.
 */
function transformCss(src) {
  let i = 0
  const n = src.length

  function readWhitespaceAndComments() {
    let buf = ''
    while (i < n) {
      const ch = src[i]
      if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
        buf += ch
        i += 1
        continue
      }
      if (ch === '/' && src[i + 1] === '*') {
        const end = src.indexOf('*/', i + 2)
        if (end === -1) {
          buf += src.slice(i)
          i = n
          return buf
        }
        buf += src.slice(i, end + 2)
        i = end + 2
        continue
      }
      break
    }
    return buf
  }

  // Skip over a string literal starting at i (delimiter is the char at i).
  function readStringInto(buffer) {
    const quote = src[i]
    let buf = quote
    i += 1
    while (i < n) {
      const ch = src[i]
      buf += ch
      i += 1
      if (ch === '\\' && i < n) {
        buf += src[i]
        i += 1
        continue
      }
      if (ch === quote) break
    }
    return buffer + buf
  }

  // Read until we find the matching `}` for the current `{`. Returns the
  // contents (excluding the outer braces). Tracks nested braces, comments, and
  // strings.
  function readBlockBody() {
    if (src[i] !== '{') throw new Error(`expected { at offset ${i}`)
    i += 1
    let buf = ''
    let depth = 1
    while (i < n) {
      const ch = src[i]
      if (ch === '/' && src[i + 1] === '*') {
        const end = src.indexOf('*/', i + 2)
        if (end === -1) {
          buf += src.slice(i)
          i = n
          break
        }
        buf += src.slice(i, end + 2)
        i = end + 2
        continue
      }
      if (ch === '"' || ch === "'") {
        buf = readStringInto(buf)
        continue
      }
      if (ch === '{') depth += 1
      else if (ch === '}') {
        depth -= 1
        if (depth === 0) {
          i += 1
          return buf
        }
      }
      buf += ch
      i += 1
    }
    return buf
  }

  // Read a prelude (selector list or @-rule head) until `{` or `;` (for at-rules
  // without a block, like `@import`).
  function readPrelude() {
    let buf = ''
    while (i < n) {
      const ch = src[i]
      if (ch === '/' && src[i + 1] === '*') {
        const end = src.indexOf('*/', i + 2)
        if (end === -1) {
          buf += src.slice(i)
          i = n
          break
        }
        buf += src.slice(i, end + 2)
        i = end + 2
        continue
      }
      if (ch === '"' || ch === "'") {
        buf = readStringInto(buf)
        continue
      }
      if (ch === '{' || ch === ';') break
      buf += ch
      i += 1
    }
    return buf
  }

  function transformBlockContents(body) {
    // Recursively prefix any nested rules inside this body.
    return transformCss(body)
  }

  let out = ''

  while (i < n) {
    out += readWhitespaceAndComments()
    if (i >= n) break

    const startCh = src[i]
    if (startCh === '}') {
      // Stray closing brace — shouldn't happen at top level. Bail safely.
      out += '}'
      i += 1
      continue
    }

    const prelude = readPrelude()
    if (i >= n) {
      out += prelude
      break
    }

    const terminator = src[i]
    if (terminator === ';') {
      // At-rule without a block, e.g. `@import url(...)` or `@charset "utf-8"`.
      out += prelude + ';'
      i += 1
      continue
    }

    // terminator === '{'
    const trimmed = prelude.trim()

    if (/^@(keyframes|-webkit-keyframes|font-face|page|counter-style|property)\b/.test(trimmed)) {
      // Copy verbatim — never prefix selectors inside @keyframes or @font-face.
      const body = readBlockBody()
      out += `${prelude}{${body}}`
      continue
    }

    if (/^@(media|supports|container|layer|scope)\b/.test(trimmed)) {
      // Recurse: prefix inner rules but keep the at-rule prelude as-is.
      const body = readBlockBody()
      out += `${prelude}{${transformBlockContents(body)}}`
      continue
    }

    if (trimmed.startsWith('@')) {
      // Unknown at-rule; copy block verbatim to be safe.
      const body = readBlockBody()
      out += `${prelude}{${body}}`
      continue
    }

    // Plain selector list.
    const body = readBlockBody()
    out += `${prefixSelectorList(prelude)}{${body}}`
  }

  return out
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true })

  const summary = []

  for (const file of FILES) {
    const inPath = path.join(SRC, file.in)
    const outPath = path.join(OUT_DIR, file.out)
    const src = await fs.readFile(inPath, 'utf8')

    const banner = `/* Auto-generated by scripts/prefix-homepage-css.mjs from ${file.in}.\n   DO NOT EDIT BY HAND — re-run the script if the prototype changes. */\n\n`
    const transformed = transformCss(src)

    await fs.writeFile(outPath, banner + transformed, 'utf8')
    summary.push({ in: file.in, out: file.out, bytes: transformed.length })
  }

  console.log('Wrote prefixed CSS to', path.relative(ROOT, OUT_DIR))
  for (const row of summary) {
    console.log(`  ${row.in.padEnd(45)} -> ${row.out.padEnd(22)} (${row.bytes} bytes)`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
