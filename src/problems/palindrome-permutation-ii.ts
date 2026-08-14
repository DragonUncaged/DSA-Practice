import type { Problem } from '@/lib/types'

export const palindromePermutationII: Problem = {
  id: 'palindrome-permutation-ii',
  title: 'Palindrome Permutation II',
  group: 'Medium',
  pattern: 'Backtracking',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/palindrome-permutation-ii/',
  statement:
    'Given a string `s`, return every distinct palindrome that can be made by rearranging its letters, in any order. Return an empty list when no arrangement is a palindrome.',
  constraints: ['1 <= s.length <= 16', 's consists of lowercase English letters'],
  signature: {
    fn: 'generatePalindromes',
    params: [{ name: 's', type: 'string' }],
    ret: 'string[]',
  },
  compare: 'sorted',
  tests: [
    { args: ['aabb'], expect: ['abba', 'baab'] },
    { args: ['abc'], expect: [], note: 'three letters with odd counts' },
    { args: ['a'], expect: ['a'], note: 'the odd letter is the whole answer' },
    { args: ['aa'], expect: ['aa'] },
    { args: ['aabbc'], expect: ['abcba', 'bacab'], note: 'c sits in the middle' },
    { args: ['ab'], expect: [], note: 'two odd counts' },
    { args: ['aaa'], expect: ['aaa'], note: 'one letter, odd count' },
    {
      args: ['aabbcc'],
      expect: ['abccba', 'acbbca', 'baccab', 'bcaacb', 'cabbac', 'cbaabc'],
      note: 'three pairs give 3! halves',
    },
  ],
  demo: ['aabb'],
  starter: {
    js: `function generatePalindromes(s) {
  // s: string  ->  string[]
}
`,
    cpp: `vector<string> generatePalindromes(string s) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'permute-and-filter',
      label: 'Generate every distinct permutation and keep the palindromes',
      kind: 'brute',
      time: 'O(n! * n)',
      space: 'O(n)',
      blurb:
        'Build every distinct arrangement of the whole string and test each one. Sorting first and skipping a repeated letter whose twin is unused keeps the output free of duplicates. Correct, but almost all of the factorial arrangements fail the test — the second half was never free to vary.',
      code: {
        cpp: {
          lines: [
            'vector<string> generatePalindromes(string s) {',
            '    sort(s.begin(), s.end());',
            '    vector<string> out;',
            '    do {',
            '        bool ok = true;',
            '        for (int l = 0, r = s.size() - 1; l < r; ++l, --r)',
            '            if (s[l] != s[r]) { ok = false; break; }',
            '        if (ok) out.push_back(s);',
            '    } while (next_permutation(s.begin(), s.end()));',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function generatePalindromes(s) {',
            '  const chars = [...s].sort();',
            '  const isPal = (a) => {',
            '    for (let l = 0, r = a.length - 1; l < r; l++, r--) {',
            '      if (a[l] !== a[r]) return false;',
            '    }',
            '    return true;',
            '  };',
            '  const out = [];',
            '  const used = new Array(chars.length).fill(false);',
            '  const cur = [];',
            '  const walk = () => {',
            '    if (cur.length === chars.length) {',
            "      if (isPal(cur)) out.push(cur.join(''));",
            '      return;',
            '    }',
            '    for (let i = 0; i < chars.length; i++) {',
            '      if (used[i]) continue;',
            '      if (i > 0 && chars[i] === chars[i - 1] && !used[i - 1]) continue;',
            '      used[i] = true;',
            '      cur.push(chars[i]);',
            '      walk();',
            '      cur.pop();',
            '      used[i] = false;',
            '    }',
            '  };',
            '  walk();',
            '  return out;',
            '}',
          ],
        },
      },

      run([s]: [string], c) {
        if (s.length > 9) throw new Error('too slow')
        const chars = [...s].sort()
        const isPal = (a: string[]) => {
          for (let l = 0, r = a.length - 1; l < r; l++, r--) {
            c.ops++
            if (a[l] !== a[r]) return false
          }
          return true
        }
        const out: string[] = []
        const used = new Array<boolean>(chars.length).fill(false)
        const cur: string[] = []
        const walk = () => {
          c.ops++
          if (cur.length === chars.length) {
            if (isPal(cur)) out.push(cur.join(''))
            return
          }
          for (let i = 0; i < chars.length; i++) {
            if (used[i]) continue
            if (i > 0 && chars[i] === chars[i - 1] && !used[i - 1]) continue
            used[i] = true
            cur.push(chars[i])
            walk()
            cur.pop()
            used[i] = false
          }
        }
        walk()
        return out
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'permute-half',
      label: 'Permute half, then mirror it',
      kind: 'optimal',
      time: 'O((n/2)!)',
      space: 'O(n)',
      blurb:
        'A palindrome is decided entirely by its first half plus at most one middle letter, so halve every letter count and permute that much shorter string, mirroring each arrangement to finish it. Every string produced is an answer, and the work shrinks from `n!` to `(n/2)!`. Sorting the half and skipping a repeat whose twin has not been used keeps the output free of duplicates.',
      code: {
        cpp: {
          lines: [
            'vector<string> generatePalindromes(string s) {',
            '    unordered_map<char, int> count;',
            '    for (char c : s) count[c]++;',
            '',
            '    string mid, half;',
            '    for (auto& [c, n] : count) {',
            '        if (n % 2) {',
            '            if (!mid.empty()) return {};',
            '            mid = string(1, c);',
            '        }',
            '        half += string(n / 2, c);',
            '    }',
            '',
            '    sort(half.begin(), half.end());',
            '    vector<string> out;',
            '    do {',
            '        string back(half.rbegin(), half.rend());',
            '        out.push_back(half + mid + back);',
            '    } while (next_permutation(half.begin(), half.end()));',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function generatePalindromes(s) {',
            '  const count = new Map();',
            '  for (const c of s) count.set(c, (count.get(c) ?? 0) + 1);',
            '',
            "  let mid = '';",
            '  const half = [];',
            '  for (const [c, n] of count) {',
            '    if (n % 2) {',
            '      if (mid) return [];',
            '      mid = c;',
            '    }',
            '    for (let i = 0; i < n >> 1; i++) half.push(c);',
            '  }',
            '  half.sort();',
            '',
            '  const out = [];',
            '  const used = new Array(half.length).fill(false);',
            '  const cur = [];',
            '  const walk = () => {',
            '    if (cur.length === half.length) {',
            "      const h = cur.join('');",
            "      out.push(h + mid + [...h].reverse().join(''));",
            '      return;',
            '    }',
            '    for (let i = 0; i < half.length; i++) {',
            '      if (used[i]) continue;',
            '      if (i > 0 && half[i] === half[i - 1] && !used[i - 1]) continue;',
            '      used[i] = true;',
            '      cur.push(half[i]);',
            '      walk();',
            '      cur.pop();',
            '      used[i] = false;',
            '    }',
            '  };',
            '  walk();',
            '  return out;',
            '}',
          ],
        },
      },

      run([s]: [string], c) {
        const count = new Map<string, number>()
        for (const ch of s) count.set(ch, (count.get(ch) ?? 0) + 1)

        let mid = ''
        const half: string[] = []
        for (const [ch, n] of count) {
          if (n % 2) {
            if (mid) return []
            mid = ch
          }
          for (let i = 0; i < n >> 1; i++) half.push(ch)
        }
        half.sort()

        const out: string[] = []
        const used = new Array<boolean>(half.length).fill(false)
        const cur: string[] = []
        const walk = () => {
          c.ops++
          if (cur.length === half.length) {
            const h = cur.join('')
            out.push(h + mid + [...h].reverse().join(''))
            return
          }
          for (let i = 0; i < half.length; i++) {
            if (used[i]) continue
            if (i > 0 && half[i] === half[i - 1] && !used[i - 1]) continue
            used[i] = true
            cur.push(half[i])
            walk()
            cur.pop()
            used[i] = false
          }
        }
        walk()
        return out
      },
    },
  ],
}
