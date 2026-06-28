import type { Problem } from '@/lib/types'

export const factorCombinations: Problem = {
  id: 'factor-combinations',
  title: 'Factor Combinations',
  group: 'Medium',
  pattern: 'Backtracking',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/factor-combinations/',
  statement:
    'Given an integer `n`, return every way of writing it as a product of two or more factors, each in the range `[2, n - 1]`. The combinations may come back in any order.',
  constraints: ['1 <= n <= 10^7'],
  signature: { fn: 'getFactors', params: [{ name: 'n', type: 'int' }], ret: 'int[][]' },
  compare: 'sorted',
  tests: [
    { args: [1], expect: [], note: 'no factors in [2, 0]' },
    { args: [12], expect: [[2, 6], [3, 4], [2, 2, 3]] },
    { args: [37], expect: [], note: 'prime' },
    { args: [8], expect: [[2, 4], [2, 2, 2]] },
    {
      args: [32],
      expect: [[2, 16], [2, 2, 8], [2, 2, 2, 4], [2, 2, 2, 2, 2], [2, 4, 4], [4, 8]],
    },
  ],
  demo: [12],
  starter: {
    js: `function getFactors(n) {
  // n: number  ->  number[][]
}
`,
    cpp: `vector<vector<int>> getFactors(int n) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'backtrack',
      label: 'Peel one factor at a time, never going backwards',
      kind: 'optimal',
      time: 'O(number of factorizations * sqrt(n))',
      space: 'O(log n)',
      blurb:
        'Fixing each factor to be at least as large as the one before it means every factorization is generated exactly once. For each divisor `f` of what is left, record `[... f, rest / f]` and then recurse into `rest / f` to split it further. Stopping at `f * f > rest` is enough, because the larger partner is already covered.',
      code: {
        cpp: {
          lines: [
            'vector<vector<int>> getFactors(int n) {',
            '    vector<vector<int>> out;',
            '    vector<int> cur;',
            '',
            '    function<void(int, int)> walk = [&](int rest, int start) {',
            '        for (int f = start; (long long)f * f <= rest; ++f) {',
            '            if (rest % f) continue;',
            '            cur.push_back(f);',
            '            cur.push_back(rest / f);',
            '            out.push_back(cur);',
            '            cur.pop_back();',
            '            walk(rest / f, f);',
            '            cur.pop_back();',
            '        }',
            '    };',
            '',
            '    walk(n, 2);',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function getFactors(n) {',
            '  const out = [];',
            '  const cur = [];',
            '',
            '  const walk = (rest, start) => {',
            '    for (let f = start; f * f <= rest; f++) {',
            '      if (rest % f !== 0) continue;',
            '      out.push([...cur, f, rest / f]);',
            '      cur.push(f);',
            '      walk(rest / f, f);',
            '      cur.pop();',
            '    }',
            '  };',
            '',
            '  walk(n, 2);',
            '  return out;',
            '}',
          ],
        },
      },

      run([n]: [number], c) {
        const out: number[][] = []
        const cur: number[] = []
        const walk = (rest: number, start: number) => {
          for (let f = start; f * f <= rest; f++) {
            c.ops++
            if (rest % f !== 0) continue
            out.push([...cur, f, rest / f])
            cur.push(f)
            walk(rest / f, f)
            cur.pop()
          }
        }
        walk(n, 2)
        return out
      },
    },
  ],
}
