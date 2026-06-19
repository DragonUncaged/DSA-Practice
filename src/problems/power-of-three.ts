import type { Problem } from '@/lib/types'

export const powerOfThree: Problem = {
  id: 'power-of-three',
  title: 'Power of Three',
  group: 'Math',
  pattern: 'Repeated Division',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/power-of-three/',
  statement:
    'Return `true` if the integer `n` is a power of three — that is, if `n == 3^x` for some integer `x >= 0`.',
  constraints: ['-2^31 <= n <= 2^31 - 1', 'Zero and negatives are never powers of three'],
  signature: { fn: 'isPowerOfThree', params: [{ name: 'n', type: 'int' }], ret: 'bool' },
  tests: [
    { args: [27], expect: true },
    { args: [9], expect: true },
    { args: [1], expect: true, note: '3^0 is one' },
    { args: [0], expect: false },
    { args: [45], expect: false, note: 'divisible by three, but not only by three' },
    { args: [-3], expect: false },
  ],
  demo: [27],
  scale: (n) => [n],
  starter: {
    js: `function isPowerOfThree(n) {
  // n: number  ->  boolean
}
`,
    cpp: `bool isPowerOfThree(int n) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'divide-out',
      label: 'Divide by three until you cannot',
      kind: 'optimal',
      time: 'O(log n)',
      space: 'O(1)',
      blurb:
        'Peel threes off the number while it divides cleanly. A power of three ends at exactly one; anything else stalls on a leftover factor. The zero and negative cases have to be rejected up front, otherwise the loop either never starts or never ends.',
      code: {
        cpp: {
          lines: [
            'bool isPowerOfThree(int n) {',
            '    if (n < 1) return false;',
            '    while (n % 3 == 0) n /= 3;',
            '    return n == 1;',
            '}',
          ],
        },
        js: {
          lines: [
            'function isPowerOfThree(n) {',
            '  if (n < 1) return false;',
            '  while (n % 3 === 0) n /= 3;',
            '  return n === 1;',
            '}',
          ],
        },
      },

      run([n]: [number], c) {
        c.ops++
        if (n < 1) return false
        let v = n
        while (v % 3 === 0) {
          c.ops++
          v /= 3
        }
        return v === 1
      },
    },
  ],
}
