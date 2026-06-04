import { arr, bandTones, type Problem, type Tone } from '@/lib/types'

const DEMO: [number[]] = [[11, 13, 17, 2, 4, 6, 9]]

export const findMinimumInRotatedSortedArray: Problem = {
  id: 'find-minimum-in-rotated-sorted-array',
  title: 'Find Minimum in Rotated Sorted Array',
  group: 'Array',
  pattern: 'Binary Search',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/',
  statement:
    'A sorted array of unique values was rotated some number of times. Find the minimum element in O(log n).',
  constraints: ['1 <= nums.length <= 5000', 'All values are unique', 'Must run in O(log n)'],
  signature: { fn: 'findMin', params: [{ name: 'nums', type: 'int[]' }], ret: 'int' },
  tests: [
    { args: [[3, 4, 5, 1, 2]], expect: 1 },
    { args: [[4, 5, 6, 7, 0, 1, 2]], expect: 0 },
    { args: [[11, 13, 15, 17]], expect: 11, note: 'not rotated at all' },
    { args: [[2, 1]], expect: 1 },
    { args: [[5]], expect: 5, note: 'single element' },
  ],
  demo: DEMO,
  scale: (n) => {
    const cut = Math.floor(n / 3)
    const sorted = Array.from({ length: n }, (_, i) => i)
    return [[...sorted.slice(cut), ...sorted.slice(0, cut)]]
  },
  starter: {
    js: `function findMin(nums) {
  // nums: number[]  ->  number
}
`,
    cpp: `int findMin(vector<int>& nums) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'binary',
      label: 'Binary search on the break',
      kind: 'optimal',
      time: 'O(log n)',
      space: 'O(1)',
      blurb:
        'The rotation leaves exactly one cliff where a big value is followed by a small one, and the minimum sits just after it. Compare the middle with the right end: it tells you which half contains the cliff, so half the array is discarded every step.',
      code: {
        cpp: {
          lines: [
            'int findMin(vector<int>& nums) {',
            '    int l = 0, r = nums.size() - 1;',
            '    while (l < r) {',
            '        int m = (l + r) / 2;',
            '        if (nums[m] > nums[r]) l = m + 1;',
            '        else r = m;',
            '    }',
            '    return nums[l];',
            '}',
          ],
          map: { init: 2, mid: 4, right: 5, left: 6, done: 8 },
        },
        js: {
          lines: [
            'function findMin(nums) {',
            '  let l = 0;',
            '  let r = nums.length - 1;',
            '  while (l < r) {',
            '    const m = (l + r) >> 1;',
            '    if (nums[m] > nums[r]) l = m + 1;',
            '    else r = m;',
            '  }',
            '  return nums[l];',
            '}',
          ],
          map: { init: 3, mid: 5, right: 6, left: 7, done: 9 },
        },
      },

      trace(t, [nums]: [number[]]) {
        const n = nums.length
        let l = 0
        let r = n - 1

        const paint = (m: number | null, tone: Tone = 'active') => {
          const tones = bandTones(n, l, r)
          for (let k = 0; k < n; k++) if (k < l || k > r) tones[k] = 'dim'
          if (m != null) tones[m] = tone
          return arr(nums, {
            tones,
            pointers: [
              { name: 'l', at: l, accent: 'a' },
              { name: 'r', at: r, accent: 'b', lane: 1 },
              ...(m != null ? [{ name: 'm', at: m, accent: 'c' as const }] : []),
            ],
            band: { from: l, to: r, label: 'search space', accent: 'c' },
            title: 'nums',
          })
        }

        t.push({
          step: 'init',
          note: 'The array climbs, falls off a cliff once, then climbs again. The minimum is the first element after the cliff, and the search space starts as the whole array.',
          view: paint(null),
          vars: [
            ['l', l, 'a'],
            ['r', r, 'b'],
          ],
        })

        while (l < r && !t.full) {
          const m = (l + r) >> 1
          t.bump()

          t.push({
            step: 'mid',
            note: `Middle is index ${m}, value ${nums[m]}. Compare it with the right end (${nums[r]}): that one comparison reveals which side of the cliff we are on.`,
            view: paint(m),
            vars: [
              ['m', m, 'c'],
              ['nums[m]', nums[m]],
              ['nums[r]', nums[r]],
            ],
            badge: {
              text: `${nums[m]} ${nums[m] > nums[r] ? '>' : '<='} ${nums[r]}`,
              accent: nums[m] > nums[r] ? 'a' : 'b',
            },
          })

          if (nums[m] > nums[r]) {
            l = m + 1
            t.push({
              step: 'right',
              note: `The middle is larger than the right end, so the cliff — and the minimum — must be to the right of m. Everything up to and including m is discarded.`,
              view: paint(null),
              vars: [
                ['l', l, 'a'],
                ['r', r, 'b'],
                ['remaining', r - l + 1],
              ],
              badge: { text: 'go right', accent: 'a' },
            })
          } else {
            r = m
            t.push({
              step: 'left',
              note: `The middle is not larger than the right end, so from m onward the array is cleanly sorted — the minimum is at m or to its left. Discard everything right of m.`,
              view: paint(null),
              vars: [
                ['l', l, 'a'],
                ['r', r, 'b'],
                ['remaining', r - l + 1],
              ],
              badge: { text: 'go left', accent: 'b' },
            })
          }
        }

        t.push({
          step: 'done',
          note: `The search space collapsed to one index. The minimum is ${nums[l]}, found in ${t.ops} halvings instead of a full scan.`,
          view: paint(l, 'good'),
          vars: [['answer', nums[l], 'ok']],
          badge: { text: `min = ${nums[l]}`, accent: 'ok' },
        })
      },

      run([nums]: [number[]], c) {
        let l = 0
        let r = nums.length - 1
        while (l < r) {
          c.ops++
          const m = (l + r) >> 1
          if (nums[m] > nums[r]) l = m + 1
          else r = m
        }
        return nums[l]
      },
    },
  ],
}
