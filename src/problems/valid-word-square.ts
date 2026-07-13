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
  ],
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
      id: 'mirror-check',
      label: 'Compare each cell with its mirror',
      kind: 'optimal',
      time: 'O(total letters)',
      space: 'O(1)',
      blurb:
        'The square holds when `words[r][c]` equals `words[c][r]` everywhere. The only subtlety is the ragged edge: a cell at `(r, c)` needs row `c` to exist and to be long enough to hold position `r`, otherwise the mirror is missing and the answer is false.',
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
