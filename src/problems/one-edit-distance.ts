import type { Problem } from '@/lib/types'

export const oneEditDistance: Problem = {
  id: 'one-edit-distance',
  title: 'One Edit Distance',
  group: 'Medium',
  pattern: 'Two Pointers',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/one-edit-distance/',
  statement:
    'Given two strings `s` and `t`, return true when exactly one insert, one delete or one replace turns `s` into `t`. Two identical strings are zero edits apart, so they do not count.',
  constraints: [
    '0 <= s.length, t.length <= 10^4',
    's and t consist of lowercase letters, uppercase letters and digits',
  ],
  signature: {
    fn: 'isOneEditDistance',
    params: [
      { name: 's', type: 'string' },
      { name: 't', type: 'string' },
    ],
    ret: 'bool',
  },
  tests: [
    { args: ['ab', 'acb'], expect: true, note: 'insert c' },
    { args: ['', ''], expect: false, note: 'zero edits apart, not one' },
    { args: ['', 'a'], expect: true, note: 'insert into an empty string' },
    { args: ['ab', 'ab'], expect: false, note: 'identical' },
    { args: ['cab', 'ad'], expect: false, note: 'lengths differ by one but the tails disagree' },
    { args: ['1203', '1213'], expect: true, note: 'one replace in the middle' },
    { args: ['abc', 'abcde'], expect: false, note: 'two inserts' },
    { args: ['a', 'b'], expect: true, note: 'single characters that differ' },
    { args: ['abcd', 'abce'], expect: true, note: 'replace at the very end' },
    { args: ['abc', 'bc'], expect: true, note: 'delete the first character' },
  ],
  scale: (n) => ['a'.repeat(n), 'a'.repeat(n - 1) + 'b'],
  demo: ['ab', 'acb'],
  starter: {
    js: `function isOneEditDistance(s, t) {
  // s: string, t: string  ->  boolean
}
`,
    cpp: `bool isOneEditDistance(string s, string t) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'edit-distance-table',
      label: 'Compute the full edit distance and test for one',
      kind: 'brute',
      time: 'O(m * n)',
      space: 'O(m * n)',
      blurb:
        'The general Edit Distance recurrence answers a harder question than was asked: fill the whole table, then check whether the corner equals one. Correct, but it does quadratic work to confirm a fact that a single scan can settle.',
      code: {
        cpp: {
          lines: [
            'bool isOneEditDistance(string s, string t) {',
            '    int m = s.size(), n = t.size();',
            '    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));',
            '    for (int i = 0; i <= m; ++i) dp[i][0] = i;',
            '    for (int j = 0; j <= n; ++j) dp[0][j] = j;',
            '    for (int i = 1; i <= m; ++i) {',
            '        for (int j = 1; j <= n; ++j) {',
            '            if (s[i - 1] == t[j - 1]) dp[i][j] = dp[i - 1][j - 1];',
            '            else dp[i][j] = 1 + min({dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]});',
            '        }',
            '    }',
            '    return dp[m][n] == 1;',
            '}',
          ],
        },
        js: {
          lines: [
            'function isOneEditDistance(s, t) {',
            '  const m = s.length;',
            '  const n = t.length;',
            '  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));',
            '  for (let i = 0; i <= m; i++) dp[i][0] = i;',
            '  for (let j = 0; j <= n; j++) dp[0][j] = j;',
            '  for (let i = 1; i <= m; i++) {',
            '    for (let j = 1; j <= n; j++) {',
            '      if (s[i - 1] === t[j - 1]) dp[i][j] = dp[i - 1][j - 1];',
            '      else dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);',
            '    }',
            '  }',
            '  return dp[m][n] === 1;',
            '}',
          ],
        },
      },

      run([s, t]: [string, string], c): boolean {
        const m = s.length
        const n = t.length
        if (m * n > 4_000_000) throw new Error('too slow')
        const dp = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0))
        for (let i = 0; i <= m; i++) dp[i][0] = i
        for (let j = 0; j <= n; j++) dp[0][j] = j
        for (let i = 1; i <= m; i++) {
          for (let j = 1; j <= n; j++) {
            c.ops++
            if (s[i - 1] === t[j - 1]) dp[i][j] = dp[i - 1][j - 1]
            else dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1])
          }
        }
        return dp[m][n] === 1
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'scan',
      label: 'Walk to the first mismatch',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'The table computes every prefix pair when only one mismatch matters. Make `s` the shorter string and scan until the characters differ: equal lengths must then be a replace and unequal lengths an insert, so one tail comparison settles it. No mismatch at all means the answer is whether `t` is exactly one character longer.',
      code: {
        cpp: {
          lines: [
            'bool isOneEditDistance(string s, string t) {',
            '    int m = s.size(), n = t.size();',
            '    if (m > n) return isOneEditDistance(t, s);',
            '    if (n - m > 1) return false;',
            '',
            '    for (int i = 0; i < m; ++i) {',
            '        if (s[i] == t[i]) continue;',
            '        if (m == n) return s.substr(i + 1) == t.substr(i + 1);',
            '        return s.substr(i) == t.substr(i + 1);',
            '    }',
            '    return n - m == 1;',
            '}',
          ],
        },
        js: {
          lines: [
            'function isOneEditDistance(s, t) {',
            '  if (s.length > t.length) return isOneEditDistance(t, s);',
            '  const m = s.length;',
            '  const n = t.length;',
            '  if (n - m > 1) return false;',
            '',
            '  for (let i = 0; i < m; i++) {',
            '    if (s[i] === t[i]) continue;',
            '    if (m === n) return s.slice(i + 1) === t.slice(i + 1);',
            '    return s.slice(i) === t.slice(i + 1);',
            '  }',
            '  return n - m === 1;',
            '}',
          ],
        },
      },

      run([a, b]: [string, string], c): boolean {
        const s = a.length > b.length ? b : a
        const t = a.length > b.length ? a : b
        const m = s.length
        const n = t.length
        if (n - m > 1) return false
        for (let i = 0; i < m; i++) {
          c.ops++
          if (s[i] === t[i]) continue
          if (m === n) return s.slice(i + 1) === t.slice(i + 1)
          return s.slice(i) === t.slice(i + 1)
        }
        return n - m === 1
      },
    },
  ],
}
