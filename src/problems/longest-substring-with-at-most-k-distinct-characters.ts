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
    { args: ['aabbcc', 1], expect: 2, note: 'each run of two' },
    { args: ['abcdefghij', 50], expect: 10, note: 'k above the alphabet in use' },
    { args: ['abcabcbb', 2], expect: 4, note: '"bcbb"' },
  ],
  demo: ['eceba', 2],
  // the answer is the whole string, so the brute force extends every start to the end
  scale: (n) => ['abc'.repeat(Math.ceil(n / 3)).slice(0, n), 3],
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
      id: 'every-start',
      label: 'Extend from every start until k is exceeded',
      kind: 'brute',
      time: 'O(n^2)',
      space: 'O(k)',
      blurb:
        'From each index, push right and collect the distinct characters seen; stop the moment there are more than `k` and record the length. Correct, and quadratic, because every start re-reads the same run of characters the previous start already walked.',
      code: {
        cpp: {
          lines: [
            'int lengthOfLongestSubstringKDistinct(string s, int k) {',
            '    int best = 0;',
            '    for (int i = 0; i < (int)s.size(); ++i) {',
            '        unordered_set<char> seen;',
            '        for (int j = i; j < (int)s.size(); ++j) {',
            '            seen.insert(s[j]);',
            '            if ((int)seen.size() > k) break;',
            '            best = max(best, j - i + 1);',
            '        }',
            '    }',
            '    return best;',
            '}',
          ],
        },
        js: {
          lines: [
            'function lengthOfLongestSubstringKDistinct(s, k) {',
            '  let best = 0;',
            '  for (let i = 0; i < s.length; i++) {',
            '    const seen = new Set();',
            '    for (let j = i; j < s.length; j++) {',
            '      seen.add(s[j]);',
            '      if (seen.size > k) break;',
            '      best = Math.max(best, j - i + 1);',
            '    }',
            '  }',
            '  return best;',
            '}',
          ],
        },
      },

      run([s, k]: [string, number], c) {
        let best = 0
        for (let i = 0; i < s.length; i++) {
          const seen = new Set<string>()
          for (let j = i; j < s.length; j++) {
            c.ops++
            seen.add(s[j])
            if (seen.size > k) break
            best = Math.max(best, j - i + 1)
          }
        }
        return best
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'window',
      label: 'Sliding window with a character count',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(k)',
      blurb:
        'One window replaces the restart from every index. Grow it on the right and, whenever it holds more than `k` distinct characters, shrink from the left until it does not — the two-distinct version generalised directly. Each index is added once and removed once, so the scan is linear.',
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
