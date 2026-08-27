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
    { args: [[0, 1, 1, 1, 0, 1, 1, 0]], expect: 6, note: 'the flip joins the two longest runs' },
    { args: [[1, 0, 0, 1, 1, 1]], expect: 4, note: 'two zeros in a row: only one side joins' },
    { args: [[0, 0, 0, 0]], expect: 1 },
  ],
  demo: [[1, 0, 1, 1, 0]],
  // every other element is a zero: the brute force rescans once per zero
  scale: (n) => [Array.from({ length: n }, (_, i) => i % 2)],
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
      id: 'flip-each-zero',
      label: 'Flip each zero in turn and rescan',
      kind: 'brute',
      time: 'O(n^2)',
      space: 'O(1)',
      blurb:
        'For every zero, imagine it flipped and scan the array for the longest run of ones; also try flipping nothing. Correct, and quadratic when the array is full of zeros — each candidate flip rereads everything.',
      code: {
        cpp: {
          lines: [
            'int findMaxConsecutiveOnes(vector<int>& nums) {',
            '    int n = nums.size(), best = 0;',
            '    auto longestWith = [&](int flipped) {',
            '        int run = 0, top = 0;',
            '        for (int i = 0; i < n; ++i) {',
            '            run = (nums[i] == 1 || i == flipped) ? run + 1 : 0;',
            '            top = max(top, run);',
            '        }',
            '        return top;',
            '    };',
            '    best = longestWith(-1);',
            '    for (int i = 0; i < n; ++i)',
            '        if (nums[i] == 0) best = max(best, longestWith(i));',
            '    return best;',
            '}',
          ],
        },
        js: {
          lines: [
            'function findMaxConsecutiveOnes(nums) {',
            '  const longestWith = (flipped) => {',
            '    let run = 0;',
            '    let top = 0;',
            '    for (let i = 0; i < nums.length; i++) {',
            '      run = nums[i] === 1 || i === flipped ? run + 1 : 0;',
            '      top = Math.max(top, run);',
            '    }',
            '    return top;',
            '  };',
            '  let best = longestWith(-1);',
            '  for (let i = 0; i < nums.length; i++) {',
            '    if (nums[i] === 0) best = Math.max(best, longestWith(i));',
            '  }',
            '  return best;',
            '}',
          ],
        },
      },

      run([nums]: [number[]], c) {
        const longestWith = (flipped: number) => {
          let run = 0
          let top = 0
          for (let i = 0; i < nums.length; i++) {
            c.ops++
            run = nums[i] === 1 || i === flipped ? run + 1 : 0
            top = Math.max(top, run)
          }
          return top
        }
        let best = longestWith(-1)
        for (let i = 0; i < nums.length; i++) {
          if (nums[i] === 0) best = Math.max(best, longestWith(i))
        }
        return best
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'two-runs',
      label: 'Carry the run with and without a flip',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'One pass can carry both possibilities at once. Track two lengths as you walk: the run of pure ones ending here, and the run allowed one flip. A one extends both. A zero ends the pure run and turns the flipped run into "the pure run plus this zero" — which is exactly what spending the flip here buys. Every zero is considered without a rescan.',
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
