import type { Problem } from '@/lib/types'

export const powerOfTwo: Problem = {
  id: 'power-of-two',
  title: 'Power of Two',
  group: 'Binary',
  pattern: 'Bit Manipulation',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/power-of-two/',
  statement:
    'Return `true` if the integer `n` is a power of two — that is, if `n == 2^x` for some integer `x >= 0`.',
  constraints: ['-2^31 <= n <= 2^31 - 1', 'Zero and negatives are never powers of two'],
  signature: { fn: 'isPowerOfTwo', params: [{ name: 'n', type: 'int' }], ret: 'bool' },
  tests: [
    { args: [1], expect: true, note: '2^0 is one' },
    { args: [16], expect: true },
    { args: [3], expect: false },
    { args: [0], expect: false },
    { args: [-16], expect: false, note: 'the sign bit is not a power of two' },
  ],
  demo: [16],
  scale: (n) => [n],
  starter: {
    js: `function isPowerOfTwo(n) {
  // n: number  ->  boolean
}
`,
    cpp: `bool isPowerOfTwo(int n) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'clear-lowest-bit',
      label: 'A power of two has exactly one bit set',
      kind: 'optimal',
      time: 'O(1)',
      space: 'O(1)',
      blurb:
        'In binary, `n - 1` flips the lowest set bit and everything below it. So `n & (n - 1)` clears that lowest bit, and the result is zero only when there was nothing else set — exactly the shape of a power of two. Positives only: zero and negatives have to be excluded first.',
      code: {
        cpp: {
          lines: [
            'bool isPowerOfTwo(int n) {',
            '    return n > 0 && (n & (n - 1)) == 0;',
            '}',
          ],
        },
        js: {
          lines: [
            'function isPowerOfTwo(n) {',
            '  return n > 0 && (n & (n - 1)) === 0;',
            '}',
          ],
        },
      },

      run([n]: [number], c) {
        c.ops++
        return n > 0 && (n & (n - 1)) === 0
      },
    },
  ],
}
