// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { HoneypotField } from './honeypot-field'

describe('HoneypotField', () => {
  afterEach(cleanup)

  it('is a labelled text input, out of the tab order, not hidden from assistive tech', () => {
    render(<HoneypotField value="" onChange={() => {}} />)

    const input = screen.getByLabelText('Leave this field empty')
    expect(input.getAttribute('name')).toBe('website')
    expect(input.getAttribute('tabindex')).toBe('-1')
    expect(input.getAttribute('autocomplete')).toBe('off')
    expect(input.hasAttribute('aria-hidden')).toBe(false)
    expect(input.closest('[aria-hidden="true"]')).toBeNull()
  })

  it('reports what was typed so the form can hand it to the server', () => {
    const onChange = vi.fn()
    render(<HoneypotField value="" onChange={onChange} />)

    fireEvent.change(screen.getByLabelText('Leave this field empty'), { target: { value: 'spam' } })

    expect(onChange).toHaveBeenCalledWith('spam')
  })

  it('gives each instance its own id so two forms on one page keep separate labels', () => {
    render(
      <>
        <HoneypotField value="" onChange={() => {}} />
        <HoneypotField value="" onChange={() => {}} />
      </>,
    )

    const inputs = screen.getAllByLabelText('Leave this field empty')
    expect(inputs).toHaveLength(2)
    expect(inputs[0].id).not.toBe(inputs[1].id)
  })
})
