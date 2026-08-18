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
    { args: [[[1, 0, 0, 0, 0, 0, 0, 1]]], expect: 7, note: 'any cell between them is optimal' },
    {
      args: [[[0, 0, 0, 0], [1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 1], [1, 0, 0, 0]]],
      expect: 6,
      note: 'the median row and column need not hold a home',
    },
  ],
  scale: (n) => {
    const side = Math.max(2, Math.round(Math.sqrt(n)))
    return [Array.from({ length: side }, (_, r) => Array.from({ length: side }, (_, c) => ((r * 3 + c) % 4 === 0 ? 1 : 0)))]
  },
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
      id: 'every-cell',
      label: 'Measure every cell against every home',
      kind: 'brute',
      time: 'O(m * n * h)',
      space: 'O(h)',
      blurb:
        'Collect the homes, then for every cell of the grid add up its Manhattan distance to each of them and keep the smallest total. Correct, and the direct reading of the statement, but every candidate cell pays for every home.',
      code: {
        cpp: {
          lines: [
            'int minTotalDistance(vector<vector<int>>& grid) {',
            '    int m = grid.size(), n = grid[0].size();',
            '    vector<pair<int, int>> homes;',
            '    for (int r = 0; r < m; ++r) for (int c = 0; c < n; ++c)',
            '        if (grid[r][c] == 1) homes.push_back({r, c});',
            '    int best = INT_MAX;',
            '    for (int r = 0; r < m; ++r) for (int c = 0; c < n; ++c) {',
            '        int total = 0;',
            '        for (auto [hr, hc] : homes) total += abs(hr - r) + abs(hc - c);',
            '        best = min(best, total);',
            '    }',
            '    return best;',
            '}',
          ],
        },
        js: {
          lines: [
            'function minTotalDistance(grid) {',
            '  const m = grid.length;',
            '  const n = grid[0].length;',
            '  const homes = [];',
            '  for (let r = 0; r < m; r++)',
            '    for (let c = 0; c < n; c++)',
            '      if (grid[r][c] === 1) homes.push([r, c]);',
            '',
            '  let best = Infinity;',
            '  for (let r = 0; r < m; r++) {',
            '    for (let c = 0; c < n; c++) {',
            '      let total = 0;',
            '      for (const [hr, hc] of homes) total += Math.abs(hr - r) + Math.abs(hc - c);',
            '      best = Math.min(best, total);',
            '    }',
            '  }',
            '  return best;',
            '}',
          ],
        },
      },

      run([grid]: [number[][]], c) {
        const m = grid.length
        const n = grid[0].length
        const homes: [number, number][] = []
        for (let r = 0; r < m; r++) for (let col = 0; col < n; col++) if (grid[r][col] === 1) homes.push([r, col])
        let best = Infinity
        for (let r = 0; r < m; r++) {
          for (let col = 0; col < n; col++) {
            let total = 0
            for (const [hr, hc] of homes) {
              c.ops++
              total += Math.abs(hr - r) + Math.abs(hc - col)
            }
            best = Math.min(best, total)
          }
        }
        return best
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'per-axis',
      label: 'Solve rows and columns separately',
      kind: 'better',
      time: 'O((m + n) * h)',
      space: 'O(h)',
      blurb:
        'Manhattan distance is a row part plus a column part, and the two never interact, so the best row and the best column can be chosen independently. Try every row against the homes\' rows and every column against their columns: the grid of candidates collapses to a line of them on each axis.',
      code: {
        cpp: {
          lines: [
            'int minTotalDistance(vector<vector<int>>& grid) {',
            '    int m = grid.size(), n = grid[0].size();',
            '    vector<int> rows, cols;',
            '    for (int r = 0; r < m; ++r) for (int c = 0; c < n; ++c)',
            '        if (grid[r][c] == 1) { rows.push_back(r); cols.push_back(c); }',
            '    auto bestOn = [](const vector<int>& pts, int limit) {',
            '        int best = INT_MAX;',
            '        for (int x = 0; x < limit; ++x) {',
            '            int total = 0;',
            '            for (int p : pts) total += abs(p - x);',
            '            best = min(best, total);',
            '        }',
            '        return best;',
            '    };',
            '    return bestOn(rows, m) + bestOn(cols, n);',
            '}',
          ],
        },
        js: {
          lines: [
            'function minTotalDistance(grid) {',
            '  const m = grid.length;',
            '  const n = grid[0].length;',
            '  const rows = [];',
            '  const cols = [];',
            '  for (let r = 0; r < m; r++)',
            '    for (let c = 0; c < n; c++)',
            '      if (grid[r][c] === 1) { rows.push(r); cols.push(c); }',
            '',
            '  const bestOn = (pts, limit) => {',
            '    let best = Infinity;',
            '    for (let x = 0; x < limit; x++) {',
            '      let total = 0;',
            '      for (const p of pts) total += Math.abs(p - x);',
            '      best = Math.min(best, total);',
            '    }',
            '    return best;',
            '  };',
            '  return bestOn(rows, m) + bestOn(cols, n);',
            '}',
          ],
        },
      },

      run([grid]: [number[][]], c) {
        const m = grid.length
        const n = grid[0].length
        const rows: number[] = []
        const cols: number[] = []
        for (let r = 0; r < m; r++)
          for (let col = 0; col < n; col++)
            if (grid[r][col] === 1) {
              rows.push(r)
              cols.push(col)
            }
        const bestOn = (pts: number[], limit: number) => {
          let best = Infinity
          for (let x = 0; x < limit; x++) {
            let total = 0
            for (const p of pts) {
              c.ops++
              total += Math.abs(p - x)
            }
            best = Math.min(best, total)
          }
          return best
        }
        return bestOn(rows, m) + bestOn(cols, n)
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'median',
      label: 'Take the median row and the median column',
      kind: 'optimal',
      time: 'O(m * n)',
      space: 'O(m * n)',
      blurb:
        'On a line there is no need to try every candidate: the point minimising the total distance is the median. Collect the rows in order, sort the columns, and sum the distances to each median. One pass to gather the homes and one to add up the distances.',
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
