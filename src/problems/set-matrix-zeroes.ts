import { grid, type Problem, type Tone } from '@/lib/types'

const DEMO: [number[][]] = [
  [
    [1, 1, 2, 1],
    [3, 0, 5, 2],
    [1, 3, 1, 5],
  ],
]

export const setMatrixZeroes: Problem = {
  id: 'set-matrix-zeroes',
  title: 'Set Matrix Zeroes',
  group: 'Matrix',
  pattern: 'In-place Marking',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/set-matrix-zeroes/',
  statement:
    "If an element of the matrix is `0`, set its entire row and column to `0` — in place. Return the matrix. The catch: do it without allocating a full copy.",
  constraints: ['1 <= m, n <= 200', 'Aim for O(1) extra space'],
  signature: { fn: 'setZeroes', params: [{ name: 'matrix', type: 'int[][]' }], ret: 'int[][]' },
  tests: [
    {
      args: [[[1, 1, 1], [1, 0, 1], [1, 1, 1]]],
      expect: [[1, 0, 1], [0, 0, 0], [1, 0, 1]],
    },
    {
      args: [[[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]],
      expect: [[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]],
    },
    { args: [[[7]]], expect: [[7]], note: 'no zeros at all' },
  ],
  demo: DEMO,
  scale: (n) => {
    const k = Math.max(2, Math.round(Math.sqrt(n)))
    return [Array.from({ length: k }, (_, r) => Array.from({ length: k }, (_, c) => ((r + c) % 7 === 3 ? 0 : 1)))]
  },
  starter: {
    js: `function setZeroes(matrix) {
  // matrix: number[][]  ->  number[][]  (mutate and return it)
}
`,
    cpp: `vector<vector<int>> setZeroes(vector<vector<int>>& matrix) {
    // mutate and return matrix
}
`,
  },

  solutions: [
    {
      id: 'first-row-col',
      label: 'Use row 0 and column 0 as the notebook',
      kind: 'optimal',
      time: 'O(m * n)',
      space: 'O(1)',
      blurb:
        'You cannot zero things as you find them — you would no longer know which zeros were original. The trick: write the "this row/column must die" marks into the first row and first column themselves, which are about to be zeroed anyway, plus two booleans for their own fate.',
      code: {
        cpp: {
          lines: [
            'vector<vector<int>> setZeroes(vector<vector<int>>& matrix) {',
            '    int m = matrix.size(), n = matrix[0].size();',
            '    bool row0 = false, col0 = false;',
            '    for (int j = 0; j < n; ++j) if (!matrix[0][j]) row0 = true;',
            '    for (int i = 0; i < m; ++i) if (!matrix[i][0]) col0 = true;',
            '    for (int i = 1; i < m; ++i)',
            '        for (int j = 1; j < n; ++j)',
            '            if (!matrix[i][j]) matrix[i][0] = matrix[0][j] = 0;',
            '    for (int i = 1; i < m; ++i)',
            '        for (int j = 1; j < n; ++j)',
            '            if (!matrix[i][0] || !matrix[0][j]) matrix[i][j] = 0;',
            '    if (row0) for (int j = 0; j < n; ++j) matrix[0][j] = 0;',
            '    if (col0) for (int i = 0; i < m; ++i) matrix[i][0] = 0;',
            '    return matrix;',
            '}',
          ],
          map: { init: 5, mark: 8, wipe: 11, edges: 12, done: 14 },
        },
        js: {
          lines: [
            'function setZeroes(matrix) {',
            '  const m = matrix.length;',
            '  const n = matrix[0].length;',
            '  const row0 = matrix[0].some((x) => x === 0);',
            '  const col0 = matrix.some((row) => row[0] === 0);',
            '  for (let i = 1; i < m; i++)',
            '    for (let j = 1; j < n; j++)',
            '      if (matrix[i][j] === 0) { matrix[i][0] = 0; matrix[0][j] = 0; }',
            '  for (let i = 1; i < m; i++)',
            '    for (let j = 1; j < n; j++)',
            '      if (matrix[i][0] === 0 || matrix[0][j] === 0) matrix[i][j] = 0;',
            '  if (row0) matrix[0].fill(0);',
            '  if (col0) for (let i = 0; i < m; i++) matrix[i][0] = 0;',
            '  return matrix;',
            '}',
          ],
          map: { init: 5, mark: 8, wipe: 11, edges: 12, done: 15 },
        },
      },

      trace(t, [input]: [number[][]]) {
        const matrix = input.map((row) => [...row])
        const m = matrix.length
        const n = matrix[0].length

        const paint = (focus: [number, number] | null, tone: Tone, marks: boolean) => {
          const tones: Record<string, Tone> = {}
          for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
              tones[`${i},${j}`] = 'idle'
              if (marks && (i === 0 || j === 0)) tones[`${i},${j}`] = matrix[i][j] === 0 ? 'bad' : 'band'
            }
          }
          if (focus) tones[`${focus[0]},${focus[1]}`] = tone
          return grid(matrix.map((r) => [...r]), { tones, cursor: focus, title: 'matrix (mutating in place)' })
        }

        const row0 = matrix[0].some((x) => x === 0)
        const col0 = matrix.some((row) => row[0] === 0)

        t.push({
          step: 'init',
          note: `First, remember whether row 0 (${row0 ? 'yes' : 'no'}) and column 0 (${col0 ? 'yes' : 'no'}) themselves contain zeros — they are about to be overwritten with bookkeeping.`,
          view: paint(null, 'idle', false),
          vars: [
            ['row 0 dies', String(row0), row0 ? 'no' : 'ok'],
            ['col 0 dies', String(col0), col0 ? 'no' : 'ok'],
          ],
        })

        for (let i = 1; i < m && !t.full; i++) {
          for (let j = 1; j < n && !t.full; j++) {
            t.bump()
            if (matrix[i][j] === 0) {
              matrix[i][0] = 0
              matrix[0][j] = 0
              t.push({
                step: 'mark',
                note: `Zero found at (${i}, ${j}). Instead of a side list, mark its row and column by zeroing matrix[${i}][0] and matrix[0][${j}] — the first row/column doubles as the notebook.`,
                view: paint([i, j], 'bad', true),
                vars: [
                  ['zero at', `(${i}, ${j})`, 'no'],
                  ['marked', `row ${i}, col ${j}`, 'c'],
                ],
                badge: { text: `mark row ${i}, col ${j}`, accent: 'no' },
              })
            }
          }
        }

        let wiped = 0
        for (let i = 1; i < m && !t.full; i++) {
          for (let j = 1; j < n; j++) {
            t.bump()
            if (matrix[i][0] === 0 || matrix[0][j] === 0) {
              if (matrix[i][j] !== 0) wiped++
              matrix[i][j] = 0
            }
          }
        }
        t.push({
          step: 'wipe',
          note: `Second pass: every interior cell checks its two marks and zeroes itself if either is set — ${wiped} cells wiped.`,
          view: paint(null, 'idle', true),
          vars: [['cells wiped', wiped, 'no']],
          badge: { text: `${wiped} wiped`, accent: 'no' },
        })

        if (row0) matrix[0].fill(0)
        if (col0) for (let i = 0; i < m; i++) matrix[i][0] = 0
        t.push({
          step: 'edges',
          note: `Finally settle the notebook itself: row 0 ${row0 ? 'zeroes out' : 'survives'}, column 0 ${col0 ? 'zeroes out' : 'survives'} — using the booleans saved at the start.`,
          view: paint(null, 'idle', false),
          vars: [
            ['row 0', row0 ? 'zeroed' : 'kept', row0 ? 'no' : 'ok'],
            ['col 0', col0 ? 'zeroed' : 'kept', col0 ? 'no' : 'ok'],
          ],
        })

        t.push({
          step: 'done',
          note: 'Done in place: two sweeps plus the edge fix-up, and the only extra memory was two booleans.',
          view: paint(null, 'idle', false),
          vars: [['answer', 'matrix updated', 'ok']],
          badge: { text: 'complete', accent: 'ok' },
        })
      },

      run([input]: [number[][]], c) {
        const matrix = input.map((row) => [...row])
        const m = matrix.length
        const n = matrix[0].length
        const row0 = matrix[0].some((x) => x === 0)
        const col0 = matrix.some((row) => row[0] === 0)
        for (let i = 1; i < m; i++)
          for (let j = 1; j < n; j++) {
            c.ops++
            if (matrix[i][j] === 0) {
              matrix[i][0] = 0
              matrix[0][j] = 0
            }
          }
        for (let i = 1; i < m; i++)
          for (let j = 1; j < n; j++) {
            c.ops++
            if (matrix[i][0] === 0 || matrix[0][j] === 0) matrix[i][j] = 0
          }
        if (row0) matrix[0].fill(0)
        if (col0) for (let i = 0; i < m; i++) matrix[i][0] = 0
        return matrix
      },
    },
  ],
}
