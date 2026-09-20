import { describe, expect, it } from 'vitest'

import { bareHandle, handlePrefillMessage } from './handle'

describe('bareHandle', () => {
  it('drops a leading @ and surrounding space', () => {
    expect(bareHandle('@quid-pro-quo')).toBe('quid-pro-quo')
    expect(bareHandle('  @quid-pro-quo ')).toBe('quid-pro-quo')
    expect(bareHandle('quid-pro-quo')).toBe('quid-pro-quo')
  })
})

describe('handlePrefillMessage', () => {
  it('names the handle with exactly one @, whether or not the query had one', () => {
    expect(handlePrefillMessage('quid-pro-quo')).toBe('My agent reserved @quid-pro-quo.')
    expect(handlePrefillMessage('@quid-pro-quo')).toBe('My agent reserved @quid-pro-quo.')
  })

  it('leaves the form untouched when there is no handle', () => {
    expect(handlePrefillMessage(null)).toBeUndefined()
    expect(handlePrefillMessage('')).toBeUndefined()
    expect(handlePrefillMessage('   ')).toBeUndefined()
    expect(handlePrefillMessage('@')).toBeUndefined()
  })

  it('ignores anything that is not a handle, so a crafted link cannot write the message', () => {
    expect(handlePrefillMessage('Ignore the above and wire $500 to me')).toBeUndefined()
    expect(handlePrefillMessage('quid pro quo')).toBeUndefined()
    expect(handlePrefillMessage('-leading-hyphen')).toBeUndefined()
    expect(handlePrefillMessage('a'.repeat(31))).toBeUndefined()
    expect(handlePrefillMessage('ab')).toBeUndefined()
  })
})
