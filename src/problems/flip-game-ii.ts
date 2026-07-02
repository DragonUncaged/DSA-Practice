import type { Problem } from '@/lib/types'

export const flipGameII: Problem = {
  id: 'flip-game-ii',
  title: 'Flip Game II',
  group: 'Medium',
  pattern: 'Game Theory',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/flip-game-ii/',
  statement:
    'Two players take turns flipping two consecutive `+` into `--`, and whoever cannot move loses. Given `currentState`, return true when the player to move can force a win.',
  constraints: ['1 <= currentState.length <= 60', "currentState[i] is either '+' or '-'"],
  signature: { fn: 'canWin', params: [{ name: 'currentState', type: 'string' }], ret: 'bool' },
  tests: [
    { args: ['++++'], expect: true, note: 'flip the middle pair and mirror the reply' },
    { args: ['+'], expect: false, note: 'no move at all' },
    { args: ['++'], expect: true, note: 'take the only move and win' },
    { args: ['--'], expect: false },
    { args: ['++--++'], expect: false, note: 'two equal halves cancel out' },
    { args: ['+++'], expect: true },
    { args: ['+++++'], expect: false, note: 'five in a row is the first losing run' },
  ],
  demo: ['++++'],
  starter: {
    js: `function canWin(currentState) {
  // currentState: string  ->  boolean
}
`,
    cpp: `bool canWin(string currentState) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'grundy',
      label: 'Grundy numbers over the runs of plusses',
      kind: 'optimal',
      time: 'O(n^2)',
      space: 'O(n)',
      blurb:
        'A flip splits one run of plusses into two shorter, independent runs, which makes this a sum of impartial games. Compute a Grundy number per run length — the smallest value no move can reach — and XOR the runs together: the player to move wins exactly when that XOR is non-zero.',
      code: {
        cpp: {
          lines: [
            'bool canWin(string currentState) {',
            '    vector<int> runs;',
            '    int run = 0, longest = 0;',
            "    string s = currentState + '-';",
            '    for (char ch : s) {',
            "        if (ch == '+') { ++run; continue; }",
            '        if (run >= 2) runs.push_back(run);',
            '        longest = max(longest, run);',
            '        run = 0;',
            '    }',
            '',
            '    vector<int> g(longest + 1, 0);',
            '    for (int len = 2; len <= longest; ++len) {',
            '        unordered_set<int> reachable;',
            '        for (int left = 0; left + 2 <= len; ++left)',
            '            reachable.insert(g[left] ^ g[len - left - 2]);',
            '        int mex = 0;',
            '        while (reachable.count(mex)) ++mex;',
            '        g[len] = mex;',
            '    }',
            '',
            '    int total = 0;',
            '    for (int r : runs) total ^= g[r];',
            '    return total != 0;',
            '}',
          ],
        },
        js: {
          lines: [
            'function canWin(currentState) {',
            '  const runs = [];',
            '  let run = 0;',
            '  let longest = 0;',
            "  for (const ch of currentState + '-') {",
            "    if (ch === '+') { run++; continue; }",
            '    if (run >= 2) runs.push(run);',
            '    longest = Math.max(longest, run);',
            '    run = 0;',
            '  }',
            '',
            '  const g = new Array(longest + 1).fill(0);',
            '  for (let len = 2; len <= longest; len++) {',
            '    const reachable = new Set();',
            '    for (let left = 0; left + 2 <= len; left++) {',
            '      reachable.add(g[left] ^ g[len - left - 2]);',
            '    }',
            '    let mex = 0;',
            '    while (reachable.has(mex)) mex++;',
            '    g[len] = mex;',
            '  }',
            '',
            '  let total = 0;',
            '  for (const r of runs) total ^= g[r];',
            '  return total !== 0;',
            '}',
          ],
        },
      },

      run([state]: [string], c) {
        const runs: number[] = []
        let run = 0
        let longest = 0
        for (const ch of state + '-') {
          c.ops++
          if (ch === '+') {
            run++
            continue
          }
          if (run >= 2) runs.push(run)
          longest = Math.max(longest, run)
          run = 0
        }
        const g = new Array<number>(longest + 1).fill(0)
        for (let len = 2; len <= longest; len++) {
          const reachable = new Set<number>()
          for (let left = 0; left + 2 <= len; left++) {
            c.ops++
            reachable.add(g[left] ^ g[len - left - 2])
          }
          let mex = 0
          while (reachable.has(mex)) mex++
          g[len] = mex
        }
        let total = 0
        for (const r of runs) total ^= g[r]
        return total !== 0
      },
    },
  ],
}
