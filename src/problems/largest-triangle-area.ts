import type { Problem } from '@/lib/types'

export const largestTriangleArea: Problem = {
  id: 'largest-triangle-area',
  title: 'Largest Triangle Area',
  group: 'Math',
  pattern: 'Brute Force over Triples',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/largest-triangle-area/',
  statement:
    'Given a list of `points` on a plane, return the area of the largest triangle formed by any three of them. Collinear triples have area `0`.',
  constraints: ['3 <= points.length <= 50', '-50 <= x, y <= 50', 'All points are distinct'],
  signature: {
    fn: 'largestTriangleArea',
    params: [{ name: 'points', type: 'int[][]' }],
    ret: 'double',
  },
  tests: [
    {
      args: [
        [
          [0, 0],
          [0, 1],
          [1, 0],
          [0, 2],
          [2, 0],
        ],
      ],
      expect: 2,
    },
    {
      args: [
        [
          [0, 0],
          [1, 0],
          [0, 1],
        ],
      ],
      expect: 0.5,
      note: 'only one triangle exists',
    },
    {
      args: [
        [
          [0, 0],
          [2, 0],
          [0, 2],
          [2, 2],
        ],
      ],
      expect: 2,
    },
    {
      args: [
        [
          [0, 0],
          [1, 1],
          [2, 2],
          [0, 3],
        ],
      ],
      expect: 3,
      note: 'three of the points are collinear',
    },
  ],
  demo: [
    [
      [0, 0],
      [0, 1],
      [1, 0],
      [0, 2],
      [2, 0],
    ],
  ],
  scale: (n) => {
    const side = Math.max(3, Math.round(Math.cbrt(n) * 3))
    return [Array.from({ length: side }, (_, i) => [i % 7, (i * i) % 11])]
  },
  starter: {
    js: `function largestTriangleArea(points) {
  // points: number[][]  ->  number
}
`,
    cpp: `double largestTriangleArea(vector<vector<int>>& points) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'shoelace',
      label: 'Shoelace formula on every triple',
      kind: 'optimal',
      time: 'O(n^3)',
      space: 'O(1)',
      blurb:
        'With at most fifty points there are only a few thousand triples, so checking them all is cheap. The shoelace formula gives a triangle\'s area straight from its coordinates — half the absolute cross product of two of its edges — with no square roots and no floating-point drift.',
      code: {
        cpp: {
          lines: [
            'double largestTriangleArea(vector<vector<int>>& points) {',
            '    double best = 0;',
            '    int n = points.size();',
            '    for (int i = 0; i < n; ++i)',
            '        for (int j = i + 1; j < n; ++j)',
            '            for (int k = j + 1; k < n; ++k) {',
            '                auto &a = points[i], &b = points[j], &c = points[k];',
            '                double area = abs((b[0] - a[0]) * (c[1] - a[1]) -',
            '                                  (c[0] - a[0]) * (b[1] - a[1])) / 2.0;',
            '                best = max(best, area);',
            '            }',
            '    return best;',
            '}',
          ],
        },
        js: {
          lines: [
            'function largestTriangleArea(points) {',
            '  let best = 0;',
            '  const n = points.length;',
            '  for (let i = 0; i < n; i++)',
            '    for (let j = i + 1; j < n; j++)',
            '      for (let k = j + 1; k < n; k++) {',
            '        const [a, b, c] = [points[i], points[j], points[k]];',
            '        const area = Math.abs((b[0] - a[0]) * (c[1] - a[1]) -',
            '                              (c[0] - a[0]) * (b[1] - a[1])) / 2;',
            '        best = Math.max(best, area);',
            '      }',
            '  return best;',
            '}',
          ],
        },
      },

      run([points]: [number[][]], c) {
        let best = 0
        const n = points.length
        for (let i = 0; i < n; i++) {
          for (let j = i + 1; j < n; j++) {
            for (let k = j + 1; k < n; k++) {
              c.ops++
              const a = points[i]
              const b = points[j]
              const d = points[k]
              const area =
                Math.abs((b[0] - a[0]) * (d[1] - a[1]) - (d[0] - a[0]) * (b[1] - a[1])) / 2
              best = Math.max(best, area)
            }
          }
        }
        return best
      },
    },
  ],
}
