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
    { args: ['DDDD'], expect: [5, 4, 3, 2, 1], note: 'entirely falling' },
    { args: ['IDDI'], expect: [1, 4, 3, 2, 5], note: 'a falling run in the middle' },
    { args: ['DIDI'], expect: [2, 1, 4, 3, 5], note: 'alternating' },
  ],
  scale: (n) => ['DI'.repeat(Math.ceil(n / 2)).slice(0, n)],
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
      id: 'first-matching-permutation',
      label: 'Walk the permutations in order until one matches',
      kind: 'brute',
      time: 'O(n! * n)',
      space: 'O(n)',
      blurb:
        'Generate the permutations of `1..n` in lexicographic order and return the first whose rises and falls spell out `s`. Correct by construction — the first match is the smallest — and factorial, so it stalls somewhere around a dozen elements while the answer had a linear shape all along.',
      code: {
        cpp: {
          lines: [
            'vector<int> findPermutation(string s) {',
            '    int n = s.size() + 1;',
            '    vector<int> perm(n);',
            '    iota(perm.begin(), perm.end(), 1);',
            '    do {',
            '        bool ok = true;',
            "        for (int i = 0; i + 1 < n && ok; ++i) ok = (s[i] == 'I') == (perm[i] < perm[i + 1]);",
            '        if (ok) return perm;',
            '    } while (next_permutation(perm.begin(), perm.end()));',
            '    return {};',
            '}',
          ],
        },
        js: {
          lines: [
            'function findPermutation(s) {',
            '  const n = s.length + 1;',
            '  const matches = (perm) => {',
            "    for (let i = 0; i + 1 < n; i++) if ((s[i] === 'I') !== perm[i] < perm[i + 1]) return false;",
            '    return true;',
            '  };',
            '  const used = new Array(n + 1).fill(false);',
            '  const perm = [];',
            '  // builds permutations smallest-first; the first full one that matches is the answer',
            '  const walk = () => {',
            '    if (perm.length === n) return matches(perm) ? perm.slice() : null;',
            '    for (let v = 1; v <= n; v++) {',
            '      if (used[v]) continue;',
            '      used[v] = true;',
            '      perm.push(v);',
            '      const found = walk();',
            '      perm.pop();',
            '      used[v] = false;',
            '      if (found) return found;',
            '    }',
            '    return null;',
            '  };',
            '  return walk();',
            '}',
          ],
        },
      },

      run([s]: [string], c) {
        const n = s.length + 1
        if (n > 9) throw new Error('too slow')
        const matches = (perm: number[]) => {
          for (let i = 0; i + 1 < n; i++) {
            c.ops++
            if ((s[i] === 'I') !== perm[i] < perm[i + 1]) return false
          }
          return true
        }
        const used = new Array<boolean>(n + 1).fill(false)
        const perm: number[] = []
        const walk = (): number[] | null => {
          c.ops++
          if (perm.length === n) return matches(perm) ? perm.slice() : null
          for (let v = 1; v <= n; v++) {
            if (used[v]) continue
            used[v] = true
            perm.push(v)
            const found = walk()
            perm.pop()
            used[v] = false
            if (found) return found
          }
          return null
        }
        return walk()
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'reverse-runs',
      label: 'Start sorted, reverse each falling run',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'No search is needed, because the answer is one edit away from the smallest permutation of all. The sorted permutation already satisfies every `I`; a run of `D`s is the only thing it gets wrong, and reversing exactly that stretch is the cheapest possible repair — it touches the fewest, and smallest, positions. One pass over `s`.',
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
