// The market switcher above the phone demo. Same typographic language as the
// hero's "I'm a Merchant / Fintech" control (.hero__aud) rather than a pill, so
// it reads as part of the page rather than a widget floating over the device.
//
// Unlike the audience toggle this is a genuine radio group: role="radiogroup"
// with roving tabIndex and arrow-key navigation, so what a screen reader
// announces matches how the control actually behaves.

import { useRef } from 'react'

import { useDemoRegion } from '@/context/demo-region'
import { KNOWN_REGIONS, type DemoRegion } from '@/lib/demo-region'
import { track } from '@/lib/track'

const REGION_LABELS: Record<DemoRegion, string> = {
  AU: 'Australia',
  UK: 'United Kingdom',
  EU: 'Europe',
  US: 'United States',
}

export function DemoRegionSwitcher() {
  const { region, setRegion } = useDemoRegion()
  const btns = useRef<Array<HTMLButtonElement | null>>([])

  const pick = (next: DemoRegion) => {
    if (next === region) return
    track({ name: 'homepage_demo_region_switch', from: region, to: next })
    setRegion(next)
  }

  // Arrow keys move the selection and focus together, which is the expected
  // behaviour for a radio group.
  const onKeyDown = (e: React.KeyboardEvent, idx: number) => {
    const delta = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (delta === 0) return
    e.preventDefault()
    const nextIdx = (idx + delta + KNOWN_REGIONS.length) % KNOWN_REGIONS.length
    pick(KNOWN_REGIONS[nextIdx])
    btns.current[nextIdx]?.focus()
  }

  return (
    <div className="demo-region" role="radiogroup" aria-label="Demo market">
      <span className="demo-region__lbl">Showing</span>
      {KNOWN_REGIONS.map((r, i) => (
        <span className="demo-region__item" key={r}>
          {i > 0 && (
            <span className="demo-region__sep" aria-hidden="true">
              /
            </span>
          )}
          <button
            type="button"
            role="radio"
            ref={(el) => {
              btns.current[i] = el
            }}
            aria-checked={region === r}
            aria-label={REGION_LABELS[r]}
            tabIndex={region === r ? 0 : -1}
            className={`demo-region__opt ${region === r ? 'is-on' : ''}`}
            onClick={() => pick(r)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {r}
          </button>
        </span>
      ))}
    </div>
  )
}
