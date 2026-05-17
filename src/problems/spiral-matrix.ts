import { arr, combo, grid, type Problem, type Tone } from '@/lib/types'

const DEMO: [number[][]] = [
  [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
  ],
]

export const spiralMatrix: Problem = {
  id: 'spiral-matrix',
  title: 'Spiral Matrix',
  group: 'Matrix',
  pattern: 'Shrinking Boundaries',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/spiral-matrix/',
  statement: 'Return all elements of an `m x n` matrix in spiral order, clockwise from the top-left.',
  constraints: ['1 <= m, n <= 10', '-100 <= matrix[i][j] <= 100'],
  signature: { fn: 'spiralOrder', params: [{ name: 'matrix', type: 'int[][]' }], ret: 'int[]' },
  tests: [
    { args: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], expect: [1, 2, 3, 6, 9, 8, 7, 4, 5] },
    { args: [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]], expect: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7] },
    { args: [[[7]]], expect: [7] },
    { args: [[[1], [2], [3]]], expect: [1, 2, 3], note: 'single column' },
  ],
  demo: DEMO,
  scale: (n) => {
    const k = Math.max(2, Math.round(Math.sqrt(n)))
    return [Array.from({ length: k }, (_, r) => Array.from({ length: k }, (_, c) => r * k + c))]
  },
  starter: {
    py: `def spiralOrder(matrix):
    # matrix: list[list[int]]  ->  list[int]
    pass
`,
    js: `function spiralOrder(matrix) {
  // matrix: number[][]  ->  number[]
}
`,
    cpp: `vector<int> spiralOrder(vector<vector<int>>& matrix) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'boundaries',
      label: 'Four walls closing in',
      kind: 'optimal',
      time: 'O(m * n)',
      space: 'O(1)',
      blurb:
        'Keep four boundaries — top, bottom, left, right. Walk the top row, then the right column, then the bottom row, then the left column, shrinking each wall after its pass. The spiral is just those four moves repeating until the walls cross.',
      code: {
        py: {
          lines: [
            'def spiralOrder(matrix):',
            '    out = []',
            '    top, bottom = 0, len(matrix) - 1',
            '    left, right = 0, len(matrix[0]) - 1',
            '    while top <= bottom and left <= right:',
            '        for j in range(left, right + 1):',
            '            out.append(matrix[top][j])',
            '        top += 1',
            '        for i in range(top, bottom + 1):',
            '            out.append(matrix[i][right])',
            '        right -= 1',
            '        if top <= bottom:',
            '            for j in range(right, left - 1, -1):',
            '                out.append(matrix[bottom][j])',
            '            bottom -= 1',
            '        if left <= right:',
            '            for i in range(bottom, top - 1, -1):',
            '                out.append(matrix[i][left])',
            '            left += 1',
            '    return out',
          ],
          map: { init: 3, right: 7, down: 10, leftw: 14, up: 18, done: 20 },
        },
        cpp: {
          lines: [
            'vector<int> spiralOrder(vector<vector<int>>& matrix) {',
            '    vector<int> out;',
            '    int top = 0, bottom = matrix.size() - 1;',
            '    int left = 0, right = matrix[0].size() - 1;',
            '    while (top <= bottom && left <= right) {',
            '        for (int j = left; j <= right; ++j) out.push_back(matrix[top][j]);',
            '        top++;',
            '        for (int i = top; i <= bottom; ++i) out.push_back(matrix[i][right]);',
            '        right--;',
            '        if (top <= bottom) {',
            '            for (int j = right; j >= left; --j) out.push_back(matrix[bottom][j]);',
            '            bottom--;',
            '        }',
            '        if (left <= right) {',
            '            for (int i = bottom; i >= top; --i) out.push_back(matrix[i][left]);',
            '            left++;',
            '        }',
            '    }',
            '    return out;',
            '}',
          ],
          map: { init: 4, right: 6, down: 8, leftw: 11, up: 15, done: 20 },
        },
        js: {
          lines: [
            'function spiralOrder(matrix) {',
            '  const out = [];',
            '  let top = 0;',
            '  let bottom = matrix.length - 1;',
            '  let left = 0;',
            '  let right = matrix[0].length - 1;',
            '  while (top <= bottom && left <= right) {',
            '    for (let j = left; j <= right; j++) out.push(matrix[top][j]);',
            '    top++;',
            '    for (let i = top; i <= bottom; i++) out.push(matrix[i][right]);',
            '    right--;',
            '    if (top <= bottom) {',
            '      for (let j = right; j >= left; j--) out.push(matrix[bottom][j]);',
            '      bottom--;',
            '    }',
            '    if (left <= right) {',
            '      for (let i = bottom; i >= top; i--) out.push(matrix[i][left]);',
            '      left++;',
            '    }',
            '  }',
            '  return out;',
            '}',
          ],
          map: { init: 6, right: 8, down: 10, leftw: 13, up: 17, done: 21 },
        },
      },

      trace(t, [matrix]: [number[][]]) {
        const m = matrix.length
        const n = matrix[0].length
        const out: number[] = []
        const taken = new Set<string>()

        const paint = (focus: [number, number] | null) => {
          const tones: Record<string, Tone> = {}
          for (let i = 0; i < m; i++)
            for (let j = 0; j < n; j++) tones[`${i},${j}`] = taken.has(`${i},${j}`) ? 'done' : 'idle'
          if (focus) tones[`${focus[0]},${focus[1]}`] = 'active'
          return combo(
            grid(matrix, { tones, cursor: focus, title: 'matrix' }),
            arr(out.length ? [...out] : ['—'], { title: 'spiral order so far', showIndex: false }),
          )
        }

        let top = 0
        let bottom = m - 1
        let left = 0
        let right = n - 1

        t.push({
          step: 'init',
          note: 'Four walls: top, bottom, left, right. Each full lap walks all four and pulls every wall inward by one.',
          view: paint(null),
          vars: [['walls', `top 0 · bottom ${bottom} · left 0 · right ${right}`]],
        })

        const walk = (cells: [number, number][], step: string, label: string) => {
          if (!cells.length || t.full) return
          for (const [i, j] of cells) {
            out.push(matrix[i][j])
            taken.add(`${i},${j}`)
            t.bump()
          }
          const [li, lj] = cells[cells.length - 1]
          t.push({
            step,
            note: `${label}: collect ${cells.map(([i, j]) => matrix[i][j]).join(', ')}. The wall behind this sweep moves inward — those cells are never visited again.`,
            view: paint([li, lj]),
            vars: [
              ['collected', cells.length],
              ['total', out.length, 'c'],
            ],
            badge: { text: label, accent: 'c' },
          })
        }

        while (top <= bottom && left <= right && !t.full) {
          walk(
            Array.from({ length: right - left + 1 }, (_, k) => [top, left + k] as [number, number]),
            'right',
            `top row, left to right`,
          )
          top++
          walk(
            Array.from({ length: bottom - top + 1 }, (_, k) => [top + k, right] as [number, number]),
            'down',
            `right column, downward`,
          )
          right--
          if (top <= bottom) {
            walk(
              Array.from({ length: right - left + 1 }, (_, k) => [bottom, right - k] as [number, number]),
              'leftw',
              `bottom row, right to left`,
            )
            bottom--
          }
          if (left <= right) {
            walk(
              Array.from({ length: bottom - top + 1 }, (_, k) => [bottom - k, left] as [number, number]),
              'up',
              `left column, upward`,
            )
            left++
          }
        }

        t.push({
          step: 'done',
          note: `The walls crossed — every cell was collected exactly once: [${out.join(', ')}].`,
          view: paint(null),
          vars: [['answer', `[${out.join(', ')}]`, 'ok']],
          badge: { text: 'spiral complete', accent: 'ok' },
        })
      },

      run([matrix]: [number[][]], c) {
        const out: number[] = []
        let top = 0
        let bottom = matrix.length - 1
        let left = 0
        let right = matrix[0].length - 1
        while (top <= bottom && left <= right) {
          for (let j = left; j <= right; j++) {
            c.ops++
            out.push(matrix[top][j])
          }
          top++
          for (let i = top; i <= bottom; i++) {
            c.ops++
            out.push(matrix[i][right])
          }
          right--
          if (top <= bottom) {
            for (let j = right; j >= left; j--) {
              c.ops++
              out.push(matrix[bottom][j])
            }
            bottom--
          }
          if (left <= right) {
            for (let i = bottom; i >= top; i--) {
              c.ops++
              out.push(matrix[i][left])
            }
            left++
          }
        }
        return out
      },
    },
  ],
}
