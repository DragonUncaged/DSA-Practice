import { arr, type Problem, type Tone } from '@/lib/types'

const DEMO: [number, number[][]] = [6, [[0, 1], [1, 2], [3, 4]]]

export const connectedComponents: Problem = {
  id: 'number-of-connected-components-in-an-undirected-graph',
  title: 'Number of Connected Components in an Undirected Graph',
  group: 'Graph',
  pattern: 'Union-Find',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/',
  statement: 'Given `n` nodes and a list of undirected `edges`, return the number of connected components.',
  constraints: ['1 <= n <= 2000', '0 <= edges.length <= 5000'],
  signature: {
    fn: 'countComponents',
    params: [
      { name: 'n', type: 'int' },
      { name: 'edges', type: 'int[][]' },
    ],
    ret: 'int',
  },
  tests: [
    { args: [5, [[0, 1], [1, 2], [3, 4]]], expect: 2 },
    { args: [5, [[0, 1], [1, 2], [2, 3], [3, 4]]], expect: 1 },
    { args: [4, []], expect: 4, note: 'no edges: every node is its own island' },
    { args: [1, []], expect: 1 },
  ],
  demo: DEMO,
  scale: (n) => [n, Array.from({ length: Math.floor(n / 2) }, (_, i) => [i * 2, i * 2 + 1])],
  starter: {
    py: `def countComponents(n, edges):
    # n: int, edges: list[list[int]]  ->  int
    pass
`,
    js: `function countComponents(n, edges) {
  // n: number, edges: number[][]  ->  number
}
`,
    cpp: `int countComponents(int n, vector<vector<int>>& edges) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'union-find',
      label: 'Start at n, merge downward',
      kind: 'optimal',
      time: 'O(E α(n))',
      space: 'O(n)',
      blurb:
        'Begin with n solitary components. Each edge that joins two different groups shrinks the count by one; an edge inside a group changes nothing. Whatever the count is at the end is the answer — no traversal required.',
      code: {
        py: {
          lines: [
            'def countComponents(n, edges):',
            '    parent = list(range(n))',
            '    def find(x):',
            '        while parent[x] != x:',
            '            parent[x] = parent[parent[x]]',
            '            x = parent[x]',
            '        return x',
            '    count = n',
            '    for a, b in edges:',
            '        ra, rb = find(a), find(b)',
            '        if ra != rb:',
            '            parent[ra] = rb',
            '            count -= 1',
            '    return count',
          ],
          map: { init: 8, merge: 13, same: 11, done: 14 },
        },
        cpp: {
          lines: [
            'int countComponents(int n, vector<vector<int>>& edges) {',
            '    vector<int> parent(n);',
            '    iota(parent.begin(), parent.end(), 0);',
            '    function<int(int)> find = [&](int x) {',
            '        while (parent[x] != x) x = parent[x] = parent[parent[x]];',
            '        return x;',
            '    };',
            '    int count = n;',
            '    for (auto& e : edges) {',
            '        int ra = find(e[0]), rb = find(e[1]);',
            '        if (ra != rb) { parent[ra] = rb; count--; }',
            '    }',
            '    return count;',
            '}',
          ],
          map: { init: 8, merge: 11, same: 11, done: 13 },
        },
        js: {
          lines: [
            'function countComponents(n, edges) {',
            '  const parent = Array.from({ length: n }, (_, i) => i);',
            '  const find = (x) => {',
            '    while (parent[x] !== x) {',
            '      parent[x] = parent[parent[x]];',
            '      x = parent[x];',
            '    }',
            '    return x;',
            '  };',
            '  let count = n;',
            '  for (const [a, b] of edges) {',
            '    const ra = find(a);',
            '    const rb = find(b);',
            '    if (ra !== rb) {',
            '      parent[ra] = rb;',
            '      count--;',
            '    }',
            '  }',
            '  return count;',
            '}',
          ],
          map: { init: 10, merge: 16, same: 14, done: 20 },
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
        let count = n

        const view = (a: number | null, b: number | null, tone: Tone) => {
          const tones: Record<number, Tone> = {}
          for (let i = 0; i < n; i++) tones[i] = 'band'
          if (a != null) tones[a] = tone
          if (b != null) tones[b] = tone
          return arr(parent.slice(), {
            tones,
            title: 'parent of each node — shared root = same component',
          })
        }

        t.push({
          step: 'init',
          note: `${n} nodes with no edges processed yet: ${n} components. Every useful edge will subtract exactly one.`,
          view: view(null, null, 'idle'),
          vars: [['components', count, 'c']],
        })

        for (const [a, b] of edges) {
          const ra = find(a)
          const rb = find(b)
          t.bump()

          if (ra !== rb) {
            parent[ra] = rb
            count--
            t.push({
              step: 'merge',
              note: `Edge (${a}, ${b}) bridges two different groups — merge them. ${count} component${count === 1 ? '' : 's'} remain.`,
              view: view(a, b, 'good'),
              vars: [
                ['edge', `(${a}, ${b})`, 'ok'],
                ['components', count, 'c'],
              ],
              badge: { text: `merge → ${count}`, accent: 'ok' },
            })
          } else {
            t.push({
              step: 'same',
              note: `Edge (${a}, ${b}) connects nodes already in the same group — it adds redundancy, not connectivity. Count unchanged.`,
              view: view(a, b, 'dim'),
              vars: [
                ['edge', `(${a}, ${b})`, 'mute'],
                ['components', count, 'c'],
              ],
            })
          }
        }

        t.push({
          step: 'done',
          note: `All edges processed: ${count} connected component${count === 1 ? '' : 's'}.`,
          view: view(null, null, 'good'),
          vars: [['answer', count, 'ok']],
          badge: { text: `${count} components`, accent: 'ok' },
        })
      },

      run([n, edges]: [number, number[][]], c) {
        const parent = Array.from({ length: n }, (_, i) => i)
        const find = (x: number): number => {
          while (parent[x] !== x) {
            c.ops++
            parent[x] = parent[parent[x]]
            x = parent[x]
          }
          return x
        }
        let count = n
        for (const [a, b] of edges) {
          c.ops++
          const ra = find(a)
          const rb = find(b)
          if (ra !== rb) {
            parent[ra] = rb
            count--
          }
        }
        return count
      },
    },
  ],
}
