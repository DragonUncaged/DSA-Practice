import { arr, type Problem, type Tone } from '@/lib/types'

const DEMO: [number[]] = [[3, 0, 6, 1, 4, 5]]

export const missingNumber: Problem = {
  id: 'missing-number',
  title: 'Missing Number',
  group: 'Binary',
  pattern: 'XOR',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/missing-number/',
  statement:
    'Given an array `nums` containing `n` distinct numbers from the range `[0, n]`, return the one number in the range that is missing.',
  constraints: ['1 <= n <= 10^4', 'All numbers are distinct', 'O(1) extra space encouraged'],
  signature: { fn: 'missingNumber', params: [{ name: 'nums', type: 'int[]' }], ret: 'int' },
  tests: [
    { args: [[3, 0, 1]], expect: 2 },
    { args: [[0, 1]], expect: 2, note: 'the end of the range is missing' },
    { args: [[9, 6, 4, 2, 3, 5, 7, 0, 1]], expect: 8 },
    { args: [[0]], expect: 1 },
    { args: [[1]], expect: 0, note: 'zero is missing' },
  ],
  demo: DEMO,
  scale: (n) => [Array.from({ length: n }, (_, i) => (i === 0 ? n : i))],
  starter: {
    js: `function missingNumber(nums) {
  // nums: number[]  ->  number
}
`,
    cpp: `int missingNumber(vector<int>& nums) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'xor',
      label: 'XOR everything against everything',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'XOR is its own undo: x ^ x = 0. Fold every index 0..n and every value into one accumulator, and each number that appears on both sides cancels itself out. The only survivor is the number that appeared as an index but never as a value.',
      code: {
        cpp: {
          lines: [
            'int missingNumber(vector<int>& nums) {',
            '    int acc = nums.size();',
            '    for (int i = 0; i < nums.size(); ++i)',
            '        acc ^= i ^ nums[i];',
            '    return acc;',
            '}',
          ],
          map: { init: 2, fold: 4, done: 5 },
        },
        js: {
          lines: [
            'function missingNumber(nums) {',
            '  let acc = nums.length;',
            '  for (let i = 0; i < nums.length; i++) {',
            '    acc ^= i ^ nums[i];',
            '  }',
            '  return acc;',
            '}',
          ],
          map: { init: 2, fold: 4, done: 6 },
        },
      },

      trace(t, [nums]: [number[]]) {
        const n = nums.length
        let acc = n

        const paint = (i: number | null, tone: Tone = 'active') => {
          const tones: Record<number, Tone> = {}
          for (let k = 0; k < n; k++) tones[k] = i == null ? 'done' : k < i ? 'done' : k > i ? 'idle' : tone
          return arr(nums, {
            tones,
            pointers: i != null ? [{ name: 'i', at: i, accent: 'a' }] : [],
            title: 'nums',
          })
        }

        t.push({
          step: 'init',
          note: `The full range is 0..${n}. Seed the accumulator with ${n} (the one index that has no loop iteration), then fold in every index and every value. Pairs cancel; the missing number cannot.`,
          view: paint(0, 'idle'),
          vars: [['acc', acc, 'c']],
        })

        for (let i = 0; i < n; i++) {
          const before = acc
          acc ^= i ^ nums[i]
          t.bump()
          t.push({
            step: 'fold',
            note: `Fold in index ${i} and value ${nums[i]}: ${before} ^ ${i} ^ ${nums[i]} = ${acc}. Anything XORed twice has already vanished.`,
            view: paint(i),
            vars: [
              ['i', i, 'a'],
              ['nums[i]', nums[i]],
              ['acc', acc, 'c'],
            ],
            badge: { text: `acc = ${acc}`, accent: 'c' },
          })
        }

        t.push({
          step: 'done',
          note: `Everything that appeared as both an index and a value cancelled to zero. The survivor is ${acc} — the missing number. One pass, one integer of memory, no sorting.`,
          view: paint(null),
          vars: [['answer', acc, 'ok']],
          badge: { text: `missing ${acc}`, accent: 'ok' },
        })
      },

      run([nums]: [number[]], c) {
        let acc = nums.length
        for (let i = 0; i < nums.length; i++) {
          c.ops++
          acc ^= i ^ nums[i]
        }
        return acc
      },
    },
  ],
}
