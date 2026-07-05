import type { Problem } from '@/lib/types'

export const bestMeetingPoint: Problem = {
  id: 'best-meeting-point',
  title: 'Best Meeting Point',
  group: 'Hard',
  pattern: 'Greedy',
  difficulty: 'Hard',
  leetcode: 'https://leetcode.com/problems/best-meeting-point/',
  statement:
    'Each `1` in a binary `grid` marks the home of one friend. Return the smallest possible total Manhattan distance from every home to a single meeting point.',
  constraints: [
    '1 <= m, n <= 200',
    'grid[i][j] is either 0 or 1',
    'There are at least two friends in the grid',
  ],
  signature: { fn: 'minTotalDistance', params: [{ name: 'grid', type: 'int[][]' }], ret: 'int' },
  tests: [
    { args: [[[1, 0, 0, 0, 1], [0, 0, 0, 0, 0], [0, 0, 1, 0, 0]]], expect: 6 },
    { args: [[[1, 1]]], expect: 1, note: 'two neighbours' },
    { args: [[[1], [1]]], expect: 1, note: 'one column' },
    { args: [[[1, 0, 1]]], expect: 2 },
    { args: [[[1, 1, 1]]], expect: 2, note: 'the median is one of the homes' },
    { args: [[[1, 1], [1, 1]]], expect: 4, note: 'a square of friends' },
  ],
  demo: [[[1, 0, 0, 0, 1], [0, 0, 0, 0, 0], [0, 0, 1, 0, 0]]],
  starter: {
    js: `function minTotalDistance(grid) {
  // grid: number[][]  ->  number
}
`,
    cpp: `int minTotalDistance(vector<vector<int>>& grid) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'median',
      label: 'Take the median row and the median column',
      kind: 'optimal',
      time: 'O(m * n)',
      space: 'O(m * n)',
      blurb:
        'Manhattan distance splits cleanly into a row part and a column part, so the two axes can be solved separately. On a line, the point minimising the total distance is the median — collect the rows in order, sort the columns, and sum the distances to each median.',
      code: {
        cpp: {
          lines: [
            'int minTotalDistance(vector<vector<int>>& grid) {',
            '    vector<int> rows, cols;',
            '    for (size_t r = 0; r < grid.size(); ++r)',
            '        for (size_t c = 0; c < grid[0].size(); ++c)',
            '            if (grid[r][c] == 1) { rows.push_back(r); cols.push_back(c); }',
            '',
            '    sort(cols.begin(), cols.end());  // rows already come out sorted',
            '    int mr = rows[rows.size() / 2];',
            '    int mc = cols[cols.size() / 2];',
            '',
            '    int total = 0;',
            '    for (int r : rows) total += abs(r - mr);',
            '    for (int c : cols) total += abs(c - mc);',
            '    return total;',
            '}',
          ],
        },
        js: {
          lines: [
            'function minTotalDistance(grid) {',
            '  const rows = [];',
            '  const cols = [];',
            '  for (let r = 0; r < grid.length; r++)',
            '    for (let c = 0; c < grid[0].length; c++)',
            '      if (grid[r][c] === 1) { rows.push(r); cols.push(c); }',
            '',
            '  cols.sort((a, b) => a - b); // rows already come out sorted',
            '  const mr = rows[rows.length >> 1];',
            '  const mc = cols[cols.length >> 1];',
            '',
            '  let total = 0;',
            '  for (const r of rows) total += Math.abs(r - mr);',
            '  for (const c of cols) total += Math.abs(c - mc);',
            '  return total;',
            '}',
          ],
        },
      },

      run([grid]: [number[][]], c) {
        const rows: number[] = []
        const cols: number[] = []
        for (let r = 0; r < grid.length; r++)
          for (let col = 0; col < grid[0].length; col++) {
            c.ops++
            if (grid[r][col] === 1) {
              rows.push(r)
              cols.push(col)
            }
          }
        cols.sort((a, b) => a - b)
        const mr = rows[rows.length >> 1]
        const mc = cols[cols.length >> 1]
        let total = 0
        for (const r of rows) total += Math.abs(r - mr)
        for (const col of cols) total += Math.abs(col - mc)
        return total
      },
    },
  ],
}
