import type { Problem } from '@/lib/types'

export const reverseVowelsOfAString: Problem = {
  id: 'reverse-vowels-of-a-string',
  title: 'Reverse Vowels of a String',
  group: 'String',
  pattern: 'Two Pointers',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/reverse-vowels-of-a-string/',
  statement:
    'Reverse only the vowels of `s`, leaving every other character where it is. The vowels are `a`, `e`, `i`, `o` and `u`, in both cases.',
  constraints: ['1 <= s.length <= 3 * 10^5', 's consists of printable ASCII characters'],
  signature: { fn: 'reverseVowels', params: [{ name: 's', type: 'string' }], ret: 'string' },
  tests: [
    { args: ['hello'], expect: 'holle' },
    { args: ['leetcode'], expect: 'leotcede' },
    { args: ['aA'], expect: 'Aa', note: 'case is carried along with the vowel' },
    { args: ['bcd'], expect: 'bcd', note: 'no vowels to move' },
  ],
  demo: ['hello'],
  scale: (n) => ['hello'.repeat(Math.max(1, Math.floor(n / 5)))],
  starter: {
    js: `function reverseVowels(s) {
  // s: string  ->  string
}
`,
    cpp: `string reverseVowels(string s) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'two-pointers',
      label: 'Walk in from both ends, swap vowels',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'Collecting the vowels, reversing them and writing them back needs two passes and a list. Two pointers do it in one: advance each until it sits on a vowel, swap the pair, then step both inward. Consonants are skipped without ever being touched.',
      code: {
        cpp: {
          lines: [
            'string reverseVowels(string s) {',
            '    auto isVowel = [](char ch) {',
            '        return string("aeiouAEIOU").find(ch) != string::npos;',
            '    };',
            '    int lo = 0, hi = (int)s.size() - 1;',
            '    while (lo < hi) {',
            '        while (lo < hi && !isVowel(s[lo])) lo++;',
            '        while (lo < hi && !isVowel(s[hi])) hi--;',
            '        swap(s[lo++], s[hi--]);',
            '    }',
            '    return s;',
            '}',
          ],
        },
        js: {
          lines: [
            'function reverseVowels(s) {',
            '  const a = s.split("");',
            '  const isVowel = (ch) => "aeiouAEIOU".includes(ch);',
            '  let lo = 0, hi = a.length - 1;',
            '  while (lo < hi) {',
            '    while (lo < hi && !isVowel(a[lo])) lo++;',
            '    while (lo < hi && !isVowel(a[hi])) hi--;',
            '    [a[lo], a[hi]] = [a[hi], a[lo]];',
            '    lo++; hi--;',
            '  }',
            '  return a.join("");',
            '}',
          ],
        },
      },

      run([s]: [string], c) {
        const a = s.split('')
        const isVowel = (ch: string) => 'aeiouAEIOU'.includes(ch)
        let lo = 0
        let hi = a.length - 1
        while (lo < hi) {
          while (lo < hi && !isVowel(a[lo])) {
            c.ops++
            lo++
          }
          while (lo < hi && !isVowel(a[hi])) {
            c.ops++
            hi--
          }
          c.ops++
          const t = a[lo]
          a[lo] = a[hi]
          a[hi] = t
          lo++
          hi--
        }
        return a.join('')
      },
    },
  ],
}
