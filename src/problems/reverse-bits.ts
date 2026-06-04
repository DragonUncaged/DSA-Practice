import { combo, text, type Problem, type Tone } from '@/lib/types'

const DEMO: [number] = [178] // 10110010 in the 8-bit teaching view

export const reverseBits: Problem = {
  id: 'reverse-bits',
  title: 'Reverse Bits',
  group: 'Binary',
  pattern: 'Bit Manipulation',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/reverse-bits/',
  statement: 'Reverse the bits of a 32-bit unsigned integer `n` and return the resulting integer.',
  constraints: ['The input is a 32-bit unsigned integer', 'These tests keep results under 2^31'],
  signature: { fn: 'reverseBits', params: [{ name: 'n', type: 'int' }], ret: 'int' },
  tests: [
    { args: [43261596], expect: 964176192 },
    { args: [2], expect: 1073741824, note: 'bit 1 lands on bit 30' },
    { args: [4], expect: 536870912 },
    { args: [0], expect: 0 },
  ],
  demo: DEMO,
  starter: {
    js: `function reverseBits(n) {
  // n: number  ->  number
}
`,
    cpp: `int reverseBits(int n) {
    // use unsigned internally; these tests keep the result inside int range
}
`,
  },

  solutions: [
    {
      id: 'shift',
      label: 'Peel from one end, push onto the other',
      kind: 'optimal',
      time: 'O(1)',
      space: 'O(1)',
      blurb:
        'Thirty-two rounds: take the lowest bit off n and push it onto the bottom of the answer, which shifts everything already there up. The first bit taken ends up on top — exactly a reversal, like flipping a stack of plates.',
      code: {
        cpp: {
          lines: [
            'int reverseBits(int n) {',
            '    unsigned x = n, out = 0;',
            '    for (int i = 0; i < 32; ++i) {',
            '        out = (out << 1) | (x & 1);',
            '        x >>= 1;',
            '    }',
            '    return (int)out;',
            '}',
          ],
          map: { init: 2, bit: 4, done: 7 },
        },
        js: {
          lines: [
            'function reverseBits(n) {',
            '  let out = 0;',
            '  for (let i = 0; i < 32; i++) {',
            '    out = (out << 1) | (n & 1);',
            '    n >>>= 1;',
            '  }',
            '  return out >>> 0;',
            '}',
          ],
          map: { init: 2, bit: 4, done: 7 },
        },
      },

      trace(t, [n0]: [number]) {
        // The real algorithm does 32 rounds; the trace shows the same moves on
        // 8 bits so each one is legible. The code panel is the full version.
        const W = 8
        let n = n0 & 0xff
        let out = 0

        const view = (taking: number | null) => {
          const src = n.toString(2).padStart(W, '0').split('')
          const dst = out.toString(2).padStart(W, '0').split('')
          const srcTones: Record<number, Tone> = {}
          const dstTones: Record<number, Tone> = {}
          src.forEach((ch, i) => {
            srcTones[i] = ch === '1' ? 'band' : 'idle'
          })
          dst.forEach((ch, i) => {
            dstTones[i] = ch === '1' ? 'good' : 'idle'
          })
          if (taking != null) srcTones[W - 1] = 'active'
          return combo(
            text(src, { tones: srcTones, title: 'n — bits leave from the right', showIndex: false }),
            text(dst, { tones: dstTones, title: 'out — bits arrive at the right and get pushed up', showIndex: false }),
          )
        }

        t.push({
          step: 'init',
          note: `Trace shows 8 bits for readability; the shown code does the identical move 32 times. Every round the lowest bit of n hops onto the bottom of out.`,
          view: view(null),
          vars: [
            ['n', n],
            ['out', 0],
          ],
        })

        for (let i = 0; i < W && !t.full; i++) {
          const bit = n & 1
          out = (out << 1) | bit
          n >>>= 1
          t.bump()
          t.push({
            step: 'bit',
            note: `Round ${i + 1}: n's lowest bit is ${bit}. Shift out left and drop the ${bit} in. Bits taken early keep getting pushed toward the top — that is the reversal.`,
            view: view(bit),
            vars: [
              ['round', i + 1],
              ['bit moved', bit, bit ? 'ok' : 'mute'],
              ['out', out, 'c'],
            ],
            badge: { text: `bit ${bit} moved`, accent: bit ? 'ok' : 'mute' },
          })
        }

        t.push({
          step: 'done',
          note: `All bits relocated: ${(n0 & 0xff).toString(2).padStart(W, '0')} became ${out.toString(2).padStart(W, '0')}. The 32-bit version is the same loop, just four times longer.`,
          view: view(null),
          vars: [['answer (8-bit view)', out, 'ok']],
          badge: { text: 'reversed', accent: 'ok' },
        })
      },

      run([n0]: [number], c) {
        let n = n0 >>> 0
        let out = 0
        for (let i = 0; i < 32; i++) {
          c.ops++
          out = (out << 1) | (n & 1)
          n >>>= 1
        }
        return out >>> 0
      },
    },
  ],
}
