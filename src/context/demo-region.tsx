// Region for the merchant hero demo, shared between the region switcher and
// the demo itself.
//
// The initial value is the DEFAULT_REGION constant, not geo — so the server
// and the first client render always agree, and there's no flash of the wrong
// market on hydration. Deliberately not persisted to localStorage: reading
// storage in an effect is exactly what produces the flash-then-correct
// behaviour the audience provider has to work around.

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

import { DEFAULT_REGION, type DemoRegion } from '@/lib/demo-region'

export type DemoRegionState = {
  region: DemoRegion
  setRegion: (next: DemoRegion) => void
}

const DEFAULT_STATE: DemoRegionState = { region: DEFAULT_REGION, setRegion: () => {} }

const DemoRegionContext = createContext<DemoRegionState | null>(null)

export function DemoRegionProvider({ children }: { children: ReactNode }) {
  const [region, setRegion] = useState<DemoRegion>(DEFAULT_REGION)
  const value = useMemo(() => ({ region, setRegion }), [region])
  return <DemoRegionContext.Provider value={value}>{children}</DemoRegionContext.Provider>
}

// Falls back to a read-only default so the demo still renders if it's ever
// mounted outside the provider.
export function useDemoRegion(): DemoRegionState {
  return useContext(DemoRegionContext) ?? DEFAULT_STATE
}
