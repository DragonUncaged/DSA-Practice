import type { Problem } from '@/lib/types'

export const encodeStringWithShortestLength: Problem = {
  id: 'encode-string-with-shortest-length',
  title: 'Encode String with Shortest Length',
  group: 'Hard',
  pattern: 'DP',
  difficulty: 'Hard',
  leetcode: 'https://leetcode.com/problems/encode-string-with-shortest-length/',
  statement:
    'Encode `s` as shortly as possible using the rule `k[encoded]`, which repeats `encoded` exactly `k` times. Leave a piece alone when encoding it would not make it shorter. Several encodings can tie; return the one the interval DP below settles on, which prefers a repeat over a split and the leftmost split otherwise.',
  constraints: ['1 <= s.length <= 150', 's consists of lowercase English letters'],
  signature: { fn: 'encode', params: [{ name: 's', type: 'string' }], ret: 'string' },
  tests: [
    { args: ['aaa'], expect: 'aaa', note: 'encoding would not be shorter' },
    { args: ['aaaaa'], expect: '5[a]' },
    { args: ['aaaaaaaaaa'], expect: '10[a]' },
    { args: ['a'], expect: 'a', note: 'single character' },
    { args: ['abab'], expect: 'abab', note: '2[ab] is one character longer' },
    { args: ['ababababab'], expect: '5[ab]' },
    { args: ['abbbabbbcabbbabbbc'], expect: '2[2[abbb]c]', note: 'nested encoding' },
    { args: ['a'.repeat(150)], expect: '150[a]', note: 'the longest input' },
    { args: ['aaaaabbbbb'], expect: '5[a]5[b]', note: 'two repeats side by side' },
    { args: ['abcdefgh'], expect: 'abcdefgh', note: 'nothing repeats' },
  ],
  demo: ['abbbabbbcabbbabbbc'],
  starter: {
    js: `function encode(s) {
  // s: string  ->  string
}
`,
    cpp: `string encode(string s) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'interval-dp',
      label: 'Best encoding of every substring',
      kind: 'optimal',
      time: 'O(n^4)',
      space: 'O(n^2)',
      blurb:
        'Enumerating every bracketing is exponential, and any other tie-breaking would produce a different string from the pinned answers — so the interval DP is the one solution shown. Solve every substring shortest-first and store the best encoding of each. A substring can either be a repetition — check each period that divides it and wrap the already-solved first block — or a split into two halves whose best encodings are simply concatenated. Both need only shorter substrings, which are already done.',
      code: {
        cpp: {
          lines: [
            'string encode(string s) {',
            '    int n = s.size();',
            '    vector<vector<string>> best(n, vector<string>(n));',
            '',
            '    auto repeats = [&](int l, int r, int period) {',
            '        if ((r - l + 1) % period) return false;',
            '        for (int i = l + period; i <= r; ++i)',
            '            if (s[i] != s[i - period]) return false;',
            '        return true;',
            '    };',
            '',
            '    for (int len = 1; len <= n; ++len) {',
            '        for (int l = 0, r = len - 1; r < n; ++l, ++r) {',
            '            best[l][r] = s.substr(l, len);',
            '',
            '            for (int period = 1; period * 2 <= len; ++period) {',
            '                if (!repeats(l, r, period)) continue;',
            '                string candidate =',
            '                    to_string(len / period) + "[" + best[l][l + period - 1] + "]";',
            '                if (candidate.size() < best[l][r].size()) best[l][r] = candidate;',
            '            }',
            '',
            '            for (int m = l; m < r; ++m) {',
            '                if (best[l][m].size() + best[m + 1][r].size() < best[l][r].size())',
            '                    best[l][r] = best[l][m] + best[m + 1][r];',
            '            }',
            '        }',
            '    }',
            '    return best[0][n - 1];',
            '}',
          ],
        },
        js: {
          lines: [
            'function encode(s) {',
            '  const n = s.length;',
            '  const best = Array.from({ length: n }, () => new Array(n).fill(null));',
            '',
            '  const repeats = (l, r, period) => {',
            '    if ((r - l + 1) % period !== 0) return false;',
            '    for (let i = l + period; i <= r; i++) {',
            '      if (s[i] !== s[i - period]) return false;',
            '    }',
            '    return true;',
            '  };',
            '',
            '  for (let len = 1; len <= n; len++) {',
            '    for (let l = 0, r = len - 1; r < n; l++, r++) {',
            '      best[l][r] = s.slice(l, r + 1);',
            '',
            '      for (let period = 1; period * 2 <= len; period++) {',
            '        if (!repeats(l, r, period)) continue;',
            "        const candidate = len / period + '[' + best[l][l + period - 1] + ']';",
            '        if (candidate.length < best[l][r].length) best[l][r] = candidate;',
            '      }',
            '',
            '      for (let m = l; m < r; m++) {',
            '        if (best[l][m].length + best[m + 1][r].length < best[l][r].length) {',
            '          best[l][r] = best[l][m] + best[m + 1][r];',
            '        }',
            '      }',
            '    }',
            '  }',
            '  return best[0][n - 1];',
            '}',
          ],
        },
      },

      run([s]: [string], c) {
        const n = s.length
        const best: string[][] = Array.from({ length: n }, () => new Array<string>(n).fill(''))
        const repeats = (l: number, r: number, period: number) => {
          if ((r - l + 1) % period !== 0) return false
          for (let i = l + period; i <= r; i++) {
            c.ops++
            if (s[i] !== s[i - period]) return false
          }
          return true
        }
        for (let len = 1; len <= n; len++) {
          for (let l = 0, r = len - 1; r < n; l++, r++) {
            c.ops++
            best[l][r] = s.slice(l, r + 1)
            for (let period = 1; period * 2 <= len; period++) {
              if (!repeats(l, r, period)) continue
              const candidate = len / period + '[' + best[l][l + period - 1] + ']'
              if (candidate.length < best[l][r].length) best[l][r] = candidate
            }
            for (let m = l; m < r; m++) {
              if (best[l][m].length + best[m + 1][r].length < best[l][r].length) {
                best[l][r] = best[l][m] + best[m + 1][r]
              }
            }
          }
        }
        return best[0][n - 1]
      },
    },
  ],
}
