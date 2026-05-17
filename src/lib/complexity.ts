/**
 * Authoring-time growth check, used by /selftest only. It catches a solution
 * whose measured growth contradicts the Big-O printed next to it — the kind of
 * mistake that is invisible when reading the code.
 */

import type { Counter, Problem, Solution } from './types'

export interface Sample {
  n: number
  ops: number
}

export interface Measurement {
  solutionId: string
  label: string
  claimed: string
  samples: Sample[]
  /** Slope of log(ops) against log(n) — the growth exponent. */
  slope: number
  /** Human reading of that slope. */
  fitted: string
  /** How confident the fit is (r^2 of the log-log regression). */
  fit: number
}

const SIZES = [8, 16, 32, 64, 128, 256, 512, 1024, 2048]

/** Ceiling on total simulated work, so a cubic solution can't lock the tab. */
const OPS_BUDGET = 40_000_000

/**
 * Measures growth empirically rather than parsing the source. We run the real
 * solution at increasing input sizes and count the operations it actually
 * performs, then read the exponent off a log-log fit.
 */
export function measure(problem: Problem, solution: Solution): Measurement | null {
  if (!problem.scale) return null

  const samples: Sample[] = []
  let spent = 0

  for (const n of SIZES) {
    const args = problem.scale(n)
    const c: Counter = { ops: 0 }
    try {
      solution.run(args, c)
    } catch {
      break // a solution that can't handle this size just stops contributing points
    }
    samples.push({ n, ops: c.ops })
    spent += c.ops
    if (spent > OPS_BUDGET) break
  }

  if (samples.length < 3) return null

  const { slope, r2 } = logLogFit(samples)
  return {
    solutionId: solution.id,
    label: solution.label,
    claimed: solution.time,
    samples,
    slope,
    fitted: exponential(samples) ? 'exponential' : describe(slope),
    fit: r2,
  }
}

/**
 * Polynomial growth and exponential growth both look "steep" on a log-log plot,
 * so the exponent alone can't tell them apart. For ops ~ c^n, log(ops) is
 * linear in n, which means log(log ops) plotted against log(n) has slope ~1.
 * For any polynomial it tends to 0.
 */
function exponential(samples: Sample[]): boolean {
  const pts = samples
    .filter((s) => s.ops > 4)
    .map((s) => ({ x: Math.log(s.n), y: Math.log(Math.log(s.ops)) }))
  if (pts.length < 3) return false

  const n = pts.length
  const mx = pts.reduce((a, p) => a + p.x, 0) / n
  const my = pts.reduce((a, p) => a + p.y, 0) / n
  let num = 0
  let den = 0
  for (const p of pts) {
    num += (p.x - mx) * (p.y - my)
    den += (p.x - mx) ** 2
  }
  return den !== 0 && num / den > 0.8
}

/** Least-squares line through (log n, log ops). Its slope is the exponent. */
function logLogFit(samples: Sample[]) {
  const pts = samples.filter((s) => s.ops > 0).map((s) => ({ x: Math.log(s.n), y: Math.log(s.ops) }))
  if (pts.length < 2) return { slope: 0, r2: 0 }

  const n = pts.length
  const mx = pts.reduce((a, p) => a + p.x, 0) / n
  const my = pts.reduce((a, p) => a + p.y, 0) / n

  let num = 0
  let den = 0
  for (const p of pts) {
    num += (p.x - mx) * (p.y - my)
    den += (p.x - mx) ** 2
  }
  const slope = den === 0 ? 0 : num / den
  const intercept = my - slope * mx

  let ssRes = 0
  let ssTot = 0
  for (const p of pts) {
    ssRes += (p.y - (slope * p.x + intercept)) ** 2
    ssTot += (p.y - my) ** 2
  }
  return { slope, r2: ssTot === 0 ? 1 : 1 - ssRes / ssTot }
}

/**
 * Maps a measured exponent onto the complexity class a reader expects.
 * n log n sits at roughly 1.1–1.2 over this range of n, which is why the
 * linear band has to stop short of it.
 */
function describe(slope: number): string {
  if (slope < 0.15) return 'O(1)'
  if (slope < 0.55) return 'O(log n)'
  if (slope < 1.08) return 'O(n)'
  if (slope < 1.35) return 'O(n log n)'
  if (slope < 1.75) return 'between O(n log n) and O(n^2)'
  if (slope < 2.3) return 'O(n^2)'
  if (slope < 3.3) return 'O(n^3)'
  return 'worse than cubic'
}
