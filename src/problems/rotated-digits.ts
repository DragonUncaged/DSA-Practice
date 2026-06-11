import type { Problem } from '@/lib/types'

export const rotatedDigits: Problem = {
  id: 'rotated-digits',
  title: 'Rotated Digits',
  group: 'Math',
  pattern: 'Digit Scan',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/rotated-digits/',
  statement:
    'Rotating a number turns each digit 180 degrees: `0`, `1` and `8` stay themselves, `2` and `5` swap, `6` and `9` swap, and `3`, `4`, `7` become nothing. A number is *good* when every digit survives the rotation **and** the rotated number differs from the original. Return how many numbers in `1..n` are good.',
  constraints: ['1 <= n <= 10^4', 'Every digit must be rotatable', 'The result must differ from the input'],
  signature: { fn: 'rotatedDigits', params: [{ name: 'n', type: 'int' }], ret: 'int' },
  tests: [
    { args: [10], expect: 4, note: '2, 5, 6 and 9' },
    { args: [1], expect: 0, note: '1 rotates to itself' },
    { args: [2], expect: 1 },
    { args: [20], expect: 9 },
  ],
  demo: [10],
  scale: (n) => [n],
  starter: {
    js: `function rotatedDigits(n) {
  // n: number  ->  number
}
`,
    cpp: `int rotatedDigits(int n) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'digit-scan',
      label: 'Two flags per number',
      kind: 'optimal',
      time: 'O(n log n)',
      space: 'O(1)',
      blurb:
        'Each number needs two independent facts: does it contain a digit that cannot rotate, and does it contain one that changes. Peel the digits off with repeated division and set a flag for each. A number counts only when nothing was invalid and at least one digit changed.',
      code: {
        cpp: {
          lines: [
            'int rotatedDigits(int n) {',
            '    int total = 0;',
            '    for (int x = 1; x <= n; ++x) {',
            '        bool valid = true, changed = false;',
            '        for (int v = x; v > 0; v /= 10) {',
            '            int d = v % 10;',
            '            if (d == 3 || d == 4 || d == 7) valid = false;',
            '            if (d == 2 || d == 5 || d == 6 || d == 9) changed = true;',
            '        }',
            '        if (valid && changed) total++;',
            '    }',
            '    return total;',
            '}',
          ],
        },
        js: {
          lines: [
            'function rotatedDigits(n) {',
            '  let total = 0;',
            '  for (let x = 1; x <= n; x++) {',
            '    let valid = true, changed = false;',
            '    for (let v = x; v > 0; v = Math.floor(v / 10)) {',
            '      const d = v % 10;',
            '      if (d === 3 || d === 4 || d === 7) valid = false;',
            '      if (d === 2 || d === 5 || d === 6 || d === 9) changed = true;',
            '    }',
            '    if (valid && changed) total++;',
            '  }',
            '  return total;',
            '}',
          ],
        },
      },

      run([n]: [number], c) {
        let total = 0
        for (let x = 1; x <= n; x++) {
          let valid = true
          let changed = false
          for (let v = x; v > 0; v = Math.floor(v / 10)) {
            c.ops++
            const d = v % 10
            if (d === 3 || d === 4 || d === 7) valid = false
            if (d === 2 || d === 5 || d === 6 || d === 9) changed = true
          }
          if (valid && changed) total++
        }
        return total
      },
    },
  ],
}
