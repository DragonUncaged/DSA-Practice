import type { Problem } from '@/lib/types'

export const toeplitzMatrix: Problem = {
  id: 'toeplitz-matrix',
  title: 'Toeplitz Matrix',
  group: 'Matrix',
  pattern: 'Neighbour Comparison',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/toeplitz-matrix/',
  statement:
    'A matrix is Toeplitz when every diagonal running from top-left to bottom-right holds one repeated value. Return `true` if `matrix` is Toeplitz.',
  constraints: ['1 <= rows, cols <= 300', '0 <= matrix[i][j] <= 99'],
  signature: { fn: 'isToeplitz', params: [{ name: 'matrix', type: 'int[][]' }], ret: 'bool' },
  tests: [
    {
      args: [
        [
          [1, 2, 3, 4],
          [5, 1, 2, 3],
          [9, 5, 1, 2],
        ],
      ],
      expect: true,
    },
    {
      args: [
        [
          [1, 2],
          [2, 2],
        ],
      ],
      expect: false,
    },
    { args: [[[1, 2, 3]]], expect: true, note: 'a single row is always Toeplitz' },
    {
      args: [
        [
          [1, 2],
          [3, 1],
        ],
      ],
      expect: true,
    },
  ],
  demo: [
    [
      [1, 2, 3, 4],
      [5, 1, 2, 3],
      [9, 5, 1, 2],
    ],
  ],
  scale: (n) => {
    const side = Math.max(2, Math.round(Math.sqrt(n)))
    return [Array.from({ length: side }, (_, r) => Array.from({ length: side }, (_, c) => r - c))]
  },
  starter: {
    js: `function isToeplitz(matrix) {
  // matrix: number[][]  ->  boolean
}
`,
    cpp: `bool isToeplitz(vector<vector<int>>& matrix) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'diagonal-neighbour',
      label: 'Compare each cell with the one up-left',
      kind: 'optimal',
      time: 'O(rows * cols)',
      space: 'O(1)',
      blurb:
        'Walking a diagonal is unnecessary: two cells sit on the same diagonal exactly when one is directly up-and-left of the other. So a single pass that checks every cell against its up-left neighbour covers every diagonal, and any mismatch anywhere disproves the whole matrix.',
      code: {
        cpp: {
          lines: [
            'bool isToeplitz(vector<vector<int>>& matrix) {',
            '    for (size_t r = 1; r < matrix.size(); ++r)',
            '        for (size_t c = 1; c < matrix[r].size(); ++c)',
            '            if (matrix[r][c] != matrix[r - 1][c - 1]) return false;',
            '    return true;',
            '}',
          ],
        },
        js: {
          lines: [
            'function isToeplitz(matrix) {',
            '  for (let r = 1; r < matrix.length; r++)',
            '    for (let c = 1; c < matrix[r].length; c++)',
            '      if (matrix[r][c] !== matrix[r - 1][c - 1]) return false;',
            '  return true;',
            '}',
          ],
        },
      },

      run([matrix]: [number[][]], c) {
        for (let r = 1; r < matrix.length; r++) {
          for (let col = 1; col < matrix[r].length; col++) {
            c.ops++
            if (matrix[r][col] !== matrix[r - 1][col - 1]) return false
          }
        }
        return true
      },
    },
  ],
}
