import type { Problem } from '@/lib/types'

export const zigzagIterator: Problem = {
  id: 'zigzag-iterator',
  title: 'Zigzag Iterator',
  group: 'Medium',
  pattern: 'Design',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/zigzag-iterator/',
  statement:
    'Design a `ZigzagIterator` over two integer lists `v1` and `v2` that returns their elements alternately, falling back to whichever list still has elements once the other runs out. Holding a queue of the still-unfinished lists rather than two indices makes the follow-up — `k` lists instead of two — fall out for free.',
  constraints: [
    '0 <= v1.length, v2.length <= 1000',
    '1 <= v1.length + v2.length <= 2000',
    '-2^31 <= v1[i], v2[i] <= 2^31 - 1',
  ],
}
