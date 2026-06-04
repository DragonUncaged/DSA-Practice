import { arr, type Problem, type Tone } from '@/lib/types'

const DEMO: [number, number[][]] = [5, [[0, 1], [0, 2], [0, 3], [1, 4]]]

export const graphValidTree: Problem = {
  id: 'graph-valid-tree',
  title: 'Graph Valid Tree',
  group: 'Graph',
  pattern: 'Union-Find',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/graph-valid-tree/',
  statement:
    'Given `n` nodes and a list of undirected `edges`, return `true` if they form a valid tree: connected, and with no cycle.',
  constraints: ['1 <= n <= 2000', '0 <= edges.length <= 5000', 'No duplicate edges'],
  signature: {
    fn: 'validTree',
    params: [
      { name: 'n', type: 'int' },
      { name: 'edges', type: 'int[][]' },
    ],
    ret: 'bool',
  },
  tests: [
    { args: [5, [[0, 1], [0, 2], [0, 3], [1, 4]]], expect: true },
    { args: [5, [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]]], expect: false, note: 'contains a cycle' },
    { args: [4, [[0, 1], [2, 3]]], expect: false, note: 'two disconnected islands' },
    { args: [1, []], expect: true, note: 'a single node is a tree' },
  ],
  demo: DEMO,
  scale: (n) => [n, Array.from({ length: n - 1 }, (_, i) => [i, i + 1])],
  starter: {
    js: `function validTree(n, edges) {
  // n: number, edges: number[][]  ->  boolean
}
`,
    cpp: `bool validTree(int n, vector<vector<int>>& edges) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'union-find',
      label: 'Union-Find with the edge count check',
      kind: 'optimal',
      time: 'O(E α(n))',
      space: 'O(n)',
      blurb:
        'A tree on n nodes has exactly n-1 edges — one more creates a cycle, one fewer leaves it disconnected. So check the count, then union each edge: if an edge joins two nodes already in the same group, that edge closes a cycle.',
      code: {
        cpp: {
          lines: [
            'bool validTree(int n, vector<vector<int>>& edges) {',
            '    if (edges.size() != n - 1) return false;',
            '    vector<int> parent(n);',
            '    iota(parent.begin(), parent.end(), 0);',
            '    function<int(int)> find = [&](int x) {',
            '        while (parent[x] != x) x = parent[x] = parent[parent[x]];',
            '        return x;',
            '    };',
            '    for (auto& e : edges) {',
            '        int ra = find(e[0]), rb = find(e[1]);',
            '        if (ra == rb) return false;',
            '        parent[ra] = rb;',
            '    }',
            '    return true;',
            '}',
          ],
          map: { count: 2, init: 4, union: 12, cycle: 11, done: 14 },
        },
        js: {
          lines: [
            'function validTree(n, edges) {',
            '  if (edges.length !== n - 1) return false;',
            '  const parent = Array.from({ length: n }, (_, i) => i);',
            '  const find = (x) => {',
            '    while (parent[x] !== x) {',
            '      parent[x] = parent[parent[x]];',
            '      x = parent[x];',
            '    }',
            '    return x;',
            '  };',
            '  for (const [a, b] of edges) {',
            '    const ra = find(a);',
            '    const rb = find(b);',
            '    if (ra === rb) return false;',
            '    parent[ra] = rb;',
            '  }',
            '  return true;',
            '}',
          ],
          map: { count: 2, init: 3, union: 15, cycle: 14, done: 17 },
        },
      },

      trace(t, [n, edges]: [number, number[][]]) {
        const parent = Array.from({ length: n }, (_, i) => i)
        const find = (x: number): number => {
          while (parent[x] !== x) {
            parent[x] = parent[parent[x]]
            x = parent[x]
          }
          return x
        }

        const view = (a: number | null, b: number | null, tone: Tone) => {
          const tones: Record<number, Tone> = {}
          for (let i = 0; i < n; i++) tones[i] = 'band'
          if (a != null) tones[a] = tone
          if (b != null) tones[b] = tone
          return arr(parent.slice(), {
            tones,
            title: 'parent of each node (index = node) — equal roots mean same group',
          })
        }

        if (edges.length !== n - 1) {
          t.push({
            step: 'count',
            note: `A tree on ${n} nodes needs exactly ${n - 1} edges; this graph has ${edges.length}. ${
              edges.length > n - 1 ? 'Too many — a cycle is unavoidable.' : 'Too few — it cannot be connected.'
            } No further work needed.`,
            view: view(null, null, 'idle'),
            vars: [
              ['edges', edges.length, 'no'],
              ['needed', n - 1],
              ['answer', 'false', 'no'],
            ],
            badge: { text: `${edges.length} ≠ ${n - 1}`, accent: 'no' },
          })
          return
        }

        t.push({
          step: 'init',
          note: `Edge count is exactly ${n - 1} ✓. Now every node starts as its own one-member group; each edge should merge two different groups. One edge inside an existing group would close a cycle.`,
          view: view(null, null, 'idle'),
          vars: [['groups', n]],
        })

        let groups = n
        for (const [a, b] of edges) {
          const ra = find(a)
          const rb = find(b)
          t.bump()

          if (ra === rb) {
            t.push({
              step: 'cycle',
              note: `Edge (${a}, ${b}): both nodes already share root ${ra} — they were connected some other way, so this edge closes a cycle. False.`,
              view: view(a, b, 'bad'),
              vars: [
                ['edge', `(${a}, ${b})`, 'no'],
                ['shared root', ra, 'no'],
                ['answer', 'false', 'no'],
              ],
              badge: { text: 'cycle', accent: 'no' },
            })
            return
          }

          parent[ra] = rb
          groups--
          t.push({
            step: 'union',
            note: `Edge (${a}, ${b}) merges group ${ra} into group ${rb} — ${groups} group${groups === 1 ? '' : 's'} remain.`,
            view: view(a, b, 'good'),
            vars: [
              ['edge', `(${a}, ${b})`, 'ok'],
              ['groups left', groups, groups === 1 ? 'ok' : 'c'],
            ],
            badge: { text: `${groups} groups`, accent: groups === 1 ? 'ok' : 'c' },
          })
        }

        t.push({
          step: 'done',
          note: `${n - 1} merges collapsed everything into one group with no edge wasted on a cycle — a valid tree.`,
          view: view(null, null, 'good'),
          vars: [['answer', 'true', 'ok']],
          badge: { text: 'true', accent: 'ok' },
        })
      },

      run([n, edges]: [number, number[][]], c) {
        if (edges.length !== n - 1) return false
        const parent = Array.from({ length: n }, (_, i) => i)
        const find = (x: number): number => {
          while (parent[x] !== x) {
            c.ops++
            parent[x] = parent[parent[x]]
            x = parent[x]
          }
          return x
        }
        for (const [a, b] of edges) {
          c.ops++
          const ra = find(a)
          const rb = find(b)
          if (ra === rb) return false
          parent[ra] = rb
        }
        return true
      },
    },
  ],
}
