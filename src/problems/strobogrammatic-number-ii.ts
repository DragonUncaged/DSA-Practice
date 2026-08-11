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
    {
      args: [4],
      expect: [
        '1001', '1111', '1691', '1881', '1961',
        '6009', '6119', '6699', '6889', '6969',
        '8008', '8118', '8698', '8888', '8968',
        '9006', '9116', '9696', '9886', '9966',
      ],
      note: 'inner pairs may start with zero, the outer pair may not',
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
      id: 'enumerate-and-filter',
      label: 'Enumerate every string over the five digits and keep the rotatable ones',
      kind: 'brute',
      time: 'O(n * 5^n)',
      space: 'O(n)',
      blurb:
        'Only `0`, `1`, `6`, `8` and `9` can appear at all, so generate every `n`-digit string over those five and test each with the Strobogrammatic Number check. It works, but almost everything it generates is thrown away: the two halves of a valid number are not independent, and the enumeration pretends they are.',
      code: {
        cpp: {
          lines: [
            'vector<string> findStrobogrammatic(int n) {',
            "    const string digits = \"01689\";",
            "    unordered_map<char, char> flip{{'0','0'},{'1','1'},{'6','9'},{'8','8'},{'9','6'}};",
            '    vector<string> out;',
            '    string cur;',
            '    function<void()> build = [&]() {',
            '        if ((int)cur.size() == n) {',
            '            for (int l = 0, r = n - 1; l <= r; ++l, --r)',
            '                if (flip[cur[l]] != cur[r]) return;',
            '            out.push_back(cur);',
            '            return;',
            '        }',
            '        for (char d : digits) {',
            "            if (cur.empty() && d == '0' && n > 1) continue;",
            '            cur.push_back(d);',
            '            build();',
            '            cur.pop_back();',
            '        }',
            '    };',
            '    build();',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function findStrobogrammatic(n) {',
            "  const digits = ['0', '1', '6', '8', '9'];",
            "  const flip = { 0: '0', 1: '1', 6: '9', 8: '8', 9: '6' };",
            '  const isStrobo = (s) => {',
            '    for (let l = 0, r = s.length - 1; l <= r; l++, r--) {',
            '      if (flip[s[l]] !== s[r]) return false;',
            '    }',
            '    return true;',
            '  };',
            '',
            '  const out = [];',
            '  const build = (cur) => {',
            '    if (cur.length === n) {',
            '      if (isStrobo(cur)) out.push(cur);',
            '      return;',
            '    }',
            '    for (const d of digits) {',
            "      if (cur.length === 0 && d === '0' && n > 1) continue;",
            '      build(cur + d);',
            '    }',
            '  };',
            "  build('');",
            '  return out;',
            '}',
          ],
        },
      },

      run([n]: [number], c) {
        if (n > 9) throw new Error('too slow')
        const digits = ['0', '1', '6', '8', '9']
        const flip: Record<string, string> = { '0': '0', '1': '1', '6': '9', '8': '8', '9': '6' }
        const isStrobo = (s: string) => {
          for (let l = 0, r = s.length - 1; l <= r; l++, r--) {
            c.ops++
            if (flip[s[l]] !== s[r]) return false
          }
          return true
        }
        const out: string[] = []
        const build = (cur: string) => {
          c.ops++
          if (cur.length === n) {
            if (isStrobo(cur)) out.push(cur)
            return
          }
          for (const d of digits) {
            if (cur.length === 0 && d === '0' && n > 1) continue
            build(cur + d)
          }
        }
        build('')
        return out
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'grow-outward',
      label: 'Grow from the middle outward',
      kind: 'optimal',
      time: 'O(5^(n/2))',
      space: 'O(5^(n/2))',
      blurb:
        'Instead of generating both halves and checking, choose them together. A strobogrammatic number of length `n` is a rotating pair wrapped around one of length `n - 2`: build the middle first — `""` for even lengths, one of `0`, `1`, `8` for odd — then wrap pairs until the length is right, dropping a leading zero only at the outermost layer. Every string built is an answer.',
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
