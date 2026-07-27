import type { Problem } from '@/lib/types'

export const guessNumberHigherOrLower: Problem = {
  id: 'guess-number-higher-or-lower',
  title: 'Guess Number Higher or Lower',
  group: 'Binary Search',
  pattern: 'Binary Search',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/guess-number-higher-or-lower/',
  statement:
    'I pick a number between `1` and `n`. You guess; I answer higher, lower, or correct. Return my number. LeetCode hands you a `guess(x)` API — here the runner passes the secret as `pick`, so treat `x < pick`, `x > pick`, `x === pick` as the only three things you may learn, and find it in O(log n) comparisons rather than reading `pick` directly.',
  constraints: [
    '1 <= n <= 2^31 - 1',
    '1 <= pick <= n',
    'Only compare a guess against pick — O(log n) comparisons',
  ],
  signature: {
    fn: 'guessNumber',
    params: [
      { name: 'n', type: 'int' },
      { name: 'pick', type: 'int' },
    ],
    ret: 'int',
  },
  tests: [
    { args: [10, 6], expect: 6 },
    { args: [1, 1], expect: 1, note: 'only one candidate' },
    { args: [100, 100], expect: 100, note: 'the answer is the last number' },
    { args: [10, 1], expect: 1, note: 'the answer is the first number' },
    { args: [2, 2], expect: 2, note: 'two candidates, the midpoint misses' },
    { args: [3, 2], expect: 2 },
    { args: [2147483647, 1702766719], expect: 1702766719, note: 'midpoints must not overflow' },
    { args: [2147483647, 2147483647], expect: 2147483647, note: 'the secret is the largest int' },
  ],
  demo: [10, 6],
  scale: (n) => [n, Math.max(1, n >> 1)],
  starter: {
    js: `function guessNumber(n, pick) {
  // n: number, pick: number  ->  number
  // const guess = (x) => (x === pick ? 0 : x < pick ? -1 : 1);
}
`,
    cpp: `int guessNumber(int n, int pick) {
    // auto guess = [&](int x) { return x == pick ? 0 : (x < pick ? -1 : 1); };
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'linear',
      label: 'Guess every number in turn',
      kind: 'brute',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'Ask about 1, then 2, then 3, and stop when the answer is "correct". It uses the API honestly and always finishes, but it ignores the higher-or-lower half of every reply: with n near two billion, a secret near the top costs two billion guesses.',
      code: {
        cpp: {
          lines: [
            'int guessNumber(int n, int pick) {',
            '    auto guess = [&](int x) { return x == pick ? 0 : (x < pick ? -1 : 1); };',
            '    for (int x = 1; x < n; ++x)',
            '        if (guess(x) == 0) return x;',
            '    return n;',
            '}',
          ],
        },
        js: {
          lines: [
            'function guessNumber(n, pick) {',
            '  const guess = (x) => (x === pick ? 0 : x < pick ? -1 : 1);',
            '  for (let x = 1; x < n; x++)',
            '    if (guess(x) === 0) return x;',
            '  return n;',
            '}',
          ],
        },
      },
      run([n, pick]: [number, number], c) {
        if (pick > 5_000_000) throw new Error('too slow: a linear scan of the guesses')
        const guess = (x: number) => (x === pick ? 0 : x < pick ? -1 : 1)
        for (let x = 1; x < n; x++) {
          c.ops++
          if (guess(x) === 0) return x
        }
        return n
      },
    },
    {
      id: 'binary-search',
      label: 'Halve the range on every answer',
      kind: 'optimal',
      time: 'O(log n)',
      space: 'O(1)',
      blurb:
        'Each reply says which side of the guess the secret sits on, so it rules out half the remaining range: guess the midpoint and keep the side that is still possible. Two billion candidates fall to one in 31 guesses. Compute the midpoint as `low + (high - low) / 2`: with n near the integer limit, `(low + high) / 2` overflows before it is ever halved.',
      code: {
        cpp: {
          lines: [
            'int guessNumber(int n, int pick) {',
            '    auto guess = [&](int x) { return x == pick ? 0 : (x < pick ? -1 : 1); };',
            '    int low = 1, high = n;',
            '    while (low < high) {',
            '        int mid = low + (high - low) / 2;',
            '        int r = guess(mid);',
            '        if (r == 0) return mid;',
            '        if (r < 0) low = mid + 1;',
            '        else high = mid - 1;',
            '    }',
            '    return low;',
            '}',
          ],
        },
        js: {
          lines: [
            'function guessNumber(n, pick) {',
            '  const guess = (x) => (x === pick ? 0 : x < pick ? -1 : 1);',
            '  let low = 1, high = n;',
            '  while (low < high) {',
            '    const mid = low + Math.floor((high - low) / 2);',
            '    const r = guess(mid);',
            '    if (r === 0) return mid;',
            '    if (r < 0) low = mid + 1;',
            '    else high = mid - 1;',
            '  }',
            '  return low;',
            '}',
          ],
        },
      },

      run([n, pick]: [number, number], c) {
        const guess = (x: number) => (x === pick ? 0 : x < pick ? -1 : 1)
        let low = 1
        let high = n
        while (low < high) {
          c.ops++
          const mid = low + Math.floor((high - low) / 2)
          const r = guess(mid)
          if (r === 0) return mid
          if (r < 0) low = mid + 1
          else high = mid - 1
        }
        return low
      },
    },
  ],
}
