import type { Problem } from '@/lib/types'

export const lineReflection: Problem = {
  id: 'line-reflection',
  title: 'Line Reflection',
  group: 'Medium',
  pattern: 'Hash Map',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/line-reflection/',
  statement:
    'Given `n` points on a plane, return true when some vertical line reflects the set onto itself. Points may repeat.',
  constraints: ['1 <= points.length <= 10^4', '-10^8 <= points[i][j] <= 10^8'],
  signature: {
    fn: 'isReflected',
    params: [{ name: 'points', type: 'int[][]' }],
    ret: 'bool',
  },
  tests: [
    { args: [[[1, 1], [-1, 1]]], expect: true, note: 'the line x = 0' },
    { args: [[[1, 1], [-1, -1]]], expect: false },
    { args: [[[0, 0]]], expect: true, note: 'a single point is its own mirror' },
    { args: [[[1, 1], [1, 1]]], expect: true, note: 'repeated points' },
    { args: [[[1, 2], [2, 2], [3, 2]]], expect: true, note: 'the line x = 2' },
    { args: [[[0, 0], [1, 0], [3, 0]]], expect: false, note: '1 has no partner at 2' },
  ],
  demo: [[[1, 1], [-1, 1]]],
  starter: {
    js: `function isReflected(points) {
  // points: number[][]  ->  boolean
}
`,
    cpp: `bool isReflected(vector<vector<int>>& points) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'sum-of-extremes',
      label: 'The mirror line is fixed by the extremes',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'If any line works, it has to be halfway between the smallest and largest `x` — the leftmost point can only reflect onto the rightmost. Rather than divide by two, keep the sum of those extremes: a point at `x` needs a partner at `sum - x` with the same `y`, which stays in integers.',
      code: {
        cpp: {
          lines: [
            'bool isReflected(vector<vector<int>>& points) {',
            '    set<pair<int, int>> seen;',
            '    int lo = INT_MAX, hi = INT_MIN;',
            '    for (auto& p : points) {',
            '        lo = min(lo, p[0]);',
            '        hi = max(hi, p[0]);',
            '        seen.insert({p[0], p[1]});',
            '    }',
            '',
            '    long long sum = (long long)lo + hi;',
            '    for (auto& p : points) {',
            '        if (!seen.count({(int)(sum - p[0]), p[1]})) return false;',
            '    }',
            '    return true;',
            '}',
          ],
        },
        js: {
          lines: [
            'function isReflected(points) {',
            '  const seen = new Set();',
            '  let lo = Infinity;',
            '  let hi = -Infinity;',
            '  for (const [x, y] of points) {',
            '    lo = Math.min(lo, x);',
            '    hi = Math.max(hi, x);',
            "    seen.add(x + ',' + y);",
            '  }',
            '',
            '  const sum = lo + hi;',
            '  for (const [x, y] of points) {',
            "    if (!seen.has(sum - x + ',' + y)) return false;",
            '  }',
            '  return true;',
            '}',
          ],
        },
      },

      run([points]: [number[][]], c) {
        const seen = new Set<string>()
        let lo = Infinity
        let hi = -Infinity
        for (const [x, y] of points) {
          c.ops++
          lo = Math.min(lo, x)
          hi = Math.max(hi, x)
          seen.add(x + ',' + y)
        }
        const sum = lo + hi
        for (const [x, y] of points) {
          c.ops++
          if (!seen.has(sum - x + ',' + y)) return false
        }
        return true
      },
    },
  ],
}
