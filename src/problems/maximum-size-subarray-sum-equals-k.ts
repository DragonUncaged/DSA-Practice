import type { Problem } from '@/lib/types'

export const maximumSizeSubarraySumEqualsK: Problem = {
  id: 'maximum-size-subarray-sum-equals-k',
  title: 'Maximum Size Subarray Sum Equals k',
  group: 'Medium',
  pattern: 'Prefix Sum',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/maximum-size-subarray-sum-equals-k/',
  statement:
    'Given an array `nums` and an integer `k`, return the length of the longest subarray that sums to exactly `k`, or `0` when there is none.',
  constraints: [
    '1 <= nums.length <= 2 * 10^5',
    '-10^4 <= nums[i] <= 10^4',
    '-10^9 <= k <= 10^9',
  ],
  signature: {
    fn: 'maxSubArrayLen',
    params: [
      { name: 'nums', type: 'int[]' },
      { name: 'k', type: 'int' },
    ],
    ret: 'int',
  },
  tests: [
    { args: [[1, -1, 5, -2, 3], 3], expect: 4, note: '[1, -1, 5, -2]' },
    { args: [[-2, -1, 2, 1], 1], expect: 2, note: '[-1, 2]' },
    { args: [[1], 1], expect: 1, note: 'single element' },
    { args: [[1], 0], expect: 0, note: 'no subarray sums to k' },
    { args: [[0, 0, 0], 0], expect: 3, note: 'the earliest prefix wins' },
    { args: [[1, 2, 3], 7], expect: 0 },
  ],
  demo: [[1, -1, 5, -2, 3], 3],
  scale: (n) => [Array.from({ length: n }, (_, i) => (i % 7) - 3), 3],
  starter: {
    js: `function maxSubArrayLen(nums, k) {
  // nums: number[], k: number  ->  number
}
`,
    cpp: `int maxSubArrayLen(vector<int>& nums, int k) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'prefix-first-seen',
      label: 'Prefix sums, remembering the earliest index',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'A subarray sums to `k` exactly when two prefix sums differ by `k`. Store the first index at which each prefix sum appeared — first, because the earliest match gives the longest span — and seed the map with sum `0` before the array starts.',
      code: {
        cpp: {
          lines: [
            'int maxSubArrayLen(vector<int>& nums, int k) {',
            '    unordered_map<long long, int> firstAt{{0, -1}};',
            '    long long sum = 0;',
            '    int best = 0;',
            '',
            '    for (int i = 0; i < (int)nums.size(); ++i) {',
            '        sum += nums[i];',
            '        auto it = firstAt.find(sum - k);',
            '        if (it != firstAt.end()) best = max(best, i - it->second);',
            '        if (!firstAt.count(sum)) firstAt[sum] = i;',
            '    }',
            '    return best;',
            '}',
          ],
        },
        js: {
          lines: [
            'function maxSubArrayLen(nums, k) {',
            '  const firstAt = new Map([[0, -1]]);',
            '  let sum = 0;',
            '  let best = 0;',
            '',
            '  for (let i = 0; i < nums.length; i++) {',
            '    sum += nums[i];',
            '    if (firstAt.has(sum - k)) best = Math.max(best, i - firstAt.get(sum - k));',
            '    if (!firstAt.has(sum)) firstAt.set(sum, i);',
            '  }',
            '  return best;',
            '}',
          ],
        },
      },

      run([nums, k]: [number[], number], c) {
        const firstAt = new Map<number, number>([[0, -1]])
        let sum = 0
        let best = 0
        for (let i = 0; i < nums.length; i++) {
          c.ops++
          sum += nums[i]
          if (firstAt.has(sum - k)) best = Math.max(best, i - firstAt.get(sum - k)!)
          if (!firstAt.has(sum)) firstAt.set(sum, i)
        }
        return best
      },
    },
  ],
}
