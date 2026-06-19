import type { Problem } from '@/lib/types'

export const numberOfBoomerangs: Problem = {
  id: 'number-of-boomerangs',
  title: 'Number of Boomerangs',
  group: 'Math',
  pattern: 'Group by Distance',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/number-of-boomerangs/',
  statement:
    'A boomerang is an ordered triple of distinct points `(i, j, k)` where the distance from `i` to `j` equals the distance from `i` to `k`. Given `points`, return how many boomerangs there are.',
  constraints: [
    '1 <= points.length <= 500',
    'All points are distinct',
    '-10^4 <= x, y <= 10^4',
    'The triple is ordered, so (i, j, k) and (i, k, j) both count',
  ],
  signature: {
    fn: 'numberOfBoomerangs',
    params: [{ name: 'points', type: 'int[][]' }],
    ret: 'int',
  },
  tests: [
    {
      args: [
        [
          [0, 0],
          [1, 0],
          [2, 0],
        ],
      ],
      expect: 2,
    },
    {
      args: [
        [
          [1, 1],
          [2, 2],
          [3, 3],
        ],
      ],
      expect: 2,
    },
    { args: [[[1, 1]]], expect: 0, note: 'a triple needs three points' },
    {
      args: [
        [
          [0, 0],
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ],
      ],
      expect: 20,
    },
  ],
  demo: [
    [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
  ],
  scale: (n) => {
    const side = Math.max(2, Math.round(Math.sqrt(n)))
    return [Array.from({ length: side }, (_, i) => [i % 13, (i * 7) % 13])]
  },
  starter: {
    js: `function numberOfBoomerangs(points) {
  // points: number[][]  ->  number
}
`,
    cpp: `int numberOfBoomerangs(vector<vector<int>>& points) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'distance-buckets',
      label: 'Bucket distances around each pivot',
      kind: 'optimal',
      time: 'O(n^2)',
      space: 'O(n)',
      blurb:
        'The first point of the triple is special — it is the one both distances are measured from — so fix it and bucket every other point by its squared distance. A bucket of size m contributes m * (m - 1) ordered pairs. Squared distances keep the arithmetic exact; there is no reason to take a square root.',
      code: {
        cpp: {
          lines: [
            'int numberOfBoomerangs(vector<vector<int>>& points) {',
            '    int total = 0;',
            '    for (auto& p : points) {',
            '        unordered_map<long long, int> seen;',
            '        for (auto& q : points) {',
            '            long long dx = p[0] - q[0], dy = p[1] - q[1];',
            '            seen[dx * dx + dy * dy]++;',
            '        }',
            '        for (auto& [d, m] : seen) if (d) total += m * (m - 1);',
            '    }',
            '    return total;',
            '}',
          ],
        },
        js: {
          lines: [
            'function numberOfBoomerangs(points) {',
            '  let total = 0;',
            '  for (const p of points) {',
            '    const seen = new Map();',
            '    for (const q of points) {',
            '      const dx = p[0] - q[0], dy = p[1] - q[1];',
            '      const d = dx * dx + dy * dy;',
            '      seen.set(d, (seen.get(d) ?? 0) + 1);',
            '    }',
            '    for (const [d, m] of seen) if (d) total += m * (m - 1);',
            '  }',
            '  return total;',
            '}',
          ],
        },
      },

      run([points]: [number[][]], c) {
        let total = 0
        for (const p of points) {
          const seen = new Map<number, number>()
          for (const q of points) {
            c.ops++
            const dx = p[0] - q[0]
            const dy = p[1] - q[1]
            const d = dx * dx + dy * dy
            seen.set(d, (seen.get(d) ?? 0) + 1)
          }
          for (const [d, m] of seen) if (d) total += m * (m - 1)
        }
        return total
      },
    },
  ],
}
