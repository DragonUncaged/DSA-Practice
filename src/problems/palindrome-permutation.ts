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
      id: 'odd-count',
      label: 'Count the letters with an odd count',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'A palindrome pairs every letter around its centre, so at most one letter may appear an odd number of times. Keep a set and toggle membership per character: whatever is left at the end is exactly the odd letters.',
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
