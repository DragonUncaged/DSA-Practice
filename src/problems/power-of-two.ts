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
    { args: [2], expect: true },
    { args: [6], expect: false, note: 'even, but two bits are set' },
    { args: [1024], expect: true },
    { args: [1073741824], expect: true, note: '2^30, the largest power of two in a 32-bit int' },
    { args: [2147483647], expect: false, note: 'every bit set' },
    { args: [-2147483648], expect: false, note: 'only the sign bit set' },
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
      id: 'divide-out',
      label: 'Halve until the number is odd',
      kind: 'brute',
      time: 'O(log n)',
      space: 'O(1)',
      blurb:
        'Halve the number while it is even; a power of two ends at exactly one, anything else stops on an odd leftover. Zero and negatives are rejected first, since the loop would never terminate on zero. It is correct and short, but it takes a step per bit when the shape of a power of two can be tested all at once.',
      code: {
        cpp: {
          lines: [
            'bool isPowerOfTwo(int n) {',
            '    if (n < 1) return false;',
            '    while (n % 2 == 0) n /= 2;',
            '    return n == 1;',
            '}',
          ],
        },
        js: {
          lines: [
            'function isPowerOfTwo(n) {',
            '  if (n < 1) return false;',
            '  while (n % 2 === 0) n /= 2;',
            '  return n === 1;',
            '}',
          ],
        },
      },
      run([n]: [number], c) {
        c.ops++
        if (n < 1) return false
        let v = n
        while (v % 2 === 0) {
          c.ops++
          v /= 2
        }
        return v === 1
      },
    },
    {
      id: 'clear-lowest-bit',
      label: 'A power of two has exactly one bit set',
      kind: 'optimal',
      time: 'O(1)',
      space: 'O(1)',
      blurb:
        'The loop tests one bit at a time; a single bit trick tests them all. In binary, `n - 1` flips the lowest set bit and everything below it, so `n & (n - 1)` clears that lowest bit, and the result is zero only when there was nothing else set — exactly the shape of a power of two. Positives only: zero and negatives have to be excluded first.',
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
