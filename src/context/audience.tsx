import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

import { agentsLaunch, type AgentsLaunch } from '@/lib/agents-launch'
import { AGENTS_PATH, FINTECHS_PATH } from '@/lib/urls'

export const AUDIENCES = ['merchants', 'fintechs', 'agents'] as const
export type Audience = (typeof AUDIENCES)[number]

const STORAGE_KEY = 'quidkey:audience'
const DEFAULT_AUDIENCE: Audience = 'merchants'

const AUDIENCE_PATHS: Record<Audience, string> = {
  merchants: '/',
  fintechs: FINTECHS_PATH,
  agents: AGENTS_PATH,
}

/** The audiences the site switch offers: agents only once its page is live. */
export function visibleAudiences(launch: AgentsLaunch = agentsLaunch): readonly Audience[] {
  return launch.live ? AUDIENCES : AUDIENCES.filter((a) => a !== 'agents')
}

/** The landing page each audience switches to. */
export function audiencePath(audience: Audience): string {
  return AUDIENCE_PATHS[audience]
}

function isAudience(raw: unknown): raw is Audience {
  return typeof raw === 'string' && (AUDIENCES as readonly string[]).includes(raw)
}

type AudienceContextValue = {
  audience: Audience
  setAudience: (next: Audience) => void
}

const AudienceContext = createContext<AudienceContextValue | null>(null)

export function readStoredAudience(
  storage: Storage | null | undefined,
  launch: AgentsLaunch = agentsLaunch,
): Audience {
  if (!storage) return DEFAULT_AUDIENCE
  try {
    const raw = storage.getItem(STORAGE_KEY)
    if (!isAudience(raw)) return DEFAULT_AUDIENCE
    // A visitor who chose agents before the page was hidden would otherwise
    // be switched onto its 404.
    return visibleAudiences(launch).includes(raw) ? raw : DEFAULT_AUDIENCE
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
