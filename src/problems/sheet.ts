import type { Difficulty } from '@/lib/types'

/**
 * The one place a sheet row becomes a sheet entry.
 *
 * Every track (Blind 75, SDE, Premium, per-company) is a table of rows that
 * has to answer the same question: does a registered problem back this row?
 * Both halves of that answer — the slug and the lookup — used to be copied
 * per track, so a track could drift into linking at a problem id that no
 * longer exists. The set of ids is passed in rather than imported so this
 * module carries no problem data: `src/problems/index.ts` imports it, never
 * the other way round.
 */

export interface SheetEntry {
  title: string
  group: string
  difficulty: Difficulty
  /** Set when a trace exists; otherwise the row shows as not yet authored. */
  problemId?: string
  slug: string
  /**
   * Where an unbuilt row sends you. Tracks that know the real LeetCode slug
   * set it; the rest fall back to the slugified title, which is best-effort.
   */
  leetcode?: string
}

/** A row as a track writes it, before the id lookup. */
export interface SheetRow {
  title: string
  difficulty: Difficulty
  /** Explicit problem id, for a row whose title does not slugify to it. */
  id?: string
  /** Full LeetCode URL for a row with no trace. */
  leetcode?: string
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/**
 * An explicit id wins over the slug, but only when it actually resolves — a
 * typo would otherwise become a live link to a problem that does not exist.
 * The sheet test asserts every explicit id resolves, so a typo fails there
 * rather than shipping as a row that quietly stopped linking into the player.
 */
export function toEntries(
  group: string,
  rows: SheetRow[],
  ids: ReadonlySet<string>,
): SheetEntry[] {
  return rows.map((row) => {
    const slug = slugify(row.title)
    const problemId = row.id && ids.has(row.id) ? row.id : ids.has(slug) ? slug : undefined
    return {
      title: row.title,
      group,
      difficulty: row.difficulty,
      slug,
      ...(problemId ? { problemId } : {}),
      ...(row.leetcode ? { leetcode: row.leetcode } : {}),
    }
  })
}
