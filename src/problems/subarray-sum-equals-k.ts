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
    { args: [[0, 0, 0, 0], 0], expect: 10, note: 'every subarray of zeros sums to zero' },
    { args: [[-1, -1, 1], -2], expect: 1, note: 'a negative target' },
    { args: [[1, 2, 1, 2, 1], 3], expect: 4, note: 'overlapping subarrays each count once' },
    { args: [[1000, -1000, 1000], 1000], expect: 3, note: 'the value bounds' },
    {
      args: [Array.from({ length: 20000 }, (_, i) => (i % 2 ? -1 : 1)), 0],
      expect: 100000000,
      note: 'the longest input: every even-length subarray sums to zero',
    },
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
      id: 'every-subarray',
      label: 'Sum every subarray from scratch',
      kind: 'brute',
      time: 'O(n^3)',
      space: 'O(1)',
      blurb:
        'A subarray is a start and an end, so try every pair and add up the values between them. Nothing is remembered between pairs, which is the weakness: the sum of `[i, j]` is recomputed even though `[i, j - 1]` was just summed, and with twenty thousand elements the cube of that is out of reach.',
      code: {
        cpp: {
          lines: [
            'int subarraySum(vector<int>& nums, int k) {',
            '    int n = nums.size(), total = 0;',
            '    for (int i = 0; i < n; ++i)',
            '        for (int j = i; j < n; ++j) {',
            '            long long sum = 0;',
            '            for (int t = i; t <= j; ++t) sum += nums[t];',
            '            if (sum == k) total++;',
            '        }',
            '    return total;',
            '}',
          ],
        },
        js: {
          lines: [
            'function subarraySum(nums, k) {',
            '  let total = 0;',
            '  for (let i = 0; i < nums.length; i++)',
            '    for (let j = i; j < nums.length; j++) {',
            '      let sum = 0;',
            '      for (let t = i; t <= j; t++) sum += nums[t];',
            '      if (sum === k) total++;',
            '    }',
            '  return total;',
            '}',
          ],
        },
      },
      run([nums, k]: [number[], number], c) {
        if (nums.length > 600) throw new Error('too slow: cubic in the array length')
        let total = 0
        for (let i = 0; i < nums.length; i++)
          for (let j = i; j < nums.length; j++) {
            let sum = 0
            for (let t = i; t <= j; t++) {
              c.ops++
              sum += nums[t]
            }
            if (sum === k) total++
          }
        return total
      },
    },
    {
      id: 'running-sum',
      label: 'Extend each start with a running sum',
      kind: 'better',
      time: 'O(n^2)',
      space: 'O(1)',
      blurb:
        'Fix the start and let the end walk right, adding one value at a time: the sum of `[i, j]` is the sum of `[i, j - 1]` plus one element, so the innermost loop disappears. Every subarray is still visited, which is why it stays quadratic, but each one now costs a single addition.',
      code: {
        cpp: {
          lines: [
            'int subarraySum(vector<int>& nums, int k) {',
            '    int n = nums.size(), total = 0;',
            '    for (int i = 0; i < n; ++i) {',
            '        long long sum = 0;',
            '        for (int j = i; j < n; ++j) {',
            '            sum += nums[j];',
            '            if (sum == k) total++;',
            '        }',
            '    }',
            '    return total;',
            '}',
          ],
        },
        js: {
          lines: [
            'function subarraySum(nums, k) {',
            '  let total = 0;',
            '  for (let i = 0; i < nums.length; i++) {',
            '    let sum = 0;',
            '    for (let j = i; j < nums.length; j++) {',
            '      sum += nums[j];',
            '      if (sum === k) total++;',
            '    }',
            '  }',
            '  return total;',
            '}',
          ],
        },
      },
      run([nums, k]: [number[], number], c) {
        let total = 0
        for (let i = 0; i < nums.length; i++) {
          let sum = 0
          for (let j = i; j < nums.length; j++) {
            c.ops++
            sum += nums[j]
            if (sum === k) total++
          }
        }
        return total
      },
    },
    {
      id: 'prefix-count',
      label: 'Count prefix sums seen before',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'Visiting every subarray is the remaining waste. A subarray sums to k exactly when two prefix sums differ by k, so carry the running prefix and, at each position, ask how many earlier prefixes equal `prefix - k` — each one marks a distinct subarray ending here, counted without being walked. Seeding the map with `{0: 1}` accounts for subarrays that start at index 0.',
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
