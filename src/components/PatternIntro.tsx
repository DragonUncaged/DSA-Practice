'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { useProgress } from '@/lib/store'
import type { Solution } from '@/lib/types'
import { useTrace, useTraceKeys } from '@/lib/useTrace'
import { byId } from '@/problems'
import { patternById } from '@/patterns'
import { StatePane, Stage, Transport } from './PlayerParts'
import s from './PatternIntro.module.scss'

/**
 * Takes the id rather than the pattern object: the pattern carries its trace
 * function, which cannot cross the server-to-client boundary from the page.
 */
export function PatternIntro({ id }: { id: string }) {
  const pattern = patternById(id)!
  const progress = useProgress()

  // The demo rides the same player stack as a problem; the adapter just
  // wraps the intro's toy trace in the Solution shape useTrace expects.
  const demoSolution = useMemo<Solution>(
    () => ({
      id: pattern.id,
      label: pattern.name,
      kind: 'optimal',
      time: '',
      space: '',
      blurb: pattern.tagline,
      code: { py: pattern.pseudo, cpp: pattern.pseudo, js: pattern.pseudo },
      trace: (t) => pattern.trace(t),
      run: () => 0,
    }),
    [pattern],
  )
  const player = useTrace(demoSolution, [])
  useTraceKeys(player)

  const hot = player.frame ? pattern.pseudo.map?.[player.frame.step] : undefined
  const solvedCount = pattern.ramp.filter((id) => progress[id] === 'solved').length
  const nextUp = pattern.ramp.find((id) => progress[id] !== 'solved') ?? pattern.ramp[0]

  return (
    <div className={s.page}>
      <header className={s.head}>
        <div className={s.kicker}>PATTERN</div>
        <h1>{pattern.name}</h1>
        <p className={s.tagline}>{pattern.tagline}</p>
      </header>

      <section className={s.story}>
        {pattern.story.map((p, i) => (
          <p key={i} dangerouslySetInnerHTML={{ __html: md(p) }} />
        ))}
      </section>

      <section className={s.demo}>
        <div className={s.demoHead}>
          <span className={s.demoTitle}>See it move</span>
          <span className={s.demoHint}>space to play · arrow keys to step</span>
        </div>
        <Stage frame={player.frame} />
        <Transport player={player} />
        <div className={s.lower}>
          <div className={s.pseudo}>
            <div className={s.paneLabel}>The shape of it</div>
            {pattern.pseudo.lines.map((src, i) => (
              <div key={i} className={`${s.line} ${hot === i + 1 ? s.hot : ''}`}>
                <span className={s.num}>{i + 1}</span>
                <span className={s.src}>{src}</span>
              </div>
            ))}
          </div>
          <StatePane frame={player.frame} />
        </div>
      </section>

      <section className={s.cols}>
        <div className={s.signals}>
          <div className={s.sectionTitle}>Reach for it when</div>
          {pattern.signals.map((sig) => (
            <div key={sig} className={s.signal}>
              <span className={s.tick}>&#9656;</span>
              <span>{sig}</span>
            </div>
          ))}
        </div>

        <div className={s.ramp}>
          <div className={s.sectionTitle}>
            The ramp
            <span className={s.rampCount}>
              {solvedCount} / {pattern.ramp.length} solved
            </span>
          </div>
          {pattern.ramp.map((id, i) => {
            const problem = byId(id)
            if (!problem) return null
            const done = progress[id] === 'solved'
            return (
              <Link key={id} href={`/p/${id}`} className={s.rampRow}>
                <span className={s.rampIndex}>{i + 1}</span>
                <span className={`${s.light} ${done ? s.on : ''}`}>{done ? '✓' : ''}</span>
                <span className={`${s.rampTitle} ${done ? s.done : ''}`}>{problem.title}</span>
                <span className={`${s.diff} ${s[problem.difficulty.toLowerCase()]}`}>
                  {problem.difficulty}
                </span>
              </Link>
            )
          })}
          {nextUp && (
            <Link href={`/p/${nextUp}`} className={s.cta}>
              {solvedCount === 0 ? 'Start the ramp' : 'Continue the ramp'} <span>&rarr;</span>
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}

/** Backticks become inline code, asterisks become emphasis. Authored strings, not user input. */
function md(p: string) {
  return p
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
}
