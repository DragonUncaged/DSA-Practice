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
  ],
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
      id: 'scan',
      label: 'Walk to the first mismatch',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'Make `s` the shorter string, then scan until the characters differ. At that point equal lengths must be a replace and unequal lengths an insert, so one tail comparison settles it. No mismatch at all means the answer is whether `t` is exactly one character longer.',
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
