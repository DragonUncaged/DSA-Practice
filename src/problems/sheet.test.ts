import { describe, expect, it } from 'vitest'
import { PATTERNS } from '@/patterns'
import { ALL_ENTRIES, PROBLEMS, PROBLEM_IDS, SHEET_GROUPS } from './index'
import { COMPANY_GROUPS } from './companies'
import { PREMIUM_GROUPS } from './premium'
import { SDE_EXPLICIT_IDS, SDE_GROUPS } from './sde'
import { slugify, toEntries, type SheetEntry } from './sheet'

/**
 * Every track is a table of titles matched against the registered problems by
 * slug. Nothing in the type system says a row still points at a problem that
 * exists, so a dead link (or a problem that no sheet lists) shows up here.
 */

type Track = { name: string; groups: { name: string; items: SheetEntry[] }[] }

const TRACKS: Track[] = [
  { name: 'Blind 75', groups: SHEET_GROUPS },
  { name: 'SDE', groups: SDE_GROUPS },
  { name: 'Premium', groups: PREMIUM_GROUPS },
  ...Object.entries(COMPANY_GROUPS).map(([id, groups]) => ({ name: `company/${id}`, groups })),
]

const entriesOf = (t: Track) => t.groups.flatMap((g) => g.items)

describe('slugify', () => {
  it('is the id a problem file is named after', () => {
    expect(slugify('Two Sum')).toBe('two-sum')
    expect(slugify('3Sum')).toBe('3sum')
    expect(slugify('Best Time to Buy and Sell Stock')).toBe('best-time-to-buy-and-sell-stock')
    expect(slugify('Add & Search Word')).toBe('add-search-word')
    expect(slugify('  Trailing  ')).toBe('trailing')
  })
})

describe('toEntries', () => {
  const ids = new Set(['two-sum'])

  it('lights a row up when a registered problem matches its slug', () => {
    expect(toEntries('Array', [{ title: 'Two Sum', difficulty: 'Easy' }], ids)).toEqual([
      { title: 'Two Sum', group: 'Array', difficulty: 'Easy', slug: 'two-sum', problemId: 'two-sum' },
    ])
  })

  it('leaves a row unbuilt when nothing matches', () => {
    const [entry] = toEntries('Array', [{ title: 'Not Written Yet', difficulty: 'Hard' }], ids)
    expect(entry.problemId).toBeUndefined()
    expect(entry.slug).toBe('not-written-yet')
  })

  it('prefers an explicit id over the slug', () => {
    const [entry] = toEntries(
      'Day 1',
      [{ title: 'Set Matrix Zeroes', difficulty: 'Medium', id: 'two-sum' }],
      ids,
    )
    expect(entry.problemId).toBe('two-sum')
  })

  it('ignores an explicit id that does not resolve', () => {
    const [entry] = toEntries(
      'Day 1',
      [{ title: 'Two Sum', difficulty: 'Easy', id: 'typo-id' }],
      ids,
    )
    // falls back to the slug rather than linking at a problem that is not there
    expect(entry.problemId).toBe('two-sum')
    expect(toEntries('x', [{ title: 'Nope', difficulty: 'Easy', id: 'typo' }], ids)[0].problemId)
      .toBeUndefined()
  })

  it('carries a LeetCode link through', () => {
    const [entry] = toEntries(
      'Easy',
      [{ title: 'Nope', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/nope/' }],
      ids,
    )
    expect(entry.leetcode).toBe('https://leetcode.com/problems/nope/')
  })
})

describe('sheet data', () => {
  it.each(TRACKS.map((t) => [t.name, t] as const))('%s has no duplicate slug', (_name, track) => {
    const slugs = entriesOf(track).map((e) => e.slug)
    const seen = new Set<string>()
    const dupes = slugs.filter((s) => (seen.has(s) ? true : (seen.add(s), false)))
    expect(dupes).toEqual([])
  })

  it.each(TRACKS.map((t) => [t.name, t] as const))(
    '%s only links at problems that exist',
    (_name, track) => {
      const dead = entriesOf(track)
        .map((e) => e.problemId)
        .filter((id): id is string => id != null && !PROBLEM_IDS.has(id))
      expect(dead).toEqual([])
    },
  )

  it('resolves every explicit SDE id', () => {
    const unresolved = SDE_EXPLICIT_IDS.filter((id) => !PROBLEM_IDS.has(id))
    expect(unresolved).toEqual([])
  })

  it('lists every registered problem on some sheet', () => {
    const onSheets = new Set(
      TRACKS.flatMap(entriesOf)
        .map((e) => e.problemId)
        .filter(Boolean),
    )
    const orphans = PROBLEMS.map((p) => p.id).filter((id) => !onSheets.has(id))
    expect(orphans).toEqual([])
  })

  it('matches every Blind 75 row against a problem id, when one is authored', () => {
    for (const entry of ALL_ENTRIES) {
      if (PROBLEM_IDS.has(entry.slug)) expect(entry.problemId).toBe(entry.slug)
      else expect(entry.problemId).toBeUndefined()
    }
  })

  it('names only real problems in every pattern ramp', () => {
    const missing = PATTERNS.flatMap((p) =>
      p.ramp.filter((id) => !PROBLEM_IDS.has(id)).map((id) => `${p.id}: ${id}`),
    )
    expect(missing).toEqual([])
  })
})
