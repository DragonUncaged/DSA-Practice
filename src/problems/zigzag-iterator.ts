import type { Problem } from '@/lib/types'

export const zigzagIterator: Problem = {
  id: 'zigzag-iterator',
  title: 'Zigzag Iterator',
  group: 'Medium',
  pattern: 'Design',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/zigzag-iterator/',
  statement:
    'Design a `ZigzagIterator` over two integer lists `v1` and `v2` that returns their elements alternately, falling back to whichever list still has elements once the other runs out. Holding a queue of the still-unfinished lists rather than two indices makes the follow-up — `k` lists instead of two — fall out for free.',
  constraints: [
    '0 <= v1.length, v2.length <= 1000',
    '1 <= v1.length + v2.length <= 2000',
    '-2^31 <= v1[i], v2[i] <= 2^31 - 1',
    'next is only called when hasNext would return true',
  ],

  design: {
    className: 'ZigzagIterator',
    ctor: [
      { name: 'v1', type: 'int[]' },
      { name: 'v2', type: 'int[]' },
    ],
    methods: [
      { name: 'next', params: [], ret: 'int' },
      { name: 'hasNext', params: [], ret: 'bool' },
    ],
  },

  designTests: [
    {
      ops: ['ZigzagIterator', 'next', 'next', 'next', 'next', 'next', 'next', 'hasNext'],
      args: [[[1, 2], [3, 4, 5, 6]], [], [], [], [], [], [], []],
      expect: [null, 1, 3, 2, 4, 5, 6, false],
    },
    {
      ops: ['ZigzagIterator', 'next', 'hasNext'],
      args: [[[1], []], [], []],
      expect: [null, 1, false],
    },
    {
      ops: ['ZigzagIterator', 'hasNext', 'next', 'next', 'hasNext'],
      args: [[[], [1, 2]], [], [], [], []],
      expect: [null, true, 1, 2, false],
    },
    // the longer list is on the left this time
    {
      ops: ['ZigzagIterator', 'next', 'next', 'next', 'next', 'hasNext'],
      args: [[[1, 2, 3], [4]], [], [], [], [], []],
      expect: [null, 1, 4, 2, 3, false],
    },
    {
      ops: ['ZigzagIterator', 'next', 'next', 'hasNext'],
      args: [[[-2147483648], [2147483647]], [], [], []],
      expect: [null, -2147483648, 2147483647, false],
    },
  ],

  starter: {
    js: `class ZigzagIterator {
  constructor(v1, v2) {
    // v1: number[], v2: number[]
  }

  next() {
    // -> number
  }

  hasNext() {
    // -> boolean
  }
}
`,
    cpp: `class ZigzagIterator {
public:
    ZigzagIterator(const vector<int>& v1, const vector<int>& v2) {
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
      id: 'precompute-order',
      label: 'Build the zigzag order up front',
      kind: 'brute',
      time: 'O(n) construct, O(1) per call',
      space: 'O(n)',
      blurb:
        'Interleave the two lists into one flat array in the constructor — alternate while both have elements, then append the rest — and iterate that with a single index. Correct, but it copies every element before the first `next`, and adding a third list means rewriting the merge.',
      code: {
        cpp: {
          lines: [
            'class ZigzagIterator {',
            '    vector<int> order;',
            '    size_t at = 0;',
            '',
            'public:',
            '    ZigzagIterator(const vector<int>& v1, const vector<int>& v2) {',
            '        size_t i = 0, j = 0;',
            '        while (i < v1.size() || j < v2.size()) {',
            '            if (i < v1.size()) order.push_back(v1[i++]);',
            '            if (j < v2.size()) order.push_back(v2[j++]);',
            '        }',
            '    }',
            '',
            '    int next() { return order[at++]; }',
            '',
            '    bool hasNext() { return at < order.size(); }',
            '};',
          ],
        },
        js: {
          lines: [
            'class ZigzagIterator {',
            '  constructor(v1, v2) {',
            '    this.order = [];',
            '    for (let i = 0, j = 0; i < v1.length || j < v2.length; ) {',
            '      if (i < v1.length) this.order.push(v1[i++]);',
            '      if (j < v2.length) this.order.push(v2[j++]);',
            '    }',
            '    this.at = 0;',
            '  }',
            '',
            '  next() {',
            '    return this.order[this.at++];',
            '  }',
            '',
            '  hasNext() {',
            '    return this.at < this.order.length;',
            '  }',
            '}',
          ],
        },
      },

      run([ops, args]: [string[], unknown[][]], c) {
        const [v1, v2] = args[0] as [number[], number[]]
        const order: number[] = []
        for (let i = 0, j = 0; i < v1.length || j < v2.length; ) {
          c.ops++
          if (i < v1.length) order.push(v1[i++])
          if (j < v2.length) order.push(v2[j++])
        }
        let at = 0
        const out: (number | boolean | null)[] = [null]
        for (let i = 1; i < ops.length; i++) {
          c.ops++
          if (ops[i] === 'next') out.push(order[at++])
          else if (ops[i] === 'hasNext') out.push(at < order.length)
          else out.push(null)
        }
        return out
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'queue-of-cursors',
      label: 'A queue of (list, index) cursors',
      kind: 'optimal',
      time: 'O(1) per call',
      space: 'O(k)',
      blurb:
        'Nothing needs copying: keep a queue holding one cursor per list that still has elements. `next` pops the front cursor, reads its element, and pushes it to the back if the list is not finished — so lists take turns automatically and a finished list simply drops out. The same code handles two lists or twenty.',
      code: {
        cpp: {
          lines: [
            'class ZigzagIterator {',
            '    vector<vector<int>> lists;',
            '    queue<pair<int, int>> cursors;  // (which list, next index)',
            '',
            'public:',
            '    ZigzagIterator(const vector<int>& v1, const vector<int>& v2) : lists{v1, v2} {',
            '        for (int k = 0; k < (int)lists.size(); ++k)',
            '            if (!lists[k].empty()) cursors.push({k, 0});',
            '    }',
            '',
            '    int next() {',
            '        auto [k, i] = cursors.front(); cursors.pop();',
            '        if (i + 1 < (int)lists[k].size()) cursors.push({k, i + 1});',
            '        return lists[k][i];',
            '    }',
            '',
            '    bool hasNext() { return !cursors.empty(); }',
            '};',
          ],
        },
        js: {
          lines: [
            'class ZigzagIterator {',
            '  constructor(v1, v2) {',
            '    this.lists = [v1, v2];',
            '    // one [list, index] cursor per list that still has elements',
            '    this.cursors = [];',
            '    this.lists.forEach((list, k) => { if (list.length) this.cursors.push([k, 0]); });',
            '    this.head = 0;',
            '  }',
            '',
            '  next() {',
            '    const [k, i] = this.cursors[this.head++];',
            '    if (i + 1 < this.lists[k].length) this.cursors.push([k, i + 1]);',
            '    return this.lists[k][i];',
            '  }',
            '',
            '  hasNext() {',
            '    return this.head < this.cursors.length;',
            '  }',
            '}',
          ],
        },
      },

      run([ops, args]: [string[], unknown[][]], c) {
        const lists = args[0] as number[][]
        const cursors: [number, number][] = []
        lists.forEach((list, k) => {
          if (list.length) cursors.push([k, 0])
        })
        let head = 0
        const out: (number | boolean | null)[] = [null]
        for (let i = 1; i < ops.length; i++) {
          c.ops++
          if (ops[i] === 'next') {
            const [k, at] = cursors[head++]
            if (at + 1 < lists[k].length) cursors.push([k, at + 1])
            out.push(lists[k][at])
          } else if (ops[i] === 'hasNext') out.push(head < cursors.length)
          else out.push(null)
        }
        return out
      },
    },
  ],
}
