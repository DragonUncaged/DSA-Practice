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
    { args: [2], expect: [], note: 'the smallest prime' },
    { args: [4], expect: [[2, 2]], note: 'a square of a prime' },
    {
      args: [30],
      expect: [[2, 15], [2, 3, 5], [3, 10], [5, 6]],
      note: 'three distinct primes',
    },
  ],
  scale: (n) => [n * 8],
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
      id: 'try-every-divisor',
      label: 'Try every divisor up to what is left',
      kind: 'brute',
      time: 'O(n * F)',
      space: 'O(log n)',
      blurb:
        'Peel factors in non-decreasing order so each factorization is built once, but test every candidate from the last factor all the way up to the remaining product, recording a combination when it reaches 1. Correct; the loop just runs far past the point where any new divisor could exist. `F` is the number of factorizations.',
      code: {
        cpp: {
          lines: [
            'vector<vector<int>> getFactors(int n) {',
            '    vector<vector<int>> out;',
            '    vector<int> cur;',
            '    function<void(int, int)> walk = [&](int rest, int start) {',
            '        if (rest == 1) {',
            '            if (cur.size() >= 2) out.push_back(cur);',
            '            return;',
            '        }',
            '        for (int f = start; f <= rest; ++f) {',
            '            if (rest % f != 0) continue;',
            '            cur.push_back(f);',
            '            walk(rest / f, f);',
            '            cur.pop_back();',
            '        }',
            '    };',
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
            '    if (rest === 1) {',
            '      if (cur.length >= 2) out.push([...cur]);',
            '      return;',
            '    }',
            '    for (let f = start; f <= rest; f++) {',
            '      if (rest % f !== 0) continue;',
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
        if (n > 4_000_000) throw new Error('too slow')
        const out: number[][] = []
        const cur: number[] = []
        const walk = (rest: number, start: number) => {
          if (rest === 1) {
            if (cur.length >= 2) out.push([...cur])
            return
          }
          for (let f = start; f <= rest; f++) {
            c.ops++
            if (rest % f !== 0) continue
            cur.push(f)
            walk(rest / f, f)
            cur.pop()
          }
        }
        walk(n, 2)
        return out
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'backtrack',
      label: 'Peel one factor at a time, never going backwards',
      kind: 'optimal',
      time: 'O(number of factorizations * sqrt(n))',
      space: 'O(log n)',
      blurb:
        'Once `f * f > rest`, every remaining divisor of `rest` is the larger partner of one already tried, so the loop can stop there and record `[... f, rest / f]` directly instead of recursing down to 1. Keeping factors non-decreasing still generates each factorization exactly once, and the loop bound falls from `rest` to its square root.',
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
