import type { Problem } from '@/lib/types'

export const longestSubstringKDistinct: Problem = {
  id: 'longest-substring-with-at-most-k-distinct-characters',
  title: 'Longest Substring with At Most K Distinct Characters',
  group: 'Medium',
  pattern: 'Sliding Window',
  difficulty: 'Medium',
  leetcode:
    'https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/',
  statement:
    'Given a string `s` and an integer `k`, return the length of the longest substring containing at most `k` distinct characters.',
  constraints: ['1 <= s.length <= 5 * 10^4', '0 <= k <= 50'],
  signature: {
    fn: 'lengthOfLongestSubstringKDistinct',
    params: [
      { name: 's', type: 'string' },
      { name: 'k', type: 'int' },
    ],
    ret: 'int',
  },
  tests: [
    { args: ['eceba', 2], expect: 3, note: '"ece"' },
    { args: ['aa', 1], expect: 2 },
    { args: ['a', 0], expect: 0, note: 'no characters allowed at all' },
    { args: ['abc', 3], expect: 3, note: 'k covers the whole string' },
    { args: ['abaccc', 2], expect: 4, note: '"accc"' },
    { args: ['aaa', 1], expect: 3 },
  ],
  demo: ['eceba', 2],
  scale: (n) => ['abcdef'.repeat(Math.ceil(n / 6)).slice(0, n), 3],
  starter: {
    js: `function lengthOfLongestSubstringKDistinct(s, k) {
  // s: string, k: number  ->  number
}
`,
    cpp: `int lengthOfLongestSubstringKDistinct(string s, int k) {
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
      space: 'O(k)',
      blurb:
        'The two-distinct version generalises directly: grow the window on the right and, whenever it holds more than `k` distinct characters, shrink from the left until it does not. Each index is added once and removed once.',
      code: {
        cpp: {
          lines: [
            'int lengthOfLongestSubstringKDistinct(string s, int k) {',
            '    unordered_map<char, int> count;',
            '    int start = 0, best = 0;',
            '    for (int i = 0; i < (int)s.size(); ++i) {',
            '        count[s[i]]++;',
            '        while ((int)count.size() > k) {',
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
            'function lengthOfLongestSubstringKDistinct(s, k) {',
            '  const count = new Map();',
            '  let start = 0;',
            '  let best = 0;',
            '  for (let i = 0; i < s.length; i++) {',
            '    count.set(s[i], (count.get(s[i]) ?? 0) + 1);',
            '    while (count.size > k) {',
            '      const ch = s[start++];',
            '      const left = count.get(ch) - 1;',
            '      if (left === 0) count.delete(ch);',
            '      else count.set(ch, left);',
            '    }',
            '    best = Math.max(best, i - start + 1);',
            '  }',
            '  return best;',
            '}',
          ],
        },
      },

      run([s, k]: [string, number], c) {
        const count = new Map<string, number>()
        let start = 0
        let best = 0
        for (let i = 0; i < s.length; i++) {
          c.ops++
          count.set(s[i], (count.get(s[i]) ?? 0) + 1)
          while (count.size > k) {
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
