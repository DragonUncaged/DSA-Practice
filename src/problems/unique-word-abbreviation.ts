import type { Problem } from '@/lib/types'

export const uniqueWordAbbreviation: Problem = {
  id: 'unique-word-abbreviation',
  title: 'Unique Word Abbreviation',
  group: 'Medium',
  pattern: 'Hash Map',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/unique-word-abbreviation/',
  statement:
    'A word abbreviates to its first letter, the count of letters between, and its last letter — `dog` becomes `d1g` and `internationalization` becomes `i18n`. A word of two letters or fewer abbreviates to itself. Given a `dictionary` and a list of `words`, return `1` for each word whose abbreviation is either absent from the dictionary or shared only with itself, and `0` otherwise.',
  constraints: [
    '1 <= dictionary.length <= 3 * 10^4',
    '1 <= dictionary[i].length <= 20',
    '1 <= words[i].length <= 20',
    'All words consist of lowercase English letters',
    'At most 5000 queries are made',
  ],
  signature: {
    fn: 'isUnique',
    params: [
      { name: 'dictionary', type: 'string[]' },
      { name: 'words', type: 'string[]' },
    ],
    ret: 'int[]',
  },
  tests: [
    {
      args: [
        ['deer', 'door', 'cake', 'card'],
        ['dear', 'cart', 'cane', 'make', 'cake'],
      ],
      expect: [0, 1, 0, 1, 1],
    },
    { args: [['a'], ['a']], expect: [1], note: 'a one-letter word abbreviates to itself' },
    { args: [['it', 'at'], ['it']], expect: [1], note: 'two letters abbreviate to themselves' },
    {
      args: [['deer', 'deer'], ['deer']],
      expect: [1],
      note: 'a duplicate in the dictionary is still one word',
    },
    { args: [['hello'], ['world']], expect: [1], note: 'different abbreviation entirely' },
  ],
  demo: [
    ['deer', 'door', 'cake', 'card'],
    ['dear', 'cart', 'cane', 'make', 'cake'],
  ],
  starter: {
    js: `function isUnique(dictionary, words) {
  // dictionary: string[], words: string[]  ->  number[]
}
`,
    cpp: `vector<int> isUnique(vector<string>& dictionary, vector<string>& words) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'abbr-count',
      label: 'Count distinct dictionary words per abbreviation',
      kind: 'optimal',
      time: 'O(d + q)',
      space: 'O(d)',
      blurb:
        'Build the abbreviation index once, counting only distinct words so a duplicated entry does not look like a clash. A query is then unique when its abbreviation is unseen, or when exactly one word owns it and that word is the query itself.',
      code: {
        cpp: {
          lines: [
            'static string abbr(const string& w) {',
            '    if (w.size() < 3) return w;',
            '    return string(1, w.front()) + to_string(w.size() - 2) + w.back();',
            '}',
            '',
            'vector<int> isUnique(vector<string>& dictionary, vector<string>& words) {',
            '    unordered_set<string> dict(dictionary.begin(), dictionary.end());',
            '    unordered_map<string, int> count;',
            '    for (const string& w : dict) count[abbr(w)]++;',
            '',
            '    vector<int> out;',
            '    for (const string& w : words) {',
            '        string a = abbr(w);',
            '        int n = count.count(a) ? count[a] : 0;',
            '        out.push_back(n == 0 || (n == 1 && dict.count(w)) ? 1 : 0);',
            '    }',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function isUnique(dictionary, words) {',
            '  const abbr = (w) =>',
            '    w.length < 3 ? w : w[0] + (w.length - 2) + w[w.length - 1];',
            '',
            '  const dict = new Set(dictionary);',
            '  const count = new Map();',
            '  for (const w of dict) {',
            '    const a = abbr(w);',
            '    count.set(a, (count.get(a) ?? 0) + 1);',
            '  }',
            '',
            '  return words.map((w) => {',
            '    const n = count.get(abbr(w)) ?? 0;',
            '    return n === 0 || (n === 1 && dict.has(w)) ? 1 : 0;',
            '  });',
            '}',
          ],
        },
      },

      run([dictionary, words]: [string[], string[]], c) {
        const abbr = (w: string) => (w.length < 3 ? w : w[0] + (w.length - 2) + w[w.length - 1])
        const dict = new Set(dictionary)
        const count = new Map<string, number>()
        for (const w of dict) {
          c.ops++
          const a = abbr(w)
          count.set(a, (count.get(a) ?? 0) + 1)
        }
        return words.map((w) => {
          c.ops++
          const n = count.get(abbr(w)) ?? 0
          return n === 0 || (n === 1 && dict.has(w)) ? 1 : 0
        })
      },
    },
  ],
}
