import type { Problem } from '@/lib/types'

export const theMaze: Problem = {
  id: 'the-maze',
  title: 'The Maze',
  group: 'Medium',
  pattern: 'BFS',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/the-maze/',
  statement:
    'A ball rolls through a maze of empty cells (`0`) and walls (`1`), and once it starts rolling in a direction it does not stop until a wall blocks it. Given `maze`, a `start` and a `destination`, return whether the ball can come to rest exactly on the destination. The borders are walls.',
  constraints: [
    '1 <= m, n <= 100',
    'maze[i][j] is 0 or 1',
    'start and destination are empty cells and differ',
  ],
  signature: {
    fn: 'hasPath',
    params: [
      { name: 'maze', type: 'int[][]' },
      { name: 'start', type: 'int[]' },
      { name: 'destination', type: 'int[]' },
    ],
    ret: 'bool',
  },
  tests: [
    {
      args: [
        [[0, 0, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 1, 0], [1, 1, 0, 1, 1], [0, 0, 0, 0, 0]],
        [0, 4],
        [4, 4],
      ],
      expect: true,
    },
    {
      args: [
        [[0, 0, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 1, 0], [1, 1, 0, 1, 1], [0, 0, 0, 0, 0]],
        [0, 4],
        [3, 2],
      ],
      expect: false,
      note: 'the ball rolls through but cannot stop there',
    },
    {
      args: [
        [[0, 0, 0, 0, 0], [1, 1, 0, 0, 1], [0, 0, 0, 0, 0], [0, 1, 0, 0, 1], [0, 1, 0, 0, 0]],
        [4, 3],
        [0, 1],
      ],
      expect: false,
    },
    { args: [[[0, 0]], [0, 0], [0, 1]], expect: true, note: 'one roll into the wall' },
    {
      args: [[[0, 0, 0]], [0, 0], [0, 1]],
      expect: false,
      note: 'the middle cell cannot be a resting place',
    },
  ],
  demo: [
    [[0, 0, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 1, 0], [1, 1, 0, 1, 1], [0, 0, 0, 0, 0]],
    [0, 4],
    [4, 4],
  ],
  starter: {
    js: `function hasPath(maze, start, destination) {
  // maze: number[][], start: number[], destination: number[]  ->  boolean
}
`,
    cpp: `bool hasPath(vector<vector<int>>& maze, vector<int>& start, vector<int>& destination) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'bfs-stops',
      label: 'Search over resting places, not cells',
      kind: 'optimal',
      time: 'O(m * n * max(m, n))',
      space: 'O(m * n)',
      blurb:
        'The ball cannot be steered mid-roll, so the only states worth exploring are the cells where it comes to rest. From each stop, roll in all four directions until a wall stops it and enqueue the four resting cells; visiting each stop once is enough.',
      code: {
        cpp: {
          lines: [
            'bool hasPath(vector<vector<int>>& maze, vector<int>& start, vector<int>& destination) {',
            '    int m = maze.size(), n = maze[0].size();',
            '    vector<vector<bool>> seen(m, vector<bool>(n, false));',
            '    const int dr[] = {1, -1, 0, 0}, dc[] = {0, 0, 1, -1};',
            '',
            '    queue<pair<int, int>> q;',
            '    q.push({start[0], start[1]});',
            '    seen[start[0]][start[1]] = true;',
            '',
            '    while (!q.empty()) {',
            '        auto [r, c] = q.front();',
            '        q.pop();',
            '        if (r == destination[0] && c == destination[1]) return true;',
            '',
            '        for (int d = 0; d < 4; ++d) {',
            '            int nr = r, nc = c;',
            '            while (nr + dr[d] >= 0 && nr + dr[d] < m && nc + dc[d] >= 0 &&',
            '                   nc + dc[d] < n && maze[nr + dr[d]][nc + dc[d]] == 0) {',
            '                nr += dr[d];',
            '                nc += dc[d];',
            '            }',
            '            if (seen[nr][nc]) continue;',
            '            seen[nr][nc] = true;',
            '            q.push({nr, nc});',
            '        }',
            '    }',
            '    return false;',
            '}',
          ],
        },
        js: {
          lines: [
            'function hasPath(maze, start, destination) {',
            '  const m = maze.length;',
            '  const n = maze[0].length;',
            '  const seen = Array.from({ length: m }, () => new Array(n).fill(false));',
            '  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];',
            '',
            '  const queue = [start];',
            '  seen[start[0]][start[1]] = true;',
            '',
            '  for (let head = 0; head < queue.length; head++) {',
            '    const [r, c] = queue[head];',
            '    if (r === destination[0] && c === destination[1]) return true;',
            '',
            '    for (const [dr, dc] of dirs) {',
            '      let nr = r;',
            '      let nc = c;',
            '      while (',
            '        nr + dr >= 0 && nr + dr < m && nc + dc >= 0 && nc + dc < n &&',
            '        maze[nr + dr][nc + dc] === 0',
            '      ) {',
            '        nr += dr;',
            '        nc += dc;',
            '      }',
            '      if (seen[nr][nc]) continue;',
            '      seen[nr][nc] = true;',
            '      queue.push([nr, nc]);',
            '    }',
            '  }',
            '  return false;',
            '}',
          ],
        },
      },

      run([maze, start, destination]: [number[][], number[], number[]], c) {
        const m = maze.length
        const n = maze[0].length
        const seen = Array.from({ length: m }, () => new Array<boolean>(n).fill(false))
        const dirs = [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]
        const queue: number[][] = [start]
        seen[start[0]][start[1]] = true
        for (let head = 0; head < queue.length; head++) {
          c.ops++
          const [r, col] = queue[head]
          if (r === destination[0] && col === destination[1]) return true
          for (const [dr, dc] of dirs) {
            let nr = r
            let nc = col
            while (
              nr + dr >= 0 &&
              nr + dr < m &&
              nc + dc >= 0 &&
              nc + dc < n &&
              maze[nr + dr][nc + dc] === 0
            ) {
              c.ops++
              nr += dr
              nc += dc
            }
            if (seen[nr][nc]) continue
            seen[nr][nc] = true
            queue.push([nr, nc])
          }
        }
        return false
      },
    },
  ],
}
