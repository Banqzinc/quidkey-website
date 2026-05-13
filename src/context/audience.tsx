import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

export type Audience = 'merchants' | 'fintechs'

const STORAGE_KEY = 'quidkey:audience'
const DEFAULT_AUDIENCE: Audience = 'merchants'

type AudienceContextValue = {
  audience: Audience
  setAudience: (next: Audience) => void
}

const AudienceContext = createContext<AudienceContextValue | null>(null)

export function readStoredAudience(storage: Storage | null | undefined): Audience {
  if (!storage) return DEFAULT_AUDIENCE
  try {
    const raw = storage.getItem(STORAGE_KEY)
    return raw === 'merchants' || raw === 'fintechs' ? raw : DEFAULT_AUDIENCE
  } catch {
    return DEFAULT_AUDIENCE
  }
}

export function writeStoredAudience(storage: Storage | null | undefined, value: Audience): void {
  if (!storage) return
  try {
    storage.setItem(STORAGE_KEY, value)
  } catch {
    // localStorage write can throw on quota or in private browsing — silently ignore.
  }
}

export function AudienceProvider({ children }: { children: ReactNode }) {
  const [audience, setAudienceState] = useState<Audience>(DEFAULT_AUDIENCE)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = readStoredAudience(window.localStorage)
    if (stored !== DEFAULT_AUDIENCE) setAudienceState(stored)
  }, [])

  const setAudience = useCallback((next: Audience) => {
    setAudienceState(next)
    if (typeof window !== 'undefined') {
      writeStoredAudience(window.localStorage, next)
    }
  }, [])

  return <AudienceContext.Provider value={{ audience, setAudience }}>{children}</AudienceContext.Provider>
}

export function useAudience(): AudienceContextValue {
  const ctx = useContext(AudienceContext)
  if (!ctx) throw new Error('useAudience must be used inside <AudienceProvider>')
  return ctx
}
