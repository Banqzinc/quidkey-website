// Resolves which demo region (US/AU) the merchant hero should show.
//
// Resolution order, highest first:
//   1. `?demo=AU` URL override — sticks for the session (sales/QA screenshots).
//   2. A previously cached country.is result (this session).
//   3. country.is geo lookup (async; stays on the US default until it returns).
//   4. US default.
//
// State lives in a module-level store rather than React context so the lazily-
// mounted demo gets the answer with no provider plumbing, and concurrent
// callers share a single country.is request. Init runs eagerly on the client so
// a `?demo=` override is reflected on the demo's first paint.

import { useSyncExternalStore } from 'react'

import {
  DEFAULT_REGION,
  isDemoRegion,
  normalizeCountryToRegion,
  parseRegionOverride,
  type DemoRegion,
  type RegionSource,
} from '@/lib/demo-region'

const OVERRIDE_KEY = 'quidkey:demo-region-override'
const DETECTED_KEY = 'quidkey:demo-region-detected'
const COUNTRY_API = 'https://api.country.is/'

export type DemoRegionState = { region: DemoRegion; source: RegionSource }

const SERVER_STATE: DemoRegionState = { region: DEFAULT_REGION, source: 'default' }

let state: DemoRegionState = SERVER_STATE
let initialized = false
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

function setState(next: DemoRegionState) {
  if (next.region === state.region && next.source === state.source) return
  state = next
  emit()
}

function readSession(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key)
  } catch {
    return null
  }
}

function writeSession(key: string, value: string) {
  try {
    window.sessionStorage.setItem(key, value)
  } catch {
    // private mode / quota — detection still works, it just won't be cached.
  }
}

function ensureInit() {
  if (initialized || typeof window === 'undefined') return
  initialized = true

  // 1. Explicit override wins and is remembered for the session so internal
  //    navigation keeps the forced region.
  const urlOverride = parseRegionOverride(window.location.search)
  if (urlOverride) {
    writeSession(OVERRIDE_KEY, urlOverride)
    state = { region: urlOverride, source: 'override' }
    return
  }
  const storedOverride = readSession(OVERRIDE_KEY)
  if (isDemoRegion(storedOverride)) {
    state = { region: storedOverride, source: 'override' }
    return
  }

  // 2. Reuse this session's earlier geo lookup.
  const cachedGeo = readSession(DETECTED_KEY)
  if (isDemoRegion(cachedGeo)) {
    state = { region: cachedGeo, source: 'geo' }
    return
  }

  // 3. Detect via country.is. Stays on the US default until this resolves; a
  //    failure (offline / blocked) silently leaves the default in place.
  fetch(COUNTRY_API)
    .then((res) => (res.ok ? res.json() : null))
    .then((data: { country?: string } | null) => {
      const region = normalizeCountryToRegion(data?.country)
      writeSession(DETECTED_KEY, region)
      setState({ region, source: 'geo' })
    })
    .catch(() => {})
}

if (typeof window !== 'undefined') ensureInit()

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange)
  ensureInit()
  return () => {
    listeners.delete(onChange)
  }
}

function getSnapshot(): DemoRegionState {
  return state
}

function getServerSnapshot(): DemoRegionState {
  return SERVER_STATE
}

export function useDemoRegion(): DemoRegionState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
