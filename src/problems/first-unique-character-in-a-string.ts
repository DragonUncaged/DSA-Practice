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
    { args: ['aadadaad'], expect: -1 },
    { args: ['dddccdbba'], expect: 8, note: 'the unique letter is last' },
    { args: ['abcabcx'], expect: 6 },
    {
      args: ['abcdefghijklmnopqrstuvwxyz'.repeat(2)],
      expect: -1,
      note: 'every letter of the alphabet, twice',
    },
    { args: ['a'.repeat(1500) + 'b' + 'a'.repeat(1500)], expect: 1500, note: 'a long string with one odd letter out' },
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
      id: 'rescan',
      label: 'Rescan the string for each character',
      kind: 'brute',
      time: 'O(n^2)',
      space: 'O(1)',
      blurb:
        'For each position, look through the rest of the string for the same letter; the first position with no twin is the answer. No extra memory, but every candidate pays a full scan, and a string that repeats everything makes every one of those scans run to the end.',
      code: {
        cpp: {
          lines: [
            'int firstUniqChar(string s) {',
            '    int n = s.size();',
            '    for (int i = 0; i < n; ++i) {',
            '        bool twin = false;',
            '        for (int j = 0; j < n && !twin; ++j)',
            '            if (j != i && s[j] == s[i]) twin = true;',
            '        if (!twin) return i;',
            '    }',
            '    return -1;',
            '}',
          ],
        },
        js: {
          lines: [
            'function firstUniqChar(s) {',
            '  for (let i = 0; i < s.length; i++) {',
            '    let twin = false;',
            '    for (let j = 0; j < s.length && !twin; j++)',
            '      if (j !== i && s[j] === s[i]) twin = true;',
            '    if (!twin) return i;',
            '  }',
            '  return -1;',
            '}',
          ],
        },
      },
      run([s]: [string], c) {
        for (let i = 0; i < s.length; i++) {
          let twin = false
          for (let j = 0; j < s.length && !twin; j++) {
            c.ops++
            if (j !== i && s[j] === s[i]) twin = true
          }
          if (!twin) return i
        }
        return -1
      },
    },
    {
      id: 'count-then-scan',
      label: 'Count everything, then scan for a one',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'The rescan repeats the same question — how often does this letter occur — once per position. Answer it once for every letter with a single counting pass, then walk the string in its original order and stop at the first letter whose count is one. Order comes from the scan, not from the counts, and the table has at most 26 entries.',
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
