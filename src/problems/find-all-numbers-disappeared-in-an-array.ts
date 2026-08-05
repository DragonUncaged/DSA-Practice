import type { Problem } from '@/lib/types'

export const findAllNumbersDisappearedInAnArray: Problem = {
  id: 'find-all-numbers-disappeared-in-an-array',
  title: 'Find All Numbers Disappeared in an Array',
  group: 'Array',
  pattern: 'In-place Marking',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/',
  statement:
    'An array `nums` of length `n` holds values in the range `1..n`, with some values repeated and others missing. Return every value in `1..n` that does not appear. Aim for O(n) time and no extra array.',
  constraints: [
    '1 <= n <= 10^5',
    '1 <= nums[i] <= n',
    'O(n) time, O(1) extra space beyond the answer',
  ],
  signature: {
    fn: 'findDisappearedNumbers',
    params: [{ name: 'nums', type: 'int[]' }],
    ret: 'int[]',
  },
  compare: 'set',
  tests: [
    { args: [[4, 3, 2, 7, 8, 2, 3, 1]], expect: [5, 6] },
    { args: [[1, 1]], expect: [2] },
    { args: [[1, 2, 3]], expect: [], note: 'nothing is missing' },
    { args: [[2, 2, 2]], expect: [1, 3] },
    { args: [[1]], expect: [], note: 'a single element' },
    { args: [[2, 2]], expect: [1] },
    { args: [[5, 4, 3, 2, 1]], expect: [], note: 'a permutation in reverse' },
    { args: [[1, 1, 1, 1, 1]], expect: [2, 3, 4, 5], note: 'everything but one value is missing' },
    {
      args: [Array.from({ length: 3000 }, () => 1)],
      expect: Array.from({ length: 2999 }, (_, i) => i + 2),
      note: 'a long array of ones',
    },
  ],
  demo: [[4, 3, 2, 7, 8, 2, 3, 1]],
  scale: (n) => [Array.from({ length: n }, (_, i) => (i % 2 ? i + 1 : 1))],
  starter: {
    js: `function findDisappearedNumbers(nums) {
  // nums: number[]  ->  number[]
}
`,
    cpp: `vector<int> findDisappearedNumbers(vector<int>& nums) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'scan-for-each',
      label: 'Search the array for every value',
      kind: 'brute',
      time: 'O(n^2)',
      space: 'O(1)',
      blurb:
        'For each value from 1 to n, scan the array to see whether it appears, and report the ones that never do. There is no extra memory, but the array is re-read once per value, which is quadratic — and most of those scans are looking for something the first pass could have recorded.',
      code: {
        cpp: {
          lines: [
            'vector<int> findDisappearedNumbers(vector<int>& nums) {',
            '    int n = nums.size();',
            '    vector<int> out;',
            '    for (int v = 1; v <= n; ++v) {',
            '        bool found = false;',
            '        for (int x : nums) if (x == v) { found = true; break; }',
            '        if (!found) out.push_back(v);',
            '    }',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function findDisappearedNumbers(nums) {',
            '  const out = [];',
            '  for (let v = 1; v <= nums.length; v++)',
            '    if (!nums.includes(v)) out.push(v);',
            '  return out;',
            '}',
          ],
        },
      },
      run([nums]: [number[]], c) {
        const out: number[] = []
        for (let v = 1; v <= nums.length; v++) {
          let found = false
          for (const x of nums) {
            c.ops++
            if (x === v) {
              found = true
              break
            }
          }
          if (!found) out.push(v)
        }
        return out
      },
    },
    {
      id: 'seen-set',
      label: 'Record what appears, then list the gaps',
      kind: 'better',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'One pass records every value that appears in a set; a second pass over 1 to n reports whatever the set lacks. Linear time, but the set is a second structure as large as the input — and the problem asks for none.',
      code: {
        cpp: {
          lines: [
            'vector<int> findDisappearedNumbers(vector<int>& nums) {',
            '    int n = nums.size();',
            '    vector<bool> seen(n + 1, false);',
            '    for (int x : nums) seen[x] = true;',
            '    vector<int> out;',
            '    for (int v = 1; v <= n; ++v)',
            '        if (!seen[v]) out.push_back(v);',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function findDisappearedNumbers(nums) {',
            '  const seen = new Set(nums);',
            '  const out = [];',
            '  for (let v = 1; v <= nums.length; v++)',
            '    if (!seen.has(v)) out.push(v);',
            '  return out;',
            '}',
          ],
        },
      },
      run([nums]: [number[]], c) {
        const seen = new Set<number>()
        for (const x of nums) {
          c.ops++
          seen.add(x)
        }
        const out: number[] = []
        for (let v = 1; v <= nums.length; v++) {
          c.ops++
          if (!seen.has(v)) out.push(v)
        }
        return out
      },
    },
    {
      id: 'sign-marking',
      label: 'Use the array itself as the seen-set',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'The seen-set can live inside the array. Values run from 1 to n and the array has n slots, so each value already names a slot: mark a value as seen by flipping the sign at its slot — the magnitude still carries the original value, so nothing is lost. Whichever slots stay positive at the end name the missing values, and no second structure was needed.',
      code: {
        cpp: {
          lines: [
            'vector<int> findDisappearedNumbers(vector<int>& nums) {',
            '    for (int x : nums) {',
            '        int at = abs(x) - 1;',
            '        if (nums[at] > 0) nums[at] = -nums[at];',
            '    }',
            '    vector<int> out;',
            '    for (int i = 0; i < (int)nums.size(); ++i)',
            '        if (nums[i] > 0) out.push_back(i + 1);',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function findDisappearedNumbers(nums) {',
            '  for (const x of nums) {',
            '    const at = Math.abs(x) - 1;',
            '    if (nums[at] > 0) nums[at] = -nums[at];',
            '  }',
            '  const out = [];',
            '  for (let i = 0; i < nums.length; i++)',
            '    if (nums[i] > 0) out.push(i + 1);',
            '  return out;',
            '}',
          ],
        },
      },

      run([nums]: [number[]], c) {
        for (const x of nums) {
          c.ops++
          const at = Math.abs(x) - 1
          if (nums[at] > 0) nums[at] = -nums[at]
        }
        const out: number[] = []
        for (let i = 0; i < nums.length; i++) {
          c.ops++
          if (nums[i] > 0) out.push(i + 1)
        }
        return out
      },
    },
  ],
}
