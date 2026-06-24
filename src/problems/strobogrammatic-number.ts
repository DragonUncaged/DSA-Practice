import type { Problem } from '@/lib/types'

export const strobogrammaticNumber: Problem = {
  id: 'strobogrammatic-number',
  title: 'Strobogrammatic Number',
  group: 'Easy',
  pattern: 'Two Pointers',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/strobogrammatic-number/',
  statement:
    'Given a string `num` of digits, return true when it reads the same after being rotated 180 degrees. Only `0`, `1` and `8` survive a rotation unchanged, and `6` and `9` turn into each other; every other digit makes the number fail.',
  constraints: [
    '1 <= num.length <= 50',
    'num consists of digits only',
    'num has no leading zeros, except for "0" itself',
  ],
  signature: { fn: 'isStrobogrammatic', params: [{ name: 'num', type: 'string' }], ret: 'bool' },
  tests: [
    { args: ['69'], expect: true },
    { args: ['88'], expect: true },
    { args: ['962'], expect: false },
    { args: ['0'], expect: true, note: 'single digit that rotates to itself' },
    { args: ['2'], expect: false, note: 'single digit that does not rotate' },
    { args: ['6'], expect: false, note: '6 rotates to 9, not to itself' },
    { args: ['1691'], expect: true, note: 'odd pairs on the outside' },
    { args: ['818'], expect: true, note: 'odd length, centre must rotate to itself' },
  ],
  demo: ['69'],
  starter: {
    js: `function isStrobogrammatic(num) {
  // num: string  ->  boolean
}
`,
    cpp: `bool isStrobogrammatic(string num) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'two-pointer',
      label: 'Walk in from both ends',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'Rotating the whole string reverses it and maps each digit, so position `l` must rotate into position `r`. Close the two pointers in step and check that one pairing at a time; the middle digit of an odd-length number is checked against itself.',
      code: {
        cpp: {
          lines: [
            'bool isStrobogrammatic(string num) {',
            '    unordered_map<char, char> flip{',
            "        {'0', '0'}, {'1', '1'}, {'6', '9'}, {'8', '8'}, {'9', '6'}};",
            '    int l = 0, r = num.size() - 1;',
            '    while (l <= r) {',
            '        if (!flip.count(num[l]) || flip[num[l]] != num[r]) return false;',
            '        ++l;',
            '        --r;',
            '    }',
            '    return true;',
            '}',
          ],
        },
        js: {
          lines: [
            'function isStrobogrammatic(num) {',
            "  const flip = { 0: '0', 1: '1', 6: '9', 8: '8', 9: '6' };",
            '  let l = 0;',
            '  let r = num.length - 1;',
            '  while (l <= r) {',
            '    if (flip[num[l]] !== num[r]) return false;',
            '    l++;',
            '    r--;',
            '  }',
            '  return true;',
            '}',
          ],
        },
      },

      run([num]: [string], c) {
        const flip: Record<string, string> = { '0': '0', '1': '1', '6': '9', '8': '8', '9': '6' }
        let l = 0
        let r = num.length - 1
        while (l <= r) {
          c.ops++
          if (flip[num[l]] !== num[r]) return false
          l++
          r--
        }
        return true
      },
    },
  ],
}
