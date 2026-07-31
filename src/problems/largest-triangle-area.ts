import type { Problem } from '@/lib/types'

export const largestTriangleArea: Problem = {
  id: 'largest-triangle-area',
  title: 'Largest Triangle Area',
  group: 'Math',
  pattern: 'Convex Hull',
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
    {
      args: [
        [
          [0, 0],
          [1, 1],
          [2, 2],
        ],
      ],
      expect: 0,
      note: 'every triple is collinear',
    },
    {
      args: [
        [
          [-50, -50],
          [50, -50],
          [50, 50],
          [-50, 50],
          [0, 0],
          [10, -3],
        ],
      ],
      expect: 5000,
      note: 'the coordinate bounds, with interior points that never win',
    },
    {
      args: [
        [
          [4, 6],
          [6, 5],
          [3, 1],
        ],
      ],
      expect: 5.5,
      note: 'a fractional answer',
    },
    {
      args: [Array.from({ length: 50 }, (_, i) => [i - 25, ((i * 37) % 101) - 50])],
      expect: 2121,
      note: 'the most points allowed',
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
      kind: 'brute',
      time: 'O(n^3)',
      space: 'O(1)',
      blurb:
        'With at most fifty points there are only a few thousand triples, so checking them all is affordable. The shoelace formula gives a triangle\'s area straight from its coordinates — half the absolute cross product of two of its edges — with no square roots and no floating-point drift. The cost is cubic in the point count, and almost all of those triples use an interior point that can never win.',
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
    {
      id: 'hull-then-triples',
      label: 'Convex hull first, then triples on the hull',
      kind: 'optimal',
      time: 'O(n log n + h^3)',
      space: 'O(n)',
      blurb:
        'A largest triangle never has a vertex strictly inside the point set: sliding an interior vertex outward, away from the opposite edge, only grows the area. So build the convex hull with the monotone chain sweep and run the same shoelace check over hull vertices only. For scattered points the hull is a small fraction of the input, and the cubic part shrinks with it.',
      code: {
        cpp: {
          lines: [
            'double largestTriangleArea(vector<vector<int>>& points) {',
            '    vector<vector<int>> p = points;',
            '    sort(p.begin(), p.end());',
            '    auto cross = [](const vector<int>& o, const vector<int>& a, const vector<int>& b) {',
            '        return (long long)(a[0] - o[0]) * (b[1] - o[1]) - (long long)(a[1] - o[1]) * (b[0] - o[0]);',
            '    };',
            '    vector<vector<int>> hull;',
            '    for (int pass = 0; pass < 2; ++pass) {',
            '        size_t base = hull.size();',
            '        for (auto& q : p) {',
            '            while (hull.size() >= base + 2 &&',
            '                   cross(hull[hull.size() - 2], hull.back(), q) <= 0) hull.pop_back();',
            '            hull.push_back(q);',
            '        }',
            '        hull.pop_back();',
            '        reverse(p.begin(), p.end());',
            '    }',
            '    if (hull.size() < 3) return 0;',
            '    double best = 0;',
            '    int h = hull.size();',
            '    for (int i = 0; i < h; ++i)',
            '        for (int j = i + 1; j < h; ++j)',
            '            for (int k = j + 1; k < h; ++k)',
            '                best = max(best, abs(cross(hull[i], hull[j], hull[k])) / 2.0);',
            '    return best;',
            '}',
          ],
        },
        js: {
          lines: [
            'function largestTriangleArea(points) {',
            '  const p = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);',
            '  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);',
            '  const hull = [];',
            '  for (let pass = 0; pass < 2; pass++) {',
            '    const base = hull.length;',
            '    for (const q of p) {',
            '      while (hull.length >= base + 2 && cross(hull[hull.length - 2], hull[hull.length - 1], q) <= 0)',
            '        hull.pop();',
            '      hull.push(q);',
            '    }',
            '    hull.pop();',
            '    p.reverse();',
            '  }',
            '  if (hull.length < 3) return 0;',
            '  let best = 0;',
            '  for (let i = 0; i < hull.length; i++)',
            '    for (let j = i + 1; j < hull.length; j++)',
            '      for (let k = j + 1; k < hull.length; k++)',
            '        best = Math.max(best, Math.abs(cross(hull[i], hull[j], hull[k])) / 2);',
            '  return best;',
            '}',
          ],
        },
      },
      run([points]: [number[][]], c) {
        const p = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1])
        const cross = (o: number[], a: number[], b: number[]) =>
          (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
        const hull: number[][] = []
        for (let pass = 0; pass < 2; pass++) {
          const base = hull.length
          for (const q of p) {
            c.ops++
            while (hull.length >= base + 2 && cross(hull[hull.length - 2], hull[hull.length - 1], q) <= 0)
              hull.pop()
            hull.push(q)
          }
          hull.pop()
          p.reverse()
        }
        if (hull.length < 3) return 0
        let best = 0
        for (let i = 0; i < hull.length; i++)
          for (let j = i + 1; j < hull.length; j++)
            for (let k = j + 1; k < hull.length; k++) {
              c.ops++
              best = Math.max(best, Math.abs(cross(hull[i], hull[j], hull[k])) / 2)
            }
        return best
      },
    },
  ],
}
