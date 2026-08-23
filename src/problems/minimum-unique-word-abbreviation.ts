import type { Problem } from '@/lib/types'

export const minimumUniqueWordAbbreviation: Problem = {
  id: 'minimum-unique-word-abbreviation',
  title: 'Minimum Unique Word Abbreviation',
  group: 'Hard',
  pattern: 'Bitmask',
  difficulty: 'Hard',
  leetcode: 'https://leetcode.com/problems/minimum-unique-word-abbreviation/',
  statement:
    'An abbreviation replaces non-adjacent substrings with their lengths, and its length counts the kept letters plus the replaced runs — `"s10n"` has length 3. Return the shortest abbreviation of `target` that is not also an abbreviation of any word in `dictionary`. When several are equally short, return the smallest one in lexicographic order.',
  constraints: [
    '1 <= target.length <= 21',
    '0 <= dictionary.length <= 1000',
    '1 <= dictionary[i].length <= 100',
    'log2(dictionary.length) + target.length <= 21 when the dictionary is non-empty',
    'dictionary does not contain target',
  ],
  signature: {
    fn: 'minAbbreviation',
    params: [
      { name: 'target', type: 'string' },
      { name: 'dictionary', type: 'string[]' },
    ],
    ret: 'string',
  },
  tests: [
    { args: ['apple', ['blade']], expect: 'a4', note: '"5" and "4e" both fit blade' },
    { args: ['apple', ['blade', 'plain', 'amber']], expect: '1p3' },
    { args: ['apple', []], expect: '5', note: 'nothing to avoid' },
    { args: ['a', []], expect: '1', note: 'shortest possible' },
    { args: ['apple', ['apply']], expect: '4e', note: 'only the last letter differs' },
    {
      args: ['abc', ['xyz']],
      expect: '2c',
      note: '"a2" is equally short, "2c" sorts first',
    },
    {
      args: ['apple', ['bpple']],
      expect: 'a4',
      note: 'a shorter dictionary word cannot clash at all',
    },
    { args: ['abcde', ['abcdf', 'xbcde']], expect: 'a3e', note: 'two words that differ at opposite ends' },
    { args: ['aaaaa', ['aaaab', 'aaaba', 'aabaa', 'abaaa', 'baaaa']], expect: 'aaaaa', note: 'every position must be kept' },
  ],
  demo: ['apple', ['blade']],
  starter: {
    js: `function minAbbreviation(target, dictionary) {
  // target: string, dictionary: string[]  ->  string
}
`,
    cpp: `string minAbbreviation(string target, vector<string>& dictionary) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'generate-and-check',
      label: 'Generate every abbreviation, shortest first, and test each against the dictionary',
      kind: 'brute',
      time: 'O(2^m * (m log m + d * L))',
      space: 'O(2^m * m)',
      blurb:
        'List every abbreviation of `target` with the Generalized Abbreviation recursion, sort them by length and then alphabetically, and return the first one that Valid Word Abbreviation rejects for every dictionary word. Correct, and it materialises all `2^m` strings and re-walks each dictionary word for every candidate.',
      code: {
        cpp: {
          lines: [
            'static bool validAbbr(const string& word, const string& abbr) {',
            '    size_t i = 0, j = 0;',
            '    while (i < word.size() && j < abbr.size()) {',
            '        if (isdigit(abbr[j])) {',
            "            if (abbr[j] == '0') return false;",
            '            int n = 0;',
            '            while (j < abbr.size() && isdigit(abbr[j])) n = n * 10 + (abbr[j++] - \'0\');',
            '            i += n;',
            '        } else if (word[i] != abbr[j]) return false;',
            '        else { ++i; ++j; }',
            '    }',
            '    return i == word.size() && j == abbr.size();',
            '}',
            '',
            'string minAbbreviation(string target, vector<string>& dictionary) {',
            '    int m = target.size();',
            '    vector<pair<int, string>> all;  // (abbreviation length, text)',
            '    function<void(int, string, int, bool)> walk = [&](int i, string acc, int len, bool afterNumber) {',
            '        if (i == m) { all.push_back({len, acc}); return; }',
            '        walk(i + 1, acc + target[i], len + 1, false);',
            '        if (afterNumber) return;',
            '        for (int k = 1; i + k <= m; ++k) walk(i + k, acc + to_string(k), len + 1, true);',
            '    };',
            '    walk(0, "", 0, false);',
            '    sort(all.begin(), all.end());',
            '    for (auto& [len, abbr] : all) {',
            '        bool clash = false;',
            '        for (const string& w : dictionary) if (validAbbr(w, abbr)) { clash = true; break; }',
            '        if (!clash) return abbr;',
            '    }',
            '    return target;',
            '}',
          ],
        },
        js: {
          lines: [
            'function minAbbreviation(target, dictionary) {',
            '  const validAbbr = (word, abbr) => {',
            '    let i = 0, j = 0;',
            '    while (i < word.length && j < abbr.length) {',
            "      if (abbr[j] >= '0' && abbr[j] <= '9') {",
            "        if (abbr[j] === '0') return false;",
            '        let n = 0;',
            "        while (j < abbr.length && abbr[j] >= '0' && abbr[j] <= '9') n = n * 10 + Number(abbr[j++]);",
            '        i += n;',
            '      } else if (word[i] !== abbr[j]) return false;',
            '      else { i++; j++; }',
            '    }',
            '    return i === word.length && j === abbr.length;',
            '  };',
            '',
            '  const m = target.length;',
            '  const all = []; // [abbreviation length, text]',
            '  const walk = (i, acc, len, afterNumber) => {',
            '    if (i === m) { all.push([len, acc]); return; }',
            '    walk(i + 1, acc + target[i], len + 1, false);',
            '    if (afterNumber) return;',
            '    for (let k = 1; i + k <= m; k++) walk(i + k, acc + k, len + 1, true);',
            '  };',
            "  walk(0, '', 0, false);",
            '  all.sort((a, b) => a[0] - b[0] || (a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0));',
            '',
            '  for (const [, abbr] of all) {',
            '    if (!dictionary.some((w) => validAbbr(w, abbr))) return abbr;',
            '  }',
            '  return target;',
            '}',
          ],
        },
      },

      run([target, dictionary]: [string, string[]], c) {
        if (target.length > 14) throw new Error('too slow')
        const validAbbr = (word: string, abbr: string) => {
          let i = 0
          let j = 0
          while (i < word.length && j < abbr.length) {
            c.ops++
            if (abbr[j] >= '0' && abbr[j] <= '9') {
              if (abbr[j] === '0') return false
              let n = 0
              while (j < abbr.length && abbr[j] >= '0' && abbr[j] <= '9') n = n * 10 + Number(abbr[j++])
              i += n
            } else if (word[i] !== abbr[j]) return false
            else {
              i++
              j++
            }
          }
          return i === word.length && j === abbr.length
        }
        const m = target.length
        const all: [number, string][] = []
        const walk = (i: number, acc: string, len: number, afterNumber: boolean) => {
          c.ops++
          if (i === m) {
            all.push([len, acc])
            return
          }
          walk(i + 1, acc + target[i], len + 1, false)
          if (afterNumber) return
          for (let k = 1; i + k <= m; k++) walk(i + k, acc + k, len + 1, true)
        }
        walk(0, '', 0, false)
        all.sort((a, b) => a[0] - b[0] || (a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0))
        for (const [, abbr] of all) {
          if (!dictionary.some((w) => validAbbr(w, abbr))) return abbr
        }
        return target
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'bitmask',
      label: 'One bit per kept letter',
      kind: 'optimal',
      time: 'O(2^m * m)',
      space: 'O(n)',
      blurb:
        'The strings never need building to be compared. An abbreviation is fully described by which letters it keeps, so it is a bitmask over `target`. A dictionary word of the same length is only ruled out when the mask keeps a position where the two words differ — reduce each word to that difference mask once, and a candidate is safe when it intersects every one of them, a bitwise AND per word. Words of a different length can never collide, and only the winning mask is rendered.',
      code: {
        cpp: {
          lines: [
            'string minAbbreviation(string target, vector<string>& dictionary) {',
            '    int m = target.size();',
            '    vector<int> diffs;',
            '    for (const string& w : dictionary) {',
            '        if ((int)w.size() != m) continue;',
            '        int mask = 0;',
            '        for (int i = 0; i < m; ++i) if (w[i] != target[i]) mask |= 1 << i;',
            '        diffs.push_back(mask);',
            '    }',
            '',
            '    string best;',
            '    int bestLen = INT_MAX;',
            '    for (int keep = 0; keep < (1 << m); ++keep) {',
            '        bool safe = true;',
            '        for (int d : diffs) if ((d & keep) == 0) { safe = false; break; }',
            '        if (!safe) continue;',
            '',
            '        string abbr;',
            '        int len = 0, run = 0;',
            '        for (int i = 0; i < m; ++i) {',
            '            if (keep & (1 << i)) {',
            '                if (run) { abbr += to_string(run); run = 0; ++len; }',
            '                abbr += target[i];',
            '                ++len;',
            '            } else {',
            '                ++run;',
            '            }',
            '        }',
            '        if (run) { abbr += to_string(run); ++len; }',
            '',
            '        if (len < bestLen || (len == bestLen && abbr < best)) { bestLen = len; best = abbr; }',
            '    }',
            '    return best;',
            '}',
          ],
        },
        js: {
          lines: [
            'function minAbbreviation(target, dictionary) {',
            '  const m = target.length;',
            '  const diffs = [];',
            '  for (const w of dictionary) {',
            '    if (w.length !== m) continue;',
            '    let mask = 0;',
            '    for (let i = 0; i < m; i++) if (w[i] !== target[i]) mask |= 1 << i;',
            '    diffs.push(mask);',
            '  }',
            '',
            '  let best = null;',
            '  let bestLen = Infinity;',
            '  for (let keep = 0; keep < 1 << m; keep++) {',
            '    if (!diffs.every((d) => (d & keep) !== 0)) continue;',
            '',
            "    let abbr = '';",
            '    let len = 0;',
            '    let run = 0;',
            '    for (let i = 0; i < m; i++) {',
            '      if (keep & (1 << i)) {',
            '        if (run) { abbr += run; run = 0; len++; }',
            '        abbr += target[i];',
            '        len++;',
            '      } else {',
            '        run++;',
            '      }',
            '    }',
            '    if (run) { abbr += run; len++; }',
            '',
            '    if (len < bestLen || (len === bestLen && abbr < best)) {',
            '      bestLen = len;',
            '      best = abbr;',
            '    }',
            '  }',
            '  return best;',
            '}',
          ],
        },
      },

      run([target, dictionary]: [string, string[]], c) {
        const m = target.length
        const diffs: number[] = []
        for (const w of dictionary) {
          if (w.length !== m) continue
          let mask = 0
          for (let i = 0; i < m; i++) if (w[i] !== target[i]) mask |= 1 << i
          diffs.push(mask)
        }
        let best: string | null = null
        let bestLen = Infinity
        for (let keep = 0; keep < 1 << m; keep++) {
          c.ops++
          if (!diffs.every((d) => (d & keep) !== 0)) continue
          let abbr = ''
          let len = 0
          let run = 0
          for (let i = 0; i < m; i++) {
            if (keep & (1 << i)) {
              if (run) {
                abbr += run
                run = 0
                len++
              }
              abbr += target[i]
              len++
            } else {
              run++
            }
          }
          if (run) {
            abbr += run
            len++
          }
          if (len < bestLen || (len === bestLen && abbr < best!)) {
            bestLen = len
            best = abbr
          }
        }
        return best
      },
    },
  ],
}
