import type { Problem } from '@/lib/types'

export const androidUnlockPatterns: Problem = {
  id: 'android-unlock-patterns',
  title: 'Android Unlock Patterns',
  group: 'Medium',
  pattern: 'Backtracking',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/android-unlock-patterns/',
  statement:
    'An unlock pattern joins distinct dots on a 3 x 3 grid. A segment may only pass over a dot that has already been used — so `1` to `3` needs `2` first, while `2` to `9` is always fine. Given `m` and `n`, return how many valid patterns use between `m` and `n` dots.',
  constraints: ['1 <= m, n <= 9'],
  signature: {
    fn: 'numberOfPatterns',
    params: [
      { name: 'm', type: 'int' },
      { name: 'n', type: 'int' },
    ],
    ret: 'int',
  },
  tests: [
    { args: [1, 1], expect: 9, note: 'every single dot' },
    { args: [1, 2], expect: 65 },
    { args: [2, 2], expect: 56 },
    { args: [3, 3], expect: 320 },
    { args: [9, 9], expect: 140704, note: 'patterns using every dot' },
    { args: [1, 9], expect: 389497, note: 'the whole range' },
    { args: [4, 4], expect: 1624 },
    { args: [5, 5], expect: 7152 },
    { args: [2, 3], expect: 376, note: 'a range: 56 + 320' },
  ],
  demo: [1, 2],
  starter: {
    js: `function numberOfPatterns(m, n) {
  // m: number, n: number  ->  number
}
`,
    cpp: `int numberOfPatterns(int m, int n) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'dfs-every-start',
      label: 'Depth-first search from every dot',
      kind: 'brute',
      time: 'O(9 * 9!)',
      space: 'O(9)',
      blurb:
        'A table says which dot each jump passes over — `0` when a jump is unobstructed. From each of the nine dots, walk every ordering of the remaining dots, skipping a jump whose middle dot is still unused, and count the paths of each allowed length. Correct, and it explores the full tree of orderings nine times over.',
      code: {
        cpp: {
          lines: [
            'int numberOfPatterns(int m, int n) {',
            '    int over[10][10] = {};',
            '    over[1][3] = over[3][1] = 2;',
            '    over[1][7] = over[7][1] = 4;',
            '    over[3][9] = over[9][3] = 6;',
            '    over[7][9] = over[9][7] = 8;',
            '    over[1][9] = over[9][1] = over[2][8] = over[8][2] = 5;',
            '    over[3][7] = over[7][3] = over[4][6] = over[6][4] = 5;',
            '',
            '    bool used[10] = {};',
            '    function<int(int, int)> walk = [&](int dot, int left) {',
            '        if (left == 0) return 1;',
            '        used[dot] = true;',
            '        int total = 0;',
            '        for (int next = 1; next <= 9; ++next) {',
            '            if (used[next]) continue;',
            '            int mid = over[dot][next];',
            '            if (mid && !used[mid]) continue;',
            '            total += walk(next, left - 1);',
            '        }',
            '        used[dot] = false;',
            '        return total;',
            '    };',
            '',
            '    int total = 0;',
            '    for (int len = m; len <= n; ++len)',
            '        for (int start = 1; start <= 9; ++start) total += walk(start, len - 1);',
            '    return total;',
            '}',
          ],
        },
        js: {
          lines: [
            'function numberOfPatterns(m, n) {',
            '  const over = Array.from({ length: 10 }, () => new Array(10).fill(0));',
            '  over[1][3] = over[3][1] = 2;',
            '  over[1][7] = over[7][1] = 4;',
            '  over[3][9] = over[9][3] = 6;',
            '  over[7][9] = over[9][7] = 8;',
            '  over[1][9] = over[9][1] = over[2][8] = over[8][2] = 5;',
            '  over[3][7] = over[7][3] = over[4][6] = over[6][4] = 5;',
            '',
            '  const used = new Array(10).fill(false);',
            '  const walk = (dot, left) => {',
            '    if (left === 0) return 1;',
            '    used[dot] = true;',
            '    let total = 0;',
            '    for (let next = 1; next <= 9; next++) {',
            '      if (used[next]) continue;',
            '      const mid = over[dot][next];',
            '      if (mid && !used[mid]) continue;',
            '      total += walk(next, left - 1);',
            '    }',
            '    used[dot] = false;',
            '    return total;',
            '  };',
            '',
            '  let total = 0;',
            '  for (let len = m; len <= n; len++) {',
            '    for (let start = 1; start <= 9; start++) total += walk(start, len - 1);',
            '  }',
            '  return total;',
            '}',
          ],
        },
      },

      run([m, n]: [number, number], c) {
        const over = Array.from({ length: 10 }, () => new Array<number>(10).fill(0))
        over[1][3] = over[3][1] = 2
        over[1][7] = over[7][1] = 4
        over[3][9] = over[9][3] = 6
        over[7][9] = over[9][7] = 8
        over[1][9] = over[9][1] = over[2][8] = over[8][2] = 5
        over[3][7] = over[7][3] = over[4][6] = over[6][4] = 5
        const used = new Array<boolean>(10).fill(false)
        const walk = (dot: number, left: number): number => {
          c.ops++
          if (left === 0) return 1
          used[dot] = true
          let total = 0
          for (let next = 1; next <= 9; next++) {
            if (used[next]) continue
            const mid = over[dot][next]
            if (mid && !used[mid]) continue
            total += walk(next, left - 1)
          }
          used[dot] = false
          return total
        }
        let total = 0
        for (let len = m; len <= n; len++) {
          for (let start = 1; start <= 9; start++) total += walk(start, len - 1)
        }
        return total
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'symmetry-dfs',
      label: 'Depth-first search from one dot of each kind',
      kind: 'better',
      time: 'O(3 * 9!)',
      space: 'O(9)',
      blurb:
        'Nine starts are three too many. The grid is symmetric under rotation and reflection, so every corner behaves like dot 1, every edge like dot 2, and the centre stands alone: search from those three only and scale the corner and edge counts by four. The same depth-first walk, a third of the work.',
      code: {
        cpp: {
          lines: [
            'int numberOfPatterns(int m, int n) {',
            '    int over[10][10] = {};',
            '    over[1][3] = over[3][1] = 2;',
            '    over[1][7] = over[7][1] = 4;',
            '    over[3][9] = over[9][3] = 6;',
            '    over[7][9] = over[9][7] = 8;',
            '    over[1][9] = over[9][1] = over[2][8] = over[8][2] = 5;',
            '    over[3][7] = over[7][3] = over[4][6] = over[6][4] = 5;',
            '',
            '    vector<bool> used(10, false);',
            '    function<int(int, int)> walk = [&](int dot, int left) {',
            '        if (left == 0) return 1;',
            '        used[dot] = true;',
            '        int total = 0;',
            '        for (int next = 1; next <= 9; ++next) {',
            '            if (used[next]) continue;',
            '            int mid = over[dot][next];',
            '            if (mid && !used[mid]) continue;',
            '            total += walk(next, left - 1);',
            '        }',
            '        used[dot] = false;',
            '        return total;',
            '    };',
            '',
            '    int total = 0;',
            '    for (int len = m; len <= n; ++len) {',
            '        total += walk(1, len - 1) * 4;  // corners',
            '        total += walk(2, len - 1) * 4;  // edges',
            '        total += walk(5, len - 1);      // centre',
            '    }',
            '    return total;',
            '}',
          ],
        },
        js: {
          lines: [
            'function numberOfPatterns(m, n) {',
            '  const over = Array.from({ length: 10 }, () => new Array(10).fill(0));',
            '  over[1][3] = over[3][1] = 2;',
            '  over[1][7] = over[7][1] = 4;',
            '  over[3][9] = over[9][3] = 6;',
            '  over[7][9] = over[9][7] = 8;',
            '  over[1][9] = over[9][1] = over[2][8] = over[8][2] = 5;',
            '  over[3][7] = over[7][3] = over[4][6] = over[6][4] = 5;',
            '',
            '  const used = new Array(10).fill(false);',
            '  const walk = (dot, left) => {',
            '    if (left === 0) return 1;',
            '    used[dot] = true;',
            '    let total = 0;',
            '    for (let next = 1; next <= 9; next++) {',
            '      if (used[next]) continue;',
            '      const mid = over[dot][next];',
            '      if (mid && !used[mid]) continue;',
            '      total += walk(next, left - 1);',
            '    }',
            '    used[dot] = false;',
            '    return total;',
            '  };',
            '',
            '  let total = 0;',
            '  for (let len = m; len <= n; len++) {',
            '    total += walk(1, len - 1) * 4; // corners',
            '    total += walk(2, len - 1) * 4; // edges',
            '    total += walk(5, len - 1); // centre',
            '  }',
            '  return total;',
            '}',
          ],
        },
      },

      run([m, n]: [number, number], c) {
        const over = Array.from({ length: 10 }, () => new Array<number>(10).fill(0))
        over[1][3] = over[3][1] = 2
        over[1][7] = over[7][1] = 4
        over[3][9] = over[9][3] = 6
        over[7][9] = over[9][7] = 8
        over[1][9] = over[9][1] = over[2][8] = over[8][2] = 5
        over[3][7] = over[7][3] = over[4][6] = over[6][4] = 5

        const used = new Array<boolean>(10).fill(false)
        const walk = (dot: number, left: number): number => {
          c.ops++
          if (left === 0) return 1
          used[dot] = true
          let total = 0
          for (let next = 1; next <= 9; next++) {
            if (used[next]) continue
            const mid = over[dot][next]
            if (mid && !used[mid]) continue
            total += walk(next, left - 1)
          }
          used[dot] = false
          return total
        }

        let total = 0
        for (let len = m; len <= n; len++) {
          total += walk(1, len - 1) * 4
          total += walk(2, len - 1) * 4
          total += walk(5, len - 1)
        }
        return total
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'bitmask-dp',
      label: 'Dynamic programming over the set of used dots',
      kind: 'optimal',
      time: 'O(2^9 * 9^2)',
      space: 'O(2^9 * 9)',
      blurb:
        'The search re-walks the same situation many times: which dots are used and where the finger is. That is only `2^9 * 9` states, so count paths into each state instead of enumerating them. `dp[mask][last]` is the number of patterns that have used exactly `mask` and ended on `last`; extend every state to each unused dot whose jump is clear, and sum the states whose size lies in `[m, n]`. About forty thousand transitions, however many patterns there are.',
      code: {
        cpp: {
          lines: [
            'int numberOfPatterns(int m, int n) {',
            '    // zero-based dots; a corner is never a middle dot, so 0 means unobstructed',
            '    int over[9][9] = {};',
            '    over[0][2] = over[2][0] = 1;',
            '    over[0][6] = over[6][0] = 3;',
            '    over[2][8] = over[8][2] = 5;',
            '    over[6][8] = over[8][6] = 7;',
            '    over[0][8] = over[8][0] = over[1][7] = over[7][1] = 4;',
            '    over[2][6] = over[6][2] = over[3][5] = over[5][3] = 4;',
            '',
            '    vector<array<int, 9>> dp(1 << 9);',
            '    for (auto& row : dp) row.fill(0);',
            '    for (int d = 0; d < 9; ++d) dp[1 << d][d] = 1;',
            '    int total = 0;',
            '    for (int mask = 1; mask < (1 << 9); ++mask) {',
            '        int bits = __builtin_popcount(mask);',
            '        for (int last = 0; last < 9; ++last) {',
            '            int ways = dp[mask][last];',
            '            if (!ways) continue;',
            '            if (bits >= m && bits <= n) total += ways;',
            '            if (bits == n) continue;',
            '            for (int next = 0; next < 9; ++next) {',
            '                if (mask & (1 << next)) continue;',
            '                int mid = over[last][next];',
            '                if (mid && !(mask & (1 << mid))) continue;',
            '                dp[mask | (1 << next)][next] += ways;',
            '            }',
            '        }',
            '    }',
            '    return total;',
            '}',
          ],
        },
        js: {
          lines: [
            'function numberOfPatterns(m, n) {',
            '  // zero-based dots; -1 means the jump has no middle dot',
            '  const over = Array.from({ length: 9 }, () => new Array(9).fill(-1));',
            '  over[0][2] = over[2][0] = 1;',
            '  over[0][6] = over[6][0] = 3;',
            '  over[2][8] = over[8][2] = 5;',
            '  over[6][8] = over[8][6] = 7;',
            '  over[0][8] = over[8][0] = over[1][7] = over[7][1] = 4;',
            '  over[2][6] = over[6][2] = over[3][5] = over[5][3] = 4;',
            '',
            '  const dp = Array.from({ length: 1 << 9 }, () => new Array(9).fill(0));',
            '  for (let d = 0; d < 9; d++) dp[1 << d][d] = 1;',
            '  const popcount = (x) => { let b = 0; for (; x; x &= x - 1) b++; return b; };',
            '',
            '  let total = 0;',
            '  for (let mask = 1; mask < 1 << 9; mask++) {',
            '    const bits = popcount(mask);',
            '    for (let last = 0; last < 9; last++) {',
            '      const ways = dp[mask][last];',
            '      if (!ways) continue;',
            '      if (bits >= m && bits <= n) total += ways;',
            '      if (bits === n) continue;',
            '      for (let next = 0; next < 9; next++) {',
            '        if (mask & (1 << next)) continue;',
            '        const mid = over[last][next];',
            '        if (mid >= 0 && !(mask & (1 << mid))) continue;',
            '        dp[mask | (1 << next)][next] += ways;',
            '      }',
            '    }',
            '  }',
            '  return total;',
            '}',
          ],
        },
      },

      run([m, n]: [number, number], c) {
        const over = Array.from({ length: 9 }, () => new Array<number>(9).fill(-1))
        over[0][2] = over[2][0] = 1
        over[0][6] = over[6][0] = 3
        over[2][8] = over[8][2] = 5
        over[6][8] = over[8][6] = 7
        over[0][8] = over[8][0] = over[1][7] = over[7][1] = 4
        over[2][6] = over[6][2] = over[3][5] = over[5][3] = 4
        const dp = Array.from({ length: 1 << 9 }, () => new Array<number>(9).fill(0))
        for (let d = 0; d < 9; d++) dp[1 << d][d] = 1
        const popcount = (x: number) => {
          let b = 0
          for (; x; x &= x - 1) b++
          return b
        }
        let total = 0
        for (let mask = 1; mask < 1 << 9; mask++) {
          const bits = popcount(mask)
          for (let last = 0; last < 9; last++) {
            const ways = dp[mask][last]
            if (!ways) continue
            if (bits >= m && bits <= n) total += ways
            if (bits === n) continue
            for (let next = 0; next < 9; next++) {
              c.ops++
              if (mask & (1 << next)) continue
              const mid = over[last][next]
              if (mid >= 0 && !(mask & (1 << mid))) continue
              dp[mask | (1 << next)][next] += ways
            }
          }
        }
        return total
      },
    },
  ],
}
