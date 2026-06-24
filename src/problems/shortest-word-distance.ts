import type { Problem } from '@/lib/types'

export const shortestWordDistance: Problem = {
  id: 'shortest-word-distance',
  title: 'Shortest Word Distance',
  group: 'Easy',
  pattern: 'Array Scan',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/shortest-word-distance/',
  statement:
    'Given an array of strings `wordsDict` and two different strings `word1` and `word2` that both occur in it, return the smallest index distance between an occurrence of `word1` and an occurrence of `word2`.',
  constraints: [
    '2 <= wordsDict.length <= 3 * 10^4',
    '1 <= wordsDict[i].length <= 10',
    'wordsDict[i] consists of lowercase English letters',
    'word1 and word2 are both in wordsDict, and word1 != word2',
  ],
  signature: {
    fn: 'shortestDistance',
    params: [
      { name: 'wordsDict', type: 'string[]' },
      { name: 'word1', type: 'string' },
      { name: 'word2', type: 'string' },
    ],
    ret: 'int',
  },
  tests: [
    {
      args: [['practice', 'makes', 'perfect', 'coding', 'makes'], 'coding', 'practice'],
      expect: 3,
    },
    { args: [['practice', 'makes', 'perfect', 'coding', 'makes'], 'makes', 'coding'], expect: 1 },
    { args: [['a', 'b'], 'a', 'b'], expect: 1, note: 'shortest possible array' },
    { args: [['a', 'c', 'b', 'a'], 'a', 'b'], expect: 1, note: 'the later a is the closer one' },
    {
      args: [['x', 'y', 'y', 'y', 'x'], 'x', 'y'],
      expect: 1,
      note: 'repeats on both sides',
    },
  ],
  demo: [['practice', 'makes', 'perfect', 'coding', 'makes'], 'coding', 'practice'],
  starter: {
    js: `function shortestDistance(wordsDict, word1, word2) {
  // wordsDict: string[], word1: string, word2: string  ->  number
}
`,
    cpp: `int shortestDistance(vector<string>& wordsDict, string word1, string word2) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'last-seen',
      label: 'Remember the last index of each word',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'The closest pair always uses the most recent sighting of the other word, so one pass keeping the latest index of each is enough. Every time both have been seen, measure the gap.',
      code: {
        cpp: {
          lines: [
            'int shortestDistance(vector<string>& wordsDict, string word1, string word2) {',
            '    int i1 = -1, i2 = -1;',
            '    int best = wordsDict.size();',
            '    for (int i = 0; i < (int)wordsDict.size(); ++i) {',
            '        if (wordsDict[i] == word1) i1 = i;',
            '        else if (wordsDict[i] == word2) i2 = i;',
            '        if (i1 >= 0 && i2 >= 0) best = min(best, abs(i1 - i2));',
            '    }',
            '    return best;',
            '}',
          ],
        },
        js: {
          lines: [
            'function shortestDistance(wordsDict, word1, word2) {',
            '  let i1 = -1;',
            '  let i2 = -1;',
            '  let best = wordsDict.length;',
            '  for (let i = 0; i < wordsDict.length; i++) {',
            '    if (wordsDict[i] === word1) i1 = i;',
            '    else if (wordsDict[i] === word2) i2 = i;',
            '    if (i1 >= 0 && i2 >= 0) best = Math.min(best, Math.abs(i1 - i2));',
            '  }',
            '  return best;',
            '}',
          ],
        },
      },

      run([words, word1, word2]: [string[], string, string], c) {
        let i1 = -1
        let i2 = -1
        let best = words.length
        for (let i = 0; i < words.length; i++) {
          c.ops++
          if (words[i] === word1) i1 = i
          else if (words[i] === word2) i2 = i
          if (i1 >= 0 && i2 >= 0) best = Math.min(best, Math.abs(i1 - i2))
        }
        return best
      },
    },
  ],
}
