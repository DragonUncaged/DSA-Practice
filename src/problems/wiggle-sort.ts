import type { Problem } from '@/lib/types'

export const wiggleSort: Problem = {
  id: 'wiggle-sort',
  title: 'Wiggle Sort',
  group: 'Medium',
  pattern: 'Greedy',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/wiggle-sort/',
  statement:
    'Reorder `nums` in place so that `nums[0] <= nums[1] >= nums[2] <= nums[3] ...`, and return it. Any arrangement that satisfies the pattern is accepted; the tests here follow the single-pass swap below.',
  constraints: [
    '1 <= nums.length <= 5 * 10^4',
    '0 <= nums[i] <= 10^4',
    'A valid answer is guaranteed to exist',
  ],
  signature: { fn: 'wiggleSort', params: [{ name: 'nums', type: 'int[]' }], ret: 'int[]' },
  tests: [
    { args: [[3, 5, 2, 1, 6, 4]], expect: [3, 5, 1, 6, 2, 4] },
    { args: [[6, 6, 5, 6, 3, 8]], expect: [6, 6, 5, 6, 3, 8], note: 'already wiggling' },
    { args: [[1]], expect: [1], note: 'single element' },
    { args: [[2, 1]], expect: [1, 2], note: 'one swap' },
    { args: [[1, 2, 3]], expect: [1, 3, 2] },
    { args: [[4, 4, 4, 4]], expect: [4, 4, 4, 4], note: 'all equal' },
    { args: [[5, 4, 3, 2, 1]], expect: [4, 5, 2, 3, 1], note: 'strictly decreasing input' },
    { args: [[0, 10000]], expect: [0, 10000], note: 'the extremes of the value range' },
  ],
  demo: [[3, 5, 2, 1, 6, 4]],
  scale: (n) => [Array.from({ length: n }, (_, i) => (i * 37) % 101)],
  starter: {
    js: `function wiggleSort(nums) {
  // nums: number[]  ->  number[]
}
`,
    cpp: `vector<int> wiggleSort(vector<int>& nums) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'local-swap',
      label: 'Fix each violation as you meet it',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'Sorting and then swapping neighbours in pairs also works, but it costs `O(n log n)` and produces a different valid arrangement from the one these tests pin down, so this single pass is the one shown. Walk left to right and, whenever a neighbouring pair points the wrong way, swap it. The swap can only improve the pair behind it too, so one pass leaves the whole array wiggling.',
      code: {
        cpp: {
          lines: [
            'vector<int> wiggleSort(vector<int>& nums) {',
            '    for (size_t i = 1; i < nums.size(); ++i) {',
            '        bool wantUp = i % 2 == 1;',
            '        if (wantUp ? nums[i] < nums[i - 1] : nums[i] > nums[i - 1]) {',
            '            swap(nums[i], nums[i - 1]);',
            '        }',
            '    }',
            '    return nums;',
            '}',
          ],
        },
        js: {
          lines: [
            'function wiggleSort(nums) {',
            '  for (let i = 1; i < nums.length; i++) {',
            '    const wantUp = i % 2 === 1;',
            '    if (wantUp ? nums[i] < nums[i - 1] : nums[i] > nums[i - 1]) {',
            '      [nums[i], nums[i - 1]] = [nums[i - 1], nums[i]];',
            '    }',
            '  }',
            '  return nums;',
            '}',
          ],
        },
      },

      run([nums]: [number[]], c) {
        for (let i = 1; i < nums.length; i++) {
          c.ops++
          const wantUp = i % 2 === 1
          if (wantUp ? nums[i] < nums[i - 1] : nums[i] > nums[i - 1]) {
            const t = nums[i]
            nums[i] = nums[i - 1]
            nums[i - 1] = t
          }
        }
        return nums
      },
    },
  ],
}
