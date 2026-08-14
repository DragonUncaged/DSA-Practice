import type { Problem } from '@/lib/types'

export const palindromePermutation: Problem = {
  id: 'palindrome-permutation',
  title: 'Palindrome Permutation',
  group: 'Easy',
  pattern: 'Hash Map',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/palindrome-permutation/',
  statement:
    'Given a string `s`, return true when some rearrangement of its letters is a palindrome.',
  constraints: ['1 <= s.length <= 5000', 's consists of lowercase English letters'],
  signature: {
    fn: 'canPermutePalindrome',
    params: [{ name: 's', type: 'string' }],
    ret: 'bool',
  },
  tests: [
    { args: ['code'], expect: false },
    { args: ['aab'], expect: true },
    { args: ['carerac'], expect: true },
    { args: ['a'], expect: true, note: 'single character' },
    { args: ['ab'], expect: false, note: 'two odd counts' },
    { args: ['aabb'], expect: true, note: 'even length, no odd count allowed' },
    { args: ['aabbc'], expect: true, note: 'odd length, exactly one odd count' },
    { args: ['abcabcdef'], expect: false, note: 'odd length but three odd counts' },
  ],
  demo: ['carerac'],
  scale: (n) => ['abcdefgh'.repeat(Math.ceil(n / 8)).slice(0, n)],
  starter: {
    js: `function canPermutePalindrome(s) {
  // s: string  ->  boolean
}
`,
    cpp: `bool canPermutePalindrome(string s) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'permute-and-test',
      label: 'Generate permutations until one reads the same backwards',
      kind: 'brute',
      time: 'O(n! * n)',
      space: 'O(n)',
      blurb:
        'Take the question literally: build every distinct arrangement of the letters and stop at the first palindrome. Correct for a handful of characters and hopeless beyond that — the count of arrangements is factorial, while the answer only ever depended on letter counts.',
      code: {
        cpp: {
          lines: [
            'bool canPermutePalindrome(string s) {',
            '    sort(s.begin(), s.end());',
            '    do {',
            '        bool ok = true;',
            '        for (int l = 0, r = s.size() - 1; l < r; ++l, --r)',
            '            if (s[l] != s[r]) { ok = false; break; }',
            '        if (ok) return true;',
            '    } while (next_permutation(s.begin(), s.end()));',
            '    return false;',
            '}',
          ],
        },
        js: {
          lines: [
            'function canPermutePalindrome(s) {',
            "  const chars = [...s].sort();",
            '  const isPal = (a) => {',
            '    for (let l = 0, r = a.length - 1; l < r; l++, r--) {',
            '      if (a[l] !== a[r]) return false;',
            '    }',
            '    return true;',
            '  };',
            '  const used = new Array(chars.length).fill(false);',
            '  const cur = [];',
            '  const walk = () => {',
            '    if (cur.length === chars.length) return isPal(cur);',
            '    for (let i = 0; i < chars.length; i++) {',
            '      if (used[i]) continue;',
            '      if (i > 0 && chars[i] === chars[i - 1] && !used[i - 1]) continue;',
            '      used[i] = true;',
            '      cur.push(chars[i]);',
            '      if (walk()) return true;',
            '      cur.pop();',
            '      used[i] = false;',
            '    }',
            '    return false;',
            '  };',
            '  return walk();',
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
        const used = new Array<boolean>(chars.length).fill(false)
        const cur: string[] = []
        const walk = (): boolean => {
          c.ops++
          if (cur.length === chars.length) return isPal(cur)
          for (let i = 0; i < chars.length; i++) {
            if (used[i]) continue
            if (i > 0 && chars[i] === chars[i - 1] && !used[i - 1]) continue
            used[i] = true
            cur.push(chars[i])
            if (walk()) return true
            cur.pop()
            used[i] = false
          }
          return false
        }
        return walk()
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'odd-count',
      label: 'Count the letters with an odd count',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'No arrangement needs to be built. A palindrome pairs every letter around its centre, so at most one letter may appear an odd number of times. Keep a set and toggle membership per character: whatever is left at the end is exactly the odd letters, and one pass over the string decides.',
      code: {
        cpp: {
          lines: [
            'bool canPermutePalindrome(string s) {',
            '    unordered_set<char> odd;',
            '    for (char c : s) {',
            '        if (odd.count(c)) odd.erase(c);',
            '        else odd.insert(c);',
            '    }',
            '    return odd.size() <= 1;',
            '}',
          ],
        },
        js: {
          lines: [
            'function canPermutePalindrome(s) {',
            '  const odd = new Set();',
            '  for (const c of s) {',
            '    if (odd.has(c)) odd.delete(c);',
            '    else odd.add(c);',
            '  }',
            '  return odd.size <= 1;',
            '}',
          ],
        },
      },

      run([s]: [string], c) {
        const odd = new Set<string>()
        for (const ch of s) {
          c.ops++
          if (odd.has(ch)) odd.delete(ch)
          else odd.add(ch)
        }
        return odd.size <= 1
      },
    },
  ],
}
