import type { Problem } from '@/lib/types'

export const reverseStringII: Problem = {
  id: 'reverse-string-ii',
  title: 'Reverse String II',
  group: 'String',
  pattern: 'Block Sweep',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/reverse-string-ii/',
  statement:
    'Given a string `s` and an integer `k`, reverse the first `k` characters of every `2k` characters counted from the start. If fewer than `k` characters remain, reverse all of them; if between `k` and `2k` remain, reverse the first `k` and leave the rest alone.',
  constraints: ['1 <= s.length <= 10^4', '1 <= k <= 10^4', 'Lowercase English letters'],
  signature: {
    fn: 'reverseStr',
    params: [
      { name: 's', type: 'string' },
      { name: 'k', type: 'int' },
    ],
    ret: 'string',
  },
  tests: [
    { args: ['abcdefg', 2], expect: 'bacdfeg' },
    { args: ['abcd', 2], expect: 'bacd' },
    { args: ['abcdefg', 8], expect: 'gfedcba', note: 'fewer than k left, so reverse it all' },
    { args: ['a', 1], expect: 'a' },
    { args: ['abcdefg', 1], expect: 'abcdefg', note: 'k = 1 reverses single characters' },
    { args: ['abcdefg', 3], expect: 'cbadefg', note: 'the tail of 1 is between 0 and k, reversed whole' },
    { args: ['abcde', 3], expect: 'cbade', note: 'between k and 2k remain, so only the first k flip' },
    { args: ['abcdef', 3], expect: 'cbadef', note: 'exactly 2k characters' },
    { args: ['ab'.repeat(5000), 2], expect: 'baab'.repeat(2500), note: 'the longest string' },
  ],
  demo: ['abcdefg', 2],
  scale: (n) => ['ab'.repeat(Math.max(1, n >> 1)), 3],
  starter: {
    js: `function reverseStr(s, k) {
  // s: string, k: number  ->  string
}
`,
    cpp: `string reverseStr(string s, int k) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'stride',
      label: 'Step by 2k, reverse the head of each block',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'The rule reads as three cases, but they collapse into one: reverse from `i` up to `min(i + k, n)`. Striding the start index by `2k` handles the skipped halves for free, and clamping the end handles the short tail without a special branch. There is no slower rung: every character is touched at most once, and slicing the string into chunks is this loop with extra copies.',
      code: {
        cpp: {
          lines: [
            'string reverseStr(string s, int k) {',
            '    int n = s.size();',
            '    for (int i = 0; i < n; i += 2 * k)',
            '        reverse(s.begin() + i, s.begin() + min(i + k, n));',
            '    return s;',
            '}',
          ],
        },
        js: {
          lines: [
            'function reverseStr(s, k) {',
            '  const a = s.split("");',
            '  for (let i = 0; i < a.length; i += 2 * k) {',
            '    let lo = i, hi = Math.min(i + k, a.length) - 1;',
            '    while (lo < hi) { [a[lo], a[hi]] = [a[hi], a[lo]]; lo++; hi--; }',
            '  }',
            '  return a.join("");',
            '}',
          ],
        },
      },

      run([s, k]: [string, number], c) {
        const a = s.split('')
        for (let i = 0; i < a.length; i += 2 * k) {
          let lo = i
          let hi = Math.min(i + k, a.length) - 1
          while (lo < hi) {
            c.ops++
            const t = a[lo]
            a[lo] = a[hi]
            a[hi] = t
            lo++
            hi--
          }
        }
        return a.join('')
      },
    },
  ],
}
