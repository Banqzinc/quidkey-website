import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react'

import { ContactDialog, type ContactRequest } from '@/components/contact/contact-dialog'
import { contactPath, type ContactSource, type ContactTopic } from '@/lib/contact-topics'
import { track } from '@/lib/track'

// One "Talk to us" dialog for the whole site, mounted once at the root layout.
// Any CTA opens it through useContactLink(), which also gives the CTA a real
// /contact URL so it still works before hydration, in a new tab, and for
// crawlers.

type ContactContextValue = {
  open: (topic: ContactTopic, source: ContactSource) => void
}

const ContactContext = createContext<ContactContextValue | null>(null)

export function ContactProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<ContactRequest | null>(null)

  const open = useCallback((topic: ContactTopic, source: ContactSource) => {
    // A fresh id per open remounts the form, so a second open starts clean
    // instead of showing the previous "Message sent." state.
    setRequest((prev) => ({ topic, source, id: (prev?.id ?? 0) + 1 }))
    track({ name: 'contact_open', topic, source })
  }, [])

  const close = useCallback(() => setRequest(null), [])

  const value = useMemo(() => ({ open }), [open])

  return (
    <ContactContext.Provider value={value}>
      {children}
      <ContactDialog request={request} onClose={close} />
    </ContactContext.Provider>
  )
}

export function useContact(): ContactContextValue {
  const ctx = useContext(ContactContext)
  if (!ctx) throw new Error('useContact must be used inside <ContactProvider>')
  return ctx
}

/**
 * href + onClick for a link that opens the contact dialog. Modified clicks
 * (new tab, new window) and non-primary buttons fall through to the /contact
 * page like any other link.
 */
export function useContactLink(topic: ContactTopic, source: ContactSource) {
  const { open } = useContact()
  const href = contactPath(topic)
  const onClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }
      event.preventDefault()
      open(topic, source)
    },
    [open, topic, source],
  )
  return { href, onClick }
}
