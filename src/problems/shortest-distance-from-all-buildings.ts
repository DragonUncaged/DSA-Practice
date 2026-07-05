import type { Problem } from '@/lib/types'

export const shortestDistanceFromAllBuildings: Problem = {
  id: 'shortest-distance-from-all-buildings',
  title: 'Shortest Distance from All Buildings',
  group: 'Hard',
  pattern: 'BFS',
  difficulty: 'Hard',
  leetcode: 'https://leetcode.com/problems/shortest-distance-from-all-buildings/',
  statement:
    'In `grid`, `0` is empty land you may walk on, `1` is a building you cannot enter, and `2` is an obstacle. Return the smallest total walking distance from one empty cell to every building, moving only up, down, left and right. Return `-1` when no empty cell reaches them all.',
  constraints: [
    '1 <= m, n <= 50',
    'grid[i][j] is 0, 1, or 2',
    'There is at least one building',
  ],
  signature: {
    fn: 'shortestDistance',
    params: [{ name: 'grid', type: 'int[][]' }],
    ret: 'int',
  },
  tests: [
    { args: [[[1, 0, 2, 0, 1], [0, 0, 0, 0, 0], [0, 0, 1, 0, 0]]], expect: 7 },
    { args: [[[1, 0]]], expect: 1, note: 'one building, one empty cell' },
    { args: [[[1]]], expect: -1, note: 'nowhere to build' },
    { args: [[[1, 1]]], expect: -1, note: 'no empty land at all' },
    { args: [[[1, 0, 1]]], expect: 2, note: 'the middle cell reaches both' },
    { args: [[[1, 2, 0]]], expect: -1, note: 'the obstacle cuts the only path' },
  ],
  demo: [[[1, 0, 2, 0, 1], [0, 0, 0, 0, 0], [0, 0, 1, 0, 0]]],
  starter: {
    js: `function shortestDistance(grid) {
  // grid: number[][]  ->  number
}
`,
    cpp: `int shortestDistance(vector<vector<int>>& grid) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'bfs-per-building',
      label: 'One BFS per building, summed into the grid',
      kind: 'optimal',
      time: 'O(b * m * n)',
      space: 'O(m * n)',
      blurb:
        'Searching outward from each empty cell would repeat the same walks. Search from each building instead and add its distances into a running total per cell, counting how many buildings have reached that cell. The answer is the smallest total among cells reached by every building.',
      code: {
        cpp: {
          lines: [
            'int shortestDistance(vector<vector<int>>& grid) {',
            '    int m = grid.size(), n = grid[0].size();',
            '    vector<vector<int>> total(m, vector<int>(n, 0));',
            '    vector<vector<int>> reach(m, vector<int>(n, 0));',
            '    const int dr[] = {1, -1, 0, 0}, dc[] = {0, 0, 1, -1};',
            '    int buildings = 0;',
            '',
            '    for (int r = 0; r < m; ++r) for (int c = 0; c < n; ++c) {',
            '        if (grid[r][c] != 1) continue;',
            '        ++buildings;',
            '        vector<vector<bool>> seen(m, vector<bool>(n, false));',
            '        seen[r][c] = true;',
            '        queue<pair<int, int>> q;',
            '        q.push({r, c});',
            '        int dist = 0;',
            '        while (!q.empty()) {',
            '            ++dist;',
            '            for (int sz = q.size(); sz > 0; --sz) {',
            '                auto [x, y] = q.front();',
            '                q.pop();',
            '                for (int d = 0; d < 4; ++d) {',
            '                    int nx = x + dr[d], ny = y + dc[d];',
            '                    if (nx < 0 || ny < 0 || nx >= m || ny >= n) continue;',
            '                    if (seen[nx][ny] || grid[nx][ny] != 0) continue;',
            '                    seen[nx][ny] = true;',
            '                    total[nx][ny] += dist;',
            '                    reach[nx][ny]++;',
            '                    q.push({nx, ny});',
            '                }',
            '            }',
            '        }',
            '    }',
            '',
            '    int best = INT_MAX;',
            '    for (int r = 0; r < m; ++r) for (int c = 0; c < n; ++c)',
            '        if (grid[r][c] == 0 && reach[r][c] == buildings) best = min(best, total[r][c]);',
            '    return best == INT_MAX ? -1 : best;',
            '}',
          ],
        },
        js: {
          lines: [
            'function shortestDistance(grid) {',
            '  const m = grid.length;',
            '  const n = grid[0].length;',
            '  const total = Array.from({ length: m }, () => new Array(n).fill(0));',
            '  const reach = Array.from({ length: m }, () => new Array(n).fill(0));',
            '  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];',
            '  let buildings = 0;',
            '',
            '  for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) {',
            '    if (grid[r][c] !== 1) continue;',
            '    buildings++;',
            '    const seen = Array.from({ length: m }, () => new Array(n).fill(false));',
            '    seen[r][c] = true;',
            '    let level = [[r, c]];',
            '    let dist = 0;',
            '    while (level.length) {',
            '      dist++;',
            '      const next = [];',
            '      for (const [x, y] of level) {',
            '        for (const [dx, dy] of dirs) {',
            '          const nx = x + dx;',
            '          const ny = y + dy;',
            '          if (nx < 0 || ny < 0 || nx >= m || ny >= n) continue;',
            '          if (seen[nx][ny] || grid[nx][ny] !== 0) continue;',
            '          seen[nx][ny] = true;',
            '          total[nx][ny] += dist;',
            '          reach[nx][ny]++;',
            '          next.push([nx, ny]);',
            '        }',
            '      }',
            '      level = next;',
            '    }',
            '  }',
            '',
            '  let best = Infinity;',
            '  for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) {',
            '    if (grid[r][c] === 0 && reach[r][c] === buildings) best = Math.min(best, total[r][c]);',
            '  }',
            '  return best === Infinity ? -1 : best;',
            '}',
          ],
        },
      },

      run([grid]: [number[][]], c) {
        const m = grid.length
        const n = grid[0].length
        const total = Array.from({ length: m }, () => new Array<number>(n).fill(0))
        const reach = Array.from({ length: m }, () => new Array<number>(n).fill(0))
        const dirs = [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]
        let buildings = 0
        for (let r = 0; r < m; r++)
          for (let col = 0; col < n; col++) {
            if (grid[r][col] !== 1) continue
            buildings++
            const seen = Array.from({ length: m }, () => new Array<boolean>(n).fill(false))
            seen[r][col] = true
            let level: [number, number][] = [[r, col]]
            let dist = 0
            while (level.length) {
              dist++
              const next: [number, number][] = []
              for (const [x, y] of level) {
                for (const [dx, dy] of dirs) {
                  c.ops++
                  const nx = x + dx
                  const ny = y + dy
                  if (nx < 0 || ny < 0 || nx >= m || ny >= n) continue
                  if (seen[nx][ny] || grid[nx][ny] !== 0) continue
                  seen[nx][ny] = true
                  total[nx][ny] += dist
                  reach[nx][ny]++
                  next.push([nx, ny])
                }
              }
              level = next
            }
          }
        let best = Infinity
        for (let r = 0; r < m; r++)
          for (let col = 0; col < n; col++) {
            if (grid[r][col] === 0 && reach[r][col] === buildings) best = Math.min(best, total[r][col])
          }
        return best === Infinity ? -1 : best
      },
    },
  ],
}
