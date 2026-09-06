import type { Problem } from '@/lib/types'

/**
 * The worked example of a design problem: `design` replaces `signature`,
 * `designTests` replace `tests`, `starter` is a class skeleton, and the
 * reference solution's `run` takes `[ops, args]` from one design test and
 * returns that case's whole result list.
 */
export const movingAverageFromDataStream: Problem = {
  id: 'moving-average-from-data-stream',
  title: 'Moving Average from Data Stream',
  group: 'Easy',
  pattern: 'Design',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/moving-average-from-data-stream/',
  statement:
    'Design a `MovingAverage` class over a stream of integers. `MovingAverage(size)` fixes the window width and `next(val)` returns the average of the last `size` values seen so far. A queue plus a running total keeps every call `O(1)`: add the new value, and drop the oldest once the window is full.',
  constraints: [
    '1 <= size <= 1000',
    '-10^5 <= val <= 10^5',
    'At most 10^4 calls are made to next',
  ],

  design: {
    className: 'MovingAverage',
    ctor: [{ name: 'size', type: 'int' }],
    methods: [{ name: 'next', params: [{ name: 'val', type: 'int' }], ret: 'double' }],
  },

  designTests: [
    {
      ops: ['MovingAverage', 'next', 'next', 'next', 'next'],
      args: [[3], [1], [10], [3], [5]],
      expect: [null, 1, 5.5, 4.666666666666667, 6],
    },
    {
      // a window of one never averages anything: every call returns its own value
      ops: ['MovingAverage', 'next', 'next', 'next'],
      args: [[1], [4], [-2], [0]],
      expect: [null, 4, -2, 0],
    },
    {
      // a window wider than the stream so far: the average is over what has arrived
      ops: ['MovingAverage', 'next', 'next'],
      args: [[1000], [100000], [-100000]],
      expect: [null, 100000, 0],
    },
    {
      // the extremes on both ends of the window
      ops: ['MovingAverage', 'next', 'next', 'next', 'next'],
      args: [[2], [-100000], [-100000], [100000], [100000]],
      expect: [null, -100000, -100000, 0, 100000],
    },
  ],

  starter: {
    js: `class MovingAverage {
  constructor(size) {
    // size: number — the window width
  }

  next(val) {
    // val: number  ->  number, the average of the last size values
  }
}
`,
    cpp: `class MovingAverage {
public:
    MovingAverage(int size) {
        // size — the window width
    }

    double next(int val) {
        // your code here
    }
};
`,
  },

  solutions: [
    {
      id: 'resum-window',
      label: 'Keep the window in an array and re-add it every call',
      kind: 'brute',
      time: 'O(size) per call',
      space: 'O(size)',
      blurb:
        'Append each value to a list, drop the front once the list is longer than the window, and add up whatever is left to answer. Correct, and it does exactly what the statement says — but every call re-reads the whole window to recompute a total that changed by two numbers.',
      code: {
        cpp: {
          lines: [
            'class MovingAverage {',
            '    vector<int> win;',
            '    int cap;',
            '',
            'public:',
            '    MovingAverage(int size) : cap(size) {}',
            '',
            '    double next(int val) {',
            '        win.push_back(val);',
            '        if ((int)win.size() > cap) win.erase(win.begin());',
            '        long long sum = 0;',
            '        for (int x : win) sum += x;',
            '        return (double)sum / win.size();',
            '    }',
            '};',
          ],
        },
        js: {
          lines: [
            'class MovingAverage {',
            '  constructor(size) {',
            '    this.cap = size;',
            '    this.win = [];',
            '  }',
            '',
            '  next(val) {',
            '    this.win.push(val);',
            '    if (this.win.length > this.cap) this.win.shift();',
            '    let sum = 0;',
            '    for (const x of this.win) sum += x;',
            '    return sum / this.win.length;',
            '  }',
            '}',
          ],
        },
      },

      run([ops, args]: [string[], number[][]], c) {
        const cap = args[0][0]
        const win: number[] = []
        const out: (number | null)[] = [null]
        for (let i = 1; i < ops.length; i++) {
          if (ops[i] !== 'next') {
            out.push(null)
            continue
          }
          win.push(args[i][0])
          if (win.length > cap) win.shift()
          let sum = 0
          for (const x of win) {
            c.ops++
            sum += x
          }
          out.push(sum / win.length)
        }
        return out
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'queue-sum',
      label: 'Running sum over a queue',
      kind: 'optimal',
      time: 'O(1) per call',
      space: 'O(size)',
      blurb:
        'Recomputing the average would re-read the whole window on every call. Keep the window in a queue and its total in one number instead: push the new value onto the total, and once the queue is longer than the window pop the oldest value back off it. Both ends are O(1), so the average is a single division.',
      code: {
        cpp: {
          lines: [
            'class MovingAverage {',
            '    queue<int> win;',
            '    long long sum = 0;',
            '    int cap;',
            '',
            'public:',
            '    MovingAverage(int size) : cap(size) {}',
            '',
            '    double next(int val) {',
            '        win.push(val);',
            '        sum += val;',
            '        if ((int)win.size() > cap) {',
            '            sum -= win.front();',
            '            win.pop();',
            '        }',
            '        return (double)sum / win.size();',
            '    }',
            '};',
          ],
        },
        js: {
          lines: [
            'class MovingAverage {',
            '  constructor(size) {',
            '    this.cap = size;',
            '    this.win = [];',
            '    this.sum = 0;',
            '  }',
            '',
            '  next(val) {',
            '    this.win.push(val);',
            '    this.sum += val;',
            '    if (this.win.length > this.cap) {',
            '      this.sum -= this.win.shift();',
            '    }',
            '    return this.sum / this.win.length;',
            '  }',
            '}',
          ],
        },
      },

      // ops[0] names the class and contributes the leading null; every op after
      // it is dispatched by name, the same way the generated driver does it.
      run([ops, args]: [string[], number[][]], c) {
        const cap = args[0][0]
        const win: number[] = []
        let sum = 0
        const out: (number | null)[] = [null]
        for (let i = 1; i < ops.length; i++) {
          if (ops[i] !== 'next') {
            out.push(null)
            continue
          }
          c.ops++
          const val = args[i][0]
          win.push(val)
          sum += val
          if (win.length > cap) sum -= win.shift() as number
          out.push(sum / win.length)
        }
        return out
      },
    },
  ],
}
