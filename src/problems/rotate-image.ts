import { grid, type Problem, type Tone } from '@/lib/types'

const DEMO: [number[][]] = [
  [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ],
]

export const rotateImage: Problem = {
  id: 'rotate-image',
  title: 'Rotate Image',
  group: 'Matrix',
  pattern: 'Transpose + Reverse',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/rotate-image/',
  statement:
    'Rotate an `n x n` matrix 90 degrees clockwise, in place, and return it. No second matrix allowed.',
  constraints: ['1 <= n <= 20', 'Must be in place'],
  signature: { fn: 'rotate', params: [{ name: 'matrix', type: 'int[][]' }], ret: 'int[][]' },
  tests: [
    { args: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], expect: [[7, 4, 1], [8, 5, 2], [9, 6, 3]] },
    {
      args: [[[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]]],
      expect: [[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]],
    },
    { args: [[[1]]], expect: [[1]] },
  ],
  demo: DEMO,
  scale: (n) => {
    const k = Math.max(2, Math.round(Math.sqrt(n)))
    return [Array.from({ length: k }, (_, r) => Array.from({ length: k }, (_, c) => r * k + c))]
  },
  starter: {
    js: `function rotate(matrix) {
  // matrix: number[][]  ->  number[][]  (rotate in place, return it)
}
`,
    cpp: `vector<vector<int>> rotate(vector<vector<int>>& matrix) {
    // rotate in place, return matrix
}
`,
  },

  solutions: [
    {
      id: 'transpose-reverse',
      label: 'Transpose, then mirror each row',
      kind: 'optimal',
      time: 'O(n^2)',
      space: 'O(1)',
      blurb:
        'A 90-degree clockwise turn is two mirrors: flip across the main diagonal (transpose), then flip each row left-to-right. Both mirrors are trivial in-place swaps, and chaining them gives the rotation with no scratch matrix.',
      code: {
        cpp: {
          lines: [
            'vector<vector<int>> rotate(vector<vector<int>>& matrix) {',
            '    int n = matrix.size();',
            '    for (int i = 0; i < n; ++i)',
            '        for (int j = i + 1; j < n; ++j)',
            '            swap(matrix[i][j], matrix[j][i]);',
            '    for (auto& row : matrix)',
            '        reverse(row.begin(), row.end());',
            '    return matrix;',
            '}',
          ],
          map: { init: 2, swap: 5, mirror: 7, done: 8 },
        },
        js: {
          lines: [
            'function rotate(matrix) {',
            '  const n = matrix.length;',
            '  for (let i = 0; i < n; i++) {',
            '    for (let j = i + 1; j < n; j++) {',
            '      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];',
            '    }',
            '  }',
            '  for (const row of matrix) row.reverse();',
            '  return matrix;',
            '}',
          ],
          map: { init: 2, swap: 5, mirror: 8, done: 9 },
        },
      },

      trace(t, [input]: [number[][]]) {
        const matrix = input.map((row) => [...row])
        const n = matrix.length

        const paint = (a: [number, number] | null, b: [number, number] | null) => {
          const tones: Record<string, Tone> = {}
          for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
              tones[`${i},${j}`] = i === j ? 'band' : 'idle'
            }
          }
          if (a) tones[`${a[0]},${a[1]}`] = 'active'
          if (b) tones[`${b[0]},${b[1]}`] = 'good'
          return grid(matrix.map((r) => [...r]), { tones, cursor: a, title: 'matrix (diagonal highlighted)' })
        }

        t.push({
          step: 'init',
          note: 'Phase 1: transpose. Every cell above the diagonal trades places with its mirror below. The diagonal itself stays put.',
          view: paint(null, null),
          vars: [['n', n]],
        })

        for (let i = 0; i < n && !t.full; i++) {
          for (let j = i + 1; j < n && !t.full; j++) {
            ;[matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]]
            t.bump()
            t.push({
              step: 'swap',
              note: `Swap (${i}, ${j}) with (${j}, ${i}) across the diagonal — rows are becoming columns.`,
              view: paint([i, j], [j, i]),
              vars: [
                ['pair', `(${i},${j}) ↔ (${j},${i})`, 'c'],
                ['values', `${matrix[j][i]} ↔ ${matrix[i][j]}`],
              ],
              badge: { text: `transpose swap`, accent: 'c' },
            })
          }
        }

        for (const row of matrix) row.reverse()
        t.push({
          step: 'mirror',
          note: 'Phase 2: mirror every row left-to-right. Transpose + horizontal mirror = 90° clockwise. (Mirror vertically instead and you would get counter-clockwise.)',
          view: paint(null, null),
          vars: [['rows reversed', n, 'ok']],
          badge: { text: 'rows mirrored', accent: 'ok' },
        })

        t.push({
          step: 'done',
          note: 'Rotated in place — every element moved through two simple swaps, no second matrix.',
          view: paint(null, null),
          vars: [['answer', 'rotated 90° clockwise', 'ok']],
          badge: { text: 'rotated', accent: 'ok' },
        })
      },

      run([input]: [number[][]], c) {
        const matrix = input.map((row) => [...row])
        const n = matrix.length
        for (let i = 0; i < n; i++)
          for (let j = i + 1; j < n; j++) {
            c.ops++
            ;[matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]]
          }
        for (const row of matrix) {
          c.ops++
          row.reverse()
        }
        return matrix
      },
    },
  ],
}
