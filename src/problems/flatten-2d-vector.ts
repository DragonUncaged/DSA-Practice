import type { Problem } from '@/lib/types'

export const flatten2DVector: Problem = {
  id: 'flatten-2d-vector',
  title: 'Flatten 2D Vector',
  group: 'Medium',
  pattern: 'Design',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/flatten-2d-vector/',
  statement:
    'Design a `Vector2D` iterator over a 2D array. `next()` returns the next element and advances, and `hasNext()` says whether one is left. Flattening the whole thing up front defeats the point — hold an outer and an inner index, and let `hasNext` skip past however many empty rows sit in front of the cursor.',
  constraints: [
    '0 <= vec.length <= 200',
    '0 <= vec[i].length <= 500',
    '-500 <= vec[i][j] <= 500',
    'At most 10^5 calls are made to next and hasNext',
  ],
}
