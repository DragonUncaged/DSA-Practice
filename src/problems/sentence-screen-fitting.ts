import type { Problem } from '@/lib/types'

export const sentenceScreenFitting: Problem = {
  id: 'sentence-screen-fitting',
  title: 'Sentence Screen Fitting',
  group: 'Medium',
  pattern: 'Simulation',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/sentence-screen-fitting/',
  statement:
    'Given a `rows x cols` screen and a `sentence` given as a list of words, return how many complete copies of the sentence fit. Words keep their order, a word is never split across lines, and consecutive words on a line are separated by one space.',
  constraints: [
    '1 <= sentence.length <= 100',
    '1 <= sentence[i].length <= 10',
    'sentence[i] consists of lowercase English letters',
    '1 <= rows, cols <= 2 * 10^4',
  ],
  signature: {
    fn: 'wordsTyping',
    params: [
      { name: 'sentence', type: 'string[]' },
      { name: 'rows', type: 'int' },
      { name: 'cols', type: 'int' },
    ],
    ret: 'int',
  },
  tests: [
    { args: [['hello', 'world'], 2, 8], expect: 1 },
    { args: [['a', 'bcd', 'e'], 3, 6], expect: 2 },
    { args: [['i', 'had', 'apple', 'pie'], 4, 5], expect: 1 },
    { args: [['a'], 1, 1], expect: 1, note: 'the tightest fit' },
    { args: [['abc'], 1, 2], expect: 0, note: 'the word is wider than the screen' },
    { args: [['a', 'b'], 1, 3], expect: 1 },
    { args: [['a'], 10000, 1], expect: 10000, note: 'one letter per row' },
  ],
  demo: [['a', 'bcd', 'e'], 3, 6],
  starter: {
    js: `function wordsTyping(sentence, rows, cols) {
  // sentence: string[], rows: number, cols: number  ->  number
}
`,
    cpp: `int wordsTyping(vector<string>& sentence, int rows, int cols) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'cursor-in-loop',
      label: 'Advance one cursor through the repeating sentence',
      kind: 'optimal',
      time: 'O(rows * cols)',
      space: 'O(n)',
      blurb:
        'Join the words into one string that ends with a space and treat it as endless. Each row advances the cursor by `cols`: if it lands on a space, step past it, otherwise walk back to the start of the word it cut in half. The cursor divided by the sentence length is how many full copies were written.',
      code: {
        cpp: {
          lines: [
            'int wordsTyping(vector<string>& sentence, int rows, int cols) {',
            '    string s;',
            "    for (const string& w : sentence) s += w + ' ';",
            '    int len = s.size();',
            '',
            '    int at = 0;',
            '    for (int r = 0; r < rows; ++r) {',
            '        at += cols;',
            "        if (s[at % len] == ' ') {",
            '            ++at;',
            '        } else {',
            "            while (at > 0 && s[(at - 1) % len] != ' ') --at;",
            '        }',
            '    }',
            '    return at / len;',
            '}',
          ],
        },
        js: {
          lines: [
            'function wordsTyping(sentence, rows, cols) {',
            "  const s = sentence.join(' ') + ' ';",
            '  const len = s.length;',
            '',
            '  let at = 0;',
            '  for (let r = 0; r < rows; r++) {',
            '    at += cols;',
            "    if (s[at % len] === ' ') {",
            '      at++;',
            '    } else {',
            "      while (at > 0 && s[(at - 1) % len] !== ' ') at--;",
            '    }',
            '  }',
            '  return Math.floor(at / len);',
            '}',
          ],
        },
      },

      run([sentence, rows, cols]: [string[], number, number], c) {
        const s = sentence.join(' ') + ' '
        const len = s.length
        let at = 0
        for (let r = 0; r < rows; r++) {
          c.ops++
          at += cols
          if (s[at % len] === ' ') {
            at++
          } else {
            while (at > 0 && s[(at - 1) % len] !== ' ') {
              c.ops++
              at--
            }
          }
        }
        return Math.floor(at / len)
      },
    },
  ],
}
