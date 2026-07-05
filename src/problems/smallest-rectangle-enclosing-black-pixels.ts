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
  ],
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
      id: 'binary-search-edges',
      label: 'Binary search each of the four edges',
      kind: 'optimal',
      time: 'O((m + n) * log(m * n))',
      space: 'O(1)',
      blurb:
        'Because the black pixels are connected, "does this row contain black?" is false, then true, then false again as the row index climbs — and the given pixel sits inside the true stretch. That makes each of the four edges a binary search over rows or columns, with one linear sweep per probe.',
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
