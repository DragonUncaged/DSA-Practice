import { arr, type Problem, type Tone } from '@/lib/types'

const DEMO: [number[]] = [[-2, 1, -3, 4, -1, 2, 1, -5, 4]]

export const maximumSubarray: Problem = {
  id: 'maximum-subarray',
  title: 'Maximum Subarray',
  group: 'Array',
  pattern: 'Kadane',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/maximum-subarray/',
  statement:
    'Given an integer array `nums`, find the contiguous subarray with the largest sum and return that sum. The subarray must contain at least one number.',
  constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4', 'The subarray must be contiguous'],
  signature: { fn: 'maxSubArray', params: [{ name: 'nums', type: 'int[]' }], ret: 'int' },
  tests: [
    { args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expect: 6 },
    { args: [[1]], expect: 1 },
    { args: [[5, 4, -1, 7, 8]], expect: 23 },
    { args: [[-1]], expect: -1, note: 'all negative' },
    { args: [[-3, -2, -5]], expect: -2, note: 'must take at least one' },
  ],
  demo: DEMO,
  scale: (n) => [Array.from({ length: n }, (_, i) => (((i * 41) % 21) - 10))],
  starter: {
    js: `function maxSubArray(nums) {
  // nums: number[]  ->  number
}
`,
    cpp: `int maxSubArray(vector<int>& nums) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'kadane',
      label: "Kadane's scan",
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'At each element there are only two candidates: extend the run you are on, or throw it away and start fresh here. A run whose sum has gone negative can never help what comes next, so it is always safe to drop.',
      code: {
        cpp: {
          lines: [
            'int maxSubArray(vector<int>& nums) {',
            '    int best = nums[0], cur = nums[0];',
            '    for (int i = 1; i < nums.size(); ++i) {',
            '        cur = max(nums[i], cur + nums[i]);',
            '        best = max(best, cur);',
            '    }',
            '    return best;',
            '}',
          ],
          map: { init: 2, read: 3, extend: 4, restart: 4, best: 5, done: 7 },
        },
        js: {
          lines: [
            'function maxSubArray(nums) {',
            '  let best = nums[0];',
            '  let cur = nums[0];',
            '  for (let i = 1; i < nums.length; i++) {',
            '    cur = Math.max(nums[i], cur + nums[i]);',
            '    best = Math.max(best, cur);',
            '  }',
            '  return best;',
            '}',
          ],
          map: { init: 3, read: 4, extend: 5, restart: 5, best: 6, done: 8 },
        },
      },

      trace(t, [nums]: [number[]]) {
        const n = nums.length
        let cur = nums[0]
        let best = nums[0]
        let runStart = 0
        let bestFrom = 0
        let bestTo = 0

        const paint = (
          i: number,
          from: number,
          tone: Tone,
          opts: { showBest?: boolean } = {},
        ) => {
          const tones: Record<number, Tone> = {}
          for (let k = 0; k < n; k++) {
            tones[k] = k < from ? 'dim' : k > i ? 'idle' : 'band'
          }
          tones[i] = tone
          if (opts.showBest) {
            for (let k = bestFrom; k <= bestTo; k++) tones[k] = 'good'
          }
          return arr(nums, {
            tones,
            pointers: [{ name: 'i', at: i, accent: 'b' }],
            band: opts.showBest
              ? { from: bestFrom, to: bestTo, label: `best ${best}`, accent: 'ok' }
              : { from, to: i, label: `run ${cur}`, accent: 'c' },
            title: 'nums',
          })
        }

        t.push({
          step: 'init',
          note: `The run and the best answer both start at the first element, ${nums[0]}. There is nothing behind it to extend.`,
          view: paint(0, 0, 'active'),
          vars: [
            ['cur', cur, 'c'],
            ['best', best, 'ok'],
          ],
        })

        for (let i = 1; i < n; i++) {
          const x = nums[i]
          t.bump()
          const extended = cur + x
          const restart = extended < x

          t.push({
            step: 'read',
            note: `Next element is ${x}. Two options: extend the current run to ${extended}, or abandon it and start a new run at ${x}.`,
            view: paint(i, runStart, 'active'),
            vars: [
              ['i', i, 'b'],
              ['nums[i]', x],
              ['cur + x', extended, 'c'],
              ['x alone', x],
            ],
            badge: { text: `${cur} + ${x} = ${extended}`, accent: 'c' },
          })

          if (restart) {
            runStart = i
            cur = x
            t.push({
              step: 'restart',
              note: `Starting fresh wins — the run behind us was dragging the total down, so everything before index ${i} is discarded for good.`,
              view: paint(i, runStart, 'bad'),
              vars: [
                ['i', i, 'b'],
                ['cur', cur, 'c'],
                ['action', 'restart', 'no'],
              ],
              badge: { text: `restart at ${x}`, accent: 'no' },
            })
          } else {
            cur = extended
            t.push({
              step: 'extend',
              note: `Extending wins. The run now spans index ${runStart} to ${i} and sums to ${cur}.`,
              view: paint(i, runStart, 'band'),
              vars: [
                ['i', i, 'b'],
                ['cur', cur, 'c'],
                ['action', 'extend', 'ok'],
              ],
              badge: { text: `run = ${cur}`, accent: 'c' },
            })
          }

          if (cur > best) {
            best = cur
            bestFrom = runStart
            bestTo = i
            t.push({
              step: 'best',
              note: `${cur} is the largest run seen so far. Remember it — the scan keeps going in case something better appears later.`,
              view: paint(i, runStart, 'good', { showBest: true }),
              vars: [
                ['best', best, 'ok'],
                ['span', `[${bestFrom}, ${bestTo}]`, 'ok'],
              ],
              badge: { text: `new best ${best}`, accent: 'ok' },
            })
          }
        }

        t.push({
          step: 'done',
          note: `The largest sum is ${best}, from index ${bestFrom} to ${bestTo}. Every element was read exactly once and nothing was stored but two numbers.`,
          view: paint(n - 1, bestFrom, 'good', { showBest: true }),
          vars: [['answer', best, 'ok']],
          badge: { text: `max sum ${best}`, accent: 'ok' },
        })
      },

      run([nums]: [number[]], c) {
        let best = nums[0]
        let cur = nums[0]
        for (let i = 1; i < nums.length; i++) {
          c.ops++
          cur = Math.max(nums[i], cur + nums[i])
          best = Math.max(best, cur)
        }
        return best
      },
    },

    {
      id: 'brute',
      label: 'Every subarray',
      kind: 'brute',
      time: 'O(n^2)',
      space: 'O(1)',
      blurb: 'Start at each index and extend one element at a time, summing as you go. Every subarray gets its own total.',
      code: {
        cpp: {
          lines: [
            'int maxSubArray(vector<int>& nums) {',
            '    int best = nums[0];',
            '    for (int i = 0; i < nums.size(); ++i) {',
            '        int total = 0;',
            '        for (int j = i; j < nums.size(); ++j) {',
            '            total += nums[j];',
            '            best = max(best, total);',
            '        }',
            '    }',
            '    return best;',
            '}',
          ],
          map: { init: 2, outer: 3, extend: 6, best: 7, done: 10 },
        },
        js: {
          lines: [
            'function maxSubArray(nums) {',
            '  let best = nums[0];',
            '  for (let i = 0; i < nums.length; i++) {',
            '    let total = 0;',
            '    for (let j = i; j < nums.length; j++) {',
            '      total += nums[j];',
            '      best = Math.max(best, total);',
            '    }',
            '  }',
            '  return best;',
            '}',
          ],
          map: { init: 2, outer: 3, extend: 6, best: 7, done: 10 },
        },
      },

      trace(t, [nums]: [number[]]) {
        const n = nums.length
        let best = nums[0]
        let bestFrom = 0
        let bestTo = 0

        const paint = (i: number, j: number, total: number, win: boolean) => {
          const tones: Record<number, Tone> = {}
          for (let k = 0; k < n; k++) tones[k] = k >= i && k <= j ? 'band' : 'idle'
          tones[j] = win ? 'good' : 'active'
          return arr(nums, {
            tones,
            pointers: [
              { name: 'i', at: i, accent: 'a' },
              { name: 'j', at: j, accent: 'b', lane: 1 },
            ],
            band: { from: i, to: j, label: `sum ${total}`, accent: win ? 'ok' : 'c' },
            title: 'nums',
          })
        }

        t.push({
          step: 'init',
          note: 'Take every possible starting index and grow the subarray one element at a time.',
          view: paint(0, 0, nums[0], false),
          vars: [['best', best]],
        })

        for (let i = 0; i < n && !t.full; i++) {
          let total = 0
          for (let j = i; j < n && !t.full; j++) {
            total += nums[j]
            t.bump()
            const win = total > best
            if (win) {
              best = total
              bestFrom = i
              bestTo = j
            }
            t.push({
              step: win ? 'best' : 'extend',
              note: `Subarray from ${i} to ${j} sums to ${total}. ${win ? 'New best.' : `Best is still ${best}.`}`,
              view: paint(i, j, total, win),
              vars: [
                ['i', i, 'a'],
                ['j', j, 'b'],
                ['total', total, win ? 'ok' : 'no'],
                ['best', best],
                ['sums taken', t.ops],
              ],
              badge: { text: `sum ${total}`, accent: win ? 'ok' : 'no' },
            })
          }
        }

        t.push({
          step: 'done',
          note: `Best is ${best} from ${bestFrom} to ${bestTo}, after ${t.ops} running sums. Kadane reaches the same answer in ${n - 1} steps because it never re-adds a prefix it has already seen.`,
          view: paint(bestFrom, bestTo, best, true),
          vars: [
            ['answer', best, 'ok'],
            ['sums taken', t.ops],
          ],
        })
      },

      run([nums]: [number[]], c) {
        let best = nums[0]
        for (let i = 0; i < nums.length; i++) {
          let total = 0
          for (let j = i; j < nums.length; j++) {
            c.ops++
            total += nums[j]
            if (total > best) best = total
          }
        }
        return best
      },
    },
  ],
}
