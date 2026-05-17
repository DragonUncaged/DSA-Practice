import { arr } from '@/lib/types'
import type { PatternIntro } from './index'

const NUMS = [4, 2, 1, 7, 8, 1, 2, 8]
const K = 3

export const slidingWindow: PatternIntro = {
  id: 'sliding-window',
  name: 'Sliding Window',
  tagline: 'Keep a running answer for a span, and update it in O(1) as the span slides.',
  story: [
    'Ask for the best window of size `k` and the brute force recomputes each window from scratch — `n` windows times `k` elements. But two neighbouring windows share almost everything: slide one step and exactly one element enters while one leaves. Add the newcomer, subtract the leaver, and the whole recomputation collapses into two operations.',
    'That is the fixed-size version, shown below. The deeper form lets the window breathe: grow the right edge while the window is still legal, shrink from the left the moment it is not. Legality is whatever the problem says — no repeated characters, at most k replacements, all required letters present. Each pointer only ever moves forward, so the whole dance is `O(n)` even though it looks like two loops.',
    'The mental shift from two pointers: there, the answer was a pair; here, the answer is a *stretch* — and you maintain a small running summary of it (a sum, a count table, a max) instead of re-reading it.',
  ],
  signals: [
    'The question says "substring", "subarray", or "window" — something contiguous.',
    'You are optimizing over all spans: longest, shortest, max-sum, containing-all.',
    'A running summary (sum, counts, distinct set) can be updated when one element enters or leaves.',
    'The brute force recomputes overlapping work for every start index.',
  ],
  pseudo: {
    lines: [
      'sum = nums[0..k)          # first window',
      'best = sum',
      'for right in k .. n-1:',
      '    sum += nums[right]    # one enters',
      '    sum -= nums[right-k]  # one leaves',
      '    best = max(best, sum)',
    ],
    map: { init: 1, enter: 4, leave: 5, best: 6 },
  },

  trace(t) {
    const n = NUMS.length
    let sum = 0
    for (let i = 0; i < K; i++) {
      sum += NUMS[i]
      t.bump()
    }
    let best = sum
    let bestAt = 0

    const view = (l: number, note?: Record<number, string>) =>
      arr(NUMS, {
        band: { from: l, to: l + K - 1, label: `sum ${sum}` },
        tones: Object.fromEntries(
          NUMS.map((_, i) => [i, i >= l && i < l + K ? 'band' : i < l ? 'done' : 'idle']),
        ),
        notes: note,
        title: `best sum of any ${K} in a row`,
      })

    t.push({
      step: 'init',
      note: `Pay full price exactly once: the first window costs ${K} additions. Every later window will cost two.`,
      view: view(0),
      vars: [
        ['sum', sum],
        ['best', best, 'ok'],
      ],
    })

    for (let right = K; right < n; right++) {
      const l = right - K + 1
      const entered = NUMS[right]
      const left = NUMS[right - K]
      sum += entered - left
      t.bump(2)
      const better = sum > best
      if (better) {
        best = sum
        bestAt = l
      }
      t.push({
        step: better ? 'best' : 'enter',
        note: `Slide: +${entered} in, −${left} out — the ${K - 1} shared elements are never touched. ${better ? `New best: ${sum}.` : `Sum ${sum} does not beat ${best}.`}`,
        view: view(l, { [right]: `+${entered}`, [right - K]: `−${left}` }),
        vars: better
          ? [
              ['sum', sum, 'ok'],
              ['best', best, 'ok'],
            ]
          : [
              ['sum', sum],
              ['best', best, 'ok'],
            ],
        badge: better
          ? { text: `best = ${sum}`, accent: 'ok' }
          : { text: `${sum} ≤ ${best}`, accent: 'mute' },
      })
    }

    t.push({
      step: 'best',
      note: `Done in one pass: ${n - K} slides of two operations each, instead of ${n - K + 1} windows of ${K}.`,
      view: arr(NUMS, {
        band: { from: bestAt, to: bestAt + K - 1, label: `best ${best}`, accent: 'ok' },
        tones: Object.fromEntries(
          NUMS.map((_, i) => [i, i >= bestAt && i < bestAt + K ? 'good' : 'dim']),
        ),
        title: `best sum of any ${K} in a row`,
      }),
      vars: [['best', best, 'ok']],
      badge: { text: `answer ${best}`, accent: 'ok' },
    })
  },

  ramp: [
    'best-time-to-buy-and-sell-stock',
    'longest-substring-without-repeating-characters',
    'longest-repeating-character-replacement',
    'minimum-window-substring',
  ],
}
