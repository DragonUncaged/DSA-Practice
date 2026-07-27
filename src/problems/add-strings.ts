import type { Problem } from '@/lib/types'

export const addStrings: Problem = {
  id: 'add-strings',
  title: 'Add Strings',
  group: 'String',
  pattern: 'Simulation',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/add-strings/',
  statement:
    'Two non-negative integers are given as strings `num1` and `num2`. Return their sum as a string, without converting either input to a built-in big-integer type.',
  constraints: [
    '1 <= num1.length, num2.length <= 10^4',
    'Digits only, no leading zeros except "0" itself',
    'No built-in big-integer conversion',
  ],
  signature: {
    fn: 'addStrings',
    params: [
      { name: 'num1', type: 'string' },
      { name: 'num2', type: 'string' },
    ],
    ret: 'string',
  },
  tests: [
    { args: ['11', '123'], expect: '134' },
    { args: ['456', '77'], expect: '533', note: 'unequal lengths' },
    { args: ['0', '0'], expect: '0' },
    { args: ['999', '1'], expect: '1000', note: 'carry runs off the end' },
    { args: ['1', '999'], expect: '1000', note: 'the long carry can come from either side' },
    { args: ['9', '9'], expect: '18' },
    { args: ['12345678901234567890', '98765432109876543210'], expect: '111111111011111111100', note: 'past 64-bit range' },
    {
      args: ['9'.repeat(2000), '1'],
      expect: '1' + '0'.repeat(2000),
      note: 'a long carry chain',
    },
  ],
  demo: ['11', '123'],
  scale: (n) => ['9'.repeat(n), '1'.repeat(n)],
  starter: {
    js: `function addStrings(num1, num2) {
  // num1: string, num2: string  ->  string
}
`,
    cpp: `string addStrings(string num1, string num2) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'schoolbook',
      label: 'Schoolbook addition, right to left',
      kind: 'optimal',
      time: 'O(n + m)',
      space: 'O(n + m)',
      blurb:
        'Keep one index per string and a carry. At each step take whichever digits still exist, add them with the carry, keep the units digit and pass the tens on. The loop runs while either string has digits left or a carry is still pending, so the shorter number needs no padding. This is the only rung: the problem forbids the shortcut of parsing to a number, and padding the shorter string first is the same walk with extra allocation.',
      code: {
        cpp: {
          lines: [
            'string addStrings(string num1, string num2) {',
            '    int i = (int)num1.size() - 1, j = (int)num2.size() - 1, carry = 0;',
            '    string out;',
            '    while (i >= 0 || j >= 0 || carry) {',
            '        int a = i >= 0 ? num1[i--] - \'0\' : 0;',
            '        int b = j >= 0 ? num2[j--] - \'0\' : 0;',
            '        int sum = a + b + carry;',
            '        out += char(\'0\' + sum % 10);',
            '        carry = sum / 10;',
            '    }',
            '    reverse(out.begin(), out.end());',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function addStrings(num1, num2) {',
            '  let i = num1.length - 1, j = num2.length - 1, carry = 0;',
            '  const out = [];',
            '  while (i >= 0 || j >= 0 || carry) {',
            '    const a = i >= 0 ? +num1[i--] : 0;',
            '    const b = j >= 0 ? +num2[j--] : 0;',
            '    const sum = a + b + carry;',
            '    out.push(sum % 10);',
            '    carry = (sum / 10) | 0;',
            '  }',
            '  return out.reverse().join("");',
            '}',
          ],
        },
      },

      run([num1, num2]: [string, string], c) {
        let i = num1.length - 1
        let j = num2.length - 1
        let carry = 0
        const out: number[] = []
        while (i >= 0 || j >= 0 || carry) {
          c.ops++
          const a = i >= 0 ? +num1[i--] : 0
          const b = j >= 0 ? +num2[j--] : 0
          const sum = a + b + carry
          out.push(sum % 10)
          carry = (sum / 10) | 0
        }
        return out.reverse().join('')
      },
    },
  ],
}
