import { arr, bandTones, type Problem, type Tone } from '@/lib/types'

const DEMO: [number[], number] = [[9, 12, 15, 1, 3, 5, 7], 3]

export const searchInRotatedSortedArray: Problem = {
  id: 'search-in-rotated-sorted-array',
  title: 'Search in Rotated Sorted Array',
  group: 'Array',
  pattern: 'Binary Search',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
  statement:
    'A sorted array of unique values was rotated at an unknown pivot. Find the index of `target`, or `-1` if it is absent, in O(log n).',
  constraints: ['1 <= nums.length <= 5000', 'All values are unique', 'Must run in O(log n)'],
  signature: {
    fn: 'search',
    params: [
      { name: 'nums', type: 'int[]' },
      { name: 'target', type: 'int' },
    ],
    ret: 'int',
  },
  tests: [
    { args: [[4, 5, 6, 7, 0, 1, 2], 0], expect: 4 },
    { args: [[4, 5, 6, 7, 0, 1, 2], 3], expect: -1 },
    { args: [[1], 0], expect: -1 },
    { args: [[5, 1, 3], 3], expect: 2 },
    { args: [[3, 1], 1], expect: 1 },
  ],
  demo: DEMO,
  scale: (n) => {
    const cut = Math.floor(n / 3)
    const sorted = Array.from({ length: n }, (_, i) => i * 2)
    return [[...sorted.slice(cut), ...sorted.slice(0, cut)], -1]
  },
  starter: {
    js: `function search(nums, target) {
  // nums: number[], target: number  ->  number
}
`,
    cpp: `int search(vector<int>& nums, int target) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'binary',
      label: 'Binary search, sorted-half first',
      kind: 'optimal',
      time: 'O(log n)',
      space: 'O(1)',
      blurb:
        'Cut anywhere in a rotated array and at least one half is still perfectly sorted. A sorted half answers "is the target in you?" with two comparisons — so decide that, keep the half that could contain the target, and discard the other.',
      code: {
        cpp: {
          lines: [
            'int search(vector<int>& nums, int target) {',
            '    int l = 0, r = nums.size() - 1;',
            '    while (l <= r) {',
            '        int m = (l + r) / 2;',
            '        if (nums[m] == target) return m;',
            '        if (nums[l] <= nums[m]) {',
            '            if (nums[l] <= target && target < nums[m]) r = m - 1;',
            '            else l = m + 1;',
            '        } else {',
            '            if (nums[m] < target && target <= nums[r]) l = m + 1;',
            '            else r = m - 1;',
            '        }',
            '    }',
            '    return -1;',
            '}',
          ],
          map: { init: 2, mid: 4, found: 5, leftSorted: 6, rightSorted: 9, move: 8, done: 14 },
        },
        js: {
          lines: [
            'function search(nums, target) {',
            '  let l = 0;',
            '  let r = nums.length - 1;',
            '  while (l <= r) {',
            '    const m = (l + r) >> 1;',
            '    if (nums[m] === target) return m;',
            '    if (nums[l] <= nums[m]) {',
            '      if (nums[l] <= target && target < nums[m]) r = m - 1;',
            '      else l = m + 1;',
            '    } else {',
            '      if (nums[m] < target && target <= nums[r]) l = m + 1;',
            '      else r = m - 1;',
            '    }',
            '  }',
            '  return -1;',
            '}',
          ],
          map: { init: 3, mid: 5, found: 6, leftSorted: 7, rightSorted: 10, move: 9, done: 15 },
        },
      },

      trace(t, [nums, target]: [number[], number]) {
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
              { name: 'l', at: Math.min(l, n - 1), accent: 'a' },
              { name: 'r', at: Math.max(r, 0), accent: 'b', lane: 1 },
              ...(m != null ? [{ name: 'm', at: m, accent: 'c' as const }] : []),
            ],
            band: l <= r ? { from: l, to: r, label: 'search space', accent: 'c' } : null,
            title: 'nums',
          })
        }

        t.push({
          step: 'init',
          note: `Looking for ${target}. The array is rotated, but every cut still leaves one sorted half — that is the structure the search exploits.`,
          view: paint(null),
          vars: [
            ['target', target],
            ['l', l, 'a'],
            ['r', r, 'b'],
          ],
        })

        while (l <= r && !t.full) {
          const m = (l + r) >> 1
          t.bump()

          if (nums[m] === target) {
            t.push({
              step: 'found',
              note: `nums[${m}] is exactly ${target}. Found it in ${t.ops} probes.`,
              view: paint(m, 'good'),
              vars: [
                ['m', m, 'c'],
                ['answer', m, 'ok'],
              ],
              badge: { text: `found at ${m}`, accent: 'ok' },
            })
            return
          }

          const leftSorted = nums[l] <= nums[m]
          t.push({
            step: leftSorted ? 'leftSorted' : 'rightSorted',
            note: leftSorted
              ? `nums[l] <= nums[m] (${nums[l]} <= ${nums[m]}), so the left half is cleanly sorted. Target ${target} is inside it only if ${nums[l]} <= ${target} < ${nums[m]}.`
              : `nums[l] > nums[m] (${nums[l]} > ${nums[m]}), so the cliff is in the left half — which means the right half is the sorted one. Check whether ${target} fits inside it.`,
            view: paint(m),
            vars: [
              ['m', m, 'c'],
              ['nums[m]', nums[m]],
              ['sorted half', leftSorted ? 'left' : 'right', 'c'],
            ],
            badge: { text: leftSorted ? 'left half sorted' : 'right half sorted', accent: 'c' },
          })

          if (leftSorted) {
            if (nums[l] <= target && target < nums[m]) r = m - 1
            else l = m + 1
          } else {
            if (nums[m] < target && target <= nums[r]) l = m + 1
            else r = m - 1
          }

          t.push({
            step: 'move',
            note: `Keep only the half that can contain ${target}. The search space is now ${Math.max(0, r - l + 1)} element${r - l === 0 ? '' : 's'}.`,
            view: paint(null),
            vars: [
              ['l', Math.min(l, n - 1), 'a'],
              ['r', Math.max(r, 0), 'b'],
              ['remaining', Math.max(0, r - l + 1)],
            ],
          })
        }

        t.push({
          step: 'done',
          note: `The search space emptied without finding ${target} — it is not in the array.`,
          view: paint(null),
          vars: [['answer', -1, 'no']],
          badge: { text: 'not found', accent: 'no' },
        })
      },

      run([nums, target]: [number[], number], c) {
        let l = 0
        let r = nums.length - 1
        while (l <= r) {
          c.ops++
          const m = (l + r) >> 1
          if (nums[m] === target) return m
          if (nums[l] <= nums[m]) {
            if (nums[l] <= target && target < nums[m]) r = m - 1
            else l = m + 1
          } else {
            if (nums[m] < target && target <= nums[r]) l = m + 1
            else r = m - 1
          }
        }
        return -1
      },
    },
  ],
}
