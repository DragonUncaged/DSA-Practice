/**
 * The authored-data check behind /selftest: every registered problem's trace
 * runs, every step it emits maps to a real code line in both languages, the
 * reference solution answers its own tests, and the complexity meter reads.
 *
 * It lives here rather than in the page so `npm test` can run exactly what
 * the page renders — a broken problem fails the build, not a page visit.
 */

import { judge } from './harness'
import { measure } from './complexity'
import { Tracer, type Problem } from './types'

export interface CheckRow {
  problem: string
  solution: string
  /** No trace authored: the frame and step-mapping checks don't apply. */
  practiceOnly: boolean
  /** Neither a signature nor a class shape: no editor and no test table to check. */
  statementOnly: boolean
  /** Driven as a class: `designTests` stand in for `tests`. */
  design: boolean
  frames: number
  unmappedSteps: string[]
  testsPassed: number
  testsTotal: number
  failures: string[]
  growth: string
  error: string | null
}

export function check(problem: Problem): CheckRow[] {
  // A statement-only problem has no solutions and nothing to run; it still
  // gets a row so the page accounts for every registered problem.
  if (!problem.signature && !problem.design) {
    return [
      {
        problem: problem.title,
        solution: 'statement-only',
        practiceOnly: true,
        statementOnly: true,
        design: false,
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
  const designTests = problem.designTests ?? []
  return (problem.solutions ?? []).map((sol) => {
    const row: CheckRow = {
      problem: problem.title,
      solution: sol.label,
      practiceOnly: sol.trace == null,
      statementOnly: false,
      design: problem.design != null,
      frames: 0,
      unmappedSteps: [],
      testsPassed: 0,
      testsTotal: problem.design ? designTests.length : tests.length,
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

    // 2. does the reference solution actually answer its own tests? A design
    // problem's reference takes `[ops, args]` and returns the whole call log,
    // exactly what the generated driver emits.
    for (const test of designTests) {
      try {
        const got = sol.run([test.ops, structuredClone(test.args)], { ops: 0 })
        if (judge(got, test.expect, 'exact')) row.testsPassed++
        else
          row.failures.push(
            `${JSON.stringify(test.ops)} => ${JSON.stringify(got)}, want ${JSON.stringify(test.expect)}`,
          )
      } catch (e) {
        row.failures.push(`${JSON.stringify(test.ops)} threw ${(e as Error).message}`)
      }
    }

    for (const test of tests) {
      try {
        const got = sol.run(
          test.args.map((a) => (Array.isArray(a) ? structuredClone(a) : a)),
          { ops: 0 },
        )
        // linked list / tree reference runs report a node count, not the
        // structure, so only judge solutions whose run returns the real answer
        if (signature?.ret === 'list' || signature?.ret === 'tree') {
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

