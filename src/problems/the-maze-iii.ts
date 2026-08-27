import type { Problem } from '@/lib/types'

export const theMazeIII: Problem = {
  id: 'the-maze-iii',
  title: 'The Maze III',
  group: 'Hard',
  pattern: 'Dijkstra',
  difficulty: 'Hard',
  leetcode: 'https://leetcode.com/problems/the-maze-iii/',
  statement:
    "Same rolling ball, but the maze now has a hole: the ball drops in the moment it rolls over it, even mid-roll. Return the instructions — made of `'u'`, `'d'`, `'l'`, `'r'` — that drop the ball in over the shortest distance, breaking ties by taking the lexicographically smallest string, or `\"impossible\"`.",
  constraints: [
    '1 <= m, n <= 100',
    'maze[i][j] is 0 or 1',
    'ball and hole are empty cells and differ',
  ],
  signature: {
    fn: 'findShortestWay',
    params: [
      { name: 'maze', type: 'int[][]' },
      { name: 'ball', type: 'int[]' },
      { name: 'hole', type: 'int[]' },
    ],
    ret: 'string',
  },
  tests: [
    {
      args: [
        [[0, 0, 0, 0, 0], [1, 1, 0, 0, 1], [0, 0, 0, 0, 0], [0, 1, 0, 0, 1], [0, 1, 0, 0, 0]],
        [4, 3],
        [0, 1],
      ],
      expect: 'lul',
      note: '"ul" is the same length but sorts later',
    },
    {
      args: [
        [[0, 0, 0, 0, 0], [1, 1, 0, 0, 1], [0, 0, 0, 0, 0], [0, 1, 0, 0, 1], [0, 1, 0, 0, 0]],
        [4, 3],
        [3, 0],
      ],
      expect: 'impossible',
    },
    {
      args: [
        [[0, 0, 0, 0, 0, 0, 0], [0, 0, 1, 0, 0, 1, 0], [0, 0, 0, 0, 1, 0, 0], [0, 0, 0, 0, 0, 0, 1]],
        [0, 4],
        [3, 5],
      ],
      expect: 'dldr',
    },
    { args: [[[0, 0]], [0, 0], [0, 1]], expect: 'r', note: 'one roll' },
    { args: [[[0, 0, 0]], [0, 0], [0, 1]], expect: 'r', note: 'the ball drops in mid-roll' },
    { args: [[[0, 0], [0, 0]], [1, 1], [0, 0]], expect: 'lu', note: '"lu" and "ul" tie on distance; "lu" sorts first' },
    { args: [[[0, 1, 0], [0, 1, 0], [0, 0, 0]], [0, 0], [0, 2]], expect: 'dru', note: 'around the wall' },
  ],
  demo: [
    [[0, 0, 0, 0, 0], [1, 1, 0, 0, 1], [0, 0, 0, 0, 0], [0, 1, 0, 0, 1], [0, 1, 0, 0, 0]],
    [4, 3],
    [0, 1],
  ],
  starter: {
    js: `function findShortestWay(maze, ball, hole) {
  // maze: number[][], ball: number[], hole: number[]  ->  string
}
`,
    cpp: `string findShortestWay(vector<vector<int>>& maze, vector<int>& ball, vector<int>& hole) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'relax-with-a-queue',
      label: 'Breadth-first search that keeps improving (distance, path)',
      kind: 'brute',
      time: 'O((m * n)^2 * max(m, n))',
      space: 'O(m * n)',
      blurb:
        'Search over resting places, remembering for each the best pair seen so far — shortest distance, then smallest instruction string — and re-enqueue a stop whenever a better pair reaches it. Rolling stops early when the ball passes over the hole. Correct, but unordered: stops are re-expanded every time their label improves, and the hole\'s label is only trusted once the queue drains.',
      code: {
        cpp: {
          lines: [
            'string findShortestWay(vector<vector<int>>& maze, vector<int>& ball, vector<int>& hole) {',
            '    int m = maze.size(), n = maze[0].size();',
            '    const int dr[4] = {1, 0, 0, -1}, dc[4] = {0, -1, 1, 0};',
            '    const char name[4] = {\'d\', \'l\', \'r\', \'u\'};',
            '    vector<vector<pair<int, string>>> best(m, vector<pair<int, string>>(n, {INT_MAX, ""}));',
            '    best[ball[0]][ball[1]] = {0, ""};',
            '    queue<pair<int, int>> q;',
            '    q.push({ball[0], ball[1]});',
            '    while (!q.empty()) {',
            '        auto [r, c] = q.front(); q.pop();',
            '        if (r == hole[0] && c == hole[1]) continue;',
            '        auto [d, path] = best[r][c];',
            '        for (int k = 0; k < 4; ++k) {',
            '            int nr = r, nc = c, steps = 0;',
            '            while (nr + dr[k] >= 0 && nr + dr[k] < m && nc + dc[k] >= 0 && nc + dc[k] < n &&',
            '                   maze[nr + dr[k]][nc + dc[k]] == 0) {',
            '                nr += dr[k]; nc += dc[k]; ++steps;',
            '                if (nr == hole[0] && nc == hole[1]) break;',
            '            }',
            '            if (steps == 0) continue;',
            '            pair<int, string> next = {d + steps, path + name[k]};',
            '            if (next < best[nr][nc]) { best[nr][nc] = next; q.push({nr, nc}); }',
            '        }',
            '    }',
            '    auto& at = best[hole[0]][hole[1]];',
            '    return at.first == INT_MAX ? "impossible" : at.second;',
            '}',
          ],
        },
        js: {
          lines: [
            'function findShortestWay(maze, ball, hole) {',
            '  const m = maze.length;',
            '  const n = maze[0].length;',
            "  const dirs = [[1, 0, 'd'], [0, -1, 'l'], [0, 1, 'r'], [-1, 0, 'u']];",
            '  const key = (r, c) => r * n + c;',
            '  const cheaper = (a, b) => a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]);',
            '',
            "  const best = new Map([[key(ball[0], ball[1]), [0, '']]]);",
            '  const queue = [ball];',
            '  for (let head = 0; head < queue.length; head++) {',
            '    const [r, c] = queue[head];',
            '    if (r === hole[0] && c === hole[1]) continue;',
            '    const [d, path] = best.get(key(r, c));',
            '    for (const [dr, dc, name] of dirs) {',
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
            '        if (nr === hole[0] && nc === hole[1]) break;',
            '      }',
            '      if (steps === 0) continue;',
            '      const next = [d + steps, path + name];',
            '      const old = best.get(key(nr, nc));',
            '      if (!old || cheaper(next, old)) {',
            '        best.set(key(nr, nc), next);',
            '        queue.push([nr, nc]);',
            '      }',
            '    }',
            '  }',
            "  return best.get(key(hole[0], hole[1]))?.[1] ?? 'impossible';",
            '}',
          ],
        },
      },

      run([maze, ball, hole]: [number[][], number[], number[]], c) {
        const m = maze.length
        const n = maze[0].length
        const dirs: [number, number, string][] = [
          [1, 0, 'd'],
          [0, -1, 'l'],
          [0, 1, 'r'],
          [-1, 0, 'u'],
        ]
        const key = (r: number, col: number) => r * n + col
        const cheaper = (a: [number, string], b: [number, string]) => a[0] < b[0] || (a[0] === b[0] && a[1] < b[1])
        const best = new Map<number, [number, string]>([[key(ball[0], ball[1]), [0, '']]])
        const queue: number[][] = [ball]
        for (let head = 0; head < queue.length; head++) {
          const [r, col] = queue[head]
          if (r === hole[0] && col === hole[1]) continue
          const [d, path] = best.get(key(r, col))!
          for (const [dr, dc, name] of dirs) {
            let nr = r
            let nc = col
            let steps = 0
            while (nr + dr >= 0 && nr + dr < m && nc + dc >= 0 && nc + dc < n && maze[nr + dr][nc + dc] === 0) {
              c.ops++
              nr += dr
              nc += dc
              steps++
              if (nr === hole[0] && nc === hole[1]) break
            }
            c.ops++
            if (steps === 0) continue
            const next: [number, string] = [d + steps, path + name]
            const old = best.get(key(nr, nc))
            if (!old || cheaper(next, old)) {
              best.set(key(nr, nc), next)
              queue.push([nr, nc])
            }
          }
        }
        return best.get(key(hole[0], hole[1]))?.[1] ?? 'impossible'
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'dijkstra-path',
      label: 'Dijkstra on (distance, path)',
      kind: 'optimal',
      time: 'O(m * n * max(m, n) * log(m * n))',
      space: 'O(m * n)',
      blurb:
        'Order the frontier and the re-expansion disappears. Sort states by distance first and by the instruction string second, and Dijkstra settles both requirements at once — the first time the hole is popped, no shorter route exists and no equally short route sorts earlier, so the search can stop right there. Rolling still stops early when the ball passes over the hole.',
      code: {
        cpp: {
          lines: [
            'string findShortestWay(vector<vector<int>>& maze, vector<int>& ball, vector<int>& hole) {',
            '    int m = maze.size(), n = maze[0].size();',
            "    const int dr[] = {1, 0, 0, -1}, dc[] = {0, -1, 1, 0};",
            "    const char name[] = {'d', 'l', 'r', 'u'};",
            '',
            '    map<pair<int, int>, pair<int, string>> best;',
            '    priority_queue<tuple<int, string, int, int>,',
            '                   vector<tuple<int, string, int, int>>, greater<>> pq;',
            '    pq.push({0, "", ball[0], ball[1]});',
            '    best[{ball[0], ball[1]}] = {0, ""};',
            '',
            '    while (!pq.empty()) {',
            '        auto [d, path, r, c] = pq.top();',
            '        pq.pop();',
            '        if (r == hole[0] && c == hole[1]) return path;',
            '        if (best.count({r, c}) && best[{r, c}] < make_pair(d, path)) continue;',
            '',
            '        for (int k = 0; k < 4; ++k) {',
            '            int nr = r, nc = c, steps = 0;',
            '            while (nr + dr[k] >= 0 && nr + dr[k] < m && nc + dc[k] >= 0 &&',
            '                   nc + dc[k] < n && maze[nr + dr[k]][nc + dc[k]] == 0) {',
            '                nr += dr[k];',
            '                nc += dc[k];',
            '                ++steps;',
            '                if (nr == hole[0] && nc == hole[1]) break;',
            '            }',
            '            if (steps == 0) continue;',
            '',
            '            pair<int, string> next = {d + steps, path + name[k]};',
            '            auto it = best.find({nr, nc});',
            '            if (it != best.end() && !(next < it->second)) continue;',
            '            best[{nr, nc}] = next;',
            '            pq.push({next.first, next.second, nr, nc});',
            '        }',
            '    }',
            '    return "impossible";',
            '}',
          ],
        },
        js: {
          lines: [
            'function findShortestWay(maze, ball, hole) {',
            '  const m = maze.length;',
            '  const n = maze[0].length;',
            "  const dirs = [[1, 0, 'd'], [0, -1, 'l'], [0, 1, 'r'], [-1, 0, 'u']];",
            '',
            '  const key = (r, c) => r * n + c;',
            '  const cheaper = (a, b) => a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]);',
            '',
            "  const best = new Map([[key(ball[0], ball[1]), [0, '']]]);",
            "  const pq = [[0, '', ball[0], ball[1]]];",
            '',
            '  while (pq.length) {',
            '    pq.sort((a, b) => (a[0] - b[0]) || (a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0));',
            '    const [d, path, r, c] = pq.shift();',
            '    if (r === hole[0] && c === hole[1]) return path;',
            '    const known = best.get(key(r, c));',
            '    if (known && cheaper(known, [d, path])) continue;',
            '',
            '    for (const [dr, dc, name] of dirs) {',
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
            '        if (nr === hole[0] && nc === hole[1]) break;',
            '      }',
            '      if (steps === 0) continue;',
            '',
            '      const next = [d + steps, path + name];',
            '      const old = best.get(key(nr, nc));',
            '      if (old && !cheaper(next, old)) continue;',
            '      best.set(key(nr, nc), next);',
            '      pq.push([next[0], next[1], nr, nc]);',
            '    }',
            '  }',
            "  return 'impossible';",
            '}',
          ],
        },
      },

      run([maze, ball, hole]: [number[][], number[], number[]], c) {
        const m = maze.length
        const n = maze[0].length
        const dirs: [number, number, string][] = [
          [1, 0, 'd'],
          [0, -1, 'l'],
          [0, 1, 'r'],
          [-1, 0, 'u'],
        ]
        const key = (r: number, col: number) => r * n + col
        const cheaper = (a: [number, string], b: [number, string]) =>
          a[0] < b[0] || (a[0] === b[0] && a[1] < b[1])

        const best = new Map<number, [number, string]>([[key(ball[0], ball[1]), [0, '']]])
        const pq: [number, string, number, number][] = [[0, '', ball[0], ball[1]]]

        while (pq.length) {
          c.ops++
          pq.sort((a, b) => a[0] - b[0] || (a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0))
          const [d, path, r, col] = pq.shift()!
          if (r === hole[0] && col === hole[1]) return path
          const known = best.get(key(r, col))
          if (known && cheaper(known, [d, path])) continue

          for (const [dr, dc, name] of dirs) {
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
              if (nr === hole[0] && nc === hole[1]) break
            }
            if (steps === 0) continue

            const next: [number, string] = [d + steps, path + name]
            const old = best.get(key(nr, nc))
            if (old && !cheaper(next, old)) continue
            best.set(key(nr, nc), next)
            pq.push([next[0], next[1], nr, nc])
          }
        }
        return 'impossible'
      },
    },
  ],
}
