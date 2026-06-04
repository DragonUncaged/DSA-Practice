import { combo, mapOf, stackOf, type Problem, type Tone } from '@/lib/types'

const DEMO: [number[]] = [[5, 15, 1, 3]]

export const findMedianFromDataStream: Problem = {
  id: 'find-median-from-data-stream',
  title: 'Find Median from Data Stream',
  group: 'Heap',
  pattern: 'Two Heaps',
  difficulty: 'Hard',
  leetcode: 'https://leetcode.com/problems/find-median-from-data-stream/',
  statement:
    'Design a structure that accepts a stream of numbers and can report the median at any point. The runner calls `runningMedian(nums)`: process the stream in order and return the median after each insertion.',
  constraints: ['1 <= stream length <= 5 * 10^4', 'Each median must be exact (x.5 allowed)'],
  signature: { fn: 'runningMedian', params: [{ name: 'nums', type: 'int[]' }], ret: 'double[]' },
  tests: [
    { args: [[2, 3, 4]], expect: [2, 2.5, 3] },
    { args: [[1, 2]], expect: [1, 1.5] },
    { args: [[5, 15, 1, 3]], expect: [5, 10, 5, 4] },
    { args: [[7]], expect: [7] },
  ],
  demo: DEMO,
  scale: (n) => [Array.from({ length: n }, (_, i) => (i * 7919) % 1000)],
  starter: {
    js: `function runningMedian(nums) {
  // maintain two heaps; return the median after each insert
}
`,
    cpp: `vector<double> runningMedian(vector<int>& nums) {
    // maintain two heaps; return the median after each insert
}
`,
  },

  solutions: [
    {
      id: 'two-heaps',
      label: 'A max-heap below, a min-heap above',
      kind: 'optimal',
      time: 'O(log n) per insert',
      space: 'O(n)',
      blurb:
        'Split the numbers into a lower half and an upper half. If the lower half is a max-heap and the upper a min-heap, the median lives at their touching tops — no sorting, ever. Each insert drops into one side and a single rebalance keeps the sizes within one.',
      code: {
        cpp: {
          lines: [
            'vector<double> runningMedian(vector<int>& nums) {',
            '    priority_queue<int> lo;',
            '    priority_queue<int, vector<int>, greater<int>> hi;',
            '    vector<double> out;',
            '    for (int x : nums) {',
            '        lo.push(x);',
            '        hi.push(lo.top()); lo.pop();',
            '        if (hi.size() > lo.size()) { lo.push(hi.top()); hi.pop(); }',
            '        if (lo.size() > hi.size()) out.push_back(lo.top());',
            '        else out.push_back((lo.top() + hi.top()) / 2.0);',
            '    }',
            '    return out;',
            '}',
          ],
          map: { init: 4, insert: 7, balance: 8, median: 10, done: 12 },
        },
        js: {
          lines: [
            'function runningMedian(nums) {',
            '  // arrays kept heap-ordered via sorted insertion for clarity;',
            '  // a real heap makes each step O(log n)',
            '  const lo = []; // lower half, max at the end',
            '  const hi = []; // upper half, min at the end',
            '  const out = [];',
            '  const insert = (a, x, asc) => {',
            '    let i = 0;',
            '    while (i < a.length && (asc ? a[i] < x : a[i] > x)) i++;',
            '    a.splice(i, 0, x);',
            '  };',
            '  for (const x of nums) {',
            '    insert(lo, x, true);',
            '    insert(hi, lo.pop(), false);',
            '    if (hi.length > lo.length) insert(lo, hi.pop(), true);',
            '    if (lo.length > hi.length) out.push(lo[lo.length - 1]);',
            '    else out.push((lo[lo.length - 1] + hi[hi.length - 1]) / 2);',
            '  }',
            '  return out;',
            '}',
          ],
          map: { init: 5, insert: 14, balance: 15, median: 17, done: 20 },
        },
      },

      trace(t, [nums]: [number[]]) {
        const lo: number[] = [] // ascending; max is last
        const hi: number[] = [] // descending; min is last
        const medians: number[] = []

        const insert = (a: number[], x: number, asc: boolean) => {
          let i = 0
          while (i < a.length && (asc ? a[i] < x : a[i] > x)) i++
          a.splice(i, 0, x)
        }

        const view = (tone: Tone) =>
          combo(
            stackOf([...lo], {
              title: `lower half — its max ${lo.length ? lo[lo.length - 1] : '—'} touches the median`,
              tones: lo.length ? { [lo.length - 1]: 'active' } : {},
            }),
            stackOf([...hi], {
              title: `upper half — its min ${hi.length ? hi[hi.length - 1] : '—'} touches the median`,
              tones: hi.length ? { [hi.length - 1]: 'active' } : {},
            }),
            mapOf(
              medians.map((m, i) => ({
                k: `after #${i + 1}`,
                v: m,
                tone: i === medians.length - 1 ? tone : ('band' as Tone),
              })),
              { title: 'median after each insert' },
            ),
          )

        t.push({
          step: 'init',
          note: 'Two halves: everything small in a max-heap, everything large in a min-heap. Their facing tops are always the middle of the data.',
          view: view('idle'),
          vars: [],
        })

        for (const x of nums) {
          if (t.full) break
          insert(lo, x, true)
          insert(hi, lo.pop()!, false)
          t.bump()
          t.push({
            step: 'insert',
            note: `${x} arrives: push it into the lower half, then hand the lower half's max across to the upper half — that round trip files ${x} on the correct side no matter where it lands.`,
            view: view('idle'),
            vars: [
              ['arrived', x, 'b'],
              ['lower', `[${lo.join(', ')}]`],
              ['upper', `[${hi.join(', ')}]`],
            ],
          })

          if (hi.length > lo.length) {
            insert(lo, hi.pop()!, true)
            t.bump()
            t.push({
              step: 'balance',
              note: `The upper half grew too heavy — hand its min back down. Sizes stay within one, so the median always sits at a top.`,
              view: view('idle'),
              vars: [
                ['lower size', lo.length, 'c'],
                ['upper size', hi.length, 'c'],
              ],
              badge: { text: 'rebalance', accent: 'c' },
            })
          }

          const med = lo.length > hi.length ? lo[lo.length - 1] : (lo[lo.length - 1] + hi[hi.length - 1]) / 2
          medians.push(med)
          t.push({
            step: 'median',
            note:
              lo.length > hi.length
                ? `Odd count: the median is the lower half's top, ${med}.`
                : `Even count: the median is the average of the two tops, (${lo[lo.length - 1]} + ${hi[hi.length - 1]}) / 2 = ${med}.`,
            view: view('good'),
            vars: [['median', med, 'ok']],
            badge: { text: `median ${med}`, accent: 'ok' },
          })
        }

        t.push({
          step: 'done',
          note: `Stream processed: medians [${medians.join(', ')}]. Each insert cost one push and at most one transfer — O(log n) with real heaps, versus re-sorting at O(n log n) per query.`,
          view: view('idle'),
          vars: [['answer', `[${medians.join(', ')}]`, 'ok']],
          badge: { text: 'stream complete', accent: 'ok' },
        })
      },

      run([nums]: [number[]], c) {
        // binary-heap implementation, so the measured growth is the real thing
        const lo: number[] = [] // max-heap
        const hi: number[] = [] // min-heap
        const push = (h: number[], x: number, cmp: (a: number, b: number) => boolean) => {
          h.push(x)
          let i = h.length - 1
          while (i > 0) {
            const p = (i - 1) >> 1
            if (!cmp(h[i], h[p])) break
            c.ops++
            ;[h[i], h[p]] = [h[p], h[i]]
            i = p
          }
        }
        const pop = (h: number[], cmp: (a: number, b: number) => boolean) => {
          const top = h[0]
          const last = h.pop()!
          if (h.length) {
            h[0] = last
            let i = 0
            for (;;) {
              const l = 2 * i + 1
              const r = 2 * i + 2
              let best = i
              if (l < h.length && cmp(h[l], h[best])) best = l
              if (r < h.length && cmp(h[r], h[best])) best = r
              if (best === i) break
              c.ops++
              ;[h[i], h[best]] = [h[best], h[i]]
              i = best
            }
          }
          return top
        }
        const gt = (a: number, b: number) => a > b
        const lt = (a: number, b: number) => a < b
        const out: number[] = []
        for (const x of nums) {
          c.ops++
          push(lo, x, gt)
          push(hi, pop(lo, gt), lt)
          if (hi.length > lo.length) push(lo, pop(hi, lt), gt)
          out.push(lo.length > hi.length ? lo[0] : (lo[0] + hi[0]) / 2)
        }
        return out
      },
    },
  ],
}
