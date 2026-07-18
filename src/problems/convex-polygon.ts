import type { Problem } from '@/lib/types'

export const convexPolygon: Problem = {
  id: 'convex-polygon',
  title: 'Convex Polygon',
  group: 'Medium',
  pattern: 'Geometry',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/convex-polygon/',
  statement:
    'Given `points` joined in order into a simple polygon, return true when the polygon is convex.',
  constraints: [
    '3 <= points.length <= 10^4',
    'points[i].length == 2',
    '-10^4 <= x, y <= 10^4',
    'All points are unique and the polygon is simple',
  ],
  signature: {
    fn: 'isConvex',
    params: [{ name: 'points', type: 'int[][]' }],
    ret: 'bool',
  },
  tests: [
    { args: [[[0, 0], [0, 5], [5, 5], [5, 0]]], expect: true, note: 'a square' },
    { args: [[[0, 0], [0, 10], [10, 10], [10, 0], [5, 5]]], expect: false, note: 'a dent' },
    { args: [[[0, 0], [1, 0], [0, 1]]], expect: true, note: 'a triangle' },
    { args: [[[0, 0], [2, 0], [1, 1], [2, 2], [0, 2]]], expect: false },
    {
      args: [[[0, 0], [1, 0], [2, 0], [2, 1], [0, 1]]],
      expect: true,
      note: 'three points in a line are still convex',
    },
  ],
  demo: [[[0, 0], [0, 5], [5, 5], [5, 0]]],
  starter: {
    js: `function isConvex(points) {
  // points: number[][]  ->  boolean
}
`,
    cpp: `bool isConvex(vector<vector<int>>& points) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'cross-sign',
      label: 'Every turn has to go the same way',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'Walking a convex polygon means turning consistently — always left, or always right. The cross product of two consecutive edges is positive for one and negative for the other, so the first non-zero sign fixes the direction and any disagreement later means the shape has a dent. A zero cross product is three collinear points and changes nothing.',
      code: {
        cpp: {
          lines: [
            'bool isConvex(vector<vector<int>>& points) {',
            '    int n = points.size(), sign = 0;',
            '    for (int i = 0; i < n; ++i) {',
            '        auto& a = points[i];',
            '        auto& b = points[(i + 1) % n];',
            '        auto& c = points[(i + 2) % n];',
            '        long long cross = (long long)(b[0] - a[0]) * (c[1] - b[1]) -',
            '                          (long long)(b[1] - a[1]) * (c[0] - b[0]);',
            '        if (cross == 0) continue;',
            '        int s = cross > 0 ? 1 : -1;',
            '        if (sign == 0) sign = s;',
            '        else if (sign != s) return false;',
            '    }',
            '    return true;',
            '}',
          ],
        },
        js: {
          lines: [
            'function isConvex(points) {',
            '  const n = points.length;',
            '  let sign = 0;',
            '  for (let i = 0; i < n; i++) {',
            '    const [ax, ay] = points[i];',
            '    const [bx, by] = points[(i + 1) % n];',
            '    const [cx, cy] = points[(i + 2) % n];',
            '    const cross = (bx - ax) * (cy - by) - (by - ay) * (cx - bx);',
            '    if (cross === 0) continue;',
            '    const s = cross > 0 ? 1 : -1;',
            '    if (sign === 0) sign = s;',
            '    else if (sign !== s) return false;',
            '  }',
            '  return true;',
            '}',
          ],
        },
      },

      run([points]: [number[][]], c) {
        const n = points.length
        let sign = 0
        for (let i = 0; i < n; i++) {
          c.ops++
          const [ax, ay] = points[i]
          const [bx, by] = points[(i + 1) % n]
          const [cx, cy] = points[(i + 2) % n]
          const cross = (bx - ax) * (cy - by) - (by - ay) * (cx - bx)
          if (cross === 0) continue
          const s = cross > 0 ? 1 : -1
          if (sign === 0) sign = s
          else if (sign !== s) return false
        }
        return true
      },
    },
  ],
}
