import type { Problem } from '@/lib/types'

export const nestedListWeightSumII: Problem = {
  id: 'nested-list-weight-sum-ii',
  title: 'Nested List Weight Sum II',
  group: 'Medium',
  pattern: 'Design',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/nested-list-weight-sum-ii/',
  statement:
    'Same `NestedInteger` structure as Nested List Weight Sum, but the weights are inverted: an integer at depth `d` counts `maxDepth - d + 1` times, so the deepest integers weigh least. For `[[1,1],2,[1,1]]` that is `1 + 1 + 2*2 + 1 + 1 = 8`.',
  constraints: [
    '1 <= nestedList.length <= 50',
    'Integers are in the range [-100, 100]',
    'The maximum depth is at most 50',
  ],
}
