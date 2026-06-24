import type { Problem } from '@/lib/types'

export const reverseWordsII: Problem = {
  id: 'reverse-words-in-a-string-ii',
  title: 'Reverse Words in a String II',
  group: 'Medium',
  pattern: 'Two Pointers',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/reverse-words-in-a-string-ii/',
  statement:
    'Given a character array `s` holding words separated by single spaces, reverse the order of the words in place and return the array. A word is a run of non-space characters; there are no leading or trailing spaces.',
  constraints: [
    '1 <= s.length <= 10^5',
    "s[i] is an English letter, a digit, or a space ' '",
    'There is at least one word, and words are separated by exactly one space',
    'Solve it in place, without allocating a second array',
  ],
  signature: {
    fn: 'reverseWords',
    params: [{ name: 's', type: 'string[]' }],
    ret: 'string[]',
  },
  tests: [
    {
      args: [['t', 'h', 'e', ' ', 's', 'k', 'y', ' ', 'i', 's', ' ', 'b', 'l', 'u', 'e']],
      expect: ['b', 'l', 'u', 'e', ' ', 'i', 's', ' ', 's', 'k', 'y', ' ', 't', 'h', 'e'],
    },
    { args: [['a']], expect: ['a'], note: 'one one-letter word' },
    { args: [['a', ' ', 'b']], expect: ['b', ' ', 'a'], note: 'two words' },
    {
      args: [['h', 'i', ' ', 'y', 'o', 'u']],
      expect: ['y', 'o', 'u', ' ', 'h', 'i'],
      note: 'words of different lengths',
    },
  ],
  demo: [['t', 'h', 'e', ' ', 's', 'k', 'y', ' ', 'i', 's', ' ', 'b', 'l', 'u', 'e']],
  starter: {
    js: `function reverseWords(s) {
  // s: string[]  ->  string[]
}
`,
    cpp: `vector<string> reverseWords(vector<string>& s) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'reverse-twice',
      label: 'Reverse everything, then each word',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'Reversing the whole array puts the words in the right order but spells each one backwards. Reversing every word in place afterwards fixes the letters and leaves the order alone.',
      code: {
        cpp: {
          lines: [
            'vector<string> reverseWords(vector<string>& s) {',
            '    reverse(s.begin(), s.end());',
            '    int n = s.size();',
            '    for (int i = 0; i < n; ) {',
            '        int j = i;',
            '        while (j < n && s[j] != " ") ++j;',
            '        reverse(s.begin() + i, s.begin() + j);',
            '        i = j + 1;',
            '    }',
            '    return s;',
            '}',
          ],
        },
        js: {
          lines: [
            'function reverseWords(s) {',
            '  const flip = (i, j) => {',
            '    while (i < j) {',
            '      const t = s[i]; s[i++] = s[j]; s[j--] = t;',
            '    }',
            '  };',
            '',
            '  flip(0, s.length - 1);',
            '  for (let i = 0; i < s.length; ) {',
            '    let j = i;',
            '    while (j < s.length && s[j] !== " ") j++;',
            '    flip(i, j - 1);',
            '    i = j + 1;',
            '  }',
            '  return s;',
            '}',
          ],
        },
      },

      run([s]: [string[]], c) {
        const flip = (i: number, j: number) => {
          while (i < j) {
            c.ops++
            const t = s[i]
            s[i++] = s[j]
            s[j--] = t
          }
        }
        flip(0, s.length - 1)
        for (let i = 0; i < s.length; ) {
          let j = i
          while (j < s.length && s[j] !== ' ') {
            c.ops++
            j++
          }
          flip(i, j - 1)
          i = j + 1
        }
        return s
      },
    },
  ],
}
