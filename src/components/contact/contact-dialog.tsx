import { useEffect, useRef, type MouseEvent } from 'react'

import { ContactForm } from '@/components/contact/contact-form'
import { CONTACT_TOPICS, type ContactSource, type ContactTopic } from '@/lib/contact-topics'
import { buildMailto, CONTACT_EMAIL } from '@/lib/urls'

import './contact.css'

export type ContactRequest = { topic: ContactTopic; source: ContactSource; id: number }

const TITLE_ID = 'contact-dialog-title'

// Native <dialog> in modal mode: the browser gives us the focus trap, Esc to
// close, the top layer, and inert content behind — nothing to reimplement.
export function ContactDialog({
  request,
  onClose,
}: {
  request: ContactRequest | null
  onClose: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const isOpen = request !== null

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (isOpen && !dialog.open) {
      dialog.showModal()
      // Land the cursor in the first field, but only where there's a real
      // pointer: on phones an autofocused input pops the keyboard over half
      // the sheet before the visitor has read the heading.
      if (window.matchMedia('(pointer: fine)').matches) {
        dialog.querySelector<HTMLElement>('[data-autofocus]')?.focus()
      }
    } else if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isOpen, request?.id])

  // A click on the backdrop lands on the <dialog> element itself; clicks
  // inside the panel have a descendant as their target.
  const onBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) onClose()
  }

  return (
    <dialog
      ref={ref}
      className="cdlg"
      aria-labelledby={TITLE_ID}
      onClose={onClose}
      onClick={onBackdropClick}
    >
      {request ? (
        <div className="cdlg__panel">
          <button type="button" className="cdlg__close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
              <path
                d="M3.5 3.5l9 9M12.5 3.5l-9 9"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <ContactForm
            key={request.id}
            topic={request.topic}
            source={request.source}
            headingId={TITLE_ID}
          />
          <p className="cdlg__foot">
            Prefer email?{' '}
            <a href={buildMailto(CONTACT_TOPICS[request.topic].label)}>{CONTACT_EMAIL}</a>
          </p>
        </div>
      ) : null}
    </dialog>
  )
}
