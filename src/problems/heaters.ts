import type { Problem } from '@/lib/types'

export const heaters: Problem = {
  id: 'heaters',
  title: 'Heaters',
  group: 'Array',
  pattern: 'Sort + Two Pointers',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/heaters/',
  statement:
    'Houses and heaters sit on a horizontal line at the positions given by `houses` and `heaters`. Every heater has the same warming radius. Return the smallest radius that leaves every house covered by at least one heater.',
  constraints: [
    '1 <= houses.length, heaters.length <= 3 * 10^4',
    '1 <= position <= 10^9',
    'Positions arrive in no particular order and may repeat',
  ],
  signature: {
    fn: 'findRadius',
    params: [
      { name: 'houses', type: 'int[]' },
      { name: 'heaters', type: 'int[]' },
    ],
    ret: 'int',
  },
  tests: [
    { args: [[1, 2, 3], [2]], expect: 1 },
    {
      args: [
        [1, 2, 3, 4],
        [1, 4],
      ],
      expect: 1,
    },
    { args: [[1, 5], [2]], expect: 3, note: 'the furthest house sets the radius' },
    {
      args: [
        [1, 2, 3, 5, 15],
        [2, 30],
      ],
      expect: 13,
    },
  ],
  demo: [[1, 2, 3], [2]],
  scale: (n) => [
    Array.from({ length: n }, (_, i) => (i * 7) % n || 1),
    Array.from({ length: Math.max(1, n >> 3) }, (_, i) => i * 8 + 1),
  ],
  starter: {
    js: `function findRadius(houses, heaters) {
  // houses: number[], heaters: number[]  ->  number
}
`,
    cpp: `int findRadius(vector<int>& houses, vector<int>& heaters) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'sort-sweep',
      label: 'Sort both, then walk the heaters forward',
      kind: 'optimal',
      time: 'O(n log n + m log m)',
      space: 'O(1)',
      blurb:
        'Each house only cares about its nearest heater, and the answer is the worst of those distances. Sorting both lists means the nearest heater never moves backwards as the houses advance, so one forward-only pointer finds it: step the heater on while the next one is no further away.',
      code: {
        cpp: {
          lines: [
            'int findRadius(vector<int>& houses, vector<int>& heaters) {',
            '    sort(houses.begin(), houses.end());',
            '    sort(heaters.begin(), heaters.end());',
            '    int best = 0, j = 0;',
            '    for (int h : houses) {',
            '        while (j + 1 < (int)heaters.size() &&',
            '               abs(heaters[j + 1] - h) <= abs(heaters[j] - h)) j++;',
            '        best = max(best, abs(heaters[j] - h));',
            '    }',
            '    return best;',
            '}',
          ],
        },
        js: {
          lines: [
            'function findRadius(houses, heaters) {',
            '  houses = [...houses].sort((a, b) => a - b);',
            '  heaters = [...heaters].sort((a, b) => a - b);',
            '  let best = 0, j = 0;',
            '  for (const h of houses) {',
            '    while (j + 1 < heaters.length &&',
            '           Math.abs(heaters[j + 1] - h) <= Math.abs(heaters[j] - h)) j++;',
            '    best = Math.max(best, Math.abs(heaters[j] - h));',
            '  }',
            '  return best;',
            '}',
          ],
        },
      },

      run([houses, heaters]: [number[], number[]], c) {
        const hs = [...houses].sort((a, b) => a - b)
        const ht = [...heaters].sort((a, b) => a - b)
        let best = 0
        let j = 0
        for (const h of hs) {
          c.ops++
          while (j + 1 < ht.length && Math.abs(ht[j + 1] - h) <= Math.abs(ht[j] - h)) {
            c.ops++
            j++
          }
          best = Math.max(best, Math.abs(ht[j] - h))
        }
        return best
      },
    },
  ],
}
