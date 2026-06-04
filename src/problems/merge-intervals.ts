import { arr, type Problem, type Tone } from '@/lib/types'

const DEMO: [number[][]] = [[[1, 3], [8, 10], [2, 6], [15, 18]]]

const cell = (iv: number[]) => `${iv[0]}–${iv[1]}`

export const mergeIntervals: Problem = {
  id: 'merge-intervals',
  title: 'Merge Intervals',
  group: 'Interval',
  pattern: 'Sort + Sweep',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/merge-intervals/',
  statement: 'Given an array of `intervals`, merge every pair that overlaps and return the non-overlapping result.',
  constraints: ['1 <= intervals.length <= 10^4', 'start <= end for every interval'],
  signature: { fn: 'merge', params: [{ name: 'intervals', type: 'int[][]' }], ret: 'int[][]' },
  compare: 'sorted',
  tests: [
    { args: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expect: [[1, 6], [8, 10], [15, 18]] },
    { args: [[[1, 4], [4, 5]]], expect: [[1, 5]], note: 'touching counts as overlap' },
    { args: [[[1, 4], [2, 3]]], expect: [[1, 4]], note: 'one interval swallows another' },
    { args: [[[5, 6]]], expect: [[5, 6]] },
  ],
  demo: DEMO,
  scale: (n) => [Array.from({ length: n }, (_, i) => [i * 3, i * 3 + ((i % 2) + 1) * 2])],
  starter: {
    js: `function merge(intervals) {
  // intervals: number[][]  ->  number[][]
}
`,
    cpp: `vector<vector<int>> merge(vector<vector<int>>& intervals) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'sweep',
      label: 'Sort by start, then absorb',
      kind: 'optimal',
      time: 'O(n log n)',
      space: 'O(n)',
      blurb:
        'Once sorted by start, an interval can only overlap the one growing directly before it. So sweep left to right: extend the current merged block while starts keep landing inside it, and seal it the moment a gap appears.',
      code: {
        cpp: {
          lines: [
            'vector<vector<int>> merge(vector<vector<int>>& intervals) {',
            '    sort(intervals.begin(), intervals.end());',
            '    vector<vector<int>> out{intervals[0]};',
            '    for (int i = 1; i < intervals.size(); ++i) {',
            '        if (intervals[i][0] <= out.back()[1])',
            '            out.back()[1] = max(out.back()[1], intervals[i][1]);',
            '        else',
            '            out.push_back(intervals[i]);',
            '    }',
            '    return out;',
            '}',
          ],
          map: { init: 2, absorb: 6, seal: 8, done: 10 },
        },
        js: {
          lines: [
            'function merge(intervals) {',
            '  intervals.sort((a, b) => a[0] - b[0]);',
            '  const out = [[...intervals[0]]];',
            '  for (let i = 1; i < intervals.length; i++) {',
            '    const [s, e] = intervals[i];',
            '    const last = out[out.length - 1];',
            '    if (s <= last[1]) {',
            '      last[1] = Math.max(last[1], e);',
            '    } else {',
            '      out.push([s, e]);',
            '    }',
            '  }',
            '  return out;',
            '}',
          ],
          map: { init: 2, absorb: 8, seal: 10, done: 14 },
        },
      },

      trace(t, [input]: [number[][]]) {
        const sorted = input.map((iv) => [...iv]).sort((a, b) => a[0] - b[0])
        const n = sorted.length
        const out: number[][] = [[...sorted[0]]]

        const paint = (i: number | null, tone: Tone) => {
          const tones: Record<number, Tone> = {}
          for (let k = 0; k < n; k++) tones[k] = i == null ? 'done' : k < i ? 'done' : k > i ? 'idle' : tone
          return arr(sorted.map(cell), {
            tones,
            pointers: i != null ? [{ name: 'i', at: i, accent: 'a' }] : [],
            notes: Object.fromEntries(out.map((iv, k) => [k, k === out.length - 1 ? `block ${cell(iv)}` : ''])),
            title: `intervals (sorted by start) · merged so far: ${out.map(cell).join('  ')}`,
          })
        }

        t.push({
          step: 'init',
          note: `Sorted by start: ${sorted.map(cell).join(', ')}. The first interval opens the first merged block.`,
          view: paint(0, 'active'),
          vars: [['block', cell(out[0]), 'c']],
        })

        for (let i = 1; i < n && !t.full; i++) {
          const [s, e] = sorted[i]
          const last = out[out.length - 1]
          t.bump()

          if (s <= last[1]) {
            const before = cell(last)
            last[1] = Math.max(last[1], e)
            t.push({
              step: 'absorb',
              note: `${cell(sorted[i])} starts at ${s}, inside the open block ${before} — they overlap, so the block stretches to ${cell(last)}.`,
              view: paint(i, 'good'),
              vars: [
                ['interval', cell(sorted[i]), 'ok'],
                ['block', cell(last), 'c'],
              ],
              badge: { text: `absorb → ${cell(last)}`, accent: 'ok' },
            })
          } else {
            out.push([s, e])
            t.push({
              step: 'seal',
              note: `${cell(sorted[i])} starts at ${s}, past the block's end ${last[1]} — a genuine gap. Seal the old block and open a new one.`,
              view: paint(i, 'active'),
              vars: [
                ['interval', cell(sorted[i]), 'b'],
                ['blocks', out.length],
              ],
              badge: { text: `new block ${cell([s, e])}`, accent: 'b' },
            })
          }
        }

        t.push({
          step: 'done',
          note: `${n} intervals collapse to ${out.length}: ${out.map(cell).join(', ')}. The sort is the whole cost; the sweep is linear.`,
          view: paint(null, 'good'),
          vars: [['answer', JSON.stringify(out), 'ok']],
          badge: { text: `${out.length} blocks`, accent: 'ok' },
        })
      },

      run([input]: [number[][]], c) {
        const sorted = input.map((iv) => [...iv]).sort((a, b) => a[0] - b[0])
        const out: number[][] = [[...sorted[0]]]
        for (let i = 1; i < sorted.length; i++) {
          c.ops++
          const last = out[out.length - 1]
          if (sorted[i][0] <= last[1]) last[1] = Math.max(last[1], sorted[i][1])
          else out.push([...sorted[i]])
        }
        return out
      },
    },
  ],
}
