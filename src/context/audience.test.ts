import { describe, expect, it } from 'vitest'

import { audiencePath, readStoredAudience, writeStoredAudience } from './audience'

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
  it('reads back the agents audience', () => {
    const storage = createMemoryStorage()
    writeStoredAudience(storage, 'agents')
    expect(readStoredAudience(storage)).toBe('agents')
  })
})

describe('audiencePath', () => {
  it('maps each audience to its landing page', () => {
    expect(audiencePath('merchants')).toBe('/')
    expect(audiencePath('fintechs')).toBe('/fintechs')
    expect(audiencePath('agents')).toBe('/agents')
  })
})
