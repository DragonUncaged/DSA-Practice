import { arr, type Problem, type Tone } from '@/lib/types'

const DEMO: [number[][], number[]] = [[[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]]

const cell = (iv: number[]) => `${iv[0]}–${iv[1]}`

export const insertInterval: Problem = {
  id: 'insert-interval',
  title: 'Insert Interval',
  group: 'Interval',
  pattern: 'Three-phase Sweep',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/insert-interval/',
  statement:
    'Given non-overlapping `intervals` sorted by start, insert `newInterval`, merging where necessary, and return the result still sorted and non-overlapping.',
  constraints: ['0 <= intervals.length <= 10^4', 'Input is already sorted and disjoint'],
  signature: {
    fn: 'insert',
    params: [
      { name: 'intervals', type: 'int[][]' },
      { name: 'newInterval', type: 'int[]' },
    ],
    ret: 'int[][]',
  },
  tests: [
    { args: [[[1, 3], [6, 9]], [2, 5]], expect: [[1, 5], [6, 9]] },
    { args: [[[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]], expect: [[1, 2], [3, 10], [12, 16]] },
    { args: [[], [5, 7]], expect: [[5, 7]], note: 'insert into nothing' },
    { args: [[[1, 5]], [2, 3]], expect: [[1, 5]], note: 'swallowed whole' },
  ],
  demo: DEMO,
  scale: (n) => [Array.from({ length: n }, (_, i) => [i * 4, i * 4 + 2]), [n, n * 2]],
  starter: {
    py: `def insert(intervals, newInterval):
    # intervals: list[list[int]], newInterval: list[int]  ->  list[list[int]]
    pass
`,
    js: `function insert(intervals, newInterval) {
  // intervals: number[][], newInterval: number[]  ->  number[][]
}
`,
    cpp: `vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'three-phase',
      label: 'Before, during, after',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'One pass, three phases: copy the intervals that end before the new one starts, then swallow everything that overlaps into the new interval (stretching it as you go), then copy the rest untouched. The input being sorted is what makes the phases clean.',
      code: {
        py: {
          lines: [
            'def insert(intervals, newInterval):',
            '    s, e = newInterval',
            '    out = []',
            '    i, n = 0, len(intervals)',
            '    while i < n and intervals[i][1] < s:',
            '        out.append(intervals[i]); i += 1',
            '    while i < n and intervals[i][0] <= e:',
            '        s = min(s, intervals[i][0])',
            '        e = max(e, intervals[i][1]); i += 1',
            '    out.append([s, e])',
            '    while i < n:',
            '        out.append(intervals[i]); i += 1',
            '    return out',
          ],
          map: { init: 3, before: 6, swallow: 9, place: 10, after: 12, done: 13 },
        },
        cpp: {
          lines: [
            'vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {',
            '    int s = newInterval[0], e = newInterval[1];',
            '    vector<vector<int>> out;',
            '    int i = 0, n = intervals.size();',
            '    while (i < n && intervals[i][1] < s) out.push_back(intervals[i++]);',
            '    while (i < n && intervals[i][0] <= e) {',
            '        s = min(s, intervals[i][0]);',
            '        e = max(e, intervals[i][1]); i++;',
            '    }',
            '    out.push_back({s, e});',
            '    while (i < n) out.push_back(intervals[i++]);',
            '    return out;',
            '}',
          ],
          map: { init: 3, before: 5, swallow: 8, place: 10, after: 11, done: 12 },
        },
        js: {
          lines: [
            'function insert(intervals, newInterval) {',
            '  let [s, e] = newInterval;',
            '  const out = [];',
            '  let i = 0;',
            '  const n = intervals.length;',
            '  while (i < n && intervals[i][1] < s) out.push(intervals[i++]);',
            '  while (i < n && intervals[i][0] <= e) {',
            '    s = Math.min(s, intervals[i][0]);',
            '    e = Math.max(e, intervals[i][1]);',
            '    i++;',
            '  }',
            '  out.push([s, e]);',
            '  while (i < n) out.push(intervals[i++]);',
            '  return out;',
            '}',
          ],
          map: { init: 3, before: 6, swallow: 9, place: 12, after: 13, done: 15 },
        },
      },

      trace(t, [intervals, newInterval]: [number[][], number[]]) {
        const n = intervals.length
        let [s, e] = newInterval
        const out: number[][] = []
        let i = 0

        const paint = (tone: Tone, focus?: number) => {
          const tones: Record<number, Tone> = {}
          for (let k = 0; k < n; k++) tones[k] = k < i ? 'done' : 'idle'
          if (focus != null) tones[focus] = tone
          return arr(intervals.map(cell), {
            tones,
            pointers: i < n ? [{ name: 'i', at: Math.min(i, n - 1), accent: 'a' }] : [],
            title: `existing intervals · inserting ${s}–${e} · result: ${out.map(cell).join('  ') || '—'}`,
          })
        }

        t.push({
          step: 'init',
          note: `Insert ${cell(newInterval)} into ${intervals.map(cell).join(', ') || 'an empty list'}. Three phases: strictly-before, overlapping, strictly-after.`,
          view: paint('idle'),
          vars: [['new', cell(newInterval), 'c']],
        })

        while (i < n && intervals[i][1] < s && !t.full) {
          out.push(intervals[i])
          t.bump()
          t.push({
            step: 'before',
            note: `${cell(intervals[i])} ends at ${intervals[i][1]}, before the new interval starts at ${s} — copy it through untouched.`,
            view: paint('done', i),
            vars: [['copied', cell(intervals[i]), 'mute']],
          })
          i++
        }

        while (i < n && intervals[i][0] <= e && !t.full) {
          const before = `${s}–${e}`
          s = Math.min(s, intervals[i][0])
          e = Math.max(e, intervals[i][1])
          t.bump()
          t.push({
            step: 'swallow',
            note: `${cell(intervals[i])} overlaps the growing interval ${before} — swallow it, stretching to ${s}–${e}.`,
            view: paint('good', i),
            vars: [
              ['swallowed', cell(intervals[i]), 'ok'],
              ['now', `${s}–${e}`, 'c'],
            ],
            badge: { text: `grow → ${s}–${e}`, accent: 'ok' },
          })
          i++
        }

        out.push([s, e])
        t.push({
          step: 'place',
          note: `No more overlaps — the merged interval ${s}–${e} takes its place in the result.`,
          view: paint('good'),
          vars: [['placed', `${s}–${e}`, 'ok']],
          badge: { text: `place ${s}–${e}`, accent: 'ok' },
        })

        while (i < n && !t.full) {
          out.push(intervals[i])
          t.bump()
          t.push({
            step: 'after',
            note: `${cell(intervals[i])} starts after ${e} — copy it through untouched.`,
            view: paint('done', i),
            vars: [['copied', cell(intervals[i]), 'mute']],
          })
          i++
        }

        t.push({
          step: 'done',
          note: `Result: ${out.map(cell).join(', ')}. One linear pass — no sorting needed because the input was already ordered.`,
          view: paint('good'),
          vars: [['answer', JSON.stringify(out), 'ok']],
          badge: { text: `${out.length} intervals`, accent: 'ok' },
        })
      },

      run([intervals, newInterval]: [number[][], number[]], c) {
        let [s, e] = newInterval
        const out: number[][] = []
        let i = 0
        const n = intervals.length
        while (i < n && intervals[i][1] < s) {
          c.ops++
          out.push(intervals[i++])
        }
        while (i < n && intervals[i][0] <= e) {
          c.ops++
          s = Math.min(s, intervals[i][0])
          e = Math.max(e, intervals[i][1])
          i++
        }
        out.push([s, e])
        while (i < n) {
          c.ops++
          out.push(intervals[i++])
        }
        return out
      },
    },
  ],
}
