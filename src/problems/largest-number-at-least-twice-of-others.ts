import type { Problem } from '@/lib/types'

export const largestNumberAtLeastTwiceOfOthers: Problem = {
  id: 'largest-number-at-least-twice-of-others',
  title: 'Largest Number At Least Twice of Others',
  group: 'Array',
  pattern: 'Top Two Scan',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/largest-number-at-least-twice-of-others/',
  statement:
    'Given an array `nums` with a unique largest value, return its index if that value is at least twice every other value, and `-1` otherwise.',
  constraints: ['1 <= nums.length <= 50', '0 <= nums[i] <= 100', 'The largest value is unique'],
  signature: { fn: 'dominantIndex', params: [{ name: 'nums', type: 'int[]' }], ret: 'int' },
  tests: [
    { args: [[3, 6, 1, 0]], expect: 1 },
    { args: [[1, 2, 3, 4]], expect: -1, note: '4 is not twice 3' },
    { args: [[1]], expect: 0, note: 'a lone element dominates trivially' },
    { args: [[0, 0, 3, 2]], expect: -1 },
    { args: [[7, 3]], expect: 0 },
  ],
  demo: [[3, 6, 1, 0]],
  scale: (n) => [Array.from({ length: n }, (_, i) => i)],
  starter: {
    js: `function dominantIndex(nums) {
  // nums: number[]  ->  number
}
`,
    cpp: `int dominantIndex(vector<int>& nums) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'top-two',
      label: 'Track the best and the runner-up',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'Only two values decide the answer: the maximum and the largest value below it. If the maximum clears twice the runner-up, it clears twice everything else too. One pass keeps both, along with where the maximum was found.',
      code: {
        cpp: {
          lines: [
            'int dominantIndex(vector<int>& nums) {',
            '    int best = -1, second = -1, at = -1;',
            '    for (int i = 0; i < (int)nums.size(); ++i) {',
            '        if (nums[i] > best) { second = best; best = nums[i]; at = i; }',
            '        else if (nums[i] > second) second = nums[i];',
            '    }',
            '    return best >= 2 * second ? at : -1;',
            '}',
          ],
        },
        js: {
          lines: [
            'function dominantIndex(nums) {',
            '  let best = -1, second = -1, at = -1;',
            '  for (let i = 0; i < nums.length; i++) {',
            '    if (nums[i] > best) { second = best; best = nums[i]; at = i; }',
            '    else if (nums[i] > second) second = nums[i];',
            '  }',
            '  return best >= 2 * second ? at : -1;',
            '}',
          ],
        },
      },

      run([nums]: [number[]], c) {
        let best = -1
        let second = -1
        let at = -1
        for (let i = 0; i < nums.length; i++) {
          c.ops++
          if (nums[i] > best) {
            second = best
            best = nums[i]
            at = i
          } else if (nums[i] > second) {
            second = nums[i]
          }
        }
        return best >= 2 * second ? at : -1
      },
    },
  ],
}
