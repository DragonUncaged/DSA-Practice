import { describe, expect, it } from 'vitest'
import { PROBLEMS } from '@/problems'
import { check, type CheckRow } from './selfcheck'

/**
 * The authored library, checked the way /selftest checks it: a broken trace,
 * an unmapped step or a reference solution that fails its own tests should
 * fail `npm test`, not wait to be noticed on a page visit.
 */

const issues = (r: CheckRow) =>
  [
    r.error,
    !r.practiceOnly && r.frames === 0 ? 'no frames' : null,
    ...r.unmappedSteps.map((u) => `unmapped ${u}`),
    ...r.failures,
  ].filter(Boolean)

const rows = PROBLEMS.flatMap(check)

describe('authored problems', () => {
  it('registers every problem exactly once', () => {
    const ids = PROBLEMS.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('produces a row for every registered problem', () => {
    expect(new Set(rows.map((r) => r.problem)).size).toBe(
      new Set(PROBLEMS.map((p) => p.title)).size,
    )
  })

  it('has no unhealthy solution', () => {
    const bad = rows
      .filter((r) => issues(r).length)
      .map((r) => `${r.problem} / ${r.solution}: ${issues(r).join(' · ')}`)
    expect(bad).toEqual([])
  })

  it('passes every test of every reference solution', () => {
    const short = rows
      .filter((r) => !r.statementOnly && r.testsPassed !== r.testsTotal)
      .map((r) => `${r.problem} / ${r.solution}: ${r.testsPassed}/${r.testsTotal}`)
    expect(short).toEqual([])
  })
})
