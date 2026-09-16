import { describe, expect, it } from 'vitest'
import { RESULT_MARK, buildProgram, judge, partitionOutput } from './harness'
import type { Signature, TestCase } from './types'

// ---------------------------------------------------------------------------
// judge
// ---------------------------------------------------------------------------

interface JudgeCase {
  name: string
  actual: unknown
  expected: unknown
  mode?: 'exact' | 'sorted' | 'set'
  want: boolean
}

const JUDGE_CASES: JudgeCase[] = [
  { name: 'exact: identical scalars', actual: 3, expected: 3, want: true },
  { name: 'exact: identical arrays', actual: [1, 2, 3], expected: [1, 2, 3], want: true },
  { name: 'exact: reordered arrays differ', actual: [2, 1], expected: [1, 2], want: false },
  {
    name: 'exact: object key order does not matter',
    actual: { b: 1, a: 2 },
    expected: { a: 2, b: 1 },
    want: true,
  },
  { name: 'exact: -0 reads as 0', actual: -0, expected: 0, want: true },
  { name: 'exact: float drift fails', actual: 0.1 + 0.2, expected: 0.3, want: false },
  { name: 'exact: 2.0 is 2', actual: 2.0, expected: 2, want: true },
  { name: 'exact: nesting is compared whole', actual: [[1, [2]]], expected: [[1, [2]]], want: true },
  { name: 'exact: undefined never matches', actual: undefined, expected: null, want: false },

  {
    name: 'sorted: outer order does not matter',
    actual: [[8, 10], [1, 6]],
    expected: [[1, 6], [8, 10]],
    mode: 'sorted',
    want: true,
  },
  {
    // M3: the whole promise of a green row. An interval is [start, end], so
    // sorting inside it used to pass a submission that returned [end, start].
    name: 'sorted: inner order still matters (M3 regression)',
    actual: [[6, 1], [8, 10]],
    expected: [[1, 6], [8, 10]],
    mode: 'sorted',
    want: false,
  },
  {
    name: 'sorted: a missing element fails',
    actual: [[1, 6]],
    expected: [[1, 6], [8, 10]],
    mode: 'sorted',
    want: false,
  },
  { name: 'sorted: flat lists', actual: [3, 1, 2], expected: [1, 2, 3], mode: 'sorted', want: true },

  {
    name: 'set: order matters nowhere',
    actual: [[-1, 2, -1]],
    expected: [[-1, -1, 2]],
    mode: 'set',
    want: true,
  },
  {
    name: 'set: groups in any order',
    actual: [['eat', 'tea'], ['tan']],
    expected: [['tan'], ['tea', 'eat']],
    mode: 'set',
    want: true,
  },
  {
    name: 'set: a wrong element still fails',
    actual: [[1, 2]],
    expected: [[1, 3]],
    mode: 'set',
    want: false,
  },

  { name: 'an errored case never passes', actual: { __error: 'boom' }, expected: null, want: false },
  {
    name: 'an errored case never passes in sorted mode',
    actual: { __error: 'boom' },
    expected: [],
    mode: 'sorted',
    want: false,
  },
]

describe('judge', () => {
  for (const c of JUDGE_CASES) {
    it(c.name, () => {
      expect(judge(c.actual, c.expected, c.mode)).toBe(c.want)
    })
  }

  it('sorted and set are no longer the same function (M3 regression)', () => {
    const actual = [[4, 0]]
    const expected = [[0, 4]]
    expect(judge(actual, expected, 'set')).toBe(true)
    expect(judge(actual, expected, 'sorted')).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// partitionOutput
// ---------------------------------------------------------------------------

describe('partitionOutput', () => {
  it('splits results from what the learner printed', () => {
    const { results, stdout } = partitionOutput(['hello', `${RESULT_MARK}[1,2]`, 'bye'])
    expect(results).toEqual([[1, 2]])
    expect(stdout).toEqual(['hello', 'bye'])
  })

  it('keeps the text before a marker that starts mid-line', () => {
    const { results, stdout } = partitionOutput([`debug: ${RESULT_MARK}42`])
    expect(results).toEqual([42])
    expect(stdout).toEqual(['debug: '])
  })

  it('reports an unparseable payload as an errored case', () => {
    const { results } = partitionOutput([`${RESULT_MARK}{oops`])
    expect(results).toEqual([{ __error: 'unparseable result' }])
    expect(judge(results[0], null)).toBe(false)
  })

  it('treats learner output containing the marker as a result, not as text', () => {
    // The marker is ours; a program that prints it is indistinguishable from
    // the runner. What matters is that it never silently corrupts a verdict:
    // the payload after it is judged, and nonsense fails.
    const { results, stdout } = partitionOutput([`${RESULT_MARK}not json`])
    expect(stdout).toEqual([])
    expect(results).toEqual([{ __error: 'unparseable result' }])
  })

  it('handles empty output', () => {
    expect(partitionOutput([])).toEqual({ results: [], stdout: [] })
  })
})

// ---------------------------------------------------------------------------
// buildProgram — JavaScript
// ---------------------------------------------------------------------------

const echoSig: Signature = {
  fn: 'echo',
  params: [{ name: 's', type: 'string' }],
  ret: 'string',
}

/** Runs a generated JS program the way the worker does, and reads it back. */
function runJs(program: string): { results: unknown[]; stdout: string[]; errors: string[] } {
  const lines: string[] = []
  const errors: string[] = []
  const log = console.log
  const error = console.error
  console.log = (...args: unknown[]) => lines.push(args.map(String).join(' '))
  console.error = (...args: unknown[]) => errors.push(args.map(String).join(' '))
  try {
    // A fresh function scope per program, the way a fresh worker isolates a
    // real run: a function the last program defined must not resolve here.
    new Function(program)()
  } finally {
    console.log = log
    console.error = error
  }
  return { ...partitionOutput(lines), errors }
}

describe('buildProgram (js)', () => {
  it('round-trips a string carrying quotes and backslashes', () => {
    const tests: TestCase[] = [{ args: ['a"b\\c'], expect: 'a"b\\c' }]
    const { results } = runJs(buildProgram('js', 'function echo(s) { return s }', echoSig, tests))
    expect(results).toEqual(['a"b\\c'])
    expect(judge(results[0], tests[0].expect)).toBe(true)
  })

  it('isolates a throwing case as an errored result', () => {
    const tests: TestCase[] = [{ args: ['x'], expect: 'x' }]
    const { results } = runJs(
      buildProgram('js', 'function echo() { throw new Error("nope") }', echoSig, tests),
    )
    expect(results).toEqual([{ __error: 'nope' }])
    expect(judge(results[0], 'x')).toBe(false)
  })

  it('says so when the function is missing, and produces no results', () => {
    const tests: TestCase[] = [{ args: ['x'], expect: 'x' }]
    const { results, errors } = runJs(buildProgram('js', 'const other = 1', echoSig, tests))
    expect(results).toEqual([])
    expect(errors.join(' ')).toContain('Could not find a function named echo')
  })

  it('emits null rather than undefined for a void return', () => {
    const tests: TestCase[] = [{ args: ['x'], expect: null }]
    const { results } = runJs(buildProgram('js', 'function echo() {}', echoSig, tests))
    expect(results).toEqual([null])
  })

  it('keeps learner output separate from results', () => {
    const tests: TestCase[] = [{ args: ['x'], expect: 'x' }]
    const { results, stdout } = runJs(
      buildProgram('js', 'function echo(s) { console.log("hi"); return s }', echoSig, tests),
    )
    expect(results).toEqual(['x'])
    expect(stdout).toEqual(['hi'])
  })
})

// ---------------------------------------------------------------------------
// buildProgram — C++ (R10: literals and returned values must stay parseable)
// ---------------------------------------------------------------------------

describe('buildProgram (cpp)', () => {
  const gridSig: Signature = {
    fn: 'walk',
    params: [{ name: 'grid', type: 'char[][]' }],
    ret: 'int',
  }

  it('escapes quotes and backslashes in string arguments', () => {
    const program = buildProgram('cpp', '', echoSig, [{ args: ['a"b\\c'], expect: 'a"b\\c' }])
    expect(program).toContain('string s = "a\\"b\\\\c";')
  })

  it('escapes quote and backslash cells in a char grid', () => {
    const program = buildProgram('cpp', '', gridSig, [
      { args: [[['a', "'", '\\', '"']]], expect: 0 },
    ])
    expect(program).toContain("{'a','\\'','\\\\','\"'}")
  })

  it('escapes returned strings on the way out', () => {
    // The result line is read back as JSON, so the printer has to escape what
    // the learner returns; before this, a quote made the case unparseable.
    const program = buildProgram('cpp', '', echoSig, [{ args: ['x'], expect: 'x' }])
    expect(program).toContain('static string __esc(const string& s)')
    expect(program).toContain(`if (c == '"' || c == '\\\\') { o += '\\\\'; o += (char)c; }`)
    expect(program).toContain(`static void __p(const string& s) { cout << '"' << __esc(s) << '"'; }`)
    expect(program).toContain(`static void __p(char c) { cout << '"' << __esc(string(1, c)) << '"'; }`)
  })

  it('names the function the learner has to write', () => {
    const program = buildProgram('cpp', '', echoSig, [{ args: ['x'], expect: 'x' }])
    expect(program).toContain('__p(echo(s));')
  })

  it('emits one block per test case', () => {
    const program = buildProgram('cpp', '', echoSig, [
      { args: ['a'], expect: 'a' },
      { args: ['b'], expect: 'b' },
    ])
    expect(program).toContain('{ // case 1')
    expect(program).toContain('{ // case 2')
    expect(program.match(new RegExp(RESULT_MARK, 'g'))).toHaveLength(2)
  })
})
