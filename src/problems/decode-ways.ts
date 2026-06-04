import { combo, arr, text, type Problem, type Tone } from '@/lib/types'

const DEMO: [string] = ['2261']

export const decodeWays: Problem = {
  id: 'decode-ways',
  title: 'Decode Ways',
  group: 'Dynamic Programming',
  pattern: 'Fibonacci-style DP',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/decode-ways/',
  statement:
    "A message of digits was encoded with A=1 ... Z=26. Return how many ways `s` can be decoded. A '0' can only survive as the tail of \"10\" or \"20\".",
  constraints: ['1 <= s.length <= 100', 's contains only digits'],
  signature: { fn: 'numDecodings', params: [{ name: 's', type: 'string' }], ret: 'int' },
  tests: [
    { args: ['12'], expect: 2, note: '"AB" or "L"' },
    { args: ['226'], expect: 3 },
    { args: ['06'], expect: 0, note: 'a leading zero decodes to nothing' },
    { args: ['2101'], expect: 1 },
    { args: ['11106'], expect: 2 },
  ],
  demo: DEMO,
  scale: (n) => ['1'.repeat(n)],
  starter: {
    js: `function numDecodings(s) {
  // s: string  ->  number
}
`,
    cpp: `int numDecodings(string s) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'dp',
      label: 'One digit or two',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'The last letter of any decoding covers either one digit or two. So ways(i) = ways(i-1) when the single digit is valid, plus ways(i-2) when the two-digit pair lands in 10..26. Climbing Stairs with a validity check bolted on.',
      code: {
        cpp: {
          lines: [
            'int numDecodings(string s) {',
            '    int n = s.size();',
            '    vector<int> dp(n + 1, 0);',
            '    dp[0] = 1;',
            '    for (int i = 1; i <= n; ++i) {',
            "        if (s[i - 1] != '0') dp[i] += dp[i - 1];",
            '        if (i > 1) {',
            "            int two = (s[i - 2] - '0') * 10 + (s[i - 1] - '0');",
            '            if (two >= 10 && two <= 26) dp[i] += dp[i - 2];',
            '        }',
            '    }',
            '    return dp[n];',
            '}',
          ],
          map: { init: 4, fill: 6, pair: 9, dead: 12, done: 12 },
        },
        js: {
          lines: [
            'function numDecodings(s) {',
            '  const n = s.length;',
            '  const dp = new Array(n + 1).fill(0);',
            '  dp[0] = 1;',
            '  for (let i = 1; i <= n; i++) {',
            "    if (s[i - 1] !== '0') dp[i] += dp[i - 1];",
            '    if (i > 1) {',
            '      const two = Number(s.slice(i - 2, i));',
            '      if (two >= 10 && two <= 26) dp[i] += dp[i - 2];',
            '    }',
            '  }',
            '  return dp[n];',
            '}',
          ],
          map: { init: 4, fill: 6, pair: 9, dead: 12, done: 12 },
        },
      },

      trace(t, [s]: [string]) {
        const n = s.length
        const dp = new Array(n + 1).fill(0)
        dp[0] = 1

        const paint = (i: number | null, pair: boolean) => {
          const sTones: Record<number, Tone> = {}
          for (let k = 0; k < n; k++) sTones[k] = i == null ? 'done' : k < i - 1 ? 'done' : k > i - 1 ? 'idle' : 'active'
          if (i != null && pair && i >= 2) sTones[i - 2] = 'good'
          const dpTones: Record<number, Tone> = {}
          dp.forEach((v, k) => {
            dpTones[k] = i == null || k < i ? (v === 0 ? 'bad' : 'band') : k === i ? 'active' : 'idle'
          })
          return combo(
            text(s, { tones: sTones, title: 's' }),
            arr(dp.slice(), { tones: dpTones, title: 'dp — decodings of each prefix', showIndex: true }),
          )
        }

        t.push({
          step: 'init',
          note: 'The empty prefix decodes exactly one way (as nothing), so dp[0] = 1. Each position now asks: can I end with a one-digit letter, a two-digit letter, or both?',
          view: paint(null, false),
          vars: [['dp[0]', 1, 'ok']],
        })

        for (let i = 1; i <= n && !t.full; i++) {
          t.bump()
          const single = s[i - 1] !== '0'
          if (single) dp[i] += dp[i - 1]
          const two = i > 1 ? Number(s.slice(i - 2, i)) : 0
          const pair = i > 1 && two >= 10 && two <= 26
          if (pair) dp[i] += dp[i - 2]

          if (dp[i] === 0) {
            t.push({
              step: 'dead',
              note: `'${s[i - 1]}' alone is ${single ? 'valid' : "a lone zero — invalid"}, and "${i > 1 ? s.slice(i - 2, i) : '—'}" ${pair ? 'works' : 'is not in 10..26'}. Nothing decodes this prefix: dp[${i}] = 0, and everything after inherits the dead end.`,
              view: paint(i, false),
              vars: [
                ['i', i, 'b'],
                [`dp[${i}]`, 0, 'no'],
              ],
              badge: { text: 'undecodable', accent: 'no' },
            })
            continue
          }

          t.push({
            step: pair ? 'pair' : 'fill',
            note: pair
              ? `'${s[i - 1]}' works alone${single ? ` (${dp[i - 1]} ways)` : ' — no, it is 0'} and "${s.slice(i - 2, i)}" is a letter too (${dp[i - 2]} ways via the pair). Total: ${dp[i]}.`
              : `Only the single digit '${s[i - 1]}' is valid here${i > 1 ? ` — "${s.slice(i - 2, i)}" is outside 10..26` : ''}. dp[${i}] = dp[${i - 1}] = ${dp[i]}.`,
            view: paint(i, pair),
            vars: [
              ['i', i, 'b'],
              ['single valid', single ? 'yes' : 'no', single ? 'ok' : 'no'],
              ['pair valid', pair ? `yes (${two})` : 'no', pair ? 'ok' : 'no'],
              [`dp[${i}]`, dp[i], 'ok'],
            ],
            badge: { text: `dp[${i}] = ${dp[i]}`, accent: 'ok' },
          })
        }

        t.push({
          step: 'done',
          note: `"${s}" decodes ${dp[n]} way${dp[n] === 1 ? '' : 's'}. Same recurrence shape as Climbing Stairs — each cell reads at most two earlier cells.`,
          view: paint(null, false),
          vars: [['answer', dp[n], dp[n] ? 'ok' : 'no']],
          badge: { text: `${dp[n]} ways`, accent: dp[n] ? 'ok' : 'no' },
        })
      },

      run([s]: [string], c) {
        const n = s.length
        const dp = new Array(n + 1).fill(0)
        dp[0] = 1
        for (let i = 1; i <= n; i++) {
          c.ops++
          if (s[i - 1] !== '0') dp[i] += dp[i - 1]
          if (i > 1) {
            const two = Number(s.slice(i - 2, i))
            if (two >= 10 && two <= 26) dp[i] += dp[i - 2]
          }
        }
        return dp[n]
      },
    },
  ],
}
