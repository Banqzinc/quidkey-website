import { useState } from 'react'

import { track, type ShareChannel } from '@/lib/track'

type Props = {
  slug: string
  title: string
  /** Absolute URL to the article — used as the canonical share target. */
  url: string
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2H21l-6.52 7.45L22 22h-6.78l-4.74-6.21L4.95 22H2.19l6.97-7.96L2 2h6.91l4.28 5.66L18.24 2zm-1.19 18h1.86L7.04 4H5.07l11.99 16z" />
    </svg>
  )
}
function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14zM8.34 17.34V10.5H6.06v6.84h2.28zM7.2 9.5a1.32 1.32 0 100-2.64 1.32 1.32 0 000 2.64zm10.14 7.84v-3.74c0-2-1.07-2.93-2.5-2.93-1.16 0-1.68.64-1.97 1.08V10.5h-2.28c.03.64 0 6.84 0 6.84h2.28v-3.82c0-.2.01-.41.07-.55.17-.41.54-.83 1.18-.83.83 0 1.16.63 1.16 1.55v3.65h2.06z" />
    </svg>
  )
}
function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  )
}
function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 007.07 0l3-3a5 5 0 00-7.07-7.07l-1.5 1.5" />
      <path d="M14 11a5 5 0 00-7.07 0l-3 3a5 5 0 007.07 7.07l1.5-1.5" />
    </svg>
  )
}
function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

/**
 * Floating fixed share rail anchored to the right edge of the viewport.
 * Visible at every breakpoint per the design's chat52 finalization.
 */
export function ArticleShareRail({ slug, title, url }: Props) {
  const [copied, setCopied] = useState(false)

  const fire = (channel: ShareChannel) => {
    track({ name: 'article_share_click', slug, channel })
  }

  const onCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {
        // best-effort
      })
    }
    setCopied(true)
    fire('copy_link')
    window.setTimeout(() => setCopied(false), 1400)
  }

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
  const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  const mailUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`

  return (
    <aside className="ashare ashare--rail" aria-label="Share article">
      <span className="ashare__lbl">Share</span>
      <a
        className="ashare__btn"
        href={xUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        onClick={() => fire('x')}
      >
        <XIcon />
      </a>
      <a
        className="ashare__btn"
        href={liUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        onClick={() => fire('linkedin')}
      >
        <LinkedInIcon />
      </a>
      <a className="ashare__btn" href={mailUrl} aria-label="Email link" onClick={() => fire('email')}>
        <MailIcon />
      </a>
      <button
        type="button"
        className="ashare__btn"
        aria-label={copied ? 'Link copied' : 'Copy link'}
        title={copied ? 'Link copied' : 'Copy link'}
        onClick={onCopy}
      >
        {copied ? <CheckIcon /> : <LinkIcon />}
      </button>
    </aside>
  )
}
