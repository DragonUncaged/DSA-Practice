'use client'

import dynamic from 'next/dynamic'
import type { editor as MonacoNS } from 'monaco-editor'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { buildProgram, judge, partitionOutput, prettyValue } from '@/lib/harness'
import { getDraft, useHydrated, usePrefs, useTraceStore } from '@/lib/store'
import type { Lang, PracticeProblem } from '@/lib/types'
import { runCode } from '@/runners'
import { LANGS, LANG_LABEL } from './PlayerParts'
import parts from './PlayerParts.module.scss'
import s from './Practice.module.scss'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div className={s.editorLoading}>loading editor...</div>,
})

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
  got: unknown
  want: unknown
  note?: string
}

type Line = { kind: 'out' | 'err' | 'sys'; text: string }

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
  }

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
    setRunning(true)
    setResults(null)
    const collected: Line[] = []
    const push = (kind: Line['kind'], text: string) => {
      collected.push({ kind, text })
      setLines([...collected])
    }

    const raw: string[] = []
    const io = {
      stdout: (t: string) => raw.push(...t.split('\n')),
      stderr: (t: string) => push('err', t),
      system: (t: string) => push('sys', t),
    }

    const program = buildProgram(lang, code, problem.signature, problem.tests)
    const { exitCode } = await runCode(lang, program, io)

    const { results: values, stdout } = partitionOutput(raw)
    stdout.filter((l) => l.trim()).forEach((l) => push('out', l))

    if (exitCode === 0 || values.length) {
      const cases: CaseResult[] = problem.tests.map((t, i) => ({
        index: i,
        pass: i < values.length && judge(values[i], t.expect, problem.compare),
        got: i < values.length ? values[i] : undefined,
        want: t.expect,
        note: t.note,
      }))
      setResults(cases)
      if (cases.length && cases.every((c) => c.pass)) setSolved(problem.id, 'solved')
    }

    setRunning(false)
  }, [code, lang, problem, setSolved])

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
              {tally ? `${tally.pass} / ${tally.total} passing` : `${problem.tests.length} cases`}
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

            {results?.map((r) => {
              const t = problem.tests[r.index]
              return (
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
                    <span className={s.label}>
                      {r.note ?? `Case ${r.index + 1}`}
                    </span>
                  </div>

                  {!r.pass && (
                    <div className={s.caseBody}>
                      <div className={s.row}>
                        <span className={s.key}>input</span>
                        <span className={s.val}>
                          {t.args.map((a) => prettyValue(a)).join(', ')}
                        </span>
                      </div>
                      <div className={s.row}>
                        <span className={s.key}>expected</span>
                        <span className={`${s.val} ${s.want}`}>{prettyValue(r.want)}</span>
                      </div>
                      <div className={s.row}>
                        <span className={s.key}>got</span>
                        <span className={`${s.val} ${s.got}`}>
                          {r.got === undefined
                            ? 'nothing'
                            : typeof r.got === 'object' && r.got && '__error' in r.got
                              ? String((r.got as { __error: string }).__error)
                              : prettyValue(r.got)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {lines.length > 0 && (
            <div className={s.console}>
              {lines.map((l, i) => (
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
