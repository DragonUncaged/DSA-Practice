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
    {
      args: [['dear', 'door'], ['dear']],
      expect: [0],
      note: 'the query is in the dictionary but shares d2r with another word',
    },
    {
      args: [['internationalization'], ['intercommunication', 'internationalization']],
      expect: [1, 1],
      note: 'i18n against i16n: different counts, both unique',
    },
  ],
  // dictionary words abbreviate to a5z, queries to a4z: nothing ever matches early
  scale: (n) => [
    Array.from({ length: n }, (_, i) => 'a' + String(i).padStart(5, 'x') + 'z'),
    Array.from({ length: n }, (_, i) => 'a' + String(i).padStart(4, 'y') + 'z'),
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
      id: 'scan-per-query',
      label: 'Scan the dictionary for every query',
      kind: 'brute',
      time: 'O(q * d)',
      space: 'O(1)',
      blurb:
        'For each query, abbreviate every dictionary word and look for one with the same abbreviation but different spelling. Correct, but the dictionary never changes, and thousands of queries re-abbreviate all thirty thousand words each time.',
      code: {
        cpp: {
          lines: [
            'vector<int> isUnique(vector<string>& dictionary, vector<string>& words) {',
            '    auto abbr = [](const string& w) {',
            '        return w.size() < 3 ? w : w.substr(0, 1) + to_string(w.size() - 2) + w.back();',
            '    };',
            '    vector<int> out;',
            '    for (const string& w : words) {',
            '        string a = abbr(w);',
            '        bool unique = true;',
            '        for (const string& d : dictionary)',
            '            if (d != w && abbr(d) == a) { unique = false; break; }',
            '        out.push_back(unique ? 1 : 0);',
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
            '  return words.map((w) => {',
            '    const a = abbr(w);',
            '    for (const d of dictionary) {',
            '      if (d !== w && abbr(d) === a) return 0;',
            '    }',
            '    return 1;',
            '  });',
            '}',
          ],
        },
      },

      run([dictionary, words]: [string[], string[]], c) {
        const abbr = (w: string) => (w.length < 3 ? w : w[0] + (w.length - 2) + w[w.length - 1])
        return words.map((w) => {
          const a = abbr(w)
          for (const d of dictionary) {
            c.ops++
            if (d !== w && abbr(d) === a) return 0
          }
          return 1
        })
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'abbr-count',
      label: 'Count distinct dictionary words per abbreviation',
      kind: 'optimal',
      time: 'O(d + q)',
      space: 'O(d)',
      blurb:
        'Abbreviate the dictionary once instead of once per query. Build an index from abbreviation to the number of distinct words that share it — distinct, so a duplicated entry does not look like a clash. A query is then unique when its abbreviation is unseen, or when exactly one word owns it and that word is the query itself. Each query is two lookups.',
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
