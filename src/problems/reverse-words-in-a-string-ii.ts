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
    {
      args: [['1', '2', ' ', 'a', 'b', ' ', 'c', 'd']],
      expect: ['c', 'd', ' ', 'a', 'b', ' ', '1', '2'],
      note: 'digits count as word characters',
    },
  ],
  scale: (n) => [Array.from({ length: n }, (_, i) => (i % 3 === 2 ? ' ' : 'x'))],
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
      id: 'split-join',
      label: 'Split into words, reverse the list, write it back',
      kind: 'brute',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'Cut the array at the spaces, reverse the list of words, and copy the joined result back over the input. Linear, but it builds a second copy of the whole string, which is exactly what the in-place requirement forbids.',
      code: {
        cpp: {
          lines: [
            'vector<string> reverseWords(vector<string>& s) {',
            '    vector<vector<string>> words(1);',
            '    for (const string& ch : s) {',
            '        if (ch == " ") words.emplace_back();',
            '        else words.back().push_back(ch);',
            '    }',
            '    vector<string> flat;',
            '    for (int w = (int)words.size() - 1; w >= 0; --w) {',
            '        for (const string& ch : words[w]) flat.push_back(ch);',
            '        if (w > 0) flat.push_back(" ");',
            '    }',
            '    for (size_t i = 0; i < s.size(); ++i) s[i] = flat[i];',
            '    return s;',
            '}',
          ],
        },
        js: {
          lines: [
            'function reverseWords(s) {',
            "  const words = s.join('').split(' ');",
            '  words.reverse();',
            "  const flat = words.join(' ').split('');",
            '  for (let i = 0; i < s.length; i++) s[i] = flat[i];',
            '  return s;',
            '}',
          ],
        },
      },

      run([s]: [string[]], c) {
        const words: string[][] = [[]]
        for (const ch of s) {
          c.ops++
          if (ch === ' ') words.push([])
          else words[words.length - 1].push(ch)
        }
        const flat: string[] = []
        for (let w = words.length - 1; w >= 0; w--) {
          for (const ch of words[w]) {
            c.ops++
            flat.push(ch)
          }
          if (w > 0) flat.push(' ')
        }
        for (let i = 0; i < s.length; i++) s[i] = flat[i]
        return s
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'reverse-twice',
      label: 'Reverse everything, then each word',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'The copy can be avoided with two reversals. Reversing the whole array puts the words in the right order but spells each one backwards; reversing every word in place afterwards fixes the letters and leaves the order alone. Both passes swap within the input, so no second array is needed.',
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
