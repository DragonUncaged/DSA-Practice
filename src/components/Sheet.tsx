'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useAssisted, useProgress } from '@/lib/store'
import type { Difficulty } from '@/lib/types'
import { SHEET_GROUPS, type SheetEntry } from '@/problems'
import { COMPANY_GROUPS, COMPANY_TITLES } from '@/problems/companies'
import { SDE_GROUPS } from '@/problems/sde'
import s from './Sheet.module.scss'

const DIFFS: Difficulty[] = ['Easy', 'Medium', 'Hard']
const DIFF_COLOR: Record<Difficulty, string> = {
  Easy: '#A9E85C',
  Medium: '#F5B942',
  Hard: '#FF7A59',
}

export type TrackId = 'blind75' | 'sde' | 'google'

/**
 * Track definitions live here, on the client side of the boundary, so pages
 * pass only the track id — JSX blurbs and data never cross from the server.
 */
const TRACKS: Record<
  TrackId,
  {
    title: string
    blurb?: React.ReactNode
    groups: { name: string; items: SheetEntry[] }[]
  }
> = {
  blind75: {
    title: 'Blind 75',
    blurb: (
      <>
        Seventy-five problems that cover every pattern worth knowing — and every row has a{' '}
        <span className={s.hl}>working animation</span>. Pick one and watch it think.
      </>
    ),
    groups: SHEET_GROUPS,
  },
  sde: {
    title: 'SDE Sheet',
    groups: SDE_GROUPS,
  },
  google: {
    title: COMPANY_TITLES.google,
    blurb: (
      <>
        Sixty-two problems Google leans on — a{' '}
        <span className={s.hl}>core</span> ten and the set the same collection files
        alongside them. Most have no trace yet; they light up as traces land.
      </>
    ),
    groups: COMPANY_GROUPS.google,
  },
}

/** A row is keyed by its trace id when one exists, so progress survives authoring. */
const keyOf = (e: SheetEntry) => e.problemId ?? e.slug

export function Sheet({ track = 'blind75' }: { track?: TrackId }) {
  const def = TRACKS[track]
  const entries = useMemo(() => def.groups.flatMap((g) => g.items), [def])

  const progress = useProgress()
  const assisted = useAssisted()
  const [query, setQuery] = useState('')
  const [diff, setDiff] = useState<Difficulty | 'all'>('all')
  const [unsolvedOnly, setUnsolvedOnly] = useState(false)

  // Groups start collapsed so the whole track reads as an outline. A live
  // filter forces them open, otherwise a search would hide its own results.
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const filtering = query.trim() !== '' || diff !== 'all' || unsolvedOnly
  const toggleGroup = (name: string) =>
    setExpanded((m) => ({ ...m, [name]: !m[name] }))

  const isSolved = (e: SheetEntry) => progress[keyOf(e)] === 'solved'
  const solvedCount = entries.filter(isSolved).length

  const matches = (e: SheetEntry) => {
    const q = query.trim().toLowerCase()
    if (q && !e.title.toLowerCase().includes(q) && !e.group.toLowerCase().includes(q)) return false
    if (diff !== 'all' && e.difficulty !== diff) return false
    if (unsolvedOnly && isSolved(e)) return false
    return true
  }

  const groups = useMemo(
    () =>
      def.groups.map((g) => ({ ...g, rows: g.items.filter(matches) })).filter(
        (g) => g.rows.length > 0,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [def, query, diff, unsolvedOnly, progress],
  )

  const shown = groups.reduce((a, g) => a + g.rows.length, 0)

  return (
    <div className={s.page}>
      <header className={s.head}>
        <div>
          <div className={s.kicker}>TRACK</div>
          <h1>{def.title}</h1>
          {def.blurb && <p>{def.blurb}</p>}
        </div>

        <div className={s.headStats}>
          <div className={s.stat}>
            <span className={s.statLabel}>Solved</span>
            <span className={`${s.statValue} ${s.lime}`}>{solvedCount}</span>
          </div>
          <div className={s.stat}>
            <span className={s.statLabel}>Remaining</span>
            <span className={s.statValue}>{entries.length - solvedCount}</span>
          </div>
        </div>
      </header>

      <div className={s.diffGrid}>
        {DIFFS.map((d) => {
          const set = entries.filter((e) => e.difficulty === d)
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
          {shown} of {entries.length}
        </span>
      </div>

      {groups.length === 0 && <div className={s.emptyState}>No problems match those filters.</div>}

      <div className={s.groups}>
        {groups.map((g) => (
          <section key={g.name} className={s.group}>
            <button
              type="button"
              className={s.groupHead}
              onClick={() => !filtering && toggleGroup(g.name)}
              aria-expanded={filtering || !!expanded[g.name]}
            >
              <span className={s.name}>{g.name}</span>
              <span className={s.rule} />
              <span className={s.count}>
                {g.rows.length} / {g.items.length}
              </span>
              {!filtering && (
                <span
                  className={`${s.chevron} ${expanded[g.name] ? s.chevronOpen : ''}`}
                  aria-hidden
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              )}
            </button>

            {(filtering || expanded[g.name]) &&
              g.rows.map((e) => {
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
