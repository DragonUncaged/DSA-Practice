import { arr, type Problem, type Tone } from '@/lib/types'

const DEMO: [number[]] = [[2, 3, -2, 4, -1]]

export const maximumProductSubarray: Problem = {
  id: 'maximum-product-subarray',
  title: 'Maximum Product Subarray',
  group: 'Array',
  pattern: 'Kadane Variant',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/maximum-product-subarray/',
  statement:
    'Given an integer array `nums`, find the contiguous subarray with the largest product and return that product.',
  constraints: ['1 <= nums.length <= 2 * 10^4', '-10 <= nums[i] <= 10', 'The product fits in a 32-bit integer'],
  signature: { fn: 'maxProduct', params: [{ name: 'nums', type: 'int[]' }], ret: 'int' },
  tests: [
    { args: [[2, 3, -2, 4]], expect: 6 },
    { args: [[-2, 0, -1]], expect: 0, note: 'zero splits the runs' },
    { args: [[-2, 3, -4]], expect: 24, note: 'two negatives make a positive' },
    { args: [[-2]], expect: -2, note: 'single negative' },
    { args: [[0, 2]], expect: 2 },
  ],
  demo: DEMO,
  scale: (n) => [Array.from({ length: n }, (_, i) => ((i % 3) - 1) || 2)],
  starter: {
    js: `function maxProduct(nums) {
  // nums: number[]  ->  number
}
`,
    cpp: `int maxProduct(vector<int>& nums) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'minmax',
      label: 'Track the max AND the min',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'The twist on Kadane: a huge negative product is one negative number away from being a huge positive one. So carry both the best and the worst product ending here — a negative element swaps their roles.',
      code: {
        cpp: {
          lines: [
            'int maxProduct(vector<int>& nums) {',
            '    int best = nums[0], hi = nums[0], lo = nums[0];',
            '    for (int i = 1; i < nums.size(); ++i) {',
            '        int x = nums[i];',
            '        if (x < 0) swap(hi, lo);',
            '        hi = max(x, hi * x);',
            '        lo = min(x, lo * x);',
            '        best = max(best, hi);',
            '    }',
            '    return best;',
            '}',
          ],
          map: { init: 2, read: 4, swap: 5, update: 7, best: 8, done: 10 },
        },
        js: {
          lines: [
            'function maxProduct(nums) {',
            '  let best = nums[0];',
            '  let hi = nums[0];',
            '  let lo = nums[0];',
            '  for (let i = 1; i < nums.length; i++) {',
            '    const x = nums[i];',
            '    if (x < 0) [hi, lo] = [lo, hi];',
            '    hi = Math.max(x, hi * x);',
            '    lo = Math.min(x, lo * x);',
            '    best = Math.max(best, hi);',
            '  }',
            '  return best;',
            '}',
          ],
          map: { init: 4, read: 6, swap: 7, update: 9, best: 10, done: 12 },
        },
      },

      trace(t, [nums]: [number[]]) {
        const n = nums.length
        let hi = nums[0]
        let lo = nums[0]
        let best = nums[0]

        const paint = (i: number, tone: Tone) => {
          const tones: Record<number, Tone> = {}
          for (let k = 0; k < n; k++) tones[k] = k < i ? 'done' : k > i ? 'idle' : tone
          return arr(nums, {
            tones,
            pointers: [{ name: 'i', at: i, accent: 'b' }],
            title: 'nums',
          })
        }

        t.push({
          step: 'init',
          note: `Start all three trackers at ${nums[0]}: the best product ending here (hi), the worst (lo), and the best seen anywhere.`,
          view: paint(0, 'active'),
          vars: [
            ['hi', hi, 'ok'],
            ['lo', lo, 'no'],
            ['best', best],
          ],
        })

        for (let i = 1; i < n; i++) {
          const x = nums[i]
          t.bump()

          if (x < 0) {
            ;[hi, lo] = [lo, hi]
            t.push({
              step: 'swap',
              note: `${x} is negative — multiplying flips signs, so the current worst product (${lo < hi ? hi : lo}) is about to become the best candidate and vice versa. Swap the trackers before updating.`,
              view: paint(i, 'bad'),
              vars: [
                ['i', i, 'b'],
                ['x', x, 'no'],
                ['hi (after swap)', hi, 'c'],
                ['lo (after swap)', lo, 'c'],
              ],
              badge: { text: 'negative: swap hi/lo', accent: 'no' },
            })
          }

          hi = Math.max(x, hi * x)
          lo = Math.min(x, lo * x)

          t.push({
            step: 'update',
            note: `Best product ending at index ${i}: either ${x} alone or extend the previous run. hi = ${hi}, lo = ${lo}.`,
            view: paint(i, 'active'),
            vars: [
              ['i', i, 'b'],
              ['x', x],
              ['hi', hi, 'ok'],
              ['lo', lo, 'no'],
            ],
            badge: { text: `hi ${hi} · lo ${lo}`, accent: 'c' },
          })

          if (hi > best) {
            best = hi
            t.push({
              step: 'best',
              note: `${hi} beats the previous overall best.`,
              view: paint(i, 'good'),
              vars: [['best', best, 'ok']],
              badge: { text: `new best ${best}`, accent: 'ok' },
            })
          }
        }

        t.push({
          step: 'done',
          note: `Largest product of any contiguous run: ${best}. One pass, two numbers of memory.`,
          view: paint(n - 1, 'good'),
          vars: [['answer', best, 'ok']],
          badge: { text: `max product ${best}`, accent: 'ok' },
        })
      },

      run([nums]: [number[]], c) {
        let best = nums[0]
        let hi = nums[0]
        let lo = nums[0]
        for (let i = 1; i < nums.length; i++) {
          c.ops++
          const x = nums[i]
          if (x < 0) [hi, lo] = [lo, hi]
          hi = Math.max(x, hi * x)
          lo = Math.min(x, lo * x)
          best = Math.max(best, hi)
        }
        return best
      },
    },
  ],
}
