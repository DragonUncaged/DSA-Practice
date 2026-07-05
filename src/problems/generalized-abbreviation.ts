import type { Problem } from '@/lib/types'

export const generalizedAbbreviation: Problem = {
  id: 'generalized-abbreviation',
  title: 'Generalized Abbreviation',
  group: 'Medium',
  pattern: 'Backtracking',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/generalized-abbreviation/',
  statement:
    'An abbreviation of a word replaces any set of non-overlapping, non-adjacent substrings with their lengths — `"abcde"` can become `"a3e"`, `"1bcd1"`, `"5"` or stay as it is, but never `"23"`, because those two runs touch. Given `word`, return every abbreviation, in any order.',
  constraints: ['1 <= word.length <= 15', 'word consists of lowercase English letters'],
  signature: {
    fn: 'generateAbbreviations',
    params: [{ name: 'word', type: 'string' }],
    ret: 'string[]',
  },
  compare: 'sorted',
  tests: [
    {
      args: ['word'],
      expect: [
        '4',
        '3d',
        '2r1',
        '2rd',
        '1o2',
        '1o1d',
        '1or1',
        '1ord',
        'w3',
        'w2d',
        'w1r1',
        'w1rd',
        'wo2',
        'wo1d',
        'wor1',
        'word',
      ],
    },
    { args: ['a'], expect: ['1', 'a'], note: 'one letter, two abbreviations' },
    { args: ['ab'], expect: ['2', '1b', 'a1', 'ab'] },
  ],
  demo: ['word'],
  starter: {
    js: `function generateAbbreviations(word) {
  // word: string  ->  string[]
}
`,
    cpp: `vector<string> generateAbbreviations(string word) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'keep-or-count',
      label: 'At each position, keep the letter or start a count',
      kind: 'optimal',
      time: 'O(2^n * n)',
      space: 'O(n)',
      blurb:
        'Every letter is either written out or swallowed by a number, which is one binary choice per position. Carrying "did I just write a number?" down the recursion is what forbids two adjacent counts, so the run has to be closed by a letter before another can open.',
      code: {
        cpp: {
          lines: [
            'vector<string> generateAbbreviations(string word) {',
            '    vector<string> out;',
            '',
            '    function<void(int, string, bool)> walk = [&](int i, string acc, bool afterNumber) {',
            '        if (i == (int)word.size()) { out.push_back(acc); return; }',
            '',
            '        walk(i + 1, acc + word[i], false);',
            '        if (afterNumber) return;',
            '        for (int len = 1; i + len <= (int)word.size(); ++len) {',
            '            walk(i + len, acc + to_string(len), true);',
            '        }',
            '    };',
            '',
            '    walk(0, "", false);',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function generateAbbreviations(word) {',
            '  const out = [];',
            '',
            '  const walk = (i, acc, afterNumber) => {',
            '    if (i === word.length) { out.push(acc); return; }',
            '',
            '    walk(i + 1, acc + word[i], false);',
            '    if (afterNumber) return;',
            '    for (let len = 1; i + len <= word.length; len++) {',
            '      walk(i + len, acc + len, true);',
            '    }',
            '  };',
            '',
            "  walk(0, '', false);",
            '  return out;',
            '}',
          ],
        },
      },

      run([word]: [string], c) {
        const out: string[] = []
        const walk = (i: number, acc: string, afterNumber: boolean) => {
          c.ops++
          if (i === word.length) {
            out.push(acc)
            return
          }
          walk(i + 1, acc + word[i], false)
          if (afterNumber) return
          for (let len = 1; i + len <= word.length; len++) walk(i + len, acc + len, true)
        }
        walk(0, '', false)
        return out
      },
    },
  ],
}
