import { arr, type Problem, type Tone } from '@/lib/types'

const DEMO: [number[][]] = [[[1, 2], [2, 3], [3, 4], [1, 3]]]

const cell = (iv: number[]) => `${iv[0]}–${iv[1]}`

export const nonOverlappingIntervals: Problem = {
  id: 'non-overlapping-intervals',
  title: 'Non-overlapping Intervals',
  group: 'Interval',
  pattern: 'Greedy by End',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/non-overlapping-intervals/',
  statement:
    'Given an array of `intervals`, return the minimum number of intervals to remove so the rest never overlap. Touching endpoints do not count as overlap.',
  constraints: ['1 <= intervals.length <= 10^5', '-5 * 10^4 <= start < end <= 5 * 10^4'],
  signature: { fn: 'eraseOverlapIntervals', params: [{ name: 'intervals', type: 'int[][]' }], ret: 'int' },
  tests: [
    { args: [[[1, 2], [2, 3], [3, 4], [1, 3]]], expect: 1 },
    { args: [[[1, 2], [1, 2], [1, 2]]], expect: 2, note: 'identical triplet' },
    { args: [[[1, 2], [2, 3]]], expect: 0, note: 'touching is fine' },
    { args: [[[1, 100], [11, 22], [1, 11], [2, 12]]], expect: 2 },
  ],
  demo: DEMO,
  scale: (n) => [Array.from({ length: n }, (_, i) => [i, i + 2])],
  starter: {
    py: `def eraseOverlapIntervals(intervals):
    # intervals: list[list[int]]  ->  int
    pass
`,
    js: `function eraseOverlapIntervals(intervals) {
  // intervals: number[][]  ->  number
}
`,
    cpp: `int eraseOverlapIntervals(vector<vector<int>>& intervals) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'greedy',
      label: 'Keep whichever ends first',
      kind: 'optimal',
      time: 'O(n log n)',
      space: 'O(1)',
      blurb:
        'Removing the fewest is keeping the most, and the interval that ends earliest leaves the most room for everything after it. So sort by end time and sweep: keep an interval when it starts after the last kept one ended, drop it otherwise. Classic exchange-argument greedy.',
      code: {
        py: {
          lines: [
            'def eraseOverlapIntervals(intervals):',
            '    intervals.sort(key=lambda iv: iv[1])',
            '    removed = 0',
            "    last_end = float('-inf')",
            '    for s, e in intervals:',
            '        if s >= last_end:',
            '            last_end = e',
            '        else:',
            '            removed += 1',
            '    return removed',
          ],
          map: { init: 2, keep: 7, drop: 9, done: 10 },
        },
        cpp: {
          lines: [
            'int eraseOverlapIntervals(vector<vector<int>>& intervals) {',
            '    sort(intervals.begin(), intervals.end(),',
            '         [](auto& a, auto& b) { return a[1] < b[1]; });',
            '    int removed = 0;',
            '    long long lastEnd = LLONG_MIN;',
            '    for (auto& iv : intervals) {',
            '        if (iv[0] >= lastEnd) lastEnd = iv[1];',
            '        else removed++;',
            '    }',
            '    return removed;',
            '}',
          ],
          map: { init: 2, keep: 7, drop: 8, done: 10 },
        },
        js: {
          lines: [
            'function eraseOverlapIntervals(intervals) {',
            '  intervals.sort((a, b) => a[1] - b[1]);',
            '  let removed = 0;',
            '  let lastEnd = -Infinity;',
            '  for (const [s, e] of intervals) {',
            '    if (s >= lastEnd) {',
            '      lastEnd = e;',
            '    } else {',
            '      removed++;',
            '    }',
            '  }',
            '  return removed;',
            '}',
          ],
          map: { init: 2, keep: 7, drop: 9, done: 12 },
        },
      },

      trace(t, [input]: [number[][]]) {
        const sorted = input.map((iv) => [...iv]).sort((a, b) => a[1] - b[1])
        const n = sorted.length
        let removed = 0
        let lastEnd = -Infinity
        const kept: number[] = []
        const dropped: number[] = []

        const paint = (i: number | null, tone: Tone) => {
          const tones: Record<number, Tone> = {}
          for (let k = 0; k < n; k++) {
            tones[k] = kept.includes(k) ? 'good' : dropped.includes(k) ? 'bad' : 'idle'
          }
          if (i != null) tones[i] = tone
          return arr(sorted.map(cell), {
            tones,
            pointers: i != null ? [{ name: 'i', at: i, accent: 'a' }] : [],
            title: 'intervals sorted by END time',
          })
        }

        t.push({
          step: 'init',
          note: `Sorted by end: ${sorted.map(cell).join(', ')}. Earliest-ending first is the greedy choice that provably never hurts — anything it blocks, the alternative would have blocked too.`,
          view: paint(null, 'idle'),
          vars: [['removed', 0]],
        })

        for (let i = 0; i < n && !t.full; i++) {
          const [s, e] = sorted[i]
          t.bump()
          if (s >= lastEnd) {
            lastEnd = e
            kept.push(i)
            t.push({
              step: 'keep',
              note: `${cell(sorted[i])} starts at ${s}, on or after the last kept end (${lastEnd === e ? (kept.length > 1 ? 'previous end' : '-∞') : lastEnd}). Keep it; the frontier moves to ${e}.`,
              view: paint(i, 'good'),
              vars: [
                ['interval', cell(sorted[i]), 'ok'],
                ['frontier', e, 'c'],
                ['removed', removed],
              ],
              badge: { text: `keep ${cell(sorted[i])}`, accent: 'ok' },
            })
          } else {
            removed++
            dropped.push(i)
            t.push({
              step: 'drop',
              note: `${cell(sorted[i])} starts at ${s}, before the frontier ${lastEnd} — it collides with something already kept, and the kept one ends sooner, so this one goes.`,
              view: paint(i, 'bad'),
              vars: [
                ['interval', cell(sorted[i]), 'no'],
                ['removed', removed, 'no'],
              ],
              badge: { text: `remove (${removed})`, accent: 'no' },
            })
          }
        }

        t.push({
          step: 'done',
          note: `${removed} removal${removed === 1 ? '' : 's'} leave ${kept.length} mutually compatible intervals — the minimum possible.`,
          view: paint(null, 'idle'),
          vars: [['answer', removed, 'ok']],
          badge: { text: `${removed} removed`, accent: 'ok' },
        })
      },

      run([input]: [number[][]], c) {
        const sorted = input.map((iv) => [...iv]).sort((a, b) => a[1] - b[1])
        let removed = 0
        let lastEnd = -Infinity
        for (const [s, e] of sorted) {
          c.ops++
          if (s >= lastEnd) lastEnd = e
          else removed++
        }
        return removed
      },
    },
  ],
}
