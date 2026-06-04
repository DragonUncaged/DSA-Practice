import { grid, type Problem, type Tone } from '@/lib/types'

const DEMO: [number] = [8]

export const countingBits: Problem = {
  id: 'counting-bits',
  title: 'Counting Bits',
  group: 'Binary',
  pattern: 'DP on Bits',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/counting-bits/',
  statement:
    'Given `n`, return an array `ans` of length `n + 1` where `ans[i]` is the number of `1` bits in `i`. Aim for O(n) — better than running a popcount on every number.',
  constraints: ['0 <= n <= 10^5', 'O(n) expected'],
  signature: { fn: 'countBits', params: [{ name: 'n', type: 'int' }], ret: 'int[]' },
  tests: [
    { args: [2], expect: [0, 1, 1] },
    { args: [5], expect: [0, 1, 1, 2, 1, 2] },
    { args: [0], expect: [0], note: 'just zero' },
    { args: [8], expect: [0, 1, 1, 2, 1, 2, 2, 3, 1] },
  ],
  demo: DEMO,
  scale: (n) => [n],
  starter: {
    js: `function countBits(n) {
  // n: number  ->  number[]
}
`,
    cpp: `vector<int> countBits(int n) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'dp',
      label: 'Reuse the smaller answer',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'i >> 1 is i with its last bit chopped off — and its bit count is already in the table. So bits(i) is bits(i >> 1) plus i\'s own last bit. Every entry costs one addition.',
      code: {
        cpp: {
          lines: [
            'vector<int> countBits(int n) {',
            '    vector<int> bits(n + 1, 0);',
            '    for (int i = 1; i <= n; ++i)',
            '        bits[i] = bits[i >> 1] + (i & 1);',
            '    return bits;',
            '}',
          ],
          map: { init: 2, fill: 4, done: 5 },
        },
        js: {
          lines: [
            'function countBits(n) {',
            '  const bits = new Array(n + 1).fill(0);',
            '  for (let i = 1; i <= n; i++) {',
            '    bits[i] = bits[i >> 1] + (i & 1);',
            '  }',
            '  return bits;',
            '}',
          ],
          map: { init: 2, fill: 4, done: 7 },
        },
      },

      trace(t, [n]: [number]) {
        const bits = new Array(n + 1).fill(0)
        const labels = Array.from({ length: n + 1 }, (_, i) => String(i))

        const paint = (i: number | null, half: number | null) => {
          const tones: Record<string, Tone> = {}
          for (let k = 0; k <= n; k++) {
            tones[`0,${k}`] = i == null ? 'done' : k < i ? 'done' : 'idle'
          }
          if (half != null) tones[`0,${half}`] = 'active'
          if (i != null) tones[`0,${i}`] = 'good'
          return grid([bits.slice()], {
            tones,
            cursor: i != null ? [0, i] : null,
            colLabels: labels,
            rowLabels: ['bits'],
            title: 'set-bit count for each number',
          })
        }

        t.push({
          step: 'init',
          note: 'bits[0] = 0 is the only free answer. Every other entry borrows from an entry already filled in.',
          view: paint(null, null),
          vars: [['bits[0]', 0, 'ok']],
        })

        for (let i = 1; i <= n && !t.full; i++) {
          const half = i >> 1
          bits[i] = bits[half] + (i & 1)
          t.bump()
          t.push({
            step: 'fill',
            note: `${i} is ${half} shifted left${i & 1 ? ' plus a trailing 1' : ''} — so bits[${i}] = bits[${half}] + ${i & 1} = ${bits[i]}. (${i} in binary: ${i.toString(2)})`,
            view: paint(i, half),
            vars: [
              ['i', i, 'b'],
              [`bits[${half}]`, bits[half], 'c'],
              ['i & 1', i & 1],
              [`bits[${i}]`, bits[i], 'ok'],
            ],
            badge: { text: `${bits[half]} + ${i & 1} = ${bits[i]}`, accent: 'ok' },
          })
        }

        t.push({
          step: 'done',
          note: `Table complete: one addition per entry, ${n} additions total. A per-number popcount would have cost O(n log n).`,
          view: paint(null, null),
          vars: [['answer', `[${bits.join(', ')}]`, 'ok']],
          badge: { text: 'filled', accent: 'ok' },
        })
      },

      run([n]: [number], c) {
        const bits = new Array(n + 1).fill(0)
        for (let i = 1; i <= n; i++) {
          c.ops++
          bits[i] = bits[i >> 1] + (i & 1)
        }
        return bits
      },
    },
  ],
}
