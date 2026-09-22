import { useEffect, useRef, useState, type MouseEvent } from 'react'

import { track } from '@/lib/track'

import { agentBrief } from './agent-brief'

const LABEL = 'Copy instructions for your agent'
const COPIED = 'Copied. Paste it to your agent.'
const DIALOG_COPY = 'Copy instructions'
const DIALOG_COPIED = 'Copied to clipboard'
const REVERT_AFTER_MS = 2500
const TITLE_ID = 'agent-brief-title'
const INTRO = 'Paste this into whatever agent you run. It reads the page and the registration file itself.'
const BLOCKED = 'Copying is blocked in this browser. Select the text and copy it.'

// A human's way to bring their own agent here: copy a plain-text brief and
// paste it into whatever agent they run. It sits in the hero's CTA row, so it
// returns siblings rather than a wrapper: the copy button beside the owner CTA,
// then a text link that opens the brief in a dialog. A dialog rather than an
// inline toggle because the hero is centred in the viewport, so anything that
// grows inside it shifts everything above it. The dialog is also the fallback
// when the browser will not let the page write to the clipboard: it opens with
// the text selected. Both copy buttons carry their own confirmation for a
// moment, then read as before.
export function CopyAgentBrief() {
  const [heroLabel, setHeroLabel] = useState(LABEL)
  const [dialogLabel, setDialogLabel] = useState(DIALOG_COPY)
  const [open, setOpen] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const textRef = useRef<HTMLPreElement>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  // Native <dialog> in modal mode, as the contact dialog does: the browser
  // gives us the focus trap, Esc to close, the top layer and an inert page.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    else if (!open && dialog.open) dialog.close()
  }, [open])

  useEffect(() => {
    if (!open || !blocked || !textRef.current) return
    try {
      window.getSelection()?.selectAllChildren(textRef.current)
    } catch {
      // Selection is a convenience; the text is still there to select by hand.
    }
  }, [open, blocked])

  const flash = (set: (label: string) => void, text: string, resting: string) => {
    set(text)
    timers.current.push(setTimeout(() => set(resting), REVERT_AFTER_MS))
  }

  const copy = async (from: 'hero' | 'dialog') => {
    try {
      await navigator.clipboard.writeText(agentBrief())
      if (from === 'hero') flash(setHeroLabel, COPIED, LABEL)
      else flash(setDialogLabel, DIALOG_COPIED, DIALOG_COPY)
    } catch {
      setBlocked(true)
      setOpen(true)
    }
    track({ name: 'homepage_cta_click', location: 'hero', label: 'agent_brief', audience: 'agents' })
  }

  // A click on the backdrop lands on the <dialog> element itself; clicks
  // inside the panel have a descendant as their target.
  const onBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) setOpen(false)
  }

  return (
    <>
      <button
        type="button"
        className="btn btn--ghost btn--xl ag-brief__btn"
        aria-live="polite"
        onClick={() => copy('hero')}
      >
        <span className="ag-brief__label">{heroLabel}</span>
        {/* Holds the button at the width of its resting label while the visible
            label swaps, so the CTA row never reflows on a click. */}
        <span className="ag-brief__sizer" aria-hidden="true">
          {LABEL}
        </span>
      </button>
      <div className="ag-brief__more">
        <button type="button" className="ag-brief__link" onClick={() => setOpen(true)}>
          Read what your agent is told
        </button>
      </div>

      <dialog
        ref={dialogRef}
        className="cdlg ag-dlg"
        aria-labelledby={TITLE_ID}
        onClose={() => setOpen(false)}
        onClick={onBackdropClick}
      >
        <div className="cdlg__panel ag-dlg__panel">
          <button type="button" className="cdlg__close" onClick={() => setOpen(false)} aria-label="Close">
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
              <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
          <h2 id={TITLE_ID} className="ag-dlg__h">
            What your agent is told
          </h2>
          <p className="ag-dlg__sub">{blocked ? BLOCKED : INTRO}</p>
          <pre ref={textRef} className="ag-brief__text">
            {agentBrief()}
          </pre>
          <div className="ag-dlg__actions">
            <button type="button" className="ag-dlg__copy" aria-live="polite" onClick={() => copy('dialog')}>
              <span className="ag-dlg__copy-label">{dialogLabel}</span>
              <span className="ag-dlg__copy-sizer" aria-hidden="true">
                {DIALOG_COPIED}
              </span>
            </button>
          </div>
        </div>
      </dialog>
    </>
  )
}
