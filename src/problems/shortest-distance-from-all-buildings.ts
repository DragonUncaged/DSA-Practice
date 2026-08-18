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
    {
      args: [[[1, 0, 0], [0, 0, 0], [0, 0, 1]]],
      expect: 4,
      note: 'diagonal buildings: any cell on a shortest path between them',
    },
    {
      args: [[[0, 1, 0], [1, 0, 1], [0, 1, 0]]],
      expect: 4,
      note: 'the centre is surrounded by four buildings',
    },
  ],
  scale: (n) => {
    const side = Math.max(3, Math.round(Math.sqrt(n)))
    return [Array.from({ length: side }, (_, r) => Array.from({ length: side }, (_, c) => (r === 0 && c === 0 ? 1 : 0)))]
  },
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
      id: 'bfs-per-empty-cell',
      label: 'Search from every empty cell',
      kind: 'brute',
      time: 'O(e * m * n)',
      space: 'O(m * n)',
      blurb:
        'For each empty cell, breadth-first search outward through the empty land until every building has been reached, summing the distances at which they turned up. Correct, and it answers the question as posed — but there are usually far more empty cells than buildings, and each one pays for a full sweep of the grid.',
      code: {
        cpp: {
          lines: [
            'int shortestDistance(vector<vector<int>>& grid) {',
            '    int m = grid.size(), n = grid[0].size(), buildings = 0;',
            '    for (auto& row : grid) for (int v : row) if (v == 1) ++buildings;',
            '    const int dr[4] = {1, -1, 0, 0}, dc[4] = {0, 0, 1, -1};',
            '    int best = INT_MAX;',
            '    for (int sr = 0; sr < m; ++sr) for (int sc = 0; sc < n; ++sc) {',
            '        if (grid[sr][sc] != 0) continue;',
            '        vector<vector<int>> dist(m, vector<int>(n, -1));',
            '        queue<pair<int, int>> q;',
            '        q.push({sr, sc}); dist[sr][sc] = 0;',
            '        int total = 0, found = 0;',
            '        while (!q.empty() && found < buildings) {',
            '            auto [r, c] = q.front(); q.pop();',
            '            for (int d = 0; d < 4; ++d) {',
            '                int nr = r + dr[d], nc = c + dc[d];',
            '                if (nr < 0 || nc < 0 || nr >= m || nc >= n) continue;',
            '                if (dist[nr][nc] != -1 || grid[nr][nc] == 2) continue;',
            '                dist[nr][nc] = dist[r][c] + 1;',
            '                if (grid[nr][nc] == 1) { total += dist[nr][nc]; ++found; }',
            '                else q.push({nr, nc});',
            '            }',
            '        }',
            '        if (found == buildings) best = min(best, total);',
            '    }',
            '    return best == INT_MAX ? -1 : best;',
            '}',
          ],
        },
        js: {
          lines: [
            'function shortestDistance(grid) {',
            '  const m = grid.length;',
            '  const n = grid[0].length;',
            '  let buildings = 0;',
            '  for (const row of grid) for (const v of row) if (v === 1) buildings++;',
            '  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];',
            '',
            '  let best = Infinity;',
            '  for (let sr = 0; sr < m; sr++) for (let sc = 0; sc < n; sc++) {',
            '    if (grid[sr][sc] !== 0) continue;',
            '    const dist = Array.from({ length: m }, () => new Array(n).fill(-1));',
            '    const queue = [[sr, sc]];',
            '    dist[sr][sc] = 0;',
            '    let total = 0;',
            '    let found = 0;',
            '    for (let head = 0; head < queue.length && found < buildings; head++) {',
            '      const [r, c] = queue[head];',
            '      for (const [dr, dc] of dirs) {',
            '        const nr = r + dr;',
            '        const nc = c + dc;',
            '        if (nr < 0 || nc < 0 || nr >= m || nc >= n) continue;',
            '        if (dist[nr][nc] !== -1 || grid[nr][nc] === 2) continue;',
            '        dist[nr][nc] = dist[r][c] + 1;',
            '        if (grid[nr][nc] === 1) { total += dist[nr][nc]; found++; }',
            '        else queue.push([nr, nc]);',
            '      }',
            '    }',
            '    if (found === buildings) best = Math.min(best, total);',
            '  }',
            '  return best === Infinity ? -1 : best;',
            '}',
          ],
        },
      },

      run([grid]: [number[][]], c) {
        const m = grid.length
        const n = grid[0].length
        if (m * n > 2500) throw new Error('too slow')
        let buildings = 0
        for (const row of grid) for (const v of row) if (v === 1) buildings++
        const dirs = [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]
        let best = Infinity
        for (let sr = 0; sr < m; sr++)
          for (let sc = 0; sc < n; sc++) {
            if (grid[sr][sc] !== 0) continue
            const dist = Array.from({ length: m }, () => new Array<number>(n).fill(-1))
            const queue: [number, number][] = [[sr, sc]]
            dist[sr][sc] = 0
            let total = 0
            let found = 0
            for (let head = 0; head < queue.length && found < buildings; head++) {
              const [r, col] = queue[head]
              for (const [dr, dc] of dirs) {
                c.ops++
                const nr = r + dr
                const nc = col + dc
                if (nr < 0 || nc < 0 || nr >= m || nc >= n) continue
                if (dist[nr][nc] !== -1 || grid[nr][nc] === 2) continue
                dist[nr][nc] = dist[r][col] + 1
                if (grid[nr][nc] === 1) {
                  total += dist[nr][nc]
                  found++
                } else queue.push([nr, nc])
              }
            }
            if (found === buildings) best = Math.min(best, total)
          }
        return best === Infinity ? -1 : best
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'bfs-per-building',
      label: 'One BFS per building, summed into the grid',
      kind: 'optimal',
      time: 'O(b * m * n)',
      space: 'O(m * n)',
      blurb:
        'Turn the search around: there are few buildings and many empty cells, so search from each building instead and add its distances into a running total per cell, counting how many buildings have reached that cell. The answer is the smallest total among cells reached by every building — one sweep per building rather than per empty cell.',
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
