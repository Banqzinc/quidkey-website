import { type FormEvent, useState } from 'react'

import { type NewsletterError, subscribeNewsletter } from '@/lib/subscribe-newsletter'
import { track } from '@/lib/track'

// The footer's "Get product updates" form. Posts to Mailchimp through our
// Worker (see lib/subscribe-newsletter.ts) and tells the visitor what
// happened; the copy below is the whole set of outcomes.

type Status = 'idle' | 'sending' | 'sent' | 'error'
type Problem = NewsletterError | 'empty'

const PROBLEM_COPY: Record<Problem, string> = {
  empty: 'Enter your email address.',
  invalid_email: 'That address doesn’t look right. Check it and try again.',
  server: 'We couldn’t sign you up just now. Please try again in a minute.',
}

const PROBLEM_ID = 'ft-news-problem'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [hp, setHp] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [problem, setProblem] = useState<Problem | null>(null)

  const fail = (reason: Problem) => {
    setStatus('error')
    setProblem(reason)
    track({ name: 'homepage_newsletter_submit', outcome: 'error', reason })
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'sending') return

    const value = email.trim()
    if (!value) {
      fail('empty')
      return
    }

    setStatus('sending')
    setProblem(null)
    try {
      const result = await subscribeNewsletter({ data: { email: value, hp } })
      if (result.ok) {
        setStatus('sent')
        setEmail('')
        track({ name: 'homepage_newsletter_submit', outcome: 'success' })
        return
      }
      fail(result.error)
    } catch {
      fail('server')
    }
  }

  const modifier = status === 'sent' ? ' is-sent' : status === 'error' ? ' is-error' : ''

  return (
    <form className={`ft__news${modifier}`} onSubmit={submit} noValidate>
      <label className="ft__news-lbl" htmlFor="ft-news-email">
        Get product updates
      </label>
      <div className="ft__news-row">
        <input
          id="ft-news-email"
          className="ft__news-input"
          type="email"
          required
          placeholder="you@company.com"
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            if (status === 'error') {
              setStatus('idle')
              setProblem(null)
            }
          }}
          disabled={status === 'sending' || status === 'sent'}
          aria-invalid={status === 'error' || undefined}
          aria-describedby={status === 'error' ? PROBLEM_ID : undefined}
        />
        <button
          type="submit"
          className="ft__news-btn"
          aria-label="Subscribe"
          disabled={status === 'sending'}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="M13 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Honeypot: bots fill hidden inputs, humans never see this. */}
      <input
        className="ft__news-hp"
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={hp}
        onChange={(event) => setHp(event.target.value)}
      />

      {status === 'sent' ? (
        <span className="ft__news-ok" role="status">
          Thanks, you’re on the list.
        </span>
      ) : status === 'error' && problem ? (
        <span className="ft__news-err" id={PROBLEM_ID} role="alert">
          {PROBLEM_COPY[problem]}
        </span>
      ) : (
        <span className="ft__news-hint">Only product updates. No spam.</span>
      )}
    </form>
  )
}
