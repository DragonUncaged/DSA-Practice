'use client'

/**
 * Everything the app remembers lives in one Zustand store persisted to
 * localStorage. No accounts, no backend. A browser with storage disabled
 * degrades to an app that simply forgets, rather than crashing.
 *
 * The server (and the first client render) sees only defaults; StoreHydrator
 * rehydrates after mount, which keeps the SSG'd HTML and the hydration render
 * identical. Components that seed local state from persisted values react to
 * `useHydrated` flipping true.
 */

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Lang } from './types'

export type SolveState = 'solved' | 'attempted'

/**
 * 0 = fogged, 1 = approach shown, 2 = lines unfog as the trace executes them,
 * 3 = fully revealed. Level 3 marks the problem as "assisted" forever, which
 * is what the sheet's clean-solve diamond keys off.
 */
export type RevealLevel = 0 | 1 | 2 | 3

export interface Prefs {
  lang: Lang
  speed: number
  showState: boolean
  showRail: boolean
  /** Trace-tab solution panel height in px; null = the stylesheet default. */
  codeH: number | null
  /** Practice-tab test-case panel width in px; null = the stylesheet default. */
  resultsW: number | null
}

export interface Streak {
  /** ISO date (local) of the most recent day with activity. */
  last: string | null
  count: number
  /** Local ISO dates, most recent last, capped at 30. */
  days: string[]
}

export const DEFAULT_PREFS: Prefs = {
  lang: 'py',
  speed: 1,
  showState: true,
  showRail: true,
  codeH: null,
  resultsW: null,
}
const EMPTY_STREAK: Streak = { last: null, count: 0, days: [] }

const STORE_KEY = 'trace.v1'
const draftKey = (problemId: string, lang: Lang) => `${problemId}:${lang}`

const today = () => {
  const d = new Date()
  // local calendar date, not UTC — a 11pm solve shouldn't count as tomorrow
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const dayBefore = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(y, m - 1, d - 1)
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
}

/** Advance the streak for today's activity; applied on every earned solve. */
function touchedStreak(s: Streak): Streak {
  const t = today()
  if (s.last === t) return s
  const continued = s.last != null && s.last === dayBefore(t)
  return {
    last: t,
    count: continued ? s.count + 1 : 1,
    days: [...s.days.filter((d) => d !== t), t].slice(-30),
  }
}

interface TraceState {
  /** False until the persisted state has been read back after mount. */
  hydrated: boolean
  progress: Record<string, SolveState>
  drafts: Record<string, string>
  streak: Streak
  prefs: Prefs
  reveal: Record<string, RevealLevel>
  assisted: Record<string, boolean>

  setSolved(id: string, state: SolveState | null): void
  setDraft(problemId: string, lang: Lang, code: string): void
  clearDraft(problemId: string, lang: Lang): void
  setPrefs(p: Partial<Prefs>): void
  setRevealLevel(id: string, level: RevealLevel): void
  resetAll(): void
}

type Persisted = Pick<
  TraceState,
  'progress' | 'drafts' | 'streak' | 'prefs' | 'reveal' | 'assisted'
>

export const useTraceStore = create<TraceState>()(
  persist(
    (set) => ({
      hydrated: false,
      progress: {},
      drafts: {},
      streak: EMPTY_STREAK,
      prefs: DEFAULT_PREFS,
      reveal: {},
      assisted: {},

      /**
       * Solved status is earned, never toggled: the only caller that passes
       * 'solved' is the Practice runner, after every test case passes.
       */
      setSolved: (id, state) =>
        set((s) => {
          const progress = { ...s.progress }
          if (state == null) delete progress[id]
          else progress[id] = state
          return { progress, streak: state === 'solved' ? touchedStreak(s.streak) : s.streak }
        }),

      setDraft: (problemId, lang, code) =>
        set((s) => ({ drafts: { ...s.drafts, [draftKey(problemId, lang)]: code } })),

      clearDraft: (problemId, lang) =>
        set((s) => {
          const drafts = { ...s.drafts }
          delete drafts[draftKey(problemId, lang)]
          return { drafts }
        }),

      setPrefs: (p) => set((s) => ({ prefs: { ...s.prefs, ...p } })),

      /** Full reveal is remembered as assistance — the clean-solve mark keys off it. */
      setRevealLevel: (id, level) =>
        set((s) => ({
          reveal: { ...s.reveal, [id]: level },
          assisted: level === 3 ? { ...s.assisted, [id]: true } : s.assisted,
        })),

      resetAll: () =>
        set({
          progress: {},
          drafts: {},
          streak: EMPTY_STREAK,
          prefs: DEFAULT_PREFS,
          reveal: {},
          assisted: {},
        }),
    }),
    {
      name: STORE_KEY,
      storage: createJSONStorage(() => localStorage),
      // Hydration is explicit (see hydrateStore) so SSG HTML and the
      // hydration render agree; skipping it here avoids mismatch warnings.
      skipHydration: true,
      partialize: (s): Persisted => ({
        progress: s.progress,
        drafts: s.drafts,
        streak: s.streak,
        prefs: s.prefs,
        reveal: s.reveal,
        assisted: s.assisted,
      }),
      // Deep-merge prefs so a stored blob from before a new pref existed
      // still picks up that pref's default.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<Persisted>
        return { ...current, ...p, prefs: { ...current.prefs, ...(p.prefs ?? {}) } }
      },
      onRehydrateStorage: () => () => useTraceStore.setState({ hydrated: true }),
    },
  ),
)

// --- selector hooks — the intended entry points for components --------------

export const useProgress = () => useTraceStore((s) => s.progress)
export const usePrefs = () => useTraceStore((s) => s.prefs)
export const useReveal = () => useTraceStore((s) => s.reveal)
export const useAssisted = () => useTraceStore((s) => s.assisted)
export const useHydrated = () => useTraceStore((s) => s.hydrated)

/** Streak decays if a day was missed; computed on read so it's always honest. */
export const useStreak = () =>
  useTraceStore((s) => {
    if (!s.streak.last) return 0
    const t = today()
    return s.streak.last === t || s.streak.last === dayBefore(t) ? s.streak.count : 0
  })

/**
 * Imperative draft read for state initializers. Before hydration this returns
 * null; components that care re-seed when `useHydrated` flips true.
 */
export const getDraft = (problemId: string, lang: Lang): string | null =>
  useTraceStore.getState().drafts[draftKey(problemId, lang)] ?? null

// --- explicit hydration ----------------------------------------------------

const LEGACY_KEYS = ['progress', 'drafts', 'streak', 'resume', 'prefs', 'reveal', 'assisted']

/** Legacy per-key layout ('trace.v1.progress' etc.) folded into the one blob. */
function migrateLegacy() {
  try {
    if (window.localStorage.getItem(STORE_KEY)) {
      // already on the new layout — drop any leftovers from the old one
      LEGACY_KEYS.forEach((k) => window.localStorage.removeItem(`${STORE_KEY}.${k}`))
      return
    }
    const legacy = <T,>(k: string): T | null => {
      const raw = window.localStorage.getItem(`${STORE_KEY}.${k}`)
      return raw == null ? null : (JSON.parse(raw) as T)
    }
    const progress = legacy<Record<string, SolveState>>('progress')
    const drafts = legacy<Record<string, string>>('drafts')
    const streak = legacy<Streak>('streak')
    const prefs = legacy<Partial<Prefs>>('prefs')
    const reveal = legacy<Record<string, RevealLevel>>('reveal')
    const assisted = legacy<Record<string, boolean>>('assisted')
    if (!progress && !drafts && !streak && !prefs && !reveal && !assisted) return
    useTraceStore.setState((s) => ({
      progress: progress ?? s.progress,
      drafts: drafts ?? s.drafts,
      streak: streak ?? s.streak,
      prefs: { ...s.prefs, ...(prefs ?? {}) },
      reveal: reveal ?? s.reveal,
      assisted: assisted ?? s.assisted,
    }))
    // the setState above has already persisted the new blob
    LEGACY_KEYS.forEach((k) => window.localStorage.removeItem(`${STORE_KEY}.${k}`))
  } catch {
    /* storage unavailable — run stateless */
  }
}

/**
 * Mount-time hydration: import any legacy keys, read the persisted blob, and
 * keep this tab in sync with writes from other tabs. Returns a cleanup.
 */
export function hydrateStore() {
  migrateLegacy()
  void useTraceStore.persist.rehydrate()
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORE_KEY) void useTraceStore.persist.rehydrate()
  }
  window.addEventListener('storage', onStorage)
  return () => window.removeEventListener('storage', onStorage)
}
