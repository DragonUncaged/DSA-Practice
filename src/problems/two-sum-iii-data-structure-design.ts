import type { Problem } from '@/lib/types'

export const twoSumIII: Problem = {
  id: 'two-sum-iii-data-structure-design',
  title: 'Two Sum III - Data structure design',
  group: 'Easy',
  pattern: 'Design',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/two-sum-iii-data-structure-design/',
  statement:
    'Design a `TwoSum` class over a stream of integers. `add(number)` stores a number and `find(value)` returns whether any two stored numbers sum to `value`. A count per distinct number is enough: `find` then walks the keys and asks whether the complement is present, taking care that a number pairs with itself only when it was added twice.',
  constraints: [
    '-10^5 <= number <= 10^5',
    '-2^31 <= value <= 2^31 - 1',
    'At most 10^4 calls are made to add and find',
  ],

  design: {
    className: 'TwoSum',
    ctor: [],
    methods: [
      { name: 'add', params: [{ name: 'number', type: 'int' }], ret: 'void' },
      { name: 'find', params: [{ name: 'value', type: 'int' }], ret: 'bool' },
    ],
  },

  designTests: [
    {
      ops: ['TwoSum', 'add', 'add', 'add', 'find', 'find'],
      args: [[], [1], [3], [5], [4], [7]],
      expect: [null, null, null, null, true, false],
    },
    // a number pairs with itself only when added twice
    {
      ops: ['TwoSum', 'add', 'find', 'add', 'find'],
      args: [[], [2], [4], [2], [4]],
      expect: [null, null, false, null, true],
    },
    { ops: ['TwoSum', 'find'], args: [[], [0]], expect: [null, false] },
    {
      ops: ['TwoSum', 'add', 'add', 'find', 'find', 'find'],
      args: [[], [-100000], [100000], [0], [-200000], [200000]],
      expect: [null, null, null, true, false, false],
    },
    {
      ops: ['TwoSum', 'add', 'add', 'add', 'find', 'find'],
      args: [[], [0], [0], [-3], [0], [-3]],
      expect: [null, null, null, null, true, true],
    },
  ],

  starter: {
    js: `class TwoSum {
  constructor() {
  }

  add(number) {
    // number: number  ->  void
  }

  find(value) {
    // value: number  ->  boolean
  }
}
`,
    cpp: `class TwoSum {
public:
    TwoSum() {
    }

    void add(int number) {
        // your code here
    }

    bool find(int value) {
        // your code here
    }
};
`,
  },

  solutions: [
    {
      id: 'list-of-pairs',
      label: 'Keep a list and try every pair',
      kind: 'brute',
      time: 'O(1) add, O(n^2) find',
      space: 'O(n)',
      blurb:
        'Append each number to a list and let `find` check every pair of distinct positions for the target sum. Adding is trivial and the pairing rule about a number matching itself comes for free from using positions — but every `find` is the quadratic Two Sum brute force all over again.',
      code: {
        cpp: {
          lines: [
            'class TwoSum {',
            '    vector<int> nums;',
            '',
            'public:',
            '    TwoSum() {}',
            '',
            '    void add(int number) { nums.push_back(number); }',
            '',
            '    bool find(int value) {',
            '        for (size_t i = 0; i < nums.size(); ++i)',
            '            for (size_t j = i + 1; j < nums.size(); ++j)',
            '                if ((long long)nums[i] + nums[j] == value) return true;',
            '        return false;',
            '    }',
            '};',
          ],
        },
        js: {
          lines: [
            'class TwoSum {',
            '  constructor() {',
            '    this.nums = [];',
            '  }',
            '',
            '  add(number) {',
            '    this.nums.push(number);',
            '  }',
            '',
            '  find(value) {',
            '    for (let i = 0; i < this.nums.length; i++) {',
            '      for (let j = i + 1; j < this.nums.length; j++) {',
            '        if (this.nums[i] + this.nums[j] === value) return true;',
            '      }',
            '    }',
            '    return false;',
            '  }',
            '}',
          ],
        },
      },

      run([ops, args]: [string[], number[][]], c) {
        const nums: number[] = []
        const out: (boolean | null)[] = [null]
        for (let i = 1; i < ops.length; i++) {
          if (ops[i] === 'add') {
            c.ops++
            nums.push(args[i][0])
            out.push(null)
            continue
          }
          const value = args[i][0]
          let found = false
          for (let a = 0; a < nums.length && !found; a++) {
            for (let b = a + 1; b < nums.length; b++) {
              c.ops++
              if (nums[a] + nums[b] === value) {
                found = true
                break
              }
            }
          }
          out.push(found)
        }
        return out
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'count-map',
      label: 'Count each number, look up the complement',
      kind: 'optimal',
      time: 'O(1) add, O(n) find',
      space: 'O(n)',
      blurb:
        'Every pair is a number and its complement, so a hash map from number to count answers "is the complement here?" in one lookup. `find` walks the distinct keys once; the only subtlety is a number that is its own complement, which needs a count of at least two.',
      code: {
        cpp: {
          lines: [
            'class TwoSum {',
            '    unordered_map<int, int> count;',
            '',
            'public:',
            '    TwoSum() {}',
            '',
            '    void add(int number) { count[number]++; }',
            '',
            '    bool find(int value) {',
            '        for (auto& [x, n] : count) {',
            '            long long other = (long long)value - x;',
            '            if (other < INT_MIN || other > INT_MAX) continue;',
            '            if (other == x) { if (n >= 2) return true; }',
            '            else if (count.count((int)other)) return true;',
            '        }',
            '        return false;',
            '    }',
            '};',
          ],
        },
        js: {
          lines: [
            'class TwoSum {',
            '  constructor() {',
            '    this.count = new Map();',
            '  }',
            '',
            '  add(number) {',
            '    this.count.set(number, (this.count.get(number) ?? 0) + 1);',
            '  }',
            '',
            '  find(value) {',
            '    for (const [x, n] of this.count) {',
            '      const other = value - x;',
            '      if (other === x) {',
            '        if (n >= 2) return true;',
            '      } else if (this.count.has(other)) {',
            '        return true;',
            '      }',
            '    }',
            '    return false;',
            '  }',
            '}',
          ],
        },
      },

      run([ops, args]: [string[], number[][]], c) {
        const count = new Map<number, number>()
        const out: (boolean | null)[] = [null]
        for (let i = 1; i < ops.length; i++) {
          if (ops[i] === 'add') {
            c.ops++
            count.set(args[i][0], (count.get(args[i][0]) ?? 0) + 1)
            out.push(null)
            continue
          }
          const value = args[i][0]
          let found = false
          for (const [x, n] of count) {
            c.ops++
            const other = value - x
            if (other === x ? n >= 2 : count.has(other)) {
              found = true
              break
            }
          }
          out.push(found)
        }
        return out
      },
    },
  ],
}
