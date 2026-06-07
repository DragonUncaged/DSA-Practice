/**
 * The trace model.
 *
 * A problem's reference solution is written once, with `t.push(...)` calls
 * sprinkled through it. Running it produces an array of Frames, and a Frame is
 * a complete snapshot of the algorithm's state — which is why stepping
 * backwards works for free and why the scrub bar can jump anywhere.
 *
 * Renderers are generic and keyed off `View.kind`, so adding a problem never
 * means writing drawing code unless it needs a genuinely new shape.
 */

export type Lang = 'cpp' | 'js'
export type Difficulty = 'Easy' | 'Medium' | 'Hard'

/** Per-element emphasis. Renderers map these onto colours consistently. */
export type Tone =
  | 'idle' // outside the region of interest
  | 'dim' // discarded, no longer reachable
  | 'band' // inside the active window
  | 'active' // being read right now
  | 'good' // confirmed part of the answer
  | 'bad' // rejected this step
  | 'done' // already processed
  | 'accent' // the answer itself

/** Pointer / variable identity colours. `a` and `b` are the two-pointer pair. */
export type Accent = 'a' | 'b' | 'c' | 'ok' | 'no' | 'mute'

export type Cell = number | string

export interface Pointer {
  name: string
  /** Index into the view's data, or null to park the pointer off-stage. */
  at: number | null
  accent?: Accent
  /** Vertical lane, so two pointers on the same index don't collide. */
  lane?: number
}

export interface ArrayView {
  kind: 'array'
  data: Cell[]
  /** Stable identities, so reordering animates as movement rather than a value swap. */
  ids?: number[]
  tones?: Record<number, Tone>
  pointers?: Pointer[]
  /** Dashed band stretched between two indices — a window, or a two-pointer span. */
  band?: { from: number; to: number; label?: string; accent?: Accent } | null
  /** `bars` renders magnitude as height: heights, prices, histograms. */
  mode?: 'cells' | 'bars'
  /** Waterline drawn between two bars, for Container With Most Water. */
  fill?: { from: number; to: number; level: number } | null
  /** Small caption under an individual cell, keyed by index. */
  notes?: Record<number, string>
  title?: string
  showIndex?: boolean
}

export interface GridView {
  kind: 'grid'
  data: Cell[][]
  /** Keyed `"row,col"`. */
  tones?: Record<string, Tone>
  cursor?: [number, number] | null
  rowLabels?: string[]
  colLabels?: string[]
  title?: string
  /** Suppresses cell values, leaving only tone — used for large maps. */
  glyph?: boolean
}

export interface ListView {
  kind: 'list'
  /** Nodes in original order; identity is the id, so re-linking animates. */
  nodes: { id: number; value: Cell }[]
  links: { from: number; to: number | null }[]
  pointers?: { name: string; at: number | null; accent?: Accent }[]
  tones?: Record<number, Tone>
  title?: string
}

export interface TreeView {
  kind: 'tree'
  nodes: { id: number; value: Cell; left?: number | null; right?: number | null }[]
  root: number | null
  tones?: Record<number, Tone>
  pointers?: { name: string; at: number | null; accent?: Accent }[]
  title?: string
}

export interface StackView {
  kind: 'stack'
  items: Cell[]
  tones?: Record<number, Tone>
  title?: string
  /** Grows downward instead of up — reads better for recursion depth. */
  flip?: boolean
}

export interface MapView {
  kind: 'map'
  entries: { k: Cell; v?: Cell; tone?: Tone }[]
  title?: string
  /** Renders as a set (keys only) rather than key to value rows. */
  asSet?: boolean
}

export interface TextView {
  kind: 'text'
  chars: Cell[]
  tones?: Record<number, Tone>
  pointers?: Pointer[]
  band?: { from: number; to: number; label?: string; accent?: Accent } | null
  title?: string
  showIndex?: boolean
}

/** Vertical composition — an array above a hashmap, a string above a stack. */
export interface ComboView {
  kind: 'combo'
  views: View[]
}

export type View =
  | ArrayView
  | GridView
  | ListView
  | TreeView
  | StackView
  | MapView
  | TextView
  | ComboView

export interface VarRow {
  name: string
  value: string | number
  accent?: Accent
}

export type VarSpec = [string, string | number] | [string, string | number, Accent]

export interface Frame {
  /** Semantic step key, mapped to a line number per language so one trace lights up every translation. */
  step: string
  note: string
  view: View
  vars: VarRow[]
  /** Cumulative operation count at this frame — drives the live op counter. */
  ops: number
  /** Headline result chip, e.g. `sum < target`. */
  badge?: { text: string; accent?: Accent } | null
}

export interface CodeBlock {
  lines: string[]
  /** step key to 1-based line number in `lines`. Absent on a practice-only problem. */
  map?: Record<string, number>
}

export interface Counter {
  ops: number
}

export interface Solution {
  id: string
  label: string
  kind: 'optimal' | 'brute'
  time: string
  space: string
  blurb: string
  code: Record<Lang, CodeBlock>
  /**
   * Omitted on a practice-only problem: no animation, no step map, and the
   * player drops its Trace and Brute vs Optimal tabs.
   *
   * `any` rather than `any[]` so a problem can destructure its own argument
   * tuple — `(t, [nums, target])` — without tripping parameter variance.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trace?: (t: Tracer, args: any) => void
  /** Untraced run used by the complexity meter; must bump `c.ops` per unit of work. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  run: (args: any, c: Counter) => unknown
}

export type ParamType =
  | 'int'
  | 'double'
  | 'bool'
  | 'string'
  | 'int[]'
  | 'double[]'
  | 'string[]'
  | 'int[][]'
  | 'string[][]'
  | 'char[][]'
  | 'list'
  /** an array of linked lists, e.g. Merge K Sorted Lists */
  | 'list[]'
  /** `[values, pos]` — a linked list whose tail connects back to index `pos` (-1 for none) */
  | 'cycle'
  | 'tree'

export interface Signature {
  fn: string
  params: { name: string; type: ParamType }[]
  ret: ParamType
}

export interface TestCase {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any[]
  expect: unknown
  note?: string
}

export interface Problem {
  id: string
  title: string
  group: string
  pattern: string
  difficulty: Difficulty
  leetcode?: string
  statement: string
  constraints: string[]
  /**
   * Omitted on a statement-only problem — a class, an iterator or a callback
   * API that no single function over `ParamType` can express. Such a problem
   * ships statement and constraints alone, and drops `tests`, `demo`,
   * `starter` and `solutions` with it. `hasPractice` in `src/problems/index.ts`
   * is the one place that asks; the player then renders the statement with no
   * editor and no tabs.
   */
  signature?: Signature
  /** How a submitted answer is judged. `set`/`sorted` for order-insensitive results. */
  compare?: 'exact' | 'sorted' | 'set'
  tests?: TestCase[]
  /** Arguments the animation runs on. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  demo?: any[]
  starter?: Record<Lang, string>
  /** Index 0 is shown by default; a `brute` entry unlocks compare mode. */
  solutions?: Solution[]
  /** Input generator for the complexity meter. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scale?: (n: number) => any[]
}

/**
 * A problem the editor can actually run: everything `buildProgram` and the
 * test table need is present. `hasPractice` narrows a `Problem` to this.
 */
export type PracticeProblem = Problem &
  Required<Pick<Problem, 'signature' | 'tests' | 'demo' | 'starter' | 'solutions'>>

// ---------------------------------------------------------------------------
// Tracer
// ---------------------------------------------------------------------------

const toRows = (specs: VarSpec[] = []): VarRow[] =>
  specs.map(([name, value, accent]) => ({ name, value, accent }))

export class Tracer {
  frames: Frame[] = []
  ops = 0
  /** Hard stop so a buggy trace can't hang the tab. */
  private limit: number

  constructor(limit = 600) {
    this.limit = limit
  }

  get full() {
    return this.frames.length >= this.limit
  }

  /** Count work without emitting a frame. */
  bump(n = 1) {
    this.ops += n
    return this.ops
  }

  push(f: {
    step: string
    note: string
    view: View
    vars?: VarSpec[]
    badge?: { text: string; accent?: Accent } | null
    ops?: number
  }) {
    if (this.full) return
    if (f.ops != null) this.ops += f.ops
    this.frames.push({
      step: f.step,
      note: f.note,
      view: f.view,
      vars: toRows(f.vars),
      ops: this.ops,
      badge: f.badge ?? null,
    })
  }
}

// ---------------------------------------------------------------------------
// View constructors — keep problem files terse and readable
// ---------------------------------------------------------------------------

export const arr = (data: Cell[], o: Omit<ArrayView, 'kind' | 'data'> = {}): ArrayView => ({
  kind: 'array',
  data,
  showIndex: true,
  ...o,
})

export const bars = (
  data: Cell[],
  o: Omit<ArrayView, 'kind' | 'data' | 'mode'> = {},
): ArrayView => ({ kind: 'array', data, mode: 'bars', showIndex: true, ...o })

export const text = (s: string | Cell[], o: Omit<TextView, 'kind' | 'chars'> = {}): TextView => ({
  kind: 'text',
  chars: typeof s === 'string' ? s.split('') : s,
  ...o,
})

export const grid = (data: Cell[][], o: Omit<GridView, 'kind' | 'data'> = {}): GridView => ({
  kind: 'grid',
  data,
  ...o,
})

export const stackOf = (items: Cell[], o: Omit<StackView, 'kind' | 'items'> = {}): StackView => ({
  kind: 'stack',
  items,
  ...o,
})

export const mapOf = (
  entries: MapView['entries'],
  o: Omit<MapView, 'kind' | 'entries'> = {},
): MapView => ({ kind: 'map', entries, ...o })

export const listOf = (
  nodes: ListView['nodes'],
  links: ListView['links'],
  o: Omit<ListView, 'kind' | 'nodes' | 'links'> = {},
): ListView => ({ kind: 'list', nodes, links, ...o })

export const treeOf = (
  nodes: TreeView['nodes'],
  root: number | null,
  o: Omit<TreeView, 'kind' | 'nodes' | 'root'> = {},
): TreeView => ({ kind: 'tree', nodes, root, ...o })

export const combo = (...views: View[]): ComboView => ({ kind: 'combo', views })

/** Tone every index in `[from, to]`, leaving the rest `idle`. */
export const bandTones = (
  n: number,
  from: number,
  to: number,
  inside: Tone = 'band',
): Record<number, Tone> => {
  const t: Record<number, Tone> = {}
  for (let i = 0; i < n; i++) t[i] = i >= from && i <= to ? inside : 'idle'
  return t
}
