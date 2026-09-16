import { grid, type Problem, type Tone } from '@/lib/types'

const DEMO: [number[][]] = [
  [
    [1, 2, 2, 3, 5],
    [3, 2, 3, 4, 4],
    [2, 4, 5, 3, 1],
    [6, 7, 1, 4, 5],
    [5, 1, 1, 2, 4],
  ],
]

export const pacificAtlanticWaterFlow: Problem = {
  id: 'pacific-atlantic-water-flow',
  title: 'Pacific Atlantic Water Flow',
  group: 'Graph',
  pattern: 'DFS from the Borders',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/pacific-atlantic-water-flow/',
  statement:
    'Rain falls on a height grid. Water flows to a neighbour of equal or lower height. The Pacific touches the top and left edges, the Atlantic the bottom and right. Return every cell from which water can reach both oceans.',
  constraints: ['1 <= m, n <= 200', '0 <= heights[i][j] <= 10^5'],
  signature: { fn: 'pacificAtlantic', params: [{ name: 'heights', type: 'int[][]' }], ret: 'int[][]' },
  // The cells may come back in any order, but each one is an ordered [row,
  // col] pair — 'set' would accept [col, row] for [row, col].
  compare: 'sorted',
  tests: [
    {
      args: [
        [
          [1, 2, 2, 3, 5],
          [3, 2, 3, 4, 4],
          [2, 4, 5, 3, 1],
          [6, 7, 1, 4, 5],
          [5, 1, 1, 2, 4],
        ],
      ],
      expect: [[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]],
    },
    { args: [[[1]]], expect: [[0, 0]], note: 'one cell touches both oceans' },
    { args: [[[1, 1], [1, 1]]], expect: [[0, 0], [0, 1], [1, 0], [1, 1]] },
  ],
  demo: DEMO,
  scale: (n) => {
    const k = Math.max(2, Math.round(Math.sqrt(n)))
    return [Array.from({ length: k }, (_, r) => Array.from({ length: k }, (_, c) => ((r * 5 + c * 3) % 9) + 1))]
  },
  starter: {
    js: `function pacificAtlantic(heights) {
  // heights: number[][]  ->  number[][]
}
`,
    cpp: `vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'reverse-dfs',
      label: 'Flow uphill from each ocean',
      kind: 'optimal',
      time: 'O(m * n)',
      space: 'O(m * n)',
      blurb:
        'Chasing water downhill from every cell is quadratic pain. Flip it: start in each ocean and climb — a cell drains to an ocean exactly if the ocean can reach it going uphill. Two border-seeded DFS floods, then intersect the two claimed sets.',
      code: {
        cpp: {
          lines: [
            'vector<vector<int>> pacificAtlantic(vector<vector<int>>& h) {',
            '    int m = h.size(), n = h[0].size();',
            '    auto flood = [&](vector<vector<bool>>& seen, vector<pair<int,int>> stack) {',
            '        int dr[] = {1,-1,0,0}, dc[] = {0,0,1,-1};',
            '        while (!stack.empty()) {',
            '            auto [r, c] = stack.back(); stack.pop_back();',
            '            for (int k = 0; k < 4; ++k) {',
            '                int nr = r + dr[k], nc = c + dc[k];',
            '                if (nr >= 0 && nr < m && nc >= 0 && nc < n',
            '                        && !seen[nr][nc] && h[nr][nc] >= h[r][c]) {',
            '                    seen[nr][nc] = true;',
            '                    stack.push_back({nr, nc});',
            '                }',
            '            }',
            '        }',
            '    };',
            '    vector<vector<bool>> pac(m, vector<bool>(n)), atl(m, vector<bool>(n));',
            '    vector<pair<int,int>> ps, as;',
            '    for (int j = 0; j < n; ++j) { pac[0][j]=1; ps.push_back({0,j}); atl[m-1][j]=1; as.push_back({m-1,j}); }',
            '    for (int i = 0; i < m; ++i) { pac[i][0]=1; ps.push_back({i,0}); atl[i][n-1]=1; as.push_back({i,n-1}); }',
            '    flood(pac, ps); flood(atl, as);',
            '    vector<vector<int>> out;',
            '    for (int i = 0; i < m; ++i)',
            '        for (int j = 0; j < n; ++j)',
            '            if (pac[i][j] && atl[i][j]) out.push_back({i, j});',
            '    return out;',
            '}',
          ],
          map: { init: 2, pac: 21, atl: 21, climb: 11, both: 25, done: 26 },
        },
        js: {
          lines: [
            'function pacificAtlantic(heights) {',
            '  const m = heights.length;',
            '  const n = heights[0].length;',
            '  const flood = (starts) => {',
            '    const seen = new Set(starts.map(([r, c]) => r * n + c));',
            '    const stack = [...starts];',
            '    while (stack.length) {',
            '      const [r, c] = stack.pop();',
            '      for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {',
            '        const nr = r + dr;',
            '        const nc = c + dc;',
            '        if (nr >= 0 && nr < m && nc >= 0 && nc < n &&',
            '            !seen.has(nr * n + nc) && heights[nr][nc] >= heights[r][c]) {',
            '          seen.add(nr * n + nc);',
            '          stack.push([nr, nc]);',
            '        }',
            '      }',
            '    }',
            '    return seen;',
            '  };',
            '  const pacStarts = [];',
            '  const atlStarts = [];',
            '  for (let j = 0; j < n; j++) { pacStarts.push([0, j]); atlStarts.push([m - 1, j]); }',
            '  for (let i = 0; i < m; i++) { pacStarts.push([i, 0]); atlStarts.push([i, n - 1]); }',
            '  const pac = flood(pacStarts);',
            '  const atl = flood(atlStarts);',
            '  const out = [];',
            '  for (let i = 0; i < m; i++)',
            '    for (let j = 0; j < n; j++)',
            '      if (pac.has(i * n + j) && atl.has(i * n + j)) out.push([i, j]);',
            '  return out;',
            '}',
          ],
          map: { init: 2, pac: 25, atl: 26, climb: 14, both: 30, done: 31 },
        },
      },

      trace(t, [heights]: [number[][]]) {
        const m = heights.length
        const n = heights[0].length
        const pac = new Set<number>()
        const atl = new Set<number>()

        const paint = (focus: [number, number] | null, tone: Tone) => {
          const tones: Record<string, Tone> = {}
          for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
              const key = i * n + j
              const p = pac.has(key)
              const a = atl.has(key)
              tones[`${i},${j}`] = p && a ? 'good' : p ? 'band' : a ? 'accent' : 'idle'
            }
          }
          if (focus) tones[`${focus[0]},${focus[1]}`] = tone
          return grid(heights, {
            tones,
            cursor: focus,
            title: 'heights · blue-grey = Pacific, violet = Atlantic, green = both',
          })
        }

        const flood = (
          ocean: Set<number>,
          starts: [number, number][],
          label: string,
          step: string,
        ) => {
          starts.forEach(([r, c]) => ocean.add(r * n + c))
          t.push({
            step,
            note: `${label} starts from its coastline and climbs: a neighbouring cell is claimable when its height is >= the current one, because real water would flow the other way.`,
            view: paint(null, 'idle'),
            vars: [['ocean', label, 'c']],
          })
          const stack = [...starts]
          while (stack.length && !t.full) {
            const [r, c] = stack.pop()!
            for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
              const nr = r + dr
              const nc = c + dc
              t.bump()
              if (
                nr >= 0 &&
                nr < m &&
                nc >= 0 &&
                nc < n &&
                !ocean.has(nr * n + nc) &&
                heights[nr][nc] >= heights[r][c]
              ) {
                ocean.add(nr * n + nc)
                stack.push([nr, nc])
                t.push({
                  step: 'climb',
                  note: `${label} climbs from (${r}, ${c}) h=${heights[r][c]} up to (${nr}, ${nc}) h=${heights[nr][nc]} — so rain on (${nr}, ${nc}) drains down to the ${label}.`,
                  view: paint([nr, nc], 'active'),
                  vars: [
                    ['claimed', `(${nr}, ${nc})`, 'c'],
                    ['height', heights[nr][nc]],
                  ],
                })
              }
            }
          }
        }

        const pacStarts: [number, number][] = []
        const atlStarts: [number, number][] = []
        for (let j = 0; j < n; j++) {
          pacStarts.push([0, j])
          atlStarts.push([m - 1, j])
        }
        for (let i = 0; i < m; i++) {
          pacStarts.push([i, 0])
          atlStarts.push([i, n - 1])
        }

        t.push({
          step: 'init',
          note: 'Instead of asking every cell "where does your water go?", ask each ocean "how high can you reach?" — two floods instead of one per cell.',
          view: paint(null, 'idle'),
          vars: [
            ['grid', `${m} x ${n}`],
          ],
        })

        flood(pac, pacStarts, 'Pacific', 'pac')
        flood(atl, atlStarts, 'Atlantic', 'atl')

        const out: number[][] = []
        for (let i = 0; i < m; i++) {
          for (let j = 0; j < n; j++) {
            if (pac.has(i * n + j) && atl.has(i * n + j)) out.push([i, j])
          }
        }

        t.push({
          step: 'both',
          note: `Intersect the two claims: ${out.length} cell${out.length === 1 ? '' : 's'} can drain to both oceans (shown green).`,
          view: paint(null, 'idle'),
          vars: [['cells', out.length, 'ok']],
          badge: { text: `${out.length} cells reach both`, accent: 'ok' },
        })

        t.push({
          step: 'done',
          note: `Each flood touches every cell at most once, so the whole thing is linear in the grid area — versus a DFS from every cell, which would be quadratic.`,
          view: paint(null, 'idle'),
          vars: [['answer', JSON.stringify(out), 'ok']],
          badge: { text: 'complete', accent: 'ok' },
        })
      },

      run([heights]: [number[][]], c) {
        const m = heights.length
        const n = heights[0].length
        const flood = (starts: [number, number][]) => {
          const seen = new Set(starts.map(([r, col]) => r * n + col))
          const stack = [...starts]
          while (stack.length) {
            const [r, col] = stack.pop()!
            for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
              c.ops++
              const nr = r + dr
              const nc = col + dc
              if (nr >= 0 && nr < m && nc >= 0 && nc < n && !seen.has(nr * n + nc) && heights[nr][nc] >= heights[r][col]) {
                seen.add(nr * n + nc)
                stack.push([nr, nc])
              }
            }
          }
          return seen
        }
        const pacStarts: [number, number][] = []
        const atlStarts: [number, number][] = []
        for (let j = 0; j < n; j++) {
          pacStarts.push([0, j])
          atlStarts.push([m - 1, j])
        }
        for (let i = 0; i < m; i++) {
          pacStarts.push([i, 0])
          atlStarts.push([i, n - 1])
        }
        const pac = flood(pacStarts)
        const atl = flood(atlStarts)
        const out: number[][] = []
        for (let i = 0; i < m; i++) {
          for (let j = 0; j < n; j++) {
            if (pac.has(i * n + j) && atl.has(i * n + j)) out.push([i, j])
          }
        }
        return out
      },
    },
  ],
}
