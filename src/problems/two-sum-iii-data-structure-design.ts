import type { Problem } from '@/lib/types'

export const twoSumIII: Problem = {
  id: 'two-sum-iii-data-structure-design',
  title: 'Two Sum III - Data structure design',
  group: 'Easy',
  pattern: 'Design',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/two-sum-iii-data-structure-design/',
  statement:
    'Design a `TwoSum` class over a stream of integers. `add(number)` stores a number and `find(value)` returns whether any two stored numbers sum to `value`. A count per distinct number is enough: `find` then walks the keys and asks whether the complement is present, taking care that a number pairs with itself only when it was added twice.',
  constraints: [
    '-10^5 <= number <= 10^5',
    '-2^31 <= value <= 2^31 - 1',
    'At most 10^4 calls are made to add and find',
  ],
}
