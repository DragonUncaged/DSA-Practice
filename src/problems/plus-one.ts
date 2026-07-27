import type { Problem } from '@/lib/types'

export const plusOne: Problem = {
  id: 'plus-one',
  title: 'Plus One',
  group: 'Array',
  pattern: 'Simulation',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/plus-one/',
  statement:
    'A non-negative integer is given as an array of `digits`, most significant first, with no leading zeros. Add one to it and return the new digit array.',
  constraints: ['1 <= digits.length <= 100', '0 <= digits[i] <= 9', 'No leading zeros'],
  signature: { fn: 'plusOne', params: [{ name: 'digits', type: 'int[]' }], ret: 'int[]' },
  tests: [
    { args: [[1, 2, 3]], expect: [1, 2, 4] },
    { args: [[4, 3, 2, 9]], expect: [4, 3, 3, 0], note: 'one carry' },
    { args: [[9, 9, 9]], expect: [1, 0, 0, 0], note: 'all nines grow the array' },
    { args: [[0]], expect: [1] },
    { args: [[9]], expect: [1, 0], note: 'a single nine still grows' },
    { args: [[8, 9, 9, 9]], expect: [9, 0, 0, 0], note: 'the carry stops one short of the front' },
    {
      args: [Array.from({ length: 100 }, () => 9)],
      expect: [1, ...Array.from({ length: 100 }, () => 0)],
      note: 'the longest input, all nines',
    },
  ],
  demo: [[1, 2, 3]],
  scale: (n) => [Array.from({ length: n }, () => 9)],
  starter: {
    js: `function plusOne(digits) {
  // digits: number[]  ->  number[]
}
`,
    cpp: `vector<int> plusOne(vector<int>& digits) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'carry',
      label: 'Ripple the carry from the right',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'Walk from the last digit. Anything below nine absorbs the increment and the work stops there; a nine becomes zero and passes the carry left. Only a number that is all nines survives the loop, and that answer is always a one followed by zeros. There is no slower rung worth showing: parsing the digits into a number is forbidden by the length bound, and any other digit walk is this one in disguise.',
      code: {
        cpp: {
          lines: [
            'vector<int> plusOne(vector<int>& digits) {',
            '    vector<int> out = digits;',
            '    for (int i = (int)out.size() - 1; i >= 0; --i) {',
            '        if (out[i] < 9) { out[i]++; return out; }',
            '        out[i] = 0;',
            '    }',
            '    out.insert(out.begin(), 1);',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function plusOne(digits) {',
            '  const out = digits.slice();',
            '  for (let i = out.length - 1; i >= 0; i--) {',
            '    if (out[i] < 9) { out[i]++; return out; }',
            '    out[i] = 0;',
            '  }',
            '  return [1, ...out];',
            '}',
          ],
        },
      },

      run([digits]: [number[]], c) {
        const out = digits.slice()
        for (let i = out.length - 1; i >= 0; i--) {
          c.ops++
          if (out[i] < 9) {
            out[i]++
            return out
          }
          out[i] = 0
        }
        return [1, ...out]
      },
    },
  ],
}
