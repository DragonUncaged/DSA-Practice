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
      id: 'symmetry-dfs',
      label: 'Depth-first search from one dot of each kind',
      kind: 'optimal',
      time: 'O(9!)',
      space: 'O(9)',
      blurb:
        'A table says which dot each jump passes over — `0` when a jump is unobstructed. The search then walks every ordering, skipping a jump whose middle dot is still unused. The grid is symmetric, so counting from dot 1, dot 2 and dot 5 and scaling the corners and edges by four covers all nine starts.',
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
  ],
}
