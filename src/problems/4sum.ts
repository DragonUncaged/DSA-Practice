import { arr, type Problem, type Tone } from '@/lib/types'

const DEMO: [number[], number] = [[-1, 0, 1, 2, -1, -4], -1]

export const fourSum: Problem = {
  id: '4sum',
  title: '4Sum',
  group: 'Array',
  pattern: 'Sort + Two Pointers',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/4sum/',
  statement:
    'Given an integer array `nums` and an integer `target`, return all unique quadruplets `[a, b, c, d]` such that `a + b + c + d = target`, using four distinct indices. The answer must not contain duplicate quadruplets.',
  constraints: [
    '1 <= nums.length <= 200',
    '-10^9 <= nums[i] <= 10^9',
    '-10^9 <= target <= 10^9',
    'No duplicate quadruplets in the answer',
  ],
  signature: {
    fn: 'fourSum',
    params: [
      { name: 'nums', type: 'int[]' },
      { name: 'target', type: 'int' },
    ],
    ret: 'int[][]',
  },
  compare: 'set',
  tests: [
    { args: [[1, 0, -1, 0, -2, 2], 0], expect: [[-2, -1, 1, 2], [-2, 0, 0, 2], [-1, 0, 0, 1]] },
    { args: [[2, 2, 2, 2, 2], 8], expect: [[2, 2, 2, 2]] },
    { args: [[0, 0, 0, 0], 0], expect: [[0, 0, 0, 0]] },
    { args: [[1, -2, -5, -4, -3, 3, 3, 5], -11], expect: [[-5, -4, -3, 1]] },
    { args: [[1, 2, 3], 6], expect: [], note: 'fewer than four numbers' },
    {
      args: [[1000000000, 1000000000, 1000000000, 1000000000], -294967296],
      expect: [],
      note: 'the sum overflows a 32-bit int',
    },
  ],
  demo: DEMO,
  // distinct even values and an odd target: no duplicates to skip, no hits, so the pinch always runs full length
  scale: (n) => [Array.from({ length: n }, (_, i) => 2 * i - n), 1],
  starter: {
    py: `def fourSum(nums, target):
    # nums: list[int], target: int  ->  list[list[int]]
    pass
`,
    js: `function fourSum(nums, target) {
  // nums: number[], target: number  ->  number[][]
}
`,
    cpp: `vector<vector<int>> fourSum(vector<int>& nums, int target) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'two-pointer',
      label: 'Sort, fix two, pinch the rest',
      kind: 'optimal',
      time: 'O(n^3)',
      space: 'O(1)',
      blurb:
        'Sort first. Fix the two smallest members of the quadruplet and what is left is Two Sum on a sorted array — a left and right pointer pinching inward. Sorting makes duplicates adjacent, so skipping them at each level is one comparison, and the same trick keeps stacking: every extra fixed index costs one more factor of n.',
      code: {
        py: {
          lines: [
            'def fourSum(nums, target):',
            '    nums.sort()',
            '    out = []',
            '    n = len(nums)',
            '    for i in range(n - 3):',
            '        if i > 0 and nums[i] == nums[i - 1]:',
            '            continue',
            '        for j in range(i + 1, n - 2):',
            '            if j > i + 1 and nums[j] == nums[j - 1]:',
            '                continue',
            '            l, r = j + 1, n - 1',
            '            while l < r:',
            '                s = nums[i] + nums[j] + nums[l] + nums[r]',
            '                if s == target:',
            '                    out.append([nums[i], nums[j], nums[l], nums[r]])',
            '                    l += 1',
            '                    while l < r and nums[l] == nums[l - 1]:',
            '                        l += 1',
            '                elif s < target:',
            '                    l += 1',
            '                else:',
            '                    r -= 1',
            '    return out',
          ],
          map: { init: 2, fixi: 5, skipi: 7, fixj: 11, skipj: 10, found: 15, lt: 20, gt: 22, done: 23 },
        },
        cpp: {
          lines: [
            'vector<vector<int>> fourSum(vector<int>& nums, int target) {',
            '    sort(nums.begin(), nums.end());',
            '    vector<vector<int>> out;',
            '    int n = nums.size();',
            '    for (int i = 0; i + 3 < n; ++i) {',
            '        if (i && nums[i] == nums[i - 1]) continue;',
            '        for (int j = i + 1; j + 2 < n; ++j) {',
            '            if (j > i + 1 && nums[j] == nums[j - 1]) continue;',
            '            int l = j + 1, r = n - 1;',
            '            while (l < r) {',
            '                long long s = (long long)nums[i] + nums[j] + nums[l] + nums[r];',
            '                if (s == target) {',
            '                    out.push_back({nums[i], nums[j], nums[l], nums[r]});',
            '                    ++l;',
            '                    while (l < r && nums[l] == nums[l - 1]) ++l;',
            '                } else if (s < target) ++l;',
            '                else --r;',
            '            }',
            '        }',
            '    }',
            '    return out;',
            '}',
          ],
          map: { init: 2, fixi: 5, skipi: 6, fixj: 9, skipj: 8, found: 13, lt: 16, gt: 17, done: 21 },
        },
        js: {
          lines: [
            'function fourSum(nums, target) {',
            '  nums.sort((a, b) => a - b);',
            '  const out = [];',
            '  const n = nums.length;',
            '  for (let i = 0; i + 3 < n; i++) {',
            '    if (i > 0 && nums[i] === nums[i - 1]) continue;',
            '    for (let j = i + 1; j + 2 < n; j++) {',
            '      if (j > i + 1 && nums[j] === nums[j - 1]) continue;',
            '      let l = j + 1;',
            '      let r = n - 1;',
            '      while (l < r) {',
            '        const s = nums[i] + nums[j] + nums[l] + nums[r];',
            '        if (s === target) {',
            '          out.push([nums[i], nums[j], nums[l], nums[r]]);',
            '          l++;',
            '          while (l < r && nums[l] === nums[l - 1]) l++;',
            '        } else if (s < target) l++;',
            '        else r--;',
            '      }',
            '    }',
            '  }',
            '  return out;',
            '}',
          ],
          map: { init: 2, fixi: 5, skipi: 6, fixj: 9, skipj: 8, found: 14, lt: 17, gt: 18, done: 22 },
        },
      },

      trace(t, [input, target]: [number[], number]) {
        const nums = [...input].sort((a, b) => a - b)
        const n = nums.length
        const out: number[][] = []

        const paint = (
          i: number,
          j: number | null,
          l: number | null,
          r: number | null,
          tone: Tone = 'active',
        ) => {
          const tones: Record<number, Tone> = {}
          for (let k = 0; k < n; k++) tones[k] = k < i ? 'dim' : 'idle'
          tones[i] = 'accent'
          if (j != null) {
            for (let k = i + 1; k < j; k++) tones[k] = 'dim'
            tones[j] = 'accent'
          }
          if (l != null) tones[l] = tone
          if (r != null) tones[r] = tone
          return arr(nums, {
            tones,
            pointers: [
              { name: 'i', at: i, accent: 'c' },
              ...(j != null ? [{ name: 'j', at: j, accent: 'c' as const }] : []),
              ...(l != null ? [{ name: 'l', at: l, accent: 'a' as const, lane: 1 }] : []),
              ...(r != null ? [{ name: 'r', at: r, accent: 'b' as const, lane: 1 }] : []),
            ],
            title: 'nums (sorted)',
          })
        }

        t.push({
          step: 'init',
          note: `Sorted: [${nums.join(', ')}]. Fixing two members i and j turns the rest into "find two numbers summing to ${target - nums[0] - nums[1]}" — a pinching two-pointer scan, one level deeper than 3Sum.`,
          view: paint(0, 1, 2, n - 1, 'idle'),
          vars: [
            ['target', target, 'c'],
            ['sorted', 'yes', 'ok'],
          ],
        })

        for (let i = 0; i + 3 < n && !t.full; i++) {
          if (i > 0 && nums[i] === nums[i - 1]) {
            t.push({
              step: 'skipi',
              note: `nums[${i}] repeats nums[${i - 1}] — every quadruplet starting here was already produced. Skip to avoid duplicates.`,
              view: paint(i, null, null, null),
              vars: [['i', i, 'c']],
              badge: { text: 'duplicate i, skip', accent: 'no' },
            })
            continue
          }

          t.push({
            step: 'fixi',
            note: `Fix nums[${i}] = ${nums[i]}. The remaining three must sum to ${target - nums[i]} — that is 3Sum on the suffix.`,
            view: paint(i, null, null, null),
            vars: [
              ['i', i, 'c'],
              ['need', target - nums[i], 'c'],
            ],
          })

          for (let j = i + 1; j + 2 < n && !t.full; j++) {
            if (j > i + 1 && nums[j] === nums[j - 1]) {
              t.push({
                step: 'skipj',
                note: `nums[${j}] repeats nums[${j - 1}] — every quadruplet starting with (${nums[i]}, ${nums[j]}) was already produced. Skip.`,
                view: paint(i, j, null, null),
                vars: [
                  ['i', i, 'c'],
                  ['j', j, 'c'],
                ],
                badge: { text: 'duplicate j, skip', accent: 'no' },
              })
              continue
            }

            let l = j + 1
            let r = n - 1
            t.push({
              step: 'fixj',
              note: `Fix nums[${j}] = ${nums[j]} too. Now pinch: l and r need to sum to ${target - nums[i] - nums[j]}.`,
              view: paint(i, j, l, r, 'idle'),
              vars: [
                ['i', i, 'c'],
                ['j', j, 'c'],
                ['need', target - nums[i] - nums[j], 'c'],
              ],
            })

            while (l < r && !t.full) {
              const s = nums[i] + nums[j] + nums[l] + nums[r]
              t.bump()

              if (s === target) {
                out.push([nums[i], nums[j], nums[l], nums[r]])
                t.push({
                  step: 'found',
                  note: `${nums[i]} + ${nums[j]} + ${nums[l]} + ${nums[r]} = ${target}. Record [${nums[i]}, ${nums[j]}, ${nums[l]}, ${nums[r]}], then advance l past any copies of ${nums[l]}.`,
                  view: paint(i, j, l, r, 'good'),
                  vars: [
                    ['quadruplet', `[${nums[i]}, ${nums[j]}, ${nums[l]}, ${nums[r]}]`, 'ok'],
                    ['found so far', out.length, 'ok'],
                  ],
                  badge: { text: `quadruplet #${out.length}`, accent: 'ok' },
                })
                l++
                while (l < r && nums[l] === nums[l - 1]) l++
              } else if (s < target) {
                t.push({
                  step: 'lt',
                  note: `Sum is ${s}, below ${target} — the only way up is a larger l value.`,
                  view: paint(i, j, l, r),
                  vars: [
                    ['sum', s, 'no'],
                    ['action', 'l++', 'a'],
                  ],
                  badge: { text: `${s} < ${target}`, accent: 'a' },
                })
                l++
              } else {
                t.push({
                  step: 'gt',
                  note: `Sum is ${s}, above ${target} — retreat r to something smaller.`,
                  view: paint(i, j, l, r),
                  vars: [
                    ['sum', s, 'no'],
                    ['action', 'r--', 'b'],
                  ],
                  badge: { text: `${s} > ${target}`, accent: 'b' },
                })
                r--
              }
            }
          }
        }

        t.push({
          step: 'done',
          note: `${out.length} unique quadruplet${out.length === 1 ? '' : 's'} found. Two fixed indices cost O(n²) and the pinch behind them costs O(n), so the whole thing is O(n³) instead of O(n⁴).`,
          view: paint(0, null, null, null, 'idle'),
          vars: [['answer', JSON.stringify(out), 'ok']],
          badge: { text: `${out.length} quadruplets`, accent: 'ok' },
        })
      },

      run([input, target]: [number[], number], c) {
        const nums = [...input].sort((a, b) => a - b)
        const n = nums.length
        const out: number[][] = []
        for (let i = 0; i + 3 < n; i++) {
          if (i > 0 && nums[i] === nums[i - 1]) continue
          for (let j = i + 1; j + 2 < n; j++) {
            if (j > i + 1 && nums[j] === nums[j - 1]) continue
            let l = j + 1
            let r = n - 1
            while (l < r) {
              c.ops++
              const s = nums[i] + nums[j] + nums[l] + nums[r]
              if (s === target) {
                out.push([nums[i], nums[j], nums[l], nums[r]])
                l++
                while (l < r && nums[l] === nums[l - 1]) l++
              } else if (s < target) l++
              else r--
            }
          }
        }
        return out
      },
    },
  ],
}
