import type { Problem } from '@/lib/types'

export const longestUncommonSubsequenceI: Problem = {
  id: 'longest-uncommon-subsequence-i',
  title: 'Longest Uncommon Subsequence I',
  group: 'String',
  pattern: 'Case Analysis',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/longest-uncommon-subsequence-i/',
  statement:
    'Given two strings `a` and `b`, return the length of the longest string that is a subsequence of one of them but not of the other, or `-1` if no such string exists.',
  constraints: ['1 <= a.length, b.length <= 100', 'Lowercase English letters'],
  signature: {
    fn: 'findLUSlength',
    params: [
      { name: 'a', type: 'string' },
      { name: 'b', type: 'string' },
    ],
    ret: 'int',
  },
  tests: [
    { args: ['aba', 'cdc'], expect: 3 },
    { args: ['aaa', 'bbb'], expect: 3 },
    { args: ['aaa', 'aaa'], expect: -1, note: 'identical strings share every subsequence' },
    { args: ['a', 'aa'], expect: 2, note: 'the longer string is always the answer' },
    { args: ['abc', 'abd'], expect: 3, note: 'equal lengths that differ' },
    { args: ['a', 'b'], expect: 1, note: 'the shortest inputs' },
    { args: ['abcd', 'abc'], expect: 4, note: 'one is a prefix of the other' },
    { args: ['a'.repeat(100), 'a'.repeat(99)], expect: 100, note: 'the longest input' },
    { args: ['a'.repeat(100), 'a'.repeat(100)], expect: -1 },
  ],
  demo: ['aba', 'cdc'],
  starter: {
    js: `function findLUSlength(a, b) {
  // a: string, b: string  ->  number
}
`,
    cpp: `int findLUSlength(string a, string b) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'compare',
      label: 'There are only two cases',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'A string is always a subsequence of itself, so if the two strings are equal every subsequence is shared and nothing qualifies. Otherwise the longer string cannot be a subsequence of the other — a longer string never fits inside a shorter one, and equal lengths that differ cannot match either — so the answer is simply the greater length. There is no brute-force rung worth writing: enumerating subsequences is exponential, and the case analysis is the whole solution.',
      code: {
        cpp: {
          lines: [
            'int findLUSlength(string a, string b) {',
            '    if (a == b) return -1;',
            '    return max((int)a.size(), (int)b.size());',
            '}',
          ],
        },
        js: {
          lines: [
            'function findLUSlength(a, b) {',
            '  if (a === b) return -1;',
            '  return Math.max(a.length, b.length);',
            '}',
          ],
        },
      },

      run([a, b]: [string, string], c) {
        c.ops++
        if (a === b) return -1
        return Math.max(a.length, b.length)
      },
    },
  ],
}
