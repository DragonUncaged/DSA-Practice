import type { Problem } from '@/lib/types'

export const wordSquares: Problem = {
  id: 'word-squares',
  title: 'Word Squares',
  group: 'Hard',
  pattern: 'Backtracking',
  difficulty: 'Hard',
  leetcode: 'https://leetcode.com/problems/word-squares/',
  statement:
    'Given an array of unique strings `words`, all of the same length, return every word square that can be built from them. A word may be reused, row `k` and column `k` must read the same, and the squares may come back in any order.',
  constraints: [
    '1 <= words.length <= 1000',
    '1 <= words[i].length <= 4',
    'All words have the same length and are unique',
    'words[i] consists of lowercase English letters',
  ],
  signature: {
    fn: 'wordSquares',
    params: [{ name: 'words', type: 'string[]' }],
    ret: 'string[][]',
  },
  compare: 'sorted',
  tests: [
    {
      args: [['area', 'lead', 'wall', 'lady', 'ball']],
      expect: [
        ['ball', 'area', 'lead', 'lady'],
        ['wall', 'area', 'lead', 'lady'],
      ],
    },
    {
      args: [['abat', 'baba', 'atan', 'atal']],
      expect: [
        ['baba', 'abat', 'baba', 'atal'],
        ['baba', 'abat', 'baba', 'atan'],
      ],
    },
    { args: [['a']], expect: [['a']], note: 'one letter, one square' },
    { args: [['ab', 'ba']], expect: [['ab', 'ba'], ['ba', 'ab']] },
    { args: [['ab', 'cd']], expect: [], note: 'no square at all' },
  ],
  demo: [['area', 'lead', 'wall', 'lady', 'ball']],
  starter: {
    js: `function wordSquares(words) {
  // words: string[]  ->  string[][]
}
`,
    cpp: `vector<vector<string>> wordSquares(vector<string>& words) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'prefix-index',
      label: 'Build row by row against a prefix index',
      kind: 'optimal',
      time: 'O(n * 26^L)',
      space: 'O(n * L)',
      blurb:
        'Once the first `k` rows are chosen, the letters they contribute to column `k` fix the prefix of row `k` — there is nothing to guess. Indexing every word by each of its prefixes turns "what can go here?" into one lookup, so the search only ever explores rows that can still work.',
      code: {
        cpp: {
          lines: [
            'vector<vector<string>> wordSquares(vector<string>& words) {',
            '    int n = words[0].size();',
            '    unordered_map<string, vector<string>> byPrefix;',
            '    for (const string& w : words)',
            '        for (int i = 0; i <= n; ++i) byPrefix[w.substr(0, i)].push_back(w);',
            '',
            '    vector<vector<string>> out;',
            '    vector<string> square;',
            '',
            '    function<void(int)> build = [&](int row) {',
            '        if (row == n) { out.push_back(square); return; }',
            '        string prefix;',
            '        for (int r = 0; r < row; ++r) prefix += square[r][row];',
            '        for (const string& w : byPrefix[prefix]) {',
            '            square.push_back(w);',
            '            build(row + 1);',
            '            square.pop_back();',
            '        }',
            '    };',
            '',
            '    build(0);',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function wordSquares(words) {',
            '  const n = words[0].length;',
            '  const byPrefix = new Map();',
            '  for (const w of words) {',
            '    for (let i = 0; i <= n; i++) {',
            '      const p = w.slice(0, i);',
            '      if (!byPrefix.has(p)) byPrefix.set(p, []);',
            '      byPrefix.get(p).push(w);',
            '    }',
            '  }',
            '',
            '  const out = [];',
            '  const square = [];',
            '',
            '  const build = (row) => {',
            '    if (row === n) { out.push([...square]); return; }',
            "    let prefix = '';",
            '    for (let r = 0; r < row; r++) prefix += square[r][row];',
            '    for (const w of byPrefix.get(prefix) ?? []) {',
            '      square.push(w);',
            '      build(row + 1);',
            '      square.pop();',
            '    }',
            '  };',
            '',
            '  build(0);',
            '  return out;',
            '}',
          ],
        },
      },

      run([words]: [string[]], c) {
        const n = words[0].length
        const byPrefix = new Map<string, string[]>()
        for (const w of words) {
          for (let i = 0; i <= n; i++) {
            c.ops++
            const p = w.slice(0, i)
            if (!byPrefix.has(p)) byPrefix.set(p, [])
            byPrefix.get(p)!.push(w)
          }
        }
        const out: string[][] = []
        const square: string[] = []
        const build = (row: number) => {
          c.ops++
          if (row === n) {
            out.push([...square])
            return
          }
          let prefix = ''
          for (let r = 0; r < row; r++) prefix += square[r][row]
          for (const w of byPrefix.get(prefix) ?? []) {
            square.push(w)
            build(row + 1)
            square.pop()
          }
        }
        build(0)
        return out
      },
    },
  ],
}
