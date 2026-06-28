import type { Problem } from '@/lib/types'

export const paintHouse: Problem = {
  id: 'paint-house',
  title: 'Paint House',
  group: 'Medium',
  pattern: 'DP',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/paint-house/',
  statement:
    'A row of `n` houses must each be painted red, blue or green, and no two neighbours may share a colour. `costs[i][j]` is the price of painting house `i` in colour `j`. Return the cheapest way to paint them all.',
  constraints: [
    'costs.length == n',
    'costs[i].length == 3',
    '1 <= n <= 100',
    '1 <= costs[i][j] <= 20',
  ],
  signature: { fn: 'minCost', params: [{ name: 'costs', type: 'int[][]' }], ret: 'int' },
  tests: [
    { args: [[[17, 2, 17], [16, 16, 5], [14, 3, 19]]], expect: 10, note: 'blue, green, blue' },
    { args: [[[7, 6, 2]]], expect: 2, note: 'one house' },
    { args: [[[1, 1, 1], [1, 1, 1]]], expect: 2, note: 'every colour costs the same' },
    { args: [[[1, 100, 100], [100, 1, 100], [100, 100, 1]]], expect: 3, note: 'rotate colours' },
    { args: [[[1, 2, 3], [1, 2, 3]]], expect: 3, note: 'cheapest twice is not allowed' },
  ],
  demo: [[[17, 2, 17], [16, 16, 5], [14, 3, 19]]],
  starter: {
    js: `function minCost(costs) {
  // costs: number[][]  ->  number
}
`,
    cpp: `int minCost(vector<vector<int>>& costs) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'rolling-row',
      label: 'Carry the best cost per colour forward',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'Painting house `i` red is only ever combined with the cheaper of blue and green at house `i - 1`. Three running totals — one per colour — are all the history the next house needs.',
      code: {
        cpp: {
          lines: [
            'int minCost(vector<vector<int>>& costs) {',
            '    if (costs.empty()) return 0;',
            '    int r = costs[0][0], b = costs[0][1], g = costs[0][2];',
            '    for (size_t i = 1; i < costs.size(); ++i) {',
            '        int nr = costs[i][0] + min(b, g);',
            '        int nb = costs[i][1] + min(r, g);',
            '        int ng = costs[i][2] + min(r, b);',
            '        r = nr;',
            '        b = nb;',
            '        g = ng;',
            '    }',
            '    return min(r, min(b, g));',
            '}',
          ],
        },
        js: {
          lines: [
            'function minCost(costs) {',
            '  if (costs.length === 0) return 0;',
            '  let [r, b, g] = costs[0];',
            '  for (let i = 1; i < costs.length; i++) {',
            '    const nr = costs[i][0] + Math.min(b, g);',
            '    const nb = costs[i][1] + Math.min(r, g);',
            '    const ng = costs[i][2] + Math.min(r, b);',
            '    r = nr;',
            '    b = nb;',
            '    g = ng;',
            '  }',
            '  return Math.min(r, b, g);',
            '}',
          ],
        },
      },

      run([costs]: [number[][]], c) {
        if (costs.length === 0) return 0
        let [r, b, g] = costs[0]
        for (let i = 1; i < costs.length; i++) {
          c.ops++
          const nr = costs[i][0] + Math.min(b, g)
          const nb = costs[i][1] + Math.min(r, g)
          const ng = costs[i][2] + Math.min(r, b)
          r = nr
          b = nb
          g = ng
        }
        return Math.min(r, b, g)
      },
    },
  ],
}
