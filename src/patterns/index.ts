import type { CodeBlock, Tracer } from '@/lib/types'
import { backtracking } from './backtracking'
import { bfs } from './bfs'
import { binarySearch } from './binary-search'
import { bit } from './bit'
import { dp } from './dp'
import { graphs } from './graphs'
import { hashing } from './hashing'
import { heap } from './heap'
import { intervals } from './intervals'
import { slidingWindow } from './sliding-window'
import { stack } from './stack'
import { treeDfs } from './tree-dfs'
import { trie } from './trie'
import { twoPointers } from './two-pointers'

/**
 * A pattern intro teaches the technique before any problem asks for it: a
 * short story, a toy demo traced through the same engine the problems use,
 * the signals that should make you reach for the pattern, and a recommended
 * ramp through this sheet's problems.
 */
export interface PatternIntro {
  /** Route slug: /pattern/<id>. */
  id: string
  name: string
  tagline: string
  /** Teaching prose, one string per paragraph. Backticks become inline code. */
  story: string[]
  /** "Reach for it when ..." tells. */
  signals: string[]
  /** One language-neutral pseudocode block, hot-line synced to the demo trace. */
  pseudo: CodeBlock
  /** Toy demo with its input baked in; runs on the standard Tracer. */
  trace: (t: Tracer) => void
  /** Problem ids from the sheet, in recommended solve order. */
  ramp: string[]
}

/** Display and rough learning order: foundations first, composites later. */
export const PATTERNS: PatternIntro[] = [
  hashing,
  twoPointers,
  slidingWindow,
  stack,
  binarySearch,
  treeDfs,
  bfs,
  graphs,
  backtracking,
  dp,
  intervals,
  heap,
  trie,
  bit,
]

export const patternById = (id: string) => PATTERNS.find((p) => p.id === id)

/** problem id -> pattern that includes it in its ramp (first wins). */
export const PATTERN_OF_PROBLEM: Record<string, PatternIntro> = {}
for (const p of PATTERNS) {
  for (const problemId of p.ramp) {
    PATTERN_OF_PROBLEM[problemId] ??= p
  }
}
