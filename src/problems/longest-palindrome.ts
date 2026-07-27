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
    { args: ['Aa'], expect: 1, note: 'case matters, so this is not a pair' },
    { args: ['aabbccdd'], expect: 8, note: 'everything pairs, nothing is left for the centre' },
    { args: ['aaabbb'], expect: 5, note: 'two odd counts still leave only one centre' },
    {
      args: ['abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.repeat(38) + 'abcd'],
      expect: 1977,
      note: 'the longest input: 2000 letters, four of them odd',
    },
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
      id: 'per-letter-scan',
      label: 'Scan the string once per letter',
      kind: 'brute',
      time: 'O(52 * n)',
      space: 'O(1)',
      blurb:
        'A palindrome mirrors around its middle, so each letter contributes in pairs — a letter seen five times gives four usable characters. The plainest way to get those counts is to walk the whole string once for each of the 52 letters. It needs no table at all, but it reads the input 52 times to learn what one pass could.',
      code: {
        cpp: {
          lines: [
            'int longestPalindrome(string s) {',
            '    string alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";',
            '    int total = 0; bool odd = false;',
            '    for (char letter : alphabet) {',
            '        int n = 0;',
            '        for (char ch : s) if (ch == letter) ++n;',
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
            '  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";',
            '  let total = 0, odd = false;',
            '  for (const letter of alphabet) {',
            '    let n = 0;',
            '    for (const ch of s) if (ch === letter) n++;',
            '    total += Math.floor(n / 2) * 2;',
            '    if (n % 2) odd = true;',
            '  }',
            '  return total + (odd ? 1 : 0);',
            '}',
          ],
        },
      },
      run([s]: [string], c) {
        const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
        let total = 0
        let odd = false
        for (const letter of alphabet) {
          let n = 0
          for (const ch of s) {
            c.ops++
            if (ch === letter) n++
          }
          total += Math.floor(n / 2) * 2
          if (n % 2) odd = true
        }
        return total + (odd ? 1 : 0)
      },
    },
    {
      id: 'pairs-plus-centre',
      label: 'Count once, then sum the pairs',
      kind: 'better',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'One pass with a count table replaces the 52 scans: bump each letter as it goes by, then add up the pairs across the table. If any letter had an odd count, one single character can still sit in the centre. The table has at most 52 entries, so the space is constant.',
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
    {
      id: 'odd-toggle',
      label: 'Toggle unpaired letters in a set',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'The counts themselves were never needed — only which letters end up unpaired. Keep a set of letters currently waiting for a partner: a letter already in the set completes a pair and leaves, otherwise it joins. Everything not in the set at the end was paired, so the answer is the length minus the leftovers, plus one for a centre if any leftover exists. One pass, no second sweep.',
      code: {
        cpp: {
          lines: [
            'int longestPalindrome(string s) {',
            '    unordered_set<char> waiting;',
            '    for (char ch : s) {',
            '        if (waiting.count(ch)) waiting.erase(ch);',
            '        else waiting.insert(ch);',
            '    }',
            '    int leftover = waiting.size();',
            '    return (int)s.size() - leftover + (leftover ? 1 : 0);',
            '}',
          ],
        },
        js: {
          lines: [
            'function longestPalindrome(s) {',
            '  const waiting = new Set();',
            '  for (const ch of s) {',
            '    if (waiting.has(ch)) waiting.delete(ch);',
            '    else waiting.add(ch);',
            '  }',
            '  const leftover = waiting.size;',
            '  return s.length - leftover + (leftover ? 1 : 0);',
            '}',
          ],
        },
      },
      run([s]: [string], c) {
        const waiting = new Set<string>()
        for (const ch of s) {
          c.ops++
          if (waiting.has(ch)) waiting.delete(ch)
          else waiting.add(ch)
        }
        const leftover = waiting.size
        return s.length - leftover + (leftover ? 1 : 0)
      },
    },
  ],
}
