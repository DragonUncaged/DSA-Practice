import { arr, combo, mapOf } from '@/lib/types'
import type { PatternIntro } from './index'

const NUMS = [4, 7, 2, 5, 7, 9]

export const hashing: PatternIntro = {
  id: 'hashing',
  name: 'Hashing',
  tagline: 'Trade a little memory for an O(1) answer to "have I seen this before?"',
  story: [
    'Almost every brute force that rescans the array is really asking one question over and over: *have I met this value already?* A hash set answers that in constant time. Walk the input once, and for each element ask the set before adding to it — the nested loop disappears.',
    'The upgrade from set to map is remembering *something about* what you saw: the index where it lived (Two Sum), how many times it occurred (anagrams), the group it belongs to (Group Anagrams keys by sorted letters). The pattern is always the same two beats: ask, then record.',
    'The habit to build: when you catch yourself writing a second loop that searches for a partner, a duplicate, or a count — stop and ask what single fact per element, stored in a map, would let one loop do it all.',
  ],
  signals: [
    'The inner loop exists only to find a match, partner, or count for the outer element.',
    'You need "seen before?", "where was it?", or "how many times?" in O(1).',
    'Grouping by a computable key: sorted letters, remainder, coordinates.',
    'Order does not matter for the question being asked, only membership or frequency.',
  ],
  pseudo: {
    lines: [
      'seen = empty set',
      'for x in nums:',
      '    if x in seen: duplicate!',
      '    seen.add(x)',
      'no duplicate',
    ],
    map: { init: 1, hit: 3, miss: 4, done: 5 },
  },

  trace(t) {
    const seen: number[] = []

    const view = (i: number | null, tone?: 'good' | 'bad') =>
      combo(
        arr(NUMS, {
          pointers: i == null ? [] : [{ name: 'x', at: i, accent: 'a' }],
          tones: i != null && tone ? { [i]: tone } : {},
          title: 'nums — is any value repeated?',
        }),
        mapOf(
          seen.map((k) => ({ k, tone: tone === 'good' && k === NUMS[i!] ? 'good' : 'band' })),
          { asSet: true, title: 'seen' },
        ),
      )

    t.push({
      step: 'init',
      note: 'The set starts empty. One pass: each element either trips over the set or joins it.',
      view: view(null),
      vars: [],
    })

    for (let i = 0; i < NUMS.length; i++) {
      const x = NUMS[i]
      t.bump()
      if (seen.includes(x)) {
        t.push({
          step: 'hit',
          note: `${x} is already in the set — a brute force would have re-scanned ${i} elements to learn this; the set answered in one look.`,
          view: view(i, 'good'),
          vars: [
            ['x', x, 'a'],
            ['in seen?', 'yes', 'ok'],
          ],
          badge: { text: `duplicate: ${x}`, accent: 'ok' },
        })
        return
      }
      t.push({
        step: 'miss',
        note: `${x} is new — record it and move on. Ask, then record: that is the whole pattern.`,
        view: view(i),
        vars: [
          ['x', x, 'a'],
          ['in seen?', 'no'],
        ],
      })
      seen.push(x)
    }
  },

  ramp: [
    'contains-duplicate',
    'valid-anagram',
    'two-sum',
    'group-anagrams',
    'longest-consecutive-sequence',
    'encode-and-decode-strings',
  ],
}
