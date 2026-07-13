import type { Problem } from '@/lib/types'

export const validWordAbbreviation: Problem = {
  id: 'valid-word-abbreviation',
  title: 'Valid Word Abbreviation',
  group: 'Easy',
  pattern: 'Two Pointers',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/valid-word-abbreviation/',
  statement:
    'An abbreviation replaces any number of non-adjacent, non-empty substrings with their lengths, and those lengths never carry a leading zero. Given `word` and `abbr`, return whether `abbr` is a valid abbreviation of `word`.',
  constraints: [
    '1 <= word.length <= 20',
    'word consists of lowercase English letters',
    '1 <= abbr.length <= 10',
    'abbr consists of lowercase English letters and digits',
  ],
  signature: {
    fn: 'validWordAbbreviation',
    params: [
      { name: 'word', type: 'string' },
      { name: 'abbr', type: 'string' },
    ],
    ret: 'bool',
  },
  tests: [
    { args: ['internationalization', 'i12iz4n'], expect: true },
    { args: ['apple', 'a2e'], expect: false },
    { args: ['apple', '5'], expect: true, note: 'the whole word' },
    { args: ['apple', 'a4'], expect: true },
    { args: ['substitution', 's010n'], expect: false, note: 'leading zero' },
    { args: ['substitution', 's55n'], expect: false, note: 'adjacent replacements' },
    { args: ['substitution', '12'], expect: true },
    { args: ['a', '1'], expect: true, note: 'shortest possible' },
    { args: ['apple', 'apple'], expect: true, note: 'nothing replaced' },
  ],
  demo: ['internationalization', 'i12iz4n'],
  starter: {
    js: `function validWordAbbreviation(word, abbr) {
  // word: string, abbr: string  ->  boolean
}
`,
    cpp: `bool validWordAbbreviation(string word, string abbr) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'two-cursors',
      label: 'Walk both strings together',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'One cursor per string. A digit in `abbr` reads a whole number and skips that many letters of `word`; a letter has to match. A number starting with `0` is invalid outright, and both cursors must land exactly at the end for the abbreviation to fit.',
      code: {
        cpp: {
          lines: [
            'bool validWordAbbreviation(string word, string abbr) {',
            '    size_t i = 0, j = 0;',
            '    while (i < word.size() && j < abbr.size()) {',
            '        if (isdigit(abbr[j])) {',
            "            if (abbr[j] == '0') return false;",
            '            int n = 0;',
            "            while (j < abbr.size() && isdigit(abbr[j])) n = n * 10 + (abbr[j++] - '0');",
            '            i += n;',
            '        } else if (word[i] != abbr[j]) {',
            '            return false;',
            '        } else {',
            '            ++i;',
            '            ++j;',
            '        }',
            '    }',
            '    return i == word.size() && j == abbr.size();',
            '}',
          ],
        },
        js: {
          lines: [
            'function validWordAbbreviation(word, abbr) {',
            '  let i = 0;',
            '  let j = 0;',
            '  while (i < word.length && j < abbr.length) {',
            '    const ch = abbr[j];',
            "    if (ch >= '0' && ch <= '9') {",
            "      if (ch === '0') return false;",
            '      let n = 0;',
            "      while (j < abbr.length && abbr[j] >= '0' && abbr[j] <= '9') {",
            '        n = n * 10 + Number(abbr[j++]);',
            '      }',
            '      i += n;',
            '    } else if (word[i] !== ch) {',
            '      return false;',
            '    } else {',
            '      i++;',
            '      j++;',
            '    }',
            '  }',
            '  return i === word.length && j === abbr.length;',
            '}',
          ],
        },
      },

      run([word, abbr]: [string, string], c) {
        let i = 0
        let j = 0
        while (i < word.length && j < abbr.length) {
          c.ops++
          const ch = abbr[j]
          if (ch >= '0' && ch <= '9') {
            if (ch === '0') return false
            let n = 0
            while (j < abbr.length && abbr[j] >= '0' && abbr[j] <= '9') n = n * 10 + Number(abbr[j++])
            i += n
          } else if (word[i] !== ch) {
            return false
          } else {
            i++
            j++
          }
        }
        return i === word.length && j === abbr.length
      },
    },
  ],
}
