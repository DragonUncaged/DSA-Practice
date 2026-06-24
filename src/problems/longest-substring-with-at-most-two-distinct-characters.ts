import type { Problem } from '@/lib/types'

export const longestSubstringTwoDistinct: Problem = {
  id: 'longest-substring-with-at-most-two-distinct-characters',
  title: 'Longest Substring with At Most Two Distinct Characters',
  group: 'Medium',
  pattern: 'Sliding Window',
  difficulty: 'Medium',
  leetcode:
    'https://leetcode.com/problems/longest-substring-with-at-most-two-distinct-characters/',
  statement:
    'Given a string `s`, return the length of the longest substring that contains at most two distinct characters.',
  constraints: ['1 <= s.length <= 10^5', 's consists of English letters'],
  signature: {
    fn: 'lengthOfLongestSubstringTwoDistinct',
    params: [{ name: 's', type: 'string' }],
    ret: 'int',
  },
  tests: [
    { args: ['eceba'], expect: 3, note: '"ece"' },
    { args: ['ccaabbb'], expect: 5, note: '"aabbb"' },
    { args: ['a'], expect: 1, note: 'single character' },
    { args: ['aaaa'], expect: 4, note: 'one distinct character, whole string' },
    { args: ['abcabcabc'], expect: 2, note: 'never more than a pair in a row' },
    { args: ['abaccc'], expect: 4, note: '"accc" beats "aba"' },
  ],
  demo: ['eceba'],
  scale: (n) => ['abcab'.repeat(Math.ceil(n / 5)).slice(0, n)],
  starter: {
    js: `function lengthOfLongestSubstringTwoDistinct(s) {
  // s: string  ->  number
}
`,
    cpp: `int lengthOfLongestSubstringTwoDistinct(string s) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'window',
      label: 'Sliding window with a character count',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'Grow the window one character at a time. The moment it holds three distinct characters, shrink from the left until one of them is gone. Every index enters and leaves at most once.',
      code: {
        cpp: {
          lines: [
            'int lengthOfLongestSubstringTwoDistinct(string s) {',
            '    unordered_map<char, int> count;',
            '    int start = 0, best = 0;',
            '    for (int i = 0; i < (int)s.size(); ++i) {',
            '        count[s[i]]++;',
            '        while ((int)count.size() > 2) {',
            '            if (--count[s[start]] == 0) count.erase(s[start]);',
            '            ++start;',
            '        }',
            '        best = max(best, i - start + 1);',
            '    }',
            '    return best;',
            '}',
          ],
        },
        js: {
          lines: [
            'function lengthOfLongestSubstringTwoDistinct(s) {',
            '  const count = new Map();',
            '  let start = 0;',
            '  let best = 0;',
            '  for (let i = 0; i < s.length; i++) {',
            '    count.set(s[i], (count.get(s[i]) ?? 0) + 1);',
            '    while (count.size > 2) {',
            '      const c = s[start++];',
            '      const left = count.get(c) - 1;',
            '      if (left === 0) count.delete(c);',
            '      else count.set(c, left);',
            '    }',
            '    best = Math.max(best, i - start + 1);',
            '  }',
            '  return best;',
            '}',
          ],
        },
      },

      run([s]: [string], c) {
        const count = new Map<string, number>()
        let start = 0
        let best = 0
        for (let i = 0; i < s.length; i++) {
          c.ops++
          count.set(s[i], (count.get(s[i]) ?? 0) + 1)
          while (count.size > 2) {
            c.ops++
            const ch = s[start++]
            const left = count.get(ch)! - 1
            if (left === 0) count.delete(ch)
            else count.set(ch, left)
          }
          best = Math.max(best, i - start + 1)
        }
        return best
      },
    },
  ],
}
