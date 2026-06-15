import type { Problem } from '@/lib/types'

export const nonDecreasingArray: Problem = {
  id: 'non-decreasing-array',
  title: 'Non-decreasing Array',
  group: 'Array',
  pattern: 'Greedy Repair',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/non-decreasing-array/',
  statement:
    'Return `true` if `nums` can be made non-decreasing by changing at most one element. An array is non-decreasing when `nums[i] <= nums[i + 1]` for every `i`.',
  constraints: ['1 <= nums.length <= 10^4', '-10^5 <= nums[i] <= 10^5', 'At most one change'],
  signature: { fn: 'checkPossibility', params: [{ name: 'nums', type: 'int[]' }], ret: 'bool' },
  tests: [
    { args: [[4, 2, 3]], expect: true },
    { args: [[4, 2, 1]], expect: false, note: 'two separate violations' },
    { args: [[3, 4, 2, 3]], expect: false, note: 'one violation, but neither repair works' },
    { args: [[1, 2, 3]], expect: true, note: 'already sorted' },
    { args: [[-1, 4, 2, 3]], expect: true },
  ],
  demo: [[4, 2, 3]],
  scale: (n) => [Array.from({ length: n }, (_, i) => i)],
  starter: {
    js: `function checkPossibility(nums) {
  // nums: number[]  ->  boolean
}
`,
    cpp: `bool checkPossibility(vector<int>& nums) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'greedy-repair',
      label: 'Repair the first drop, then keep checking',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'Counting violations is not enough — which element you change matters. At a drop, lowering the left value is always at least as good as raising the right one, because it leaves the rest of the array smaller. That is only possible when the element two back is small enough; otherwise raise the right value instead. A second drop after that repair settles it.',
      code: {
        cpp: {
          lines: [
            'bool checkPossibility(vector<int>& nums) {',
            '    int fixes = 0;',
            '    for (size_t i = 1; i < nums.size(); ++i) {',
            '        if (nums[i - 1] <= nums[i]) continue;',
            '        if (++fixes > 1) return false;',
            '        if (i < 2 || nums[i - 2] <= nums[i]) nums[i - 1] = nums[i];',
            '        else nums[i] = nums[i - 1];',
            '    }',
            '    return true;',
            '}',
          ],
        },
        js: {
          lines: [
            'function checkPossibility(nums) {',
            '  let fixes = 0;',
            '  for (let i = 1; i < nums.length; i++) {',
            '    if (nums[i - 1] <= nums[i]) continue;',
            '    if (++fixes > 1) return false;',
            '    if (i < 2 || nums[i - 2] <= nums[i]) nums[i - 1] = nums[i];',
            '    else nums[i] = nums[i - 1];',
            '  }',
            '  return true;',
            '}',
          ],
        },
      },

      run([nums]: [number[]], c) {
        let fixes = 0
        for (let i = 1; i < nums.length; i++) {
          c.ops++
          if (nums[i - 1] <= nums[i]) continue
          if (++fixes > 1) return false
          if (i < 2 || nums[i - 2] <= nums[i]) nums[i - 1] = nums[i]
          else nums[i] = nums[i - 1]
        }
        return true
      },
    },
  ],
}
