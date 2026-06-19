import type { Problem } from '@/lib/types'

export const findAllNumbersDisappearedInAnArray: Problem = {
  id: 'find-all-numbers-disappeared-in-an-array',
  title: 'Find All Numbers Disappeared in an Array',
  group: 'Array',
  pattern: 'In-place Marking',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/',
  statement:
    'An array `nums` of length `n` holds values in the range `1..n`, with some values repeated and others missing. Return every value in `1..n` that does not appear. Aim for O(n) time and no extra array.',
  constraints: [
    '1 <= n <= 10^5',
    '1 <= nums[i] <= n',
    'O(n) time, O(1) extra space beyond the answer',
  ],
  signature: {
    fn: 'findDisappearedNumbers',
    params: [{ name: 'nums', type: 'int[]' }],
    ret: 'int[]',
  },
  compare: 'set',
  tests: [
    { args: [[4, 3, 2, 7, 8, 2, 3, 1]], expect: [5, 6] },
    { args: [[1, 1]], expect: [2] },
    { args: [[1, 2, 3]], expect: [], note: 'nothing is missing' },
    { args: [[2, 2, 2]], expect: [1, 3] },
  ],
  demo: [[4, 3, 2, 7, 8, 2, 3, 1]],
  scale: (n) => [Array.from({ length: n }, (_, i) => (i % 2 ? i + 1 : 1))],
  starter: {
    js: `function findDisappearedNumbers(nums) {
  // nums: number[]  ->  number[]
}
`,
    cpp: `vector<int> findDisappearedNumbers(vector<int>& nums) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'sign-marking',
      label: 'Use the array itself as the seen-set',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'Values run from 1 to n and the array has n slots, so each value already names a slot. Mark a value as seen by flipping the sign at its slot — the magnitude still carries the original value, so nothing is lost. Whichever slots stay positive at the end name the missing values.',
      code: {
        cpp: {
          lines: [
            'vector<int> findDisappearedNumbers(vector<int>& nums) {',
            '    for (int x : nums) {',
            '        int at = abs(x) - 1;',
            '        if (nums[at] > 0) nums[at] = -nums[at];',
            '    }',
            '    vector<int> out;',
            '    for (int i = 0; i < (int)nums.size(); ++i)',
            '        if (nums[i] > 0) out.push_back(i + 1);',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function findDisappearedNumbers(nums) {',
            '  for (const x of nums) {',
            '    const at = Math.abs(x) - 1;',
            '    if (nums[at] > 0) nums[at] = -nums[at];',
            '  }',
            '  const out = [];',
            '  for (let i = 0; i < nums.length; i++)',
            '    if (nums[i] > 0) out.push(i + 1);',
            '  return out;',
            '}',
          ],
        },
      },

      run([nums]: [number[]], c) {
        for (const x of nums) {
          c.ops++
          const at = Math.abs(x) - 1
          if (nums[at] > 0) nums[at] = -nums[at]
        }
        const out: number[] = []
        for (let i = 0; i < nums.length; i++) {
          c.ops++
          if (nums[i] > 0) out.push(i + 1)
        }
        return out
      },
    },
  ],
}
