import { grid, type Problem, type Tone } from '@/lib/types'

const DEMO: [number, number] = [3, 5]

export const uniquePaths: Problem = {
  id: 'unique-paths',
  title: 'Unique Paths',
  group: 'Dynamic Programming',
  pattern: '2D DP',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/unique-paths/',
  statement:
    'A robot starts at the top-left of an `m x n` grid and can only move right or down. How many distinct paths reach the bottom-right corner?',
  constraints: ['1 <= m, n <= 100', 'Only right and down moves'],
  signature: {
    fn: 'uniquePaths',
    params: [
      { name: 'm', type: 'int' },
      { name: 'n', type: 'int' },
    ],
    ret: 'int',
  },
  tests: [
    { args: [3, 7], expect: 28 },
    { args: [3, 2], expect: 3 },
    { args: [1, 1], expect: 1, note: 'already there' },
    { args: [4, 4], expect: 20 },
  ],
  demo: DEMO,
  scale: (n) => {
    const k = Math.max(2, Math.round(Math.sqrt(n)))
    return [k, k]
  },
  starter: {
    js: `function uniquePaths(m, n) {
  // m: number, n: number  ->  number
}
`,
    cpp: `int uniquePaths(int m, int n) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'dp',
      label: 'Paths in = paths from above + paths from the left',
      kind: 'optimal',
      time: 'O(m * n)',
      space: 'O(n)',
      blurb:
        'Every path into a cell arrives from directly above or directly left — there is no third door. So the count for each cell is the sum of those two neighbours, and the border cells are all 1 because there is only one straight-line way along an edge.',
      code: {
        cpp: {
          lines: [
            'int uniquePaths(int m, int n) {',
            '    vector<int> row(n, 1);',
            '    for (int i = 1; i < m; ++i)',
            '        for (int j = 1; j < n; ++j)',
            '            row[j] += row[j - 1];',
            '    return row[n - 1];',
            '}',
          ],
          map: { init: 2, fill: 5, done: 6 },
        },
        js: {
          lines: [
            'function uniquePaths(m, n) {',
            '  const row = new Array(n).fill(1);',
            '  for (let i = 1; i < m; i++) {',
            '    for (let j = 1; j < n; j++) {',
            '      row[j] += row[j - 1];',
            '    }',
            '  }',
            '  return row[n - 1];',
            '}',
          ],
          map: { init: 2, fill: 5, done: 9 },
        },
      },

      trace(t, [m, n]: [number, number]) {
        // full table for the visual; the shown code compresses it to one row
        const dp: number[][] = Array.from({ length: m }, (_, i) =>
          Array.from({ length: n }, (_, j) => (i === 0 || j === 0 ? 1 : 0)),
        )

        const paint = (ci: number | null, cj: number | null) => {
          const tones: Record<string, Tone> = {}
          for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
              const filled = dp[i][j] !== 0
              tones[`${i},${j}`] = filled ? 'done' : 'idle'
            }
          }
          if (ci != null && cj != null) {
            tones[`${ci - 1},${cj}`] = 'active'
            tones[`${ci},${cj - 1}`] = 'active'
            tones[`${ci},${cj}`] = 'good'
          }
          return grid(
            dp.map((row) => row.map((v) => (v === 0 ? '·' : v))),
            { tones, cursor: ci != null && cj != null ? [ci, cj] : null, title: 'paths into each cell' },
          )
        }

        t.push({
          step: 'init',
          note: 'The first row and first column are all 1: hugging an edge leaves no choices. Every interior cell will be the sum of its two doors.',
          view: paint(null, null),
          vars: [
            ['m', m],
            ['n', n],
          ],
        })

        for (let i = 1; i < m && !t.full; i++) {
          for (let j = 1; j < n && !t.full; j++) {
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1]
            t.bump()
            t.push({
              step: 'fill',
              note: `Cell (${i}, ${j}): ${dp[i - 1][j]} paths arrive from above, ${dp[i][j - 1]} from the left — ${dp[i][j]} in total.`,
              view: paint(i, j),
              vars: [
                ['cell', `(${i}, ${j})`, 'b'],
                ['from above', dp[i - 1][j], 'c'],
                ['from left', dp[i][j - 1], 'c'],
                ['paths', dp[i][j], 'ok'],
              ],
              badge: { text: `${dp[i - 1][j]} + ${dp[i][j - 1]} = ${dp[i][j]}`, accent: 'ok' },
            })
          }
        }

        t.push({
          step: 'done',
          note: `${dp[m - 1][n - 1]} distinct paths reach the corner. (This is also the binomial coefficient C(${m + n - 2}, ${m - 1}) — the DP just computes it without factorials.)`,
          view: paint(null, null),
          vars: [['answer', dp[m - 1][n - 1], 'ok']],
          badge: { text: `${dp[m - 1][n - 1]} paths`, accent: 'ok' },
        })
      },

      run([m, n]: [number, number], c) {
        const row = new Array(n).fill(1)
        for (let i = 1; i < m; i++) {
          for (let j = 1; j < n; j++) {
            c.ops++
            row[j] += row[j - 1]
          }
        }
        return row[n - 1]
      },
    },
  ],
}
