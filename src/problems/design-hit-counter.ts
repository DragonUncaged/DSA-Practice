import type { Problem } from '@/lib/types'

export const designHitCounter: Problem = {
  id: 'design-hit-counter',
  title: 'Design Hit Counter',
  group: 'Medium',
  pattern: 'Design',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/design-hit-counter/',
  statement:
    'Design a `HitCounter` that reports how many hits landed in the last 300 seconds. `hit(timestamp)` records one and `getHits(timestamp)` counts those still inside the window — hits strictly more than 300 seconds old are out. Timestamps arrive in non-decreasing order, so a queue of `(timestamp, count)` pairs only ever has to drop entries from the front.',
  constraints: [
    '1 <= timestamp <= 2 * 10^9',
    'Timestamps arrive in non-decreasing order',
    'At most 300 calls are made to hit and getHits',
  ],

  design: {
    className: 'HitCounter',
    ctor: [],
    methods: [
      { name: 'hit', params: [{ name: 'timestamp', type: 'int' }], ret: 'void' },
      { name: 'getHits', params: [{ name: 'timestamp', type: 'int' }], ret: 'int' },
    ],
  },

  designTests: [
    {
      ops: ['HitCounter', 'hit', 'hit', 'hit', 'getHits', 'hit', 'getHits', 'getHits'],
      args: [[], [1], [2], [3], [4], [300], [300], [301]],
      expect: [null, null, null, null, 3, null, 4, 3],
    },
    // several hits at the same second collapse into one entry; at exactly 300 seconds they are out
    {
      ops: ['HitCounter', 'hit', 'hit', 'hit', 'getHits', 'getHits', 'getHits'],
      args: [[], [5], [5], [5], [5], [304], [305]],
      expect: [null, null, null, null, 3, 3, 0],
    },
    { ops: ['HitCounter', 'getHits'], args: [[], [100]], expect: [null, 0] },
    // the largest timestamps allowed; the first hit has just expired
    {
      ops: ['HitCounter', 'hit', 'getHits', 'getHits', 'hit', 'getHits'],
      args: [[], [1999999700], [1999999999], [2000000000], [2000000000], [2000000000]],
      expect: [null, null, 1, 0, null, 1],
    },
    // a query far in the future empties the window
    {
      ops: ['HitCounter', 'hit', 'hit', 'getHits', 'hit', 'getHits'],
      args: [[], [1], [2], [1000], [1000], [1000]],
      expect: [null, null, null, 0, null, 1],
    },
  ],

  starter: {
    js: `class HitCounter {
  constructor() {
  }

  hit(timestamp) {
    // timestamp: number  ->  void
  }

  getHits(timestamp) {
    // timestamp: number  ->  number of hits in (timestamp - 300, timestamp]
  }
}
`,
    cpp: `class HitCounter {
public:
    HitCounter() {
    }

    void hit(int timestamp) {
        // your code here
    }

    int getHits(int timestamp) {
        // your code here
    }
};
`,
  },

  solutions: [
    {
      id: 'scan-all-hits',
      label: 'Store every hit and count the recent ones',
      kind: 'brute',
      time: 'O(1) hit, O(n) getHits',
      space: 'O(n)',
      blurb:
        'Append every timestamp to a list and let `getHits` count the ones inside the window. Correct, but the list keeps every hit ever made, and each query rescans hits that fell out of the window long ago.',
      code: {
        cpp: {
          lines: [
            'class HitCounter {',
            '    vector<int> hits;',
            '',
            'public:',
            '    HitCounter() {}',
            '',
            '    void hit(int timestamp) { hits.push_back(timestamp); }',
            '',
            '    int getHits(int timestamp) {',
            '        int count = 0;',
            '        for (int t : hits) if (t > timestamp - 300) ++count;',
            '        return count;',
            '    }',
            '};',
          ],
        },
        js: {
          lines: [
            'class HitCounter {',
            '  constructor() {',
            '    this.hits = [];',
            '  }',
            '',
            '  hit(timestamp) {',
            '    this.hits.push(timestamp);',
            '  }',
            '',
            '  getHits(timestamp) {',
            '    let count = 0;',
            '    for (const t of this.hits) if (t > timestamp - 300) count++;',
            '    return count;',
            '  }',
            '}',
          ],
        },
      },

      run([ops, args]: [string[], number[][]], c) {
        const hits: number[] = []
        const out: (number | null)[] = [null]
        for (let i = 1; i < ops.length; i++) {
          if (ops[i] === 'hit') {
            c.ops++
            hits.push(args[i][0])
            out.push(null)
          } else if (ops[i] === 'getHits') {
            let count = 0
            for (const t of hits) {
              c.ops++
              if (t > args[i][0] - 300) count++
            }
            out.push(count)
          } else out.push(null)
        }
        return out
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'queue-of-buckets',
      label: 'A queue of (timestamp, count) pairs, trimmed from the front',
      kind: 'optimal',
      time: 'O(1) amortised per call',
      space: 'O(min(n, 300))',
      blurb:
        'Because timestamps never go backwards, a hit that has left the window never comes back — so keep the hits in a queue, merging repeats of the same second into one count, and pop from the front until the oldest entry is inside the window. Each hit is pushed once and popped once, and a running total makes the answer a single read.',
      code: {
        cpp: {
          lines: [
            'class HitCounter {',
            '    deque<pair<int, int>> window;  // (timestamp, hits at that second)',
            '    int total = 0;',
            '',
            '    void trim(int timestamp) {',
            '        while (!window.empty() && window.front().first <= timestamp - 300) {',
            '            total -= window.front().second;',
            '            window.pop_front();',
            '        }',
            '    }',
            '',
            'public:',
            '    HitCounter() {}',
            '',
            '    void hit(int timestamp) {',
            '        if (!window.empty() && window.back().first == timestamp) window.back().second++;',
            '        else window.push_back({timestamp, 1});',
            '        ++total;',
            '    }',
            '',
            '    int getHits(int timestamp) {',
            '        trim(timestamp);',
            '        return total;',
            '    }',
            '};',
          ],
        },
        js: {
          lines: [
            'class HitCounter {',
            '  constructor() {',
            '    this.window = []; // [timestamp, hits at that second]',
            '    this.head = 0;',
            '    this.total = 0;',
            '  }',
            '',
            '  hit(timestamp) {',
            '    const last = this.window[this.window.length - 1];',
            '    if (last && last[0] === timestamp) last[1]++;',
            '    else this.window.push([timestamp, 1]);',
            '    this.total++;',
            '  }',
            '',
            '  getHits(timestamp) {',
            '    while (this.head < this.window.length && this.window[this.head][0] <= timestamp - 300) {',
            '      this.total -= this.window[this.head++][1];',
            '    }',
            '    return this.total;',
            '  }',
            '}',
          ],
        },
      },

      run([ops, args]: [string[], number[][]], c) {
        const window: [number, number][] = []
        let head = 0
        let total = 0
        const out: (number | null)[] = [null]
        for (let i = 1; i < ops.length; i++) {
          c.ops++
          if (ops[i] === 'hit') {
            const last = window[window.length - 1]
            if (last && last[0] === args[i][0]) last[1]++
            else window.push([args[i][0], 1])
            total++
            out.push(null)
          } else if (ops[i] === 'getHits') {
            while (head < window.length && window[head][0] <= args[i][0] - 300) {
              c.ops++
              total -= window[head++][1]
            }
            out.push(total)
          } else out.push(null)
        }
        return out
      },
    },
  ],
}
