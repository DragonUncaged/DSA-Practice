import type { Problem } from '@/lib/types'

export const bombEnemy: Problem = {
  id: 'bomb-enemy',
  title: 'Bomb Enemy',
  group: 'Medium',
  pattern: 'DP',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/bomb-enemy/',
  statement:
    "In `grid`, `'W'` is a wall, `'E'` an enemy and `'0'` an empty cell. A bomb placed on an empty cell kills every enemy in its row and column until a wall stops it. Return the most enemies one bomb can kill.",
  constraints: ['1 <= m, n <= 500', "grid[i][j] is 'W', 'E', or '0'"],
  signature: {
    fn: 'maxKilledEnemies',
    params: [{ name: 'grid', type: 'char[][]' }],
    ret: 'int',
  },
  tests: [
    {
      args: [[['0', 'E', '0', '0'], ['E', '0', 'W', 'E'], ['0', 'E', '0', '0']]],
      expect: 3,
    },
    { args: [[['W', 'W', 'W'], ['0', '0', '0'], ['E', 'E', 'E']]], expect: 1 },
    { args: [[['0']]], expect: 0, note: 'nothing to kill' },
    { args: [[['E']]], expect: 0, note: 'no empty cell to bomb from' },
    { args: [[['0', 'E']]], expect: 1 },
    { args: [[['E', 'W', '0', 'E']]], expect: 1, note: 'the wall blocks the left enemy' },
  ],
  demo: [[['0', 'E', '0', '0'], ['E', '0', 'W', 'E'], ['0', 'E', '0', '0']]],
  starter: {
    js: `function maxKilledEnemies(grid) {
  // grid: string[][]  ->  number
}
`,
    cpp: `int maxKilledEnemies(vector<vector<char>>& grid) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'carry-segment-counts',
      label: 'Reuse the count until a wall resets it',
      kind: 'optimal',
      time: 'O(m * n)',
      space: 'O(n)',
      blurb:
        'Every cell in the same wall-to-wall segment kills the same enemies, so the count only needs recomputing when a segment starts — at the border or just after a wall. Carry one row count and an array of column counts, and each cell is a lookup.',
      code: {
        cpp: {
          lines: [
            'int maxKilledEnemies(vector<vector<char>>& grid) {',
            '    int m = grid.size(), n = grid[0].size();',
            '    int best = 0, rowHits = 0;',
            '    vector<int> colHits(n, 0);',
            '',
            '    for (int i = 0; i < m; ++i) {',
            "        for (int j = 0; j < n; ++j) {",
            "            if (j == 0 || grid[i][j - 1] == 'W') {",
            '                rowHits = 0;',
            "                for (int k = j; k < n && grid[i][k] != 'W'; ++k) rowHits += grid[i][k] == 'E';",
            '            }',
            "            if (i == 0 || grid[i - 1][j] == 'W') {",
            '                colHits[j] = 0;',
            "                for (int k = i; k < m && grid[k][j] != 'W'; ++k) colHits[j] += grid[k][j] == 'E';",
            '            }',
            "            if (grid[i][j] == '0') best = max(best, rowHits + colHits[j]);",
            '        }',
            '    }',
            '    return best;',
            '}',
          ],
        },
        js: {
          lines: [
            'function maxKilledEnemies(grid) {',
            '  const m = grid.length;',
            '  const n = grid[0].length;',
            '  let best = 0;',
            '  let rowHits = 0;',
            '  const colHits = new Array(n).fill(0);',
            '',
            '  for (let i = 0; i < m; i++) {',
            '    for (let j = 0; j < n; j++) {',
            "      if (j === 0 || grid[i][j - 1] === 'W') {",
            '        rowHits = 0;',
            "        for (let k = j; k < n && grid[i][k] !== 'W'; k++) if (grid[i][k] === 'E') rowHits++;",
            '      }',
            "      if (i === 0 || grid[i - 1][j] === 'W') {",
            '        colHits[j] = 0;',
            "        for (let k = i; k < m && grid[k][j] !== 'W'; k++) if (grid[k][j] === 'E') colHits[j]++;",
            '      }',
            "      if (grid[i][j] === '0') best = Math.max(best, rowHits + colHits[j]);",
            '    }',
            '  }',
            '  return best;',
            '}',
          ],
        },
      },

      run([grid]: [string[][]], c) {
        const m = grid.length
        const n = grid[0].length
        let best = 0
        let rowHits = 0
        const colHits = new Array<number>(n).fill(0)
        for (let i = 0; i < m; i++) {
          for (let j = 0; j < n; j++) {
            c.ops++
            if (j === 0 || grid[i][j - 1] === 'W') {
              rowHits = 0
              for (let k = j; k < n && grid[i][k] !== 'W'; k++) if (grid[i][k] === 'E') rowHits++
            }
            if (i === 0 || grid[i - 1][j] === 'W') {
              colHits[j] = 0
              for (let k = i; k < m && grid[k][j] !== 'W'; k++) if (grid[k][j] === 'E') colHits[j]++
            }
            if (grid[i][j] === '0') best = Math.max(best, rowHits + colHits[j])
          }
        }
        return best
      },
    },
  ],
}
