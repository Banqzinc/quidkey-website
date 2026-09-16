// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { subscribeNewsletter } from '@/lib/subscribe-newsletter'
import { track } from '@/lib/track'

import { NewsletterForm } from './newsletter-form'

vi.mock('@/lib/subscribe-newsletter', () => ({ subscribeNewsletter: vi.fn() }))
vi.mock('@/lib/track', () => ({ track: vi.fn() }))

const subscribe = vi.mocked(subscribeNewsletter)
const trackMock = vi.mocked(track)

function typeAndSubmit(email: string) {
  fireEvent.change(screen.getByLabelText('Get product updates'), { target: { value: email } })
  fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }))
}

describe('NewsletterForm', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('sends the trimmed address to the server and confirms the sign-up', async () => {
    subscribe.mockResolvedValue({ ok: true })
    render(<NewsletterForm />)

    typeAndSubmit('  Rabea@quidkey.com ')

    await waitFor(() => expect(screen.getByText('Thanks, you’re on the list.')).toBeTruthy())
    expect(subscribe).toHaveBeenCalledWith({ data: { email: 'Rabea@quidkey.com', hp: '' } })
    expect(trackMock).toHaveBeenCalledWith({ name: 'homepage_newsletter_submit', outcome: 'success' })
  })

  it('does not call the server for an empty address', () => {
    render(<NewsletterForm />)

    fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }))

    expect(subscribe).not.toHaveBeenCalled()
    expect(screen.getByText('Enter your email address.')).toBeTruthy()
    expect(trackMock).toHaveBeenCalledWith({
      name: 'homepage_newsletter_submit',
      outcome: 'error',
      reason: 'empty',
    })
  })

  it('tells the visitor when the address is rejected and keeps what they typed', async () => {
    subscribe.mockResolvedValue({ ok: false, error: 'invalid_email' })
    render(<NewsletterForm />)

    typeAndSubmit('nobody@example')

    await waitFor(() =>
      expect(screen.getByText('That address doesn’t look right. Check it and try again.')).toBeTruthy(),
    )
    expect((screen.getByLabelText('Get product updates') as HTMLInputElement).value).toBe('nobody@example')
    expect(trackMock).toHaveBeenCalledWith({
      name: 'homepage_newsletter_submit',
      outcome: 'error',
      reason: 'invalid_email',
    })
  })

  it('asks the visitor to retry when the server fails', async () => {
    subscribe.mockResolvedValue({ ok: false, error: 'server' })
    render(<NewsletterForm />)

    typeAndSubmit('rabea@quidkey.com')

    await waitFor(() =>
      expect(screen.getByText('We couldn’t sign you up just now. Please try again in a minute.')).toBeTruthy(),
    )
    expect(trackMock).toHaveBeenCalledWith({
      name: 'homepage_newsletter_submit',
      outcome: 'error',
      reason: 'server',
    })
  })

  it('treats a thrown request as a server failure', async () => {
    subscribe.mockRejectedValue(new Error('network'))
    render(<NewsletterForm />)

    typeAndSubmit('rabea@quidkey.com')

    await waitFor(() =>
      expect(screen.getByText('We couldn’t sign you up just now. Please try again in a minute.')).toBeTruthy(),
    )
  })

  it('forwards the honeypot value so the server can drop bots', async () => {
    subscribe.mockResolvedValue({ ok: true })
    const { container } = render(<NewsletterForm />)

    const honeypot = container.querySelector('input[name="website"]') as HTMLInputElement
    fireEvent.change(honeypot, { target: { value: 'spam' } })
    typeAndSubmit('bot@example.com')

    await waitFor(() => expect(subscribe).toHaveBeenCalledTimes(1))
    expect(subscribe).toHaveBeenCalledWith({ data: { email: 'bot@example.com', hp: 'spam' } })
  })
})
