import type { Problem } from '@/lib/types'

export const designPhoneDirectory: Problem = {
  id: 'design-phone-directory',
  title: 'Design Phone Directory',
  group: 'Medium',
  pattern: 'Design',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/design-phone-directory/',
  statement:
    'Design a `PhoneDirectory` over `maxNumbers` slots. `get()` hands out any free number or `-1`, `check(number)` reports whether a slot is free, and `release(number)` returns one to the pool. A set of free slots — or a queue plus a boolean array — keeps all three operations `O(1)`.',
  constraints: [
    '1 <= maxNumbers <= 10^4',
    '0 <= number < maxNumbers',
    'At most 2 * 10^4 calls are made to get, check and release',
  ],
}
