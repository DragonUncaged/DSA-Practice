import type { Problem } from '@/lib/types'

export const findTheCelebrity: Problem = {
  id: 'find-the-celebrity',
  title: 'Find the Celebrity',
  group: 'Medium',
  pattern: 'Elimination',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/find-the-celebrity/',
  statement:
    'At a party of `n` people there may be one celebrity: everybody else knows them, and they know nobody. `graph[a][b]` is 1 when `a` knows `b`. Return the celebrity, or `-1` if there is none. The interview version hides `graph` behind a `knows(a, b)` call and asks for at most `3n` of them.',
  constraints: [
    'n == graph.length == graph[i].length',
    '2 <= n <= 100',
    'graph[i][j] is 0 or 1',
    'graph[i][i] == 1',
  ],
  signature: { fn: 'findCelebrity', params: [{ name: 'graph', type: 'int[][]' }], ret: 'int' },
  tests: [
    { args: [[[1, 1, 0], [0, 1, 0], [1, 1, 1]]], expect: 1 },
    { args: [[[1, 0, 1], [1, 1, 0], [0, 1, 1]]], expect: -1, note: 'nobody qualifies' },
    { args: [[[1, 0], [1, 1]]], expect: 0, note: 'two people, 0 is the celebrity' },
    { args: [[[1, 1], [0, 1]]], expect: 1 },
    { args: [[[1, 1], [1, 1]]], expect: -1, note: 'they know each other' },
    {
      args: [[[1, 1, 1, 1], [0, 1, 0, 0], [1, 1, 1, 1], [1, 1, 0, 1]]],
      expect: 1,
      note: 'everyone knows 1 and 1 knows nobody',
    },
    {
      args: [[[1, 1, 0], [1, 1, 0], [0, 0, 1]]],
      expect: -1,
      note: '2 knows nobody, but nobody knows 2 either',
    },
    {
      args: [[[1, 0, 0, 1], [1, 1, 0, 1], [1, 0, 1, 1], [0, 0, 0, 1]]],
      expect: 3,
      note: 'the celebrity is the last person checked',
    },
  ],
  // everyone knows everyone after them: each candidate survives about as many checks as its index
  scale: (n) => [Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (j >= i ? 1 : 0)))],
  demo: [[[1, 1, 0], [0, 1, 0], [1, 1, 1]]],
  starter: {
    js: `function findCelebrity(graph) {
  // graph: number[][]  ->  number
}
`,
    cpp: `int findCelebrity(vector<vector<int>>& graph) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'check-everyone',
      label: 'Check every person against everyone else',
      kind: 'brute',
      time: 'O(n^2)',
      space: 'O(1)',
      blurb:
        'Take each person in turn as a candidate and verify the definition directly: they know nobody else, and everybody else knows them. Correct, but a candidate who fails late has already cost nearly `n` questions, and there are `n` candidates.',
      code: {
        cpp: {
          lines: [
            'int findCelebrity(vector<vector<int>>& graph) {',
            '    int n = graph.size();',
            '    auto knows = [&](int a, int b) { return graph[a][b] == 1; };',
            '    for (int c = 0; c < n; ++c) {',
            '        bool ok = true;',
            '        for (int i = 0; i < n && ok; ++i) {',
            '            if (i == c) continue;',
            '            if (knows(c, i) || !knows(i, c)) ok = false;',
            '        }',
            '        if (ok) return c;',
            '    }',
            '    return -1;',
            '}',
          ],
        },
        js: {
          lines: [
            'function findCelebrity(graph) {',
            '  const n = graph.length;',
            '  const knows = (a, b) => graph[a][b] === 1;',
            '  for (let c = 0; c < n; c++) {',
            '    let ok = true;',
            '    for (let i = 0; i < n && ok; i++) {',
            '      if (i === c) continue;',
            '      if (knows(c, i) || !knows(i, c)) ok = false;',
            '    }',
            '    if (ok) return c;',
            '  }',
            '  return -1;',
            '}',
          ],
        },
      },

      run([graph]: [number[][]], c) {
        const n = graph.length
        const knows = (a: number, b: number) => {
          c.ops++
          return graph[a][b] === 1
        }
        for (let cand = 0; cand < n; cand++) {
          let ok = true
          for (let i = 0; i < n && ok; i++) {
            if (i === cand) continue
            if (knows(cand, i) || !knows(i, cand)) ok = false
          }
          if (ok) return cand
        }
        return -1
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'eliminate',
      label: 'One pass to eliminate, one to verify',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'Checking candidates one at a time wastes what each answer reveals. Every question rules somebody out: if `a` knows `b` then `a` cannot be the celebrity, and if not then `b` cannot. Walking the line with a single candidate leaves the only person who could possibly be it — then one verification pass confirms or rejects them, in under `3n` questions.',
      code: {
        cpp: {
          lines: [
            'int findCelebrity(vector<vector<int>>& graph) {',
            '    int n = graph.size();',
            '    auto knows = [&](int a, int b) { return graph[a][b] == 1; };',
            '',
            '    int candidate = 0;',
            '    for (int i = 1; i < n; ++i) {',
            '        if (knows(candidate, i)) candidate = i;',
            '    }',
            '',
            '    for (int i = 0; i < n; ++i) {',
            '        if (i == candidate) continue;',
            '        if (knows(candidate, i) || !knows(i, candidate)) return -1;',
            '    }',
            '    return candidate;',
            '}',
          ],
        },
        js: {
          lines: [
            'function findCelebrity(graph) {',
            '  const n = graph.length;',
            '  const knows = (a, b) => graph[a][b] === 1;',
            '',
            '  let candidate = 0;',
            '  for (let i = 1; i < n; i++) {',
            '    if (knows(candidate, i)) candidate = i;',
            '  }',
            '',
            '  for (let i = 0; i < n; i++) {',
            '    if (i === candidate) continue;',
            '    if (knows(candidate, i) || !knows(i, candidate)) return -1;',
            '  }',
            '  return candidate;',
            '}',
          ],
        },
      },

      run([graph]: [number[][]], c) {
        const n = graph.length
        const knows = (a: number, b: number) => {
          c.ops++
          return graph[a][b] === 1
        }
        let candidate = 0
        for (let i = 1; i < n; i++) if (knows(candidate, i)) candidate = i
        for (let i = 0; i < n; i++) {
          if (i === candidate) continue
          if (knows(candidate, i) || !knows(i, candidate)) return -1
        }
        return candidate
      },
    },
  ],
}
