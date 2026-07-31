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
    { args: [['great'], ['fine'], [['fine', 'great']]], expect: true, note: 'a pair works in both directions' },
    {
      args: [['great'], ['good'], [['great', 'fine'], ['fine', 'good']]],
      expect: false,
      note: 'similarity is not transitive',
    },
    { args: [[], [], []], expect: true, note: 'two empty sentences' },
    { args: [['a', 'b'], ['b', 'a'], [['a', 'b']]], expect: true },
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
      id: 'scan-pairs',
      label: 'Scan the pair list at every position',
      kind: 'brute',
      time: 'O(n * p)',
      space: 'O(1)',
      blurb:
        'Walk the two sentences together. Where the words differ, look through the whole pair list for a pair holding both words in either order, and give up if no pair does. It stores nothing, but every mismatched position re-reads the entire list, so long sentences against long pair lists multiply out.',
      code: {
        cpp: {
          lines: [
            'bool areSentencesSimilar(vector<string>& words1, vector<string>& words2,',
            '                         vector<vector<string>>& pairs) {',
            '    if (words1.size() != words2.size()) return false;',
            '    for (size_t i = 0; i < words1.size(); ++i) {',
            '        if (words1[i] == words2[i]) continue;',
            '        bool found = false;',
            '        for (auto& p : pairs)',
            '            if ((p[0] == words1[i] && p[1] == words2[i]) ||',
            '                (p[1] == words1[i] && p[0] == words2[i])) { found = true; break; }',
            '        if (!found) return false;',
            '    }',
            '    return true;',
            '}',
          ],
        },
        js: {
          lines: [
            'function areSentencesSimilar(words1, words2, pairs) {',
            '  if (words1.length !== words2.length) return false;',
            '  for (let i = 0; i < words1.length; i++) {',
            '    if (words1[i] === words2[i]) continue;',
            '    const found = pairs.some(',
            '      ([a, b]) => (a === words1[i] && b === words2[i]) || (b === words1[i] && a === words2[i]),',
            '    );',
            '    if (!found) return false;',
            '  }',
            '  return true;',
            '}',
          ],
        },
      },
      run([words1, words2, pairs]: [string[], string[], string[][]], c) {
        if (words1.length !== words2.length) return false
        for (let i = 0; i < words1.length; i++) {
          if (words1[i] === words2[i]) continue
          let found = false
          for (const [a, b] of pairs) {
            c.ops++
            if ((a === words1[i] && b === words2[i]) || (b === words1[i] && a === words2[i])) {
              found = true
              break
            }
          }
          if (!found) return false
        }
        return true
      },
    },
    {
      id: 'pair-set',
      label: 'Put the pairs in a set',
      kind: 'optimal',
      time: 'O(n + p)',
      space: 'O(p)',
      blurb:
        'Rescanning the list is the waste: every allowed substitution is exactly one listed pair, so store the pairs in a set keyed both ways round and each position becomes a constant-time lookup. Because similarity is not transitive there are no groups to merge — union-find would be the wrong tool here.',
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
