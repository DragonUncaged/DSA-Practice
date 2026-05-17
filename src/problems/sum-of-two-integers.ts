import { mapOf, type Problem } from '@/lib/types'

const DEMO: [number, number] = [5, 3]

const bin = (x: number, w = 8) => (x >>> 0).toString(2).padStart(w, '0').slice(-w)

export const sumOfTwoIntegers: Problem = {
  id: 'sum-of-two-integers',
  title: 'Sum of Two Integers',
  group: 'Binary',
  pattern: 'Bit Manipulation',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/sum-of-two-integers/',
  statement: 'Given two integers `a` and `b`, return their sum without using the `+` or `-` operators.',
  constraints: ['-1000 <= a, b <= 1000', 'No + or - anywhere'],
  signature: {
    fn: 'getSum',
    params: [
      { name: 'a', type: 'int' },
      { name: 'b', type: 'int' },
    ],
    ret: 'int',
  },
  tests: [
    { args: [1, 2], expect: 3 },
    { args: [2, 3], expect: 5 },
    { args: [-2, 3], expect: 1, note: 'negative operand' },
    { args: [0, 0], expect: 0 },
    { args: [-5, -7], expect: -12, note: 'both negative' },
  ],
  demo: DEMO,
  starter: {
    py: `def getSum(a, b):
    # a: int, b: int  ->  int
    pass
`,
    js: `function getSum(a, b) {
  // a: number, b: number  ->  number
}
`,
    cpp: `int getSum(int a, int b) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'xor-carry',
      label: 'XOR plus carried AND',
      kind: 'optimal',
      time: 'O(1)',
      space: 'O(1)',
      blurb:
        'Adding bits is two separate jobs: XOR adds each column while ignoring carries, and AND-shifted-left is exactly the carries that were ignored. Repeat until nothing is left to carry — at most 32 rounds.',
      code: {
        py: {
          lines: [
            'def getSum(a, b):',
            '    mask = 0xFFFFFFFF',
            '    while b != 0:',
            '        carry = ((a & b) << 1) & mask',
            '        a = (a ^ b) & mask',
            '        b = carry',
            '    return a if a <= 0x7FFFFFFF else ~(a ^ mask)',
          ],
          map: { init: 2, calc: 4, done: 7 },
        },
        cpp: {
          lines: [
            'int getSum(int a, int b) {',
            '    while (b != 0) {',
            '        unsigned carry = (unsigned)(a & b) << 1;',
            '        a = a ^ b;',
            '        b = carry;',
            '    }',
            '    return a;',
            '}',
          ],
          map: { init: 1, calc: 3, done: 7 },
        },
        js: {
          lines: [
            'function getSum(a, b) {',
            '  while (b !== 0) {',
            '    const carry = (a & b) << 1;',
            '    a = a ^ b;',
            '    b = carry;',
            '  }',
            '  return a;',
            '}',
          ],
          map: { init: 1, calc: 3, done: 7 },
        },
      },

      trace(t, [a0, b0]: [number, number]) {
        let a = a0 | 0
        let b = b0 | 0

        const view = (carry: number | null) =>
          mapOf(
            [
              { k: 'a', v: `${bin(a)}  (${a})`, tone: 'active' },
              { k: 'b', v: `${bin(b)}  (${b})`, tone: b !== 0 ? 'band' : 'dim' },
              ...(carry != null ? [{ k: 'carry', v: `${bin(carry)}  (${carry})`, tone: 'bad' as const }] : []),
            ],
            { title: 'registers (low 8 bits shown)' },
          )

        t.push({
          step: 'init',
          note: `Adding ${a0} and ${b0} with no + sign. XOR handles the columns that don't overflow; AND << 1 collects the columns that do.`,
          view: view(null),
          vars: [
            ['a', a0],
            ['b', b0],
          ],
        })

        let round = 0
        while (b !== 0 && !t.full && round < 36) {
          const carry = (a & b) << 1
          const xor = a ^ b
          t.bump()
          round++

          t.push({
            step: 'calc',
            note: `Round ${round}: XOR gives the carryless sum ${xor}; the overlapping 1-bits, shifted left, form the carry ${carry}. The carry becomes the new b and the loop repeats until it dies out.`,
            view: view(carry),
            vars: [
              ['a ^ b', xor, 'c'],
              ['(a & b) << 1', carry, 'no'],
              ['round', round],
            ],
            badge: { text: `carry ${carry}`, accent: carry ? 'no' : 'ok' },
          })

          a = xor
          b = carry
        }

        t.push({
          step: 'done',
          note: `The carry reached zero, so a holds the full sum: ${a}. Never more than 32 rounds, because each round pushes the carry at least one bit left.`,
          view: view(null),
          vars: [['answer', a, 'ok']],
          badge: { text: `${a0} + ${b0} = ${a}`, accent: 'ok' },
        })
      },

      run([a, b]: [number, number], c) {
        a |= 0
        b |= 0
        while (b !== 0) {
          c.ops++
          const carry = (a & b) << 1
          a = a ^ b
          b = carry
        }
        return a
      },
    },
  ],
}
