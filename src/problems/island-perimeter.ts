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
    { args: [[[1], [1]]], expect: 6, note: 'a vertical pair' },
    {
      args: [
        [
          [1, 1],
          [1, 1],
        ],
      ],
      expect: 8,
      note: 'a square block',
    },
    {
      args: [
        [
          [0, 1, 0],
          [1, 1, 1],
          [0, 1, 0],
        ],
      ],
      expect: 12,
      note: 'a plus shape',
    },
    {
      args: [Array.from({ length: 100 }, () => Array.from({ length: 100 }, () => 1))],
      expect: 400,
      note: 'the largest grid, all land',
    },
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
      id: 'exposed-sides',
      label: 'Count the exposed sides of every cell',
      kind: 'brute',
      time: 'O(rows * cols)',
      space: 'O(1)',
      blurb:
        'A side of a land cell is part of the perimeter when whatever lies across it is water or the edge of the grid. So look at all four neighbours of every land cell and count the ones that are not land. Four checks per cell, each with its own bounds test, and every shared edge is examined twice — once from each side.',
      code: {
        cpp: {
          lines: [
            'int islandPerimeter(vector<vector<int>>& grid) {',
            '    int rows = grid.size(), cols = grid[0].size(), total = 0;',
            '    int dr[4] = {-1, 1, 0, 0}, dc[4] = {0, 0, -1, 1};',
            '    for (int r = 0; r < rows; ++r)',
            '        for (int c = 0; c < cols; ++c) {',
            '            if (!grid[r][c]) continue;',
            '            for (int k = 0; k < 4; ++k) {',
            '                int nr = r + dr[k], nc = c + dc[k];',
            '                if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || !grid[nr][nc]) total++;',
            '            }',
            '        }',
            '    return total;',
            '}',
          ],
        },
        js: {
          lines: [
            'function islandPerimeter(grid) {',
            '  const rows = grid.length, cols = grid[0].length;',
            '  const land = (r, c) => r >= 0 && r < rows && c >= 0 && c < cols && grid[r][c] === 1;',
            '  let total = 0;',
            '  for (let r = 0; r < rows; r++)',
            '    for (let c = 0; c < cols; c++) {',
            '      if (!grid[r][c]) continue;',
            '      for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]])',
            '        if (!land(r + dr, c + dc)) total++;',
            '    }',
            '  return total;',
            '}',
          ],
        },
      },
      run([grid]: [number[][]], c) {
        const rows = grid.length
        const cols = grid[0].length
        const land = (r: number, col: number) => r >= 0 && r < rows && col >= 0 && col < cols && grid[r][col] === 1
        let total = 0
        for (let r = 0; r < rows; r++)
          for (let col = 0; col < cols; col++) {
            if (!grid[r][col]) continue
            for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
              c.ops++
              if (!land(r + dr, col + dc)) total++
            }
          }
        return total
      },
    },
    {
      id: 'count-shared-edges',
      label: 'Four sides each, minus the shared ones',
      kind: 'optimal',
      time: 'O(rows * cols)',
      space: 'O(1)',
      blurb:
        'Each shared edge only needs to be found once. Every land cell starts with four sides, and each neighbouring pair hides two of them; looking only up and left sees every pair exactly once, so a single sweep with two checks per cell replaces four checks and their bounds tests. No traversal is needed — the shape of the island never matters, only how many cells touch.',
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
