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
    { args: [[-3, 0, 4], -5, 5], expect: [[-5, -4], [-2, -1], [1, 3], [5, 5]], note: 'negative values' },
    {
      args: [[], 999999990, 1000000000],
      expect: [[999999990, 1000000000]],
      note: 'values at the top of the constraint range',
    },
  ],
  scale: (n) => [Array.from({ length: n }, (_, i) => 2 * i), 0, 2 * n],
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
      id: 'walk-every-integer',
      label: 'Test every integer in the range against a set',
      kind: 'brute',
      time: 'O(upper - lower)',
      space: 'O(n)',
      blurb:
        'Put `nums` in a set and walk every integer from `lower` to `upper`, opening a range at the first absent value and closing it at the next present one. It works, but the cost tracks the size of the range, not the array — two billion steps for a range that `nums` describes in a hundred numbers.',
      code: {
        cpp: {
          lines: [
            'vector<vector<int>> findMissingRanges(vector<int>& nums, int lower, int upper) {',
            '    unordered_set<int> present(nums.begin(), nums.end());',
            '    vector<vector<int>> out;',
            '    long long x = lower;',
            '    while (x <= upper) {',
            '        if (present.count((int)x)) { ++x; continue; }',
            '        long long start = x;',
            '        while (x <= upper && !present.count((int)x)) ++x;',
            '        out.push_back({(int)start, (int)(x - 1)});',
            '    }',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function findMissingRanges(nums, lower, upper) {',
            '  const present = new Set(nums);',
            '  const out = [];',
            '  let x = lower;',
            '  while (x <= upper) {',
            '    if (present.has(x)) { x++; continue; }',
            '    const start = x;',
            '    while (x <= upper && !present.has(x)) x++;',
            '    out.push([start, x - 1]);',
            '  }',
            '  return out;',
            '}',
          ],
        },
      },

      run([nums, lower, upper]: [number[], number, number], c) {
        if (upper - lower > 2_000_000) throw new Error('too slow')
        const present = new Set(nums)
        const out: number[][] = []
        let x = lower
        while (x <= upper) {
          c.ops++
          if (present.has(x)) {
            x++
            continue
          }
          const start = x
          while (x <= upper && !present.has(x)) {
            c.ops++
            x++
          }
          out.push([start, x - 1])
        }
        return out
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'scan',
      label: 'Track the next number still owed',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'Walking the range visits every integer; walking `nums` visits only the boundaries. Keep a cursor on the smallest number not yet accounted for: each element closes off the gap in front of it, and whatever is left when the array runs out is one final range.',
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
