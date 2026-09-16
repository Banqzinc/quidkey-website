import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react'

import { CONTACT_TOPICS, type ContactSource, type ContactTopic } from '@/lib/contact-topics'
import {
  CONTACT_LIMITS,
  submitContact,
  validateContact,
  type ContactField,
} from '@/lib/submit-contact'
import { track } from '@/lib/track'
import { buildMailto, CONTACT_EMAIL, DEMO_BOOKING_URL } from '@/lib/urls'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const DEFAULT_INTRO = 'Tell us a bit about your business. We reply within one business day.'

const FIELD_MESSAGES: Record<ContactField, string> = {
  name: 'Please add your name.',
  email: 'That email address doesn’t look right. Please check it.',
  message: 'Tell us a little about what you need.',
}

type Props = {
  topic: ContactTopic
  source: ContactSource
  /** id for the heading, so a dialog can point aria-labelledby at it. */
  headingId?: string
  /** Overrides the topic heading (the /contact page uses this to avoid repeating its H1). */
  heading?: string
  /** Overrides the intro line; null removes it. */
  intro?: string | null
}

function Field({
  id,
  label,
  optional,
  full,
  error,
  children,
}: {
  id: string
  label: string
  optional?: boolean
  full?: boolean
  error?: string
  children: ReactNode
}) {
  return (
    <div className={`cform__field${full ? ' cform__field--full' : ''}`}>
      <label className="cform__label" htmlFor={id}>
        {label}
        {optional ? <span className="cform__opt"> (optional)</span> : null}
      </label>
      {children}
      {error ? (
        <p className="cform__err" id={`${id}-err`} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function ContactForm({ topic, source, headingId, heading, intro }: Props) {
  const copy = CONTACT_TOPICS[topic]
  const uid = useId()
  const ids = {
    name: `${uid}-name`,
    email: `${uid}-email`,
    company: `${uid}-company`,
    message: `${uid}-message`,
  }

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [message, setMessage] = useState('')
  const [hp, setHp] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [fieldError, setFieldError] = useState<ContactField | null>(null)

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const refs = { name: nameRef, email: emailRef, message: messageRef }

  const fail = (field: ContactField) => {
    setStatus('idle')
    setFieldError(field)
    refs[field].current?.focus()
  }

  // Typing into a field clears its error, and clears a previous server error
  // so the retry doesn't sit under a stale alert.
  const edited = (field: ContactField | 'company') => {
    if (field !== 'company' && fieldError === field) setFieldError(null)
    if (status === 'error') setStatus('idle')
  }

  const trackBook = () =>
    track({ name: 'homepage_cta_click', location: 'contact', label: 'demo', audience: 'merchants' })

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (status === 'sending') return

    // Same check as the server, run here so a typo costs no round trip.
    const input = { name, email, company, message, topic, hp }
    const checked = validateContact(input)
    if (!checked.ok) {
      fail(checked.field)
      return
    }

    setStatus('sending')
    setFieldError(null)
    try {
      const result = await submitContact({
        data: { ...input, page: window.location.pathname },
      })
      if (result.ok) {
        setStatus('sent')
        track({ name: 'contact_submit', topic, outcome: 'success' })
        return
      }
      if (result.error === 'invalid') {
        fail(result.field)
        return
      }
      setStatus('error')
      track({ name: 'contact_submit', topic, outcome: 'error' })
    } catch {
      setStatus('error')
      track({ name: 'contact_submit', topic, outcome: 'error' })
    }
  }

  if (status === 'sent') {
    const firstName = name.trim().split(/\s+/)[0]
    return (
      <div className="cform cform--sent" data-source={source}>
        <h2 className="cform__h" id={headingId}>
          Message sent.
        </h2>
        <p className="cform__sub">
          Thanks, {firstName}. We’ll reply to {email.trim()} within one business day.
        </p>
        <p className="cform__alt">
          Want to talk sooner?{' '}
          <a href={DEMO_BOOKING_URL} target="_blank" rel="noopener noreferrer" onClick={trackBook}>
            Book a 30-minute call
          </a>
          .
        </p>
      </div>
    )
  }

  const describedBy = (field: ContactField) => (fieldError === field ? `${ids[field]}-err` : undefined)

  return (
    <form className="cform" onSubmit={submit} noValidate data-source={source}>
      <h2 className="cform__h" id={headingId}>
        {heading ?? copy.heading}
      </h2>
      {intro === null ? null : <p className="cform__sub">{intro ?? DEFAULT_INTRO}</p>}

      <div className="cform__grid">
        <Field id={ids.name} label="Name" error={fieldError === 'name' ? FIELD_MESSAGES.name : undefined}>
          <input
            ref={nameRef}
            id={ids.name}
            className="cform__input"
            type="text"
            name="name"
            autoComplete="name"
            maxLength={CONTACT_LIMITS.name}
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              edited('name')
            }}
            aria-invalid={fieldError === 'name' || undefined}
            aria-describedby={describedBy('name')}
            data-autofocus
          />
        </Field>

        <Field
          id={ids.email}
          label="Work email"
          error={fieldError === 'email' ? FIELD_MESSAGES.email : undefined}
        >
          <input
            ref={emailRef}
            id={ids.email}
            className="cform__input"
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              edited('email')
            }}
            aria-invalid={fieldError === 'email' || undefined}
            aria-describedby={describedBy('email')}
          />
        </Field>

        <Field id={ids.company} label="Company" optional full>
          <input
            id={ids.company}
            className="cform__input"
            type="text"
            name="company"
            autoComplete="organization"
            maxLength={CONTACT_LIMITS.company}
            value={company}
            onChange={(e) => {
              setCompany(e.target.value)
              edited('company')
            }}
          />
        </Field>

        <Field
          id={ids.message}
          label="Message"
          full
          error={fieldError === 'message' ? FIELD_MESSAGES.message : undefined}
        >
          <textarea
            ref={messageRef}
            id={ids.message}
            className="cform__textarea"
            name="message"
            rows={4}
            maxLength={CONTACT_LIMITS.message}
            required
            placeholder={copy.prompt}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
              edited('message')
            }}
            aria-invalid={fieldError === 'message' || undefined}
            aria-describedby={describedBy('message')}
          />
        </Field>
      </div>

      {/* Honeypot: bots fill hidden inputs, humans never see this. */}
      <input
        className="cform__hp"
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
      />

      {status === 'error' ? (
        <p className="cform__alert" role="alert">
          We couldn’t send your message. Email us at{' '}
          <a href={buildMailto(copy.label)}>{CONTACT_EMAIL}</a> instead and we’ll pick it up.
        </p>
      ) : null}

      <div className="cform__actions">
        <button className="cform__btn" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        <p className="cform__alt">
          or{' '}
          <a href={DEMO_BOOKING_URL} target="_blank" rel="noopener noreferrer" onClick={trackBook}>
            book a 30-minute call
          </a>
        </p>
      </div>
    </form>
  )
}
