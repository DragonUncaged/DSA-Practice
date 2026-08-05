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
    { args: ['abcd', 'dcbea'], expect: 'e', note: 't is shuffled' },
    { args: ['abc', 'zabc'], expect: 'z', note: 'the extra letter comes first' },
    { args: ['zz', 'zzz'], expect: 'z' },
    { args: ['ab'.repeat(500), 'ba'.repeat(500) + 'c'], expect: 'c', note: 'the longest input' },
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
      id: 'count-each',
      label: 'Count each letter of t in both strings',
      kind: 'brute',
      time: 'O(n^2)',
      space: 'O(1)',
      blurb:
        'The extra letter is the one that occurs more often in t than in s. So take each letter of t, count its occurrences in both strings, and return the first letter whose count in t is higher. It uses no memory beyond two counters, but each letter triggers two full scans, so the work is quadratic.',
      code: {
        cpp: {
          lines: [
            'char findTheDifference(string s, string t) {',
            '    for (char ch : t) {',
            '        int inS = 0, inT = 0;',
            '        for (char x : s) if (x == ch) inS++;',
            '        for (char x : t) if (x == ch) inT++;',
            '        if (inT > inS) return ch;',
            '    }',
            '    return 0;',
            '}',
          ],
        },
        js: {
          lines: [
            'function findTheDifference(s, t) {',
            '  const count = (str, ch) => str.split(ch).length - 1;',
            '  for (const ch of t)',
            '    if (count(t, ch) > count(s, ch)) return ch;',
            '  return "";',
            '}',
          ],
        },
      },
      run([s, t]: [string, string], c) {
        for (const ch of t) {
          let inS = 0
          let inT = 0
          for (const x of s) {
            c.ops++
            if (x === ch) inS++
          }
          for (const x of t) {
            c.ops++
            if (x === ch) inT++
          }
          if (inT > inS) return ch
        }
        return ''
      },
    },
    {
      id: 'frequency-table',
      label: 'Tally s, then untally t',
      kind: 'better',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'Count every letter of s once into a table of 26 entries, then walk t subtracting one per letter; the letter whose count drops below zero is the one s never had. Two linear passes replace the rescans, at the price of a small fixed table.',
      code: {
        cpp: {
          lines: [
            'char findTheDifference(string s, string t) {',
            '    int count[26] = {0};',
            '    for (char ch : s) count[ch - \'a\']++;',
            '    for (char ch : t)',
            '        if (--count[ch - \'a\'] < 0) return ch;',
            '    return 0;',
            '}',
          ],
        },
        js: {
          lines: [
            'function findTheDifference(s, t) {',
            '  const count = new Map();',
            '  for (const ch of s) count.set(ch, (count.get(ch) ?? 0) + 1);',
            '  for (const ch of t) {',
            '    const left = (count.get(ch) ?? 0) - 1;',
            '    if (left < 0) return ch;',
            '    count.set(ch, left);',
            '  }',
            '  return "";',
            '}',
          ],
        },
      },
      run([s, t]: [string, string], c) {
        const count = new Map<string, number>()
        for (const ch of s) {
          c.ops++
          count.set(ch, (count.get(ch) ?? 0) + 1)
        }
        for (const ch of t) {
          c.ops++
          const left = (count.get(ch) ?? 0) - 1
          if (left < 0) return ch
          count.set(ch, left)
        }
        return ''
      },
    },
    {
      id: 'xor',
      label: 'XOR everything together',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'Even the table can go. Every letter of s appears again in t, and a value XORed with itself cancels to zero, so XORing the character codes of both strings together leaves exactly the one letter without a partner — one integer of state, and the shuffling never matters.',
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
