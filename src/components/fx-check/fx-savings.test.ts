import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import {
  CURRENT_FEE_PERCENT,
  estimateFxSavings,
  QUIDKEY_FEE_PERCENT,
  SAVING_PERCENT,
  savingOn,
  TALK_TO_US_FROM,
} from './fx-savings'

describe('estimateFxSavings', () => {
  it('uses a flat 0.5% saving and invites a conversation from $1m a month', () => {
    expect(SAVING_PERCENT).toBe(0.5)
    expect(TALK_TO_US_FROM).toBe(1_000_000)
  })

  it('states the assumption as conversion fees falling from 2% to 1.5%', () => {
    expect(CURRENT_FEE_PERCENT).toBe(2)
    expect(QUIDKEY_FEE_PERCENT).toBe(1.5)
    expect(CURRENT_FEE_PERCENT - QUIDKEY_FEE_PERCENT).toBe(SAVING_PERCENT)
  })

  it('prices the 90-day sample result off the same rate', () => {
    expect(savingOn(750_000)).toBe(3750) // 750000 * 0.5%
  })

  it('matches the hand-computed $250k default', () => {
    const s = estimateFxSavings(250_000)
    expect(s.monthlySaving).toBe(1250) // 250000 * 0.5%
    expect(s.yearlySaving).toBe(15000) // 1250 * 12
  })

  it('stays at the flat rate for the $1m pill', () => {
    expect(estimateFxSavings(1_000_000).monthlySaving).toBe(5000)
  })

  it('returns zeros for zero volume', () => {
    expect(estimateFxSavings(0)).toEqual({ monthlySaving: 0, yearlySaving: 0 })
  })

  it('treats negative or non-finite volume as zero', () => {
    expect(estimateFxSavings(-100)).toEqual({ monthlySaving: 0, yearlySaving: 0 })
    expect(estimateFxSavings(Number.NaN)).toEqual({ monthlySaving: 0, yearlySaving: 0 })
  })
})

describe('fx-check copy', () => {
  // House style for this page: plain language, no em dashes.
  it('contains no em dashes in any fx-check source file', () => {
    const dir = join(__dirname)
    const offenders = readdirSync(dir)
      .filter((f) => /\.(tsx?|css)$/.test(f) && !f.endsWith('.test.ts'))
      .filter((f) => readFileSync(join(dir, f), 'utf8').includes('—'))
    expect(offenders).toEqual([])
  })
})
