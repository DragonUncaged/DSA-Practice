import type { Problem } from '@/lib/types'

export const repeatedSubstringPattern: Problem = {
  id: 'repeated-substring-pattern',
  title: 'Repeated Substring Pattern',
  group: 'String',
  pattern: 'KMP',
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
    { args: ['aa'], expect: true, note: 'the shortest string that works' },
    { args: ['abac'], expect: false, note: 'even length, but the halves differ' },
    { args: ['abcab'], expect: false, note: 'a prefix repeats without tiling' },
    { args: ['abaababaab'], expect: true, note: 'the block is five characters long' },
    { args: ['ab'.repeat(5000)], expect: true, note: 'the longest string' },
    { args: ['a'.repeat(9999) + 'b'], expect: false, note: 'one character spoils every block size' },
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
      id: 'every-length',
      label: 'Tile every prefix length and compare',
      kind: 'brute',
      time: 'O(n^2)',
      space: 'O(n)',
      blurb:
        'Take each prefix shorter than the whole string, repeat it enough times to reach the full length, and check whether the result equals s. It is the definition run directly, but it tries every length — even ones that cannot divide n — and builds a fresh n-character string for each.',
      code: {
        cpp: {
          lines: [
            'bool repeatedSubstringPattern(string s) {',
            '    int n = s.size();',
            '    for (int len = 1; len <= n / 2; ++len) {',
            '        string tiled;',
            '        while ((int)tiled.size() < n) tiled += s.substr(0, len);',
            '        if (tiled == s) return true;',
            '    }',
            '    return false;',
            '}',
          ],
        },
        js: {
          lines: [
            'function repeatedSubstringPattern(s) {',
            '  const n = s.length;',
            '  for (let len = 1; len <= n / 2; len++) {',
            '    const block = s.slice(0, len);',
            '    if (block.repeat(Math.ceil(n / len)).slice(0, n) === s) return true;',
            '  }',
            '  return false;',
            '}',
          ],
        },
      },
      run([s]: [string], c) {
        const n = s.length
        for (let len = 1; len <= n / 2; len++) {
          c.ops += n
          const block = s.slice(0, len)
          if (block.repeat(Math.ceil(n / len)).slice(0, n) === s) return true
        }
        return false
      },
    },
    {
      id: 'divisors',
      label: 'Only divisor lengths can tile the string',
      kind: 'better',
      time: 'O(n * sqrt(n))',
      space: 'O(1)',
      blurb:
        'A repeated block must divide the length exactly, so only the divisors of `n` below `n` are worth trying, and there are few of them. For each, compare every character with the one a block earlier instead of building a tiled copy: if they all agree, the string is that block tiled end to end.',
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
    {
      id: 'kmp-period',
      label: 'The KMP failure table gives the period',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'Trying divisors one by one still rescans the string for each. The prefix function from Knuth–Morris–Pratt finds the smallest period in one pass: `fail[n - 1]` is the length of the longest proper prefix that is also a suffix, so `n - fail[n - 1]` is the shortest block that could tile s. The string is a repetition exactly when that block is shorter than s and divides its length.',
      code: {
        cpp: {
          lines: [
            'bool repeatedSubstringPattern(string s) {',
            '    int n = s.size();',
            '    vector<int> fail(n, 0);',
            '    for (int i = 1, k = 0; i < n; ++i) {',
            '        while (k && s[i] != s[k]) k = fail[k - 1];',
            '        if (s[i] == s[k]) ++k;',
            '        fail[i] = k;',
            '    }',
            '    int period = n - fail[n - 1];',
            '    return fail[n - 1] > 0 && n % period == 0;',
            '}',
          ],
        },
        js: {
          lines: [
            'function repeatedSubstringPattern(s) {',
            '  const n = s.length;',
            '  const fail = new Array(n).fill(0);',
            '  for (let i = 1, k = 0; i < n; i++) {',
            '    while (k && s[i] !== s[k]) k = fail[k - 1];',
            '    if (s[i] === s[k]) k++;',
            '    fail[i] = k;',
            '  }',
            '  const period = n - fail[n - 1];',
            '  return fail[n - 1] > 0 && n % period === 0;',
            '}',
          ],
        },
      },
      run([s]: [string], c) {
        const n = s.length
        const fail = new Array<number>(n).fill(0)
        for (let i = 1, k = 0; i < n; i++) {
          c.ops++
          while (k && s[i] !== s[k]) k = fail[k - 1]
          if (s[i] === s[k]) k++
          fail[i] = k
        }
        const period = n - fail[n - 1]
        return fail[n - 1] > 0 && n % period === 0
      },
    },
  ],
}
