import type { Problem } from '@/lib/types'

export const findPermutation: Problem = {
  id: 'find-permutation',
  title: 'Find Permutation',
  group: 'Medium',
  pattern: 'Greedy',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/find-permutation/',
  statement:
    "A permutation of `1..n` can be written as a string of `n - 1` characters, where `'I'` means the next number rises and `'D'` means it falls. Given such a string `s`, return the lexicographically smallest permutation that matches it.",
  constraints: ['1 <= s.length <= 10^5', "s[i] is either 'I' or 'D'"],
  signature: {
    fn: 'findPermutation',
    params: [{ name: 's', type: 'string' }],
    ret: 'int[]',
  },
  tests: [
    { args: ['I'], expect: [1, 2] },
    { args: ['DI'], expect: [2, 1, 3], note: '[3,1,2] also matches but sorts later' },
    { args: ['D'], expect: [2, 1], note: 'a single fall' },
    { args: ['DDI'], expect: [3, 2, 1, 4] },
    { args: ['IDI'], expect: [1, 3, 2, 4] },
    { args: ['III'], expect: [1, 2, 3, 4], note: 'already sorted' },
  ],
  demo: ['DI'],
  starter: {
    js: `function findPermutation(s) {
  // s: string  ->  number[]
}
`,
    cpp: `vector<int> findPermutation(string s) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'reverse-runs',
      label: 'Start sorted, reverse each falling run',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'The sorted permutation is the smallest of all, and it already satisfies every `I`. A run of `D`s is the only thing it gets wrong, and reversing exactly that stretch is the cheapest possible repair — it touches the fewest, and smallest, positions.',
      code: {
        cpp: {
          lines: [
            'vector<int> findPermutation(string s) {',
            '    int n = s.size() + 1;',
            '    vector<int> perm(n);',
            '    for (int i = 0; i < n; ++i) perm[i] = i + 1;',
            '',
            '    for (int i = 0; i < (int)s.size(); ) {',
            "        if (s[i] != 'D') { ++i; continue; }",
            '        int j = i;',
            "        while (j < (int)s.size() && s[j] == 'D') ++j;",
            '        reverse(perm.begin() + i, perm.begin() + j + 1);',
            '        i = j;',
            '    }',
            '    return perm;',
            '}',
          ],
        },
        js: {
          lines: [
            'function findPermutation(s) {',
            '  const n = s.length + 1;',
            '  const perm = Array.from({ length: n }, (_, i) => i + 1);',
            '',
            '  for (let i = 0; i < s.length; ) {',
            "    if (s[i] !== 'D') { i++; continue; }",
            '    let j = i;',
            "    while (j < s.length && s[j] === 'D') j++;",
            '    for (let a = i, b = j; a < b; a++, b--) {',
            '      const t = perm[a];',
            '      perm[a] = perm[b];',
            '      perm[b] = t;',
            '    }',
            '    i = j;',
            '  }',
            '  return perm;',
            '}',
          ],
        },
      },

      run([s]: [string], c) {
        const n = s.length + 1
        const perm = Array.from({ length: n }, (_, i) => i + 1)
        for (let i = 0; i < s.length; ) {
          c.ops++
          if (s[i] !== 'D') {
            i++
            continue
          }
          let j = i
          while (j < s.length && s[j] === 'D') j++
          for (let a = i, b = j; a < b; a++, b--) {
            const t = perm[a]
            perm[a] = perm[b]
            perm[b] = t
          }
          i = j
        }
        return perm
      },
    },
  ],
}
