import { combo, grid, mapOf, stackOf, type Problem, type Tone } from '@/lib/types'

const DEMO: [number] = [8]

/** Recursion below this depth is fine to trace; above it the frame budget blows. */
const TRACE_N = 7

export const climbingStairs: Problem = {
  id: 'climbing-stairs',
  title: 'Climbing Stairs',
  group: 'Dynamic Programming',
  pattern: 'Bottom-up DP',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/climbing-stairs/',
  statement:
    'You are climbing a staircase of `n` steps. Each move you can climb either 1 or 2 steps. In how many distinct ways can you reach the top?',
  constraints: ['1 <= n <= 45', 'Each move is either 1 or 2 steps'],
  signature: { fn: 'climbStairs', params: [{ name: 'n', type: 'int' }], ret: 'int' },
  tests: [
    { args: [2], expect: 2 },
    { args: [3], expect: 3 },
    { args: [1], expect: 1, note: 'smallest case' },
    { args: [8], expect: 34 },
    { args: [45], expect: 1836311903, note: 'largest allowed n' },
  ],
  demo: DEMO,
  // the meter deliberately probes past the stated bound; growth is the point
  scale: (n) => [n],
  starter: {
    js: `function climbStairs(n) {
  // n: number  ->  number
}
`,
    cpp: `int climbStairs(int n) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'dp',
      label: 'Build the table upward',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'The last move onto step i came from either i-1 or i-2, so the ways to reach i is the sum of the ways to reach those two. Fill the table from the bottom and every value is already waiting when you need it.',
      code: {
        cpp: {
          lines: [
            'int climbStairs(int n) {',
            '    if (n <= 2) return n;',
            '    vector<int> ways(n + 1, 0);',
            '    ways[1] = 1; ways[2] = 2;',
            '    for (int i = 3; i <= n; ++i)',
            '        ways[i] = ways[i - 1] + ways[i - 2];',
            '    return ways[n];',
            '}',
          ],
          map: { init: 4, read: 5, fill: 6, done: 7 },
        },
        js: {
          lines: [
            'function climbStairs(n) {',
            '  if (n <= 2) return n;',
            '  const ways = new Array(n + 1).fill(0);',
            '  ways[1] = 1;',
            '  ways[2] = 2;',
            '  for (let i = 3; i <= n; i++) {',
            '    ways[i] = ways[i - 1] + ways[i - 2];',
            '  }',
            '  return ways[n];',
            '}',
          ],
          map: { init: 5, read: 6, fill: 7, done: 9 },
        },
      },

      trace(t, [n]: [number]) {
        const ways: number[] = new Array(n + 1).fill(0)
        ways[1] = 1
        if (n >= 2) ways[2] = 2

        const labels = Array.from({ length: n + 1 }, (_, i) => String(i))
        const paint = (i: number, tones: Record<string, Tone>) =>
          grid([ways.map((w) => (w === 0 && Number(labels[0]) === 0 ? w : w))], {
            tones,
            cursor: [0, i],
            colLabels: labels,
            rowLabels: ['ways'],
            title: 'ways to reach each step',
          })

        const baseTones = (upTo: number): Record<string, Tone> => {
          const out: Record<string, Tone> = {}
          for (let k = 0; k <= n; k++) out[`0,${k}`] = k <= upTo ? 'done' : 'idle'
          return out
        }

        t.push({
          step: 'init',
          note: 'Seed the two cases you can count on your fingers: one way to reach step 1, two ways to reach step 2. Everything above is built from them.',
          view: paint(2, { ...baseTones(2), '0,1': 'good', '0,2': 'good' }),
          vars: [
            ['ways[1]', 1, 'ok'],
            ['ways[2]', n >= 2 ? 2 : 0, 'ok'],
          ],
        })

        for (let i = 3; i <= n; i++) {
          t.bump()
          t.push({
            step: 'read',
            note: `To land on step ${i}, the last move was either a single step from ${i - 1} or a double from ${i - 2}. Those two counts are already sitting in the table.`,
            view: paint(i, {
              ...baseTones(i - 1),
              [`0,${i - 1}`]: 'active',
              [`0,${i - 2}`]: 'active',
              [`0,${i}`]: 'band',
            }),
            vars: [
              ['i', i, 'b'],
              [`ways[${i - 1}]`, ways[i - 1], 'c'],
              [`ways[${i - 2}]`, ways[i - 2], 'c'],
            ],
            badge: { text: `${ways[i - 1]} + ${ways[i - 2]}`, accent: 'c' },
          })

          ways[i] = ways[i - 1] + ways[i - 2]

          t.push({
            step: 'fill',
            note: `So there are ${ways[i]} ways to reach step ${i}. Written down once, never recomputed.`,
            view: paint(i, { ...baseTones(i - 1), [`0,${i}`]: 'good' }),
            vars: [
              ['i', i, 'b'],
              [`ways[${i}]`, ways[i], 'ok'],
            ],
            badge: { text: `ways[${i}] = ${ways[i]}`, accent: 'ok' },
          })
        }

        t.push({
          step: 'done',
          note: `${ways[n]} distinct ways to climb ${n} steps. The table was filled left to right in a single pass — ${n - 2} additions in total.`,
          view: paint(n, { ...baseTones(n), [`0,${n}`]: 'accent' }),
          vars: [['answer', ways[n], 'ok']],
          badge: { text: `${ways[n]} ways`, accent: 'ok' },
        })
      },

      run([n]: [number], c) {
        if (n <= 2) return n
        let a = 1
        let b = 2
        for (let i = 3; i <= n; i++) {
          c.ops++
          const next = a + b
          a = b
          b = next
        }
        return b
      },
    },

    {
      id: 'naive',
      label: 'Plain recursion',
      kind: 'brute',
      time: 'O(2^n)',
      space: 'O(n)',
      blurb:
        'Ask the same question of the two smaller staircases, with no memory of the answers. Every subproblem gets solved again and again, and the call count explodes.',
      code: {
        cpp: {
          lines: [
            'int climbStairs(int n) {',
            '    if (n <= 2) return n;',
            '    return climbStairs(n - 1) + climbStairs(n - 2);',
            '}',
          ],
          map: { call: 1, base: 2, split: 3, ret: 3, done: 3 },
        },
        js: {
          lines: [
            'function climbStairs(n) {',
            '  if (n <= 2) return n;',
            '  return climbStairs(n - 1) + climbStairs(n - 2);',
            '}',
          ],
          map: { call: 1, base: 2, split: 3, ret: 3, done: 3 },
        },
      },

      trace(t, [nRaw]: [number]) {
        // the real demo n would blow the frame budget, so the trace shows a
        // smaller staircase and says so
        const n = Math.min(nRaw, TRACE_N)
        const stack: string[] = []
        const visits = new Map<number, number>()

        const paint = (tone: Tone, focus?: number) =>
          combo(
            stackOf([...stack], { title: 'call stack', flip: true }),
            mapOf(
              [...visits.entries()]
                .sort((a, b) => b[0] - a[0])
                .map(([k, v]) => ({
                  k: `climb(${k})`,
                  v: `${v}x`,
                  tone: (k === focus ? tone : v > 1 ? 'bad' : 'band') as Tone,
                })),
              { title: 'times each subproblem was solved' },
            ),
          )

        if (nRaw > TRACE_N) {
          t.push({
            step: 'call',
            note: `The real input is ${nRaw}, which produces thousands of calls — far too many to step through. This trace runs the same code on ${n} instead; the shape of the waste is identical, just smaller.`,
            view: paint('idle'),
            vars: [['tracing n', n, 'c']],
          })
        }

        const climb = (k: number, depth: number): number => {
          if (t.full) return 0
          t.bump()
          visits.set(k, (visits.get(k) ?? 0) + 1)
          stack.push(`climb(${k})`)

          const repeat = (visits.get(k) ?? 0) > 1

          if (k <= 2) {
            t.push({
              step: 'base',
              note: `climb(${k}) is a base case and returns ${k} immediately.${repeat ? ' This exact call has already been answered before — the work is pure repetition.' : ''}`,
              view: paint(repeat ? 'bad' : 'good', k),
              vars: [
                ['n', k, 'b'],
                ['depth', depth],
                ['calls so far', t.ops],
              ],
              badge: { text: `climb(${k}) = ${k}`, accent: repeat ? 'no' : 'ok' },
            })
            stack.pop()
            return k
          }

          t.push({
            step: 'split',
            note: repeat
              ? `climb(${k}) again. Nothing was remembered from last time, so the entire subtree below it is about to be rebuilt from scratch.`
              : `climb(${k}) splits into climb(${k - 1}) and climb(${k - 2}).`,
            view: paint(repeat ? 'bad' : 'active', k),
            vars: [
              ['n', k, 'b'],
              ['depth', depth],
              ['calls so far', t.ops],
            ],
            badge: repeat ? { text: `recomputing climb(${k})`, accent: 'no' } : null,
          })

          const a = climb(k - 1, depth + 1)
          const b = climb(k - 2, depth + 1)
          const total = a + b

          t.push({
            step: 'ret',
            note: `climb(${k}) returns ${a} + ${b} = ${total}.`,
            view: paint('good', k),
            vars: [
              ['n', k, 'b'],
              ['result', total, 'ok'],
              ['calls so far', t.ops],
            ],
            badge: { text: `climb(${k}) = ${total}`, accent: 'ok' },
          })
          stack.pop()
          return total
        }

        const result = climb(n, 0)
        const repeated = [...visits.values()].filter((v) => v > 1).length

        t.push({
          step: 'done',
          note: `${result} ways, at the cost of ${t.ops} calls — and ${repeated} of the subproblems were solved more than once. The table version answers the same question with ${n - 2} additions.`,
          view: paint('idle'),
          vars: [
            ['answer', result, 'ok'],
            ['calls', t.ops, 'no'],
          ],
          badge: { text: `${t.ops} calls`, accent: 'no' },
        })
      },

      run([n]: [number], c) {
        // Refuse up front rather than part-way through: at n = 33 this is
        // already ~7M calls, and every further step doubles it. The meter reads
        // the throw as "this solution cannot reach that size" and stops plotting
        // it, which is exactly the honest answer.
        if (n > 32) throw new Error('too slow')
        const go = (k: number): number => {
          c.ops++
          if (k <= 2) return k
          return go(k - 1) + go(k - 2)
        }
        return go(n)
      },
    },
  ],
}
