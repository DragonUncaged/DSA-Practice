'use client'

import Link from 'next/link'
import { useProgress } from '@/lib/store'
import { PATTERNS } from '@/patterns'
import s from './PatternsHome.module.scss'

export function PatternsHome() {
  const progress = useProgress()

  return (
    <div className={s.page}>
      <header className={s.head}>
        <div className={s.kicker}>PATTERNS</div>
        <h1>Learn the moves first.</h1>
        <p>
          Every problem on the sheet is one of a small number of moves. Each intro teaches one
          move with a toy animation, then ramps you through the sheet&apos;s problems that use it —
          easiest first.
        </p>
      </header>

      <div className={s.grid}>
        {PATTERNS.map((p) => {
          const solved = p.ramp.filter((id) => progress[id] === 'solved').length
          return (
            <Link key={p.id} href={`/pattern/${p.id}`} className={s.card}>
              <div className={s.cardTop}>
                <span className={s.name}>{p.name}</span>
                <span className={s.count}>
                  {solved} / {p.ramp.length}
                </span>
              </div>
              <p className={s.tagline}>{p.tagline}</p>
              <div className={s.track}>
                <div
                  className={s.fill}
                  style={{ width: `${p.ramp.length ? (solved / p.ramp.length) * 100 : 0}%` }}
                />
              </div>
            </Link>
          )
        })}
      </div>

      <p className={s.footNote}>More patterns are on the way — the engine is ready for them.</p>
    </div>
  )
}
