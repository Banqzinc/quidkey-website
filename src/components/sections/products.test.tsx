// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { Products } from './products'

describe('Products', () => {
  afterEach(cleanup)

  it('puts the treasury anchor on the section, not on the product card', () => {
    const { container } = render(<Products />)

    const targets = container.querySelectorAll('#treasury')
    expect(targets).toHaveLength(1)
    expect(targets[0].tagName).toBe('SECTION')
    expect(container.querySelector('.product')?.hasAttribute('id')).toBe(false)
  })
})
