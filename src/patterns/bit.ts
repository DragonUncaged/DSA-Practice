import { text } from '@/lib/types'
import type { PatternIntro } from './index'

const START = 0b1101 // 13

export const bit: PatternIntro = {
  id: 'bit',
  name: 'Bit Manipulation',
  tagline: 'A number is a row of switches — flip exactly the ones you mean.',
  story: [
    'An integer is not a blob; it is 32 switches in a row. AND masks switches off, OR forces them on, XOR toggles, and shifting slides the whole row. Bit problems stop being cryptic the moment you narrate them in switch language instead of arithmetic.',
    'The demo shows the one identity worth memorizing outright: `n & (n - 1)` deletes the lowest 1-bit, always, in one operation. Why: subtracting 1 flips the lowest 1 to 0 and floods the zeros under it with 1s; AND-ing wipes that whole tail. Count how many times you can do it before hitting zero and you have counted the 1-bits — touching only the bits that are actually set.',
    'The other workhorse is XOR\'s algebra: `x ^ x = 0` and `x ^ 0 = x`, so XOR-ing a whole list cancels everything that appears twice — Missing Number falls in one line. And when the problem bans `+`, XOR *is* addition without carry, while AND-shift-left is the carry (Sum of Two Integers). Same switches, different narration.',
  ],
  signals: [
    'The problem talks about binary, bits, or bans ordinary arithmetic.',
    'Pairs cancelling out — XOR erases anything that appears an even number of times.',
    'Counting or isolating set bits; n & (n-1) and n & -n are the tools.',
    'A set with ≤ 32 members can live inside one integer as a bitmask.',
  ],
  pseudo: {
    lines: [
      'count = 0',
      'while n != 0:',
      '    n = n & (n - 1)   # delete lowest 1',
      '    count += 1',
      'count is the number of 1-bits',
    ],
    map: { init: 1, clear: 3, tally: 4, done: 5 },
  },

  trace(t) {
    let n = START
    const bin = (x: number) => x.toString(2).padStart(4, '0')

    const view = (highlight: number | null, tone: 'bad' | 'good' = 'bad') =>
      text(bin(n), {
        tones:
          highlight == null
            ? Object.fromEntries(bin(n).split('').map((c, i) => [i, c === '1' ? 'band' : 'idle']))
            : { [highlight]: tone },
        showIndex: false,
        title: `n = ${n} in binary`,
      })

    t.push({
      step: 'init',
      note: `${START} is ${bin(START)} — three switches on. Each round will delete exactly one of them, lowest first.`,
      view: view(null),
      vars: [
        ['n', `${n} = ${bin(n)}`],
        ['count', 0],
      ],
    })

    let count = 0
    while (n !== 0) {
      const lowestPos = 3 - Math.log2(n & -n)
      const before = n
      n = n & (n - 1)
      count++
      t.bump()
      t.push({
        step: 'clear',
        note: `${before} & ${before - 1}  =  ${bin(before)} & ${bin(before - 1)}  =  ${bin(n)}. Subtracting 1 chewed up the lowest 1 and its tail; AND erased them. One operation, one switch off.`,
        view: view(lowestPos),
        vars: [
          ['n', `${n} = ${bin(n)}`],
          ['count', count, 'ok'],
        ],
        badge: { text: `bit gone — count ${count}`, accent: 'c' },
      })
    }

    t.push({
      step: 'done',
      note: `Zero in ${count} rounds, so ${START} has ${count} one-bits. The loop ran once per set bit — not once per bit position.`,
      view: view(null),
      vars: [['answer', count, 'ok']],
      badge: { text: `${count} one-bits`, accent: 'ok' },
    })
  },

  ramp: [
    'number-of-1-bits',
    'counting-bits',
    'missing-number',
    'reverse-bits',
    'sum-of-two-integers',
  ],
}
