'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useAssisted, useProgress } from '@/lib/store'
import type { Difficulty } from '@/lib/types'
import { ALL_ENTRIES, SHEET_GROUPS, TOTAL, type SheetEntry } from '@/problems'
import s from './Sheet.module.scss'

const DIFFS: Difficulty[] = ['Easy', 'Medium', 'Hard']
const DIFF_COLOR: Record<Difficulty, string> = {
  Easy: '#A9E85C',
  Medium: '#F5B942',
  Hard: '#FF7A59',
}

/** A row is keyed by its trace id when one exists, so progress survives authoring. */
const keyOf = (e: SheetEntry) => e.problemId ?? e.slug

export function Sheet() {
  const progress = useProgress()
  const assisted = useAssisted()
  const [query, setQuery] = useState('')
  const [diff, setDiff] = useState<Difficulty | 'all'>('all')
  const [unsolvedOnly, setUnsolvedOnly] = useState(false)

  const isSolved = (e: SheetEntry) => progress[keyOf(e)] === 'solved'
  const solvedCount = ALL_ENTRIES.filter(isSolved).length

  const matches = (e: SheetEntry) => {
    const q = query.trim().toLowerCase()
    if (q && !e.title.toLowerCase().includes(q) && !e.group.toLowerCase().includes(q)) return false
    if (diff !== 'all' && e.difficulty !== diff) return false
    if (unsolvedOnly && isSolved(e)) return false
    return true
  }

  const groups = useMemo(
    () =>
      SHEET_GROUPS.map((g) => ({ ...g, rows: g.items.filter(matches) })).filter(
        (g) => g.rows.length > 0,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query, diff, unsolvedOnly, progress],
  )

  const shown = groups.reduce((a, g) => a + g.rows.length, 0)

  return (
    <div className={s.page}>
      <header className={s.head}>
        <div>
          <div className={s.kicker}>TRACK</div>
          <h1>Blind 75</h1>
          <p>
            Seventy-five problems that cover every pattern worth knowing — and every row has a{' '}
            <span className={s.hl}>working animation</span>. Pick one and watch it think.
          </p>
        </div>

        <div className={s.headStats}>
          <div className={s.stat}>
            <span className={s.statLabel}>Solved</span>
            <span className={`${s.statValue} ${s.lime}`}>{solvedCount}</span>
          </div>
          <div className={s.stat}>
            <span className={s.statLabel}>Remaining</span>
            <span className={s.statValue}>{TOTAL - solvedCount}</span>
          </div>
        </div>
      </header>

      <div className={s.diffGrid}>
        {DIFFS.map((d) => {
          const set = ALL_ENTRIES.filter((e) => e.difficulty === d)
          const done = set.filter(isSolved).length
          return (
            <div key={d} className={s.diffCard}>
              <div className={s.diffTop}>
                <span className={s.name} style={{ color: DIFF_COLOR[d] }}>
                  {d}
                </span>
                <span className={s.count}>
                  {done} / {set.length}
                </span>
              </div>
              <div className={s.track}>
                <div
                  className={s.fill}
                  style={{
                    width: `${set.length ? (done / set.length) * 100 : 0}%`,
                    background: DIFF_COLOR[d],
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className={s.filters}>
        <label className={s.search}>
          <span className={s.icon}>&#9906;</span>
          <input
            name="problem-filter"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter problems"
            aria-label="Filter problems"
          />
        </label>

        <div className={s.segmented}>
          {(['all', ...DIFFS] as const).map((d) => (
            <button
              key={d}
              className={`${s.seg} ${diff === d ? s.on : ''}`}
              onClick={() => setDiff(d)}
            >
              {d === 'all' ? 'All' : d}
            </button>
          ))}
        </div>

        <button
          className={`${s.toggle} ${unsolvedOnly ? s.on : ''}`}
          onClick={() => setUnsolvedOnly((v) => !v)}
        >
          <span className={s.dot} />
          Unsolved
        </button>

        <span className={s.shown}>
          {shown} of {TOTAL}
        </span>
      </div>

      {groups.length === 0 && <div className={s.emptyState}>No problems match those filters.</div>}

      <div className={s.groups}>
        {groups.map((g) => (
          <section key={g.name} className={s.group}>
            <div className={s.groupHead}>
              <span className={s.name}>{g.name}</span>
              <span className={s.rule} />
              <span className={s.count}>
                {g.rows.length} / {g.items.length}
              </span>
            </div>

            {g.rows.map((e) => {
              const done = isSolved(e)
              const live = !!e.problemId

              const inner = (
                <>
                  <span
                    className={`${s.check} ${done ? s.on : ''}`}
                    title={
                      done
                        ? 'Solved — every test case passed'
                        : 'Unsolved — earn it by passing the tests in Practice'
                    }
                    aria-label={done ? `${e.title}: solved` : `${e.title}: unsolved`}
                  >
                    ✓
                  </span>
                  <span className={`${s.rowTitle} ${done ? s.done : ''}`}>
                    {e.title}
                    {done && !assisted[keyOf(e)] && (
                      <span className={s.cleanMark} title="Solved without fully revealing the solution">
                        {' '}&#9670;
                      </span>
                    )}
                  </span>
                  <span className={`${s.diffLabel} ${s[e.difficulty.toLowerCase()]}`}>
                    {e.difficulty}
                  </span>
                  <span className={`${s.arrow} ${live ? '' : s.off}`}>&rarr;</span>
                </>
              )

              return live ? (
                <Link key={e.slug} href={`/p/${e.problemId}`} className={`${s.row} ${s.live}`}>
                  {inner}
                </Link>
              ) : (
                <div key={e.slug} className={`${s.row} ${s.soon}`}>
                  {inner}
                </div>
              )
            })}
          </section>
        ))}
      </div>
    </div>
  )
}
