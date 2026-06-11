import type { Problem } from '@/lib/types'

export const maxConsecutiveOnes: Problem = {
  id: 'max-consecutive-ones',
  title: 'Max Consecutive Ones',
  group: 'Array',
  pattern: 'Running Count',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/max-consecutive-ones/',
  statement:
    'Given a binary array `nums`, return the length of the longest run of consecutive `1`s in it.',
  constraints: ['1 <= nums.length <= 10^5', 'nums[i] is 0 or 1'],
  signature: {
    fn: 'findMaxConsecutiveOnes',
    params: [{ name: 'nums', type: 'int[]' }],
    ret: 'int',
  },
  tests: [
    { args: [[1, 1, 0, 1, 1, 1]], expect: 3 },
    { args: [[1, 0, 1, 1, 0, 1]], expect: 2 },
    { args: [[0, 0]], expect: 0, note: 'no ones at all' },
    { args: [[1, 1, 1]], expect: 3, note: 'the run reaches the end' },
  ],
  demo: [[1, 1, 0, 1, 1, 1]],
  scale: (n) => [Array.from({ length: n }, (_, i) => (i % 7 === 0 ? 0 : 1))],
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
      id: 'run-length',
      label: 'Count the current run, keep the best',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'One counter tracks the run ending at the current position: a one extends it, a zero resets it to nothing. Take the best value that counter ever reaches. Checking the maximum inside the loop matters — a run that ends at the last element would otherwise be missed.',
      code: {
        cpp: {
          lines: [
            'int findMaxConsecutiveOnes(vector<int>& nums) {',
            '    int best = 0, run = 0;',
            '    for (int x : nums) {',
            '        run = x == 1 ? run + 1 : 0;',
            '        best = max(best, run);',
            '    }',
            '    return best;',
            '}',
          ],
        },
        js: {
          lines: [
            'function findMaxConsecutiveOnes(nums) {',
            '  let best = 0, run = 0;',
            '  for (const x of nums) {',
            '    run = x === 1 ? run + 1 : 0;',
            '    best = Math.max(best, run);',
            '  }',
            '  return best;',
            '}',
          ],
        },
      },

      run([nums]: [number[]], c) {
        let best = 0
        let run = 0
        for (const x of nums) {
          c.ops++
          run = x === 1 ? run + 1 : 0
          best = Math.max(best, run)
        }
        return best
      },
    },
  ],
}
