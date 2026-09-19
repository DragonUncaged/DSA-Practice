import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_PREFS } from './store'

/**
 * Hydration is the one place a release can lose someone's progress: the blob
 * on disk was written by an older version of this app, by another tab, or by
 * hand. Each test seeds localStorage, imports the store fresh, and hydrates.
 */

const STORE_KEY = 'trace.v1'

function fakeStorage(seed: Record<string, string> = {}, opts: { failWrites?: boolean } = {}) {
  const map = new Map(Object.entries(seed))
  const storage = {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => {
      if (opts.failWrites) throw new Error('QuotaExceededError')
      map.set(k, String(v))
    },
    removeItem: (k: string) => void map.delete(k),
    clear: () => map.clear(),
    key: (i: number) => [...map.keys()][i] ?? null,
    get length() {
      return map.size
    },
  }
  return { storage: storage as unknown as Storage, map }
}

/** A fresh module instance per test, wired to `storage`. */
async function loadStore(storage: Storage) {
  vi.resetModules()
  vi.stubGlobal('localStorage', storage)
  vi.stubGlobal('window', { localStorage, addEventListener() {}, removeEventListener() {} })
  const mod = await import('./store')
  mod.hydrateStore()
  await mod.useTraceStore.persist.rehydrate()
  return mod
}

const blob = (state: unknown, version = 0) => JSON.stringify({ state, version })

beforeEach(() => {
  vi.unstubAllGlobals()
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('hydration', () => {
  it('starts from defaults with an empty store', async () => {
    const { storage } = fakeStorage()
    const { useTraceStore } = await loadStore(storage)
    const s = useTraceStore.getState()
    expect(s.hydrated).toBe(true)
    expect(s.progress).toEqual({})
    expect(s.prefs).toEqual(DEFAULT_PREFS)
  })

  it('reads back the current blob', async () => {
    const { storage } = fakeStorage({
      [STORE_KEY]: blob({
        progress: { 'two-sum': 'solved' },
        drafts: { 'two-sum:js': 'code' },
        streak: { last: '2026-01-01', count: 3, days: ['2026-01-01'] },
        prefs: { ...DEFAULT_PREFS, lang: 'cpp', editorFontSize: 16 },
        reveal: { 'two-sum': 2 },
        assisted: { 'two-sum': true },
      }),
    })
    const { useTraceStore } = await loadStore(storage)
    const s = useTraceStore.getState()
    expect(s.hydrated).toBe(true)
    expect(s.progress).toEqual({ 'two-sum': 'solved' })
    expect(s.drafts).toEqual({ 'two-sum:js': 'code' })
    expect(s.streak.count).toBe(3)
    expect(s.prefs.lang).toBe('cpp')
    expect(s.prefs.editorFontSize).toBe(16)
    expect(s.reveal).toEqual({ 'two-sum': 2 })
    expect(s.assisted).toEqual({ 'two-sum': true })
  })

  it('folds the legacy per-key layout into the one blob', async () => {
    const { storage, map } = fakeStorage({
      [`${STORE_KEY}.progress`]: JSON.stringify({ 'two-sum': 'solved' }),
      [`${STORE_KEY}.drafts`]: JSON.stringify({ 'two-sum:js': 'legacy', 'two-sum:py': 'gone' }),
      [`${STORE_KEY}.prefs`]: JSON.stringify({ lang: 'cpp' }),
    })
    const { useTraceStore } = await loadStore(storage)
    const s = useTraceStore.getState()
    expect(s.hydrated).toBe(true)
    expect(s.progress).toEqual({ 'two-sum': 'solved' })
    // Python was dropped: its drafts go with it
    expect(s.drafts).toEqual({ 'two-sum:js': 'legacy' })
    expect(s.prefs.lang).toBe('cpp')
    expect(map.has(`${STORE_KEY}.progress`)).toBe(false)
    expect(map.get(STORE_KEY)).toContain('two-sum')
  })

  it('drops a language that no longer exists', async () => {
    const { storage } = fakeStorage({
      [STORE_KEY]: blob({ prefs: { ...DEFAULT_PREFS, lang: 'py' } }),
    })
    const { useTraceStore } = await loadStore(storage)
    expect(useTraceStore.getState().prefs.lang).toBe(DEFAULT_PREFS.lang)
  })

  it('survives a corrupt blob', async () => {
    const { storage } = fakeStorage({ [STORE_KEY]: '{not json' })
    const { useTraceStore } = await loadStore(storage)
    const s = useTraceStore.getState()
    expect(s.hydrated).toBe(true)
    expect(s.progress).toEqual({})
    expect(s.prefs).toEqual(DEFAULT_PREFS)
  })

  it('runs a blob from a future version through migrate rather than discarding it', async () => {
    const { storage } = fakeStorage({
      [STORE_KEY]: blob({ progress: { 'two-sum': 'solved' } }, 99),
    })
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { useTraceStore } = await loadStore(storage)
    const s = useTraceStore.getState()
    expect(s.hydrated).toBe(true)
    expect(s.progress).toEqual({ 'two-sum': 'solved' })
    // the "no migrate function was provided" path is what wipes progress
    expect(errors).not.toHaveBeenCalled()
  })

  it('rejects values of the wrong shape instead of handing them to components', async () => {
    const { storage } = fakeStorage({
      [STORE_KEY]: blob({
        progress: { good: 'solved', bad: 'attempted', worse: 42 },
        drafts: { ok: 'code', nope: 7 },
        streak: 'not an object',
        prefs: { lang: 'klingon', editorFontSize: 'big', resultsW: Number.NaN, codeH: null },
        reveal: { good: 3, bad: 9 },
        assisted: { good: true, bad: 'yes' },
      }),
    })
    const { useTraceStore } = await loadStore(storage)
    const s = useTraceStore.getState()
    expect(s.progress).toEqual({ good: 'solved' })
    expect(s.drafts).toEqual({ ok: 'code' })
    expect(s.streak).toEqual({ last: null, count: 0, days: [] })
    expect(s.reveal).toEqual({ good: 3 })
    expect(s.assisted).toEqual({ good: true })
    expect(s.prefs.lang).toBe(DEFAULT_PREFS.lang)
    expect(s.prefs.editorFontSize).toBe(DEFAULT_PREFS.editorFontSize)
    expect(s.prefs.resultsW).toBe(DEFAULT_PREFS.resultsW)
    expect(s.prefs.codeH).toBeNull()
  })
})

describe('writes', () => {
  it('keeps working when localStorage refuses to write', async () => {
    const { storage } = fakeStorage({}, { failWrites: true })
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { useTraceStore, getDraft } = await loadStore(storage)

    expect(() => useTraceStore.getState().setDraft('two-sum', 'js', 'code')).not.toThrow()
    expect(getDraft('two-sum', 'js')).toBe('code')

    expect(() => useTraceStore.getState().setSolved('two-sum', 'solved')).not.toThrow()
    expect(useTraceStore.getState().progress).toEqual({ 'two-sum': 'solved' })

    // one warning, however many writes failed
    expect(warn).toHaveBeenCalledTimes(1)
  })

  it('persists a solve and the streak that comes with it', async () => {
    const { storage, map } = fakeStorage()
    const { useTraceStore } = await loadStore(storage)
    useTraceStore.getState().setSolved('two-sum', 'solved')
    const written = JSON.parse(map.get(STORE_KEY) as string)
    expect(written.version).toBe(0)
    expect(written.state.progress).toEqual({ 'two-sum': 'solved' })
    expect(written.state.streak.count).toBe(1)
  })

  it('clears a draft without touching the others', async () => {
    const { storage } = fakeStorage()
    const { useTraceStore, getDraft } = await loadStore(storage)
    useTraceStore.getState().setDraft('two-sum', 'js', 'a')
    useTraceStore.getState().setDraft('two-sum', 'cpp', 'b')
    useTraceStore.getState().clearDraft('two-sum', 'js')
    expect(getDraft('two-sum', 'js')).toBeNull()
    expect(getDraft('two-sum', 'cpp')).toBe('b')
  })
})
