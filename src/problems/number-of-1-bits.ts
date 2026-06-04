import { text, type Problem, type Tone } from '@/lib/types'

const DEMO: [number] = [173] // 10101101

const bin = (x: number, w = 8) => (x >>> 0).toString(2).padStart(w, '0').slice(-w)

export const numberOf1Bits: Problem = {
  id: 'number-of-1-bits',
  title: 'Number of 1 Bits',
  group: 'Binary',
  pattern: 'Bit Manipulation',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/number-of-1-bits/',
  statement: 'Given an unsigned integer `n`, return the number of `1` bits it contains (its Hamming weight).',
  constraints: ['0 <= n < 2^31 in these tests'],
  signature: { fn: 'hammingWeight', params: [{ name: 'n', type: 'int' }], ret: 'int' },
  tests: [
    { args: [11], expect: 3 },
    { args: [128], expect: 1 },
    { args: [1023], expect: 10 },
    { args: [0], expect: 0, note: 'no bits set' },
  ],
  demo: DEMO,
  scale: (n) => [n],
  starter: {
    js: `function hammingWeight(n) {
  // n: number  ->  number
}
`,
    cpp: `int hammingWeight(int n) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'clear-lowest',
      label: 'Clear the lowest set bit',
      kind: 'optimal',
      time: 'O(k) for k set bits',
      space: 'O(1)',
      blurb:
        'n & (n - 1) deletes exactly the lowest 1-bit, nothing else. So instead of inspecting all 32 positions, loop once per set bit and count how many deletions it takes to reach zero.',
      code: {
        cpp: {
          lines: [
            'int hammingWeight(int n) {',
            '    int count = 0;',
            '    while (n) {',
            '        n &= n - 1;',
            '        count++;',
            '    }',
            '    return count;',
            '}',
          ],
          map: { init: 2, clear: 4, done: 7 },
        },
        js: {
          lines: [
            'function hammingWeight(n) {',
            '  let count = 0;',
            '  while (n !== 0) {',
            '    n &= n - 1;',
            '    count++;',
            '  }',
            '  return count;',
            '}',
          ],
          map: { init: 2, clear: 4, done: 7 },
        },
      },

      trace(t, [n0]: [number]) {
        let n = n0 >>> 0
        let count = 0
        const width = Math.max(8, bin(n0).replace(/^0+/, '').length)

        const view = (cleared: number | null) => {
          const bits = bin(n, width).split('')
          const tones: Record<number, Tone> = {}
          bits.forEach((ch, i) => {
            tones[i] = ch === '1' ? 'band' : 'idle'
          })
          if (cleared != null) {
            // the bit that was just deleted, shown from the left
            const pos = width - 1 - cleared
            if (pos >= 0) tones[pos] = 'bad'
          }
          return text(bits, { tones, title: `n in binary`, showIndex: false })
        }

        t.push({
          step: 'init',
          note: `${n0} in binary is ${bin(n0, width)}. Each loop iteration erases exactly one 1 — the lowest — so the iteration count is the answer.`,
          view: view(null),
          vars: [
            ['n', n0],
            ['count', 0],
          ],
        })

        while (n !== 0 && !t.full) {
          const lowest = Math.log2(n & -n)
          n &= n - 1
          count++
          t.bump()
          t.push({
            step: 'clear',
            note: `n & (n - 1) clears the lowest set bit (position ${lowest}). ${count} bit${count === 1 ? '' : 's'} counted, ${bin(n, width)} remains.`,
            view: view(lowest),
            vars: [
              ['cleared bit', lowest, 'no'],
              ['count', count, 'ok'],
              ['n now', n],
            ],
            badge: { text: `count = ${count}`, accent: 'ok' },
          })
        }

        t.push({
          step: 'done',
          note: `Zero reached after ${count} deletions — ${n0} has ${count} set bits. The loop ran ${count} times, not 32.`,
          view: view(null),
          vars: [['answer', count, 'ok']],
          badge: { text: `${count} ones`, accent: 'ok' },
        })
      },

      run([n0]: [number], c) {
        let n = n0 >>> 0
        let count = 0
        while (n !== 0) {
          c.ops++
          n &= n - 1
          count++
        }
        return count
      },
    },
  ],
}
