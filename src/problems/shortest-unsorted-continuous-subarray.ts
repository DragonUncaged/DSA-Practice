import type { Problem } from '@/lib/types'

export const shortestUnsortedContinuousSubarray: Problem = {
  id: 'shortest-unsorted-continuous-subarray',
  title: 'Shortest Unsorted Continuous Subarray',
  group: 'Array',
  pattern: 'Two Sweeps',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/shortest-unsorted-continuous-subarray/',
  statement:
    'Find the shortest contiguous subarray of `nums` such that sorting just that subarray leaves the whole array sorted in non-decreasing order, and return its length. Return `0` if the array is already sorted.',
  constraints: ['1 <= nums.length <= 10^4', '-10^5 <= nums[i] <= 10^5'],
  signature: {
    fn: 'findUnsortedSubarray',
    params: [{ name: 'nums', type: 'int[]' }],
    ret: 'int',
  },
  tests: [
    { args: [[2, 6, 4, 8, 10, 9, 15]], expect: 5 },
    { args: [[1, 2, 3, 4]], expect: 0, note: 'already sorted' },
    { args: [[1]], expect: 0 },
    { args: [[2, 1]], expect: 2 },
    { args: [[1, 3, 2, 2, 2]], expect: 4, note: 'equal values still need including' },
  ],
  demo: [[2, 6, 4, 8, 10, 9, 15]],
  scale: (n) => [Array.from({ length: n }, (_, i) => (i % 2 ? i : n - i))],
  starter: {
    js: `function findUnsortedSubarray(nums) {
  // nums: number[]  ->  number
}
`,
    cpp: `int findUnsortedSubarray(vector<int>& nums) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'running-extremes',
      label: 'Sweep both ways, watching the running extremes',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'Sorting a copy and comparing works but costs O(n log n). Instead, sweep right carrying the running maximum: any element below it is out of place, and the last such element is the right edge. Sweep left carrying the running minimum for the left edge. If nothing was ever out of place the array was already sorted.',
      code: {
        cpp: {
          lines: [
            'int findUnsortedSubarray(vector<int>& nums) {',
            '    int n = nums.size(), left = -1, right = -1;',
            '    int hi = INT_MIN, lo = INT_MAX;',
            '    for (int i = 0; i < n; ++i) {',
            '        hi = max(hi, nums[i]);',
            '        if (nums[i] < hi) right = i;',
            '    }',
            '    for (int i = n - 1; i >= 0; --i) {',
            '        lo = min(lo, nums[i]);',
            '        if (nums[i] > lo) left = i;',
            '    }',
            '    return right == -1 ? 0 : right - left + 1;',
            '}',
          ],
        },
        js: {
          lines: [
            'function findUnsortedSubarray(nums) {',
            '  const n = nums.length;',
            '  let left = -1, right = -1, hi = -Infinity, lo = Infinity;',
            '  for (let i = 0; i < n; i++) {',
            '    hi = Math.max(hi, nums[i]);',
            '    if (nums[i] < hi) right = i;',
            '  }',
            '  for (let i = n - 1; i >= 0; i--) {',
            '    lo = Math.min(lo, nums[i]);',
            '    if (nums[i] > lo) left = i;',
            '  }',
            '  return right === -1 ? 0 : right - left + 1;',
            '}',
          ],
        },
      },

      run([nums]: [number[]], c) {
        const n = nums.length
        let left = -1
        let right = -1
        let hi = -Infinity
        let lo = Infinity
        for (let i = 0; i < n; i++) {
          c.ops++
          hi = Math.max(hi, nums[i])
          if (nums[i] < hi) right = i
        }
        for (let i = n - 1; i >= 0; i--) {
          c.ops++
          lo = Math.min(lo, nums[i])
          if (nums[i] > lo) left = i
        }
        return right === -1 ? 0 : right - left + 1
      },
    },
  ],
}
