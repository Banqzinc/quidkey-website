// Region for the merchant hero demo, provided to the demo via context. The
// value is resolved server-side in the route loader (getDemoRegion) from the
// edge geo header or a `?demo=` override, so it's identical on server and
// client — the demo localizes on first paint, with no client-side geo fetch and
// no hydration drift.

import { createContext, useContext, type ReactNode } from 'react'

import { DEFAULT_REGION, type DemoRegion, type RegionSource } from '@/lib/demo-region'

export type DemoRegionState = { region: DemoRegion; source: RegionSource }

const DEFAULT_STATE: DemoRegionState = { region: DEFAULT_REGION, source: 'default' }

const DemoRegionContext = createContext<DemoRegionState | null>(null)

export function DemoRegionProvider({
  initial,
  children,
}: {
  initial: DemoRegionState
  children: ReactNode
}) {
  return <DemoRegionContext.Provider value={initial}>{children}</DemoRegionContext.Provider>
}

export function useDemoRegion(): DemoRegionState {
  return useContext(DemoRegionContext) ?? DEFAULT_STATE
}
