import type { Problem } from '@/lib/types'

export const paintHouseII: Problem = {
  id: 'paint-house-ii',
  title: 'Paint House II',
  group: 'Hard',
  pattern: 'DP',
  difficulty: 'Hard',
  leetcode: 'https://leetcode.com/problems/paint-house-ii/',
  statement:
    'Paint House with `k` colours instead of three: `costs[i][j]` is the price of painting house `i` in colour `j`, and no two neighbours may share a colour. Return the cheapest total. Trying every previous colour for every colour is `O(n * k^2)`; `O(n * k)` is possible.',
  constraints: [
    'costs.length == n',
    'costs[i].length == k',
    '1 <= n <= 100',
    '2 <= k <= 20',
    '1 <= costs[i][j] <= 20',
  ],
  signature: { fn: 'minCostII', params: [{ name: 'costs', type: 'int[][]' }], ret: 'int' },
  tests: [
    { args: [[[1, 5, 3], [2, 9, 4]]], expect: 5 },
    { args: [[[1, 3], [2, 4]]], expect: 5 },
    { args: [[[7, 6, 2]]], expect: 2, note: 'one house' },
    { args: [[[1, 1], [1, 1], [1, 1]]], expect: 3, note: 'ties everywhere' },
    {
      args: [[[1, 10, 10], [1, 10, 10], [1, 10, 10]]],
      expect: 12,
      note: 'the cheap colour has to be given up once in the middle',
    },
    { args: [[[5, 5, 5, 5, 5], [5, 5, 5, 5, 5]]], expect: 10, note: 'five colours, all equal' },
    {
      args: [[[3, 5, 3], [6, 17, 6], [7, 13, 18], [9, 10, 18]]],
      expect: 26,
      note: 'the runner-up colour is needed when the minimum repeats',
    },
  ],
  scale: (n) => [Array.from({ length: n }, (_, i) => Array.from({ length: 20 }, (_, j) => ((i * 7 + j * 3) % 20) + 1))],
  demo: [[[1, 5, 3], [2, 9, 4]]],
  starter: {
    js: `function minCostII(costs) {
  // costs: number[][]  ->  number
}
`,
    cpp: `int minCostII(vector<vector<int>>& costs) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'try-every-colouring',
      label: 'Try every legal colouring',
      kind: 'brute',
      time: 'O(k * (k - 1)^(n - 1))',
      space: 'O(n)',
      blurb:
        'Paint the houses left to right, trying every colour that differs from the previous house, and keep the cheapest total that reaches the end. Correct, but every house multiplies the number of paths by `k - 1`, and the same suffix is priced again for every prefix that leads to it.',
      code: {
        cpp: {
          lines: [
            'int minCostII(vector<vector<int>>& costs) {',
            '    int n = costs.size(), k = costs[0].size();',
            '    function<int(int, int)> paint = [&](int i, int prev) {',
            '        if (i == n) return 0;',
            '        int best = INT_MAX;',
            '        for (int c = 0; c < k; ++c) {',
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
            'function minCostII(costs) {',
            '  const n = costs.length;',
            '  const k = costs[0].length;',
            '  const paint = (i, prev) => {',
            '    if (i === n) return 0;',
            '    let best = Infinity;',
            '    for (let c = 0; c < k; c++) {',
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
        const k = costs[0].length
        if (k * Math.pow(k - 1, n - 1) > 2_000_000) throw new Error('too slow')
        const paint = (i: number, prev: number): number => {
          c.ops++
          if (i === n) return 0
          let best = Infinity
          for (let col = 0; col < k; col++) {
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
      id: 'row-by-row',
      label: 'Tabulate, trying every previous colour for every colour',
      kind: 'better',
      time: 'O(n * k^2)',
      space: 'O(k)',
      blurb:
        'The cheapest way to end house `i` in colour `j` is its own price plus the cheapest previous total in any other colour. Filling that row by row solves each of the `n * k` subproblems once, but finding "cheapest other colour" by scanning the previous row costs `k` per cell.',
      code: {
        cpp: {
          lines: [
            'int minCostII(vector<vector<int>>& costs) {',
            '    int n = costs.size(), k = costs[0].size();',
            '    vector<int> prev = costs[0];',
            '    for (int i = 1; i < n; ++i) {',
            '        vector<int> cur(k, INT_MAX);',
            '        for (int j = 0; j < k; ++j)',
            '            for (int p = 0; p < k; ++p)',
            '                if (p != j) cur[j] = min(cur[j], prev[p] + costs[i][j]);',
            '        prev = cur;',
            '    }',
            '    return *min_element(prev.begin(), prev.end());',
            '}',
          ],
        },
        js: {
          lines: [
            'function minCostII(costs) {',
            '  const n = costs.length;',
            '  const k = costs[0].length;',
            '  let prev = costs[0].slice();',
            '  for (let i = 1; i < n; i++) {',
            '    const cur = new Array(k).fill(Infinity);',
            '    for (let j = 0; j < k; j++) {',
            '      for (let p = 0; p < k; p++) {',
            '        if (p !== j) cur[j] = Math.min(cur[j], prev[p] + costs[i][j]);',
            '      }',
            '    }',
            '    prev = cur;',
            '  }',
            '  return Math.min(...prev);',
            '}',
          ],
        },
      },

      run([costs]: [number[][]], c) {
        const n = costs.length
        const k = costs[0].length
        let prev = costs[0].slice()
        for (let i = 1; i < n; i++) {
          const cur = new Array<number>(k).fill(Infinity)
          for (let j = 0; j < k; j++) {
            for (let p = 0; p < k; p++) {
              c.ops++
              if (p !== j) cur[j] = Math.min(cur[j], prev[p] + costs[i][j])
            }
          }
          prev = cur
        }
        return Math.min(...prev)
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'two-minima',
      label: 'Keep the best and second-best of the previous row',
      kind: 'optimal',
      time: 'O(n * k)',
      space: 'O(k)',
      blurb:
        'The inner scan over `k` previous colours always returns one of two numbers. Every colour wants the cheapest previous total that is not its own: that is the row minimum for all colours except the one that produced it, which takes the runner-up instead. Two numbers per row replace the inner loop, and the table drops to `O(n * k)`.',
      code: {
        cpp: {
          lines: [
            'int minCostII(vector<vector<int>>& costs) {',
            '    if (costs.empty()) return 0;',
            '    int k = costs[0].size();',
            '    vector<int> prev = costs[0];',
            '',
            '    for (size_t i = 1; i < costs.size(); ++i) {',
            '        int best = INT_MAX, second = INT_MAX, at = -1;',
            '        for (int j = 0; j < k; ++j) {',
            '            if (prev[j] < best) { second = best; best = prev[j]; at = j; }',
            '            else if (prev[j] < second) second = prev[j];',
            '        }',
            '        vector<int> cur(k);',
            '        for (int j = 0; j < k; ++j) cur[j] = costs[i][j] + (j == at ? second : best);',
            '        prev = cur;',
            '    }',
            '    return *min_element(prev.begin(), prev.end());',
            '}',
          ],
        },
        js: {
          lines: [
            'function minCostII(costs) {',
            '  if (costs.length === 0) return 0;',
            '  const k = costs[0].length;',
            '  let prev = costs[0].slice();',
            '',
            '  for (let i = 1; i < costs.length; i++) {',
            '    let best = Infinity, second = Infinity, at = -1;',
            '    for (let j = 0; j < k; j++) {',
            '      if (prev[j] < best) { second = best; best = prev[j]; at = j; }',
            '      else if (prev[j] < second) second = prev[j];',
            '    }',
            '    const cur = new Array(k);',
            '    for (let j = 0; j < k; j++) cur[j] = costs[i][j] + (j === at ? second : best);',
            '    prev = cur;',
            '  }',
            '  return Math.min(...prev);',
            '}',
          ],
        },
      },

      run([costs]: [number[][]], c) {
        if (costs.length === 0) return 0
        const k = costs[0].length
        let prev = costs[0].slice()
        for (let i = 1; i < costs.length; i++) {
          let best = Infinity
          let second = Infinity
          let at = -1
          for (let j = 0; j < k; j++) {
            c.ops++
            if (prev[j] < best) {
              second = best
              best = prev[j]
              at = j
            } else if (prev[j] < second) second = prev[j]
          }
          const cur = new Array<number>(k)
          for (let j = 0; j < k; j++) cur[j] = costs[i][j] + (j === at ? second : best)
          prev = cur
        }
        return Math.min(...prev)
      },
    },
  ],
}
