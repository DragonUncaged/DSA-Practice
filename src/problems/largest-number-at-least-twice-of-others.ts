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
    { args: [[0]], expect: 0, note: 'zero dominates an array of only itself' },
    { args: [[2, 1]], expect: 0, note: 'exactly twice still counts' },
    { args: [[3, 2]], expect: -1 },
    { args: [[0, 0, 0, 1]], expect: 3, note: 'anything is at least twice zero' },
    { args: [[100, 50, 50, 50]], expect: 0, note: 'the value bounds' },
    {
      args: [Array.from({ length: 50 }, (_, i) => (i === 25 ? 100 : i))],
      expect: 25,
      note: 'the longest input, with the answer in the middle',
    },
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
      id: 'check-each',
      label: 'Test every element against all the others',
      kind: 'brute',
      time: 'O(n^2)',
      space: 'O(1)',
      blurb:
        'Take each element in turn and check that it is at least twice every other element; the first one that passes is the answer. It never has to identify the maximum, but it pays a full scan for each candidate, and only one candidate could ever succeed.',
      code: {
        cpp: {
          lines: [
            'int dominantIndex(vector<int>& nums) {',
            '    int n = nums.size();',
            '    for (int i = 0; i < n; ++i) {',
            '        bool dominant = true;',
            '        for (int j = 0; j < n && dominant; ++j)',
            '            if (j != i && nums[i] < 2 * nums[j]) dominant = false;',
            '        if (dominant) return i;',
            '    }',
            '    return -1;',
            '}',
          ],
        },
        js: {
          lines: [
            'function dominantIndex(nums) {',
            '  for (let i = 0; i < nums.length; i++) {',
            '    let dominant = true;',
            '    for (let j = 0; j < nums.length && dominant; j++)',
            '      if (j !== i && nums[i] < 2 * nums[j]) dominant = false;',
            '    if (dominant) return i;',
            '  }',
            '  return -1;',
            '}',
          ],
        },
      },
      run([nums]: [number[]], c) {
        for (let i = 0; i < nums.length; i++) {
          let dominant = true
          for (let j = 0; j < nums.length && dominant; j++) {
            c.ops++
            if (j !== i && nums[i] < 2 * nums[j]) dominant = false
          }
          if (dominant) return i
        }
        return -1
      },
    },
    {
      id: 'top-two',
      label: 'Track the best and the runner-up',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'Only the maximum can dominate, and it dominates exactly when it clears twice the runner-up — if it beats twice the second-largest value it beats twice everything else too. So one pass keeps the best value, the value just below it, and where the best was found; no candidate other than the maximum is ever tested.',
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
