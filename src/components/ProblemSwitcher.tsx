'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ALL_ENTRIES, SHEET_GROUPS } from '@/problems/meta'
import { useProgress } from '@/lib/store'
import s from './ProblemSwitcher.module.scss'

/**
 * Jump between problems without leaving the player: prev/next arrows walk the
 * sheet in order, and the list button opens a drawer with the whole sheet.
 * Closed, it is just three small controls in the header — nothing covers the
 * trace until asked for.
 */
export function ProblemSwitcher({ currentId }: { currentId: string }) {
  const progress = useProgress()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const pos = ALL_ENTRIES.findIndex((e) => e.problemId === currentId)
  const prev = pos > 0 ? ALL_ENTRIES[pos - 1] : undefined
  const next = pos >= 0 && pos < ALL_ENTRIES.length - 1 ? ALL_ENTRIES[pos + 1] : undefined

  const solvedCount = useMemo(
    () => ALL_ENTRIES.filter((e) => e.problemId && progress[e.problemId] === 'solved').length,
    [progress],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    listRef.current?.querySelector('[data-now]')?.scrollIntoView({ block: 'center' })
    inputRef.current?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const q = query.trim().toLowerCase()
  const groups = SHEET_GROUPS.map((g) => ({
    ...g,
    items: q ? g.items.filter((e) => e.title.toLowerCase().includes(q)) : g.items,
  })).filter((g) => g.items.length > 0)

  return (
    <div className={s.cluster}>
      {prev?.problemId ? (
        <Link
          href={`/p/${prev.problemId}`}
          className={s.navBtn}
          title={`Previous: ${prev.title}`}
          aria-label={`Previous problem: ${prev.title}`}
        >
          &#8249;
        </Link>
      ) : (
        <span className={`${s.navBtn} ${s.off}`} aria-hidden>
          &#8249;
        </span>
      )}

      <button
        className={s.listBtn}
        onClick={() => {
          setQuery('')
          setOpen(true)
        }}
        title="Browse all problems"
        aria-haspopup="dialog"
      >
        <span className={s.burger} aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className={s.pos}>
          {pos >= 0 ? `${pos + 1} / ${ALL_ENTRIES.length}` : ALL_ENTRIES.length}
        </span>
      </button>

      {next?.problemId ? (
        <Link
          href={`/p/${next.problemId}`}
          className={s.navBtn}
          title={`Next: ${next.title}`}
          aria-label={`Next problem: ${next.title}`}
        >
          &#8250;
        </Link>
      ) : (
        <span className={`${s.navBtn} ${s.off}`} aria-hidden>
          &#8250;
        </span>
      )}

      {open && (
        <>
          <div className={s.backdrop} onClick={() => setOpen(false)} />
          <aside className={s.drawer} role="dialog" aria-label="All problems">
            <div className={s.drawerHead}>
              <div>
                <div className={s.kicker}>BLIND 75</div>
                <div className={s.solvedLine}>
                  <span className={s.lime}>{solvedCount}</span> / {ALL_ENTRIES.length} solved
                </div>
              </div>
              <button className={s.close} onClick={() => setOpen(false)} aria-label="Close list">
                &#10005;
              </button>
            </div>

            <div className={s.search}>
              <span className={s.icon} aria-hidden>
                &#8981;
              </span>
              <input
                ref={inputRef}
                name="problem-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search problems..."
                aria-label="Search problems"
              />
            </div>

            <div className={s.list} ref={listRef}>
              {groups.map((g) => (
                <div key={g.name}>
                  <div className={s.groupName}>
                    <span className={s.name}>{g.name}</span>
                    <span className={s.rule} />
                    <span className={s.count}>{g.items.length}</span>
                  </div>
                  {g.items.map((e) => {
                    const done = e.problemId != null && progress[e.problemId] === 'solved'
                    const now = e.problemId === currentId
                    return e.problemId ? (
                      <Link
                        key={e.slug}
                        href={`/p/${e.problemId}`}
                        className={`${s.row} ${now ? s.now : ''}`}
                        data-now={now || undefined}
                        aria-current={now ? 'page' : undefined}
                        onClick={() => setOpen(false)}
                      >
                        <span className={`${s.light} ${done ? s.on : ''}`}>{done ? '✓' : ''}</span>
                        <span className={s.rowTitle}>{e.title}</span>
                        <span className={`${s.diff} ${s[e.difficulty.toLowerCase()]}`}>
                          {e.difficulty}
                        </span>
                      </Link>
                    ) : (
                      <div key={e.slug} className={`${s.row} ${s.soon}`}>
                        <span className={s.light} />
                        <span className={s.rowTitle}>{e.title}</span>
                        <span className={`${s.diff} ${s[e.difficulty.toLowerCase()]}`}>
                          {e.difficulty}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ))}
              {groups.length === 0 && <div className={s.emptyNote}>No problem matches that.</div>}
            </div>
          </aside>
        </>
      )}
    </div>
  )
}
