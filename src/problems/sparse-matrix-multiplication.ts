import type { Problem } from '@/lib/types'

export const sparseMatrixMultiplication: Problem = {
  id: 'sparse-matrix-multiplication',
  title: 'Sparse Matrix Multiplication',
  group: 'Medium',
  pattern: 'Hash Map',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/sparse-matrix-multiplication/',
  statement:
    'Given two sparse matrices `mat1` of size `m x k` and `mat2` of size `k x n`, return their product. Multiplication is always possible.',
  constraints: [
    'm == mat1.length, k == mat1[i].length == mat2.length, n == mat2[i].length',
    '1 <= m, n, k <= 100',
    '-100 <= mat1[i][j], mat2[i][j] <= 100',
  ],
  signature: {
    fn: 'multiply',
    params: [
      { name: 'mat1', type: 'int[][]' },
      { name: 'mat2', type: 'int[][]' },
    ],
    ret: 'int[][]',
  },
  tests: [
    { args: [[[1, 0, 0], [-1, 0, 3]], [[7, 0, 0], [0, 0, 0], [0, 0, 1]]], expect: [[7, 0, 0], [-7, 0, 3]] },
    { args: [[[0]], [[0]]], expect: [[0]], note: 'one zero cell' },
    { args: [[[1, 2], [3, 4]], [[5, 6], [7, 8]]], expect: [[19, 22], [43, 50]], note: 'dense' },
    { args: [[[1]], [[1, 2, 3]]], expect: [[1, 2, 3]], note: 'a row vector' },
    { args: [[[0, 0], [0, 0]], [[1, 1], [1, 1]]], expect: [[0, 0], [0, 0]], note: 'all zeros' },
  ],
  demo: [[[1, 0, 0], [-1, 0, 3]], [[7, 0, 0], [0, 0, 0], [0, 0, 1]]],
  starter: {
    js: `function multiply(mat1, mat2) {
  // mat1: number[][], mat2: number[][]  ->  number[][]
}
`,
    cpp: `vector<vector<int>> multiply(vector<vector<int>>& mat1, vector<vector<int>>& mat2) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'skip-zeros',
      label: 'Skip the zeros on both sides',
      kind: 'optimal',
      time: 'O(nnz1 * n / k + m * k)',
      space: 'O(m * n)',
      blurb:
        'The textbook triple loop spends nearly all of its time multiplying by zero. Walk `mat1` row by row instead, and for each non-zero entry `mat1[i][p]` add its contribution across the non-zero entries of row `p` in `mat2`. Zeros never enter the inner loop.',
      code: {
        cpp: {
          lines: [
            'vector<vector<int>> multiply(vector<vector<int>>& mat1, vector<vector<int>>& mat2) {',
            '    int m = mat1.size(), k = mat2.size(), n = mat2[0].size();',
            '    vector<vector<int>> out(m, vector<int>(n, 0));',
            '',
            '    for (int i = 0; i < m; ++i) {',
            '        for (int p = 0; p < k; ++p) {',
            '            if (mat1[i][p] == 0) continue;',
            '            for (int j = 0; j < n; ++j) {',
            '                if (mat2[p][j] == 0) continue;',
            '                out[i][j] += mat1[i][p] * mat2[p][j];',
            '            }',
            '        }',
            '    }',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function multiply(mat1, mat2) {',
            '  const m = mat1.length;',
            '  const k = mat2.length;',
            '  const n = mat2[0].length;',
            '  const out = Array.from({ length: m }, () => new Array(n).fill(0));',
            '',
            '  for (let i = 0; i < m; i++) {',
            '    for (let p = 0; p < k; p++) {',
            '      if (mat1[i][p] === 0) continue;',
            '      for (let j = 0; j < n; j++) {',
            '        if (mat2[p][j] === 0) continue;',
            '        out[i][j] += mat1[i][p] * mat2[p][j];',
            '      }',
            '    }',
            '  }',
            '  return out;',
            '}',
          ],
        },
      },

      run([mat1, mat2]: [number[][], number[][]], c) {
        const m = mat1.length
        const k = mat2.length
        const n = mat2[0].length
        const out = Array.from({ length: m }, () => new Array<number>(n).fill(0))
        for (let i = 0; i < m; i++) {
          for (let p = 0; p < k; p++) {
            c.ops++
            if (mat1[i][p] === 0) continue
            for (let j = 0; j < n; j++) {
              c.ops++
              if (mat2[p][j] === 0) continue
              out[i][j] += mat1[i][p] * mat2[p][j]
            }
          }
        }
        return out
      },
    },
  ],
}
