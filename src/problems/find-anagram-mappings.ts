import type { Problem } from '@/lib/types'

export const findAnagramMappings: Problem = {
  id: 'find-anagram-mappings',
  title: 'Find Anagram Mappings',
  group: 'Array',
  pattern: 'Hash Map',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/find-anagram-mappings/',
  statement:
    'Arrays `A` and `B` hold the same values in a different order. Return the mapping `P` where `P[i]` is the index in `B` of the value `A[i]`.',
  constraints: [
    '1 <= A.length <= 100',
    'B is a permutation of A',
    'A contains no repeated values, so the mapping is unique',
  ],
  signature: {
    fn: 'anagramMappings',
    params: [
      { name: 'A', type: 'int[]' },
      { name: 'B', type: 'int[]' },
    ],
    ret: 'int[]',
  },
  tests: [
    {
      args: [
        [12, 28, 46, 32, 50],
        [50, 12, 32, 46, 28],
      ],
      expect: [1, 4, 3, 2, 0],
    },
    { args: [[1], [1]], expect: [0] },
    {
      args: [
        [1, 2],
        [2, 1],
      ],
      expect: [1, 0],
    },
    {
      args: [
        [5, 4, 3, 2, 1],
        [1, 2, 3, 4, 5],
      ],
      expect: [4, 3, 2, 1, 0],
      note: 'a full reversal',
    },
    {
      args: [
        [3, 1, 2],
        [3, 1, 2],
      ],
      expect: [0, 1, 2],
      note: 'already in the same order',
    },
    {
      args: [
        [100000, 0, 99999],
        [99999, 100000, 0],
      ],
      expect: [1, 2, 0],
      note: 'the value bounds',
    },
    {
      args: [Array.from({ length: 100 }, (_, i) => i * 7), Array.from({ length: 100 }, (_, i) => (99 - i) * 7)],
      expect: Array.from({ length: 100 }, (_, i) => 99 - i),
      note: 'the longest input, reversed',
    },
  ],
  demo: [
    [12, 28, 46, 32, 50],
    [50, 12, 32, 46, 28],
  ],
  scale: (n) => {
    const a = Array.from({ length: n }, (_, i) => i)
    return [a, [...a].reverse()]
  },
  starter: {
    js: `function anagramMappings(A, B) {
  // A: number[], B: number[]  ->  number[]
}
`,
    cpp: `vector<int> anagramMappings(vector<int>& A, vector<int>& B) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'scan-b',
      label: 'Search B for each element of A',
      kind: 'brute',
      time: 'O(n^2)',
      space: 'O(1)',
      blurb:
        'For every element of A, walk B from the front until the same value appears and record where it was. It needs nothing beyond the two arrays, but each of the n lookups is its own linear scan, so the searches add up to quadratic work even though the answer for every value is fixed before the first lookup starts.',
      code: {
        cpp: {
          lines: [
            'vector<int> anagramMappings(vector<int>& A, vector<int>& B) {',
            '    vector<int> out;',
            '    for (int x : A)',
            '        for (int j = 0; j < (int)B.size(); ++j)',
            '            if (B[j] == x) { out.push_back(j); break; }',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function anagramMappings(A, B) {',
            '  const out = [];',
            '  for (const x of A)',
            '    for (let j = 0; j < B.length; j++)',
            '      if (B[j] === x) { out.push(j); break; }',
            '  return out;',
            '}',
          ],
        },
      },
      run([A, B]: [number[], number[]], c) {
        const out: number[] = []
        for (const x of A)
          for (let j = 0; j < B.length; j++) {
            c.ops++
            if (B[j] === x) {
              out.push(j)
              break
            }
          }
        return out
      },
    },
    {
      id: 'index-map',
      label: 'Index B once, then read it off',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'Searching B for every element of A is quadratic and repeats the same scans. Building one value-to-index map of B turns each lookup into a constant-time read, so the whole mapping falls out of two linear passes.',
      code: {
        cpp: {
          lines: [
            'vector<int> anagramMappings(vector<int>& A, vector<int>& B) {',
            '    unordered_map<int, int> at;',
            '    for (int i = 0; i < (int)B.size(); ++i) at[B[i]] = i;',
            '    vector<int> out;',
            '    for (int x : A) out.push_back(at[x]);',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function anagramMappings(A, B) {',
            '  const at = new Map();',
            '  B.forEach((v, i) => at.set(v, i));',
            '  return A.map((x) => at.get(x));',
            '}',
          ],
        },
      },

      run([A, B]: [number[], number[]], c) {
        const at = new Map<number, number>()
        B.forEach((v, i) => {
          c.ops++
          at.set(v, i)
        })
        return A.map((x) => {
          c.ops++
          return at.get(x)
        })
      },
    },
  ],
}
