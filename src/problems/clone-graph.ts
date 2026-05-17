import { arr, combo, mapOf, stackOf, type Problem, type Tone } from '@/lib/types'

const DEMO: [number[][]] = [[[2, 4], [1, 3], [2, 4], [1, 3]]]

export const cloneGraph: Problem = {
  id: 'clone-graph',
  title: 'Clone Graph',
  group: 'Graph',
  pattern: 'BFS + Hash Map',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/clone-graph/',
  statement:
    'Given a connected undirected graph as an adjacency list (`adjList[i]` holds the 1-indexed neighbours of node `i+1`), return a deep copy of it in the same form. The copy must share no nodes with the original.',
  constraints: ['0 <= nodes <= 100', 'The graph is connected', 'No self-loops or repeated edges'],
  signature: { fn: 'cloneGraph', params: [{ name: 'adjList', type: 'int[][]' }], ret: 'int[][]' },
  tests: [
    { args: [[[2, 4], [1, 3], [2, 4], [1, 3]]], expect: [[2, 4], [1, 3], [2, 4], [1, 3]] },
    { args: [[[]]], expect: [[]], note: 'one lonely node' },
    { args: [[]], expect: [], note: 'empty graph' },
    { args: [[[2], [1]]], expect: [[2], [1]] },
  ],
  demo: DEMO,
  scale: (n) => [
    Array.from({ length: n }, (_, i) => {
      const out: number[] = []
      if (i > 0) out.push(i) // 1-indexed previous
      if (i < n - 1) out.push(i + 2) // 1-indexed next
      return out
    }),
  ],
  starter: {
    py: `def cloneGraph(adjList):
    # adjList: list[list[int]] (1-indexed neighbours)  ->  list[list[int]]
    pass
`,
    js: `function cloneGraph(adjList) {
  // adjList: number[][] (1-indexed neighbours)  ->  number[][]
}
`,
    cpp: `vector<vector<int>> cloneGraph(vector<vector<int>>& adjList) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'bfs',
      label: 'BFS with an old-to-new map',
      kind: 'optimal',
      time: 'O(V + E)',
      space: 'O(V)',
      blurb:
        'The whole trick is one map from original node to its clone. Walk the graph breadth-first; the first time you meet a node, mint its clone and record it, and wire every edge through the map so shared neighbours resolve to the same clone instead of being copied twice.',
      code: {
        py: {
          lines: [
            'def cloneGraph(adjList):',
            '    if not adjList:',
            '        return []',
            '    n = len(adjList)',
            '    cloned = [False] * (n + 1)',
            '    copy = [[] for _ in range(n)]',
            '    queue = [1]',
            '    cloned[1] = True',
            '    while queue:',
            '        u = queue.pop(0)',
            '        for v in adjList[u - 1]:',
            '            copy[u - 1].append(v)',
            '            if not cloned[v]:',
            '                cloned[v] = True',
            '                queue.append(v)',
            '    return copy',
          ],
          map: { init: 7, visit: 10, wire: 12, mint: 14, done: 16 },
        },
        cpp: {
          lines: [
            'vector<vector<int>> cloneGraph(vector<vector<int>>& adjList) {',
            '    int n = adjList.size();',
            '    if (n == 0) return {};',
            '    vector<bool> cloned(n + 1, false);',
            '    vector<vector<int>> copy(n);',
            '    queue<int> q;',
            '    q.push(1); cloned[1] = true;',
            '    while (!q.empty()) {',
            '        int u = q.front(); q.pop();',
            '        for (int v : adjList[u - 1]) {',
            '            copy[u - 1].push_back(v);',
            '            if (!cloned[v]) { cloned[v] = true; q.push(v); }',
            '        }',
            '    }',
            '    return copy;',
            '}',
          ],
          map: { init: 7, visit: 9, wire: 11, mint: 12, done: 15 },
        },
        js: {
          lines: [
            'function cloneGraph(adjList) {',
            '  const n = adjList.length;',
            '  if (n === 0) return [];',
            '  const cloned = new Array(n + 1).fill(false);',
            '  const copy = Array.from({ length: n }, () => []);',
            '  const queue = [1];',
            '  cloned[1] = true;',
            '  while (queue.length) {',
            '    const u = queue.shift();',
            '    for (const v of adjList[u - 1]) {',
            '      copy[u - 1].push(v);',
            '      if (!cloned[v]) {',
            '        cloned[v] = true;',
            '        queue.push(v);',
            '      }',
            '    }',
            '  }',
            '  return copy;',
            '}',
          ],
          map: { init: 6, visit: 9, wire: 11, mint: 13, done: 18 },
        },
      },

      trace(t, [adjList]: [number[][]]) {
        const n = adjList.length
        if (n === 0) {
          t.push({
            step: 'init',
            note: 'An empty graph clones to an empty graph.',
            view: mapOf([], { title: 'clones minted' }),
            vars: [['answer', '[]', 'ok']],
          })
          return
        }

        const cloned = new Array(n + 1).fill(false)
        const copy: number[][] = Array.from({ length: n }, () => [])
        const queue = [1]
        cloned[1] = true

        const view = (u: number | null, tone: Tone) => {
          const tones: Record<number, Tone> = {}
          for (let i = 0; i < n; i++) tones[i] = cloned[i + 1] ? 'done' : 'idle'
          if (u != null) tones[u - 1] = tone
          return combo(
            arr(
              adjList.map((ns) => ns.join(',') || '·'),
              { tones, title: 'original adjacency (cell i = neighbours of node i+1)' },
            ),
            mapOf(
              copy.map((ns, i) => ({ k: `clone ${i + 1}`, v: ns.length ? ns.join(',') : '—', tone: cloned[i + 1] ? ('band' as Tone) : ('dim' as Tone) })),
              { title: 'the copy being built' },
            ),
            stackOf(queue.length ? [...queue] : [], { title: 'BFS queue' }),
          )
        }

        t.push({
          step: 'init',
          note: `Start at node 1: mint its clone and queue it. The clone map is the whole algorithm — it guarantees each node is copied exactly once no matter how many edges point at it.`,
          view: view(1, 'active'),
          vars: [['queued', 1, 'c']],
        })

        while (queue.length && !t.full) {
          const u = queue.shift()!
          t.bump()
          t.push({
            step: 'visit',
            note: `Visit node ${u}: wire up its ${adjList[u - 1].length} edges in the copy.`,
            view: view(u, 'active'),
            vars: [
              ['visiting', u, 'b'],
              ['neighbours', adjList[u - 1].join(', ') || 'none'],
            ],
          })

          for (const v of adjList[u - 1]) {
            copy[u - 1].push(v)
            t.bump()
            if (!cloned[v]) {
              cloned[v] = true
              queue.push(v)
              t.push({
                step: 'mint',
                note: `Edge ${u} → ${v}: node ${v} has no clone yet, so mint one and queue it for its own visit.`,
                view: view(v, 'good'),
                vars: [
                  ['edge', `${u} → ${v}`, 'ok'],
                  ['minted', v, 'ok'],
                ],
                badge: { text: `clone ${v} minted`, accent: 'ok' },
              })
            } else {
              t.push({
                step: 'wire',
                note: `Edge ${u} → ${v}: node ${v} was already cloned — the map hands back the existing clone, and the edge just points at it. This is what stops infinite loops on cycles.`,
                view: view(v, 'band'),
                vars: [['edge', `${u} → ${v}`, 'c']],
              })
            }
          }
        }

        t.push({
          step: 'done',
          note: `Every node visited once, every edge wired once — a structurally identical graph that shares nothing with the original.`,
          view: view(null, 'idle'),
          vars: [['answer', 'deep copy complete', 'ok']],
          badge: { text: 'cloned', accent: 'ok' },
        })
      },

      run([adjList]: [number[][]], c) {
        const n = adjList.length
        if (n === 0) return []
        const cloned = new Array(n + 1).fill(false)
        const copy: number[][] = Array.from({ length: n }, () => [])
        const queue = [1]
        cloned[1] = true
        let head = 0
        while (head < queue.length) {
          const u = queue[head++]
          for (const v of adjList[u - 1]) {
            c.ops++
            copy[u - 1].push(v)
            if (!cloned[v]) {
              cloned[v] = true
              queue.push(v)
            }
          }
        }
        return copy
      },
    },
  ],
}
