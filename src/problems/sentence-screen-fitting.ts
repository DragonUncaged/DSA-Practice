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
    { args: [['ab', 'cd'], 1, 20000], expect: 3333, note: 'a very wide row holds many copies: six columns each' },
    { args: [['abcdefghij'], 3, 10], expect: 3, note: 'the widest word exactly fills the row' },
    { args: [['a', 'bb', 'ccc'], 2, 3], expect: 0, note: 'no row ever reaches the end' },
  ],
  scale: (n) => [['ab', 'cde', 'f'], n, 7],
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
      id: 'simulate-words',
      label: 'Place the words one at a time, row by row',
      kind: 'brute',
      time: 'O(rows * cols)',
      space: 'O(1)',
      blurb:
        'Fill each row greedily: while the next word fits, write it and a space, wrapping back to the first word and counting a copy whenever the sentence runs out. Correct, and exactly how the screen would be typed — every word on every row is handled individually.',
      code: {
        cpp: {
          lines: [
            'int wordsTyping(vector<string>& sentence, int rows, int cols) {',
            '    int idx = 0, copies = 0, n = sentence.size();',
            '    for (int r = 0; r < rows; ++r) {',
            '        int width = 0;',
            '        while (width + (int)sentence[idx].size() <= cols) {',
            '            width += sentence[idx].size() + 1;',
            '            if (++idx == n) { idx = 0; ++copies; }',
            '        }',
            '    }',
            '    return copies;',
            '}',
          ],
        },
        js: {
          lines: [
            'function wordsTyping(sentence, rows, cols) {',
            '  let idx = 0;',
            '  let copies = 0;',
            '  for (let r = 0; r < rows; r++) {',
            '    let width = 0;',
            '    while (width + sentence[idx].length <= cols) {',
            '      width += sentence[idx].length + 1;',
            '      if (++idx === sentence.length) { idx = 0; copies++; }',
            '    }',
            '  }',
            '  return copies;',
            '}',
          ],
        },
      },

      run([sentence, rows, cols]: [string[], number, number], c) {
        let idx = 0
        let copies = 0
        for (let r = 0; r < rows; r++) {
          let width = 0
          while (width + sentence[idx].length <= cols) {
            c.ops++
            width += sentence[idx].length + 1
            if (++idx === sentence.length) {
              idx = 0
              copies++
            }
          }
        }
        return copies
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'cursor-in-loop',
      label: 'Advance one cursor through the repeating sentence',
      kind: 'better',
      time: 'O(rows * L)',
      space: 'O(n)',
      blurb:
        "Rather than placing words, jump a whole row at a time. Join the words into one string that ends with a space and treat it as endless. Each row advances the cursor by `cols`: if it lands on a space, step past it, otherwise walk back to the start of the word it cut in half — at most one word's length. The cursor divided by the sentence length is how many full copies were written.",
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
    // -----------------------------------------------------------------------
    {
      id: 'per-start-table',
      label: 'Precompute what a row does from each starting word',
      kind: 'optimal',
      time: 'O(n * cols + rows)',
      space: 'O(n)',
      blurb:
        'A row\'s behaviour depends only on which word it starts with, and there are just `n` words. Work out once, for each starting word, where the next row begins and how many copies the row completes; then every row of the screen is a single table lookup. The rows no longer cost anything proportional to their width.',
      code: {
        cpp: {
          lines: [
            'int wordsTyping(vector<string>& sentence, int rows, int cols) {',
            '    int n = sentence.size();',
            '    vector<int> nextOf(n), doneOf(n);',
            '    for (int i = 0; i < n; ++i) {',
            '        int width = 0, idx = i, done = 0;',
            '        while (width + (int)sentence[idx].size() <= cols) {',
            '            width += sentence[idx].size() + 1;',
            '            if (++idx == n) { idx = 0; ++done; }',
            '        }',
            '        nextOf[i] = idx;',
            '        doneOf[i] = done;',
            '    }',
            '    int idx = 0, copies = 0;',
            '    for (int r = 0; r < rows; ++r) {',
            '        copies += doneOf[idx];',
            '        idx = nextOf[idx];',
            '    }',
            '    return copies;',
            '}',
          ],
        },
        js: {
          lines: [
            'function wordsTyping(sentence, rows, cols) {',
            '  const n = sentence.length;',
            '  // a row starting at word i ends at word nextOf[i] and completes doneOf[i] copies',
            '  const nextOf = new Array(n);',
            '  const doneOf = new Array(n);',
            '  for (let i = 0; i < n; i++) {',
            '    let width = 0, idx = i, done = 0;',
            '    while (width + sentence[idx].length <= cols) {',
            '      width += sentence[idx].length + 1;',
            '      if (++idx === n) { idx = 0; done++; }',
            '    }',
            '    nextOf[i] = idx;',
            '    doneOf[i] = done;',
            '  }',
            '',
            '  let idx = 0;',
            '  let copies = 0;',
            '  for (let r = 0; r < rows; r++) {',
            '    copies += doneOf[idx];',
            '    idx = nextOf[idx];',
            '  }',
            '  return copies;',
            '}',
          ],
        },
      },

      run([sentence, rows, cols]: [string[], number, number], c) {
        const n = sentence.length
        const nextOf = new Array<number>(n)
        const doneOf = new Array<number>(n)
        for (let i = 0; i < n; i++) {
          let width = 0
          let idx = i
          let done = 0
          while (width + sentence[idx].length <= cols) {
            c.ops++
            width += sentence[idx].length + 1
            if (++idx === n) {
              idx = 0
              done++
            }
          }
          nextOf[i] = idx
          doneOf[i] = done
        }
        let idx = 0
        let copies = 0
        for (let r = 0; r < rows; r++) {
          c.ops++
          copies += doneOf[idx]
          idx = nextOf[idx]
        }
        return copies
      },
    },
  ],
}
