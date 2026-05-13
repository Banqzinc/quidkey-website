// Hand-drawn "scribble" guide that overlays the hero viz with a Caveat-font
// label, a curved arrow pointing into the phone, and prev/next navigation.
//
// Simplified port of app.jsx:457-792 (ScribbleHint + DemoHint). The
// stage-management/auto-driving logic lives in MerchantHeroViz; this file
// is a pure presentation component that:
//   - Measures the active [data-hint-id] target's bounding rect
//   - Measures its own label height (so multi-line wrapped text doesn't
//     overlap the prev/next nav)
//   - Positions the label, nav, and a hand-drawn bezier arrow accordingly

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'

export type ScribbleStage = {
  /** Matches MerchantHeroViz.flowStep so we can hide the hint when the demo
   *  advances past the current stage's screen. */
  screen: string
  /** Matches the data-hint-id attribute on the target element inside the
   *  phone. */
  id: string
  label: ReactNode
}

type Rect = { x: number; y: number; w: number; h: number }
type Bounds = {
  phoneLeft: number
  containerW: number
  containerH: number
  /** Rightmost edge of any heading-column line-box that vertically overlaps
   *  the label band. -Infinity when no heading column is found. Used to push
   *  the label away from the headline so they never sit on the same line. */
  copyRight: number
}
type LabelBox = { w: number; h: number }

const LABEL_GAP_FROM_PHONE = 20
/** Gap between the LEFT edge of the label block and the right edge of the
 *  heading column. Keeps the hint from ever sitting on top of the headline. */
const COPY_GAP = 16
const LABEL_MAX_W = 220
const LABEL_MIN_W = 110
const NAV_GAP_TOP = 4
const NAV_HEIGHT = 30 // approx — actual height comes from measurement when available

export function ScribbleHint({
  stages,
  currentIdx,
  flowStep,
  suppressed,
  onPrev,
  onNext,
}: {
  stages: ScribbleStage[]
  currentIdx: number
  flowStep: string
  suppressed: boolean
  onPrev: () => void
  onNext: () => void
}) {
  const stage = stages[currentIdx]
  const matches = !!stage && stage.screen === flowStep

  const [rect, setRect] = useState<Rect | null>(null)
  const [bounds, setBounds] = useState<Bounds | null>(null)
  const [lblBox, setLblBox] = useState<LabelBox | null>(null)
  const [navBox, setNavBox] = useState<LabelBox | null>(null)

  const lblRef = useRef<HTMLSpanElement | null>(null)
  const navRef = useRef<HTMLDivElement | null>(null)

  // Measure target rect + container bounds whenever the active target
  // changes or the page reflows.
  useLayoutEffect(() => {
    if (!matches || suppressed) {
      setRect(null)
      setBounds(null)
      return
    }
    let cancelled = false

    const measure = () => {
      const target = document.querySelector(`[data-hint-id="${stage.id}"]`)
      const container = document.querySelector('.hero__viz--mobile')
      const phone = document.querySelector('.hero__viz--mobile .phone')
      if (!target || !container || !phone) return
      if (cancelled) return

      const er = (target as HTMLElement).getBoundingClientRect()
      const cr = container.getBoundingClientRect()
      const pr = phone.getBoundingClientRect()

      // Measure the headline column's rightmost line-box that vertically
      // overlaps the label band. Heading text scales with vw, so earlier
      // lines may extend further right than the corridor between heading
      // and phone — but those lines are usually ABOVE the label band and
      // don't actually compete for space. We only count lines/elements
      // whose vertical extent intersects the band.
      const tipYAbs = er.top + er.height / 2
      const bandTop = tipYAbs - 180
      const bandBot = tipYAbs + 20
      const copyEl =
        document.querySelector('.hero__split .hero__copy') ||
        document.querySelector('.hero__copy')
      let textRight = -Infinity
      if (copyEl) {
        const probe = copyEl.querySelectorAll<HTMLElement>(
          '.hero__title, .hero__sub, .hero__ctas, .hero__proof'
        )
        probe.forEach((node) => {
          const range = document.createRange()
          range.selectNodeContents(node)
          const rects = range.getClientRects()
          for (let i = 0; i < rects.length; i++) {
            const rr = rects[i]
            if (rr.bottom < bandTop || rr.top > bandBot) continue
            if (rr.right > textRight) textRight = rr.right
          }
          node.querySelectorAll<HTMLElement>('button, a, .btn').forEach((el) => {
            const eer = el.getBoundingClientRect()
            if (eer.bottom < bandTop || eer.top > bandBot) return
            if (eer.right > textRight) textRight = eer.right
          })
        })
      }

      setRect({
        x: Math.round(er.left - cr.left),
        y: Math.round(er.top - cr.top),
        w: Math.round(er.width),
        h: Math.round(er.height),
      })
      setBounds({
        phoneLeft: Math.round(pr.left - cr.left),
        containerW: Math.round(cr.width),
        containerH: Math.round(cr.height),
        copyRight: textRight === -Infinity ? -Infinity : Math.round(textRight - cr.left),
      })
    }

    measure()

    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, { passive: true })
    const t = setTimeout(measure, 100)

    return () => {
      cancelled = true
      ro.disconnect()
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure)
      clearTimeout(t)
    }
  }, [matches, stage?.id, suppressed])

  // Measure the actual rendered label box (height matters for multi-line
  // labels — without this the nav/arrow overlap the text).
  useLayoutEffect(() => {
    if (!matches || !lblRef.current) {
      setLblBox(null)
      return
    }
    const r = lblRef.current.getBoundingClientRect()
    setLblBox({ w: Math.round(r.width), h: Math.round(r.height) })
  }, [matches, stage?.id, stage?.label, bounds?.phoneLeft, rect?.y])

  // Measure the nav row too — it's tilted -4deg so its bounding rect can be
  // a bit taller than the visible row, and we need to know the height to
  // anchor the arrow start above it.
  useLayoutEffect(() => {
    if (!matches || !navRef.current) {
      setNavBox(null)
      return
    }
    const r = navRef.current.getBoundingClientRect()
    setNavBox({ w: Math.round(r.width), h: Math.round(r.height) })
  }, [matches, stage?.id, lblBox?.h])

  if (!matches || suppressed || !rect || !bounds) return null

  const tipX = bounds.phoneLeft - 14
  const tipY = rect.y + rect.h / 2

  // Corridor is the horizontal band between the heading column's right edge
  // (when it overlaps the label band) and the phone's left edge. -200 floor
  // keeps the arrow geometry sane when no heading column is detected.
  const corridorLeftRaw =
    bounds.copyRight === -Infinity ? -200 : bounds.copyRight + COPY_GAP
  const corridorRight = bounds.phoneLeft - LABEL_GAP_FROM_PHONE
  const corridorLeft = Math.max(corridorLeftRaw, -200)
  const corridorW = corridorRight - corridorLeft
  if (corridorW < LABEL_MIN_W) return null

  // Target a label width up to LABEL_MAX_W, but never wider than the
  // corridor, never narrower than LABEL_MIN_W.
  const labelMaxW = Math.max(LABEL_MIN_W, Math.min(LABEL_MAX_W, corridorW))
  // Right-anchor the label to the phone (then clamp left so it never crosses
  // the heading column). Mirrors app.jsx:497-499.
  const labelLeft = Math.max(corridorLeft, corridorRight - labelMaxW)

  // Use measured heights when we have them; fall back to conservative
  // estimates on the very first paint.
  const labelH = lblBox?.h ?? 64
  const labelW = lblBox?.w ?? Math.min(labelMaxW, 180)
  const navH = navBox?.h ?? NAV_HEIGHT
  const navW = navBox?.w ?? 80
  const blockH = labelH + NAV_GAP_TOP + navH

  // Position the label so its block (label + nav) sits ~28px above the
  // target's vertical center, clamped to viewport top.
  const labelTop = Math.max(tipY - 28 - blockH, 8)
  const navTop = labelTop + labelH + NAV_GAP_TOP

  // Arrow starts at the right edge of the nav row (8px gap), or — if nav
  // hasn't measured yet — from ~55% across the label so it doesn't start
  // dead-center. Same heuristic as app.jsx:531-532.
  const navRight = labelLeft + (navBox ? navW : labelW)
  const startX = navBox ? navRight + 8 : labelLeft + labelW * 0.55
  const startY = labelTop + blockH
  const dx = tipX - startX
  const dy = tipY - startY
  const ctrl1X = startX + Math.max(dx * 0.2, 8)
  const ctrl1Y = startY + Math.max(dy * 0.5, 18)
  const ctrl2X = tipX - Math.max(dx * 0.3, 30)
  const ctrl2Y = tipY - 12
  const path = `M ${startX} ${startY} C ${ctrl1X} ${ctrl1Y}, ${ctrl2X} ${ctrl2Y}, ${tipX} ${tipY}`

  return (
    <div className="demo-hint demo-hint--scribble">
      <span
        ref={lblRef}
        className="demo-hint__scribble-lbl"
        style={{ left: labelLeft, top: labelTop, maxWidth: labelMaxW }}
      >
        {stage.label}
      </span>
      <div
        ref={navRef}
        className="demo-hint__scribble-nav"
        style={{ left: labelLeft, top: navTop, maxWidth: labelMaxW }}
      >
        <button
          type="button"
          className="demo-hint__scribble-navbtn"
          onClick={onPrev}
          aria-label="Previous tip"
        >
          <svg
            viewBox="0 0 16 16"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M10 3 L5 8 L10 13" />
          </svg>
        </button>
        <span className="demo-hint__scribble-count">
          {currentIdx + 1}/{stages.length}
        </span>
        <button
          type="button"
          className="demo-hint__scribble-navbtn"
          onClick={onNext}
          aria-label="Next tip"
        >
          <svg
            viewBox="0 0 16 16"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 3 L11 8 L6 13" />
          </svg>
        </button>
      </div>
      <svg
        className="demo-hint__scribble-svg"
        width={bounds.containerW}
        height={bounds.containerH}
        viewBox={`0 0 ${bounds.containerW} ${bounds.containerH}`}
        style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}
        aria-hidden="true"
      >
        <defs>
          <marker
            id="qkScribbleArrow"
            viewBox="0 0 12 12"
            refX="6"
            refY="6"
            markerWidth="10"
            markerHeight="10"
            orient="auto"
          >
            <path d="M0 0 L12 6 L0 12 L4 6 z" fill="#9CA3AF" />
          </marker>
        </defs>
        <path
          className="demo-hint__scribble-path"
          d={path}
          fill="none"
          stroke="#9CA3AF"
          strokeWidth="1.6"
          strokeLinecap="round"
          markerEnd="url(#qkScribbleArrow)"
        />
      </svg>
    </div>
  )
}
