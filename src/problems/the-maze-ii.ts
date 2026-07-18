import type { Problem } from '@/lib/types'

export const theMazeII: Problem = {
  id: 'the-maze-ii',
  title: 'The Maze II',
  group: 'Medium',
  pattern: 'Dijkstra',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/the-maze-ii/',
  statement:
    'Same rolling ball as The Maze: it keeps going until a wall stops it. Return the fewest empty cells the ball can travel to come to rest on `destination`, counting from the start exclusive to the destination inclusive, or `-1` when it cannot stop there.',
  constraints: [
    '1 <= m, n <= 100',
    'maze[i][j] is 0 or 1',
    'start and destination are empty cells and differ',
  ],
  signature: {
    fn: 'shortestDistance',
    params: [
      { name: 'maze', type: 'int[][]' },
      { name: 'start', type: 'int[]' },
      { name: 'destination', type: 'int[]' },
    ],
    ret: 'int',
  },
  tests: [
    {
      args: [
        [[0, 0, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 1, 0], [1, 1, 0, 1, 1], [0, 0, 0, 0, 0]],
        [0, 4],
        [4, 4],
      ],
      expect: 12,
    },
    {
      args: [
        [[0, 0, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 1, 0], [1, 1, 0, 1, 1], [0, 0, 0, 0, 0]],
        [0, 4],
        [3, 2],
      ],
      expect: -1,
    },
    {
      args: [
        [[0, 0, 0, 0, 0], [1, 1, 0, 0, 1], [0, 0, 0, 0, 0], [0, 1, 0, 0, 1], [0, 1, 0, 0, 0]],
        [4, 3],
        [0, 1],
      ],
      expect: -1,
    },
    { args: [[[0, 0]], [0, 0], [0, 1]], expect: 1, note: 'one cell of travel' },
    { args: [[[0, 0, 0]], [0, 0], [0, 1]], expect: -1, note: 'no wall to stop against' },
  ],
  demo: [
    [[0, 0, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 1, 0], [1, 1, 0, 1, 1], [0, 0, 0, 0, 0]],
    [0, 4],
    [4, 4],
  ],
  starter: {
    js: `function shortestDistance(maze, start, destination) {
  // maze: number[][], start: number[], destination: number[]  ->  number
}
`,
    cpp: `int shortestDistance(vector<vector<int>>& maze, vector<int>& start, vector<int>& destination) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'dijkstra',
      label: 'Dijkstra over resting places',
      kind: 'optimal',
      time: 'O(m * n * max(m, n) * log(m * n))',
      space: 'O(m * n)',
      blurb:
        'A roll can cover many cells at once, so the edges have different weights and plain breadth-first search would not find the cheapest route. Keep the best known distance per resting cell and always expand the cheapest one first, exactly as Dijkstra does.',
      code: {
        cpp: {
          lines: [
            'int shortestDistance(vector<vector<int>>& maze, vector<int>& start, vector<int>& destination) {',
            '    int m = maze.size(), n = maze[0].size();',
            '    vector<vector<int>> best(m, vector<int>(n, INT_MAX));',
            '    const int dr[] = {1, -1, 0, 0}, dc[] = {0, 0, 1, -1};',
            '',
            '    priority_queue<tuple<int, int, int>, vector<tuple<int, int, int>>, greater<>> pq;',
            '    best[start[0]][start[1]] = 0;',
            '    pq.push({0, start[0], start[1]});',
            '',
            '    while (!pq.empty()) {',
            '        auto [d, r, c] = pq.top();',
            '        pq.pop();',
            '        if (d > best[r][c]) continue;',
            '        if (r == destination[0] && c == destination[1]) return d;',
            '',
            '        for (int k = 0; k < 4; ++k) {',
            '            int nr = r, nc = c, steps = 0;',
            '            while (nr + dr[k] >= 0 && nr + dr[k] < m && nc + dc[k] >= 0 &&',
            '                   nc + dc[k] < n && maze[nr + dr[k]][nc + dc[k]] == 0) {',
            '                nr += dr[k];',
            '                nc += dc[k];',
            '                ++steps;',
            '            }',
            '            if (d + steps >= best[nr][nc]) continue;',
            '            best[nr][nc] = d + steps;',
            '            pq.push({d + steps, nr, nc});',
            '        }',
            '    }',
            '    return -1;',
            '}',
          ],
        },
        js: {
          lines: [
            'function shortestDistance(maze, start, destination) {',
            '  const m = maze.length;',
            '  const n = maze[0].length;',
            '  const best = Array.from({ length: m }, () => new Array(n).fill(Infinity));',
            '  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];',
            '',
            '  best[start[0]][start[1]] = 0;',
            '  const pq = [[0, start[0], start[1]]];',
            '',
            '  while (pq.length) {',
            '    pq.sort((a, b) => a[0] - b[0]);',
            '    const [d, r, c] = pq.shift();',
            '    if (d > best[r][c]) continue;',
            '    if (r === destination[0] && c === destination[1]) return d;',
            '',
            '    for (const [dr, dc] of dirs) {',
            '      let nr = r;',
            '      let nc = c;',
            '      let steps = 0;',
            '      while (',
            '        nr + dr >= 0 && nr + dr < m && nc + dc >= 0 && nc + dc < n &&',
            '        maze[nr + dr][nc + dc] === 0',
            '      ) {',
            '        nr += dr;',
            '        nc += dc;',
            '        steps++;',
            '      }',
            '      if (d + steps >= best[nr][nc]) continue;',
            '      best[nr][nc] = d + steps;',
            '      pq.push([d + steps, nr, nc]);',
            '    }',
            '  }',
            '  return -1;',
            '}',
          ],
        },
      },

      run([maze, start, destination]: [number[][], number[], number[]], c) {
        const m = maze.length
        const n = maze[0].length
        const best = Array.from({ length: m }, () => new Array<number>(n).fill(Infinity))
        const dirs = [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]
        best[start[0]][start[1]] = 0
        const pq: number[][] = [[0, start[0], start[1]]]
        while (pq.length) {
          c.ops++
          pq.sort((a, b) => a[0] - b[0])
          const [d, r, col] = pq.shift()!
          if (d > best[r][col]) continue
          if (r === destination[0] && col === destination[1]) return d
          for (const [dr, dc] of dirs) {
            let nr = r
            let nc = col
            let steps = 0
            while (
              nr + dr >= 0 &&
              nr + dr < m &&
              nc + dc >= 0 &&
              nc + dc < n &&
              maze[nr + dr][nc + dc] === 0
            ) {
              nr += dr
              nc += dc
              steps++
            }
            if (d + steps >= best[nr][nc]) continue
            best[nr][nc] = d + steps
            pq.push([d + steps, nr, nc])
          }
        }
        return -1
      },
    },
  ],
}
