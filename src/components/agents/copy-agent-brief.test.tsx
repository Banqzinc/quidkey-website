// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import { track } from '@/lib/track'

import { agentBrief } from './agent-brief'
import { CopyAgentBrief } from './copy-agent-brief'

vi.mock('@/lib/track', () => ({ track: vi.fn() }))

const trackMock = vi.mocked(track)

// jsdom has no modal <dialog> API; mirror the one thing the component relies
// on, the `open` attribute, as the contact dialog's test does.
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    this.removeAttribute('open')
  }
})

function stubClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
}

function heroButton(name: string | RegExp = 'Copy instructions for your agent') {
  return screen.getByRole('button', { name })
}

function dialog() {
  const el = document.querySelector('dialog')
  if (!el) throw new Error('no <dialog> rendered')
  return el
}

describe('CopyAgentBrief', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  it('copies the brief, confirms in the button, then restores the label', async () => {
    vi.useFakeTimers()
    const writeText = vi.fn().mockResolvedValue(undefined)
    stubClipboard(writeText)
    render(<CopyAgentBrief />)
    const button = heroButton()

    await act(async () => {
      fireEvent.click(button)
    })

    expect(heroButton('Copied. Paste it to your agent.')).toBe(button)
    expect(button.getAttribute('aria-live')).toBe('polite')
    expect(writeText).toHaveBeenCalledWith(agentBrief())
    expect(dialog().open).toBe(false)
    expect(trackMock).toHaveBeenCalledWith({
      name: 'homepage_cta_click',
      location: 'hero',
      label: 'agent_brief',
      audience: 'agents',
    })

    act(() => {
      vi.advanceTimersByTime(2500)
    })
    expect(heroButton()).toBe(button)
  })

  it('opens the brief in a dialog from the read link, without expanding the hero', () => {
    render(<CopyAgentBrief />)
    expect(document.querySelector('details')).toBeNull()
    expect(dialog().open).toBe(false)

    fireEvent.click(screen.getByRole('button', { name: 'Read what your agent is told' }))

    expect(dialog().open).toBe(true)
    expect(dialog().getAttribute('aria-labelledby')).toBe(dialog().querySelector('h2')?.id)
    expect(dialog().querySelector('h2')?.textContent).toBe('What your agent is told')
    expect(dialog().querySelector('pre')?.textContent).toBe(agentBrief())
  })

  it('copies from inside the dialog and confirms on that button', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    stubClipboard(writeText)
    render(<CopyAgentBrief />)
    fireEvent.click(screen.getByRole('button', { name: 'Read what your agent is told' }))

    expect(dialog().textContent).not.toContain('or select the text')

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy instructions' }))
    })

    expect(writeText).toHaveBeenCalledWith(agentBrief())
    expect(screen.getByRole('button', { name: 'Copied to clipboard' })).toBeTruthy()
    expect(heroButton()).toBeTruthy()
    expect(trackMock).toHaveBeenCalledTimes(1)
  })

  it('falls back to the dialog with the text to select when the clipboard is blocked', async () => {
    stubClipboard(vi.fn().mockRejectedValue(new Error('denied')))
    render(<CopyAgentBrief />)

    await act(async () => {
      fireEvent.click(heroButton())
    })

    expect(dialog().open).toBe(true)
    expect(dialog().textContent).toContain('Copying is blocked in this browser. Select the text and copy it.')
    expect(heroButton()).toBeTruthy()
  })

  it('closes from its close button', () => {
    render(<CopyAgentBrief />)
    fireEvent.click(screen.getByRole('button', { name: 'Read what your agent is told' }))
    expect(dialog().open).toBe(true)

    fireEvent.click(screen.getByRole('button', { name: 'Close' }))

    expect(dialog().open).toBe(false)
  })
})
