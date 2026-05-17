import { grid } from '@/lib/types'
import type { PatternIntro } from './index'

// 1 = land, 0 = water; two islands
const G = [
  [1, 1, 0, 0],
  [1, 0, 0, 1],
  [0, 0, 1, 1],
]

export const graphs: PatternIntro = {
  id: 'graphs',
  name: 'Graphs & Flood Fill',
  tagline: 'Once you can visit every node reachable from one start, most graph questions fall.',
  story: [
    'A surprising number of problems are secretly one operation: *flood fill* — start somewhere, spread to every reachable neighbour, and mark where you have been. Count how many times you have to start over and you have counted islands, connected components, friend circles. The grid below is a graph in disguise: each cell is a node, each adjacency is an edge.',
    'The visited set is the entire trick. Without it, a cycle loops forever; with it, every node is entered exactly once and the whole traversal is O(nodes + edges). Whether you spread with DFS (dive) or BFS (rings) rarely changes the answer — it changes the order of the same visits.',
    'From there, graph problems add one twist each: Clone Graph makes you carry a old-to-new map *while* flooding; Pacific Atlantic floods from the oceans inward instead of from each cell outward; Valid Tree asks whether the flood covers everything exactly once with no edge left over. Learn the fill deeply and the twists stay small.',
  ],
  signals: [
    'Connectivity: "how many groups", "can A reach B", "is it all one piece".',
    'A grid where a cell\'s fate depends on its neighbours — grids are graphs.',
    'You must not process the same node twice — the visited set is load-bearing.',
    'The problem hands you edges, adjacency, or prerequisites in any costume.',
  ],
  pseudo: {
    lines: [
      'islands = 0',
      'for each cell:',
      '    if land and not seen:',
      '        islands += 1',
      '        flood fill from it',
      'return islands',
    ],
    map: { init: 1, scan: 2, found: 4, flood: 5, done: 6 },
  },

  trace(t) {
    const seen = new Set<string>()
    let islands = 0

    const view = (cursor: [number, number] | null) =>
      grid(G, {
        cursor,
        tones: Object.fromEntries(
          G.flatMap((row, r) =>
            row.map((v, c) => {
              const key = `${r},${c}`
              if (seen.has(key)) return [key, 'good'] as const
              return [key, v === 1 ? 'band' : 'idle'] as const
            }),
          ),
        ),
        title: '1 = land · flooded land turns green',
      })

    t.push({
      step: 'init',
      note: 'Scan every cell. Untouched land starts a new island and gets flooded on the spot; flooded land can never start one again.',
      view: view(null),
      vars: [['islands', 0]],
    })

    const flood = (r: number, c: number) => {
      if (r < 0 || r >= G.length || c < 0 || c >= G[0].length) return
      if (G[r][c] === 0 || seen.has(`${r},${c}`)) return
      seen.add(`${r},${c}`)
      t.bump()
      t.push({
        step: 'flood',
        note: `The fill spreads to (${r}, ${c}) and marks it. Marked cells are dead to future scans — that is what makes the count correct.`,
        view: view([r, c]),
        vars: [['islands', islands, 'c']],
      })
      flood(r - 1, c)
      flood(r + 1, c)
      flood(r, c - 1)
      flood(r, c + 1)
    }

    for (let r = 0; r < G.length; r++) {
      for (let c = 0; c < G[0].length; c++) {
        t.bump()
        if (G[r][c] === 1 && !seen.has(`${r},${c}`)) {
          islands++
          t.push({
            step: 'found',
            note: `Fresh land at (${r}, ${c}) that no flood has reached — it must belong to a brand-new island. Count it, then flood everything connected to it.`,
            view: view([r, c]),
            vars: [['islands', islands, 'ok']],
            badge: { text: `island #${islands}`, accent: 'ok' },
          })
          flood(r, c)
        }
      }
    }

    t.push({
      step: 'done',
      note: `Every land cell was flooded exactly once, so the answer is exact: ${islands} islands. O(cells) total, visited set doing the heavy lifting.`,
      view: view(null),
      vars: [['islands', islands, 'ok']],
      badge: { text: `${islands} islands`, accent: 'ok' },
    })
  },

  ramp: [
    'number-of-islands',
    'clone-graph',
    'pacific-atlantic-water-flow',
    'graph-valid-tree',
    'number-of-connected-components-in-an-undirected-graph',
  ],
}
