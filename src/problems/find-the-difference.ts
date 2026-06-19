import type { Problem } from '@/lib/types'

export const findTheDifference: Problem = {
  id: 'find-the-difference',
  title: 'Find the Difference',
  group: 'String',
  pattern: 'XOR',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/find-the-difference/',
  statement:
    'String `t` is `s` shuffled with exactly one extra letter inserted somewhere. Return that extra letter.',
  constraints: [
    '0 <= s.length <= 1000',
    't.length == s.length + 1',
    'Lowercase English letters',
  ],
  signature: {
    fn: 'findTheDifference',
    params: [
      { name: 's', type: 'string' },
      { name: 't', type: 'string' },
    ],
    ret: 'string',
  },
  tests: [
    { args: ['abcd', 'abcde'], expect: 'e' },
    { args: ['', 'y'], expect: 'y', note: 'the whole of t is the extra letter' },
    { args: ['a', 'aa'], expect: 'a', note: 'the extra letter can be a repeat' },
    { args: ['ae', 'aea'], expect: 'a' },
  ],
  demo: ['abcd', 'abcde'],
  scale: (n) => {
    const s = 'ab'.repeat(Math.max(1, n >> 1))
    return [s, s + 'z']
  },
  starter: {
    js: `function findTheDifference(s, t) {
  // s: string, t: string  ->  string (a single character)
}
`,
    cpp: `char findTheDifference(string s, string t) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'xor',
      label: 'XOR everything together',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'Every letter of s appears again in t, and a value XORed with itself cancels to zero. So XORing the character codes of both strings together leaves exactly the one letter without a partner — no counts, no map, and the shuffling never matters.',
      code: {
        cpp: {
          lines: [
            'char findTheDifference(string s, string t) {',
            '    int x = 0;',
            '    for (char ch : s) x ^= ch;',
            '    for (char ch : t) x ^= ch;',
            '    return (char)x;',
            '}',
          ],
        },
        js: {
          lines: [
            'function findTheDifference(s, t) {',
            '  let x = 0;',
            '  for (const ch of s) x ^= ch.charCodeAt(0);',
            '  for (const ch of t) x ^= ch.charCodeAt(0);',
            '  return String.fromCharCode(x);',
            '}',
          ],
        },
      },

      run([s, t]: [string, string], c) {
        let x = 0
        for (const ch of s) {
          c.ops++
          x ^= ch.charCodeAt(0)
        }
        for (const ch of t) {
          c.ops++
          x ^= ch.charCodeAt(0)
        }
        return String.fromCharCode(x)
      },
    },
  ],
}
