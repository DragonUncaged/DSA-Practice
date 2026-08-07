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
    {
      args: [
        [1, 2, 3],
        [1, 2, 3],
      ],
      expect: 0,
      note: 'a heater in every house',
    },
    { args: [[1], [100]], expect: 99, note: 'a single house far from its only heater' },
    {
      args: [
        [5, 6],
        [1, 10],
      ],
      expect: 4,
      note: 'heaters beyond both ends',
    },
    { args: [[3, 1, 2], [2]], expect: 1, note: 'unsorted input' },
    { args: [[1, 1, 1], [1]], expect: 0, note: 'repeated positions' },
    { args: [[1, 1000000000], [500000000]], expect: 500000000, note: 'the position bounds' },
    { args: [[1], [1, 1000000000]], expect: 0 },
    {
      args: [Array.from({ length: 3000 }, (_, i) => i + 1), Array.from({ length: 30 }, (_, i) => i * 100 + 50)],
      expect: 50,
      note: 'a long street with a heater every hundred positions',
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
      id: 'nearest-by-scan',
      label: 'Scan every heater for every house',
      kind: 'brute',
      time: 'O(n * m)',
      space: 'O(1)',
      blurb:
        'Each house only cares about its nearest heater, and the answer is the worst of those distances. The direct way to find the nearest heater is to look at all of them, so every house scans the whole heater list. Nothing needs sorting, but the work is the product of the two list lengths.',
      code: {
        cpp: {
          lines: [
            'int findRadius(vector<int>& houses, vector<int>& heaters) {',
            '    int best = 0;',
            '    for (int h : houses) {',
            '        int nearest = INT_MAX;',
            '        for (int t : heaters) nearest = min(nearest, abs(t - h));',
            '        best = max(best, nearest);',
            '    }',
            '    return best;',
            '}',
          ],
        },
        js: {
          lines: [
            'function findRadius(houses, heaters) {',
            '  let best = 0;',
            '  for (const h of houses) {',
            '    let nearest = Infinity;',
            '    for (const t of heaters) nearest = Math.min(nearest, Math.abs(t - h));',
            '    best = Math.max(best, nearest);',
            '  }',
            '  return best;',
            '}',
          ],
        },
      },
      run([houses, heaters]: [number[], number[]], c) {
        let best = 0
        for (const h of houses) {
          let nearest = Infinity
          for (const t of heaters) {
            c.ops++
            nearest = Math.min(nearest, Math.abs(t - h))
          }
          best = Math.max(best, nearest)
        }
        return best
      },
    },
    {
      id: 'binary-search',
      label: 'Sort the heaters, binary search per house',
      kind: 'better',
      time: 'O((n + m) log m)',
      space: 'O(1)',
      blurb:
        'Once the heaters are sorted, the nearest one to a house is either the first heater at or after it or the one just before, and a binary search finds that boundary in logarithmic time. Each house now costs a search instead of a scan; the sort is paid once.',
      code: {
        cpp: {
          lines: [
            'int findRadius(vector<int>& houses, vector<int>& heaters) {',
            '    sort(heaters.begin(), heaters.end());',
            '    int best = 0;',
            '    for (int h : houses) {',
            '        auto it = lower_bound(heaters.begin(), heaters.end(), h);',
            '        int nearest = INT_MAX;',
            '        if (it != heaters.end()) nearest = min(nearest, *it - h);',
            '        if (it != heaters.begin()) nearest = min(nearest, h - *prev(it));',
            '        best = max(best, nearest);',
            '    }',
            '    return best;',
            '}',
          ],
        },
        js: {
          lines: [
            'function findRadius(houses, heaters) {',
            '  const ht = heaters.slice().sort((a, b) => a - b);',
            '  let best = 0;',
            '  for (const h of houses) {',
            '    let lo = 0, hi = ht.length;',
            '    while (lo < hi) {',
            '      const mid = (lo + hi) >> 1;',
            '      if (ht[mid] < h) lo = mid + 1;',
            '      else hi = mid;',
            '    }',
            '    let nearest = Infinity;',
            '    if (lo < ht.length) nearest = Math.min(nearest, ht[lo] - h);',
            '    if (lo > 0) nearest = Math.min(nearest, h - ht[lo - 1]);',
            '    best = Math.max(best, nearest);',
            '  }',
            '  return best;',
            '}',
          ],
        },
      },
      run([houses, heaters]: [number[], number[]], c) {
        const ht = heaters.slice().sort((a, b) => a - b)
        c.ops += ht.length * Math.ceil(Math.log2(ht.length + 1))
        let best = 0
        for (const h of houses) {
          let lo = 0
          let hi = ht.length
          while (lo < hi) {
            c.ops++
            const mid = (lo + hi) >> 1
            if (ht[mid] < h) lo = mid + 1
            else hi = mid
          }
          let nearest = Infinity
          if (lo < ht.length) nearest = Math.min(nearest, ht[lo] - h)
          if (lo > 0) nearest = Math.min(nearest, h - ht[lo - 1])
          best = Math.max(best, nearest)
        }
        return best
      },
    },
    {
      id: 'sort-sweep',
      label: 'Sort both, then walk the heaters forward',
      kind: 'optimal',
      time: 'O(n log n + m log m)',
      space: 'O(1)',
      blurb:
        'Sorting the houses as well removes the searches. Once both lists are in order, the nearest heater never moves backwards as the houses advance, so one forward-only pointer finds it: step the heater on while the next one is no further away. The two sorts are the whole cost, and the sweep after them is linear.',
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
