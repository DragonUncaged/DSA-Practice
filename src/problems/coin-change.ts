import { grid, type Problem, type Tone } from '@/lib/types'

const DEMO: [number[], number] = [[1, 3, 4], 6]
const INF = Number.POSITIVE_INFINITY

export const coinChange: Problem = {
  id: 'coin-change',
  title: 'Coin Change',
  group: 'Dynamic Programming',
  pattern: 'Bottom-up DP',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/coin-change/',
  statement:
    'Given coin denominations `coins` and a target `amount`, return the fewest coins needed to make the amount, or `-1` if it cannot be made. You have unlimited coins of each denomination.',
  constraints: ['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],
  signature: {
    fn: 'coinChange',
    params: [
      { name: 'coins', type: 'int[]' },
      { name: 'amount', type: 'int' },
    ],
    ret: 'int',
  },
  tests: [
    { args: [[1, 2, 5], 11], expect: 3 },
    { args: [[2], 3], expect: -1, note: 'odd amount from even coins' },
    { args: [[1], 0], expect: 0, note: 'zero needs zero coins' },
    { args: [[1, 3, 4], 6], expect: 2 },
    { args: [[186, 419, 83, 408], 6249], expect: 20 },
  ],
  demo: DEMO,
  scale: (n) => [[1, 2, 5], n],
  starter: {
    py: `def coinChange(coins, amount):
    # coins: list[int], amount: int  ->  int
    pass
`,
    js: `function coinChange(coins, amount) {
  // coins: number[], amount: number  ->  number
}
`,
    cpp: `int coinChange(vector<int>& coins, int amount) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'dp',
      label: 'Build every amount from 0 up',
      kind: 'optimal',
      time: 'O(amount * coins)',
      space: 'O(amount)',
      blurb:
        'The cheapest way to make x must end with some coin c — and before that coin, you were at x - c, an amount already solved. So fill the table upward: each cell is one plus the cheapest of the cells one coin below it.',
      code: {
        py: {
          lines: [
            'def coinChange(coins, amount):',
            "    INF = float('inf')",
            '    dp = [0] + [INF] * amount',
            '    for x in range(1, amount + 1):',
            '        for c in coins:',
            '            if c <= x and dp[x - c] + 1 < dp[x]:',
            '                dp[x] = dp[x - c] + 1',
            '    return -1 if dp[amount] == INF else dp[amount]',
          ],
          map: { init: 3, consider: 5, fill: 7, done: 8 },
        },
        cpp: {
          lines: [
            'int coinChange(vector<int>& coins, int amount) {',
            '    vector<int> dp(amount + 1, INT_MAX);',
            '    dp[0] = 0;',
            '    for (int x = 1; x <= amount; ++x)',
            '        for (int c : coins)',
            '            if (c <= x && dp[x - c] != INT_MAX)',
            '                dp[x] = min(dp[x], dp[x - c] + 1);',
            '    return dp[amount] == INT_MAX ? -1 : dp[amount];',
            '}',
          ],
          map: { init: 3, consider: 5, fill: 7, done: 8 },
        },
        js: {
          lines: [
            'function coinChange(coins, amount) {',
            '  const dp = new Array(amount + 1).fill(Infinity);',
            '  dp[0] = 0;',
            '  for (let x = 1; x <= amount; x++) {',
            '    for (const c of coins) {',
            '      if (c <= x) dp[x] = Math.min(dp[x], dp[x - c] + 1);',
            '    }',
            '  }',
            '  return dp[amount] === Infinity ? -1 : dp[amount];',
            '}',
          ],
          map: { init: 3, consider: 5, fill: 6, done: 9 },
        },
      },

      trace(t, [coins, amount]: [number[], number]) {
        const dp: number[] = [0, ...new Array(amount).fill(INF)]
        const labels = Array.from({ length: amount + 1 }, (_, i) => String(i))
        const show = () => dp.map((v) => (v === INF ? '∞' : v))

        const paint = (x: number | null, sources: number[]) => {
          const tones: Record<string, Tone> = {}
          for (let k = 0; k <= amount; k++) {
            tones[`0,${k}`] = x == null ? 'done' : k < x ? 'done' : 'idle'
          }
          sources.forEach((s) => {
            tones[`0,${s}`] = 'active'
          })
          if (x != null) tones[`0,${x}`] = 'good'
          return grid([show()], {
            tones,
            cursor: x != null ? [0, x] : null,
            colLabels: labels,
            rowLabels: ['coins'],
            title: `fewest coins to make each amount · coins ${JSON.stringify(coins)}`,
          })
        }

        t.push({
          step: 'init',
          note: `Amount 0 needs 0 coins — the only free fact. Every other amount starts unreachable (∞) until a coin path finds it.`,
          view: paint(null, []),
          vars: [
            ['coins', JSON.stringify(coins)],
            ['dp[0]', 0, 'ok'],
          ],
        })

        for (let x = 1; x <= amount && !t.full; x++) {
          const sources = coins.filter((c) => c <= x).map((c) => x - c)
          t.push({
            step: 'consider',
            note: `To make ${x}, the last coin was one of ${JSON.stringify(coins.filter((c) => c <= x))} — so look one coin back at ${sources
              .map((s) => `dp[${s}]`)
              .join(', ')}, all already solved.`,
            view: paint(x, sources),
            vars: [
              ['x', x, 'b'],
              ['candidates', sources.map((s) => (dp[s] === INF ? '∞' : dp[s])).join(', '), 'c'],
            ],
          })

          for (const c of coins) {
            t.bump()
            if (c <= x && dp[x - c] + 1 < dp[x]) dp[x] = dp[x - c] + 1
          }

          t.push({
            step: 'fill',
            note:
              dp[x] === INF
                ? `No coin can land exactly on ${x} from a reachable amount — it stays unreachable.`
                : `Cheapest is ${dp[x]} coin${dp[x] === 1 ? '' : 's'}. Written down once, reused by every later amount.`,
            view: paint(x, []),
            vars: [
              ['x', x, 'b'],
              [`dp[${x}]`, dp[x] === INF ? '∞' : dp[x], dp[x] === INF ? 'no' : 'ok'],
            ],
            badge: {
              text: dp[x] === INF ? 'unreachable' : `dp[${x}] = ${dp[x]}`,
              accent: dp[x] === INF ? 'no' : 'ok',
            },
          })
        }

        const ans = dp[amount] === INF ? -1 : dp[amount]
        t.push({
          step: 'done',
          note:
            ans === -1
              ? `Amount ${amount} was never reached — no combination of these coins makes it. Return -1.`
              : `${amount} takes ${ans} coins. The greedy "biggest coin first" would get this wrong; the table cannot.`,
          view: paint(null, []),
          vars: [['answer', ans, ans === -1 ? 'no' : 'ok']],
          badge: { text: ans === -1 ? 'impossible' : `${ans} coins`, accent: ans === -1 ? 'no' : 'ok' },
        })
      },

      run([coins, amount]: [number[], number], c) {
        const dp = new Array(amount + 1).fill(INF)
        dp[0] = 0
        for (let x = 1; x <= amount; x++) {
          for (const coin of coins) {
            c.ops++
            if (coin <= x && dp[x - coin] + 1 < dp[x]) dp[x] = dp[x - coin] + 1
          }
        }
        return dp[amount] === INF ? -1 : dp[amount]
      },
    },
  ],
}
