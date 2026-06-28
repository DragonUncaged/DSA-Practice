import type { Problem } from '@/lib/types'

export const strobogrammaticNumberII: Problem = {
  id: 'strobogrammatic-number-ii',
  title: 'Strobogrammatic Number II',
  group: 'Medium',
  pattern: 'Backtracking',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/strobogrammatic-number-ii/',
  statement:
    'Given an integer `n`, return every strobogrammatic number of length `n` — every number that reads the same rotated 180 degrees. The answer may come back in any order.',
  constraints: ['1 <= n <= 14'],
  signature: { fn: 'findStrobogrammatic', params: [{ name: 'n', type: 'int' }], ret: 'string[]' },
  compare: 'sorted',
  tests: [
    { args: [1], expect: ['0', '1', '8'], note: 'the digits that rotate to themselves' },
    { args: [2], expect: ['11', '69', '88', '96'], note: 'no leading zero' },
    {
      args: [3],
      expect: [
        '101',
        '609',
        '808',
        '906',
        '111',
        '619',
        '818',
        '916',
        '181',
        '689',
        '888',
        '986',
      ],
      note: 'odd length keeps a self-rotating digit in the middle',
    },
  ],
  demo: [2],
  starter: {
    js: `function findStrobogrammatic(n) {
  // n: number  ->  string[]
}
`,
    cpp: `vector<string> findStrobogrammatic(int n) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'grow-outward',
      label: 'Grow from the middle outward',
      kind: 'optimal',
      time: 'O(5^(n/2))',
      space: 'O(5^(n/2))',
      blurb:
        'A strobogrammatic number of length `n` is a rotating pair wrapped around one of length `n - 2`. Build the middle first — `""` for even lengths, one of `0`, `1`, `8` for odd — then wrap pairs until the length is right, dropping a leading zero only at the outermost layer.',
      code: {
        cpp: {
          lines: [
            'vector<string> build(int m, int n) {',
            '    if (m == 0) return {""};',
            '    if (m == 1) return {"0", "1", "8"};',
            '',
            '    vector<string> inner = build(m - 2, n), out;',
            '    for (const string& s : inner) {',
            '        if (m != n) out.push_back("0" + s + "0");',
            '        out.push_back("1" + s + "1");',
            '        out.push_back("6" + s + "9");',
            '        out.push_back("8" + s + "8");',
            '        out.push_back("9" + s + "6");',
            '    }',
            '    return out;',
            '}',
            '',
            'vector<string> findStrobogrammatic(int n) {',
            '    return build(n, n);',
            '}',
          ],
        },
        js: {
          lines: [
            'function findStrobogrammatic(n) {',
            '  const build = (m) => {',
            "    if (m === 0) return [''];",
            "    if (m === 1) return ['0', '1', '8'];",
            '',
            '    const out = [];',
            '    for (const s of build(m - 2)) {',
            "      if (m !== n) out.push('0' + s + '0');",
            "      out.push('1' + s + '1');",
            "      out.push('6' + s + '9');",
            "      out.push('8' + s + '8');",
            "      out.push('9' + s + '6');",
            '    }',
            '    return out;',
            '  };',
            '',
            '  return build(n);',
            '}',
          ],
        },
      },

      run([n]: [number], c) {
        const build = (m: number): string[] => {
          c.ops++
          if (m === 0) return ['']
          if (m === 1) return ['0', '1', '8']
          const out: string[] = []
          for (const s of build(m - 2)) {
            c.ops++
            if (m !== n) out.push('0' + s + '0')
            out.push('1' + s + '1', '6' + s + '9', '8' + s + '8', '9' + s + '6')
          }
          return out
        }
        return build(n)
      },
    },
  ],
}
