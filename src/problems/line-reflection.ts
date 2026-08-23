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
    { args: [[[-100000000, 5], [100000000, 5]]], expect: true, note: 'the extreme coordinates' },
    { args: [[[0, 0], [0, 0], [2, 0]]], expect: true, note: 'a repeated point must not break the pairing' },
    { args: [[[1, 1], [3, 1], [2, 5], [2, -5]]], expect: true, note: 'points on the line itself' },
    { args: [[[1, 1], [3, 2]]], expect: false, note: 'mirror x but a different y' },
  ],
  scale: (n) => [Array.from({ length: n }, (_, i) => [i, (i * 7) % 5])],
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
      id: 'try-every-pair',
      label: 'Try the line through every pair of points',
      kind: 'brute',
      time: 'O(n^3)',
      space: 'O(n)',
      blurb:
        'A mirror line has to sit halfway between some point and its image, so every pair of points (a point with itself included) proposes one candidate line. Test each candidate against the whole set: does every point have its reflection present? Correct, and cubic — quadratically many candidates, each checked in linear time.',
      code: {
        cpp: {
          lines: [
            'bool isReflected(vector<vector<int>>& points) {',
            '    set<pair<long long, long long>> seen;',
            '    for (auto& p : points) seen.insert({p[0], p[1]});',
            '    auto fits = [&](long long sum) {',
            '        for (auto& p : points)',
            '            if (!seen.count({sum - p[0], p[1]})) return false;',
            '        return true;',
            '    };',
            '    for (size_t i = 0; i < points.size(); ++i)',
            '        for (size_t j = i; j < points.size(); ++j)',
            '            if (fits((long long)points[i][0] + points[j][0])) return true;',
            '    return false;',
            '}',
          ],
        },
        js: {
          lines: [
            'function isReflected(points) {',
            "  const key = (x, y) => x + ',' + y;",
            '  const seen = new Set(points.map(([x, y]) => key(x, y)));',
            '  const fits = (sum) => points.every(([x, y]) => seen.has(key(sum - x, y)));',
            '',
            '  for (let i = 0; i < points.length; i++) {',
            '    for (let j = i; j < points.length; j++) {',
            '      if (fits(points[i][0] + points[j][0])) return true;',
            '    }',
            '  }',
            '  return false;',
            '}',
          ],
        },
      },

      run([points]: [number[][]], c) {
        if (points.length > 150) throw new Error('too slow')
        const key = (x: number, y: number) => x + ',' + y
        const seen = new Set(points.map(([x, y]) => key(x, y)))
        const fits = (sum: number) =>
          points.every(([x, y]) => {
            c.ops++
            return seen.has(key(sum - x, y))
          })
        for (let i = 0; i < points.length; i++) {
          for (let j = i; j < points.length; j++) {
            if (fits(points[i][0] + points[j][0])) return true
          }
        }
        return false
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'sort-and-pair',
      label: 'Sort the points from both ends and pair them up',
      kind: 'better',
      time: 'O(n log n)',
      space: 'O(n)',
      blurb:
        'Only one line can work: the one halfway between the leftmost and rightmost points. Reflection preserves `y` and reverses the order of `x`, so after removing duplicates, sort the points by `x` ascending and again by `x` descending (ties by `y` both times) and walk the two orders together — the `i`-th of each must be mirror images. One candidate instead of quadratically many.',
      code: {
        cpp: {
          lines: [
            'bool isReflected(vector<vector<int>>& points) {',
            '    set<pair<int, int>> uniq;',
            '    for (auto& p : points) uniq.insert({p[0], p[1]});',
            '    vector<pair<int, int>> left(uniq.begin(), uniq.end());  // x ascending, then y',
            '    vector<pair<int, int>> right = left;',
            '    sort(right.begin(), right.end(), [](auto& a, auto& b) {',
            '        return a.first != b.first ? a.first > b.first : a.second < b.second;',
            '    });',
            '    long long sum = (long long)left.front().first + right.front().first;',
            '    for (size_t i = 0; i < left.size(); ++i) {',
            '        if (left[i].second != right[i].second) return false;',
            '        if ((long long)left[i].first + right[i].first != sum) return false;',
            '    }',
            '    return true;',
            '}',
          ],
        },
        js: {
          lines: [
            'function isReflected(points) {',
            "  const uniq = [...new Set(points.map(([x, y]) => x + ',' + y))].map((k) => k.split(',').map(Number));",
            '  const left = [...uniq].sort((a, b) => a[0] - b[0] || a[1] - b[1]);',
            '  const right = [...uniq].sort((a, b) => b[0] - a[0] || a[1] - b[1]);',
            '',
            '  const sum = left[0][0] + right[0][0];',
            '  for (let i = 0; i < left.length; i++) {',
            '    if (left[i][1] !== right[i][1] || left[i][0] + right[i][0] !== sum) return false;',
            '  }',
            '  return true;',
            '}',
          ],
        },
      },

      run([points]: [number[][]], c) {
        const uniq = [...new Set(points.map(([x, y]) => x + ',' + y))].map((k) => k.split(',').map(Number))
        const cmp = (dir: number) => (a: number[], b: number[]) => {
          c.ops++
          return dir * (a[0] - b[0]) || a[1] - b[1]
        }
        const left = [...uniq].sort(cmp(1))
        const right = [...uniq].sort(cmp(-1))
        const sum = left[0][0] + right[0][0]
        for (let i = 0; i < left.length; i++) {
          c.ops++
          if (left[i][1] !== right[i][1] || left[i][0] + right[i][0] !== sum) return false
        }
        return true
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'sum-of-extremes',
      label: 'The mirror line is fixed by the extremes',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'The sort was only there to pair each point with its mirror, and a hash set does that without ordering. Keep the sum of the smallest and largest `x` rather than dividing by two: a point at `x` needs a partner at `sum - x` with the same `y`, which stays in integers. Two linear passes.',
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
