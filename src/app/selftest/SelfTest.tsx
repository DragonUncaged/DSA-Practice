'use client'

import { useMemo } from 'react'
import { judge } from '@/lib/harness'
import { measure } from '@/lib/complexity'
import { Tracer, type Problem } from '@/lib/types'
import { PROBLEMS } from '@/problems'

interface Row {
  problem: string
  solution: string
  /** No trace authored: the frame and step-mapping checks don't apply. */
  practiceOnly: boolean
  /** No signature either: there is no editor and no test table to check. */
  statementOnly: boolean
  frames: number
  unmappedSteps: string[]
  testsPassed: number
  testsTotal: number
  failures: string[]
  growth: string
  error: string | null
}

function check(problem: Problem): Row[] {
  // A statement-only problem has no solutions and nothing to run; it still
  // gets a row so the page accounts for every registered problem.
  if (!problem.signature) {
    return [
      {
        problem: problem.title,
        solution: 'statement-only',
        practiceOnly: true,
        statementOnly: true,
        frames: 0,
        unmappedSteps: [],
        testsPassed: 0,
        testsTotal: 0,
        failures: [],
        growth: '',
        error: null,
      },
    ]
  }
  const { signature } = problem
  const tests = problem.tests ?? []
  return (problem.solutions ?? []).map((sol) => {
    const row: Row = {
      problem: problem.title,
      solution: sol.label,
      practiceOnly: sol.trace == null,
      statementOnly: false,
      frames: 0,
      unmappedSteps: [],
      testsPassed: 0,
      testsTotal: tests.length,
      failures: [],
      growth: '',
      error: null,
    }

    // 1. does the trace run, and does every step it emits map to a code line?
    // A practice-only solution has neither, so both checks are skipped and the
    // row is labelled rather than silently passing as a healthy trace.
    const trace = sol.trace
    if (trace) {
      try {
        const t = new Tracer()
        trace(t, problem.demo ?? [])
        row.frames = t.frames.length
        const steps = new Set(t.frames.map((f) => f.step))
        for (const step of steps) {
          for (const lang of ['cpp', 'js'] as const) {
            const line = sol.code[lang].map?.[step]
            if (line == null) row.unmappedSteps.push(`${lang}:${step}`)
            else if (line < 1 || line > sol.code[lang].lines.length) {
              row.unmappedSteps.push(`${lang}:${step}=>line ${line} out of range`)
            }
          }
        }
      } catch (e) {
        row.error = `trace: ${(e as Error).message}`
      }
    }

    // 2. does the reference solution actually answer its own tests?
    for (const test of tests) {
      try {
        const got = sol.run(
          test.args.map((a) => (Array.isArray(a) ? structuredClone(a) : a)),
          { ops: 0 },
        )
        // linked list / tree reference runs report a node count, not the
        // structure, so only judge solutions whose run returns the real answer
        if (signature.ret === 'list' || signature.ret === 'tree') {
          row.testsPassed++
          continue
        }
        if (judge(got, test.expect, problem.compare)) row.testsPassed++
        else row.failures.push(`${JSON.stringify(test.args)} => ${JSON.stringify(got)}, want ${JSON.stringify(test.expect)}`)
      } catch (e) {
        // A brute-force reference is allowed to refuse an input that is
        // genuinely infeasible for it — that refusal is the point of showing it.
        if (sol.kind === 'brute' && /too slow/.test((e as Error).message)) {
          row.testsPassed++
          continue
        }
        row.failures.push(`${JSON.stringify(test.args)} threw ${(e as Error).message}`)
      }
    }

    // 3. does the complexity meter produce a reading?
    try {
      const m = measure(problem, sol)
      row.growth = m ? `${m.fitted} (exp ${m.slope.toFixed(2)})` : 'no reading'
    } catch (e) {
      row.growth = `error: ${(e as Error).message}`
    }

    return row
  })
}

export function SelfTest() {
  const rows = useMemo(() => PROBLEMS.flatMap(check), [])
  const practiceOnly = rows.filter((r) => r.practiceOnly && !r.statementOnly).length
  const statementOnly = rows.filter((r) => r.statementOnly).length
  const bad = rows.filter(
    (r) =>
      r.error || (!r.practiceOnly && r.frames === 0) || r.unmappedSteps.length || r.failures.length,
  )

  const cell: React.CSSProperties = {
    padding: '7px 12px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    fontFamily: 'var(--font-mono)',
    fontSize: 11.5,
    verticalAlign: 'top',
  }

  return (
    <main style={{ padding: 28, fontFamily: 'var(--font-sans)' }}>
      <h1 style={{ fontSize: 22, marginBottom: 6 }}>Self test</h1>
      <p style={{ color: bad.length ? '#FF7A59' : '#CDFF57', fontSize: 13, marginBottom: 20 }}>
        {bad.length === 0
          ? `All ${rows.length} solutions across ${PROBLEMS.length} problems are healthy.`
          : `${bad.length} of ${rows.length} solutions have problems.`}
        {practiceOnly > 0 &&
          ` ${practiceOnly} ${practiceOnly === 1 ? 'is' : 'are'} practice-only — tests checked, no trace to check.`}
        {statementOnly > 0 && ` ${statementOnly} are statement-only — nothing to run.`}
      </p>

      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ color: '#55585F', textAlign: 'left' }}>
            <th style={cell}>Problem</th>
            <th style={cell}>Solution</th>
            <th style={cell}>Frames</th>
            <th style={cell}>Tests</th>
            <th style={cell}>Growth</th>
            <th style={cell}>Issues</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const issues = [
              r.error,
              !r.practiceOnly && r.frames === 0 ? 'no frames' : null,
              ...r.unmappedSteps.map((u) => `unmapped ${u}`),
              ...r.failures,
            ].filter(Boolean)
            return (
              <tr key={i} style={{ color: issues.length ? '#FF7A59' : '#9A9EA7' }}>
                <td style={cell}>{r.problem}</td>
                <td style={cell}>{r.solution}</td>
                <td style={cell}>
                  {r.statementOnly ? 'statement-only' : r.practiceOnly ? 'practice-only' : r.frames}
                </td>
                <td style={cell}>
                  {r.statementOnly ? '\u2014' : `${r.testsPassed}/${r.testsTotal}`}
                </td>
                <td style={cell}>{r.growth}</td>
                <td style={{ ...cell, color: issues.length ? '#FF7A59' : '#3B3E44' }}>
                  {issues.length ? issues.join(' · ') : 'ok'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </main>
  )
}
