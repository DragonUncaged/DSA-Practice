import type { Problem } from '@/lib/types'

export const repeatedStringMatch: Problem = {
  id: 'repeated-string-match',
  title: 'Repeated String Match',
  group: 'String',
  pattern: 'Bounded Repetition',
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
      kind: 'optimal',
      time: 'O((n + m) * m)',
      space: 'O(n + m)',
      blurb:
        'The search space is smaller than it looks. If b fits at all, its match starts somewhere in the first copy of a, so a string of length `b.length + a.length` already contains it. Grow until the repetition is at least as long as b, test, then test one more copy — the extra copy covers a match that straddles a boundary. Beyond that, no number of repetitions can help.',
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
  ],
}
