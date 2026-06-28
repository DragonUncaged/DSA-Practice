import type { Problem } from '@/lib/types'

export const threeSumSmaller: Problem = {
  id: '3sum-smaller',
  title: '3Sum Smaller',
  group: 'Medium',
  pattern: 'Two Pointers',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/3sum-smaller/',
  statement:
    'Given an array `nums` and an integer `target`, count the index triplets `i < j < k` whose three values sum to less than `target`.',
  constraints: ['0 <= nums.length <= 3500', '-100 <= nums[i] <= 100', '-100 <= target <= 100'],
  signature: {
    fn: 'threeSumSmaller',
    params: [
      { name: 'nums', type: 'int[]' },
      { name: 'target', type: 'int' },
    ],
    ret: 'int',
  },
  tests: [
    { args: [[-2, 0, 1, 3], 2], expect: 2, note: '[-2,0,1] and [-2,0,3]' },
    { args: [[], 0], expect: 0, note: 'empty' },
    { args: [[0], 0], expect: 0, note: 'fewer than three numbers' },
    { args: [[0, 0, 0], 1], expect: 1, note: 'the only triplet' },
    { args: [[0, 0, 0], 0], expect: 0, note: 'strictly less than' },
    { args: [[3, 1, 0, -2], 4], expect: 3 },
  ],
  demo: [[-2, 0, 1, 3], 2],
  scale: (n) => [Array.from({ length: n }, (_, i) => (i % 41) - 20), 0],
  starter: {
    js: `function threeSumSmaller(nums, target) {
  // nums: number[], target: number  ->  number
}
`,
    cpp: `int threeSumSmaller(vector<int>& nums, int target) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'sort-two-pointer',
      label: 'Sort, then close a pair around each anchor',
      kind: 'optimal',
      time: 'O(n^2)',
      space: 'O(1)',
      blurb:
        'Sort first. With `i` fixed, if `nums[i] + nums[lo] + nums[hi]` is already under the target then every index between `lo` and `hi` works with `lo` — that is `hi - lo` triplets at once. Otherwise the sum is too big and only `hi` can move down.',
      code: {
        cpp: {
          lines: [
            'int threeSumSmaller(vector<int>& nums, int target) {',
            '    sort(nums.begin(), nums.end());',
            '    int n = nums.size(), count = 0;',
            '    for (int i = 0; i + 2 < n; ++i) {',
            '        int lo = i + 1, hi = n - 1;',
            '        while (lo < hi) {',
            '            if (nums[i] + nums[lo] + nums[hi] < target) {',
            '                count += hi - lo;',
            '                ++lo;',
            '            } else {',
            '                --hi;',
            '            }',
            '        }',
            '    }',
            '    return count;',
            '}',
          ],
        },
        js: {
          lines: [
            'function threeSumSmaller(nums, target) {',
            '  nums.sort((a, b) => a - b);',
            '  let count = 0;',
            '  for (let i = 0; i + 2 < nums.length; i++) {',
            '    let lo = i + 1;',
            '    let hi = nums.length - 1;',
            '    while (lo < hi) {',
            '      if (nums[i] + nums[lo] + nums[hi] < target) {',
            '        count += hi - lo;',
            '        lo++;',
            '      } else {',
            '        hi--;',
            '      }',
            '    }',
            '  }',
            '  return count;',
            '}',
          ],
        },
      },

      run([nums, target]: [number[], number], c) {
        const a = [...nums].sort((x, y) => x - y)
        let count = 0
        for (let i = 0; i + 2 < a.length; i++) {
          let lo = i + 1
          let hi = a.length - 1
          while (lo < hi) {
            c.ops++
            if (a[i] + a[lo] + a[hi] < target) {
              count += hi - lo
              lo++
            } else {
              hi--
            }
          }
        }
        return count
      },
    },
  ],
}
