import { arr, combo, type Problem, type Tone } from '@/lib/types'

const DEMO: [number[]] = [[1, 2, 3, 4]]

export const productOfArrayExceptSelf: Problem = {
  id: 'product-of-array-except-self',
  title: 'Product of Array Except Self',
  group: 'Array',
  pattern: 'Prefix / Suffix',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/product-of-array-except-self/',
  statement:
    'Given `nums`, return an array where `answer[i]` is the product of every element except `nums[i]`. You must not use division, and the solution must run in O(n).',
  constraints: ['2 <= nums.length <= 10^5', '-30 <= nums[i] <= 30', 'No division allowed'],
  signature: { fn: 'productExceptSelf', params: [{ name: 'nums', type: 'int[]' }], ret: 'int[]' },
  tests: [
    { args: [[1, 2, 3, 4]], expect: [24, 12, 8, 6] },
    { args: [[-1, 1, 0, -3, 3]], expect: [0, 0, 9, 0, 0], note: 'a zero blanks everyone else' },
    { args: [[2, 3]], expect: [3, 2] },
    { args: [[1, 0, 0, 4]], expect: [0, 0, 0, 0], note: 'two zeros blank everything' },
  ],
  demo: DEMO,
  scale: (n) => [Array.from({ length: n }, (_, i) => ((i * 7) % 3) - 1 || 1)],
  starter: {
    js: `function productExceptSelf(nums) {
  // nums: number[]  ->  number[]
}
`,
    cpp: `vector<int> productExceptSelf(vector<int>& nums) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'prefix-suffix',
      label: 'Prefix pass, then suffix pass',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'The product of everything-except-me is (everything to my left) times (everything to my right). Sweep left to right writing the left products, then sweep right to left multiplying the right products in. No division ever needed.',
      code: {
        cpp: {
          lines: [
            'vector<int> productExceptSelf(vector<int>& nums) {',
            '    int n = nums.size();',
            '    vector<int> out(n, 1);',
            '    int left = 1;',
            '    for (int i = 0; i < n; ++i) {',
            '        out[i] = left;',
            '        left *= nums[i];',
            '    }',
            '    int right = 1;',
            '    for (int i = n - 1; i >= 0; --i) {',
            '        out[i] *= right;',
            '        right *= nums[i];',
            '    }',
            '    return out;',
            '}',
          ],
          map: { init: 3, pre: 6, suf: 11, done: 14 },
        },
        js: {
          lines: [
            'function productExceptSelf(nums) {',
            '  const n = nums.length;',
            '  const out = new Array(n).fill(1);',
            '  let left = 1;',
            '  for (let i = 0; i < n; i++) {',
            '    out[i] = left;',
            '    left *= nums[i];',
            '  }',
            '  let right = 1;',
            '  for (let i = n - 1; i >= 0; i--) {',
            '    out[i] *= right;',
            '    right *= nums[i];',
            '  }',
            '  return out;',
            '}',
          ],
          map: { init: 3, pre: 6, suf: 11, done: 15 },
        },
      },

      trace(t, [nums]: [number[]]) {
        const n = nums.length
        const out = new Array(n).fill(1)

        const paint = (i: number | null, phase: 'pre' | 'suf' | 'done') => {
          const inTones: Record<number, Tone> = {}
          const outTones: Record<number, Tone> = {}
          for (let k = 0; k < n; k++) {
            if (phase === 'done') {
              inTones[k] = 'dim'
              outTones[k] = 'good'
            } else if (phase === 'pre') {
              inTones[k] = i != null && k < i ? 'done' : 'idle'
              outTones[k] = i != null && k < i ? 'band' : 'idle'
            } else {
              inTones[k] = i != null && k > i ? 'done' : 'idle'
              outTones[k] = i != null && k > i ? 'good' : 'band'
            }
          }
          if (i != null) {
            inTones[i] = 'active'
            outTones[i] = 'active'
          }
          return combo(
            arr(nums, {
              tones: inTones,
              pointers: i != null ? [{ name: 'i', at: i, accent: phase === 'pre' ? 'a' : 'b' }] : [],
              title: 'nums',
            }),
            arr([...out], { tones: outTones, title: 'answer', showIndex: false }),
          )
        }

        t.push({
          step: 'init',
          note: 'Start the answer as all 1s. Two sweeps will fold in the left products and then the right products.',
          view: paint(null, 'pre'),
          vars: [['left', 1, 'a']],
        })

        let left = 1
        for (let i = 0; i < n; i++) {
          out[i] = left
          t.bump()
          t.push({
            step: 'pre',
            note: `answer[${i}] gets the product of everything left of it: ${left}. Then fold nums[${i}] = ${nums[i]} into the running left product.`,
            view: paint(i, 'pre'),
            vars: [
              ['i', i, 'a'],
              ['left so far', left, 'c'],
              [`answer[${i}]`, out[i]],
            ],
            badge: { text: `left = ${left}`, accent: 'a' },
          })
          left *= nums[i]
        }

        let right = 1
        for (let i = n - 1; i >= 0; i--) {
          out[i] *= right
          t.bump()
          t.push({
            step: 'suf',
            note: `Coming back the other way: multiply answer[${i}] by the product of everything right of it (${right}), giving ${out[i]}.`,
            view: paint(i, 'suf'),
            vars: [
              ['i', i, 'b'],
              ['right so far', right, 'c'],
              [`answer[${i}]`, out[i], 'ok'],
            ],
            badge: { text: `right = ${right}`, accent: 'b' },
          })
          right *= nums[i]
        }

        t.push({
          step: 'done',
          note: `Two linear sweeps, no division. Every slot holds left-product times right-product.`,
          view: paint(null, 'done'),
          vars: [['answer', `[${out.join(', ')}]`, 'ok']],
          badge: { text: 'complete', accent: 'ok' },
        })
      },

      run([nums]: [number[]], c) {
        const n = nums.length
        const out = new Array(n).fill(1)
        let left = 1
        for (let i = 0; i < n; i++) {
          c.ops++
          out[i] = left
          left *= nums[i]
        }
        let right = 1
        for (let i = n - 1; i >= 0; i--) {
          c.ops++
          out[i] *= right
          right *= nums[i]
        }
        return out
      },
    },
  ],
}
