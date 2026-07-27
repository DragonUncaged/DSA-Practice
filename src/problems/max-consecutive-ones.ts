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
    { args: [[0]], expect: 0 },
    { args: [[1]], expect: 1 },
    { args: [[1, 1, 1, 0, 1, 1]], expect: 3, note: 'the best run is the first one' },
    { args: [[0, 1, 0, 1, 0, 1, 0]], expect: 1 },
    {
      args: [Array.from({ length: 3000 }, (_, i) => (i % 500 === 0 ? 0 : 1))],
      expect: 499,
      note: 'a long array of equal runs',
    },
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
      id: 'every-start',
      label: 'Extend a run from every start',
      kind: 'brute',
      time: 'O(n^2)',
      space: 'O(1)',
      blurb:
        'Treat every index as a possible start of the best run: walk right while the values stay one, measure how far it got, keep the longest. It is correct and needs no state between starts, but the same run is re-walked once from each of its positions, which is quadratic on a long block of ones.',
      code: {
        cpp: {
          lines: [
            'int findMaxConsecutiveOnes(vector<int>& nums) {',
            '    int best = 0, n = nums.size();',
            '    for (int start = 0; start < n; ++start) {',
            '        int end = start;',
            '        while (end < n && nums[end] == 1) ++end;',
            '        best = max(best, end - start);',
            '    }',
            '    return best;',
            '}',
          ],
        },
        js: {
          lines: [
            'function findMaxConsecutiveOnes(nums) {',
            '  let best = 0;',
            '  for (let start = 0; start < nums.length; start++) {',
            '    let end = start;',
            '    while (end < nums.length && nums[end] === 1) end++;',
            '    best = Math.max(best, end - start);',
            '  }',
            '  return best;',
            '}',
          ],
        },
      },
      run([nums]: [number[]], c) {
        let best = 0
        for (let start = 0; start < nums.length; start++) {
          let end = start
          while (end < nums.length && nums[end] === 1) {
            c.ops++
            end++
          }
          c.ops++
          best = Math.max(best, end - start)
        }
        return best
      },
    },
    {
      id: 'run-length',
      label: 'Count the current run, keep the best',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'A run only ever needs to be measured once, from its left end, so carry one counter along a single pass: a one extends the run ending here, a zero resets it to nothing. Take the best value that counter ever reaches. Checking the maximum inside the loop matters — a run that ends at the last element would otherwise be missed.',
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
