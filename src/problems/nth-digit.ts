import type { Problem } from '@/lib/types'

export const nthDigit: Problem = {
  id: 'nth-digit',
  title: 'Nth Digit',
  group: 'Math',
  pattern: 'Counting by Width',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/nth-digit/',
  statement:
    'Write the positive integers one after another: `123456789101112...`. Return the `n`-th digit of that infinite sequence, counting from `1`.',
  constraints: ['1 <= n <= 2^31 - 1', 'The sequence is 1-indexed'],
  signature: { fn: 'findNthDigit', params: [{ name: 'n', type: 'int' }], ret: 'int' },
  tests: [
    { args: [3], expect: 3 },
    { args: [1], expect: 1 },
    { args: [10], expect: 1, note: 'the first digit of 10' },
    { args: [11], expect: 0, note: 'the second digit of 10' },
    { args: [15], expect: 2 },
    { args: [1000], expect: 3 },
  ],
  demo: [11],
  scale: (n) => [n * 1000],
  starter: {
    js: `function findNthDigit(n) {
  // n: number  ->  number
}
`,
    cpp: `int findNthDigit(int n) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'skip-blocks',
      label: 'Skip whole width blocks, then index',
      kind: 'optimal',
      time: 'O(log n)',
      space: 'O(1)',
      blurb:
        'Numbers of the same width form a block of known size: nine one-digit numbers contribute 9 digits, ninety two-digit numbers contribute 180, and so on. Subtract whole blocks until n lands inside one; then division finds which number it is, and the remainder picks the digit within that number.',
      code: {
        cpp: {
          lines: [
            'int findNthDigit(int n) {',
            '    long long width = 1, count = 9, start = 1;',
            '    long long left = n;',
            '    while (left > width * count) {',
            '        left -= width * count;',
            '        width++;',
            '        count *= 10;',
            '        start *= 10;',
            '    }',
            '    long long number = start + (left - 1) / width;',
            '    string text = to_string(number);',
            '    return text[(left - 1) % width] - \'0\';',
            '}',
          ],
        },
        js: {
          lines: [
            'function findNthDigit(n) {',
            '  let width = 1, count = 9, start = 1, left = n;',
            '  while (left > width * count) {',
            '    left -= width * count;',
            '    width++;',
            '    count *= 10;',
            '    start *= 10;',
            '  }',
            '  const number = start + Math.floor((left - 1) / width);',
            '  return Number(String(number)[(left - 1) % width]);',
            '}',
          ],
        },
      },

      run([n]: [number], c) {
        let width = 1
        let count = 9
        let start = 1
        let left = n
        while (left > width * count) {
          c.ops++
          left -= width * count
          width++
          count *= 10
          start *= 10
        }
        c.ops++
        const number = start + Math.floor((left - 1) / width)
        return Number(String(number)[(left - 1) % width])
      },
    },
  ],
}
