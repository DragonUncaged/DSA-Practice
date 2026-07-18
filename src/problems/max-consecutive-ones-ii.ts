import type { Problem } from '@/lib/types'

export const maxConsecutiveOnesII: Problem = {
  id: 'max-consecutive-ones-ii',
  title: 'Max Consecutive Ones II',
  group: 'Medium',
  pattern: 'Sliding Window',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/max-consecutive-ones-ii/',
  statement:
    'Given a binary array `nums`, return the longest run of `1`s you can get by flipping at most one `0`.',
  constraints: ['1 <= nums.length <= 10^5', 'nums[i] is either 0 or 1'],
  signature: {
    fn: 'findMaxConsecutiveOnes',
    params: [{ name: 'nums', type: 'int[]' }],
    ret: 'int',
  },
  tests: [
    { args: [[1, 0, 1, 1, 0]], expect: 4 },
    { args: [[1, 0, 1, 1, 0, 1]], expect: 4 },
    { args: [[1]], expect: 1, note: 'single one' },
    { args: [[0]], expect: 1, note: 'the flip is free even with no ones' },
    { args: [[0, 0]], expect: 1, note: 'only one zero may be flipped' },
    { args: [[1, 1, 1]], expect: 3, note: 'no zero to flip' },
  ],
  demo: [[1, 0, 1, 1, 0]],
  scale: (n) => [Array.from({ length: n }, (_, i) => (i % 5 === 0 ? 0 : 1))],
  starter: {
    js: `function findMaxConsecutiveOnes(nums) {
  // nums: number[]  ->  number
}
`,
    cpp: `int findMaxConsecutiveOnes(vector<int>& nums) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'two-runs',
      label: 'Carry the run with and without a flip',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'Track two lengths as you walk: the run of pure ones ending here, and the run allowed one flip. A one extends both. A zero ends the pure run and turns the flipped run into "the pure run plus this zero" — which is exactly what spending the flip here buys.',
      code: {
        cpp: {
          lines: [
            'int findMaxConsecutiveOnes(vector<int>& nums) {',
            '    int clean = 0, flipped = 0, best = 0;',
            '    for (int x : nums) {',
            '        if (x == 1) {',
            '            ++clean;',
            '            ++flipped;',
            '        } else {',
            '            flipped = clean + 1;',
            '            clean = 0;',
            '        }',
            '        best = max(best, flipped);',
            '    }',
            '    return best;',
            '}',
          ],
        },
        js: {
          lines: [
            'function findMaxConsecutiveOnes(nums) {',
            '  let clean = 0;',
            '  let flipped = 0;',
            '  let best = 0;',
            '  for (const x of nums) {',
            '    if (x === 1) {',
            '      clean++;',
            '      flipped++;',
            '    } else {',
            '      flipped = clean + 1;',
            '      clean = 0;',
            '    }',
            '    best = Math.max(best, flipped);',
            '  }',
            '  return best;',
            '}',
          ],
        },
      },

      run([nums]: [number[]], c) {
        let clean = 0
        let flipped = 0
        let best = 0
        for (const x of nums) {
          c.ops++
          if (x === 1) {
            clean++
            flipped++
          } else {
            flipped = clean + 1
            clean = 0
          }
          best = Math.max(best, flipped)
        }
        return best
      },
    },
  ],
}
