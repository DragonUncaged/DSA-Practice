import { describe, expect, it } from 'vitest'
import { PROBLEMS } from './index'
import { PROBLEM_META } from './meta'

/**
 * `meta.ts` exists so the sheets, home and the switcher do not pull the whole
 * problem library into their bundles, which means it restates what `PROBLEMS`
 * already knows. Nothing in the type system ties the two together, so this is
 * the check: adding, removing, renaming or re-grouping a problem without
 * regenerating the table fails here.
 */
describe('problem meta', () => {
  it('is exactly PROBLEMS, field for field and in order', () => {
    expect(PROBLEM_META).toEqual(
      PROBLEMS.map(({ id, title, group, pattern, difficulty }) => ({
        id,
        title,
        group,
        pattern,
        difficulty,
      })),
    )
  })
})
