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
    {
      args: [['aa', 'ab', 'ba']],
      expect: [['aa', 'aa'], ['aa', 'ab'], ['ab', 'ba'], ['ba', 'aa'], ['ba', 'ab']],
      note: 'a word may be reused, and five squares fit',
    },
    {
      args: [['abc', 'bca', 'cab', 'bbb']],
      expect: [['abc', 'bca', 'cab'], ['bca', 'cab', 'abc'], ['cab', 'abc', 'bca'], ['bbb', 'bbb', 'bbb']],
      note: 'three rotations of one word form a square from any start',
    },
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
      id: 'every-combination',
      label: 'Fill every row with every word, then validate',
      kind: 'brute',
      time: 'O(n^L * L^2)',
      space: 'O(L)',
      blurb:
        'Choose any word for each of the `L` rows — `n^L` combinations — and check afterwards whether row `k` reads the same as column `k` for every `k`. Correct, and blind: almost every combination is already doomed after its second row, yet it is completed and checked in full.',
      code: {
        cpp: {
          lines: [
            'vector<vector<string>> wordSquares(vector<string>& words) {',
            '    int L = words[0].size();',
            '    vector<vector<string>> out;',
            '    vector<string> square;',
            '    auto valid = [&]() {',
            '        for (int r = 0; r < L; ++r)',
            '            for (int c = 0; c < L; ++c)',
            '                if (square[r][c] != square[c][r]) return false;',
            '        return true;',
            '    };',
            '    function<void(int)> fill = [&](int row) {',
            '        if (row == L) { if (valid()) out.push_back(square); return; }',
            '        for (const string& w : words) {',
            '            square.push_back(w);',
            '            fill(row + 1);',
            '            square.pop_back();',
            '        }',
            '    };',
            '    fill(0);',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function wordSquares(words) {',
            '  const L = words[0].length;',
            '  const out = [];',
            '  const square = [];',
            '  const valid = () => {',
            '    for (let r = 0; r < L; r++) {',
            '      for (let c = 0; c < L; c++) if (square[r][c] !== square[c][r]) return false;',
            '    }',
            '    return true;',
            '  };',
            '  const fill = (row) => {',
            '    if (row === L) { if (valid()) out.push([...square]); return; }',
            '    for (const w of words) {',
            '      square.push(w);',
            '      fill(row + 1);',
            '      square.pop();',
            '    }',
            '  };',
            '  fill(0);',
            '  return out;',
            '}',
          ],
        },
      },

      run([words]: [string[]], c) {
        const L = words[0].length
        if (Math.pow(words.length, L) > 2_000_000) throw new Error('too slow')
        const out: string[][] = []
        const square: string[] = []
        const valid = () => {
          for (let r = 0; r < L; r++) {
            for (let col = 0; col < L; col++) {
              c.ops++
              if (square[r][col] !== square[col][r]) return false
            }
          }
          return true
        }
        const fill = (row: number) => {
          if (row === L) {
            if (valid()) out.push([...square])
            return
          }
          for (const w of words) {
            c.ops++
            square.push(w)
            fill(row + 1)
            square.pop()
          }
        }
        fill(0)
        return out
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'backtrack-scan',
      label: 'Backtrack, scanning all words for the required prefix',
      kind: 'better',
      time: 'O(n * L * 26^L)',
      space: 'O(L)',
      blurb:
        'Once the first `k` rows are chosen, column `k` already spells the first `k` letters of row `k`, so only words with that prefix can go there. Checking the prefix before recursing prunes the doomed branches early — but finding the candidates still means scanning all `n` words at every node of the search.',
      code: {
        cpp: {
          lines: [
            'vector<vector<string>> wordSquares(vector<string>& words) {',
            '    int L = words[0].size();',
            '    vector<vector<string>> out;',
            '    vector<string> square;',
            '    function<void(int)> build = [&](int row) {',
            '        if (row == L) { out.push_back(square); return; }',
            '        string prefix;',
            '        for (int r = 0; r < row; ++r) prefix += square[r][row];',
            '        for (const string& w : words) {',
            '            if (w.compare(0, prefix.size(), prefix) != 0) continue;',
            '            square.push_back(w);',
            '            build(row + 1);',
            '            square.pop_back();',
            '        }',
            '    };',
            '    build(0);',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function wordSquares(words) {',
            '  const L = words[0].length;',
            '  const out = [];',
            '  const square = [];',
            '  const build = (row) => {',
            '    if (row === L) { out.push([...square]); return; }',
            "    let prefix = '';",
            '    for (let r = 0; r < row; r++) prefix += square[r][row];',
            '    for (const w of words) {',
            '      if (!w.startsWith(prefix)) continue;',
            '      square.push(w);',
            '      build(row + 1);',
            '      square.pop();',
            '    }',
            '  };',
            '  build(0);',
            '  return out;',
            '}',
          ],
        },
      },

      run([words]: [string[]], c) {
        const L = words[0].length
        const out: string[][] = []
        const square: string[] = []
        const build = (row: number) => {
          if (row === L) {
            out.push([...square])
            return
          }
          let prefix = ''
          for (let r = 0; r < row; r++) prefix += square[r][row]
          for (const w of words) {
            c.ops++
            if (!w.startsWith(prefix)) continue
            square.push(w)
            build(row + 1)
            square.pop()
          }
        }
        build(0)
        return out
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'prefix-index',
      label: 'Build row by row against a prefix index',
      kind: 'optimal',
      time: 'O(n * L + 26^L * L)',
      space: 'O(n * L)',
      blurb:
        'The scan for a prefix is the same question asked over and over, so answer it once. Indexing every word by each of its prefixes turns "what can go here?" into one hash lookup, and the search only ever explores rows that can still work — the same pruned tree as before, minus the linear scan at every node.',
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
