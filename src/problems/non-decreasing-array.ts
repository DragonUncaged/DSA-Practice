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
    { args: [[1]], expect: true, note: 'a single element' },
    { args: [[5, 7, 1, 8]], expect: true, note: 'raise the 1' },
    { args: [[1, 2, 4, 5, 3]], expect: true, note: 'the drop is at the very end' },
    { args: [[2, 3, 3, 2, 4]], expect: true, note: 'the element two back blocks lowering, so raise instead' },
    { args: [[1, 1, 1, 0]], expect: true, note: 'duplicates are allowed' },
    { args: [[-100000, 100000, -100000]], expect: true, note: 'the value bounds' },
    {
      args: [Array.from({ length: 5000 }, (_, i) => (i === 2500 ? -1 : i))],
      expect: true,
      note: 'a long sorted array with one dip',
    },
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
      id: 'drop-each',
      label: 'Try leaving out each element in turn',
      kind: 'brute',
      time: 'O(n^2)',
      space: 'O(1)',
      blurb:
        'Changing one element can succeed exactly when the rest of the array, read without that element, is already non-decreasing — the changed value can then be set to match a neighbour. So for every index, check the array with that index skipped. Each check is a full pass, and the array is rechecked from the start for every candidate.',
      code: {
        cpp: {
          lines: [
            'bool checkPossibility(vector<int>& nums) {',
            '    int n = nums.size();',
            '    for (int skip = 0; skip < n; ++skip) {',
            '        bool ok = true;',
            '        int prev = INT_MIN;',
            '        for (int i = 0; i < n && ok; ++i) {',
            '            if (i == skip) continue;',
            '            if (nums[i] < prev) ok = false;',
            '            prev = nums[i];',
            '        }',
            '        if (ok) return true;',
            '    }',
            '    return false;',
            '}',
          ],
        },
        js: {
          lines: [
            'function checkPossibility(nums) {',
            '  for (let skip = 0; skip < nums.length; skip++) {',
            '    let ok = true, prev = -Infinity;',
            '    for (let i = 0; i < nums.length && ok; i++) {',
            '      if (i === skip) continue;',
            '      if (nums[i] < prev) ok = false;',
            '      prev = nums[i];',
            '    }',
            '    if (ok) return true;',
            '  }',
            '  return false;',
            '}',
          ],
        },
      },
      run([nums]: [number[]], c) {
        for (let skip = 0; skip < nums.length; skip++) {
          let ok = true
          let prev = -Infinity
          for (let i = 0; i < nums.length && ok; i++) {
            c.ops++
            if (i === skip) continue
            if (nums[i] < prev) ok = false
            prev = nums[i]
          }
          if (ok) return true
        }
        return false
      },
    },
    {
      id: 'greedy-repair',
      label: 'Repair the first drop, then keep checking',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'Only the first drop needs a decision, so one pass suffices. At a drop, lowering the left value is always at least as good as raising the right one, because it leaves the rest of the array smaller; that is only possible when the element two back is small enough, and otherwise the right value is raised instead. A second drop after that repair settles it — no index other than the first drop ever needed trying.',
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
