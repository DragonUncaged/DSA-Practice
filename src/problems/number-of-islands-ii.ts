import type { Problem } from '@/lib/types'

export const numberOfIslandsII: Problem = {
  id: 'number-of-islands-ii',
  title: 'Number of Islands II',
  group: 'Hard',
  pattern: 'Union Find',
  difficulty: 'Hard',
  leetcode: 'https://leetcode.com/problems/number-of-islands-ii/',
  statement:
    'An `m x n` grid starts as all water. Each entry of `positions` turns one cell into land. After every operation, report how many islands the grid holds, where an island is a group of land cells joined up, down, left or right.',
  constraints: [
    '1 <= m, n, positions.length <= 10^4',
    '1 <= m * n <= 10^4',
    'positions[i].length == 2',
    '0 <= positions[i][0] < m and 0 <= positions[i][1] < n',
  ],
  signature: {
    fn: 'numIslands2',
    params: [
      { name: 'm', type: 'int' },
      { name: 'n', type: 'int' },
      { name: 'positions', type: 'int[][]' },
    ],
    ret: 'int[]',
  },
  tests: [
    { args: [3, 3, [[0, 0], [0, 1], [1, 2], [2, 1]]], expect: [1, 1, 2, 3] },
    { args: [1, 1, [[0, 0]]], expect: [1], note: 'a single cell' },
    { args: [2, 2, [[0, 0], [0, 0]]], expect: [1, 1], note: 'the same cell twice' },
    {
      args: [2, 2, [[0, 0], [1, 1], [0, 1]]],
      expect: [1, 2, 1],
      note: 'the third cell joins two islands into one',
    },
    { args: [1, 3, [[0, 0], [0, 2], [0, 1]]], expect: [1, 2, 1], note: 'a bridge in a row' },
    {
      args: [3, 3, [[0, 0], [0, 2], [2, 0], [2, 2], [1, 1], [0, 1], [1, 0], [1, 2], [2, 1]]],
      expect: [1, 2, 3, 4, 5, 3, 2, 1, 1],
      note: 'the centre joins nothing, then each edge cell merges islands',
    },
    { args: [2, 3, []], expect: [], note: 'no operations' },
  ],
  scale: (n) => {
    const side = Math.max(2, Math.round(Math.sqrt(n)))
    return [side, side, Array.from({ length: n }, (_, i) => [Math.floor(i / side) % side, i % side])]
  },
  demo: [3, 3, [[0, 0], [0, 1], [1, 2], [2, 1]]],
  starter: {
    js: `function numIslands2(m, n, positions) {
  // m: number, n: number, positions: number[][]  ->  number[]
}
`,
    cpp: `vector<int> numIslands2(int m, int n, vector<vector<int>>& positions) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'recount',
      label: 'Recount the islands after every addition',
      kind: 'brute',
      time: 'O(k * m * n)',
      space: 'O(m * n)',
      blurb:
        'Add the cell, then run the ordinary Number of Islands flood fill over the whole grid and report the count. Correct, and it ignores that only the neighbourhood of the new cell changed — every operation pays for the entire grid.',
      code: {
        cpp: {
          lines: [
            'vector<int> numIslands2(int m, int n, vector<vector<int>>& positions) {',
            '    vector<vector<int>> land(m, vector<int>(n, 0));',
            '    const int dr[4] = {1, -1, 0, 0}, dc[4] = {0, 0, 1, -1};',
            '    vector<int> out;',
            '    for (auto& p : positions) {',
            '        land[p[0]][p[1]] = 1;',
            '        vector<vector<bool>> seen(m, vector<bool>(n, false));',
            '        int count = 0;',
            '        for (int r = 0; r < m; ++r) for (int c = 0; c < n; ++c) {',
            '            if (!land[r][c] || seen[r][c]) continue;',
            '            ++count;',
            '            queue<pair<int, int>> q;',
            '            q.push({r, c}); seen[r][c] = true;',
            '            while (!q.empty()) {',
            '                auto [cr, cc] = q.front(); q.pop();',
            '                for (int d = 0; d < 4; ++d) {',
            '                    int nr = cr + dr[d], nc = cc + dc[d];',
            '                    if (nr < 0 || nc < 0 || nr >= m || nc >= n) continue;',
            '                    if (!land[nr][nc] || seen[nr][nc]) continue;',
            '                    seen[nr][nc] = true;',
            '                    q.push({nr, nc});',
            '                }',
            '            }',
            '        }',
            '        out.push_back(count);',
            '    }',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function numIslands2(m, n, positions) {',
            '  const land = Array.from({ length: m }, () => new Array(n).fill(0));',
            '  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];',
            '  const out = [];',
            '  for (const [pr, pc] of positions) {',
            '    land[pr][pc] = 1;',
            '    const seen = Array.from({ length: m }, () => new Array(n).fill(false));',
            '    let count = 0;',
            '    for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) {',
            '      if (!land[r][c] || seen[r][c]) continue;',
            '      count++;',
            '      const queue = [[r, c]];',
            '      seen[r][c] = true;',
            '      for (let head = 0; head < queue.length; head++) {',
            '        const [cr, cc] = queue[head];',
            '        for (const [dr, dc] of dirs) {',
            '          const nr = cr + dr;',
            '          const nc = cc + dc;',
            '          if (nr < 0 || nc < 0 || nr >= m || nc >= n) continue;',
            '          if (!land[nr][nc] || seen[nr][nc]) continue;',
            '          seen[nr][nc] = true;',
            '          queue.push([nr, nc]);',
            '        }',
            '      }',
            '    }',
            '    out.push(count);',
            '  }',
            '  return out;',
            '}',
          ],
        },
      },

      run([m, n, positions]: [number, number, number[][]], c) {
        if (positions.length * m * n > 5_000_000) throw new Error('too slow')
        const land = Array.from({ length: m }, () => new Array<number>(n).fill(0))
        const dirs = [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]
        const out: number[] = []
        for (const [pr, pc] of positions) {
          land[pr][pc] = 1
          const seen = Array.from({ length: m }, () => new Array<boolean>(n).fill(false))
          let count = 0
          for (let r = 0; r < m; r++)
            for (let col = 0; col < n; col++) {
              c.ops++
              if (!land[r][col] || seen[r][col]) continue
              count++
              const queue: [number, number][] = [[r, col]]
              seen[r][col] = true
              for (let head = 0; head < queue.length; head++) {
                const [cr, cc] = queue[head]
                for (const [dr, dc] of dirs) {
                  c.ops++
                  const nr = cr + dr
                  const nc = cc + dc
                  if (nr < 0 || nc < 0 || nr >= m || nc >= n) continue
                  if (!land[nr][nc] || seen[nr][nc]) continue
                  seen[nr][nc] = true
                  queue.push([nr, nc])
                }
              }
            }
          out.push(count)
        }
        return out
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'union-find',
      label: 'Union find, counting sets as they merge',
      kind: 'optimal',
      time: 'O(k * a(m * n))',
      space: 'O(m * n)',
      blurb:
        'Land is only ever added, never removed, so the island count only changes in two ways: a new cell adds one, and every distinct neighbouring island it joins removes one. Union find tracks exactly that without touching the rest of the grid — find the roots of the four neighbours, and decrement the count on each merge that actually happened. Near-constant work per operation.',
      code: {
        cpp: {
          lines: [
            'vector<int> numIslands2(int m, int n, vector<vector<int>>& positions) {',
            '    vector<int> parent(m * n, -1);',
            '    function<int(int)> find = [&](int x) {',
            '        while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; }',
            '        return x;',
            '    };',
            '',
            '    int count = 0;',
            '    vector<int> out;',
            '    const int dr[] = {1, -1, 0, 0}, dc[] = {0, 0, 1, -1};',
            '',
            '    for (auto& p : positions) {',
            '        int r = p[0], c = p[1], id = r * n + c;',
            '        if (parent[id] != -1) { out.push_back(count); continue; }',
            '        parent[id] = id;',
            '        ++count;',
            '        for (int d = 0; d < 4; ++d) {',
            '            int nr = r + dr[d], nc = c + dc[d];',
            '            if (nr < 0 || nc < 0 || nr >= m || nc >= n) continue;',
            '            int nid = nr * n + nc;',
            '            if (parent[nid] == -1) continue;',
            '            int a = find(id), b = find(nid);',
            '            if (a != b) { parent[b] = a; --count; }',
            '        }',
            '        out.push_back(count);',
            '    }',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function numIslands2(m, n, positions) {',
            '  const parent = new Array(m * n).fill(-1);',
            '  const find = (x) => {',
            '    while (parent[x] !== x) {',
            '      parent[x] = parent[parent[x]];',
            '      x = parent[x];',
            '    }',
            '    return x;',
            '  };',
            '',
            '  let count = 0;',
            '  const out = [];',
            '  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];',
            '',
            '  for (const [r, c] of positions) {',
            '    const id = r * n + c;',
            '    if (parent[id] !== -1) { out.push(count); continue; }',
            '    parent[id] = id;',
            '    count++;',
            '    for (const [dr, dc] of dirs) {',
            '      const nr = r + dr;',
            '      const nc = c + dc;',
            '      if (nr < 0 || nc < 0 || nr >= m || nc >= n) continue;',
            '      const nid = nr * n + nc;',
            '      if (parent[nid] === -1) continue;',
            '      const a = find(id);',
            '      const b = find(nid);',
            '      if (a !== b) { parent[b] = a; count--; }',
            '    }',
            '    out.push(count);',
            '  }',
            '  return out;',
            '}',
          ],
        },
      },

      run([m, n, positions]: [number, number, number[][]], c) {
        const parent = new Array<number>(m * n).fill(-1)
        const find = (x: number) => {
          while (parent[x] !== x) {
            c.ops++
            parent[x] = parent[parent[x]]
            x = parent[x]
          }
          return x
        }
        let count = 0
        const out: number[] = []
        const dirs = [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]
        for (const [r, col] of positions) {
          c.ops++
          const id = r * n + col
          if (parent[id] !== -1) {
            out.push(count)
            continue
          }
          parent[id] = id
          count++
          for (const [dr, dc] of dirs) {
            const nr = r + dr
            const nc = col + dc
            if (nr < 0 || nc < 0 || nr >= m || nc >= n) continue
            const nid = nr * n + nc
            if (parent[nid] === -1) continue
            const a = find(id)
            const b = find(nid)
            if (a !== b) {
              parent[b] = a
              count--
            }
          }
          out.push(count)
        }
        return out
      },
    },
  ],
}
