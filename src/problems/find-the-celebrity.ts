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
  ],
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
      id: 'eliminate',
      label: 'One pass to eliminate, one to verify',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'Every question rules somebody out: if `a` knows `b` then `a` cannot be the celebrity, and if not then `b` cannot. Walking the line with a single candidate leaves the only person who could possibly be it — then one verification pass confirms or rejects them.',
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
