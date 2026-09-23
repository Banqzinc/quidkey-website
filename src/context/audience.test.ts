import { describe, expect, it } from 'vitest'

import type { AgentsLaunch } from '@/lib/agents-launch'

import { audiencePath, readStoredAudience, visibleAudiences, writeStoredAudience } from './audience'

const hidden: AgentsLaunch = { live: false, previewToken: 't' }
const live: AgentsLaunch = { live: true, previewToken: 't' }

function createMemoryStorage(): Storage {
  const map = new Map<string, string>()
  return {
    get length() {
      return map.size
    },
    clear() {
      map.clear()
    },
    getItem(key) {
      return map.has(key) ? map.get(key)! : null
    },
    key(index) {
      return Array.from(map.keys())[index] ?? null
    },
    removeItem(key) {
      map.delete(key)
    },
    setItem(key, value) {
      map.set(key, value)
    },
  }
}

describe('audience storage round-trip', () => {
  it('returns merchants by default when nothing is stored', () => {
    const storage = createMemoryStorage()
    expect(readStoredAudience(storage)).toBe('merchants')
  })

  it('reads back what was written', () => {
    const storage = createMemoryStorage()
    writeStoredAudience(storage, 'fintechs')
    expect(readStoredAudience(storage)).toBe('fintechs')
    writeStoredAudience(storage, 'merchants')
    expect(readStoredAudience(storage)).toBe('merchants')
  })

  it('falls back to merchants if a corrupted value is stored', () => {
    const storage = createMemoryStorage()
    storage.setItem('quidkey:audience', 'something-unexpected')
    expect(readStoredAudience(storage)).toBe('merchants')
  })

  it('treats null storage as a no-op (SSR safety)', () => {
    expect(readStoredAudience(null)).toBe('merchants')
    expect(() => writeStoredAudience(null, 'fintechs')).not.toThrow()
  })
})

describe('agents audience', () => {
  it('reads back the agents audience once the page is live', () => {
    const storage = createMemoryStorage()
    writeStoredAudience(storage, 'agents')
    expect(readStoredAudience(storage, live)).toBe('agents')
  })

  it('treats a remembered agents audience as merchants while the page is hidden', () => {
    // Otherwise a visitor from before the page was hidden lands on its 404.
    const storage = createMemoryStorage()
    writeStoredAudience(storage, 'agents')
    expect(readStoredAudience(storage, hidden)).toBe('merchants')
  })

  it('offers the agents audience in the switch only once the page is live', () => {
    expect(visibleAudiences(live)).toEqual(['merchants', 'fintechs', 'agents'])
    expect(visibleAudiences(hidden)).toEqual(['merchants', 'fintechs'])
  })
})

describe('audiencePath', () => {
  it('maps each audience to its landing page', () => {
    expect(audiencePath('merchants')).toBe('/')
    expect(audiencePath('fintechs')).toBe('/fintechs')
    expect(audiencePath('agents')).toBe('/agents')
  })
})
