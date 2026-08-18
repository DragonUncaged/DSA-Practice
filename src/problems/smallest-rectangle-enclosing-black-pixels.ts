import type { Problem } from '@/lib/types'

export const smallestRectangleEnclosingBlackPixels: Problem = {
  id: 'smallest-rectangle-enclosing-black-pixels',
  title: 'Smallest Rectangle Enclosing Black Pixels',
  group: 'Hard',
  pattern: 'Binary Search',
  difficulty: 'Hard',
  leetcode:
    'https://leetcode.com/problems/smallest-rectangle-enclosing-black-pixels/',
  statement:
    'In a binary `image`, `"1"` is a black pixel and `"0"` a white one, and all the black pixels form a single connected region. Given the position `(x, y)` of one black pixel, return the area of the smallest axis-aligned rectangle that covers every black pixel. Scanning the whole image is too slow; the answer wants less than `O(m * n)`.',
  constraints: [
    '1 <= m, n <= 100',
    "image[i][j] is either '0' or '1'",
    '0 <= x < m and 0 <= y < n',
    "image[x][y] == '1'",
    'The black pixels form exactly one connected component',
  ],
  signature: {
    fn: 'minArea',
    params: [
      { name: 'image', type: 'char[][]' },
      { name: 'x', type: 'int' },
      { name: 'y', type: 'int' },
    ],
    ret: 'int',
  },
  tests: [
    {
      args: [[['0', '0', '1', '0'], ['0', '1', '1', '0'], ['0', '1', '0', '0']], 0, 2],
      expect: 6,
    },
    { args: [[['1']], 0, 0], expect: 1, note: 'one pixel' },
    { args: [[['0', '1', '0'], ['0', '1', '0']], 0, 1], expect: 2, note: 'a vertical bar' },
    { args: [[['1', '1', '1']], 0, 1], expect: 3, note: 'a horizontal bar' },
    {
      args: [[['0', '0'], ['0', '1']], 1, 1],
      expect: 1,
      note: 'the pixel sits in the corner',
    },
    {
      args: [[['1', '1', '1'], ['1', '0', '1'], ['1', '1', '1']], 0, 0],
      expect: 9,
      note: 'a ring: the rectangle covers the white hole too',
    },
    {
      args: [[['0', '0', '0', '0'], ['0', '1', '0', '0'], ['0', '1', '1', '0'], ['0', '0', '1', '0']], 2, 2],
      expect: 6,
      note: 'a diagonal staircase, seed in the middle',
    },
  ],
  scale: (n) => {
    const side = Math.max(2, Math.round(Math.sqrt(n)))
    const mid = side >> 1
    // a plus sign through the middle: black is O(side), the image is O(side^2)
    return [
      Array.from({ length: side }, (_, r) => Array.from({ length: side }, (_, c) => (r === mid || c === mid ? '1' : '0'))),
      mid,
      mid,
    ]
  },
  demo: [[['0', '0', '1', '0'], ['0', '1', '1', '0'], ['0', '1', '0', '0']], 0, 2],
  starter: {
    js: `function minArea(image, x, y) {
  // image: string[][], x: number, y: number  ->  number
}
`,
    cpp: `int minArea(vector<vector<char>>& image, int x, int y) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'scan-everything',
      label: 'Scan the whole image for the extreme black pixels',
      kind: 'brute',
      time: 'O(m * n)',
      space: 'O(1)',
      blurb:
        'Look at every pixel and track the smallest and largest row and column that hold black. Correct, and it never uses the seed pixel or the fact that the black region is connected — which is exactly what the statement asks you to exploit.',
      code: {
        cpp: {
          lines: [
            'int minArea(vector<vector<char>>& image, int x, int y) {',
            '    int m = image.size(), n = image[0].size();',
            '    int top = m, bottom = -1, left = n, right = -1;',
            '    for (int r = 0; r < m; ++r) for (int c = 0; c < n; ++c) {',
            "        if (image[r][c] != '1') continue;",
            '        top = min(top, r); bottom = max(bottom, r);',
            '        left = min(left, c); right = max(right, c);',
            '    }',
            '    return (bottom - top + 1) * (right - left + 1);',
            '}',
          ],
        },
        js: {
          lines: [
            'function minArea(image, x, y) {',
            '  const m = image.length;',
            '  const n = image[0].length;',
            '  let top = m, bottom = -1, left = n, right = -1;',
            '  for (let r = 0; r < m; r++) {',
            '    for (let c = 0; c < n; c++) {',
            "      if (image[r][c] !== '1') continue;",
            '      top = Math.min(top, r); bottom = Math.max(bottom, r);',
            '      left = Math.min(left, c); right = Math.max(right, c);',
            '    }',
            '  }',
            '  return (bottom - top + 1) * (right - left + 1);',
            '}',
          ],
        },
      },

      run([image]: [string[][], number, number], c) {
        const m = image.length
        const n = image[0].length
        let top = m
        let bottom = -1
        let left = n
        let right = -1
        for (let r = 0; r < m; r++) {
          for (let col = 0; col < n; col++) {
            c.ops++
            if (image[r][col] !== '1') continue
            top = Math.min(top, r)
            bottom = Math.max(bottom, r)
            left = Math.min(left, col)
            right = Math.max(right, col)
          }
        }
        return (bottom - top + 1) * (right - left + 1)
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'flood-fill',
      label: 'Flood outward from the given pixel',
      kind: 'better',
      time: 'O(b)',
      space: 'O(b)',
      blurb:
        'The black pixels are one connected region and you are handed a pixel inside it, so a breadth-first flood from there visits every black pixel and nothing else — `b` of them, not `m * n`. Track the extremes as the flood spreads. Better than scanning when the region is small, but the region can still be the whole image.',
      code: {
        cpp: {
          lines: [
            'int minArea(vector<vector<char>>& image, int x, int y) {',
            '    int m = image.size(), n = image[0].size();',
            '    vector<vector<bool>> seen(m, vector<bool>(n, false));',
            '    queue<pair<int, int>> q;',
            '    q.push({x, y}); seen[x][y] = true;',
            '    int top = x, bottom = x, left = y, right = y;',
            '    const int dr[4] = {1, -1, 0, 0}, dc[4] = {0, 0, 1, -1};',
            '    while (!q.empty()) {',
            '        auto [r, c] = q.front(); q.pop();',
            '        top = min(top, r); bottom = max(bottom, r);',
            '        left = min(left, c); right = max(right, c);',
            '        for (int d = 0; d < 4; ++d) {',
            '            int nr = r + dr[d], nc = c + dc[d];',
            '            if (nr < 0 || nc < 0 || nr >= m || nc >= n) continue;',
            "            if (seen[nr][nc] || image[nr][nc] != '1') continue;",
            '            seen[nr][nc] = true;',
            '            q.push({nr, nc});',
            '        }',
            '    }',
            '    return (bottom - top + 1) * (right - left + 1);',
            '}',
          ],
        },
        js: {
          lines: [
            'function minArea(image, x, y) {',
            '  const m = image.length;',
            '  const n = image[0].length;',
            '  const seen = Array.from({ length: m }, () => new Array(n).fill(false));',
            '  const queue = [[x, y]];',
            '  seen[x][y] = true;',
            '  let top = x, bottom = x, left = y, right = y;',
            '  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];',
            '  for (let head = 0; head < queue.length; head++) {',
            '    const [r, c] = queue[head];',
            '    top = Math.min(top, r); bottom = Math.max(bottom, r);',
            '    left = Math.min(left, c); right = Math.max(right, c);',
            '    for (const [dr, dc] of dirs) {',
            '      const nr = r + dr;',
            '      const nc = c + dc;',
            '      if (nr < 0 || nc < 0 || nr >= m || nc >= n) continue;',
            "      if (seen[nr][nc] || image[nr][nc] !== '1') continue;",
            '      seen[nr][nc] = true;',
            '      queue.push([nr, nc]);',
            '    }',
            '  }',
            '  return (bottom - top + 1) * (right - left + 1);',
            '}',
          ],
        },
      },

      run([image, x, y]: [string[][], number, number], c) {
        const m = image.length
        const n = image[0].length
        const seen = Array.from({ length: m }, () => new Array<boolean>(n).fill(false))
        const queue: [number, number][] = [[x, y]]
        seen[x][y] = true
        let top = x
        let bottom = x
        let left = y
        let right = y
        const dirs = [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]
        for (let head = 0; head < queue.length; head++) {
          const [r, col] = queue[head]
          top = Math.min(top, r)
          bottom = Math.max(bottom, r)
          left = Math.min(left, col)
          right = Math.max(right, col)
          for (const [dr, dc] of dirs) {
            c.ops++
            const nr = r + dr
            const nc = col + dc
            if (nr < 0 || nc < 0 || nr >= m || nc >= n) continue
            if (seen[nr][nc] || image[nr][nc] !== '1') continue
            seen[nr][nc] = true
            queue.push([nr, nc])
          }
        }
        return (bottom - top + 1) * (right - left + 1)
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'binary-search-edges',
      label: 'Binary search each of the four edges',
      kind: 'optimal',
      time: 'O((m + n) * log(m * n))',
      space: 'O(1)',
      blurb:
        'Neither scan needs to touch the black pixels at all. Because they are connected, "does this row contain black?" is false, then true, then false again as the row index climbs — and the given pixel sits inside the true stretch. That makes each of the four edges a binary search over rows or columns, with one linear sweep per probe: logarithmically many sweeps instead of a walk over the region.',
      code: {
        cpp: {
          lines: [
            'int minArea(vector<vector<char>>& image, int x, int y) {',
            '    int m = image.size(), n = image[0].size();',
            '    auto rowBlack = [&](int r) {',
            "        for (int c = 0; c < n; ++c) if (image[r][c] == '1') return true;",
            '        return false;',
            '    };',
            '    auto colBlack = [&](int c) {',
            "        for (int r = 0; r < m; ++r) if (image[r][c] == '1') return true;",
            '        return false;',
            '    };',
            '',
            '    // first index that is black, over a false..true range',
            '    auto firstBlack = [&](int lo, int hi, auto black) {',
            '        while (lo < hi) { int mid = (lo + hi) / 2; if (black(mid)) hi = mid; else lo = mid + 1; }',
            '        return lo;',
            '    };',
            '    // first index that is white, over a true..false range',
            '    auto firstWhite = [&](int lo, int hi, auto black) {',
            '        while (lo < hi) { int mid = (lo + hi) / 2; if (black(mid)) lo = mid + 1; else hi = mid; }',
            '        return lo;',
            '    };',
            '',
            '    int top = firstBlack(0, x, rowBlack);',
            '    int bottom = firstWhite(x + 1, m, rowBlack);',
            '    int left = firstBlack(0, y, colBlack);',
            '    int right = firstWhite(y + 1, n, colBlack);',
            '    return (bottom - top) * (right - left);',
            '}',
          ],
        },
        js: {
          lines: [
            'function minArea(image, x, y) {',
            '  const m = image.length;',
            '  const n = image[0].length;',
            "  const rowBlack = (r) => image[r].some((p) => p === '1');",
            '  const colBlack = (c) => {',
            "    for (let r = 0; r < m; r++) if (image[r][c] === '1') return true;",
            '    return false;',
            '  };',
            '',
            '  // first index that is black, over a false..true range',
            '  const firstBlack = (lo, hi, black) => {',
            '    while (lo < hi) {',
            '      const mid = (lo + hi) >> 1;',
            '      if (black(mid)) hi = mid; else lo = mid + 1;',
            '    }',
            '    return lo;',
            '  };',
            '  // first index that is white, over a true..false range',
            '  const firstWhite = (lo, hi, black) => {',
            '    while (lo < hi) {',
            '      const mid = (lo + hi) >> 1;',
            '      if (black(mid)) lo = mid + 1; else hi = mid;',
            '    }',
            '    return lo;',
            '  };',
            '',
            '  const top = firstBlack(0, x, rowBlack);',
            '  const bottom = firstWhite(x + 1, m, rowBlack);',
            '  const left = firstBlack(0, y, colBlack);',
            '  const right = firstWhite(y + 1, n, colBlack);',
            '  return (bottom - top) * (right - left);',
            '}',
          ],
        },
      },

      run([image, x, y]: [string[][], number, number], c) {
        const m = image.length
        const n = image[0].length
        const rowBlack = (r: number) => {
          c.ops++
          return image[r].some((p) => p === '1')
        }
        const colBlack = (col: number) => {
          c.ops++
          for (let r = 0; r < m; r++) if (image[r][col] === '1') return true
          return false
        }
        const firstBlack = (lo: number, hi: number, black: (i: number) => boolean) => {
          while (lo < hi) {
            const mid = (lo + hi) >> 1
            if (black(mid)) hi = mid
            else lo = mid + 1
          }
          return lo
        }
        const firstWhite = (lo: number, hi: number, black: (i: number) => boolean) => {
          while (lo < hi) {
            const mid = (lo + hi) >> 1
            if (black(mid)) lo = mid + 1
            else hi = mid
          }
          return lo
        }
        const top = firstBlack(0, x, rowBlack)
        const bottom = firstWhite(x + 1, m, rowBlack)
        const left = firstBlack(0, y, colBlack)
        const right = firstWhite(y + 1, n, colBlack)
        return (bottom - top) * (right - left)
      },
    },
  ],
}
