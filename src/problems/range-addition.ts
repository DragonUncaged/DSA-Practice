import type { Problem } from '@/lib/types'

export const rangeAddition: Problem = {
  id: 'range-addition',
  title: 'Range Addition',
  group: 'Medium',
  pattern: 'Prefix Sum',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/range-addition/',
  statement:
    'Start with an array of `length` zeros. Each entry of `updates` is `[start, end, inc]` and adds `inc` to every index from `start` to `end` inclusive. Return the array once every update has been applied.',
  constraints: [
    '1 <= length <= 10^5',
    '0 <= updates.length <= 10^4',
    '0 <= start <= end < length',
    '-1000 <= inc <= 1000',
  ],
  signature: {
    fn: 'getModifiedArray',
    params: [
      { name: 'length', type: 'int' },
      { name: 'updates', type: 'int[][]' },
    ],
    ret: 'int[]',
  },
  tests: [
    { args: [5, [[1, 3, 2], [2, 4, 3], [0, 2, -2]]], expect: [-2, 0, 3, 5, 3] },
    {
      args: [10, [[2, 4, 6], [5, 6, 8], [1, 9, -4]]],
      expect: [0, -4, 2, 2, 2, 4, 4, -4, -4, -4],
    },
    { args: [3, []], expect: [0, 0, 0], note: 'no updates' },
    { args: [1, [[0, 0, 5]]], expect: [5], note: 'single cell' },
    { args: [4, [[0, 3, 1], [0, 3, 1]]], expect: [2, 2, 2, 2], note: 'two full-width updates' },
    { args: [3, [[0, 2, 1000], [1, 1, -1000]]], expect: [1000, 0, 1000], note: 'the extreme increments cancel in the middle' },
    { args: [5, [[4, 4, 7]]], expect: [0, 0, 0, 0, 7], note: 'an update ending at the last index' },
  ],
  scale: (n) => [n, Array.from({ length: n >> 2 }, (_, i) => [i % (n >> 1), (n >> 1) + (i % (n >> 1)), 1])],
  demo: [5, [[1, 3, 2], [2, 4, 3], [0, 2, -2]]],
  starter: {
    js: `function getModifiedArray(length, updates) {
  // length: number, updates: number[][]  ->  number[]
}
`,
    cpp: `vector<int> getModifiedArray(int length, vector<vector<int>>& updates) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'cell-by-cell',
      label: 'Apply each update cell by cell',
      kind: 'brute',
      time: 'O(n * u)',
      space: 'O(1)',
      blurb:
        'For every update, loop from `start` to `end` and add `inc` to each cell. Correct and literal, but a wide range costs a pass over most of the array, and ten thousand of them add up to a billion writes.',
      code: {
        cpp: {
          lines: [
            'vector<int> getModifiedArray(int length, vector<vector<int>>& updates) {',
            '    vector<int> out(length, 0);',
            '    for (auto& u : updates)',
            '        for (int i = u[0]; i <= u[1]; ++i) out[i] += u[2];',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function getModifiedArray(length, updates) {',
            '  const out = new Array(length).fill(0);',
            '  for (const [start, end, inc] of updates) {',
            '    for (let i = start; i <= end; i++) out[i] += inc;',
            '  }',
            '  return out;',
            '}',
          ],
        },
      },

      run([length, updates]: [number, number[][]], c) {
        const out = new Array<number>(length).fill(0)
        for (const [start, end, inc] of updates) {
          for (let i = start; i <= end; i++) {
            c.ops++
            out[i] += inc
          }
        }
        return out
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'difference-array',
      label: 'Record the edges, then sweep once',
      kind: 'optimal',
      time: 'O(n + u)',
      space: 'O(n)',
      blurb:
        'Writing each range cell by cell is `O(n)` per update. Instead record only where the increment starts and where it stops: `+inc` at `start` and `-inc` just past `end`. A running sum over that difference array reconstructs every value in one pass, so each update costs two writes no matter how wide it is.',
      code: {
        cpp: {
          lines: [
            'vector<int> getModifiedArray(int length, vector<vector<int>>& updates) {',
            '    vector<int> diff(length + 1, 0);',
            '    for (auto& u : updates) {',
            '        diff[u[0]] += u[2];',
            '        diff[u[1] + 1] -= u[2];',
            '    }',
            '',
            '    vector<int> out(length);',
            '    int running = 0;',
            '    for (int i = 0; i < length; ++i) {',
            '        running += diff[i];',
            '        out[i] = running;',
            '    }',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function getModifiedArray(length, updates) {',
            '  const diff = new Array(length + 1).fill(0);',
            '  for (const [start, end, inc] of updates) {',
            '    diff[start] += inc;',
            '    diff[end + 1] -= inc;',
            '  }',
            '',
            '  const out = new Array(length);',
            '  let running = 0;',
            '  for (let i = 0; i < length; i++) {',
            '    running += diff[i];',
            '    out[i] = running;',
            '  }',
            '  return out;',
            '}',
          ],
        },
      },

      run([length, updates]: [number, number[][]], c) {
        const diff = new Array<number>(length + 1).fill(0)
        for (const [start, end, inc] of updates) {
          c.ops++
          diff[start] += inc
          diff[end + 1] -= inc
        }
        const out = new Array<number>(length)
        let running = 0
        for (let i = 0; i < length; i++) {
          c.ops++
          running += diff[i]
          out[i] = running
        }
        return out
      },
    },
  ],
}
