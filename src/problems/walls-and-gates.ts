import type { Problem } from '@/lib/types'

const INF = 2147483647

export const wallsAndGates: Problem = {
  id: 'walls-and-gates',
  title: 'Walls and Gates',
  group: 'Medium',
  pattern: 'BFS',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/walls-and-gates/',
  statement:
    'A grid `rooms` holds `-1` for a wall, `0` for a gate and `2147483647` for an empty room. Fill every empty room with the number of steps to the nearest gate, leaving rooms that cannot reach one untouched, and return the grid.',
  constraints: [
    '1 <= m, n <= 250',
    'rooms[i][j] is -1, 0, or 2^31 - 1',
    'Steps move up, down, left or right',
  ],
  signature: { fn: 'wallsAndGates', params: [{ name: 'rooms', type: 'int[][]' }], ret: 'int[][]' },
  tests: [
    {
      args: [
        [
          [INF, -1, 0, INF],
          [INF, INF, INF, -1],
          [INF, -1, INF, -1],
          [0, -1, INF, INF],
        ],
      ],
      expect: [
        [3, -1, 0, 1],
        [2, 2, 1, -1],
        [1, -1, 2, -1],
        [0, -1, 3, 4],
      ],
    },
    { args: [[[-1]]], expect: [[-1]], note: 'nothing but a wall' },
    { args: [[[0]]], expect: [[0]], note: 'a lone gate' },
    { args: [[[INF]]], expect: [[INF]], note: 'unreachable room stays INF' },
    {
      args: [[[0, INF, INF, INF]]],
      expect: [[0, 1, 2, 3]],
      note: 'a single corridor',
    },
    {
      args: [[[0, INF], [INF, 0]]],
      expect: [[0, 1], [1, 0]],
      note: 'two gates, each room takes the nearer one',
    },
  ],
  demo: [
    [
      [INF, -1, 0, INF],
      [INF, INF, INF, -1],
      [INF, -1, INF, -1],
      [0, -1, INF, INF],
    ],
  ],
  starter: {
    js: `function wallsAndGates(rooms) {
  // rooms: number[][]  ->  number[][]
}
`,
    cpp: `vector<vector<int>> wallsAndGates(vector<vector<int>>& rooms) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'multi-source-bfs',
      label: 'BFS out of every gate at once',
      kind: 'optimal',
      time: 'O(m * n)',
      space: 'O(m * n)',
      blurb:
        'Running a search from each room would repeat the same work over and over. Start the queue with every gate instead: the wave spreads outward one step at a time, so the first time it touches a room, that is the nearest gate by definition.',
      code: {
        cpp: {
          lines: [
            'vector<vector<int>> wallsAndGates(vector<vector<int>>& rooms) {',
            '    const int INF = 2147483647;',
            '    int m = rooms.size(), n = rooms[0].size();',
            '    queue<pair<int, int>> q;',
            '    for (int r = 0; r < m; ++r)',
            '        for (int c = 0; c < n; ++c)',
            '            if (rooms[r][c] == 0) q.push({r, c});',
            '',
            '    const int dr[] = {1, -1, 0, 0}, dc[] = {0, 0, 1, -1};',
            '    while (!q.empty()) {',
            '        auto [r, c] = q.front();',
            '        q.pop();',
            '        for (int d = 0; d < 4; ++d) {',
            '            int nr = r + dr[d], nc = c + dc[d];',
            '            if (nr < 0 || nc < 0 || nr >= m || nc >= n) continue;',
            '            if (rooms[nr][nc] != INF) continue;',
            '            rooms[nr][nc] = rooms[r][c] + 1;',
            '            q.push({nr, nc});',
            '        }',
            '    }',
            '    return rooms;',
            '}',
          ],
        },
        js: {
          lines: [
            'function wallsAndGates(rooms) {',
            '  const INF = 2147483647;',
            '  const m = rooms.length;',
            '  const n = rooms[0].length;',
            '',
            '  const queue = [];',
            '  for (let r = 0; r < m; r++)',
            '    for (let c = 0; c < n; c++)',
            '      if (rooms[r][c] === 0) queue.push([r, c]);',
            '',
            '  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];',
            '  for (let head = 0; head < queue.length; head++) {',
            '    const [r, c] = queue[head];',
            '    for (const [dr, dc] of dirs) {',
            '      const nr = r + dr;',
            '      const nc = c + dc;',
            '      if (nr < 0 || nc < 0 || nr >= m || nc >= n) continue;',
            '      if (rooms[nr][nc] !== INF) continue;',
            '      rooms[nr][nc] = rooms[r][c] + 1;',
            '      queue.push([nr, nc]);',
            '    }',
            '  }',
            '  return rooms;',
            '}',
          ],
        },
      },

      run([rooms]: [number[][]], c) {
        const m = rooms.length
        const n = rooms[0].length
        const queue: [number, number][] = []
        for (let r = 0; r < m; r++)
          for (let col = 0; col < n; col++) {
            c.ops++
            if (rooms[r][col] === 0) queue.push([r, col])
          }
        const dirs = [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]
        for (let head = 0; head < queue.length; head++) {
          const [r, col] = queue[head]
          for (const [dr, dc] of dirs) {
            c.ops++
            const nr = r + dr
            const nc = col + dc
            if (nr < 0 || nc < 0 || nr >= m || nc >= n) continue
            if (rooms[nr][nc] !== INF) continue
            rooms[nr][nc] = rooms[r][col] + 1
            queue.push([nr, nc])
          }
        }
        return rooms
      },
    },
  ],
}
