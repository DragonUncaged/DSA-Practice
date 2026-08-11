import type { Problem } from '@/lib/types'

export const shortestWordDistanceIII: Problem = {
  id: 'shortest-word-distance-iii',
  title: 'Shortest Word Distance III',
  group: 'Medium',
  pattern: 'Array Scan',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/shortest-word-distance-iii/',
  statement:
    'Given `wordsDict` and two words `word1` and `word2` that both occur in it, return the shortest index distance between them. Unlike the first version, `word1` and `word2` may be the same word, in which case the answer is the gap between two of its occurrences.',
  constraints: [
    '1 <= wordsDict.length <= 10^5',
    '1 <= wordsDict[i].length <= 10',
    'wordsDict[i] consists of lowercase English letters',
    'word1 and word2 are both in wordsDict',
  ],
  signature: {
    fn: 'shortestWordDistance',
    params: [
      { name: 'wordsDict', type: 'string[]' },
      { name: 'word1', type: 'string' },
      { name: 'word2', type: 'string' },
    ],
    ret: 'int',
  },
  tests: [
    { args: [['practice', 'makes', 'perfect', 'coding', 'makes'], 'makes', 'coding'], expect: 1 },
    {
      args: [['practice', 'makes', 'perfect', 'coding', 'makes'], 'makes', 'makes'],
      expect: 3,
      note: 'the same word twice',
    },
    { args: [['a', 'a'], 'a', 'a'], expect: 1, note: 'adjacent repeats' },
    { args: [['a', 'b', 'a'], 'a', 'b'], expect: 1 },
    {
      args: [['a', 'x', 'x', 'a', 'x', 'a'], 'a', 'a'],
      expect: 2,
      note: 'closest pair is the last two',
    },
    { args: [['a', 'b', 'c', 'a'], 'a', 'a'], expect: 3, note: 'the same word at both ends' },
  ],
  scale: (n) => [Array.from({ length: n }, (_, i) => (i % 3 ? 'x' : 'a')), 'a', 'a'],
  demo: [['practice', 'makes', 'perfect', 'coding', 'makes'], 'makes', 'makes'],
  starter: {
    js: `function shortestWordDistance(wordsDict, word1, word2) {
  // wordsDict: string[], word1: string, word2: string  ->  number
}
`,
    cpp: `int shortestWordDistance(vector<string>& wordsDict, string word1, string word2) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'every-pair',
      label: 'Compare every pair of distinct indices',
      kind: 'brute',
      time: 'O(n^2)',
      space: 'O(1)',
      blurb:
        'For each index holding `word1`, scan every other index for `word2` and keep the smallest gap. Skipping `j == i` is what makes the same-word case correct, but the scan is still quadratic.',
      code: {
        cpp: {
          lines: [
            'int shortestWordDistance(vector<string>& wordsDict, string word1, string word2) {',
            '    int best = wordsDict.size();',
            '    for (int i = 0; i < (int)wordsDict.size(); ++i) {',
            '        if (wordsDict[i] != word1) continue;',
            '        for (int j = 0; j < (int)wordsDict.size(); ++j) {',
            '            if (j != i && wordsDict[j] == word2) best = min(best, abs(i - j));',
            '        }',
            '    }',
            '    return best;',
            '}',
          ],
        },
        js: {
          lines: [
            'function shortestWordDistance(wordsDict, word1, word2) {',
            '  let best = wordsDict.length;',
            '  for (let i = 0; i < wordsDict.length; i++) {',
            '    if (wordsDict[i] !== word1) continue;',
            '    for (let j = 0; j < wordsDict.length; j++) {',
            '      if (j !== i && wordsDict[j] === word2) best = Math.min(best, Math.abs(i - j));',
            '    }',
            '  }',
            '  return best;',
            '}',
          ],
        },
      },

      run([words, word1, word2]: [string[], string, string], c) {
        let best = words.length
        for (let i = 0; i < words.length; i++) {
          if (words[i] !== word1) continue
          for (let j = 0; j < words.length; j++) {
            c.ops++
            if (j !== i && words[j] === word2) best = Math.min(best, Math.abs(i - j))
          }
        }
        return best
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'last-seen',
      label: 'One cursor each, swapped when the words match',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'The two-cursor scan from Shortest Word Distance replaces the inner loop; the only new case is `word1 == word2`, where a hit should update one cursor and push the previous value into the other. Swapping the pair before writing does exactly that, so a single linear loop handles both cases.',
      code: {
        cpp: {
          lines: [
            'int shortestWordDistance(vector<string>& wordsDict, string word1, string word2) {',
            '    bool same = word1 == word2;',
            '    int i1 = -1, i2 = -1, best = wordsDict.size();',
            '    for (int i = 0; i < (int)wordsDict.size(); ++i) {',
            '        if (wordsDict[i] == word1) {',
            '            if (same) i2 = i1;',
            '            i1 = i;',
            '        } else if (wordsDict[i] == word2) {',
            '            i2 = i;',
            '        }',
            '        if (i1 >= 0 && i2 >= 0) best = min(best, abs(i1 - i2));',
            '    }',
            '    return best;',
            '}',
          ],
        },
        js: {
          lines: [
            'function shortestWordDistance(wordsDict, word1, word2) {',
            '  const same = word1 === word2;',
            '  let i1 = -1;',
            '  let i2 = -1;',
            '  let best = wordsDict.length;',
            '  for (let i = 0; i < wordsDict.length; i++) {',
            '    if (wordsDict[i] === word1) {',
            '      if (same) i2 = i1;',
            '      i1 = i;',
            '    } else if (wordsDict[i] === word2) {',
            '      i2 = i;',
            '    }',
            '    if (i1 >= 0 && i2 >= 0) best = Math.min(best, Math.abs(i1 - i2));',
            '  }',
            '  return best;',
            '}',
          ],
        },
      },

      run([words, word1, word2]: [string[], string, string], c) {
        const same = word1 === word2
        let i1 = -1
        let i2 = -1
        let best = words.length
        for (let i = 0; i < words.length; i++) {
          c.ops++
          if (words[i] === word1) {
            if (same) i2 = i1
            i1 = i
          } else if (words[i] === word2) {
            i2 = i
          }
          if (i1 >= 0 && i2 >= 0) best = Math.min(best, Math.abs(i1 - i2))
        }
        return best
      },
    },
  ],
}
