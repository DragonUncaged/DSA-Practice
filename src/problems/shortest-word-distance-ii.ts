import type { Problem } from '@/lib/types'

export const shortestWordDistanceII: Problem = {
  id: 'shortest-word-distance-ii',
  title: 'Shortest Word Distance II',
  group: 'Medium',
  pattern: 'Hash Map',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/shortest-word-distance-ii/',
  statement:
    'Shortest Word Distance asked once; here the same `wordsDict` is queried thousands of times, so rescanning it per query is too slow. Given `wordsDict` and a list of `queries`, each a pair of different words, return the shortest distance for each query. Index the array once, then answer every query from the index.',
  constraints: [
    '1 <= wordsDict.length <= 3 * 10^4',
    '1 <= wordsDict[i].length <= 10',
    'wordsDict[i] consists of lowercase English letters',
    'Both words of a query are in wordsDict, and they differ',
    'At most 5000 queries are made',
  ],
  signature: {
    fn: 'shortest',
    params: [
      { name: 'wordsDict', type: 'string[]' },
      { name: 'queries', type: 'string[][]' },
    ],
    ret: 'int[]',
  },
  tests: [
    {
      args: [
        ['practice', 'makes', 'perfect', 'coding', 'makes'],
        [
          ['coding', 'practice'],
          ['makes', 'coding'],
        ],
      ],
      expect: [3, 1],
    },
    {
      args: [['a', 'b'], [['a', 'b']]],
      expect: [1],
      note: 'one query on the shortest array',
    },
    {
      args: [['a', 'x', 'x', 'b', 'a'], [['a', 'b']]],
      expect: [1],
      note: 'the second a is closer than the first',
    },
    {
      args: [
        ['one', 'two', 'three', 'two', 'one'],
        [
          ['one', 'two'],
          ['one', 'three'],
          ['two', 'three'],
        ],
      ],
      expect: [1, 2, 1],
      note: 'three queries over one index',
    },
  ],
  demo: [
    ['practice', 'makes', 'perfect', 'coding', 'makes'],
    [
      ['coding', 'practice'],
      ['makes', 'coding'],
    ],
  ],
  starter: {
    js: `function shortest(wordsDict, queries) {
  // wordsDict: string[], queries: string[][]  ->  number[]
}
`,
    cpp: `vector<int> shortest(vector<string>& wordsDict, vector<vector<string>>& queries) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'index-merge',
      label: 'Index the positions, then merge two lists',
      kind: 'optimal',
      time: 'O(n + q * (a + b))',
      space: 'O(n)',
      blurb:
        'One pass records every position of every word. Each word list is already sorted, so a query walks the two lists together the way merge does, always advancing the smaller index — the closest pair shows up on the way.',
      code: {
        cpp: {
          lines: [
            'vector<int> shortest(vector<string>& wordsDict, vector<vector<string>>& queries) {',
            '    unordered_map<string, vector<int>> at;',
            '    for (int i = 0; i < (int)wordsDict.size(); ++i) at[wordsDict[i]].push_back(i);',
            '',
            '    vector<int> out;',
            '    for (auto& qy : queries) {',
            '        const vector<int>& a = at[qy[0]];',
            '        const vector<int>& b = at[qy[1]];',
            '        int i = 0, j = 0, best = INT_MAX;',
            '        while (i < (int)a.size() && j < (int)b.size()) {',
            '            best = min(best, abs(a[i] - b[j]));',
            '            if (a[i] < b[j]) ++i; else ++j;',
            '        }',
            '        out.push_back(best);',
            '    }',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function shortest(wordsDict, queries) {',
            '  const at = new Map();',
            '  wordsDict.forEach((w, i) => {',
            '    if (!at.has(w)) at.set(w, []);',
            '    at.get(w).push(i);',
            '  });',
            '',
            '  return queries.map(([w1, w2]) => {',
            '    const a = at.get(w1) ?? [];',
            '    const b = at.get(w2) ?? [];',
            '    let i = 0, j = 0, best = Infinity;',
            '    while (i < a.length && j < b.length) {',
            '      best = Math.min(best, Math.abs(a[i] - b[j]));',
            '      if (a[i] < b[j]) i++; else j++;',
            '    }',
            '    return best;',
            '  });',
            '}',
          ],
        },
      },

      run([words, queries]: [string[], string[][]], c) {
        const at = new Map<string, number[]>()
        words.forEach((w, i) => {
          c.ops++
          if (!at.has(w)) at.set(w, [])
          at.get(w)!.push(i)
        })
        return queries.map(([w1, w2]) => {
          const a = at.get(w1) ?? []
          const b = at.get(w2) ?? []
          let i = 0
          let j = 0
          let best = Infinity
          while (i < a.length && j < b.length) {
            c.ops++
            best = Math.min(best, Math.abs(a[i] - b[j]))
            if (a[i] < b[j]) i++
            else j++
          }
          return best
        })
      },
    },
  ],
}
