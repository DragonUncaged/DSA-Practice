'use client'

import dynamic from 'next/dynamic'
import type { editor as MonacoNS } from 'monaco-editor'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { buildDesignProgram, buildProgram, judge, partitionOutput, prettyValue } from '@/lib/harness'
import { getDraft, useHydrated, usePrefs, useTraceStore } from '@/lib/store'
import { isDesign } from '@/problems'
import type { DesignTestCase, Lang, PracticeProblem } from '@/lib/types'
import { runCode } from '@/runners'
import { LANGS, LANG_LABEL } from './PlayerParts'
import parts from './PlayerParts.module.scss'
import s from './Practice.module.scss'

/**
 * Monaco itself is fetched from a CDN at runtime; pinning the path here keeps
 * it on the same version as the `monaco-editor` package the types come from,
 * instead of whatever the loader defaults to. Configured inside the dynamic
 * import so it is set before the component can call `loader.init()`.
 */
const MONACO_VS = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.56.0/min/vs'

const MonacoEditor = dynamic(
  () =>
    import('@monaco-editor/react').then((mod) => {
      mod.loader.config({ paths: { vs: MONACO_VS } })
      return mod.default
    }),
  { ssr: false, loading: () => <EditorLoading /> },
)

/** How long the editor may sit on "loading" before we admit it is not coming. */
const EDITOR_TIMEOUT_MS = 15_000

/** The CDN can simply not answer; say so rather than spinning forever. */
function EditorLoading() {
  const [slow, setSlow] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setSlow(true), EDITOR_TIMEOUT_MS)
    return () => clearTimeout(t)
  }, [])
  if (!slow) return <div className={s.editorLoading}>loading editor...</div>
  return (
    <div className={s.editorLoading}>
      <span>
        The editor could not be loaded from the CDN.{' '}
        <button className={s.ghostBtn} onClick={() => window.location.reload()}>
          Retry
        </button>
      </span>
    </div>
  )
}

const MONACO_LANG: Record<Lang, string> = { cpp: 'cpp', js: 'javascript' }

/** Monaco only ships a formatter with its TypeScript/JavaScript worker. */
const CAN_FORMAT = new Set<Lang>(['js'])

const FONT_SIZES = [11, 12, 13, 14, 16, 18]
const TAB_SIZES = [2, 4, 8]

const IconFormat = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor"
       strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 5h16M9 10h11M9 15h11M4 20h16M4 10l2.5 2.5L4 15" />
  </svg>
)

const IconMaximize = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor"
       strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
  </svg>
)

const IconMinimize = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor"
       strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
  </svg>
)

const IconSettings = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor"
       strokeWidth="1.9" strokeLinecap="round" aria-hidden>
    <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
    <circle cx="16" cy="7" r="2" />
    <circle cx="10" cy="17" r="2" />
  </svg>
)

interface CaseResult {
  index: number
  pass: boolean
  /** Function view: the arguments the case was called with. */
  args?: unknown[]
  got: unknown
  want: unknown
  note?: string
  /** Design view: the call log, so a failure points at the op that broke. */
  ops?: OpResult[]
}

interface OpResult {
  op: string
  args: unknown[]
  want: unknown
  got: unknown
  pass: boolean
}

/**
 * A design case is judged as a whole result list, but read op by op: the list
 * is unzipped against `ops` so a failure names the call that produced it.
 */
function designCase(t: DesignTestCase, index: number, value: unknown): CaseResult {
  const got = Array.isArray(value) ? (value as unknown[]) : []
  return {
    index,
    pass: value !== undefined && judge(value, t.expect, 'exact'),
    got: value,
    want: t.expect,
    ops: t.ops.map((op, k) => ({
      op,
      args: t.args[k] ?? [],
      want: k < t.expect.length ? t.expect[k] : null,
      got: k < got.length ? got[k] : undefined,
      pass: k < got.length && judge(got[k], k < t.expect.length ? t.expect[k] : null, 'exact'),
    })),
  }
}

type Line = { kind: 'out' | 'err' | 'sys'; text: string }

/**
 * How much of the console is rendered. A program that prints in a loop can
 * emit thousands of lines before the runner's own cap stops it, and one
 * <div> per line is what actually costs the tab; the tail is the part anyone
 * reads, and the count above it says what was left out.
 */
const CONSOLE_TAIL = 500

/**
 * Runner messages — a timeout, the truncation notice — are the whole point of
 * the console when a program misbehaves, so they are kept even when the
 * printing that buried them is not.
 */
const CONSOLE_NOTICES = 20

/** A run that threw reports its message where the value would have been. */
const gotText = (got: unknown): string =>
  got === undefined
    ? 'nothing'
    : typeof got === 'object' && got && '__error' in got
      ? String((got as { __error: string }).__error)
      : prettyValue(got)

export function Practice({
  problem,
  lang,
  onLang,
  fullscreen,
  onFullscreen,
}: {
  problem: PracticeProblem
  lang: Lang
  onLang: (l: Lang) => void
  /** Owned by Player: fullscreen hides the site chrome around the whole body. */
  fullscreen: boolean
  onFullscreen: (on: boolean) => void
}) {
  const hydrated = useHydrated()
  const setDraft = useTraceStore((st) => st.setDraft)
  const clearDraft = useTraceStore((st) => st.clearDraft)
  const setSolved = useTraceStore((st) => st.setSolved)
  const setPrefs = useTraceStore((st) => st.setPrefs)
  const prefs = usePrefs()

  const editorRef = useRef<MonacoNS.IStandaloneCodeEditor | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const settingsWrap = useRef<HTMLDivElement | null>(null)

  const format = useCallback(() => {
    const ed = editorRef.current
    if (!ed) return
    void ed.getAction('editor.action.formatDocument')?.run()
    ed.focus()
  }, [])

  // Escape closes the settings popover first, then leaves fullscreen, so one
  // key never does two things at once.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (settingsOpen) setSettingsOpen(false)
      else if (fullscreen) onFullscreen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [fullscreen, onFullscreen, settingsOpen])

  useEffect(() => {
    if (!settingsOpen) return
    const onDown = (e: PointerEvent) => {
      if (!settingsWrap.current?.contains(e.target as Node)) setSettingsOpen(false)
    }
    window.addEventListener('pointerdown', onDown)
    return () => window.removeEventListener('pointerdown', onDown)
  }, [settingsOpen])

  // Draggable divider: compress or widen the test-case panel. Local while
  // dragging, persisted on release.
  const [resultsW, setResultsW] = useState<number | null>(prefs.resultsW)
  const dragW = useRef<number | null>(null)
  const onDividerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      const startX = e.clientX
      const startW = resultsW ?? 380
      const move = (ev: PointerEvent) => {
        const w = Math.min(620, Math.max(170, startW - (ev.clientX - startX)))
        dragW.current = w
        setResultsW(w)
      }
      const up = () => {
        window.removeEventListener('pointermove', move)
        window.removeEventListener('pointerup', up)
        if (dragW.current != null) setPrefs({ resultsW: dragW.current })
      }
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', up)
    },
    [resultsW, setPrefs],
  )
  const onDividerReset = useCallback(() => {
    setResultsW(null)
    setPrefs({ resultsW: null })
  }, [setPrefs])

  const [code, setCode] = useState<string>(() => getDraft(problem.id, lang) ?? problem.starter[lang])
  const [running, setRunning] = useState(false)
  /** Identifies the run in flight; a switch mid-run retires it. */
  const runId = useRef(0)
  const [results, setResults] = useState<CaseResult[] | null>(null)
  const [lines, setLines] = useState<Line[]>([])

  // Switching problem or language swaps in that pair's saved draft and clears
  // the previous run; so does the moment saved drafts finish loading, since
  // the first render only ever sees the starter code. Adjusting state during
  // render is React's documented alternative to doing this in an effect.
  const pair = `${problem.id}:${lang}:${hydrated}`
  const [prevPair, setPrevPair] = useState(pair)
  if (pair !== prevPair) {
    setPrevPair(pair)
    setCode(getDraft(problem.id, lang) ?? problem.starter[lang])
    setResults(null)
    setLines([])
    setRunning(false)
  }

  // A run still in flight belongs to the pair we just left: retiring its id
  // means its output and its verdict land nowhere.
  useEffect(() => {
    runId.current++
  }, [problem.id, lang, hydrated])

  const onChange = useCallback(
    (value: string | undefined) => {
      const next = value ?? ''
      setCode(next)
      setDraft(problem.id, lang, next)
    },
    [setDraft, problem.id, lang],
  )

  const reset = useCallback(() => {
    clearDraft(problem.id, lang)
    setCode(problem.starter[lang])
    setResults(null)
    setLines([])
  }, [clearDraft, problem, lang])

  const run = useCallback(async () => {
    const id = ++runId.current
    setRunning(true)
    setResults(null)
    setLines([])

    // `collected` is the source of truth for the whole run; state gets one
    // flush at the end, plus at most one repaint per frame while the program
    // is still writing. Copying the array into state per line was O(n²) and
    // was what actually froze the tab on a printing loop.
    const collected: Line[] = []
    let frame = 0
    const paint = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        if (runId.current === id) setLines(collected.slice())
      })
    }
    const push = (kind: Line['kind'], text: string) => {
      collected.push({ kind, text })
      paint()
    }

    const raw: string[] = []
    const io = {
      stdout: (t: string) => {
        for (const line of t.split('\n')) raw.push(line)
      },
      stderr: (t: string) => push('err', t),
      system: (t: string) => push('sys', t),
    }

    try {
      // one editor, two runner shapes: a design problem is driven as a class,
      // every other practice problem as a single function
      const program = isDesign(problem)
        ? buildDesignProgram(lang, code, problem.design, problem.designTests)
        : buildProgram(lang, code, problem.signature, problem.tests)
      const { exitCode } = await runCode(lang, program, io)

      // The problem or language changed while this was running: everything
      // below would describe the wrong pair.
      if (runId.current !== id) return

      const { results: values, stdout } = partitionOutput(raw)
      for (const line of stdout) if (line.trim()) collected.push({ kind: 'out', text: line })
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      setLines(collected)

      if (exitCode === 0 || values.length) {
        const cases: CaseResult[] = isDesign(problem)
          ? problem.designTests.map((t, i) =>
              designCase(t, i, i < values.length ? values[i] : undefined),
            )
          : problem.tests.map((t, i) => ({
              index: i,
              pass: i < values.length && judge(values[i], t.expect, problem.compare),
              args: t.args,
              got: i < values.length ? values[i] : undefined,
              want: t.expect,
              note: t.note,
            }))
        setResults(cases)
        if (cases.length && cases.every((c) => c.pass)) setSolved(problem.id, 'solved')
      }
    } finally {
      // Whatever went wrong — a storage write, a runner throwing — the Run
      // button comes back. Only this run may clear it.
      if (runId.current === id) setRunning(false)
    }
  }, [code, lang, problem, setSolved])

  const caseCount = isDesign(problem) ? problem.designTests.length : problem.tests.length

  // What the console actually renders: kept notices, a count of what was
  // dropped, and the tail.
  const consoleView = useMemo(() => {
    if (lines.length <= CONSOLE_TAIL) return { notices: [], hidden: 0, tail: lines }
    const cut = lines.length - CONSOLE_TAIL
    const notices = lines
      .slice(0, cut)
      .filter((l) => l.kind !== 'out')
      .slice(-CONSOLE_NOTICES)
    return { notices, hidden: cut - notices.length, tail: lines.slice(-CONSOLE_TAIL) }
  }, [lines])

  const tally = useMemo(() => {
    if (!results) return null
    return { pass: results.filter((r) => r.pass).length, total: results.length }
  }, [results])

  return (
    <div className={s.wrap}>
      <div className={s.bar}>
        <button className={s.runBtn} onClick={run} disabled={running}>
          {running ? <span className={s.spinner} /> : <span>&#9654;</span>}
          {running ? 'Running' : 'Run tests'}
        </button>
        <button className={s.ghostBtn} onClick={reset}>
          Reset code
        </button>

        <div className={parts.segmented}>
          {LANGS.map((l) => (
            <button
              key={l}
              className={`${parts.seg} ${lang === l ? parts.on : ''}`}
              onClick={() => onLang(l)}
            >
              {LANG_LABEL[l]}
            </button>
          ))}
        </div>

        {/* The browser cannot compile C++, so this code leaves the machine. */}
        {lang === 'cpp' && (
          <span className={s.langNote}>
            C++ is compiled on Compiler Explorer (godbolt.org); your code is sent there to run.
          </span>
        )}

        <span className={s.spacer} />

        <button
          className={s.iconBtn}
          onClick={format}
          disabled={!CAN_FORMAT.has(lang)}
          title={
            CAN_FORMAT.has(lang)
              ? 'Format code'
              : `No formatter for ${LANG_LABEL[lang]}. Formatting is JavaScript only.`
          }
          aria-label="Format code"
        >
          <IconFormat />
        </button>

        <button
          className={s.iconBtn}
          onClick={() => onFullscreen(!fullscreen)}
          title={fullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen'}
          aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {fullscreen ? <IconMinimize /> : <IconMaximize />}
        </button>

        <div className={s.settingsWrap} ref={settingsWrap}>
          <button
            className={`${s.iconBtn} ${settingsOpen ? s.iconOn : ''}`}
            onClick={() => setSettingsOpen((v) => !v)}
            title="Editor settings"
            aria-label="Editor settings"
            aria-expanded={settingsOpen}
          >
            <IconSettings />
          </button>

          {settingsOpen && (
            <div className={s.settings} role="dialog" aria-label="Editor settings">
              <label className={s.setting}>
                <span>Font size</span>
                <select
                  value={prefs.editorFontSize}
                  onChange={(e) => setPrefs({ editorFontSize: Number(e.target.value) })}
                >
                  {FONT_SIZES.map((n) => (
                    <option key={n} value={n}>
                      {n}px
                    </option>
                  ))}
                </select>
              </label>

              <label className={s.setting}>
                <span>Tab size</span>
                <select
                  value={prefs.editorTabSize ?? 'auto'}
                  onChange={(e) =>
                    setPrefs({
                      editorTabSize: e.target.value === 'auto' ? null : Number(e.target.value),
                    })
                  }
                >
                  <option value="auto">Match language</option>
                  {TAB_SIZES.map((n) => (
                    <option key={n} value={n}>
                      {n} spaces
                    </option>
                  ))}
                </select>
              </label>

              <div className={s.setting}>
                <span>Word wrap</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={prefs.editorWordWrap}
                  aria-label="Word wrap"
                  className={`${s.toggle} ${prefs.editorWordWrap ? s.toggleOn : ''}`}
                  onClick={() => setPrefs({ editorWordWrap: !prefs.editorWordWrap })}
                >
                  <span className={s.knob} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={s.split}>
        <div className={s.editor}>
          <MonacoEditor
            height="100%"
            language={MONACO_LANG[lang]}
            theme="vs-dark"
            value={code}
            onChange={onChange}
            onMount={(ed) => {
              editorRef.current = ed
            }}
            options={{
              fontSize: prefs.editorFontSize,
              fontFamily: 'var(--font-mono), monospace',
              fontLigatures: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              padding: { top: 14, bottom: 14 },
              tabSize: prefs.editorTabSize ?? 2,
              wordWrap: prefs.editorWordWrap ? 'on' : 'off',
              renderLineHighlight: 'all',
              smoothScrolling: true,
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
              overviewRulerBorder: false,
              automaticLayout: true,
            }}
          />
        </div>

        <div
          className={s.divider}
          onPointerDown={onDividerDown}
          onDoubleClick={onDividerReset}
          title="Drag to resize the test-case panel · double-click to reset"
        />
        <div className={s.results} style={resultsW != null ? { flex: `0 0 ${resultsW}px` } : undefined}>
          <div className={s.resultsHead}>
            <span className={s.title}>Test cases</span>
            <span className={s.spacer} />
            <span
              className={`${s.tally} ${
                !tally ? s.idle : tally.pass === tally.total ? s.pass : s.fail
              }`}
            >
              {tally ? `${tally.pass} / ${tally.total} passing` : `${caseCount} cases`}
            </span>
          </div>

          <div className={s.resultsBody}>
            {!results && !running && (
              <div className={s.empty}>
                Write your solution, then run it against every case.
                <br />
                Passing all of them marks the problem solved.
              </div>
            )}

            {results?.map((r) => (
              <div key={r.index} className={`${s.case} ${r.pass ? s.ok : s.no}`}>
                <div className={s.caseHead}>
                  <span
                    className={s.mark}
                    style={{
                      background: r.pass ? 'rgba(205,255,87,0.16)' : 'rgba(255,122,89,0.16)',
                      color: r.pass ? '#CDFF57' : '#FF7A59',
                    }}
                  >
                    {r.pass ? '✓' : '✕'}
                  </span>
                  <span className={s.label}>{r.note ?? `Case ${r.index + 1}`}</span>
                </div>

                {!r.pass &&
                  (r.ops ? (
                    <div className={s.caseBody}>
                      <div className={`${s.opRow} ${s.opHead}`}>
                        <span className={s.op}>call</span>
                        <span className={s.val}>expected</span>
                        <span className={s.val}>got</span>
                      </div>
                      {r.ops.map((o, k) => (
                        <div key={k} className={`${s.opRow} ${o.pass ? '' : s.opNo}`}>
                          <span className={s.op}>
                            {o.op}({o.args.map((a) => prettyValue(a)).join(', ')})
                          </span>
                          <span className={`${s.val} ${s.want}`}>{prettyValue(o.want)}</span>
                          <span className={`${s.val} ${s.got}`}>{gotText(o.got)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={s.caseBody}>
                      <div className={s.row}>
                        <span className={s.key}>input</span>
                        <span className={s.val}>
                          {(r.args ?? []).map((a) => prettyValue(a)).join(', ')}
                        </span>
                      </div>
                      <div className={s.row}>
                        <span className={s.key}>expected</span>
                        <span className={`${s.val} ${s.want}`}>{prettyValue(r.want)}</span>
                      </div>
                      <div className={s.row}>
                        <span className={s.key}>got</span>
                        <span className={`${s.val} ${s.got}`}>{gotText(r.got)}</span>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>

          {lines.length > 0 && (
            <div className={s.console}>
              {consoleView.notices.map((l, i) => (
                <div key={`n${i}`} className={s[l.kind]}>
                  {l.text}
                </div>
              ))}
              {consoleView.hidden > 0 && (
                <div className={s.sys}>{consoleView.hidden} earlier lines</div>
              )}
              {consoleView.tail.map((l, i) => (
                <div key={i} className={s[l.kind]}>
                  {l.text}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
