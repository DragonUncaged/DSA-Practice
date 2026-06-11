import type { Problem } from '@/lib/types'

export const maximumAverageSubarray: Problem = {
  id: 'maximum-average-subarray',
  title: 'Maximum Average Subarray',
  group: 'Array',
  pattern: 'Sliding Window',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/maximum-average-subarray-i/',
  statement:
    'Given an integer array `nums` and an integer `k`, find the contiguous subarray of length exactly `k` with the largest average, and return that average.',
  constraints: ['1 <= k <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
  signature: {
    fn: 'findMaxAverage',
    params: [
      { name: 'nums', type: 'int[]' },
      { name: 'k', type: 'int' },
    ],
    ret: 'double',
  },
  tests: [
    { args: [[1, 12, -5, -6, 50, 3], 4], expect: 12.75 },
    { args: [[5], 1], expect: 5 },
    { args: [[0, 1, 1, 3, 3], 4], expect: 2, note: 'the best window is the last one' },
    { args: [[-1, -2], 1], expect: -1, note: 'all negative' },
  ],
  demo: [[1, 12, -5, -6, 50, 3], 4],
  scale: (n) => [Array.from({ length: n }, (_, i) => (i % 17) - 8), Math.max(1, n >> 3)],
  starter: {
    js: `function findMaxAverage(nums, k) {
  // nums: number[], k: number  ->  number
}
`,
    cpp: `double findMaxAverage(vector<int>& nums, int k) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'fixed-window',
      label: 'Slide a window of fixed width',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'Every window has the same width, so the largest average is the largest sum — divide once at the end. Sum the first k values, then move the window one step at a time, adding the value that enters and subtracting the one that leaves, so each step costs two operations instead of k.',
      code: {
        cpp: {
          lines: [
            'double findMaxAverage(vector<int>& nums, int k) {',
            '    double sum = 0;',
            '    for (int i = 0; i < k; ++i) sum += nums[i];',
            '    double best = sum;',
            '    for (int i = k; i < (int)nums.size(); ++i) {',
            '        sum += nums[i] - nums[i - k];',
            '        best = max(best, sum);',
            '    }',
            '    return best / k;',
            '}',
          ],
        },
        js: {
          lines: [
            'function findMaxAverage(nums, k) {',
            '  let sum = 0;',
            '  for (let i = 0; i < k; i++) sum += nums[i];',
            '  let best = sum;',
            '  for (let i = k; i < nums.length; i++) {',
            '    sum += nums[i] - nums[i - k];',
            '    best = Math.max(best, sum);',
            '  }',
            '  return best / k;',
            '}',
          ],
        },
      },

      run([nums, k]: [number[], number], c) {
        let sum = 0
        for (let i = 0; i < k; i++) {
          c.ops++
          sum += nums[i]
        }
        let best = sum
        for (let i = k; i < nums.length; i++) {
          c.ops++
          sum += nums[i] - nums[i - k]
          best = Math.max(best, sum)
        }
        return best / k
      },
    },
  ],
}
