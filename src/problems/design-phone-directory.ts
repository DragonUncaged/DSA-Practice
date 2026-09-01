import type { Problem } from '@/lib/types'

export const designPhoneDirectory: Problem = {
  id: 'design-phone-directory',
  title: 'Design Phone Directory',
  group: 'Medium',
  pattern: 'Design',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/design-phone-directory/',
  statement:
    'Design a `PhoneDirectory` over `maxNumbers` slots numbered from `0`. `get()` hands out a free number or `-1` when none is left, `check(number)` reports whether a slot is free, and `release(number)` returns one to the pool. LeetCode accepts any free number from `get`; to make the answers checkable, `get` here must return the smallest free number.',
  constraints: [
    '1 <= maxNumbers <= 10^4',
    '0 <= number < maxNumbers',
    'At most 2 * 10^4 calls are made to get, check and release',
  ],

  design: {
    className: 'PhoneDirectory',
    ctor: [{ name: 'maxNumbers', type: 'int' }],
    methods: [
      { name: 'get', params: [], ret: 'int' },
      { name: 'check', params: [{ name: 'number', type: 'int' }], ret: 'bool' },
      { name: 'release', params: [{ name: 'number', type: 'int' }], ret: 'void' },
    ],
  },

  designTests: [
    {
      ops: ['PhoneDirectory', 'get', 'get', 'check', 'get', 'check', 'release', 'check'],
      args: [[3], [], [], [2], [], [2], [2], [2]],
      expect: [null, 0, 1, true, 2, false, null, true],
    },
    // the pool runs dry, then a release makes one number available again
    {
      ops: ['PhoneDirectory', 'get', 'get', 'get', 'release', 'get', 'get'],
      args: [[2], [], [], [], [0], [], []],
      expect: [null, 0, 1, -1, null, 0, -1],
    },
    // releasing out of order: get still hands out the smallest free number
    {
      ops: ['PhoneDirectory', 'get', 'get', 'get', 'release', 'release', 'get', 'get'],
      args: [[3], [], [], [], [2], [0], [], []],
      expect: [null, 0, 1, 2, null, null, 0, 2],
    },
    // releasing a free number changes nothing
    {
      ops: ['PhoneDirectory', 'release', 'check', 'get', 'release', 'release', 'get'],
      args: [[1], [0], [0], [], [0], [0], []],
      expect: [null, null, true, 0, null, null, 0],
    },
  ],

  starter: {
    js: `class PhoneDirectory {
  constructor(maxNumbers) {
    // maxNumbers: number — slots 0 .. maxNumbers - 1
  }

  get() {
    // -> the smallest free number, or -1
  }

  check(number) {
    // number: number  ->  boolean, is it free?
  }

  release(number) {
    // number: number  ->  void
  }
}
`,
    cpp: `class PhoneDirectory {
public:
    PhoneDirectory(int maxNumbers) {
    }

    int get() {
        // your code here
    }

    bool check(int number) {
        // your code here
    }

    void release(int number) {
        // your code here
    }
};
`,
  },

  solutions: [
    {
      id: 'scan-for-free',
      label: 'A boolean per slot, scanned on every get',
      kind: 'brute',
      time: 'O(n) get, O(1) check and release',
      space: 'O(n)',
      blurb:
        'One flag per slot says whether it is taken. `check` and `release` are a single flag each, and `get` walks the flags from the start until it finds a free one. Correct and tiny, but a directory that is nearly full makes every `get` a scan of almost all its slots.',
      code: {
        cpp: {
          lines: [
            'class PhoneDirectory {',
            '    vector<bool> taken;',
            '',
            'public:',
            '    PhoneDirectory(int maxNumbers) : taken(maxNumbers, false) {}',
            '',
            '    int get() {',
            '        for (int i = 0; i < (int)taken.size(); ++i)',
            '            if (!taken[i]) { taken[i] = true; return i; }',
            '        return -1;',
            '    }',
            '',
            '    bool check(int number) { return !taken[number]; }',
            '',
            '    void release(int number) { taken[number] = false; }',
            '};',
          ],
        },
        js: {
          lines: [
            'class PhoneDirectory {',
            '  constructor(maxNumbers) {',
            '    this.taken = new Array(maxNumbers).fill(false);',
            '  }',
            '',
            '  get() {',
            '    const i = this.taken.indexOf(false);',
            '    if (i >= 0) this.taken[i] = true;',
            '    return i;',
            '  }',
            '',
            '  check(number) {',
            '    return !this.taken[number];',
            '  }',
            '',
            '  release(number) {',
            '    this.taken[number] = false;',
            '  }',
            '}',
          ],
        },
      },

      run([ops, args]: [string[], number[][]], c) {
        const taken = new Array<boolean>(args[0][0]).fill(false)
        const out: (number | boolean | null)[] = [null]
        for (let i = 1; i < ops.length; i++) {
          c.ops++
          if (ops[i] === 'get') {
            let found = -1
            for (let k = 0; k < taken.length; k++) {
              c.ops++
              if (!taken[k]) {
                found = k
                break
              }
            }
            if (found >= 0) taken[found] = true
            out.push(found)
          } else if (ops[i] === 'check') out.push(!taken[args[i][0]])
          else if (ops[i] === 'release') {
            taken[args[i][0]] = false
            out.push(null)
          } else out.push(null)
        }
        return out
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'heap-of-released',
      label: 'A cursor over never-used numbers plus a min-heap of released ones',
      kind: 'optimal',
      time: 'O(log n) get and release, O(1) check',
      space: 'O(n)',
      blurb:
        'The free numbers split into two kinds: those never handed out, which are exactly `next, next + 1, ...` and need no storage at all, and those handed back, which go in a min-heap. `get` takes the heap top if it is smaller than `next`, otherwise `next` itself. The boolean flags stay for `check` and to ignore a release of a number that was already free.',
      code: {
        cpp: {
          lines: [
            'class PhoneDirectory {',
            '    vector<bool> taken;',
            '    int next = 0;',
            '    priority_queue<int, vector<int>, greater<int>> released;',
            '',
            'public:',
            '    PhoneDirectory(int maxNumbers) : taken(maxNumbers, false) {}',
            '',
            '    int get() {',
            '        int number;',
            '        if (!released.empty() && (next >= (int)taken.size() || released.top() < next)) {',
            '            number = released.top(); released.pop();',
            '        } else if (next < (int)taken.size()) {',
            '            number = next++;',
            '        } else return -1;',
            '        taken[number] = true;',
            '        return number;',
            '    }',
            '',
            '    bool check(int number) { return !taken[number]; }',
            '',
            '    void release(int number) {',
            '        if (!taken[number]) return;',
            '        taken[number] = false;',
            '        released.push(number);',
            '    }',
            '};',
          ],
        },
        js: {
          lines: [
            'class PhoneDirectory {',
            '  constructor(maxNumbers) {',
            '    this.taken = new Array(maxNumbers).fill(false);',
            '    this.next = 0; // every number from here up has never been handed out',
            '    this.released = []; // a binary min-heap',
            '  }',
            '',
            '  push(x) {',
            '    const h = this.released;',
            '    h.push(x);',
            '    for (let i = h.length - 1; i > 0; ) {',
            '      const p = (i - 1) >> 1;',
            '      if (h[p] <= h[i]) break;',
            '      [h[p], h[i]] = [h[i], h[p]];',
            '      i = p;',
            '    }',
            '  }',
            '',
            '  pop() {',
            '    const h = this.released;',
            '    const top = h[0];',
            '    const last = h.pop();',
            '    if (h.length) {',
            '      h[0] = last;',
            '      for (let i = 0; ; ) {',
            '        let m = i;',
            '        const l = 2 * i + 1, r = l + 1;',
            '        if (l < h.length && h[l] < h[m]) m = l;',
            '        if (r < h.length && h[r] < h[m]) m = r;',
            '        if (m === i) break;',
            '        [h[m], h[i]] = [h[i], h[m]];',
            '        i = m;',
            '      }',
            '    }',
            '    return top;',
            '  }',
            '',
            '  get() {',
            '    let number;',
            '    if (this.released.length && (this.next >= this.taken.length || this.released[0] < this.next)) {',
            '      number = this.pop();',
            '    } else if (this.next < this.taken.length) {',
            '      number = this.next++;',
            '    } else return -1;',
            '    this.taken[number] = true;',
            '    return number;',
            '  }',
            '',
            '  check(number) {',
            '    return !this.taken[number];',
            '  }',
            '',
            '  release(number) {',
            '    if (!this.taken[number]) return;',
            '    this.taken[number] = false;',
            '    this.push(number);',
            '  }',
            '}',
          ],
        },
      },

      run([ops, args]: [string[], number[][]], c) {
        const taken = new Array<boolean>(args[0][0]).fill(false)
        let next = 0
        const heap: number[] = []
        const push = (x: number) => {
          heap.push(x)
          for (let i = heap.length - 1; i > 0; ) {
            c.ops++
            const p = (i - 1) >> 1
            if (heap[p] <= heap[i]) break
            ;[heap[p], heap[i]] = [heap[i], heap[p]]
            i = p
          }
        }
        const pop = () => {
          const top = heap[0]
          const last = heap.pop()!
          if (heap.length) {
            heap[0] = last
            for (let i = 0; ; ) {
              c.ops++
              let m = i
              const l = 2 * i + 1
              const r = l + 1
              if (l < heap.length && heap[l] < heap[m]) m = l
              if (r < heap.length && heap[r] < heap[m]) m = r
              if (m === i) break
              ;[heap[m], heap[i]] = [heap[i], heap[m]]
              i = m
            }
          }
          return top
        }
        const out: (number | boolean | null)[] = [null]
        for (let i = 1; i < ops.length; i++) {
          c.ops++
          if (ops[i] === 'get') {
            let number: number
            if (heap.length && (next >= taken.length || heap[0] < next)) number = pop()
            else if (next < taken.length) number = next++
            else {
              out.push(-1)
              continue
            }
            taken[number] = true
            out.push(number)
          } else if (ops[i] === 'check') out.push(!taken[args[i][0]])
          else if (ops[i] === 'release') {
            const number = args[i][0]
            if (taken[number]) {
              taken[number] = false
              push(number)
            }
            out.push(null)
          } else out.push(null)
        }
        return out
      },
    },
  ],
}
