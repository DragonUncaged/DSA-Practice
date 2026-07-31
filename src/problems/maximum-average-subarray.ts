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
    { args: [[4, 0, 4, 3, 3], 5], expect: 2.8, note: 'the window is the whole array' },
    { args: [[3, 3, 4, 3, 3], 2], expect: 3.5, note: 'two windows tie' },
    { args: [[-10000, 10000, -10000], 2], expect: 0, note: 'the value bounds' },
    {
      args: [Array.from({ length: 5000 }, (_, i) => (i === 2500 ? 100 : (i % 3) - 1)), 100],
      expect: 1.01,
      note: 'a long array with one spike',
    },
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
      id: 'sum-each-window',
      label: 'Sum every window from scratch',
      kind: 'brute',
      time: 'O(n * k)',
      space: 'O(1)',
      blurb:
        'There are `n - k + 1` windows of width k; add up each one and keep the largest sum, dividing by k only at the end. Neighbouring windows share all but two elements, and this version ignores that, so every window pays for k additions.',
      code: {
        cpp: {
          lines: [
            'double findMaxAverage(vector<int>& nums, int k) {',
            '    double best = -1e18;',
            '    for (int start = 0; start + k <= (int)nums.size(); ++start) {',
            '        double sum = 0;',
            '        for (int i = start; i < start + k; ++i) sum += nums[i];',
            '        best = max(best, sum);',
            '    }',
            '    return best / k;',
            '}',
          ],
        },
        js: {
          lines: [
            'function findMaxAverage(nums, k) {',
            '  let best = -Infinity;',
            '  for (let start = 0; start + k <= nums.length; start++) {',
            '    let sum = 0;',
            '    for (let i = start; i < start + k; i++) sum += nums[i];',
            '    best = Math.max(best, sum);',
            '  }',
            '  return best / k;',
            '}',
          ],
        },
      },
      run([nums, k]: [number[], number], c) {
        let best = -Infinity
        for (let start = 0; start + k <= nums.length; start++) {
          let sum = 0
          for (let i = start; i < start + k; i++) {
            c.ops++
            sum += nums[i]
          }
          best = Math.max(best, sum)
        }
        return best / k
      },
    },
    {
      id: 'prefix-sums',
      label: 'Prefix sums, then one subtraction per window',
      kind: 'better',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'Precompute `prefix[i]`, the sum of the first i values. The sum of any window is then one subtraction, `prefix[end] - prefix[start]`, so the inner loop is gone and the whole scan is linear. The cost is a second array as long as the input.',
      code: {
        cpp: {
          lines: [
            'double findMaxAverage(vector<int>& nums, int k) {',
            '    int n = nums.size();',
            '    vector<long long> prefix(n + 1, 0);',
            '    for (int i = 0; i < n; ++i) prefix[i + 1] = prefix[i] + nums[i];',
            '    long long best = LLONG_MIN;',
            '    for (int end = k; end <= n; ++end)',
            '        best = max(best, prefix[end] - prefix[end - k]);',
            '    return (double)best / k;',
            '}',
          ],
        },
        js: {
          lines: [
            'function findMaxAverage(nums, k) {',
            '  const prefix = [0];',
            '  for (const x of nums) prefix.push(prefix[prefix.length - 1] + x);',
            '  let best = -Infinity;',
            '  for (let end = k; end < prefix.length; end++)',
            '    best = Math.max(best, prefix[end] - prefix[end - k]);',
            '  return best / k;',
            '}',
          ],
        },
      },
      run([nums, k]: [number[], number], c) {
        const prefix = [0]
        for (const x of nums) {
          c.ops++
          prefix.push(prefix[prefix.length - 1] + x)
        }
        let best = -Infinity
        for (let end = k; end < prefix.length; end++) {
          c.ops++
          best = Math.max(best, prefix[end] - prefix[end - k])
        }
        return best / k
      },
    },
    {
      id: 'fixed-window',
      label: 'Slide a window of fixed width',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'The prefix array is more memory than the job needs. Every window has the same width, so keep one running sum and move the window one step at a time, adding the value that enters and subtracting the one that leaves; each step costs two operations and no extra array. The largest sum is the largest average — divide once at the end.',
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
