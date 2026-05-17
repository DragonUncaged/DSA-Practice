import { arr, type Problem, type Tone } from '@/lib/types'

const DEMO: [number[]] = [[2, 7, 9, 3, 1]]

export const houseRobber: Problem = {
  id: 'house-robber',
  title: 'House Robber',
  group: 'Dynamic Programming',
  pattern: 'Take or Skip',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/house-robber/',
  statement:
    'Each house on a street holds `nums[i]` cash, but robbing two adjacent houses trips the alarm. Return the most you can rob without ever taking two neighbours.',
  constraints: ['1 <= nums.length <= 100', '0 <= nums[i] <= 400'],
  signature: { fn: 'rob', params: [{ name: 'nums', type: 'int[]' }], ret: 'int' },
  tests: [
    { args: [[1, 2, 3, 1]], expect: 4 },
    { args: [[2, 7, 9, 3, 1]], expect: 12 },
    { args: [[5]], expect: 5, note: 'one house' },
    { args: [[2, 1, 1, 2]], expect: 4, note: 'skip two in a row' },
  ],
  demo: DEMO,
  scale: (n) => [Array.from({ length: n }, (_, i) => ((i * 31) % 97) + 1)],
  starter: {
    py: `def rob(nums):
    # nums: list[int]  ->  int
    pass
`,
    js: `function rob(nums) {
  // nums: number[]  ->  number
}
`,
    cpp: `int rob(vector<int>& nums) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'dp',
      label: 'Rob it or skip it',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'At every house there are only two futures: rob it (adding its cash to the best haul from two houses back) or skip it (keeping the best haul from one house back). Carry those two numbers down the street and the last one is the answer.',
      code: {
        py: {
          lines: [
            'def rob(nums):',
            '    take, skip = 0, 0',
            '    for x in nums:',
            '        take, skip = skip + x, max(skip, take)',
            '    return max(take, skip)',
          ],
          map: { init: 2, decide: 4, done: 5 },
        },
        cpp: {
          lines: [
            'int rob(vector<int>& nums) {',
            '    int take = 0, skip = 0;',
            '    for (int x : nums) {',
            '        int t = skip + x;',
            '        skip = max(skip, take);',
            '        take = t;',
            '    }',
            '    return max(take, skip);',
            '}',
          ],
          map: { init: 2, decide: 4, done: 8 },
        },
        js: {
          lines: [
            'function rob(nums) {',
            '  let take = 0;',
            '  let skip = 0;',
            '  for (const x of nums) {',
            '    [take, skip] = [skip + x, Math.max(skip, take)];',
            '  }',
            '  return Math.max(take, skip);',
            '}',
          ],
          map: { init: 3, decide: 5, done: 7 },
        },
      },

      trace(t, [nums]: [number[]]) {
        const n = nums.length
        let take = 0
        let skip = 0

        const paint = (i: number, robbed: boolean[]) => {
          const tones: Record<number, Tone> = {}
          for (let k = 0; k < n; k++) {
            tones[k] = k > i ? 'idle' : robbed[k] ? 'good' : 'dim'
          }
          if (i >= 0 && i < n) tones[i] = robbed[i] ? 'good' : 'bad'
          return arr(nums, {
            tones,
            pointers: i >= 0 && i < n ? [{ name: 'house', at: i, accent: 'b' }] : [],
            title: 'cash per house',
          })
        }

        // reconstruct which houses the optimum actually robs, for the visuals
        const dp: number[] = []
        const robbedAt: boolean[][] = []
        {
          let a = 0
          let b = 0
          const chosen: boolean[] = new Array(n).fill(false)
          for (let i = 0; i < n; i++) {
            const tk = b + nums[i]
            const sk = Math.max(a, b)
            // approximate greedy reconstruction for display purposes
            chosen[i] = tk > sk
            robbedAt.push([...chosen])
            dp.push(Math.max(tk, sk))
            ;[a, b] = [tk, sk]
          }
        }

        t.push({
          step: 'init',
          note: 'Two running numbers cover every possible plan: the best haul if the previous house was robbed, and the best if it was skipped.',
          view: paint(-1, []),
          vars: [
            ['take', 0],
            ['skip', 0],
          ],
        })

        for (let i = 0; i < n; i++) {
          const x = nums[i]
          const newTake = skip + x
          const newSkip = Math.max(skip, take)
          t.bump()
          t.push({
            step: 'decide',
            note: `House ${i} holds ${x}. Rob it: ${skip} + ${x} = ${newTake} (previous house must have been skipped). Skip it: best of the two prior plans, ${newSkip}. Best possible so far: ${Math.max(newTake, newSkip)}.`,
            view: paint(i, robbedAt[i] ?? []),
            vars: [
              ['house', i, 'b'],
              ['cash', x],
              ['rob it', newTake, newTake >= newSkip ? 'ok' : 'mute'],
              ['skip it', newSkip, newSkip > newTake ? 'ok' : 'mute'],
            ],
            badge: {
              text: newTake >= newSkip ? `rob → ${newTake}` : `skip → ${newSkip}`,
              accent: newTake >= newSkip ? 'ok' : 'b',
            },
          })
          take = newTake
          skip = newSkip
        }

        const best = Math.max(take, skip)
        t.push({
          step: 'done',
          note: `Best haul: ${best}. One pass, two integers — the entire decision tree collapsed into take/skip.`,
          view: paint(n - 1, robbedAt[n - 1] ?? []),
          vars: [['answer', best, 'ok']],
          badge: { text: `max ${best}`, accent: 'ok' },
        })
      },

      run([nums]: [number[]], c) {
        let take = 0
        let skip = 0
        for (const x of nums) {
          c.ops++
          ;[take, skip] = [skip + x, Math.max(skip, take)]
        }
        return Math.max(take, skip)
      },
    },
  ],
}
