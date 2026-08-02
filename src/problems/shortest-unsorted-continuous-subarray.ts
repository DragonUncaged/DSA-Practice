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
    { args: [[1, 2, 3, 3, 3]], expect: 0, note: 'duplicates in order are sorted' },
    { args: [[3, 2, 1]], expect: 3, note: 'the whole array' },
    { args: [[1, 3, 5, 4, 2]], expect: 4, note: 'a small value at the end drags the left edge back' },
    { args: [[-1, -3, -2]], expect: 3, note: 'negative values' },
    {
      args: [
        (() => {
          const a = Array.from({ length: 5000 }, (_, i) => i)
          ;[a[100], a[4000]] = [a[4000], a[100]]
          return a
        })(),
      ],
      expect: 3901,
      note: 'a long sorted array with two elements swapped',
    },
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
      id: 'inversion-pairs',
      label: 'Find every out-of-order pair',
      kind: 'brute',
      time: 'O(n^2)',
      space: 'O(1)',
      blurb:
        'An element is misplaced when something smaller sits to its right. Compare every pair: the leftmost element with a smaller value after it starts the window, and the rightmost element with a larger value before it ends it. Every pair is examined, which is quadratic, though the definition it follows is the one everything else builds on.',
      code: {
        cpp: {
          lines: [
            'int findUnsortedSubarray(vector<int>& nums) {',
            '    int n = nums.size(), left = n, right = -1;',
            '    for (int i = 0; i < n; ++i)',
            '        for (int j = i + 1; j < n; ++j)',
            '            if (nums[j] < nums[i]) {',
            '                left = min(left, i);',
            '                right = max(right, j);',
            '            }',
            '    return right == -1 ? 0 : right - left + 1;',
            '}',
          ],
        },
        js: {
          lines: [
            'function findUnsortedSubarray(nums) {',
            '  let left = nums.length, right = -1;',
            '  for (let i = 0; i < nums.length; i++)',
            '    for (let j = i + 1; j < nums.length; j++)',
            '      if (nums[j] < nums[i]) {',
            '        left = Math.min(left, i);',
            '        right = Math.max(right, j);',
            '      }',
            '  return right === -1 ? 0 : right - left + 1;',
            '}',
          ],
        },
      },
      run([nums]: [number[]], c) {
        let left = nums.length
        let right = -1
        for (let i = 0; i < nums.length; i++)
          for (let j = i + 1; j < nums.length; j++) {
            c.ops++
            if (nums[j] < nums[i]) {
              left = Math.min(left, i)
              right = Math.max(right, j)
            }
          }
        return right === -1 ? 0 : right - left + 1
      },
    },
    {
      id: 'sort-and-compare',
      label: 'Sort a copy, compare from both ends',
      kind: 'better',
      time: 'O(n log n)',
      space: 'O(n)',
      blurb:
        'The sorted array is what the window must turn into, so sort a copy and find where the two disagree: the first mismatch from the left and the first from the right bound the window. No pairs at all — but the sort does more work than the answer needs, and it costs a full copy.',
      code: {
        cpp: {
          lines: [
            'int findUnsortedSubarray(vector<int>& nums) {',
            '    vector<int> sorted = nums;',
            '    sort(sorted.begin(), sorted.end());',
            '    int n = nums.size(), left = 0, right = n - 1;',
            '    while (left < n && nums[left] == sorted[left]) ++left;',
            '    while (right > left && nums[right] == sorted[right]) --right;',
            '    return right - left + 1;',
            '}',
          ],
        },
        js: {
          lines: [
            'function findUnsortedSubarray(nums) {',
            '  const sorted = nums.slice().sort((a, b) => a - b);',
            '  let left = 0, right = nums.length - 1;',
            '  while (left < nums.length && nums[left] === sorted[left]) left++;',
            '  while (right > left && nums[right] === sorted[right]) right--;',
            '  return right - left + 1;',
            '}',
          ],
        },
      },
      run([nums]: [number[]], c) {
        const sorted = nums.slice().sort((a, b) => a - b)
        c.ops += nums.length * Math.ceil(Math.log2(nums.length + 1))
        let left = 0
        let right = nums.length - 1
        while (left < nums.length && nums[left] === sorted[left]) {
          c.ops++
          left++
        }
        while (right > left && nums[right] === sorted[right]) {
          c.ops++
          right--
        }
        return right - left + 1
      },
    },
    {
      id: 'running-extremes',
      label: 'Sweep both ways, watching the running extremes',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'The sort can go: an element is out of place exactly when it is below the largest value seen before it, or above the smallest value seen after it. So sweep right carrying the running maximum — the last element below it is the right edge — and sweep left carrying the running minimum for the left edge. Two linear passes, no copy. If nothing was ever out of place the array was already sorted.',
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
