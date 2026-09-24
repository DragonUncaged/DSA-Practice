'use client'

import Link from 'next/link'
import { useProgress, useStreak } from '@/lib/store'
import { PATTERNS } from '@/patterns'
import { ALL_ENTRIES, PROBLEM_META, TOTAL } from '@/problems/meta'
import s from './Home.module.scss'

export function Home() {
  const progress = useProgress()
  const streak = useStreak()

  const solved = ALL_ENTRIES.filter((e) => progress[e.problemId ?? e.slug] === 'solved').length
  const next = PROBLEM_META.find((p) => progress[p.id] !== 'solved') ?? PROBLEM_META[0]

  return (
    <div className={s.page}>
      <section className={s.hero}>
        <div className={s.heroCopy}>
          <div className={s.kicker}>VISUAL DSA PRACTICE</div>
          <h1>
            Watch the
            <br />
            algorithm think.
          </h1>
          <p>
            Every problem in the sheet runs as a stepped animation next to its code. Scrub the
            pointers, watch the state change, read the line that caused it.
          </p>
          <div className={s.cta}>
            <Link href="/practice" className={s.primary}>
              Start Blind 75 <span>&rarr;</span>
            </Link>
            <Link href="/sde" className={s.altTrack}>
              or the SDE Sheet
            </Link>
          </div>
        </div>

        {next && (
          <div className={s.resumeCard}>
            <div className={s.cardTop}>
              <span className={s.label}>{solved > 0 ? 'Up next' : 'Start here'}</span>
              <span className={s.meta}>
                {streak > 0 ? `${streak}d streak` : `${solved} / ${TOTAL} solved`}
              </span>
            </div>
            <div>
              <div className={s.cardTitle}>{next.title}</div>
              <div className={s.cardSub}>
                {next.pattern.toUpperCase()} &middot; {next.difficulty.toUpperCase()}
              </div>
            </div>
            <div className={s.spark}>
              {Array.from({ length: 15 }, (_, i) => (
                <span
                  key={i}
                  className={i < 5 ? s.past : i === 5 ? s.now : ''}
                  style={{ height: i === 5 ? 26 : i < 5 ? 16 : 8 }}
                />
              ))}
            </div>
            <Link href={`/p/${next.id}`} className={s.cardLink}>
              Open the trace
            </Link>
          </div>
        )}
      </section>

      <section className={s.section}>
        <div className={s.sectionHead}>
          <span className={s.label}>Learn the moves</span>
          <Link href="/patterns" className={s.meta}>
            all patterns &rarr;
          </Link>
        </div>
        <div className={s.patternGrid}>
          {PATTERNS.map((p) => {
            const solved = p.ramp.filter((id) => progress[id] === 'solved').length
            return (
              <Link key={p.id} href={`/pattern/${p.id}`} className={s.patternCard}>
                <div className={s.cardHead}>
                  <span className={s.name}>{p.name}</span>
                  <span className={s.count}>
                    {solved} / {p.ramp.length}
                  </span>
                </div>
                <p className={s.patternTagline}>{p.tagline}</p>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
