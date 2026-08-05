import type { Problem } from '@/lib/types'

export const powerOfThree: Problem = {
  id: 'power-of-three',
  title: 'Power of Three',
  group: 'Math',
  pattern: 'Number Theory',
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
    { args: [3], expect: true },
    { args: [2], expect: false },
    { args: [243], expect: true },
    { args: [1162261467], expect: true, note: '3^19, the largest power of three in a 32-bit int' },
    { args: [2147483647], expect: false, note: 'the largest int' },
    { args: [-2147483648], expect: false, note: 'the smallest int' },
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
      id: 'multiply-up',
      label: 'Generate powers of three until you pass n',
      kind: 'brute',
      time: 'O(log n)',
      space: 'O(1)',
      blurb:
        'Start at one and keep multiplying by three, stopping as soon as the power reaches or passes n; it is a power of three exactly when the two meet. The loop runs only about twenty times for any 32-bit input, but the running product must be kept in a wider type — the last multiplication before it passes n can overflow a plain int.',
      code: {
        cpp: {
          lines: [
            'bool isPowerOfThree(int n) {',
            '    if (n < 1) return false;',
            '    long long power = 1;',
            '    while (power < n) power *= 3;',
            '    return power == n;',
            '}',
          ],
        },
        js: {
          lines: [
            'function isPowerOfThree(n) {',
            '  if (n < 1) return false;',
            '  let power = 1;',
            '  while (power < n) power *= 3;',
            '  return power === n;',
            '}',
          ],
        },
      },
      run([n]: [number], c) {
        c.ops++
        if (n < 1) return false
        let power = 1
        while (power < n) {
          c.ops++
          power *= 3
        }
        return power === n
      },
    },
    {
      id: 'divide-out',
      label: 'Divide by three until you cannot',
      kind: 'better',
      time: 'O(log n)',
      space: 'O(1)',
      blurb:
        'Dividing avoids the overflow that multiplying risks. Peel threes off the number while it divides cleanly: a power of three ends at exactly one, anything else stalls on a leftover factor. The zero and negative cases have to be rejected up front, otherwise the loop either never starts or never ends.',
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
    {
      id: 'largest-power',
      label: 'Divide the largest power of three by n',
      kind: 'optimal',
      time: 'O(1)',
      space: 'O(1)',
      blurb:
        'The loop can be replaced by one division. Three is prime, so the only divisors of 3^19 are the powers of three below it — and 3^19 = 1162261467 is the largest power of three that fits in a 32-bit int. A positive n is therefore a power of three exactly when it divides that constant. No loop, no overflow, one modulo.',
      code: {
        cpp: {
          lines: [
            'bool isPowerOfThree(int n) {',
            '    return n > 0 && 1162261467 % n == 0;',
            '}',
          ],
        },
        js: {
          lines: [
            'function isPowerOfThree(n) {',
            '  return n > 0 && 1162261467 % n === 0;',
            '}',
          ],
        },
      },
      run([n]: [number], c) {
        c.ops++
        return n > 0 && 1162261467 % n === 0
      },
    },
  ],
}
