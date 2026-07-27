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
    { args: [[[1], [2], [3]]], expect: true, note: 'so is a single column' },
    { args: [[[7]]], expect: true },
    {
      args: [
        [
          [1, 2],
          [3, 1],
        ],
      ],
      expect: true,
    },
    {
      args: [
        [
          [1, 2, 3],
          [4, 1, 2],
          [5, 4, 9],
        ],
      ],
      expect: false,
      note: 'the only mismatch is the bottom-right cell',
    },
    {
      args: [Array.from({ length: 60 }, (_, r) => Array.from({ length: 60 }, (_, c) => (r - c + 60) % 100))],
      expect: true,
      note: 'a large matrix built from r - c',
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
      id: 'group-by-diagonal',
      label: 'Group cells by diagonal in a map',
      kind: 'brute',
      time: 'O(rows * cols)',
      space: 'O(rows + cols)',
      blurb:
        'Every cell on one diagonal shares the same value of `row - col`, so that difference names the diagonal. Record the first value seen for each name in a map, and reject the matrix the moment a later cell on the same diagonal disagrees. It reads every cell once but needs a map entry per diagonal, and the map is doing a job the matrix layout already does for free.',
      code: {
        cpp: {
          lines: [
            'bool isToeplitz(vector<vector<int>>& matrix) {',
            '    unordered_map<int, int> first;',
            '    for (int r = 0; r < (int)matrix.size(); ++r)',
            '        for (int c = 0; c < (int)matrix[r].size(); ++c) {',
            '            auto it = first.find(r - c);',
            '            if (it == first.end()) first[r - c] = matrix[r][c];',
            '            else if (it->second != matrix[r][c]) return false;',
            '        }',
            '    return true;',
            '}',
          ],
        },
        js: {
          lines: [
            'function isToeplitz(matrix) {',
            '  const first = new Map();',
            '  for (let r = 0; r < matrix.length; r++)',
            '    for (let c = 0; c < matrix[r].length; c++) {',
            '      const key = r - c;',
            '      if (!first.has(key)) first.set(key, matrix[r][c]);',
            '      else if (first.get(key) !== matrix[r][c]) return false;',
            '    }',
            '  return true;',
            '}',
          ],
        },
      },
      run([matrix]: [number[][]], c) {
        const first = new Map<number, number>()
        for (let r = 0; r < matrix.length; r++)
          for (let col = 0; col < matrix[r].length; col++) {
            c.ops++
            const key = r - col
            if (!first.has(key)) first.set(key, matrix[r][col])
            else if (first.get(key) !== matrix[r][col]) return false
          }
        return true
      },
    },
    {
      id: 'diagonal-neighbour',
      label: 'Compare each cell with the one up-left',
      kind: 'optimal',
      time: 'O(rows * cols)',
      space: 'O(1)',
      blurb:
        'The map is unnecessary: two cells sit on the same diagonal exactly when one is directly up-and-left of the other, so a diagonal is constant precisely when every such neighbour pair agrees. A single pass that checks each cell against its up-left neighbour covers every diagonal with no extra memory, and any mismatch anywhere disproves the whole matrix.',
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
