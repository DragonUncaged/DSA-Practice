import type { Problem } from '@/lib/types'

export const flatten2DVector: Problem = {
  id: 'flatten-2d-vector',
  title: 'Flatten 2D Vector',
  group: 'Medium',
  pattern: 'Design',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/flatten-2d-vector/',
  statement:
    'Design a `Vector2D` iterator over a 2D array. `next()` returns the next element and advances, and `hasNext()` says whether one is left. Flattening the whole thing up front defeats the point — hold an outer and an inner index, and let `hasNext` skip past however many empty rows sit in front of the cursor.',
  constraints: [
    '0 <= vec.length <= 200',
    '0 <= vec[i].length <= 500',
    '-500 <= vec[i][j] <= 500',
    'At most 10^5 calls are made to next and hasNext',
    'next is only called when hasNext would return true',
  ],

  design: {
    className: 'Vector2D',
    ctor: [{ name: 'vec', type: 'int[][]' }],
    methods: [
      { name: 'next', params: [], ret: 'int' },
      { name: 'hasNext', params: [], ret: 'bool' },
    ],
  },

  designTests: [
    {
      ops: ['Vector2D', 'next', 'next', 'next', 'hasNext', 'hasNext', 'next', 'hasNext'],
      args: [[[[1, 2], [3], [4]]], [], [], [], [], [], [], []],
      expect: [null, 1, 2, 3, true, true, 4, false],
    },
    // empty rows in front of the cursor have to be skipped
    {
      ops: ['Vector2D', 'hasNext', 'next', 'hasNext'],
      args: [[[[], [], [5]]], [], [], []],
      expect: [null, true, 5, false],
    },
    { ops: ['Vector2D', 'hasNext'], args: [[[[]]], []], expect: [null, false] },
    { ops: ['Vector2D', 'hasNext'], args: [[[]], []], expect: [null, false] },
    // next without a hasNext in between still skips empty rows
    {
      ops: ['Vector2D', 'next', 'next', 'hasNext'],
      args: [[[[-500], [], [500]]], [], [], []],
      expect: [null, -500, 500, false],
    },
    {
      ops: ['Vector2D', 'hasNext', 'hasNext', 'next', 'hasNext'],
      args: [[[[7], []]], [], [], [], []],
      expect: [null, true, true, 7, false],
    },
  ],

  starter: {
    js: `class Vector2D {
  constructor(vec) {
    // vec: number[][]
  }

  next() {
    // -> number
  }

  hasNext() {
    // -> boolean
  }
}
`,
    cpp: `class Vector2D {
public:
    Vector2D(const vector<vector<int>>& vec) {
    }

    int next() {
        // your code here
    }

    bool hasNext() {
        // your code here
    }
};
`,
  },

  solutions: [
    {
      id: 'flatten-up-front',
      label: 'Flatten everything in the constructor',
      kind: 'brute',
      time: 'O(total) construct, O(1) per call',
      space: 'O(total)',
      blurb:
        'Copy every element into one flat array when the object is built, then `next` and `hasNext` are a single index. Correct and simple, but it pays for the whole structure up front and keeps a second copy of it, even if the caller only ever wants the first few elements.',
      code: {
        cpp: {
          lines: [
            'class Vector2D {',
            '    vector<int> flat;',
            '    size_t at = 0;',
            '',
            'public:',
            '    Vector2D(const vector<vector<int>>& vec) {',
            '        for (auto& row : vec) flat.insert(flat.end(), row.begin(), row.end());',
            '    }',
            '',
            '    int next() { return flat[at++]; }',
            '',
            '    bool hasNext() { return at < flat.size(); }',
            '};',
          ],
        },
        js: {
          lines: [
            'class Vector2D {',
            '  constructor(vec) {',
            '    this.flat = vec.flat();',
            '    this.at = 0;',
            '  }',
            '',
            '  next() {',
            '    return this.flat[this.at++];',
            '  }',
            '',
            '  hasNext() {',
            '    return this.at < this.flat.length;',
            '  }',
            '}',
          ],
        },
      },

      run([ops, args]: [string[], unknown[][]], c) {
        const flat = (args[0][0] as number[][]).flat()
        c.ops += flat.length
        let at = 0
        const out: (number | boolean | null)[] = [null]
        for (let i = 1; i < ops.length; i++) {
          c.ops++
          if (ops[i] === 'next') out.push(flat[at++])
          else if (ops[i] === 'hasNext') out.push(at < flat.length)
          else out.push(null)
        }
        return out
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'two-indices',
      label: 'An outer and an inner index, advanced lazily',
      kind: 'optimal',
      time: 'O(1) amortised per call',
      space: 'O(1)',
      blurb:
        'Nothing needs copying. Keep a row index and a column index into the original array, and before answering either call move the row index past any rows that are exhausted or empty. Each row is skipped at most once over the whole iteration, so the skipping is free on average.',
      code: {
        cpp: {
          lines: [
            'class Vector2D {',
            '    vector<vector<int>> vec;',
            '    size_t row = 0, col = 0;',
            '',
            '    void settle() {',
            '        while (row < vec.size() && col == vec[row].size()) { ++row; col = 0; }',
            '    }',
            '',
            'public:',
            '    Vector2D(const vector<vector<int>>& vec) : vec(vec) {}',
            '',
            '    int next() {',
            '        settle();',
            '        return vec[row][col++];',
            '    }',
            '',
            '    bool hasNext() {',
            '        settle();',
            '        return row < vec.size();',
            '    }',
            '};',
          ],
        },
        js: {
          lines: [
            'class Vector2D {',
            '  constructor(vec) {',
            '    this.vec = vec;',
            '    this.row = 0;',
            '    this.col = 0;',
            '  }',
            '',
            '  // move past exhausted and empty rows so (row, col) points at a real element',
            '  settle() {',
            '    while (this.row < this.vec.length && this.col === this.vec[this.row].length) {',
            '      this.row++;',
            '      this.col = 0;',
            '    }',
            '  }',
            '',
            '  next() {',
            '    this.settle();',
            '    return this.vec[this.row][this.col++];',
            '  }',
            '',
            '  hasNext() {',
            '    this.settle();',
            '    return this.row < this.vec.length;',
            '  }',
            '}',
          ],
        },
      },

      run([ops, args]: [string[], unknown[][]], c) {
        const vec = args[0][0] as number[][]
        let row = 0
        let col = 0
        const settle = () => {
          while (row < vec.length && col === vec[row].length) {
            c.ops++
            row++
            col = 0
          }
        }
        const out: (number | boolean | null)[] = [null]
        for (let i = 1; i < ops.length; i++) {
          c.ops++
          if (ops[i] === 'next') {
            settle()
            out.push(vec[row][col++])
          } else if (ops[i] === 'hasNext') {
            settle()
            out.push(row < vec.length)
          } else out.push(null)
        }
        return out
      },
    },
  ],
}
