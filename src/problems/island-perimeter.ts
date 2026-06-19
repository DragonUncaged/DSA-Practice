import type { Problem } from '@/lib/types'

export const islandPerimeter: Problem = {
  id: 'island-perimeter',
  title: 'Island Perimeter',
  group: 'Matrix',
  pattern: 'Edge Counting',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/island-perimeter/',
  statement:
    'A `grid` holds `1` for land and `0` for water, and its land forms exactly one island with no lakes inside it. Return the perimeter of that island.',
  constraints: [
    '1 <= rows, cols <= 100',
    'grid[i][j] is 0 or 1',
    'Exactly one island, with no water enclosed inside it',
  ],
  signature: { fn: 'islandPerimeter', params: [{ name: 'grid', type: 'int[][]' }], ret: 'int' },
  tests: [
    {
      args: [
        [
          [0, 1, 0, 0],
          [1, 1, 1, 0],
          [0, 1, 0, 0],
          [1, 1, 0, 0],
        ],
      ],
      expect: 16,
    },
    { args: [[[1]]], expect: 4, note: 'a single cell has four exposed sides' },
    { args: [[[1, 0]]], expect: 4 },
    { args: [[[1, 1]]], expect: 6, note: 'the shared edge removes two sides' },
  ],
  demo: [
    [
      [0, 1, 0, 0],
      [1, 1, 1, 0],
      [0, 1, 0, 0],
      [1, 1, 0, 0],
    ],
  ],
  scale: (n) => {
    const side = Math.max(2, Math.round(Math.sqrt(n)))
    return [Array.from({ length: side }, () => Array.from({ length: side }, () => 1))]
  },
  starter: {
    js: `function islandPerimeter(grid) {
  // grid: number[][]  ->  number
}
`,
    cpp: `int islandPerimeter(vector<vector<int>>& grid) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'count-shared-edges',
      label: 'Four sides each, minus the shared ones',
      kind: 'optimal',
      time: 'O(rows * cols)',
      space: 'O(1)',
      blurb:
        'No traversal is needed — the shape of the island never matters, only how many cells touch. Every land cell starts with four sides, and each neighbouring pair hides two of them. Counting each pair once, by only looking up and left, keeps a single sweep correct.',
      code: {
        cpp: {
          lines: [
            'int islandPerimeter(vector<vector<int>>& grid) {',
            '    int total = 0;',
            '    for (size_t r = 0; r < grid.size(); ++r)',
            '        for (size_t c = 0; c < grid[r].size(); ++c) {',
            '            if (!grid[r][c]) continue;',
            '            total += 4;',
            '            if (r > 0 && grid[r - 1][c]) total -= 2;',
            '            if (c > 0 && grid[r][c - 1]) total -= 2;',
            '        }',
            '    return total;',
            '}',
          ],
        },
        js: {
          lines: [
            'function islandPerimeter(grid) {',
            '  let total = 0;',
            '  for (let r = 0; r < grid.length; r++)',
            '    for (let c = 0; c < grid[r].length; c++) {',
            '      if (!grid[r][c]) continue;',
            '      total += 4;',
            '      if (r > 0 && grid[r - 1][c]) total -= 2;',
            '      if (c > 0 && grid[r][c - 1]) total -= 2;',
            '    }',
            '  return total;',
            '}',
          ],
        },
      },

      run([grid]: [number[][]], c) {
        let total = 0
        for (let r = 0; r < grid.length; r++) {
          for (let col = 0; col < grid[r].length; col++) {
            c.ops++
            if (!grid[r][col]) continue
            total += 4
            if (r > 0 && grid[r - 1][col]) total -= 2
            if (col > 0 && grid[r][col - 1]) total -= 2
          }
        }
        return total
      },
    },
  ],
}
