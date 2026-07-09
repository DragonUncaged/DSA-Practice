import type { Problem } from '@/lib/types'

export const designHitCounter: Problem = {
  id: 'design-hit-counter',
  title: 'Design Hit Counter',
  group: 'Medium',
  pattern: 'Design',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/design-hit-counter/',
  statement:
    'Design a `HitCounter` that reports how many hits landed in the last 300 seconds. `hit(timestamp)` records one and `getHits(timestamp)` counts those still inside the window. Timestamps arrive in non-decreasing order, so a queue of `(timestamp, count)` pairs only ever has to drop entries from the front.',
  constraints: [
    '1 <= timestamp <= 2 * 10^9',
    'Timestamps arrive in non-decreasing order',
    'At most 300 calls are made to hit and getHits',
  ],
}
