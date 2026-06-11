import type { Problem } from '@/lib/types'

export const subarraySumEqualsK: Problem = {
  id: 'subarray-sum-equals-k',
  title: 'Subarray Sum Equals K',
  group: 'Array',
  pattern: 'Prefix Sum + Hash Map',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/subarray-sum-equals-k/',
  statement:
    'Given an integer array `nums` and an integer `k`, return the number of contiguous subarrays whose sum is exactly `k`. Values may be negative, so a growing window is not enough.',
  constraints: ['1 <= nums.length <= 2 * 10^4', '-1000 <= nums[i] <= 1000', 'Values may be negative'],
  signature: {
    fn: 'subarraySum',
    params: [
      { name: 'nums', type: 'int[]' },
      { name: 'k', type: 'int' },
    ],
    ret: 'int',
  },
  tests: [
    { args: [[1, 1, 1], 2], expect: 2 },
    { args: [[1, 2, 3], 3], expect: 2 },
    { args: [[1, -1, 0], 0], expect: 3, note: 'negatives and zeros both count' },
    { args: [[3], 3], expect: 1 },
    { args: [[1, 2, 3], 7], expect: 0, note: 'no subarray reaches k' },
  ],
  demo: [[1, 2, 3], 3],
  scale: (n) => [Array.from({ length: n }, (_, i) => (i % 5) - 2), 3],
  starter: {
    js: `function subarraySum(nums, k) {
  // nums: number[], k: number  ->  number
}
`,
    cpp: `int subarraySum(vector<int>& nums, int k) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'prefix-count',
      label: 'Count prefix sums seen before',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'A subarray sums to k exactly when two prefix sums differ by k. So carry the running prefix and, at each position, ask how many earlier prefixes equal `prefix - k` — each one marks a distinct subarray ending here. Seeding the map with `{0: 1}` accounts for subarrays that start at index 0.',
      code: {
        cpp: {
          lines: [
            'int subarraySum(vector<int>& nums, int k) {',
            '    unordered_map<int, int> seen{{0, 1}};',
            '    int prefix = 0, total = 0;',
            '    for (int x : nums) {',
            '        prefix += x;',
            '        auto it = seen.find(prefix - k);',
            '        if (it != seen.end()) total += it->second;',
            '        seen[prefix]++;',
            '    }',
            '    return total;',
            '}',
          ],
        },
        js: {
          lines: [
            'function subarraySum(nums, k) {',
            '  const seen = new Map([[0, 1]]);',
            '  let prefix = 0, total = 0;',
            '  for (const x of nums) {',
            '    prefix += x;',
            '    total += seen.get(prefix - k) ?? 0;',
            '    seen.set(prefix, (seen.get(prefix) ?? 0) + 1);',
            '  }',
            '  return total;',
            '}',
          ],
        },
      },

      run([nums, k]: [number[], number], c) {
        const seen = new Map<number, number>([[0, 1]])
        let prefix = 0
        let total = 0
        for (const x of nums) {
          c.ops++
          prefix += x
          total += seen.get(prefix - k) ?? 0
          seen.set(prefix, (seen.get(prefix) ?? 0) + 1)
        }
        return total
      },
    },
  ],
}
