import { grid, type Problem, type Tone } from '@/lib/types'

const DEMO: [string[][]] = [
  [
    ['1', '1', '0', '0', '0'],
    ['1', '1', '0', '0', '1'],
    ['0', '0', '1', '0', '1'],
    ['0', '0', '0', '1', '1'],
  ],
]

export const numberOfIslands: Problem = {
  id: 'number-of-islands',
  title: 'Number of Islands',
  group: 'Graph',
  pattern: 'Flood Fill',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/number-of-islands/',
  statement:
    "Given a grid of `'1'` (land) and `'0'` (water), count the islands. An island is land connected horizontally or vertically, and the grid is surrounded by water on all sides.",
  constraints: ['1 <= m, n <= 300', "grid[i][j] is '0' or '1'", 'Diagonals do not connect'],
  signature: { fn: 'numIslands', params: [{ name: 'grid', type: 'char[][]' }], ret: 'int' },
  tests: [
    {
      args: [
        [
          ['1', '1', '1', '1', '0'],
          ['1', '1', '0', '1', '0'],
          ['1', '1', '0', '0', '0'],
          ['0', '0', '0', '0', '0'],
        ],
      ],
      expect: 1,
    },
    {
      args: [
        [
          ['1', '1', '0', '0', '0'],
          ['1', '1', '0', '0', '0'],
          ['0', '0', '1', '0', '0'],
          ['0', '0', '0', '1', '1'],
        ],
      ],
      expect: 3,
    },
    { args: [[['0']]], expect: 0, note: 'all water' },
    { args: [[['1']]], expect: 1, note: 'single cell' },
    {
      args: [
        [
          ['1', '0', '1'],
          ['0', '1', '0'],
          ['1', '0', '1'],
        ],
      ],
      expect: 5,
      note: 'diagonals do not connect',
    },
  ],
  demo: DEMO,
  scale: (n) => {
    const k = Math.max(2, Math.round(Math.sqrt(n)))
    return [
      Array.from({ length: k }, (_, r) =>
        Array.from({ length: k }, (_, c) => ((r * 7 + c * 3) % 5 === 0 ? '0' : '1')),
      ),
    ]
  },
  starter: {
    py: `def numIslands(grid):
    # grid: list[list[str]]  ->  int
    pass
`,
    js: `function numIslands(grid) {
  // grid: string[][]  ->  number
}
`,
    cpp: `int numIslands(vector<vector<char>>& grid) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'flood-fill',
      label: 'Sink each island as you find it',
      kind: 'optimal',
      time: 'O(m * n)',
      space: 'O(m * n)',
      blurb:
        'Scan for any land you have not seen. The instant you find some, flood outward and sink the whole connected landmass to water. Because a sunk island can never be found again, the number of times the scan trips over land is exactly the number of islands.',
      code: {
        py: {
          lines: [
            'def numIslands(grid):',
            '    rows, cols = len(grid), len(grid[0])',
            '    count = 0',
            '',
            '    def sink(r, c):',
            '        if r < 0 or r >= rows or c < 0 or c >= cols:',
            '            return',
            "        if grid[r][c] != '1':",
            '            return',
            "        grid[r][c] = '0'",
            '        sink(r + 1, c); sink(r - 1, c)',
            '        sink(r, c + 1); sink(r, c - 1)',
            '',
            '    for r in range(rows):',
            '        for c in range(cols):',
            "            if grid[r][c] == '1':",
            '                count += 1',
            '                sink(r, c)',
            '    return count',
          ],
          map: { scan: 16, found: 17, sink: 10, spread: 11, edge: 9, done: 19 },
        },
        cpp: {
          lines: [
            'int numIslands(vector<vector<char>>& grid) {',
            '    int rows = grid.size(), cols = grid[0].size(), count = 0;',
            '    function<void(int, int)> sink = [&](int r, int c) {',
            '        if (r < 0 || r >= rows || c < 0 || c >= cols) return;',
            "        if (grid[r][c] != '1') return;",
            "        grid[r][c] = '0';",
            '        sink(r + 1, c); sink(r - 1, c);',
            '        sink(r, c + 1); sink(r, c - 1);',
            '    };',
            '    for (int r = 0; r < rows; ++r)',
            '        for (int c = 0; c < cols; ++c)',
            "            if (grid[r][c] == '1') { count++; sink(r, c); }",
            '    return count;',
            '}',
          ],
          map: { scan: 12, found: 12, sink: 6, spread: 7, edge: 5, done: 13 },
        },
        js: {
          lines: [
            'function numIslands(grid) {',
            '  const rows = grid.length, cols = grid[0].length;',
            '  let count = 0;',
            '',
            '  const sink = (r, c) => {',
            '    if (r < 0 || r >= rows || c < 0 || c >= cols) return;',
            "    if (grid[r][c] !== '1') return;",
            "    grid[r][c] = '0';",
            '    sink(r + 1, c); sink(r - 1, c);',
            '    sink(r, c + 1); sink(r, c - 1);',
            '  };',
            '',
            '  for (let r = 0; r < rows; r++)',
            '    for (let c = 0; c < cols; c++)',
            "      if (grid[r][c] === '1') { count++; sink(r, c); }",
            '  return count;',
            '}',
          ],
          map: { scan: 15, found: 15, sink: 8, spread: 9, edge: 7, done: 16 },
        },
      },

      trace(t, [input]: [string[][]]) {
        const g = input.map((row) => [...row])
        const rows = g.length
        const cols = g[0].length
        let count = 0

        /** Island number each cell was sunk into, for stable colouring. */
        const owner = new Map<string, number>()

        const paint = (cursor: [number, number] | null, tone: Tone) => {
          const tones: Record<string, Tone> = {}
          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const key = `${r},${c}`
              if (owner.has(key)) tones[key] = 'done'
              else if (g[r][c] === '1') tones[key] = 'band'
              else tones[key] = 'idle'
            }
          }
          if (cursor) tones[`${cursor[0]},${cursor[1]}`] = tone
          return grid(
            g.map((row, r) =>
              row.map((v, c) => (owner.has(`${r},${c}`) ? String(owner.get(`${r},${c}`)) : v)),
            ),
            { tones, cursor, title: 'grid  ·  1 is land, 0 is water' },
          )
        }

        t.push({
          step: 'scan',
          note: 'Sweep the grid row by row looking for land that has not been claimed yet.',
          view: paint(null, 'idle'),
          vars: [['islands', 0]],
        })

        const sink = (r: number, c: number, depth: number) => {
          if (t.full) return
          if (r < 0 || r >= rows || c < 0 || c >= cols) return
          t.bump()

          if (g[r][c] !== '1') {
            t.push({
              step: 'edge',
              note: `(${r}, ${c}) is water or already sunk — the island stops here.`,
              view: paint([r, c], 'bad'),
              vars: [
                ['at', `(${r}, ${c})`, 'no'],
                ['depth', depth],
              ],
            })
            return
          }

          g[r][c] = '0'
          owner.set(`${r},${c}`, count)

          t.push({
            step: 'sink',
            note: `(${r}, ${c}) is part of island ${count}. Sink it to water so the outer scan can never count it again, then push outward to its four neighbours.`,
            view: paint([r, c], 'good'),
            vars: [
              ['at', `(${r}, ${c})`, 'ok'],
              ['island', count, 'ok'],
              ['depth', depth],
              ['cells visited', t.ops],
            ],
            badge: { text: `island ${count}`, accent: 'ok' },
          })

          sink(r + 1, c, depth + 1)
          sink(r - 1, c, depth + 1)
          sink(r, c + 1, depth + 1)
          sink(r, c - 1, depth + 1)
        }

        for (let r = 0; r < rows && !t.full; r++) {
          for (let c = 0; c < cols && !t.full; c++) {
            if (g[r][c] !== '1') continue
            t.push({
              step: 'found',
              note: `Untouched land at (${r}, ${c}). That is a brand new island — everything reachable from here belongs to it.`,
              view: paint([r, c], 'accent'),
              vars: [
                ['at', `(${r}, ${c})`, 'c'],
                ['islands', count + 1, 'ok'],
              ],
              badge: { text: `island ${count} found`, accent: 'ok' },
            })
            sink(r, c, 0)
            count++
          }
        }

        t.push({
          step: 'done',
          note: `${count} island${count === 1 ? '' : 's'}. Every cell was looked at a constant number of times, so the whole thing is linear in the grid's area.`,
          view: paint(null, 'idle'),
          vars: [
            ['answer', count, 'ok'],
            ['cells visited', t.ops],
          ],
          badge: { text: `${count} islands`, accent: 'ok' },
        })
      },

      run([input]: [string[][]], c) {
        const g = input.map((row) => [...row])
        const rows = g.length
        const cols = g[0].length
        let count = 0

        const sink = (r: number, col: number) => {
          const stack: [number, number][] = [[r, col]]
          while (stack.length) {
            const [y, x] = stack.pop()!
            c.ops++
            if (y < 0 || y >= rows || x < 0 || x >= cols) continue
            if (g[y][x] !== '1') continue
            g[y][x] = '0'
            stack.push([y + 1, x], [y - 1, x], [y, x + 1], [y, x - 1])
          }
        }

        for (let r = 0; r < rows; r++) {
          for (let col = 0; col < cols; col++) {
            c.ops++
            if (g[r][col] === '1') {
              count++
              sink(r, col)
            }
          }
        }
        return count
      },
    },
  ],
}
