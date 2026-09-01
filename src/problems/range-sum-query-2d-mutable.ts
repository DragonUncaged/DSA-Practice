import type { Problem } from '@/lib/types'

export const rangeSumQuery2DMutable: Problem = {
  id: 'range-sum-query-2d-mutable',
  title: 'Range Sum Query 2D - Mutable',
  group: 'Hard',
  pattern: 'Design',
  difficulty: 'Hard',
  leetcode: 'https://leetcode.com/problems/range-sum-query-2d-mutable/',
  statement:
    'Design a `NumMatrix` class over a 2D matrix. `update(row, col, val)` writes one cell and `sumRegion(row1, col1, row2, col2)` returns the sum of a rectangle. Because updates and queries interleave, a prefix-sum table is too expensive to rebuild — a 2D binary indexed tree gives both operations in `O(log m * log n)`.',
  constraints: [
    '1 <= m, n <= 200',
    '-1000 <= matrix[i][j] <= 1000',
    '-1000 <= val <= 1000',
    '0 <= row1 <= row2 < m and 0 <= col1 <= col2 < n',
    'At most 5000 calls are made to sumRegion and update',
  ],

  design: {
    className: 'NumMatrix',
    ctor: [{ name: 'matrix', type: 'int[][]' }],
    methods: [
      {
        name: 'update',
        params: [
          { name: 'row', type: 'int' },
          { name: 'col', type: 'int' },
          { name: 'val', type: 'int' },
        ],
        ret: 'void',
      },
      {
        name: 'sumRegion',
        params: [
          { name: 'row1', type: 'int' },
          { name: 'col1', type: 'int' },
          { name: 'row2', type: 'int' },
          { name: 'col2', type: 'int' },
        ],
        ret: 'int',
      },
    ],
  },

  designTests: [
    {
      ops: ['NumMatrix', 'sumRegion', 'update', 'sumRegion'],
      args: [
        [[[3, 0, 1, 4, 2], [5, 6, 3, 2, 1], [1, 2, 0, 1, 5], [4, 1, 0, 1, 7], [1, 0, 3, 0, 5]]],
        [2, 1, 4, 3],
        [3, 2, 2],
        [2, 1, 4, 3],
      ],
      expect: [null, 8, null, 10],
    },
    // a single cell, updated twice
    {
      ops: ['NumMatrix', 'sumRegion', 'update', 'sumRegion', 'update', 'sumRegion'],
      args: [[[[7]]], [0, 0, 0, 0], [0, 0, -1000], [0, 0, 0, 0], [0, 0, 1000], [0, 0, 0, 0]],
      expect: [null, 7, null, -1000, null, 1000],
    },
    // the whole matrix, before and after an update to a corner
    {
      ops: ['NumMatrix', 'sumRegion', 'update', 'sumRegion', 'sumRegion'],
      args: [[[[1, 2], [3, 4]]], [0, 0, 1, 1], [1, 1, 0], [0, 0, 1, 1], [1, 1, 1, 1]],
      expect: [null, 10, null, 6, 0],
    },
    // a one-row matrix: rectangles are just ranges
    {
      ops: ['NumMatrix', 'sumRegion', 'update', 'sumRegion', 'sumRegion'],
      args: [[[[-1, -2, -3, -4]]], [0, 1, 0, 2], [0, 0, 10], [0, 0, 0, 3], [0, 3, 0, 3]],
      expect: [null, -5, null, 1, -4],
    },
  ],

  starter: {
    js: `class NumMatrix {
  constructor(matrix) {
    // matrix: number[][]
  }

  update(row, col, val) {
    // row: number, col: number, val: number  ->  void
  }

  sumRegion(row1, col1, row2, col2) {
    // inclusive corners  ->  number
  }
}
`,
    cpp: `class NumMatrix {
public:
    NumMatrix(const vector<vector<int>>& matrix) {
    }

    void update(int row, int col, int val) {
        // your code here
    }

    int sumRegion(int row1, int col1, int row2, int col2) {
        // your code here
    }
};
`,
  },

  solutions: [
    {
      id: 'sum-the-rectangle',
      label: 'Store the matrix and add up the rectangle',
      kind: 'brute',
      time: 'O(1) update, O(m * n) sumRegion',
      space: 'O(m * n)',
      blurb:
        'Keep the matrix as it is. An update writes one cell and a query loops over every cell of the rectangle. Correct, and the update could not be cheaper — but a query over the whole matrix touches forty thousand cells, five thousand times over.',
      code: {
        cpp: {
          lines: [
            'class NumMatrix {',
            '    vector<vector<int>> a;',
            '',
            'public:',
            '    NumMatrix(const vector<vector<int>>& matrix) : a(matrix) {}',
            '',
            '    void update(int row, int col, int val) { a[row][col] = val; }',
            '',
            '    int sumRegion(int row1, int col1, int row2, int col2) {',
            '        int total = 0;',
            '        for (int r = row1; r <= row2; ++r)',
            '            for (int c = col1; c <= col2; ++c) total += a[r][c];',
            '        return total;',
            '    }',
            '};',
          ],
        },
        js: {
          lines: [
            'class NumMatrix {',
            '  constructor(matrix) {',
            '    this.a = matrix.map((row) => row.slice());',
            '  }',
            '',
            '  update(row, col, val) {',
            '    this.a[row][col] = val;',
            '  }',
            '',
            '  sumRegion(row1, col1, row2, col2) {',
            '    let total = 0;',
            '    for (let r = row1; r <= row2; r++) {',
            '      for (let c = col1; c <= col2; c++) total += this.a[r][c];',
            '    }',
            '    return total;',
            '  }',
            '}',
          ],
        },
      },

      run([ops, args]: [string[], (number | number[][])[][]], c) {
        const a = (args[0][0] as number[][]).map((row) => row.slice())
        const out: (number | null)[] = [null]
        for (let i = 1; i < ops.length; i++) {
          if (ops[i] === 'update') {
            c.ops++
            const [row, col, val] = args[i] as number[]
            a[row][col] = val
            out.push(null)
          } else if (ops[i] === 'sumRegion') {
            const [row1, col1, row2, col2] = args[i] as number[]
            let total = 0
            for (let r = row1; r <= row2; r++)
              for (let col = col1; col <= col2; col++) {
                c.ops++
                total += a[r][col]
              }
            out.push(total)
          } else out.push(null)
        }
        return out
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'row-prefix-sums',
      label: 'Prefix sums along each row',
      kind: 'better',
      time: 'O(n) update, O(m) sumRegion',
      space: 'O(m * n)',
      blurb:
        'Keep a prefix-sum array per row. A query then costs one subtraction per row of the rectangle instead of one addition per cell, and an update only has to repair the prefix sums of the row it touched. Both operations are linear in one dimension — a balance between the two extremes.',
      code: {
        cpp: {
          lines: [
            'class NumMatrix {',
            '    vector<vector<int>> a, prefix;  // prefix[r][c + 1] = a[r][0] + ... + a[r][c]',
            '',
            'public:',
            '    NumMatrix(const vector<vector<int>>& matrix) : a(matrix) {',
            '        for (auto& row : a) {',
            '            vector<int> p(row.size() + 1, 0);',
            '            for (size_t c = 0; c < row.size(); ++c) p[c + 1] = p[c] + row[c];',
            '            prefix.push_back(p);',
            '        }',
            '    }',
            '',
            '    void update(int row, int col, int val) {',
            '        int delta = val - a[row][col];',
            '        a[row][col] = val;',
            '        for (size_t c = col + 1; c < prefix[row].size(); ++c) prefix[row][c] += delta;',
            '    }',
            '',
            '    int sumRegion(int row1, int col1, int row2, int col2) {',
            '        int total = 0;',
            '        for (int r = row1; r <= row2; ++r) total += prefix[r][col2 + 1] - prefix[r][col1];',
            '        return total;',
            '    }',
            '};',
          ],
        },
        js: {
          lines: [
            'class NumMatrix {',
            '  constructor(matrix) {',
            '    this.a = matrix.map((row) => row.slice());',
            '    // prefix[r][c + 1] = a[r][0] + ... + a[r][c]',
            '    this.prefix = this.a.map((row) => {',
            '      const p = [0];',
            '      for (const v of row) p.push(p[p.length - 1] + v);',
            '      return p;',
            '    });',
            '  }',
            '',
            '  update(row, col, val) {',
            '    const delta = val - this.a[row][col];',
            '    this.a[row][col] = val;',
            '    const p = this.prefix[row];',
            '    for (let c = col + 1; c < p.length; c++) p[c] += delta;',
            '  }',
            '',
            '  sumRegion(row1, col1, row2, col2) {',
            '    let total = 0;',
            '    for (let r = row1; r <= row2; r++) total += this.prefix[r][col2 + 1] - this.prefix[r][col1];',
            '    return total;',
            '  }',
            '}',
          ],
        },
      },

      run([ops, args]: [string[], (number | number[][])[][]], c) {
        const a = (args[0][0] as number[][]).map((row) => row.slice())
        const prefix = a.map((row) => {
          const p = [0]
          for (const v of row) {
            c.ops++
            p.push(p[p.length - 1] + v)
          }
          return p
        })
        const out: (number | null)[] = [null]
        for (let i = 1; i < ops.length; i++) {
          if (ops[i] === 'update') {
            const [row, col, val] = args[i] as number[]
            const delta = val - a[row][col]
            a[row][col] = val
            for (let k = col + 1; k < prefix[row].length; k++) {
              c.ops++
              prefix[row][k] += delta
            }
            out.push(null)
          } else if (ops[i] === 'sumRegion') {
            const [row1, col1, row2, col2] = args[i] as number[]
            let total = 0
            for (let r = row1; r <= row2; r++) {
              c.ops++
              total += prefix[r][col2 + 1] - prefix[r][col1]
            }
            out.push(total)
          } else out.push(null)
        }
        return out
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'fenwick-2d',
      label: 'A two-dimensional binary indexed tree',
      kind: 'optimal',
      time: 'O(log m * log n) per call',
      space: 'O(m * n)',
      blurb:
        'A binary indexed tree gives point updates and prefix sums in logarithmic time along one axis; nest one inside the other and the same holds for rectangles. `update` adds the change into `O(log m * log n)` tree cells, `query(r, c)` sums the prefix rectangle ending at `(r, c)`, and a region is four prefix queries with inclusion-exclusion.',
      code: {
        cpp: {
          lines: [
            'class NumMatrix {',
            '    int m, n;',
            '    vector<vector<int>> a, tree;  // tree is 1-indexed',
            '',
            '    void add(int r, int c, int delta) {',
            '        for (int i = r + 1; i <= m; i += i & -i)',
            '            for (int j = c + 1; j <= n; j += j & -j) tree[i][j] += delta;',
            '    }',
            '    int query(int r, int c) {  // sum of a[0..r-1][0..c-1]',
            '        int total = 0;',
            '        for (int i = r; i > 0; i -= i & -i)',
            '            for (int j = c; j > 0; j -= j & -j) total += tree[i][j];',
            '        return total;',
            '    }',
            '',
            'public:',
            '    NumMatrix(const vector<vector<int>>& matrix)',
            '        : m(matrix.size()), n(matrix[0].size()), a(matrix), tree(m + 1, vector<int>(n + 1, 0)) {',
            '        for (int r = 0; r < m; ++r) for (int c = 0; c < n; ++c) add(r, c, a[r][c]);',
            '    }',
            '',
            '    void update(int row, int col, int val) {',
            '        add(row, col, val - a[row][col]);',
            '        a[row][col] = val;',
            '    }',
            '',
            '    int sumRegion(int row1, int col1, int row2, int col2) {',
            '        return query(row2 + 1, col2 + 1) - query(row1, col2 + 1) - query(row2 + 1, col1) + query(row1, col1);',
            '    }',
            '};',
          ],
        },
        js: {
          lines: [
            'class NumMatrix {',
            '  constructor(matrix) {',
            '    this.m = matrix.length;',
            '    this.n = matrix[0].length;',
            '    this.a = matrix.map((row) => row.slice());',
            '    this.tree = Array.from({ length: this.m + 1 }, () => new Array(this.n + 1).fill(0)); // 1-indexed',
            '    for (let r = 0; r < this.m; r++) for (let c = 0; c < this.n; c++) this.add(r, c, this.a[r][c]);',
            '  }',
            '',
            '  add(r, c, delta) {',
            '    for (let i = r + 1; i <= this.m; i += i & -i) {',
            '      for (let j = c + 1; j <= this.n; j += j & -j) this.tree[i][j] += delta;',
            '    }',
            '  }',
            '',
            '  // sum of a[0..r-1][0..c-1]',
            '  query(r, c) {',
            '    let total = 0;',
            '    for (let i = r; i > 0; i -= i & -i) {',
            '      for (let j = c; j > 0; j -= j & -j) total += this.tree[i][j];',
            '    }',
            '    return total;',
            '  }',
            '',
            '  update(row, col, val) {',
            '    this.add(row, col, val - this.a[row][col]);',
            '    this.a[row][col] = val;',
            '  }',
            '',
            '  sumRegion(row1, col1, row2, col2) {',
            '    return (',
            '      this.query(row2 + 1, col2 + 1) - this.query(row1, col2 + 1) -',
            '      this.query(row2 + 1, col1) + this.query(row1, col1)',
            '    );',
            '  }',
            '}',
          ],
        },
      },

      run([ops, args]: [string[], (number | number[][])[][]], c) {
        const a = (args[0][0] as number[][]).map((row) => row.slice())
        const m = a.length
        const n = a[0].length
        const tree = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0))
        const add = (r: number, col: number, delta: number) => {
          for (let i = r + 1; i <= m; i += i & -i)
            for (let j = col + 1; j <= n; j += j & -j) {
              c.ops++
              tree[i][j] += delta
            }
        }
        const query = (r: number, col: number) => {
          let total = 0
          for (let i = r; i > 0; i -= i & -i)
            for (let j = col; j > 0; j -= j & -j) {
              c.ops++
              total += tree[i][j]
            }
          return total
        }
        for (let r = 0; r < m; r++) for (let col = 0; col < n; col++) add(r, col, a[r][col])
        const out: (number | null)[] = [null]
        for (let i = 1; i < ops.length; i++) {
          if (ops[i] === 'update') {
            const [row, col, val] = args[i] as number[]
            add(row, col, val - a[row][col])
            a[row][col] = val
            out.push(null)
          } else if (ops[i] === 'sumRegion') {
            const [row1, col1, row2, col2] = args[i] as number[]
            out.push(query(row2 + 1, col2 + 1) - query(row1, col2 + 1) - query(row2 + 1, col1) + query(row1, col1))
          } else out.push(null)
        }
        return out
      },
    },
  ],
}
