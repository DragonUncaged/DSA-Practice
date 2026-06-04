import { bars, type Problem, type Tone } from '@/lib/types'

const DEMO: [number[]] = [[7, 1, 5, 3, 6, 4]]

export const bestTimeToBuyAndSellStock: Problem = {
  id: 'best-time-to-buy-and-sell-stock',
  title: 'Best Time to Buy and Sell Stock',
  group: 'Array',
  pattern: 'Running Minimum',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
  statement:
    'You are given `prices` where `prices[i]` is the price of a stock on day `i`. Buy on one day and sell on a later day. Return the maximum profit, or `0` if no profit is possible.',
  constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4', 'You must buy before you sell'],
  signature: { fn: 'maxProfit', params: [{ name: 'prices', type: 'int[]' }], ret: 'int' },
  tests: [
    { args: [[7, 1, 5, 3, 6, 4]], expect: 5 },
    { args: [[7, 6, 4, 3, 1]], expect: 0, note: 'falling every day' },
    { args: [[1, 2]], expect: 1 },
    { args: [[2]], expect: 0, note: 'single day' },
    { args: [[3, 3, 3]], expect: 0 },
    { args: [[2, 4, 1, 7]], expect: 6 },
  ],
  demo: DEMO,
  scale: (n) => [Array.from({ length: n }, (_, i) => ((i * 53) % 97) + 1)],
  starter: {
    js: `function maxProfit(prices) {
  // prices: number[]  ->  number
}
`,
    cpp: `int maxProfit(vector<int>& prices) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'running-min',
      label: 'Remember the cheapest day',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'You never need to look backwards. The best sale on any given day is that day’s price minus the cheapest price seen so far, and the cheapest so far is one number you can carry with you.',
      code: {
        cpp: {
          lines: [
            'int maxProfit(vector<int>& prices) {',
            '    int best = 0, low = prices[0];',
            '    for (int i = 1; i < prices.size(); ++i) {',
            '        int p = prices[i];',
            '        if (p < low) low = p;',
            '        else best = max(best, p - low);',
            '    }',
            '    return best;',
            '}',
          ],
          map: { init: 2, read: 4, newlow: 5, profit: 6, done: 8 },
        },
        js: {
          lines: [
            'function maxProfit(prices) {',
            '  let best = 0;',
            '  let low = prices[0];',
            '  for (let i = 1; i < prices.length; i++) {',
            '    const p = prices[i];',
            '    if (p < low) low = p;',
            '    else best = Math.max(best, p - low);',
            '  }',
            '  return best;',
            '}',
          ],
          map: { init: 3, read: 5, newlow: 6, profit: 7, done: 9 },
        },
      },

      trace(t, [prices]: [number[]]) {
        const n = prices.length
        let low = prices[0]
        let lowIdx = 0
        let best = 0
        let buy = 0
        let sell = 0

        const paint = (i: number, tone: Tone, win = false) => {
          const tones: Record<number, Tone> = {}
          for (let k = 0; k < n; k++) tones[k] = k < i ? 'done' : k > i ? 'idle' : tone
          tones[lowIdx] = 'good'
          if (win) {
            tones[buy] = 'good'
            tones[sell] = 'accent'
          }
          return bars(prices, {
            tones,
            pointers: [
              { name: 'i', at: i, accent: 'b' },
              { name: 'low', at: lowIdx, accent: 'a', lane: 1 },
            ],
            title: 'prices',
          })
        }

        t.push({
          step: 'init',
          note: `Day 0 is the only day we could have bought so far, so the cheapest price is ${prices[0]}. Profit starts at 0 because doing nothing is always allowed.`,
          view: paint(0, 'active'),
          vars: [
            ['low', low, 'a'],
            ['best', 0],
          ],
        })

        for (let i = 1; i < n; i++) {
          const p = prices[i]
          t.bump()

          if (p < low) {
            lowIdx = i
            low = p
            t.push({
              step: 'newlow',
              note: `${p} is cheaper than anything before it. Every future sale should be measured against this day instead — a lower buy can only ever help.`,
              view: paint(i, 'good'),
              vars: [
                ['i', i, 'b'],
                ['prices[i]', p],
                ['low', low, 'a'],
                ['best', best],
              ],
              badge: { text: `new low ${p}`, accent: 'a' },
            })
            continue
          }

          const profit = p - low
          const win = profit > best
          if (win) {
            best = profit
            buy = lowIdx
            sell = i
          }

          t.push({
            step: 'profit',
            note: win
              ? `Selling at ${p} against the ${low} on day ${lowIdx} yields ${profit} — the best so far.`
              : `Selling at ${p} against the ${low} on day ${lowIdx} yields ${profit}, which does not beat ${best}.`,
            view: paint(i, win ? 'accent' : 'bad'),
            vars: [
              ['i', i, 'b'],
              ['prices[i]', p],
              ['low', low, 'a'],
              ['profit', profit, win ? 'ok' : 'no'],
              ['best', best, 'ok'],
            ],
            badge: { text: `${p} - ${low} = ${profit}`, accent: win ? 'ok' : 'no' },
          })
        }

        t.push({
          step: 'done',
          note:
            best > 0
              ? `Best profit is ${best}: buy on day ${buy} at ${prices[buy]}, sell on day ${sell} at ${prices[sell]}. One pass, one remembered number.`
              : 'Prices never rose after any low point, so the answer is 0 — the right move was to buy nothing.',
          view: paint(n - 1, 'idle', best > 0),
          vars: [['answer', best, 'ok']],
          badge: { text: `profit ${best}`, accent: best > 0 ? 'ok' : 'no' },
        })
      },

      run([prices]: [number[]], c) {
        let best = 0
        let low = prices[0]
        for (let i = 1; i < prices.length; i++) {
          c.ops++
          if (prices[i] < low) low = prices[i]
          else best = Math.max(best, prices[i] - low)
        }
        return best
      },
    },

    {
      id: 'brute',
      label: 'Every buy and sell pair',
      kind: 'brute',
      time: 'O(n^2)',
      space: 'O(1)',
      blurb: 'Try every buy day against every later sell day. Correct, and it re-walks the same days over and over.',
      code: {
        cpp: {
          lines: [
            'int maxProfit(vector<int>& prices) {',
            '    int best = 0;',
            '    for (int i = 0; i < prices.size(); ++i)',
            '        for (int j = i + 1; j < prices.size(); ++j)',
            '            best = max(best, prices[j] - prices[i]);',
            '    return best;',
            '}',
          ],
          map: { init: 2, outer: 3, check: 5, best: 5, done: 6 },
        },
        js: {
          lines: [
            'function maxProfit(prices) {',
            '  let best = 0;',
            '  for (let i = 0; i < prices.length; i++) {',
            '    for (let j = i + 1; j < prices.length; j++) {',
            '      best = Math.max(best, prices[j] - prices[i]);',
            '    }',
            '  }',
            '  return best;',
            '}',
          ],
          map: { init: 2, outer: 3, check: 5, best: 5, done: 8 },
        },
      },

      trace(t, [prices]: [number[]]) {
        const n = prices.length
        let best = 0

        const paint = (i: number, j: number | null, win: boolean) => {
          const tones: Record<number, Tone> = {}
          for (let k = 0; k < n; k++) tones[k] = 'idle'
          tones[i] = win ? 'good' : 'active'
          if (j != null) tones[j] = win ? 'accent' : 'active'
          return bars(prices, {
            tones,
            pointers: [
              { name: 'buy', at: i, accent: 'a' },
              { name: 'sell', at: j, accent: 'b', lane: 1 },
            ],
            title: 'prices',
          })
        }

        t.push({
          step: 'init',
          note: 'Pin a buy day, then try selling on each later day. Repeat for every buy day.',
          view: paint(0, null, false),
          vars: [['best', 0]],
        })

        for (let i = 0; i < n && !t.full; i++) {
          t.push({
            step: 'outer',
            note: `Suppose we buy on day ${i} at ${prices[i]}.`,
            view: paint(i, null, false),
            vars: [
              ['buy', i, 'a'],
              ['best', best],
            ],
          })
          for (let j = i + 1; j < n && !t.full; j++) {
            const profit = prices[j] - prices[i]
            t.bump()
            const win = profit > best
            if (win) best = profit
            t.push({
              step: win ? 'best' : 'check',
              note: `Sell on day ${j} at ${prices[j]} for ${profit}. ${win ? 'New best.' : `Best is still ${best}.`}`,
              view: paint(i, j, win),
              vars: [
                ['buy', i, 'a'],
                ['sell', j, 'b'],
                ['profit', profit, win ? 'ok' : 'no'],
                ['best', best],
                ['pairs tried', t.ops],
              ],
              badge: { text: `${prices[j]} - ${prices[i]} = ${profit}`, accent: win ? 'ok' : 'no' },
            })
          }
        }

        t.push({
          step: 'done',
          note: `Best profit ${best}, found after ${t.ops} pair checks. The single-pass version reaches the same answer in ${n - 1}.`,
          view: paint(0, null, false),
          vars: [
            ['answer', best, 'ok'],
            ['pairs tried', t.ops],
          ],
        })
      },

      run([prices]: [number[]], c) {
        let best = 0
        for (let i = 0; i < prices.length; i++) {
          for (let j = i + 1; j < prices.length; j++) {
            c.ops++
            best = Math.max(best, prices[j] - prices[i])
          }
        }
        return best
      },
    },
  ],
}
