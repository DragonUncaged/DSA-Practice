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
      id: 'same-diff',
      label: 'Split the count by whether the last two match',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'The only thing the next post cares about is whether the last two posts share a colour. Keep those two counts: a new post can always differ from its neighbour in `k - 1` ways, and it may only match when the pair before it did not.',
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
