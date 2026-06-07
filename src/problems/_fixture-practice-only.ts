import type { Problem } from '@/lib/types'

/**
 * Fixture for the practice-only path: a problem with no `trace` and no step
 * `map`, so the player drops its Trace and Brute vs Optimal tabs and opens on
 * Practice. Registered in `PROBLEMS` so `/selftest` and `/p/fixture-practice-only`
 * exercise the path, and deliberately in no sheet. Delete it once real
 * practice-only problems exist.
 */
export const fixturePracticeOnly: Problem = {
  id: 'fixture-practice-only',
  title: 'Running Sum of 1d Array',
  group: 'Array',
  pattern: 'Prefix Sum',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/running-sum-of-1d-array/',
  statement:
    'Given an array `nums`, return its running sum, where `out[i]` is the sum of `nums[0..i]`.',
  constraints: ['1 <= nums.length <= 1000', '-10^6 <= nums[i] <= 10^6'],
  signature: { fn: 'runningSum', params: [{ name: 'nums', type: 'int[]' }], ret: 'int[]' },
  tests: [
    { args: [[1, 2, 3, 4]], expect: [1, 3, 6, 10] },
    { args: [[1, 1, 1, 1, 1]], expect: [1, 2, 3, 4, 5] },
    { args: [[3, -1, 4, -1, 5]], expect: [3, 2, 6, 5, 10] },
    { args: [[7]], expect: [7] },
  ],
  demo: [[1, 2, 3, 4]],
  scale: (n) => [Array.from({ length: n }, (_, i) => (i % 13) - 6)],
  starter: {
    js: `function runningSum(nums) {
  // nums: number[]  ->  number[]
}
`,
    cpp: `vector<int> runningSum(vector<int>& nums) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'prefix',
      label: 'Carry the total forward',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'Walk once, keeping the total of everything seen so far. Each position is the previous answer plus the current value, so there is nothing to recompute.',
      code: {
        cpp: {
          lines: [
            'vector<int> runningSum(vector<int>& nums) {',
            '    int total = 0;',
            '    vector<int> out;',
            '    for (int x : nums) {',
            '        total += x;',
            '        out.push_back(total);',
            '    }',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function runningSum(nums) {',
            '  let total = 0;',
            '  const out = [];',
            '  for (const x of nums) {',
            '    total += x;',
            '    out.push(total);',
            '  }',
            '  return out;',
            '}',
          ],
        },
      },

      run([nums]: [number[]], c) {
        let total = 0
        const out: number[] = []
        for (const x of nums) {
          c.ops++
          total += x
          out.push(total)
        }
        return out
      },
    },
  ],
}
