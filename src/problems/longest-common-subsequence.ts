import { grid, type Problem, type Tone } from '@/lib/types'

const DEMO: [string, string] = ['abcde', 'ace']

export const longestCommonSubsequence: Problem = {
  id: 'longest-common-subsequence',
  title: 'Longest Common Subsequence',
  group: 'Dynamic Programming',
  pattern: '2D DP',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/longest-common-subsequence/',
  statement:
    'Given two strings `text1` and `text2`, return the length of their longest common subsequence — characters in the same relative order in both, not necessarily contiguous.',
  constraints: ['1 <= text1.length, text2.length <= 1000', 'Lowercase English letters'],
  signature: {
    fn: 'longestCommonSubsequence',
    params: [
      { name: 'text1', type: 'string' },
      { name: 'text2', type: 'string' },
    ],
    ret: 'int',
  },
  tests: [
    { args: ['abcde', 'ace'], expect: 3 },
    { args: ['abc', 'abc'], expect: 3 },
    { args: ['abc', 'def'], expect: 0, note: 'nothing in common' },
    { args: ['bsbininm', 'jmjkbkjkv'], expect: 1 },
  ],
  demo: DEMO,
  // two length-n strings, so measured growth reads as O(n^2) — the m = n case
  scale: (n) => {
    const s = Array.from({ length: n }, (_, i) => String.fromCharCode(97 + (i % 26))).join('')
    const r = Array.from({ length: n }, (_, i) => String.fromCharCode(97 + ((i * 3) % 26))).join('')
    return [s, r]
  },
  starter: {
    py: `def longestCommonSubsequence(text1, text2):
    # text1: str, text2: str  ->  int
    pass
`,
    js: `function longestCommonSubsequence(text1, text2) {
  // text1: string, text2: string  ->  number
}
`,
    cpp: `int longestCommonSubsequence(string text1, string text2) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'dp',
      label: 'The classic grid',
      kind: 'optimal',
      time: 'O(m * n)',
      space: 'O(m * n)',
      blurb:
        'Cell (i, j) answers: how long is the LCS of the first i characters of one string and the first j of the other? If the two current characters match, extend the diagonal; if not, carry over the better of skipping one character from either string.',
      code: {
        py: {
          lines: [
            'def longestCommonSubsequence(text1, text2):',
            '    m, n = len(text1), len(text2)',
            '    dp = [[0] * (n + 1) for _ in range(m + 1)]',
            '    for i in range(1, m + 1):',
            '        for j in range(1, n + 1):',
            '            if text1[i - 1] == text2[j - 1]:',
            '                dp[i][j] = dp[i - 1][j - 1] + 1',
            '            else:',
            '                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])',
            '    return dp[m][n]',
          ],
          map: { init: 3, match: 7, gap: 9, done: 10 },
        },
        cpp: {
          lines: [
            'int longestCommonSubsequence(string text1, string text2) {',
            '    int m = text1.size(), n = text2.size();',
            '    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));',
            '    for (int i = 1; i <= m; ++i)',
            '        for (int j = 1; j <= n; ++j)',
            '            if (text1[i - 1] == text2[j - 1])',
            '                dp[i][j] = dp[i - 1][j - 1] + 1;',
            '            else',
            '                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);',
            '    return dp[m][n];',
            '}',
          ],
          map: { init: 3, match: 7, gap: 9, done: 10 },
        },
        js: {
          lines: [
            'function longestCommonSubsequence(text1, text2) {',
            '  const m = text1.length;',
            '  const n = text2.length;',
            '  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));',
            '  for (let i = 1; i <= m; i++) {',
            '    for (let j = 1; j <= n; j++) {',
            '      if (text1[i - 1] === text2[j - 1]) {',
            '        dp[i][j] = dp[i - 1][j - 1] + 1;',
            '      } else {',
            '        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);',
            '      }',
            '    }',
            '  }',
            '  return dp[m][n];',
            '}',
          ],
          map: { init: 4, match: 8, gap: 10, done: 15 },
        },
      },

      trace(t, [a, b]: [string, string]) {
        const m = a.length
        const n = b.length
        const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
        const colLabels = ['·', ...b.split('')]
        const rowLabels = ['·', ...a.split('')]

        const paint = (ci: number | null, cj: number | null, matched: boolean) => {
          const tones: Record<string, Tone> = {}
          for (let i = 0; i <= m; i++) {
            for (let j = 0; j <= n; j++) {
              const filled = ci == null || i < ci || (i === ci && j < (cj ?? 0))
              tones[`${i},${j}`] = filled ? 'done' : 'idle'
            }
          }
          if (ci != null && cj != null) {
            if (matched) tones[`${ci - 1},${cj - 1}`] = 'good'
            else {
              tones[`${ci - 1},${cj}`] = 'active'
              tones[`${ci},${cj - 1}`] = 'active'
            }
            tones[`${ci},${cj}`] = matched ? 'good' : 'band'
          }
          return grid(dp.map((row) => [...row]), {
            tones,
            cursor: ci != null && cj != null ? [ci, cj] : null,
            colLabels,
            rowLabels,
            title: `LCS grid · "${a}" down, "${b}" across`,
          })
        }

        t.push({
          step: 'init',
          note: 'Row 0 and column 0 are empty prefixes — LCS with nothing is 0. Every other cell derives from its three neighbours above and to the left.',
          view: paint(null, null, false),
          vars: [
            ['text1', a],
            ['text2', b],
          ],
        })

        for (let i = 1; i <= m && !t.full; i++) {
          for (let j = 1; j <= n && !t.full; j++) {
            t.bump()
            const match = a[i - 1] === b[j - 1]
            if (match) {
              dp[i][j] = dp[i - 1][j - 1] + 1
              t.push({
                step: 'match',
                note: `'${a[i - 1]}' equals '${b[j - 1]}' — both prefixes end in the same letter, so take the diagonal answer and add one: ${dp[i][j]}.`,
                view: paint(i, j, true),
                vars: [
                  ['chars', `'${a[i - 1]}' = '${b[j - 1]}'`, 'ok'],
                  ['diagonal', dp[i - 1][j - 1], 'c'],
                  [`dp[${i}][${j}]`, dp[i][j], 'ok'],
                ],
                badge: { text: `match: ${dp[i][j]}`, accent: 'ok' },
              })
            } else {
              dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
              t.push({
                step: 'gap',
                note: `'${a[i - 1]}' vs '${b[j - 1]}': no match, so skip a character from one string or the other and keep the better answer — max(${dp[i - 1][j]}, ${dp[i][j - 1]}) = ${dp[i][j]}.`,
                view: paint(i, j, false),
                vars: [
                  ['chars', `'${a[i - 1]}' ≠ '${b[j - 1]}'`, 'no'],
                  ['from above', dp[i - 1][j]],
                  ['from left', dp[i][j - 1]],
                  [`dp[${i}][${j}]`, dp[i][j], 'c'],
                ],
              })
            }
          }
        }

        t.push({
          step: 'done',
          note: `Bottom-right cell holds the answer: ${dp[m][n]}. Each of the ${m * n} cells was computed exactly once from three neighbours.`,
          view: paint(null, null, false),
          vars: [['answer', dp[m][n], 'ok']],
          badge: { text: `LCS = ${dp[m][n]}`, accent: 'ok' },
        })
      },

      run([a, b]: [string, string], c) {
        // rolling rows: the meter probes large sizes, and O(n) memory beats O(n^2)
        const n = b.length
        let prev = new Array(n + 1).fill(0)
        let cur = new Array(n + 1).fill(0)
        for (let i = 1; i <= a.length; i++) {
          for (let j = 1; j <= n; j++) {
            c.ops++
            cur[j] = a[i - 1] === b[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], cur[j - 1])
          }
          ;[prev, cur] = [cur, prev]
        }
        return prev[n]
      },
    },
  ],
}
