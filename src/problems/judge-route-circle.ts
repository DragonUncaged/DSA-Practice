import type { Problem } from '@/lib/types'

export const judgeRouteCircle: Problem = {
  id: 'judge-route-circle',
  title: 'Judge Route Circle',
  group: 'String',
  pattern: 'Running Count',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/robot-return-to-origin/',
  statement:
    'A robot starts at `(0, 0)` and follows a string of `moves`, where `U`, `D`, `L` and `R` shift it one unit up, down, left and right. Return `true` if it ends where it started.',
  constraints: ['0 <= moves.length <= 10^4', 'moves contains only U, D, L and R'],
  signature: { fn: 'judgeCircle', params: [{ name: 'moves', type: 'string' }], ret: 'bool' },
  tests: [
    { args: ['UD'], expect: true },
    { args: ['LL'], expect: false },
    { args: [''], expect: true, note: 'no moves, still at the origin' },
    { args: ['LDRRLRUULR'], expect: false },
    { args: ['RLUURDDDLU'], expect: true },
    { args: ['U'], expect: false, note: 'a single move never returns' },
    { args: ['UDLR'], expect: true, note: 'one of each' },
    { args: ['RRDD'], expect: false },
    { args: ['UUDDLLRR'], expect: true, note: 'the route loops, order does not matter' },
    { args: ['UDLR'.repeat(2500)], expect: true, note: 'the longest route' },
    { args: ['UD'.repeat(4999) + 'U'], expect: false, note: 'balanced except for the last move' },
  ],
  demo: ['UD'],
  scale: (n) => ['UDLR'.repeat(Math.max(1, n >> 2))],
  starter: {
    js: `function judgeCircle(moves) {
  // moves: string  ->  boolean
}
`,
    cpp: `bool judgeCircle(string moves) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'net-displacement',
      label: 'Only the net displacement matters',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'The route itself is irrelevant — moves commute, so the robot ends at the origin exactly when the ups cancel the downs and the lefts cancel the rights. Two counters, one pass. There is no slower rung worth showing: simulating the walk step by step is these same two counters under different names, and every move has to be read once regardless.',
      code: {
        cpp: {
          lines: [
            'bool judgeCircle(string moves) {',
            '    int x = 0, y = 0;',
            '    for (char m : moves) {',
            '        if (m == \'U\') y++;',
            '        else if (m == \'D\') y--;',
            '        else if (m == \'L\') x--;',
            '        else x++;',
            '    }',
            '    return x == 0 && y == 0;',
            '}',
          ],
        },
        js: {
          lines: [
            'function judgeCircle(moves) {',
            '  let x = 0, y = 0;',
            '  for (const m of moves) {',
            '    if (m === "U") y++;',
            '    else if (m === "D") y--;',
            '    else if (m === "L") x--;',
            '    else x++;',
            '  }',
            '  return x === 0 && y === 0;',
            '}',
          ],
        },
      },

      run([moves]: [string], c) {
        let x = 0
        let y = 0
        for (const m of moves) {
          c.ops++
          if (m === 'U') y++
          else if (m === 'D') y--
          else if (m === 'L') x--
          else x++
        }
        return x === 0 && y === 0
      },
    },
  ],
}
