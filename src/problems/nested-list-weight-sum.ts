import type { Problem } from '@/lib/types'

export const nestedListWeightSum: Problem = {
  id: 'nested-list-weight-sum',
  title: 'Nested List Weight Sum',
  group: 'Medium',
  pattern: 'Design',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/nested-list-weight-sum/',
  statement:
    "A `NestedInteger` is either a single integer or a list of `NestedInteger`s, and an integer's depth is how many lists enclose it. Given `nestedList`, return the sum of every integer multiplied by its depth. For `[[1,1],2,[1,1]]` that is `1*2 + 1*2 + 2*1 + 1*2 + 1*2 = 10`.",
  constraints: [
    '1 <= nestedList.length <= 50',
    'Integers are in the range [-100, 100]',
    'The maximum depth is at most 50',
  ],
}
