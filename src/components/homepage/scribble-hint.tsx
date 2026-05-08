// Hand-drawn "scribble" guide that overlays the hero viz with a Caveat-font
// label, a curved arrow pointing into the phone, and prev/next navigation.
//
// Simplified port of app.jsx:457-792 (ScribbleHint + DemoHint). Differences
// from the prototype:
//   - The auto-driving stage system (which would auto-click through the
//     demo as you advance stages) is dropped. Users navigate the demo
//     themselves, and the hint shows the current stage's label.
//   - When the demo's flowStep doesn't match the current stage's screen
//     (because the user advanced the demo), the hint hides itself until
//     prev/next is pressed.
//   - Hint hides if the user has clicked anything inside the phone 3+
//     times — same engagement-based suppression as the prototype.
//
// The hint positions itself relative to .hero__viz--mobile, which is the
// container the prototype's CSS expects.

import { useEffect, useLayoutEffect, useState, type ReactNode } from 'react'

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
type Bounds = { phoneLeft: number; containerW: number; containerH: number }

const LABEL_GAP_FROM_PHONE = 20
const LABEL_MAX_W = 220
const LABEL_MIN_W = 110

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
      })
    }

    measure()

    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, { passive: true })

    // Re-measure once after layout settles (font load can shift things).
    const t = setTimeout(measure, 100)

    return () => {
      cancelled = true
      ro.disconnect()
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure)
      clearTimeout(t)
    }
  }, [matches, stage?.id, suppressed])

  if (!matches || suppressed || !rect || !bounds) return null

  const tipX = bounds.phoneLeft - 14
  const tipY = rect.y + rect.h / 2

  const corridorRight = bounds.phoneLeft - LABEL_GAP_FROM_PHONE
  const corridorLeft = Math.max(corridorRight - LABEL_MAX_W, 8)
  const corridorW = corridorRight - corridorLeft
  if (corridorW < LABEL_MIN_W) return null

  const labelMaxW = corridorW
  const labelLeft = corridorLeft
  // Generous estimate; CSS handles real layout. Used only for arrow geometry.
  const estimatedLabelH = 56
  const labelTop = Math.max(tipY - 28 - estimatedLabelH, 8)

  const startX = corridorRight
  const startY = labelTop + estimatedLabelH
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
        className="demo-hint__scribble-lbl"
        style={{ left: labelLeft, top: labelTop, maxWidth: labelMaxW }}
      >
        {stage.label}
      </span>
      <div
        className="demo-hint__scribble-nav"
        style={{ left: labelLeft, top: labelTop + estimatedLabelH + 4, maxWidth: labelMaxW }}
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

/** Hook the MerchantHeroViz uses to manage scribble stage navigation. */
export function useScribbleStages(stages: ScribbleStage[], flowStep: string) {
  const [currentIdx, setCurrentIdx] = useState(0)

  // Auto-sync currentIdx with flowStep when the demo advances past the
  // current scribble stage. Lets the hint follow the user as they tap
  // through.
  useEffect(() => {
    const nextStageOnScreen = stages.findIndex((s) => s.screen === flowStep)
    if (nextStageOnScreen >= 0 && nextStageOnScreen !== currentIdx) {
      setCurrentIdx(nextStageOnScreen)
    }
  }, [flowStep, stages, currentIdx])

  const next = () => setCurrentIdx((i) => (i + 1) % stages.length)
  const prev = () => setCurrentIdx((i) => (i - 1 + stages.length) % stages.length)

  return { currentIdx, next, prev }
}
