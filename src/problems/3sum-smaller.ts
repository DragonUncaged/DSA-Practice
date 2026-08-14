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
    { args: [[-100, -100, -100], -100], expect: 1, note: 'the most negative values allowed' },
    { args: [[100, 100, 100], 100], expect: 0, note: 'the largest values, nothing qualifies' },
    { args: [[1, 1, 1, 1, 1], 4], expect: 10, note: 'duplicates: every one of the C(5,3) triplets' },
    { args: [[-1, -1, 0, 0, 1, 1], 0], expect: 6, note: 'two of each: (-1,-1,0), (-1,-1,1) and (-1,0,0) twice over' },
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
      id: 'every-triplet',
      label: 'Check every triplet',
      kind: 'brute',
      time: 'O(n^3)',
      space: 'O(1)',
      blurb:
        'Three nested loops over `i < j < k`, counting the sums that fall under the target. The definition of the problem written out as code — and cubic, which at 3500 elements is over seven billion additions.',
      code: {
        cpp: {
          lines: [
            'int threeSumSmaller(vector<int>& nums, int target) {',
            '    int n = nums.size(), count = 0;',
            '    for (int i = 0; i < n; ++i)',
            '        for (int j = i + 1; j < n; ++j)',
            '            for (int k = j + 1; k < n; ++k)',
            '                if (nums[i] + nums[j] + nums[k] < target) ++count;',
            '    return count;',
            '}',
          ],
        },
        js: {
          lines: [
            'function threeSumSmaller(nums, target) {',
            '  let count = 0;',
            '  for (let i = 0; i < nums.length; i++) {',
            '    for (let j = i + 1; j < nums.length; j++) {',
            '      for (let k = j + 1; k < nums.length; k++) {',
            '        if (nums[i] + nums[j] + nums[k] < target) count++;',
            '      }',
            '    }',
            '  }',
            '  return count;',
            '}',
          ],
        },
      },

      run([nums, target]: [number[], number], c) {
        if (nums.length > 700) throw new Error('too slow')
        let count = 0
        for (let i = 0; i < nums.length; i++) {
          for (let j = i + 1; j < nums.length; j++) {
            for (let k = j + 1; k < nums.length; k++) {
              c.ops++
              if (nums[i] + nums[j] + nums[k] < target) count++
            }
          }
        }
        return count
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'sort-binary-search',
      label: 'Sort, fix a pair, binary search the third',
      kind: 'better',
      time: 'O(n^2 log n)',
      space: 'O(1)',
      blurb:
        'Once the array is sorted, every `k` beyond `j` whose value stays under `target - nums[i] - nums[j]` forms a valid triplet, and those `k` are a prefix of the tail. Binary search for where that prefix ends and add its length, replacing the innermost loop with a logarithmic probe.',
      code: {
        cpp: {
          lines: [
            'int threeSumSmaller(vector<int>& nums, int target) {',
            '    sort(nums.begin(), nums.end());',
            '    int n = nums.size(), count = 0;',
            '    for (int i = 0; i < n; ++i) {',
            '        for (int j = i + 1; j < n; ++j) {',
            '            int need = target - nums[i] - nums[j];',
            '            auto stop = lower_bound(nums.begin() + j + 1, nums.end(), need);',
            '            count += stop - (nums.begin() + j + 1);',
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
            '  for (let i = 0; i < nums.length; i++) {',
            '    for (let j = i + 1; j < nums.length; j++) {',
            '      // first k > j with nums[k] >= need; everything before it counts',
            '      const need = target - nums[i] - nums[j];',
            '      let lo = j + 1;',
            '      let hi = nums.length;',
            '      while (lo < hi) {',
            '        const mid = (lo + hi) >> 1;',
            '        if (nums[mid] < need) lo = mid + 1;',
            '        else hi = mid;',
            '      }',
            '      count += lo - (j + 1);',
            '    }',
            '  }',
            '  return count;',
            '}',
          ],
        },
      },

      run([nums, target]: [number[], number], c) {
        nums.sort((a, b) => a - b)
        let count = 0
        for (let i = 0; i < nums.length; i++) {
          for (let j = i + 1; j < nums.length; j++) {
            c.ops++
            const need = target - nums[i] - nums[j]
            let lo = j + 1
            let hi = nums.length
            while (lo < hi) {
              c.ops++
              const mid = (lo + hi) >> 1
              if (nums[mid] < need) lo = mid + 1
              else hi = mid
            }
            count += lo - (j + 1)
          }
        }
        return count
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'sort-two-pointer',
      label: 'Sort, then close a pair around each anchor',
      kind: 'optimal',
      time: 'O(n^2)',
      space: 'O(1)',
      blurb:
        'The binary search still starts fresh for every `j`. With `i` fixed, close two pointers instead: if `nums[i] + nums[lo] + nums[hi]` is already under the target then every index between `lo` and `hi` works with `lo` — that is `hi - lo` triplets at once. Otherwise the sum is too big and only `hi` can move down. Each anchor costs one linear sweep.',
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
