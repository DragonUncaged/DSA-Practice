import { arr, combo, text, type Problem, type Tone } from '@/lib/types'

const DEMO: [string, string[]] = ['leetcode', ['leet', 'code', 'lee']]

export const wordBreak: Problem = {
  id: 'word-break',
  title: 'Word Break',
  group: 'Dynamic Programming',
  pattern: 'DP over Prefixes',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/word-break/',
  statement:
    'Given a string `s` and a dictionary `wordDict`, return `true` if `s` can be segmented into a sequence of dictionary words. Words may be reused.',
  constraints: ['1 <= s.length <= 300', '1 <= wordDict.length <= 1000', 'Words may repeat in the split'],
  signature: {
    fn: 'wordBreak',
    params: [
      { name: 's', type: 'string' },
      { name: 'wordDict', type: 'string[]' },
    ],
    ret: 'bool',
  },
  tests: [
    { args: ['leetcode', ['leet', 'code']], expect: true },
    { args: ['applepenapple', ['apple', 'pen']], expect: true, note: 'words reused' },
    { args: ['catsandog', ['cats', 'dog', 'sand', 'and', 'cat']], expect: false },
    { args: ['a', ['a']], expect: true },
    { args: ['ab', ['a']], expect: false },
  ],
  demo: DEMO,
  scale: (n) => ['ab'.repeat(Math.ceil(n / 2)).slice(0, n), ['a', 'b', 'ab']],
  starter: {
    py: `def wordBreak(s, wordDict):
    # s: str, wordDict: list[str]  ->  bool
    pass
`,
    js: `function wordBreak(s, wordDict) {
  // s: string, wordDict: string[]  ->  boolean
}
`,
    cpp: `bool wordBreak(string s, vector<string>& wordDict) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'dp',
      label: 'Which prefixes are breakable?',
      kind: 'optimal',
      time: 'O(n^2 * w)',
      space: 'O(n)',
      blurb:
        'dp[i] asks one question: can the first i characters be split cleanly? They can if some earlier breakable point j is followed by a dictionary word covering j..i. Fill left to right and the final cell answers the whole string.',
      code: {
        py: {
          lines: [
            'def wordBreak(s, wordDict):',
            '    words = set(wordDict)',
            '    n = len(s)',
            '    dp = [True] + [False] * n',
            '    for i in range(1, n + 1):',
            '        for j in range(i):',
            '            if dp[j] and s[j:i] in words:',
            '                dp[i] = True',
            '                break',
            '    return dp[n]',
          ],
          map: { init: 4, cut: 6, ok: 8, miss: 7, done: 10 },
        },
        cpp: {
          lines: [
            'bool wordBreak(string s, vector<string>& wordDict) {',
            '    unordered_set<string> words(wordDict.begin(), wordDict.end());',
            '    int n = s.size();',
            '    vector<bool> dp(n + 1, false);',
            '    dp[0] = true;',
            '    for (int i = 1; i <= n; ++i)',
            '        for (int j = 0; j < i; ++j)',
            '            if (dp[j] && words.count(s.substr(j, i - j))) {',
            '                dp[i] = true;',
            '                break;',
            '            }',
            '    return dp[n];',
            '}',
          ],
          map: { init: 5, cut: 7, ok: 9, miss: 8, done: 12 },
        },
        js: {
          lines: [
            'function wordBreak(s, wordDict) {',
            '  const words = new Set(wordDict);',
            '  const n = s.length;',
            '  const dp = new Array(n + 1).fill(false);',
            '  dp[0] = true;',
            '  for (let i = 1; i <= n; i++) {',
            '    for (let j = 0; j < i; j++) {',
            '      if (dp[j] && words.has(s.slice(j, i))) {',
            '        dp[i] = true;',
            '        break;',
            '      }',
            '    }',
            '  }',
            '  return dp[n];',
            '}',
          ],
          map: { init: 5, cut: 7, ok: 9, miss: 8, done: 15 },
        },
      },

      trace(t, [s, wordDict]: [string, string[]]) {
        const words = new Set(wordDict)
        const n = s.length
        const dp = new Array<boolean>(n + 1).fill(false)
        dp[0] = true

        const paint = (i: number | null, j: number | null, hit: boolean) => {
          const sTones: Record<number, Tone> = {}
          for (let k = 0; k < n; k++) sTones[k] = 'idle'
          if (i != null && j != null) {
            for (let k = j; k < i; k++) sTones[k] = hit ? 'good' : 'band'
          }
          const dpCells = dp.map((v, k) => (k <= (i ?? n) ? (v ? 'T' : 'F') : '·'))
          const dpTones: Record<number, Tone> = {}
          dp.forEach((v, k) => {
            dpTones[k] = k > (i ?? n) ? 'idle' : v ? 'good' : 'dim'
          })
          return combo(
            text(s, {
              tones: sTones,
              band: i != null && j != null ? { from: j, to: i - 1, label: s.slice(j, i), accent: hit ? 'ok' : 'c' } : null,
              title: 's',
            }),
            arr(dpCells, { tones: dpTones, title: 'dp — prefix of length i is breakable', showIndex: true }),
          )
        }

        t.push({
          step: 'init',
          note: `The empty prefix is trivially breakable — dp[0] = true. Dictionary: {${[...words].join(', ')}}. Each prefix now looks backwards for a breakable point plus one dictionary word.`,
          view: paint(null, null, false),
          vars: [['dp[0]', 'true', 'ok']],
        })

        for (let i = 1; i <= n && !t.full; i++) {
          let found = false
          for (let j = 0; j < i && !t.full; j++) {
            t.bump()
            const piece = s.slice(j, i)
            if (dp[j] && words.has(piece)) {
              dp[i] = true
              found = true
              t.push({
                step: 'ok',
                note: `Prefix of ${j} is breakable and "${piece}" is a dictionary word — so the first ${i} characters split cleanly. dp[${i}] = true, no need to try other cuts.`,
                view: paint(i, j, true),
                vars: [
                  ['i', i, 'b'],
                  ['cut at', j, 'a'],
                  ['word', piece, 'ok'],
                ],
                badge: { text: `"${piece}" fits`, accent: 'ok' },
              })
              break
            }
          }
          if (!found) {
            t.push({
              step: 'miss',
              note: `No breakable point followed by a dictionary word reaches position ${i}. dp[${i}] stays false.`,
              view: paint(i, Math.max(0, i - 1), false),
              vars: [
                ['i', i, 'b'],
                [`dp[${i}]`, 'false', 'no'],
              ],
              badge: { text: `dp[${i}] = false`, accent: 'no' },
            })
          }
        }

        t.push({
          step: 'done',
          note: dp[n]
            ? `dp[${n}] is true — the whole string segments into dictionary words.`
            : `dp[${n}] is false — some tail of the string can never be covered.`,
          view: paint(null, null, false),
          vars: [['answer', String(dp[n]), dp[n] ? 'ok' : 'no']],
          badge: { text: String(dp[n]), accent: dp[n] ? 'ok' : 'no' },
        })
      },

      run([s, wordDict]: [string, string[]], c) {
        const words = new Set(wordDict)
        const n = s.length
        const dp = new Array<boolean>(n + 1).fill(false)
        dp[0] = true
        for (let i = 1; i <= n; i++) {
          for (let j = 0; j < i; j++) {
            c.ops++
            if (dp[j] && words.has(s.slice(j, i))) {
              dp[i] = true
              break
            }
          }
        }
        return dp[n]
      },
    },
  ],
}
