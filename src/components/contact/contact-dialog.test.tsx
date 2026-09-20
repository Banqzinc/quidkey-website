// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import { CONTACT_TOPICS } from '@/lib/contact-topics'

import { ContactDialog } from './contact-dialog'

vi.mock('@/lib/track', () => ({ track: vi.fn() }))

// jsdom implements neither <dialog>'s modal API nor matchMedia; mirror the one
// thing the component relies on, the `open` attribute.
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    this.removeAttribute('open')
  }
  window.matchMedia = () => ({ matches: false }) as MediaQueryList
})

function dialogIn(container: HTMLElement) {
  const dialog = container.querySelector('dialog')
  if (!dialog) throw new Error('no <dialog> rendered')
  return dialog
}

describe('ContactDialog', () => {
  afterEach(cleanup)

  it('has an accessible name while closed without pointing at a heading that is not rendered', () => {
    const { container } = render(<ContactDialog request={null} onClose={() => {}} />)

    const dialog = dialogIn(container)
    expect(dialog.getAttribute('aria-label')).toBeTruthy()
    expect(dialog.hasAttribute('aria-labelledby')).toBe(false)
  })

  it('is named by the topic heading once open', () => {
    const { container } = render(
      <ContactDialog request={{ topic: 'fx', source: 'page', id: 1 }} onClose={() => {}} />,
    )

    const dialog = dialogIn(container)
    const labelId = dialog.getAttribute('aria-labelledby')
    expect(labelId).toBeTruthy()
    expect(container.querySelector(`#${labelId}`)?.textContent).toBe(CONTACT_TOPICS.fx.heading)
  })
})
