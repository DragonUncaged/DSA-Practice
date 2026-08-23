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
    { args: ['apple', '6'], expect: false, note: 'the count overshoots the word' },
    { args: ['apple', 'a3'], expect: false, note: 'the count stops short' },
    { args: ['hi', '1i'], expect: true },
    { args: ['hi', 'h1e'], expect: false, note: 'abbr runs past the word' },
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
      id: 'enumerate-abbreviations',
      label: 'Generate every abbreviation of the word and look for abbr',
      kind: 'brute',
      time: 'O(2^n * n)',
      space: 'O(n)',
      blurb:
        'Every abbreviation of `word` is one choice per letter — keep it or fold it into a count — so generate them all, the Generalized Abbreviation way, and stop if one equals `abbr`. Correct, and exponential: a twenty-letter word has a million abbreviations, and the answer only ever needed one walk along `abbr`.',
      code: {
        cpp: {
          lines: [
            'bool validWordAbbreviation(string word, string abbr) {',
            '    int n = word.size();',
            '    bool found = false;',
            '    // acc: the abbreviation so far; afterNumber: was the last piece a count?',
            '    function<void(int, string, bool)> walk = [&](int i, string acc, bool afterNumber) {',
            '        if (found || acc.size() > abbr.size()) return;',
            '        if (i == n) { if (acc == abbr) found = true; return; }',
            '        walk(i + 1, acc + word[i], false);',
            '        if (afterNumber) return;',
            '        for (int len = 1; i + len <= n; ++len) walk(i + len, acc + to_string(len), true);',
            '    };',
            '    walk(0, "", false);',
            '    return found;',
            '}',
          ],
        },
        js: {
          lines: [
            'function validWordAbbreviation(word, abbr) {',
            '  const n = word.length;',
            '  let found = false;',
            '  // acc: the abbreviation so far; afterNumber: was the last piece a count?',
            '  const walk = (i, acc, afterNumber) => {',
            '    if (found || acc.length > abbr.length) return;',
            '    if (i === n) { if (acc === abbr) found = true; return; }',
            '    walk(i + 1, acc + word[i], false);',
            '    if (afterNumber) return;',
            '    for (let len = 1; i + len <= n; len++) walk(i + len, acc + len, true);',
            '  };',
            "  walk(0, '', false);",
            '  return found;',
            '}',
          ],
        },
      },

      run([word, abbr]: [string, string], c) {
        if (word.length > 16) throw new Error('too slow')
        const n = word.length
        let found = false
        const walk = (i: number, acc: string, afterNumber: boolean) => {
          c.ops++
          if (found || acc.length > abbr.length) return
          if (i === n) {
            if (acc === abbr) found = true
            return
          }
          walk(i + 1, acc + word[i], false)
          if (afterNumber) return
          for (let len = 1; i + len <= n; len++) walk(i + len, acc + len, true)
        }
        walk(0, '', false)
        return found
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'two-cursors',
      label: 'Walk both strings together',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'There is no need to generate anything: `abbr` itself says how to walk `word`. One cursor per string. A digit in `abbr` reads a whole number and skips that many letters of `word`; a letter has to match. A number starting with `0` is invalid outright, and both cursors must land exactly at the end for the abbreviation to fit.',
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
