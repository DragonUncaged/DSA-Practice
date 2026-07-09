import type { Problem } from '@/lib/types'

export const sortTransformedArray: Problem = {
  id: 'sort-transformed-array',
  title: 'Sort Transformed Array',
  group: 'Medium',
  pattern: 'Two Pointers',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/sort-transformed-array/',
  statement:
    'Given a sorted array `nums` and three integers `a`, `b` and `c`, apply `f(x) = a*x^2 + b*x + c` to every element and return the results in ascending order. Sorting afterwards is `O(n log n)`; `O(n)` is possible.',
  constraints: [
    '1 <= nums.length <= 200',
    '-100 <= nums[i], a, b, c <= 100',
    'nums is sorted in ascending order',
  ],
  signature: {
    fn: 'sortTransformedArray',
    params: [
      { name: 'nums', type: 'int[]' },
      { name: 'a', type: 'int' },
      { name: 'b', type: 'int' },
      { name: 'c', type: 'int' },
    ],
    ret: 'int[]',
  },
  tests: [
    { args: [[-4, -2, 2, 4], 1, 3, 5], expect: [3, 9, 15, 33] },
    { args: [[-4, -2, 2, 4], -1, 3, 5], expect: [-23, -5, 1, 7] },
    { args: [[1], 0, 0, 0], expect: [0], note: 'single element, constant function' },
    { args: [[-1, 0, 1], 1, 0, 0], expect: [0, 1, 1], note: 'a parabola about zero' },
    { args: [[1, 2, 3], 0, 1, 0], expect: [1, 2, 3], note: 'a = 0, increasing line' },
    { args: [[1, 2, 3], 0, -1, 0], expect: [-3, -2, -1], note: 'a = 0, decreasing line' },
  ],
  demo: [[-4, -2, 2, 4], 1, 3, 5],
  starter: {
    js: `function sortTransformedArray(nums, a, b, c) {
  // nums: number[], a: number, b: number, c: number  ->  number[]
}
`,
    cpp: `vector<int> sortTransformedArray(vector<int>& nums, int a, int b, int c) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'ends-inward',
      label: 'Read the extremes off the two ends',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'A parabola is largest at whichever end of a sorted range is furthest from its vertex, so with `a > 0` the biggest value is always at one end or the other — take it, fill the output from the back, and step that pointer inward. With `a < 0` the same argument gives the smallest value, so fill from the front instead. A flat `a = 0` behaves like the upward case.',
      code: {
        cpp: {
          lines: [
            'vector<int> sortTransformedArray(vector<int>& nums, int a, int b, int c) {',
            '    auto f = [&](int x) { return a * x * x + b * x + c; };',
            '    int n = nums.size();',
            '    vector<int> out(n);',
            '    int lo = 0, hi = n - 1;',
            '    int at = a >= 0 ? n - 1 : 0;',
            '',
            '    while (lo <= hi) {',
            '        int l = f(nums[lo]), h = f(nums[hi]);',
            '        if (a >= 0) {',
            '            if (l >= h) { out[at--] = l; ++lo; }',
            '            else { out[at--] = h; --hi; }',
            '        } else {',
            '            if (l <= h) { out[at++] = l; ++lo; }',
            '            else { out[at++] = h; --hi; }',
            '        }',
            '    }',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function sortTransformedArray(nums, a, b, c) {',
            '  const f = (x) => a * x * x + b * x + c;',
            '  const n = nums.length;',
            '  const out = new Array(n);',
            '  let lo = 0;',
            '  let hi = n - 1;',
            '  let at = a >= 0 ? n - 1 : 0;',
            '',
            '  while (lo <= hi) {',
            '    const l = f(nums[lo]);',
            '    const h = f(nums[hi]);',
            '    if (a >= 0) {',
            '      if (l >= h) { out[at--] = l; lo++; }',
            '      else { out[at--] = h; hi--; }',
            '    } else {',
            '      if (l <= h) { out[at++] = l; lo++; }',
            '      else { out[at++] = h; hi--; }',
            '    }',
            '  }',
            '  return out;',
            '}',
          ],
        },
      },

      run([nums, a, b, k]: [number[], number, number, number], ctr) {
        const f = (x: number) => a * x * x + b * x + k
        const n = nums.length
        const out = new Array<number>(n)
        let lo = 0
        let hi = n - 1
        let at = a >= 0 ? n - 1 : 0
        while (lo <= hi) {
          ctr.ops++
          const l = f(nums[lo])
          const h = f(nums[hi])
          if (a >= 0) {
            if (l >= h) {
              out[at--] = l
              lo++
            } else {
              out[at--] = h
              hi--
            }
          } else {
            if (l <= h) {
              out[at++] = l
              lo++
            } else {
              out[at++] = h
              hi--
            }
          }
        }
        return out
      },
    },
  ],
}
