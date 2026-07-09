import type { Problem } from '@/lib/types'

export const movingAverageFromDataStream: Problem = {
  id: 'moving-average-from-data-stream',
  title: 'Moving Average from Data Stream',
  group: 'Easy',
  pattern: 'Design',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/moving-average-from-data-stream/',
  statement:
    'Design a `MovingAverage` class over a stream of integers. `MovingAverage(size)` fixes the window width and `next(val)` returns the average of the last `size` values seen so far. A queue plus a running total keeps every call `O(1)`: add the new value, and drop the oldest once the window is full.',
  constraints: [
    '1 <= size <= 1000',
    '-10^5 <= val <= 10^5',
    'At most 10^4 calls are made to next',
  ],
}
