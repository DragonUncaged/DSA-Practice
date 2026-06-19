import type { Problem } from '@/lib/types'

export const repeatedSubstringPattern: Problem = {
  id: 'repeated-substring-pattern',
  title: 'Repeated Substring Pattern',
  group: 'String',
  pattern: 'Divisor Scan',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/repeated-substring-pattern/',
  statement:
    'Return `true` if `s` can be built by taking one of its proper substrings and concatenating two or more copies of it.',
  constraints: ['1 <= s.length <= 10^4', 'Lowercase English letters'],
  signature: {
    fn: 'repeatedSubstringPattern',
    params: [{ name: 's', type: 'string' }],
    ret: 'bool',
  },
  tests: [
    { args: ['abab'], expect: true },
    { args: ['aba'], expect: false },
    { args: ['abcabcabcabc'], expect: true },
    { args: ['a'], expect: false, note: 'a single character has no proper substring to repeat' },
    { args: ['aaaa'], expect: true },
  ],
  demo: ['abab'],
  scale: (n) => ['ab'.repeat(Math.max(1, n >> 1))],
  starter: {
    js: `function repeatedSubstringPattern(s) {
  // s: string  ->  boolean
}
`,
    cpp: `bool repeatedSubstringPattern(string s) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'divisors',
      label: 'Only divisor lengths can tile the string',
      kind: 'optimal',
      time: 'O(n * sqrt(n))',
      space: 'O(1)',
      blurb:
        'A repeated block must divide the length exactly, so only the divisors of `n` below `n` are worth trying. For each, compare every character with the one a block earlier: if they all agree, the string is that block tiled end to end.',
      code: {
        cpp: {
          lines: [
            'bool repeatedSubstringPattern(string s) {',
            '    int n = s.size();',
            '    for (int len = 1; len <= n / 2; ++len) {',
            '        if (n % len) continue;',
            '        bool ok = true;',
            '        for (int i = len; i < n && ok; ++i) ok = s[i] == s[i - len];',
            '        if (ok) return true;',
            '    }',
            '    return false;',
            '}',
          ],
        },
        js: {
          lines: [
            'function repeatedSubstringPattern(s) {',
            '  const n = s.length;',
            '  for (let len = 1; len <= n >> 1; len++) {',
            '    if (n % len) continue;',
            '    let ok = true;',
            '    for (let i = len; i < n && ok; i++) ok = s[i] === s[i - len];',
            '    if (ok) return true;',
            '  }',
            '  return false;',
            '}',
          ],
        },
      },

      run([s]: [string], c) {
        const n = s.length
        for (let len = 1; len <= n >> 1; len++) {
          if (n % len) continue
          let ok = true
          for (let i = len; i < n && ok; i++) {
            c.ops++
            ok = s[i] === s[i - len]
          }
          if (ok) return true
        }
        return false
      },
    },
  ],
}
