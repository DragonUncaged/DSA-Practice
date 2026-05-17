import { arr, combo } from '@/lib/types'
import type { PatternIntro } from './index'

const INPUT: [number, number][] = [
  [1, 3],
  [2, 6],
  [8, 10],
  [9, 12],
  [15, 18],
]

const label = ([s, e]: [number, number]) => `${s}–${e}`

export const intervals: PatternIntro = {
  id: 'intervals',
  name: 'Intervals',
  tagline: 'Sort by start, then sweep once — every clash is with the interval right before you.',
  story: [
    'Interval chaos is almost entirely an ordering problem. Unsorted, any interval might collide with any other and you are stuck comparing all pairs. Sorted by start time, a beautiful fact appears: each interval can only ever interact with the one *currently open* block. Everything earlier has been settled; everything later starts even further right.',
    'So the sweep is one decision per interval: does it start before the open block ends? Yes — they overlap, extend the block (merging is just `end = max(end, e)`). No — the block is finished forever; start a new one. One sort, one pass, done.',
    'Every problem on the ramp is this sweep with a different verdict at the overlap: Merge glues them, Meeting Rooms declares a conflict, Non-overlapping counts an eviction (keep the one that ends earlier — it blocks less future), Meeting Rooms II counts how many blocks are open at once. The sort is always the first line you write.',
  ],
  signals: [
    'The input is pairs of start/end: meetings, bookings, ranges, spans.',
    'The words "overlap", "conflict", "merge", or "free time" appear.',
    'A pairwise check feels necessary until you imagine them sorted on a timeline.',
    'You need "how many are active at once" — sweep the endpoints in order.',
  ],
  pseudo: {
    lines: [
      'sort intervals by start',
      'for [s, e] in intervals:',
      '    if s <= end of last block:',
      '        merge: end = max(end, e)',
      '    else: start a new block',
    ],
    map: { sort: 1, look: 2, merge: 4, fresh: 5 },
  },

  trace(t) {
    const merged: [number, number][] = []

    const view = (i: number | null, tone?: 'good' | 'active') =>
      combo(
        arr(INPUT.map(label), {
          pointers: i == null ? [] : [{ name: 'next', at: i, accent: 'a' }],
          tones: Object.fromEntries(
            INPUT.map((_, j) => [j, i != null && j < i ? 'done' : 'band']),
          ),
          showIndex: false,
          title: 'meetings, sorted by start',
        }),
        arr(merged.length ? merged.map(label) : ['—'], {
          tones: merged.length && tone ? { [merged.length - 1]: tone } : {},
          showIndex: false,
          title: 'merged blocks',
        }),
      )

    t.push({
      step: 'sort',
      note: 'Already sorted by start — that is the move that makes everything after it one-directional. The only interval that can still change is the last block.',
      view: view(null),
      vars: [],
    })

    for (let i = 0; i < INPUT.length; i++) {
      const [s, e] = INPUT[i]
      const last = merged[merged.length - 1]
      t.bump()
      if (last && s <= last[1]) {
        const grew = e > last[1]
        last[1] = Math.max(last[1], e)
        t.push({
          step: 'merge',
          note: `${label([s, e])} starts at ${s}, before the open block ends at ${last[1] === e && grew ? '…' : last[1]} — they overlap, so they are one meeting. ${grew ? `The block stretches to ${last[1]}.` : 'The block already covers it.'}`,
          view: view(i, 'active'),
          vars: [
            ['next', label([s, e]), 'a'],
            ['block', label(last), 'ok'],
          ],
          badge: { text: `merged → ${label(last)}`, accent: 'c' },
        })
      } else {
        merged.push([s, e])
        t.push({
          step: 'fresh',
          note: `${label([s, e])} starts after ${last ? `the block ends (${last[1]} < ${s})` : 'nothing'} — ${last ? 'that block is finished forever; nothing later can touch it.' : 'it opens the first block.'}`,
          view: view(i, 'good'),
          vars: [['block', label([s, e]), 'ok']],
          badge: { text: `new block ${label([s, e])}`, accent: 'ok' },
        })
      }
    }

    t.push({
      step: 'look',
      note: `${INPUT.length} meetings became ${merged.length} blocks in one pass. Sort once, sweep once — O(n log n) total, and the sort dominates.`,
      view: view(null),
      vars: [['blocks', merged.map(label).join('  '), 'ok']],
      badge: { text: `${merged.length} blocks`, accent: 'ok' },
    })
  },

  ramp: [
    'meeting-rooms',
    'merge-intervals',
    'insert-interval',
    'non-overlapping-intervals',
    'meeting-rooms-ii',
  ],
}
