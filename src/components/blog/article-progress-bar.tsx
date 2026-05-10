import { useEffect, useState } from 'react'

/**
 * Fixed-top reading-progress bar that fills as the user scrolls the article.
 * Visual only — `aria-hidden`. Style lives in `src/styles/homepage/article.css`
 * under `.aprog`.
 */
export function ArticleProgressBar() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      setPct(max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return <div className="aprog" style={{ width: `${pct}%` }} aria-hidden="true" />
}
