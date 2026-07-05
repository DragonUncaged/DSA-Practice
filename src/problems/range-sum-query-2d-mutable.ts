import type { Problem } from '@/lib/types'

export const rangeSumQuery2DMutable: Problem = {
  id: 'range-sum-query-2d-mutable',
  title: 'Range Sum Query 2D - Mutable',
  group: 'Hard',
  pattern: 'Design',
  difficulty: 'Hard',
  leetcode: 'https://leetcode.com/problems/range-sum-query-2d-mutable/',
  statement:
    'Design a `NumMatrix` class over a 2D matrix. `update(row, col, val)` writes one cell and `sumRegion(row1, col1, row2, col2)` returns the sum of a rectangle. Because updates and queries interleave, a prefix-sum table is too expensive to rebuild — a 2D binary indexed tree gives both operations in `O(log m * log n)`.',
  constraints: [
    '1 <= m, n <= 200',
    '-1000 <= matrix[i][j] <= 1000',
    '-1000 <= val <= 1000',
    '0 <= row1 <= row2 < m and 0 <= col1 <= col2 < n',
    'At most 5000 calls are made to sumRegion and update',
  ],
}
