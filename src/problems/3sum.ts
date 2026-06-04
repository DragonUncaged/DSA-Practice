import { arr, type Problem, type Tone } from '@/lib/types'

const DEMO: [number[]] = [[-1, 0, 1, 2, -1, -4]]

export const threeSum: Problem = {
  id: '3sum',
  title: '3Sum',
  group: 'Array',
  pattern: 'Sort + Two Pointers',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/3sum/',
  statement:
    'Given an integer array `nums`, return all unique triplets `[a, b, c]` such that `a + b + c = 0`. The answer must not contain duplicate triplets.',
  constraints: ['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5', 'No duplicate triplets in the answer'],
  signature: { fn: 'threeSum', params: [{ name: 'nums', type: 'int[]' }], ret: 'int[][]' },
  compare: 'set',
  tests: [
    { args: [[-1, 0, 1, 2, -1, -4]], expect: [[-1, -1, 2], [-1, 0, 1]] },
    { args: [[0, 1, 1]], expect: [] },
    { args: [[0, 0, 0]], expect: [[0, 0, 0]] },
    { args: [[-2, 0, 1, 1, 2]], expect: [[-2, 0, 2], [-2, 1, 1]] },
  ],
  demo: DEMO,
  scale: (n) => [Array.from({ length: n }, (_, i) => ((i * 37) % 41) - 20)],
  starter: {
    js: `function threeSum(nums) {
  // nums: number[]  ->  number[][]
}
`,
    cpp: `vector<vector<int>> threeSum(vector<int>& nums) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'two-pointer',
      label: 'Sort, fix one, pinch the rest',
      kind: 'optimal',
      time: 'O(n^2)',
      space: 'O(1)',
      blurb:
        'Sort first. Then fix the smallest member of the triplet and the problem collapses into Two Sum on a sorted array — a left and right pointer pinching inward. Sorting also makes duplicates adjacent, so skipping them is one comparison.',
      code: {
        cpp: {
          lines: [
            'vector<vector<int>> threeSum(vector<int>& nums) {',
            '    sort(nums.begin(), nums.end());',
            '    vector<vector<int>> out;',
            '    for (int i = 0; i + 2 < nums.size(); ++i) {',
            '        if (i && nums[i] == nums[i - 1]) continue;',
            '        int l = i + 1, r = nums.size() - 1;',
            '        while (l < r) {',
            '            int s = nums[i] + nums[l] + nums[r];',
            '            if (s == 0) {',
            '                out.push_back({nums[i], nums[l], nums[r]});',
            '                ++l;',
            '                while (l < r && nums[l] == nums[l - 1]) ++l;',
            '            } else if (s < 0) ++l;',
            '            else --r;',
            '        }',
            '    }',
            '    return out;',
            '}',
          ],
          map: { init: 2, fix: 6, skip: 5, check: 8, found: 10, lt: 13, gt: 14, done: 17 },
        },
        js: {
          lines: [
            'function threeSum(nums) {',
            '  nums.sort((a, b) => a - b);',
            '  const out = [];',
            '  for (let i = 0; i + 2 < nums.length; i++) {',
            '    if (i > 0 && nums[i] === nums[i - 1]) continue;',
            '    let l = i + 1;',
            '    let r = nums.length - 1;',
            '    while (l < r) {',
            '      const s = nums[i] + nums[l] + nums[r];',
            '      if (s === 0) {',
            '        out.push([nums[i], nums[l], nums[r]]);',
            '        l++;',
            '        while (l < r && nums[l] === nums[l - 1]) l++;',
            '      } else if (s < 0) l++;',
            '      else r--;',
            '    }',
            '  }',
            '  return out;',
            '}',
          ],
          map: { init: 2, fix: 6, skip: 5, check: 9, found: 11, lt: 14, gt: 15, done: 18 },
        },
      },

      trace(t, [input]: [number[]]) {
        const nums = [...input].sort((a, b) => a - b)
        const n = nums.length
        const out: number[][] = []

        const paint = (i: number, l: number | null, r: number | null, tone: Tone = 'active') => {
          const tones: Record<number, Tone> = {}
          for (let k = 0; k < n; k++) tones[k] = k < i ? 'dim' : 'idle'
          tones[i] = 'accent'
          if (l != null) tones[l] = tone
          if (r != null) tones[r] = tone
          return arr(nums, {
            tones,
            pointers: [
              { name: 'i', at: i, accent: 'c' },
              ...(l != null ? [{ name: 'l', at: l, accent: 'a' as const, lane: 1 }] : []),
              ...(r != null ? [{ name: 'r', at: r, accent: 'b' as const, lane: 1 }] : []),
            ],
            title: 'nums (sorted)',
          })
        }

        t.push({
          step: 'init',
          note: `Sorted: [${nums.join(', ')}]. Fixing the first member i turns the rest into "find two numbers summing to ${-nums[0]}" — a pinching two-pointer scan.`,
          view: paint(0, 1, n - 1, 'idle'),
          vars: [['sorted', 'yes', 'ok']],
        })

        for (let i = 0; i + 2 < n && !t.full; i++) {
          if (i > 0 && nums[i] === nums[i - 1]) {
            t.push({
              step: 'skip',
              note: `nums[${i}] repeats nums[${i - 1}] — every triplet starting here was already produced. Skip to avoid duplicates.`,
              view: paint(i, null, null),
              vars: [['i', i, 'c']],
              badge: { text: 'duplicate i, skip', accent: 'no' },
            })
            continue
          }

          let l = i + 1
          let r = n - 1
          t.push({
            step: 'fix',
            note: `Fix nums[${i}] = ${nums[i]}. Now pinch: l and r need to sum to ${-nums[i]}.`,
            view: paint(i, l, r, 'idle'),
            vars: [
              ['i', i, 'c'],
              ['need', -nums[i], 'c'],
            ],
          })

          while (l < r && !t.full) {
            const s = nums[i] + nums[l] + nums[r]
            t.bump()

            if (s === 0) {
              out.push([nums[i], nums[l], nums[r]])
              t.push({
                step: 'found',
                note: `${nums[i]} + ${nums[l]} + ${nums[r]} = 0. Record [${nums[i]}, ${nums[l]}, ${nums[r]}], then advance l past any copies of ${nums[l]}.`,
                view: paint(i, l, r, 'good'),
                vars: [
                  ['triplet', `[${nums[i]}, ${nums[l]}, ${nums[r]}]`, 'ok'],
                  ['found so far', out.length, 'ok'],
                ],
                badge: { text: `triplet #${out.length}`, accent: 'ok' },
              })
              l++
              while (l < r && nums[l] === nums[l - 1]) l++
            } else if (s < 0) {
              t.push({
                step: 'lt',
                note: `Sum is ${s}, below zero — the only way up is a larger l value.`,
                view: paint(i, l, r),
                vars: [
                  ['sum', s, 'no'],
                  ['action', 'l++', 'a'],
                ],
                badge: { text: `${s} < 0`, accent: 'a' },
              })
              l++
            } else {
              t.push({
                step: 'gt',
                note: `Sum is ${s}, above zero — retreat r to something smaller.`,
                view: paint(i, l, r),
                vars: [
                  ['sum', s, 'no'],
                  ['action', 'r--', 'b'],
                ],
                badge: { text: `${s} > 0`, accent: 'b' },
              })
              r--
            }
          }
        }

        t.push({
          step: 'done',
          note: `${out.length} unique triplet${out.length === 1 ? '' : 's'} found. Sorting cost O(n log n); the pinch behind each fixed i keeps the whole thing at O(n²) instead of O(n³).`,
          view: paint(0, null, null, 'idle'),
          vars: [['answer', JSON.stringify(out), 'ok']],
          badge: { text: `${out.length} triplets`, accent: 'ok' },
        })
      },

      run([input]: [number[]], c) {
        const nums = [...input].sort((a, b) => a - b)
        const out: number[][] = []
        for (let i = 0; i + 2 < nums.length; i++) {
          if (i > 0 && nums[i] === nums[i - 1]) continue
          let l = i + 1
          let r = nums.length - 1
          while (l < r) {
            c.ops++
            const s = nums[i] + nums[l] + nums[r]
            if (s === 0) {
              out.push([nums[i], nums[l], nums[r]])
              l++
              while (l < r && nums[l] === nums[l - 1]) l++
            } else if (s < 0) l++
            else r--
          }
        }
        return out
      },
    },
  ],
}
