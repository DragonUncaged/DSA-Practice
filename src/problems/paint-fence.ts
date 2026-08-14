import type { Problem } from '@/lib/types'

export const paintFence: Problem = {
  id: 'paint-fence',
  title: 'Paint Fence',
  group: 'Medium',
  pattern: 'DP',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/paint-fence/',
  statement:
    'A fence of `n` posts is painted with `k` colours. Every post gets exactly one colour, and no three consecutive posts may share a colour. Return how many ways there are to paint the fence.',
  constraints: [
    '1 <= n <= 50',
    '1 <= k <= 10^5',
    'The answer is guaranteed to fit in [0, 2^31 - 1]',
  ],
  signature: {
    fn: 'numWays',
    params: [
      { name: 'n', type: 'int' },
      { name: 'k', type: 'int' },
    ],
    ret: 'int',
  },
  tests: [
    { args: [3, 2], expect: 6 },
    { args: [1, 1], expect: 1, note: 'one post, one colour' },
    { args: [7, 2], expect: 42 },
    { args: [2, 3], expect: 9, note: 'two posts are free to match' },
    { args: [1, 5], expect: 5, note: 'a single post has k choices' },
    { args: [3, 1], expect: 0, note: 'one colour makes three in a row unavoidable' },
    { args: [2, 1], expect: 1, note: 'two posts may match' },
    { args: [4, 3], expect: 66 },
    { args: [50, 1], expect: 0, note: 'the longest fence with one colour' },
  ],
  demo: [3, 2],
  starter: {
    js: `function numWays(n, k) {
  // n: number, k: number  ->  number
}
`,
    cpp: `int numWays(int n, int k) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'try-every-painting',
      label: 'Try every painting, post by post',
      kind: 'brute',
      time: 'O(k^n)',
      space: 'O(n)',
      blurb:
        'Paint post by post, trying all `k` colours each time and refusing a colour that would make three in a row; count the paintings that reach the end. Correct, and the definition of the problem — but every post multiplies the number of paths by nearly `k`.',
      code: {
        cpp: {
          lines: [
            'int numWays(int n, int k) {',
            '    // run: how many posts in a row already share colour prev',
            '    function<long long(int, int, int)> paint = [&](int i, int prev, int run) {',
            '        if (i == n) return 1LL;',
            '        long long total = 0;',
            '        for (int c = 0; c < k; ++c) {',
            '            if (c == prev) { if (run < 2) total += paint(i + 1, c, run + 1); }',
            '            else total += paint(i + 1, c, 1);',
            '        }',
            '        return total;',
            '    };',
            '    return (int)paint(0, -1, 0);',
            '}',
          ],
        },
        js: {
          lines: [
            'function numWays(n, k) {',
            '  // run: how many posts in a row already share colour prev',
            '  const paint = (i, prev, run) => {',
            '    if (i === n) return 1;',
            '    let total = 0;',
            '    for (let c = 0; c < k; c++) {',
            '      if (c === prev) {',
            '        if (run < 2) total += paint(i + 1, c, run + 1);',
            '      } else {',
            '        total += paint(i + 1, c, 1);',
            '      }',
            '    }',
            '    return total;',
            '  };',
            '  return paint(0, -1, 0);',
            '}',
          ],
        },
      },

      run([n, k]: [number, number], c) {
        if (Math.pow(k, n) > 2_000_000) throw new Error('too slow')
        const paint = (i: number, prev: number, run: number): number => {
          c.ops++
          if (i === n) return 1
          let total = 0
          for (let col = 0; col < k; col++) {
            if (col === prev) {
              if (run < 2) total += paint(i + 1, col, run + 1)
            } else {
              total += paint(i + 1, col, 1)
            }
          }
          return total
        }
        return paint(0, -1, 0)
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'memoise',
      label: 'Memoise on the post and whether the last two match',
      kind: 'better',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'The recursion never needed the actual colours, only whether the previous two posts match: a different colour can be chosen `k - 1` ways, and repeating is allowed only when they do not. That leaves `2n` distinct states, so caching them turns the exponential search into a linear one.',
      code: {
        cpp: {
          lines: [
            'int numWays(int n, int k) {',
            '    if (n == 0) return 0;',
            '    vector<long long> memo(2 * n + 2, -1);',
            '    // ways to paint posts i.. given whether posts i-1 and i-2 already match',
            '    function<long long(int, bool)> ways = [&](int i, bool lastTwoMatch) {',
            '        if (i == n) return 1LL;',
            '        int key = i * 2 + (lastTwoMatch ? 1 : 0);',
            '        if (memo[key] >= 0) return memo[key];',
            '        long long total = (k - 1) * ways(i + 1, false);',
            '        if (!lastTwoMatch) total += ways(i + 1, true);',
            '        return memo[key] = total;',
            '    };',
            '    return (int)(k * ways(1, false));',
            '}',
          ],
        },
        js: {
          lines: [
            'function numWays(n, k) {',
            '  if (n === 0) return 0;',
            '  const memo = new Map();',
            '  // ways to paint posts i.. given whether posts i-1 and i-2 already match',
            '  const ways = (i, lastTwoMatch) => {',
            '    if (i === n) return 1;',
            '    const key = i * 2 + (lastTwoMatch ? 1 : 0);',
            '    if (memo.has(key)) return memo.get(key);',
            '    let total = (k - 1) * ways(i + 1, false);',
            '    if (!lastTwoMatch) total += ways(i + 1, true);',
            '    memo.set(key, total);',
            '    return total;',
            '  };',
            '  return k * ways(1, false);',
            '}',
          ],
        },
      },

      run([n, k]: [number, number], c) {
        if (n === 0) return 0
        const memo = new Map<number, number>()
        const ways = (i: number, lastTwoMatch: boolean): number => {
          c.ops++
          if (i === n) return 1
          const key = i * 2 + (lastTwoMatch ? 1 : 0)
          if (memo.has(key)) return memo.get(key)!
          let total = (k - 1) * ways(i + 1, false)
          if (!lastTwoMatch) total += ways(i + 1, true)
          memo.set(key, total)
          return total
        }
        return k * ways(1, false)
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'same-diff',
      label: 'Split the count by whether the last two match',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'The memo only ever looks one post ahead, so the cache can shrink to two numbers. Keep the count of paintings whose last two posts match and the count whose last two differ: a new post can always differ from its neighbour in `k - 1` ways, and it may only match when the pair before it did not.',
      code: {
        cpp: {
          lines: [
            'int numWays(int n, int k) {',
            '    if (n == 0) return 0;',
            '    if (n == 1) return k;',
            '',
            '    long long same = k;',
            '    long long diff = (long long)k * (k - 1);',
            '    for (int i = 3; i <= n; ++i) {',
            '        long long nextSame = diff;',
            '        long long nextDiff = (same + diff) * (k - 1);',
            '        same = nextSame;',
            '        diff = nextDiff;',
            '    }',
            '    return (int)(same + diff);',
            '}',
          ],
        },
        js: {
          lines: [
            'function numWays(n, k) {',
            '  if (n === 0) return 0;',
            '  if (n === 1) return k;',
            '',
            '  let same = k;',
            '  let diff = k * (k - 1);',
            '  for (let i = 3; i <= n; i++) {',
            '    const nextSame = diff;',
            '    const nextDiff = (same + diff) * (k - 1);',
            '    same = nextSame;',
            '    diff = nextDiff;',
            '  }',
            '  return same + diff;',
            '}',
          ],
        },
      },

      run([n, k]: [number, number], c) {
        if (n === 0) return 0
        if (n === 1) return k
        let same = k
        let diff = k * (k - 1)
        for (let i = 3; i <= n; i++) {
          c.ops++
          const nextSame = diff
          const nextDiff = (same + diff) * (k - 1)
          same = nextSame
          diff = nextDiff
        }
        return same + diff
      },
    },
  ],
}
