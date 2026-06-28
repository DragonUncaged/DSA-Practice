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
  ],
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
      id: 'two-minima',
      label: 'Keep the best and second-best of the previous row',
      kind: 'optimal',
      time: 'O(n * k)',
      space: 'O(k)',
      blurb:
        'Every colour wants the cheapest previous total that is not its own colour. That is the row minimum for all colours except the one that produced it, which takes the runner-up instead — so two numbers per row replace the inner loop over `k`.',
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
