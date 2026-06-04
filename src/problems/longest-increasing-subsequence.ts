import { arr, combo, type Problem, type Tone } from '@/lib/types'

const DEMO: [number[]] = [[10, 9, 2, 5, 3, 7, 101, 18]]

export const longestIncreasingSubsequence: Problem = {
  id: 'longest-increasing-subsequence',
  title: 'Longest Increasing Subsequence',
  group: 'Dynamic Programming',
  pattern: 'DP over Prefixes',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/longest-increasing-subsequence/',
  statement:
    'Given an integer array `nums`, return the length of the longest strictly increasing subsequence. Elements keep their order but need not be adjacent.',
  constraints: ['1 <= nums.length <= 2500', '-10^4 <= nums[i] <= 10^4'],
  signature: { fn: 'lengthOfLIS', params: [{ name: 'nums', type: 'int[]' }], ret: 'int' },
  tests: [
    { args: [[10, 9, 2, 5, 3, 7, 101, 18]], expect: 4 },
    { args: [[0, 1, 0, 3, 2, 3]], expect: 4 },
    { args: [[7, 7, 7, 7]], expect: 1, note: 'strictly increasing, so equal does not count' },
    { args: [[4, 10, 4, 3, 8, 9]], expect: 3 },
  ],
  demo: DEMO,
  scale: (n) => [Array.from({ length: n }, (_, i) => (i * 7919) % 1000)],
  starter: {
    js: `function lengthOfLIS(nums) {
  // nums: number[]  ->  number
}
`,
    cpp: `int lengthOfLIS(vector<int>& nums) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'dp',
      label: 'Best chain ending at each index',
      kind: 'optimal',
      time: 'O(n^2)',
      space: 'O(n)',
      blurb:
        'For each index, ask: which earlier elements are smaller than me? The best chain ending here is the best of their chains, plus me. dp[i] answers that once and never again — the classic subproblem table. (An O(n log n) version exists, but this is the one to understand first.)',
      code: {
        cpp: {
          lines: [
            'int lengthOfLIS(vector<int>& nums) {',
            '    int n = nums.size();',
            '    vector<int> dp(n, 1);',
            '    int best = 1;',
            '    for (int i = 0; i < n; ++i) {',
            '        for (int j = 0; j < i; ++j)',
            '            if (nums[j] < nums[i]) dp[i] = max(dp[i], dp[j] + 1);',
            '        best = max(best, dp[i]);',
            '    }',
            '    return best;',
            '}',
          ],
          map: { init: 3, scan: 5, extend: 7, done: 10 },
        },
        js: {
          lines: [
            'function lengthOfLIS(nums) {',
            '  const n = nums.length;',
            '  const dp = new Array(n).fill(1);',
            '  for (let i = 0; i < n; i++) {',
            '    for (let j = 0; j < i; j++) {',
            '      if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);',
            '    }',
            '  }',
            '  return Math.max(...dp);',
            '}',
          ],
          map: { init: 3, scan: 4, extend: 6, done: 9 },
        },
      },

      trace(t, [nums]: [number[]]) {
        const n = nums.length
        const dp = new Array(n).fill(1)

        const paint = (i: number, j: number | null, hit: boolean) => {
          const numTones: Record<number, Tone> = {}
          const dpTones: Record<number, Tone> = {}
          for (let k = 0; k < n; k++) {
            numTones[k] = k < i ? 'done' : k > i ? 'idle' : 'active'
            dpTones[k] = k < i ? 'band' : k > i ? 'idle' : 'active'
          }
          if (j != null) numTones[j] = hit ? 'good' : 'bad'
          return combo(
            arr(nums, {
              tones: numTones,
              pointers: [
                { name: 'i', at: i, accent: 'b' },
                ...(j != null ? [{ name: 'j', at: j, accent: 'a' as const, lane: 1 }] : []),
              ],
              title: 'nums',
            }),
            arr([...dp], { tones: dpTones, title: 'dp — longest chain ending here', showIndex: false }),
          )
        }

        t.push({
          step: 'init',
          note: 'Every element alone is a chain of length 1, so the table starts as all 1s. Each index will now shop among the earlier, smaller elements for the best chain to extend.',
          view: paint(0, null, false),
          vars: [['dp', 'all 1s', 'mute']],
        })

        for (let i = 1; i < n && !t.full; i++) {
          t.push({
            step: 'scan',
            note: `Index ${i} (value ${nums[i]}): scan everything before it for values smaller than ${nums[i]}.`,
            view: paint(i, null, false),
            vars: [
              ['i', i, 'b'],
              ['nums[i]', nums[i]],
            ],
          })

          for (let j = 0; j < i && !t.full; j++) {
            t.bump()
            if (nums[j] < nums[i] && dp[j] + 1 > dp[i]) {
              dp[i] = dp[j] + 1
              t.push({
                step: 'extend',
                note: `${nums[j]} < ${nums[i]} and its chain has length ${dp[j]} — extending it gives ${dp[i]}, the best so far for index ${i}.`,
                view: paint(i, j, true),
                vars: [
                  ['j', j, 'a'],
                  [`dp[${j}] + 1`, dp[i], 'ok'],
                  [`dp[${i}]`, dp[i], 'ok'],
                ],
                badge: { text: `dp[${i}] = ${dp[i]}`, accent: 'ok' },
              })
            }
          }
        }

        const best = Math.max(...dp)
        t.push({
          step: 'done',
          note: `The longest chain anywhere has length ${best}. Each of the ${t.ops} comparisons was answered from the table instead of re-walking the array.`,
          view: paint(n - 1, null, false),
          vars: [
            ['answer', best, 'ok'],
            ['comparisons', t.ops],
          ],
          badge: { text: `LIS = ${best}`, accent: 'ok' },
        })
      },

      run([nums]: [number[]], c) {
        const n = nums.length
        const dp = new Array(n).fill(1)
        let best = 1
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < i; j++) {
            c.ops++
            if (nums[j] < nums[i] && dp[j] + 1 > dp[i]) dp[i] = dp[j] + 1
          }
          if (dp[i] > best) best = dp[i]
        }
        return best
      },
    },
  ],
}
