import type { Problem } from '@/lib/types'

export const missingRanges: Problem = {
  id: 'missing-ranges',
  title: 'Missing Ranges',
  group: 'Easy',
  pattern: 'Array Scan',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/missing-ranges/',
  statement:
    'Given a sorted array of unique integers `nums` and an inclusive range `[lower, upper]` that contains them all, return the shortest sorted list of ranges `[a, b]` covering exactly the numbers in `[lower, upper]` that are absent from `nums`.',
  constraints: [
    '-10^9 <= lower <= upper <= 10^9',
    '0 <= nums.length <= 100',
    'lower <= nums[i] <= upper',
    'All values in nums are unique and sorted',
  ],
  signature: {
    fn: 'findMissingRanges',
    params: [
      { name: 'nums', type: 'int[]' },
      { name: 'lower', type: 'int' },
      { name: 'upper', type: 'int' },
    ],
    ret: 'int[][]',
  },
  tests: [
    { args: [[0, 1, 3, 50, 75], 0, 99], expect: [[2, 2], [4, 49], [51, 74], [76, 99]] },
    { args: [[-1], -1, -1], expect: [], note: 'nothing missing' },
    { args: [[], 1, 1], expect: [[1, 1]], note: 'empty nums, single-value range' },
    { args: [[], -5, 5], expect: [[-5, 5]], note: 'empty nums, whole range missing' },
    { args: [[1, 2, 3], 1, 3], expect: [], note: 'nums covers the range exactly' },
    { args: [[2], 0, 4], expect: [[0, 1], [3, 4]], note: 'a gap on each side' },
  ],
  demo: [[0, 1, 3, 50, 75], 0, 99],
  starter: {
    js: `function findMissingRanges(nums, lower, upper) {
  // nums: number[], lower: number, upper: number  ->  number[][]
}
`,
    cpp: `vector<vector<int>> findMissingRanges(vector<int>& nums, int lower, int upper) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'scan',
      label: 'Track the next number still owed',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'Keep a cursor on the smallest number not yet accounted for. Each element of `nums` closes off the gap in front of it, and whatever is left when the array runs out is one final range.',
      code: {
        cpp: {
          lines: [
            'vector<vector<int>> findMissingRanges(vector<int>& nums, int lower, int upper) {',
            '    vector<vector<int>> out;',
            '    long long next = lower;',
            '    for (int x : nums) {',
            '        if (next < x) out.push_back({(int)next, x - 1});',
            '        next = (long long)x + 1;',
            '    }',
            '    if (next <= upper) out.push_back({(int)next, upper});',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function findMissingRanges(nums, lower, upper) {',
            '  const out = [];',
            '  let next = lower;',
            '  for (const x of nums) {',
            '    if (next < x) out.push([next, x - 1]);',
            '    next = x + 1;',
            '  }',
            '  if (next <= upper) out.push([next, upper]);',
            '  return out;',
            '}',
          ],
        },
      },

      run([nums, lower, upper]: [number[], number, number], c) {
        const out: number[][] = []
        let next = lower
        for (const x of nums) {
          c.ops++
          if (next < x) out.push([next, x - 1])
          next = x + 1
        }
        if (next <= upper) out.push([next, upper])
        return out
      },
    },
  ],
}
