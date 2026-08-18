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
    { args: [[[1], [2], [3]], [[4, 5]]], expect: [[4, 5], [8, 10], [12, 15]], note: 'a column times a row' },
    {
      args: [[[-100, 100], [100, -100]], [[100, -100], [-100, 100]]],
      expect: [[-20000, 20000], [20000, -20000]],
      note: 'the extreme values allowed',
    },
  ],
  scale: (n) => {
    const side = Math.max(2, Math.round(Math.sqrt(n)))
    const sparse = (shift: number) =>
      Array.from({ length: side }, (_, r) => Array.from({ length: side }, (_, c) => ((r + c + shift) % side === 0 ? 1 : 0)))
    return [sparse(0), sparse(1)]
  },
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
      id: 'triple-loop',
      label: 'The textbook triple loop',
      kind: 'brute',
      time: 'O(m * k * n)',
      space: 'O(m * n)',
      blurb:
        'Every output cell is the dot product of a row of `mat1` with a column of `mat2`, so compute each one directly. Correct for any matrices, and blind to sparsity: nearly every multiplication is by zero and contributes nothing.',
      code: {
        cpp: {
          lines: [
            'vector<vector<int>> multiply(vector<vector<int>>& mat1, vector<vector<int>>& mat2) {',
            '    int m = mat1.size(), k = mat2.size(), n = mat2[0].size();',
            '    vector<vector<int>> out(m, vector<int>(n, 0));',
            '    for (int i = 0; i < m; ++i)',
            '        for (int j = 0; j < n; ++j)',
            '            for (int p = 0; p < k; ++p)',
            '                out[i][j] += mat1[i][p] * mat2[p][j];',
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
            '  for (let i = 0; i < m; i++) {',
            '    for (let j = 0; j < n; j++) {',
            '      for (let p = 0; p < k; p++) {',
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
          for (let j = 0; j < n; j++) {
            for (let p = 0; p < k; p++) {
              c.ops++
              out[i][j] += mat1[i][p] * mat2[p][j]
            }
          }
        }
        return out
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'skip-zeros',
      label: 'Skip the zeros on both sides',
      kind: 'better',
      time: 'O(nnz1 * n + m * k)',
      space: 'O(m * n)',
      blurb:
        'The triple loop spends nearly all of its time multiplying by zero. Reorder it to walk `mat1` row by row, and for each non-zero entry `mat1[i][p]` add its contribution across row `p` of `mat2`. Zeros in `mat1` never enter the inner loop, though the inner loop still scans all `n` cells of the `mat2` row.',
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
    // -----------------------------------------------------------------------
    {
      id: 'compressed-rows',
      label: 'Compress mat2 into lists of non-zero entries',
      kind: 'optimal',
      time: 'O(m * k + k * n + nnz1 * r)',
      space: 'O(m * n + nnz2)',
      blurb:
        'Skipping zeros in `mat1` still walks the full width of `mat2` for every survivor, testing each cell. Pre-scan `mat2` once into a per-row list of `(column, value)` pairs that are non-zero. Then each non-zero `mat1[i][p]` touches only the `r` real entries of row `p` — the zeros are never even looked at.',
      code: {
        cpp: {
          lines: [
            'vector<vector<int>> multiply(vector<vector<int>>& mat1, vector<vector<int>>& mat2) {',
            '    int m = mat1.size(), k = mat2.size(), n = mat2[0].size();',
            '    vector<vector<pair<int, int>>> rows(k);  // (column, value) per row of mat2',
            '    for (int p = 0; p < k; ++p)',
            '        for (int j = 0; j < n; ++j)',
            '            if (mat2[p][j] != 0) rows[p].push_back({j, mat2[p][j]});',
            '',
            '    vector<vector<int>> out(m, vector<int>(n, 0));',
            '    for (int i = 0; i < m; ++i)',
            '        for (int p = 0; p < k; ++p) {',
            '            if (mat1[i][p] == 0) continue;',
            '            for (auto [j, v] : rows[p]) out[i][j] += mat1[i][p] * v;',
            '        }',
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
            '  // (column, value) pairs per row of mat2, zeros dropped',
            '  const rows = mat2.map((row) => {',
            '    const entries = [];',
            '    row.forEach((v, j) => { if (v !== 0) entries.push([j, v]); });',
            '    return entries;',
            '  });',
            '',
            '  const out = Array.from({ length: m }, () => new Array(n).fill(0));',
            '  for (let i = 0; i < m; i++) {',
            '    for (let p = 0; p < k; p++) {',
            '      if (mat1[i][p] === 0) continue;',
            '      for (const [j, v] of rows[p]) out[i][j] += mat1[i][p] * v;',
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
        const rows = mat2.map((row) => {
          const entries: [number, number][] = []
          row.forEach((v, j) => {
            c.ops++
            if (v !== 0) entries.push([j, v])
          })
          return entries
        })
        const out = Array.from({ length: m }, () => new Array<number>(n).fill(0))
        for (let i = 0; i < m; i++) {
          for (let p = 0; p < k; p++) {
            c.ops++
            if (mat1[i][p] === 0) continue
            for (const [j, v] of rows[p]) {
              c.ops++
              out[i][j] += mat1[i][p] * v
            }
          }
        }
        return out
      },
    },
  ],
}
