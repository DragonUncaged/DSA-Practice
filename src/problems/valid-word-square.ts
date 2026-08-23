import type { Problem } from '@/lib/types'

export const validWordSquare: Problem = {
  id: 'valid-word-square',
  title: 'Valid Word Square',
  group: 'Easy',
  pattern: 'Matrix',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/valid-word-square/',
  statement:
    'Given an array of strings `words`, return true when row `k` and column `k` read the same for every `k`. Rows may have different lengths, so a column that runs off the end of a row breaks the square.',
  constraints: [
    '1 <= words.length <= 500',
    '1 <= words[i].length <= 500',
    'words[i] consists of lowercase English letters',
  ],
  signature: {
    fn: 'validWordSquare',
    params: [{ name: 'words', type: 'string[]' }],
    ret: 'bool',
  },
  tests: [
    { args: [['abcd', 'bnrt', 'crmy', 'dtye']], expect: true },
    { args: [['abcd', 'bnrt', 'crm', 'dt']], expect: true, note: 'ragged but still square' },
    { args: [['ball', 'area', 'read', 'lady']], expect: false, note: 'row 3 reads read, column 3 lead' },
    { args: [['a']], expect: true, note: 'one letter' },
    { args: [['ab', 'a']], expect: false, note: 'column 1 is one letter short' },
    { args: [['abc', 'b']], expect: false, note: 'column 2 has no row to live in' },
    { args: [['ab', 'ba']], expect: true },
    { args: [['a', 'b']], expect: false, note: 'row 1 exists but column 1 is empty' },
    { args: [['abc', 'b', 'c']], expect: true, note: 'a ragged square whose first row is longest' },
    { args: [['abc', 'bd', 'cd']], expect: false, note: 'column 1 reads bd, row 1 reads bd, but column 2 reads c not cd' },
  ],
  scale: (n) => {
    const side = Math.max(2, Math.round(Math.sqrt(n)))
    return [Array.from({ length: side }, (_, r) => Array.from({ length: side }, (_, c) => String.fromCharCode(97 + ((r + c) % 26))).join(''))]
  },
  demo: [['abcd', 'bnrt', 'crmy', 'dtye']],
  starter: {
    js: `function validWordSquare(words) {
  // words: string[]  ->  boolean
}
`,
    cpp: `bool validWordSquare(vector<string>& words) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'build-columns',
      label: 'Build every column as a string and compare it to its row',
      kind: 'brute',
      time: 'O(total letters)',
      space: 'O(total letters)',
      blurb:
        'Read each column top to bottom into a new string, then check that column `k` spells row `k` and that there are no columns beyond the last row. Correct, and it copies every letter into a second, transposed set of strings just to compare them.',
      code: {
        cpp: {
          lines: [
            'bool validWordSquare(vector<string>& words) {',
            '    size_t width = 0;',
            '    for (const string& w : words) width = max(width, w.size());',
            '    if (width > words.size()) return false;',
            '    vector<string> columns(width);',
            '    for (const string& w : words)',
            '        for (size_t c = 0; c < w.size(); ++c) columns[c] += w[c];',
            '    for (size_t k = 0; k < words.size(); ++k)',
            '        if ((k < width ? columns[k] : string()) != words[k]) return false;',
            '    return true;',
            '}',
          ],
        },
        js: {
          lines: [
            'function validWordSquare(words) {',
            '  const width = Math.max(...words.map((w) => w.length));',
            '  if (width > words.length) return false;',
            "  const columns = new Array(width).fill('');",
            '  for (const w of words) {',
            '    for (let c = 0; c < w.length; c++) columns[c] += w[c];',
            '  }',
            '  for (let k = 0; k < words.length; k++) {',
            "    if ((columns[k] ?? '') !== words[k]) return false;",
            '  }',
            '  return true;',
            '}',
          ],
        },
      },

      run([words]: [string[]], c) {
        const width = Math.max(...words.map((w) => w.length))
        if (width > words.length) return false
        const columns = new Array<string>(width).fill('')
        for (const w of words) {
          for (let col = 0; col < w.length; col++) {
            c.ops++
            columns[col] += w[col]
          }
        }
        for (let k = 0; k < words.length; k++) {
          c.ops++
          if ((columns[k] ?? '') !== words[k]) return false
        }
        return true
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'mirror-check',
      label: 'Compare each cell with its mirror',
      kind: 'optimal',
      time: 'O(total letters)',
      space: 'O(1)',
      blurb:
        'The columns never need to exist: the square holds when `words[r][c]` equals `words[c][r]` everywhere, so compare each cell with its mirror in place. The only subtlety is the ragged edge — a cell at `(r, c)` needs row `c` to exist and to be long enough to hold position `r`, otherwise the mirror is missing and the answer is false. Same pass, no copy.',
      code: {
        cpp: {
          lines: [
            'bool validWordSquare(vector<string>& words) {',
            '    for (size_t r = 0; r < words.size(); ++r) {',
            '        for (size_t c = 0; c < words[r].size(); ++c) {',
            '            if (c >= words.size()) return false;',
            '            if (r >= words[c].size()) return false;',
            '            if (words[r][c] != words[c][r]) return false;',
            '        }',
            '    }',
            '    return true;',
            '}',
          ],
        },
        js: {
          lines: [
            'function validWordSquare(words) {',
            '  for (let r = 0; r < words.length; r++) {',
            '    for (let c = 0; c < words[r].length; c++) {',
            '      if (c >= words.length) return false;',
            '      if (r >= words[c].length) return false;',
            '      if (words[r][c] !== words[c][r]) return false;',
            '    }',
            '  }',
            '  return true;',
            '}',
          ],
        },
      },

      run([words]: [string[]], c) {
        for (let r = 0; r < words.length; r++) {
          for (let col = 0; col < words[r].length; col++) {
            c.ops++
            if (col >= words.length) return false
            if (r >= words[col].length) return false
            if (words[r][col] !== words[col][r]) return false
          }
        }
        return true
      },
    },
  ],
}
