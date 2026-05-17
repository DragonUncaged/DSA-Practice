import { arr } from '@/lib/types'
import type { PatternIntro } from './index'

const N = 6

export const dp: PatternIntro = {
  id: 'dp',
  name: 'Dynamic Programming',
  tagline: 'Answer every small version once, and the big version becomes a lookup.',
  story: [
    'DP is recursion that stopped repeating itself. Climbing stairs asks: how many ways to reach step `n`? Every way arrives from `n-1` or `n-2`, so `ways(n) = ways(n-1) + ways(n-2)`. Naively that recursion re-solves the same subproblems exponentially many times. The fix is almost insultingly simple: solve them smallest-first and *write the answers down*.',
    'Watch the table fill below. Each cell is computed once, from two cells that already exist, in constant time. That is the whole discipline: (1) define what a cell *means* in one sentence — "ways[i] = number of ways to reach step i"; (2) find the recurrence that builds it from earlier cells; (3) nail the base cases; (4) fill in an order where everything you need is already there.',
    'Every DP on the ramp is this template with a different sentence. House Robber: "best loot up to house i." Coin Change: "fewest coins to make amount a." LCS: a 2-D sentence about two prefixes. When you are stuck, you are almost always stuck at step 1 — the sentence — not at the code.',
  ],
  signals: [
    'Counting ways, minimizing cost, or maximizing value over sequential choices.',
    'The naive recursion branches into overlapping subproblems.',
    'The answer for size n is expressible from answers for smaller sizes.',
    '"Take it or leave it" decisions down a line of items.',
  ],
  pseudo: {
    lines: [
      'ways[0] = 1, ways[1] = 1',
      'for i in 2 .. n:',
      '    ways[i] = ways[i-1] + ways[i-2]',
      'return ways[n]',
    ],
    map: { init: 1, fill: 3, done: 4 },
  },

  trace(t) {
    const ways: (number | string)[] = Array.from({ length: N + 1 }, () => '·')
    ways[0] = 1
    ways[1] = 1

    const view = (i: number | null) =>
      arr(ways, {
        pointers: i == null ? [] : [{ name: 'i', at: i, accent: 'a' }],
        tones: Object.fromEntries(
          ways.map((v, j) => [j, v === '·' ? 'idle' : i != null && j >= i - 2 && j < i ? 'active' : 'done']),
        ),
        title: `ways[i] — number of distinct ways to reach step i (n = ${N})`,
      })

    t.push({
      step: 'init',
      note: 'Base cases first: one way to stand at the bottom, one way to reach step 1. Everything else will be built, never guessed.',
      view: view(null),
      vars: [
        ['ways[0]', 1],
        ['ways[1]', 1],
      ],
    })

    for (let i = 2; i <= N; i++) {
      const a = ways[i - 1] as number
      const b = ways[i - 2] as number
      ways[i] = a + b
      t.bump()
      t.push({
        step: 'fill',
        note: `Step ${i} is reached from step ${i - 1} or step ${i - 2} — nowhere else. So ways[${i}] = ${a} + ${b} = ${a + b}, computed once from two finished answers.`,
        view: view(i),
        vars: [
          ['ways[i-1]', a, 'b'],
          ['ways[i-2]', b, 'c'],
          ['ways[i]', a + b, 'ok'],
        ],
        badge: { text: `ways[${i}] = ${a + b}`, accent: 'ok' },
      })
    }

    t.push({
      step: 'done',
      note: `ways[${N}] = ${ways[N]}. The exponential recursion collapsed into ${N - 1} additions — each subproblem solved exactly once.`,
      view: view(null),
      vars: [['answer', ways[N] as number, 'ok']],
      badge: { text: `${ways[N]} ways`, accent: 'ok' },
    })
  },

  ramp: [
    'climbing-stairs',
    'maximum-subarray',
    'house-robber',
    'house-robber-ii',
    'unique-paths',
    'decode-ways',
    'coin-change',
    'word-break',
    'longest-increasing-subsequence',
    'longest-common-subsequence',
    'maximum-product-subarray',
  ],
}
