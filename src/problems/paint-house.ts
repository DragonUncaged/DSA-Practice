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
    { args: [[[20, 20, 20], [20, 20, 20], [20, 20, 20]]], expect: 60, note: 'maximum cost everywhere' },
    {
      args: [[[5, 8, 6], [19, 14, 13], [7, 5, 12], [14, 15, 17], [3, 20, 10]]],
      expect: 43,
      note: 'the cheapest colour at each house is not always the right pick',
    },
  ],
  scale: (n) => [Array.from({ length: n }, (_, i) => [(i * 7) % 20 + 1, (i * 11) % 20 + 1, (i * 13) % 20 + 1])],
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
      id: 'try-every-colouring',
      label: 'Try every legal colouring',
      kind: 'brute',
      time: 'O(2^n)',
      space: 'O(n)',
      blurb:
        'Paint the houses left to right, trying every colour that differs from the previous house, and keep the cheapest total that reaches the end. Correct, but each house doubles the number of paths, and the same suffix is priced again for every prefix that leads to it.',
      code: {
        cpp: {
          lines: [
            'int minCost(vector<vector<int>>& costs) {',
            '    int n = costs.size();',
            '    function<int(int, int)> paint = [&](int i, int prev) {',
            '        if (i == n) return 0;',
            '        int best = INT_MAX;',
            '        for (int c = 0; c < 3; ++c) {',
            '            if (c == prev) continue;',
            '            best = min(best, costs[i][c] + paint(i + 1, c));',
            '        }',
            '        return best;',
            '    };',
            '    return paint(0, -1);',
            '}',
          ],
        },
        js: {
          lines: [
            'function minCost(costs) {',
            '  const n = costs.length;',
            '  const paint = (i, prev) => {',
            '    if (i === n) return 0;',
            '    let best = Infinity;',
            '    for (let c = 0; c < 3; c++) {',
            '      if (c === prev) continue;',
            '      best = Math.min(best, costs[i][c] + paint(i + 1, c));',
            '    }',
            '    return best;',
            '  };',
            '  return paint(0, -1);',
            '}',
          ],
        },
      },

      run([costs]: [number[][]], c) {
        const n = costs.length
        if (n > 18) throw new Error('too slow')
        const paint = (i: number, prev: number): number => {
          c.ops++
          if (i === n) return 0
          let best = Infinity
          for (let col = 0; col < 3; col++) {
            if (col === prev) continue
            best = Math.min(best, costs[i][col] + paint(i + 1, col))
          }
          return best
        }
        return paint(0, -1)
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'memoise',
      label: 'Memoise the cheapest suffix per house and colour',
      kind: 'better',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'The recursion only ever asks one question: the cheapest way to finish from house `i` painted colour `c`. There are `3n` such questions, so caching the answers collapses the exponential tree to a table of that size — the same recursion, each subproblem solved once.',
      code: {
        cpp: {
          lines: [
            'int minCost(vector<vector<int>>& costs) {',
            '    int n = costs.size();',
            '    vector<vector<int>> memo(n, vector<int>(3, -1));',
            '    function<int(int, int)> paint = [&](int i, int c) {',
            '        if (i == n - 1) return costs[i][c];',
            '        if (memo[i][c] >= 0) return memo[i][c];',
            '        int best = INT_MAX;',
            '        for (int d = 0; d < 3; ++d)',
            '            if (d != c) best = min(best, paint(i + 1, d));',
            '        return memo[i][c] = costs[i][c] + best;',
            '    };',
            '    return min({paint(0, 0), paint(0, 1), paint(0, 2)});',
            '}',
          ],
        },
        js: {
          lines: [
            'function minCost(costs) {',
            '  const n = costs.length;',
            '  const memo = Array.from({ length: n }, () => new Array(3).fill(-1));',
            '  // cheapest way to paint houses i.. given house i is colour c',
            '  const paint = (i, c) => {',
            '    if (i === n - 1) return costs[i][c];',
            '    if (memo[i][c] >= 0) return memo[i][c];',
            '    let best = Infinity;',
            '    for (let d = 0; d < 3; d++) {',
            '      if (d !== c) best = Math.min(best, paint(i + 1, d));',
            '    }',
            '    return (memo[i][c] = costs[i][c] + best);',
            '  };',
            '  return Math.min(paint(0, 0), paint(0, 1), paint(0, 2));',
            '}',
          ],
        },
      },

      run([costs]: [number[][]], c) {
        const n = costs.length
        const memo = Array.from({ length: n }, () => new Array<number>(3).fill(-1))
        const paint = (i: number, col: number): number => {
          c.ops++
          if (i === n - 1) return costs[i][col]
          if (memo[i][col] >= 0) return memo[i][col]
          let best = Infinity
          for (let d = 0; d < 3; d++) {
            if (d !== col) best = Math.min(best, paint(i + 1, d))
          }
          return (memo[i][col] = costs[i][col] + best)
        }
        return Math.min(paint(0, 0), paint(0, 1), paint(0, 2))
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'rolling-row',
      label: 'Carry the best cost per colour forward',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'The memo table is only ever read one row back, so the table itself can go. Painting house `i` red is only ever combined with the cheaper of blue and green at house `i - 1`: three running totals — one per colour — are all the history the next house needs.',
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
