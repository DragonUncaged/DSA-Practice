'use client'

import Link from 'next/link'
import { useCallback, useMemo, useRef, useState } from 'react'
import type { Lang, Problem } from '@/lib/types'
import { useTraceStore, usePrefs, useProgress, useReveal, type RevealLevel } from '@/lib/store'
import { useTrace, useTraceKeys } from '@/lib/useTrace'
import { PATTERN_OF_PROBLEM } from '@/patterns'
import { hasTrace } from '@/problems'
import { CodePane, StatePane, Stage, Transport } from './PlayerParts'
import { CompareView } from './CompareView'
import { Practice } from './Practice'
import { ProblemSwitcher } from './ProblemSwitcher'
import s from './Player.module.scss'

type Tab = 'trace' | 'compare' | 'practice'

export function Player({ problem }: { problem: Problem }) {
  // A practice-only problem has no animation, so it opens straight on the editor.
  const traced = hasTrace(problem)
  const [tab, setTab] = useState<Tab>(traced ? 'trace' : 'practice')
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

  // --- progressive reveal ----------------------------------------------------
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
    solution && player.frame ? solution.code[prefs.lang]?.map?.[player.frame.step] : undefined
  if (hotLine != null && !(watchedMap[watchKey] ?? []).includes(hotLine)) {
    setWatchedMap((m) => ({ ...m, [watchKey]: [...(m[watchKey] ?? []), hotLine] }))
  }
  const watched = useMemo(() => new Set(watchedMap[watchKey] ?? []), [watchedMap, watchKey])

  const hasBrute = problem.solutions.some((x) => x.kind === 'brute')
  // The two informational tabs sit together; Practice is the primary action
  // and is rendered separately as a pill on the far side of the bar.
  const infoTabs: Tab[] = traced ? ['trace', ...(hasBrute ? (['compare'] as Tab[]) : [])] : []

  // Fullscreen belongs to the body, not to Practice: it hides the header and
  // tab bar so statement, editor and tests share the viewport. Esc exits
  // (handled inside Practice, which also owns the settings popover).
  const [fullscreen, setFullscreen] = useState(false)
  const isFullscreen = fullscreen && tab === 'practice'

  // --- resizable, collapsible statement rail ---------------------------------
  // Width is local only while dragging; the released width and the collapsed
  // state both live in prefs so they survive a reload.
  const [dragRailW, setDragRailW] = useState<number | null>(null)
  const railW = dragRailW ?? prefs.railW
  const dragRail = useRef<number | null>(null)
  const onRailDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      const startX = e.clientX
      const startW = prefs.railW ?? 300
      const move = (ev: PointerEvent) => {
        const w = Math.min(560, Math.max(220, startW + (ev.clientX - startX)))
        dragRail.current = w
        setDragRailW(w)
      }
      const up = () => {
        window.removeEventListener('pointermove', move)
        window.removeEventListener('pointerup', up)
        if (dragRail.current != null) setPrefs({ railW: dragRail.current })
        dragRail.current = null
        setDragRailW(null)
      }
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', up)
    },
    [prefs.railW, setPrefs],
  )
  const onRailReset = useCallback(() => setPrefs({ railW: null }), [setPrefs])
  const toggleRail = useCallback(
    () => setPrefs({ showRail: !prefs.showRail }),
    [prefs.showRail, setPrefs],
  )

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
    <div className={`${s.shell} ${isFullscreen ? s.fullscreen : ''}`}>
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
            <span>○</span> Unsolved
          </button>
        )}
      </header>

      <nav className={s.tabBar}>
        {infoTabs.map((t) => (
          <button key={t} className={`${s.tab} ${tab === t ? s.on : ''}`} onClick={() => setTab(t)}>
            {t === 'trace' ? 'Trace' : 'Brute vs Optimal'}
          </button>
        ))}
        <span className={s.grow} />
        <button
          className={`${s.practiceTab} ${tab === 'practice' ? s.on : ''}`}
          onClick={() => setTab('practice')}
          title="Solve the problem in the editor and run it against every test case"
        >
          <span aria-hidden>&#9654;</span> Practice
        </button>
      </nav>

      <div className={s.body}>
        {prefs.showRail ? (
          <>
            <InfoRail problem={problem} width={railW} onCollapse={toggleRail} />
            <div
              className={s.railDivider}
              onPointerDown={onRailDown}
              onDoubleClick={onRailReset}
              title="Drag to resize the problem statement · double-click to reset"
            />
          </>
        ) : (
          <aside className={s.railStrip}>
            <button
              className={s.railToggle}
              onClick={toggleRail}
              title="Show the problem statement"
              aria-label="Show the problem statement"
            >
              &#8250;
            </button>
            <span className={s.stripLabel}>Problem</span>
          </aside>
        )}

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
                      : 'Approach is hidden. Reveal it in the solution panel below.'}
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
          {tab === 'practice' && (
            <Practice
              problem={problem}
              lang={prefs.lang}
              onLang={setLang}
              fullscreen={isFullscreen}
              onFullscreen={setFullscreen}
            />
          )}
        </section>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------

function InfoRail({
  problem,
  width,
  onCollapse,
}: {
  problem: Problem
  width: number | null
  onCollapse: () => void
}) {
  const sample = problem.tests[0]
  const optimal = problem.solutions[0]
  const guide = PATTERN_OF_PROBLEM[problem.id]

  return (
    <aside className={s.rail} style={width != null ? { flex: `0 0 ${width}px` } : undefined}>
      <button
        className={`${s.railToggle} ${s.railCollapse}`}
        onClick={onCollapse}
        title="Hide the problem statement"
        aria-label="Hide the problem statement"
      >
        &#8249;
      </button>
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
