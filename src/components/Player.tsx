'use client'

import Link from 'next/link'
import { useCallback, useMemo, useRef, useState } from 'react'
import type { Lang, Problem } from '@/lib/types'
import { useTraceStore, usePrefs, useProgress, useReveal, type RevealLevel } from '@/lib/store'
import { useTrace, useTraceKeys } from '@/lib/useTrace'
import { PATTERN_OF_PROBLEM } from '@/patterns'
import { CodePane, StatePane, Stage, Transport } from './PlayerParts'
import { CompareView } from './CompareView'
import { Practice } from './Practice'
import { ProblemSwitcher } from './ProblemSwitcher'
import s from './Player.module.scss'

type Tab = 'trace' | 'compare' | 'practice'

const TAB_HINT: Record<Tab, string> = {
  trace: 'space to play  ·  arrow keys to step',
  compare: 'both run on the same input, step for step',
  practice: 'run your own solution against the tests',
}

export function Player({ problem }: { problem: Problem }) {
  const [tab, setTab] = useState<Tab>('trace')
  const [solutionId, setSolutionId] = useState(problem.solutions[0]?.id)

  const prefs = usePrefs()
  const progress = useProgress()
  const solved = progress[problem.id] === 'solved'

  const solution = useMemo(
    () => problem.solutions.find((x) => x.id === solutionId) ?? problem.solutions[0],
    [problem, solutionId],
  )

  const player = useTrace(solution, problem.demo)
  // keyboard scrubbing belongs to the trace tab only; elsewhere space is typing
  useTraceKeys(player, tab === 'trace')

  const setPrefs = useTraceStore((st) => st.setPrefs)
  const setLang = useCallback((l: Lang) => setPrefs({ lang: l }), [setPrefs])

  // --- fog of code -----------------------------------------------------------
  const revealLevel: RevealLevel = useReveal()[problem.id] ?? 0
  const setRevealLevel = useTraceStore((st) => st.setRevealLevel)
  const onRevealLevel = useCallback(
    (l: RevealLevel) => setRevealLevel(problem.id, l),
    [setRevealLevel, problem.id],
  )

  // Lines earned by watching, keyed per solution+language for this session.
  // Accumulated with the adjust-during-render pattern rather than an effect.
  const [watchedMap, setWatchedMap] = useState<Record<string, number[]>>({})
  const watchKey = `${solution?.id ?? ''}:${prefs.lang}`
  const hotLine =
    solution && player.frame ? solution.code[prefs.lang]?.map[player.frame.step] : undefined
  if (hotLine != null && !(watchedMap[watchKey] ?? []).includes(hotLine)) {
    setWatchedMap((m) => ({ ...m, [watchKey]: [...(m[watchKey] ?? []), hotLine] }))
  }
  const watched = useMemo(() => new Set(watchedMap[watchKey] ?? []), [watchedMap, watchKey])

  const hasBrute = problem.solutions.some((x) => x.kind === 'brute')
  const tabs: Tab[] = ['trace', ...(hasBrute ? (['compare'] as Tab[]) : []), 'practice']

  // --- draggable stage/solution split ---------------------------------------
  // Dragging the transport bar trades animation height for solution height.
  // Local state during the drag; the chosen height persists via prefs on release.
  const [codeH, setCodeH] = useState<number | null>(prefs.codeH)
  const dragCodeH = useRef<number | null>(null)
  const onSplitDown = useCallback(
    (e: React.PointerEvent) => {
      if ((e.target as HTMLElement).closest('button, [role="slider"], input')) return
      e.preventDefault()
      const startY = e.clientY
      const startH = codeH ?? 218
      const move = (ev: PointerEvent) => {
        const h = Math.min(560, Math.max(120, startH - (ev.clientY - startY)))
        dragCodeH.current = h
        setCodeH(h)
      }
      const up = () => {
        window.removeEventListener('pointermove', move)
        window.removeEventListener('pointerup', up)
        if (dragCodeH.current != null) setPrefs({ codeH: dragCodeH.current })
      }
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', up)
    },
    [codeH, setPrefs],
  )
  const onSplitReset = useCallback(() => {
    setCodeH(null)
    setPrefs({ codeH: null })
  }, [setPrefs])

  return (
    <div className={s.shell}>
      <header className={s.head}>
        <Link href="/practice" className={s.back} aria-label="Back to the problem list">
          &#8592;
        </Link>

        <ProblemSwitcher currentId={problem.id} />

        <div className={s.titleBlock}>
          <div className={s.eyebrow}>
            {problem.group.toUpperCase()} &middot; {problem.pattern.toUpperCase()}
          </div>
          <h1 className={s.title}>{problem.title}</h1>
        </div>

        <div className={s.chips}>
          <span className={`${s.chip} ${s[problem.difficulty.toLowerCase()]}`}>
            {problem.difficulty.toUpperCase()}
          </span>
          {solution && (
            <>
              <span className={s.chip}>TIME {solution.time}</span>
              <span className={s.chip}>SPACE {solution.space}</span>
            </>
          )}
        </div>

        <span className={s.grow} />

        {solved ? (
          <span className={`${s.solveBtn} ${s.on} ${s.earnedBadge}`} title="Every test case passed">
            <span>✓</span> Solved
          </span>
        ) : (
          <button
            className={s.solveBtn}
            onClick={() => setTab('practice')}
            title="Solved status is earned: run your code in Practice and pass every test case"
          >
            <span>○</span> Pass the tests to solve
          </button>
        )}
      </header>

      <nav className={s.tabBar}>
        {tabs.map((t) => (
          <button key={t} className={`${s.tab} ${tab === t ? s.on : ''}`} onClick={() => setTab(t)}>
            {t === 'trace' ? 'Trace' : t === 'compare' ? 'Brute vs Optimal' : 'Practice'}
          </button>
        ))}
        <span className={s.tabHint}>{TAB_HINT[tab]}</span>
      </nav>

      <div className={s.body}>
        <InfoRail problem={problem} />

        <section className={s.main}>
          {tab === 'trace' && (
            <>
              {problem.solutions.length > 1 && (
                <div className={s.solutionSwitch}>
                  <div className={s.picker}>
                    {problem.solutions.map((x) => (
                      <button
                        key={x.id}
                        className={`${s.pick} ${x.id === solution?.id ? s.on : ''}`}
                        onClick={() => setSolutionId(x.id)}
                      >
                        {x.label}
                      </button>
                    ))}
                  </div>
                  <p className={s.blurb}>
                    {revealLevel >= 1
                      ? solution?.blurb
                      : 'Approach under fog — lift it in the solution panel below.'}
                  </p>
                </div>
              )}

              <Stage frame={player.frame} />
              <div
                className={s.splitHandle}
                onPointerDown={onSplitDown}
                onDoubleClick={onSplitReset}
                title="Drag to trade animation space for solution space · double-click to reset"
              >
                <div className={s.grip}>
                  <span />
                </div>
                <Transport player={player} />
              </div>
              <CodePane
                solution={solution}
                lang={prefs.lang}
                onLang={setLang}
                step={player.frame?.step}
                revealLevel={revealLevel}
                onRevealLevel={onRevealLevel}
                watched={watched}
                height={codeH}
              >
                <StatePane frame={player.frame} />
              </CodePane>
            </>
          )}

          {tab === 'compare' && <CompareView problem={problem} lang={prefs.lang} />}
          {tab === 'practice' && <Practice problem={problem} lang={prefs.lang} onLang={setLang} />}
        </section>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------

function InfoRail({ problem }: { problem: Problem }) {
  const sample = problem.tests[0]
  const optimal = problem.solutions[0]
  const guide = PATTERN_OF_PROBLEM[problem.id]

  return (
    <aside className={s.rail}>
      <div className={s.railSection}>
        <div className={s.railTitle}>Problem</div>
        <p dangerouslySetInnerHTML={{ __html: renderStatement(problem.statement) }} />
      </div>

      {guide && (
        <Link href={`/pattern/${guide.id}`} className={s.guideLink}>
          <span className={s.guideLabel}>
            New to this? <strong>{guide.name}</strong> explained first
          </span>
          <span>&rarr;</span>
        </Link>
      )}

      <div className={s.railSection}>
        <div className={s.railTitle}>Constraints</div>
        {problem.constraints.map((c) => (
          <div key={c} className={s.constraint}>
            <span className={s.dot}>&middot;</span>
            <span>{c}</span>
          </div>
        ))}
      </div>

      {optimal && (
        <div className={s.railSection}>
          <div className={s.railTitle}>Optimal complexity</div>
          <div className={s.bigStats}>
            <div className={s.stat}>
              <span className={s.statLabel}>Time</span>
              <span className={s.statValue}>{optimal.time}</span>
            </div>
            <div className={s.stat}>
              <span className={s.statLabel}>Space</span>
              <span className={s.statValue}>{optimal.space}</span>
            </div>
          </div>
        </div>
      )}

      {sample && (
        <div className={s.railSection}>
          <div className={s.railTitle}>Example</div>
          <div className={s.io}>
            {problem.signature.params.map((p, i) => (
              <div key={p.name}>
                <span className={s.ioKey}>{p.name}</span> = {JSON.stringify(sample.args[i])}
              </div>
            ))}
            <div className={s.ioOut}>&rarr; {JSON.stringify(sample.expect)}</div>
          </div>
        </div>
      )}

      {problem.leetcode && (
        <a className={s.railLink} href={problem.leetcode} target="_blank" rel="noreferrer">
          <span>Source &middot; LeetCode</span>
          <span>&#8599;</span>
        </a>
      )}
    </aside>
  )
}

/** Backtick spans in a statement become inline code. Input is authored by us, not users. */
function renderStatement(md: string) {
  return md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
}
