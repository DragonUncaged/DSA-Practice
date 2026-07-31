import type { Problem } from '@/lib/types'

export const repeatedStringMatch: Problem = {
  id: 'repeated-string-match',
  title: 'Repeated String Match',
  group: 'String',
  pattern: 'KMP',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/repeated-string-match/',
  statement:
    'Return the minimum number of times `a` must be repeated so that `b` is a substring of the result, or `-1` if no number of repetitions works.',
  constraints: ['1 <= a.length, b.length <= 10^4', 'Lowercase English letters'],
  signature: {
    fn: 'repeatedStringMatch',
    params: [
      { name: 'a', type: 'string' },
      { name: 'b', type: 'string' },
    ],
    ret: 'int',
  },
  tests: [
    { args: ['abcd', 'cdabcdab'], expect: 3 },
    { args: ['a', 'aa'], expect: 2 },
    { args: ['abc', 'wxyz'], expect: -1, note: 'letters that a never contains' },
    { args: ['abc', 'cabcabca'], expect: 4, note: 'one extra copy past the length bound' },
    { args: ['aa', 'a'], expect: 1 },
    { args: ['abc', 'abcabcabc'], expect: 3, note: 'b is exactly three copies' },
    { args: ['aaaa', 'aa'], expect: 1, note: 'b is shorter than a' },
    { args: ['abaabaa', 'abaababaab'], expect: -1, note: 'the right letters, never in the right order' },
    { args: ['a', 'b'], expect: -1, note: 'the shortest inputs' },
    {
      args: ['abcde', 'cdeab'.repeat(300) + 'cde'],
      expect: 301,
      note: 'a long b that starts mid-copy',
    },
  ],
  demo: ['abcd', 'cdabcdab'],
  scale: (n) => ['abcd', 'abcd'.repeat(Math.max(1, n >> 2))],
  starter: {
    js: `function repeatedStringMatch(a, b) {
  // a: string, b: string  ->  number
}
`,
    cpp: `int repeatedStringMatch(string a, string b) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'two-more',
      label: 'Repeat until long enough, then try one more',
      kind: 'brute',
      time: 'O((n + m) * m)',
      space: 'O(n + m)',
      blurb:
        'The search space is smaller than it looks. If b fits at all, its match starts somewhere in the first copy of a, so a string of length `b.length + a.length` already contains it. Grow until the repetition is at least as long as b, test, then test one more copy — the extra copy covers a match that straddles a boundary. The substring search is the naive one, so a near-miss on every offset can cost the product of the two lengths.',
      code: {
        cpp: {
          lines: [
            'int repeatedStringMatch(string a, string b) {',
            '    string s;',
            '    int count = 0;',
            '    while (s.size() < b.size()) { s += a; count++; }',
            '    if (s.find(b) != string::npos) return count;',
            '    s += a;',
            '    if (s.find(b) != string::npos) return count + 1;',
            '    return -1;',
            '}',
          ],
        },
        js: {
          lines: [
            'function repeatedStringMatch(a, b) {',
            '  let s = "", count = 0;',
            '  while (s.length < b.length) { s += a; count++; }',
            '  if (s.includes(b)) return count;',
            '  s += a;',
            '  if (s.includes(b)) return count + 1;',
            '  return -1;',
            '}',
          ],
        },
      },

      run([a, b]: [string, string], c) {
        let s = ''
        let count = 0
        while (s.length < b.length) {
          c.ops++
          s += a
          count++
        }
        c.ops += s.length
        if (s.includes(b)) return count
        s += a
        c.ops += s.length
        if (s.includes(b)) return count + 1
        return -1
      },
    },
    {
      id: 'kmp',
      label: 'KMP over the repeated string',
      kind: 'optimal',
      time: 'O(n + m)',
      space: 'O(n + m)',
      blurb:
        'The bound on the repetition count stands; the naive substring search is what is replaced. Build the failure table for b and run the Knuth–Morris–Pratt scan over the repetition, so every character of the repeated string is examined once. The leftmost match is the cheapest one: the copies it needs are the copies its last character lands in.',
      code: {
        cpp: {
          lines: [
            'int repeatedStringMatch(string a, string b) {',
            '    int n = a.size(), m = b.size();',
            '    int copies = (m + n - 1) / n + 1;',
            '    string s;',
            '    for (int i = 0; i < copies; ++i) s += a;',
            '    vector<int> fail(m, 0);',
            '    for (int i = 1, k = 0; i < m; ++i) {',
            '        while (k && b[i] != b[k]) k = fail[k - 1];',
            '        if (b[i] == b[k]) ++k;',
            '        fail[i] = k;',
            '    }',
            '    for (int i = 0, k = 0; i < (int)s.size(); ++i) {',
            '        while (k && s[i] != b[k]) k = fail[k - 1];',
            '        if (s[i] == b[k]) ++k;',
            '        if (k == m) return (i + 1 + n - 1) / n;',
            '    }',
            '    return -1;',
            '}',
          ],
        },
        js: {
          lines: [
            'function repeatedStringMatch(a, b) {',
            '  const n = a.length, m = b.length;',
            '  const s = a.repeat(Math.ceil(m / n) + 1);',
            '  const fail = new Array(m).fill(0);',
            '  for (let i = 1, k = 0; i < m; i++) {',
            '    while (k && b[i] !== b[k]) k = fail[k - 1];',
            '    if (b[i] === b[k]) k++;',
            '    fail[i] = k;',
            '  }',
            '  for (let i = 0, k = 0; i < s.length; i++) {',
            '    while (k && s[i] !== b[k]) k = fail[k - 1];',
            '    if (s[i] === b[k]) k++;',
            '    if (k === m) return Math.ceil((i + 1) / n);',
            '  }',
            '  return -1;',
            '}',
          ],
        },
      },
      run([a, b]: [string, string], c) {
        const n = a.length
        const m = b.length
        const s = a.repeat(Math.ceil(m / n) + 1)
        const fail = new Array<number>(m).fill(0)
        for (let i = 1, k = 0; i < m; i++) {
          c.ops++
          while (k && b[i] !== b[k]) k = fail[k - 1]
          if (b[i] === b[k]) k++
          fail[i] = k
        }
        for (let i = 0, k = 0; i < s.length; i++) {
          c.ops++
          while (k && s[i] !== b[k]) k = fail[k - 1]
          if (s[i] === b[k]) k++
          if (k === m) return Math.ceil((i + 1) / n)
        }
        return -1
      },
    },
  ],
}
