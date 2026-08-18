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
    { args: ['++++++++'], expect: true, note: 'eight in a row' },
    { args: ['+++-+++++'], expect: true, note: 'runs of 3 and 5: Grundy 1 xor 0' },
    { args: ['++-++-++'], expect: true, note: 'three runs of two: an odd number of identical games' },
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
      id: 'minimax',
      label: 'Try every move and let the opponent reply',
      kind: 'brute',
      time: 'O(n!!)',
      space: 'O(n)',
      blurb:
        'The player to move wins if any move leaves a position where the opponent cannot win — so try each flip and ask the same question about the result. Correct, and the whole game tree gets explored: the branching shrinks by two each ply, giving a double-factorial blow-up.',
      code: {
        cpp: {
          lines: [
            'bool canWin(string currentState) {',
            '    for (int i = 0; i + 1 < (int)currentState.size(); ++i) {',
            "        if (currentState[i] != '+' || currentState[i + 1] != '+') continue;",
            '        string next = currentState;',
            "        next[i] = next[i + 1] = '-';",
            '        if (!canWin(next)) return true;',
            '    }',
            '    return false;',
            '}',
          ],
        },
        js: {
          lines: [
            'function canWin(currentState) {',
            '  const s = currentState;',
            '  for (let i = 0; i + 1 < s.length; i++) {',
            "    if (s[i] !== '+' || s[i + 1] !== '+') continue;",
            "    if (!canWin(s.slice(0, i) + '--' + s.slice(i + 2))) return true;",
            '  }',
            '  return false;',
            '}',
          ],
        },
      },

      run([state]: [string], c) {
        if ((state.match(/\+/g) ?? []).length > 18) throw new Error('too slow')
        const win = (s: string): boolean => {
          for (let i = 0; i + 1 < s.length; i++) {
            c.ops++
            if (s[i] !== '+' || s[i + 1] !== '+') continue
            if (!win(s.slice(0, i) + '--' + s.slice(i + 2))) return true
          }
          return false
        }
        return win(state)
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'memoised-minimax',
      label: 'Memoise the outcome of every position',
      kind: 'better',
      time: 'O(2^n * n)',
      space: 'O(2^n)',
      blurb:
        'Different move orders keep arriving at the same board, and the game tree re-solves it every time. Remember the verdict per position string instead: each of the at most `2^n` boards is settled once, and the search becomes a walk over distinct positions rather than over paths.',
      code: {
        cpp: {
          lines: [
            'bool canWin(string currentState) {',
            '    unordered_map<string, bool> memo;',
            '    function<bool(const string&)> win = [&](const string& s) {',
            '        auto it = memo.find(s);',
            '        if (it != memo.end()) return it->second;',
            '        bool result = false;',
            '        for (int i = 0; i + 1 < (int)s.size() && !result; ++i) {',
            "            if (s[i] != '+' || s[i + 1] != '+') continue;",
            '            string next = s;',
            "            next[i] = next[i + 1] = '-';",
            '            if (!win(next)) result = true;',
            '        }',
            '        return memo[s] = result;',
            '    };',
            '    return win(currentState);',
            '}',
          ],
        },
        js: {
          lines: [
            'function canWin(currentState) {',
            '  const memo = new Map();',
            '  const win = (s) => {',
            '    if (memo.has(s)) return memo.get(s);',
            '    let result = false;',
            '    for (let i = 0; i + 1 < s.length && !result; i++) {',
            "      if (s[i] !== '+' || s[i + 1] !== '+') continue;",
            "      if (!win(s.slice(0, i) + '--' + s.slice(i + 2))) result = true;",
            '    }',
            '    memo.set(s, result);',
            '    return result;',
            '  };',
            '  return win(currentState);',
            '}',
          ],
        },
      },

      run([state]: [string], c) {
        if ((state.match(/\+/g) ?? []).length > 26) throw new Error('too slow')
        const memo = new Map<string, boolean>()
        const win = (s: string): boolean => {
          if (memo.has(s)) return memo.get(s)!
          let result = false
          for (let i = 0; i + 1 < s.length && !result; i++) {
            c.ops++
            if (s[i] !== '+' || s[i + 1] !== '+') continue
            if (!win(s.slice(0, i) + '--' + s.slice(i + 2))) result = true
          }
          memo.set(s, result)
          return result
        }
        return win(state)
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'grundy',
      label: 'Grundy numbers over the runs of plusses',
      kind: 'optimal',
      time: 'O(n^2)',
      space: 'O(n)',
      blurb:
        'Even memoised, the position space is exponential — but the board is really a set of independent runs of plusses, and a flip splits one run into two shorter ones. That makes this a sum of impartial games: compute a Grundy number per run length (the smallest value no move can reach) and XOR the runs together. The player to move wins exactly when that XOR is non-zero, in quadratic time.',
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
