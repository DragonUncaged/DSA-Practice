import type { Problem } from '@/lib/types'

export const firstUniqueCharacter: Problem = {
  id: 'first-unique-character-in-a-string',
  title: 'First Unique Character in a String',
  group: 'String',
  pattern: 'Frequency Count',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/first-unique-character-in-a-string/',
  statement:
    'Given a string `s`, return the index of the first character that appears exactly once, or `-1` if every character repeats.',
  constraints: ['1 <= s.length <= 10^5', 'Lowercase English letters'],
  signature: { fn: 'firstUniqChar', params: [{ name: 's', type: 'string' }], ret: 'int' },
  tests: [
    { args: ['leetcode'], expect: 0 },
    { args: ['loveleetcode'], expect: 2 },
    { args: ['aabb'], expect: -1, note: 'nothing is unique' },
    { args: ['z'], expect: 0 },
  ],
  demo: ['loveleetcode'],
  scale: (n) => [Array.from({ length: n }, (_, i) => String.fromCharCode(97 + (i % 26))).join('')],
  starter: {
    js: `function firstUniqChar(s) {
  // s: string  ->  number
}
`,
    cpp: `int firstUniqChar(string s) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'count-then-scan',
      label: 'Count everything, then scan for a one',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'Uniqueness cannot be decided until the whole string has been read, so count every letter first. The second pass then walks the string in its original order and stops at the first letter whose count is one — order comes from the scan, not from the counts.',
      code: {
        cpp: {
          lines: [
            'int firstUniqChar(string s) {',
            '    int count[26] = {0};',
            '    for (char ch : s) count[ch - \'a\']++;',
            '    for (int i = 0; i < (int)s.size(); ++i)',
            '        if (count[s[i] - \'a\'] == 1) return i;',
            '    return -1;',
            '}',
          ],
        },
        js: {
          lines: [
            'function firstUniqChar(s) {',
            '  const count = new Map();',
            '  for (const ch of s) count.set(ch, (count.get(ch) ?? 0) + 1);',
            '  for (let i = 0; i < s.length; i++)',
            '    if (count.get(s[i]) === 1) return i;',
            '  return -1;',
            '}',
          ],
        },
      },

      run([s]: [string], c) {
        const count = new Map<string, number>()
        for (const ch of s) {
          c.ops++
          count.set(ch, (count.get(ch) ?? 0) + 1)
        }
        for (let i = 0; i < s.length; i++) {
          c.ops++
          if (count.get(s[i]) === 1) return i
        }
        return -1
      },
    },
  ],
}
