import type { Problem } from '@/lib/types'

export const sentenceSimilarity: Problem = {
  id: 'sentence-similarity',
  title: 'Sentence Similarity',
  group: 'String',
  pattern: 'Hash Set',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/sentence-similarity/',
  statement:
    'Two sentences are given as word arrays `words1` and `words2`, along with a list of similar word `pairs`. The sentences are similar when they have the same length and every position holds either the same word or a similar pair. Similarity is **not** transitive, but every word is similar to itself.',
  constraints: [
    '0 <= words1.length, words2.length <= 1000',
    '0 <= pairs.length <= 2000',
    'Similarity is symmetric but not transitive',
  ],
  signature: {
    fn: 'areSentencesSimilar',
    params: [
      { name: 'words1', type: 'string[]' },
      { name: 'words2', type: 'string[]' },
      { name: 'pairs', type: 'string[][]' },
    ],
    ret: 'bool',
  },
  tests: [
    {
      args: [
        ['great', 'acting', 'skills'],
        ['fine', 'drama', 'talent'],
        [
          ['great', 'fine'],
          ['drama', 'acting'],
          ['skills', 'talent'],
        ],
      ],
      expect: true,
    },
    {
      args: [
        ['great', 'acting', 'skills'],
        ['fine', 'painting', 'talent'],
        [
          ['great', 'fine'],
          ['drama', 'acting'],
          ['skills', 'talent'],
        ],
      ],
      expect: false,
      note: 'painting is similar to nothing',
    },
    { args: [['great'], ['great'], []], expect: true, note: 'a word is similar to itself' },
    {
      args: [['great'], ['doubleplus', 'good'], [['great', 'doubleplus']]],
      expect: false,
      note: 'different lengths can never be similar',
    },
  ],
  demo: [
    ['great', 'acting', 'skills'],
    ['fine', 'drama', 'talent'],
    [
      ['great', 'fine'],
      ['drama', 'acting'],
      ['skills', 'talent'],
    ],
  ],
  starter: {
    js: `function areSentencesSimilar(words1, words2, pairs) {
  // words1: string[], words2: string[], pairs: string[][]  ->  boolean
}
`,
    cpp: `bool areSentencesSimilar(vector<string>& words1, vector<string>& words2,
                         vector<vector<string>>& pairs) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'pair-set',
      label: 'Put the pairs in a set',
      kind: 'optimal',
      time: 'O(n + p)',
      space: 'O(p)',
      blurb:
        'Because similarity is not transitive there are no groups to merge — union-find would be the wrong tool here. Every allowed substitution is exactly one listed pair, so store the pairs in a set keyed both ways round and check each position in constant time.',
      code: {
        cpp: {
          lines: [
            'bool areSentencesSimilar(vector<string>& words1, vector<string>& words2,',
            '                         vector<vector<string>>& pairs) {',
            '    if (words1.size() != words2.size()) return false;',
            '    set<pair<string, string>> ok;',
            '    for (auto& p : pairs) { ok.insert({p[0], p[1]}); ok.insert({p[1], p[0]}); }',
            '    for (size_t i = 0; i < words1.size(); ++i) {',
            '        if (words1[i] == words2[i]) continue;',
            '        if (!ok.count({words1[i], words2[i]})) return false;',
            '    }',
            '    return true;',
            '}',
          ],
        },
        js: {
          lines: [
            'function areSentencesSimilar(words1, words2, pairs) {',
            '  if (words1.length !== words2.length) return false;',
            '  const ok = new Set();',
            '  for (const [a, b] of pairs) { ok.add(a + " " + b); ok.add(b + " " + a); }',
            '  for (let i = 0; i < words1.length; i++) {',
            '    if (words1[i] === words2[i]) continue;',
            '    if (!ok.has(words1[i] + " " + words2[i])) return false;',
            '  }',
            '  return true;',
            '}',
          ],
        },
      },

      run([words1, words2, pairs]: [string[], string[], string[][]], c) {
        if (words1.length !== words2.length) return false
        const ok = new Set<string>()
        for (const [a, b] of pairs) {
          c.ops++
          ok.add(`${a} ${b}`)
          ok.add(`${b} ${a}`)
        }
        for (let i = 0; i < words1.length; i++) {
          c.ops++
          if (words1[i] === words2[i]) continue
          if (!ok.has(`${words1[i]} ${words2[i]}`)) return false
        }
        return true
      },
    },
  ],
}
