import type { Problem } from '@/lib/types'

export const longestPalindrome: Problem = {
  id: 'longest-palindrome',
  title: 'Longest Palindrome',
  group: 'String',
  pattern: 'Frequency Count',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/longest-palindrome/',
  statement:
    'Given a string `s` of letters, return the length of the longest palindrome that can be built by reordering some or all of its characters. Case matters: `"Aa"` is not a pair.',
  constraints: ['1 <= s.length <= 2000', 'Upper and lower case English letters'],
  signature: { fn: 'longestPalindrome', params: [{ name: 's', type: 'string' }], ret: 'int' },
  tests: [
    { args: ['abccccdd'], expect: 7 },
    { args: ['a'], expect: 1 },
    { args: ['bb'], expect: 2 },
    { args: ['aaaAaa'], expect: 5, note: 'one leftover letter sits in the middle' },
    { args: ['abc'], expect: 1, note: 'no pairs at all' },
  ],
  demo: ['abccccdd'],
  scale: (n) => [Array.from({ length: n }, (_, i) => String.fromCharCode(97 + (i % 26))).join('')],
  starter: {
    js: `function longestPalindrome(s) {
  // s: string  ->  number
}
`,
    cpp: `int longestPalindrome(string s) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'pairs-plus-centre',
      label: 'Every pair counts, plus one centre',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'A palindrome mirrors around its middle, so each letter contributes in pairs — a letter seen five times gives four usable characters. Add up those pairs, then, if any letter had an odd count, one single character can still sit in the centre.',
      code: {
        cpp: {
          lines: [
            'int longestPalindrome(string s) {',
            '    unordered_map<char, int> count;',
            '    for (char ch : s) count[ch]++;',
            '    int total = 0; bool odd = false;',
            '    for (auto& [ch, n] : count) {',
            '        total += n / 2 * 2;',
            '        if (n % 2) odd = true;',
            '    }',
            '    return total + (odd ? 1 : 0);',
            '}',
          ],
        },
        js: {
          lines: [
            'function longestPalindrome(s) {',
            '  const count = new Map();',
            '  for (const ch of s) count.set(ch, (count.get(ch) ?? 0) + 1);',
            '  let total = 0, odd = false;',
            '  for (const n of count.values()) {',
            '    total += Math.floor(n / 2) * 2;',
            '    if (n % 2) odd = true;',
            '  }',
            '  return total + (odd ? 1 : 0);',
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
        let total = 0
        let odd = false
        for (const n of count.values()) {
          c.ops++
          total += Math.floor(n / 2) * 2
          if (n % 2) odd = true
        }
        return total + (odd ? 1 : 0)
      },
    },
  ],
}
