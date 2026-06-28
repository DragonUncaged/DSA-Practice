import type { Problem } from '@/lib/types'

export const strobogrammaticNumberIII: Problem = {
  id: 'strobogrammatic-number-iii',
  title: 'Strobogrammatic Number III',
  group: 'Hard',
  pattern: 'Backtracking',
  difficulty: 'Hard',
  leetcode: 'https://leetcode.com/problems/strobogrammatic-number-iii/',
  statement:
    'Given two numbers `low` and `high` given as strings, return how many strobogrammatic numbers lie in the inclusive range `[low, high]`. The bounds can be far apart, so the numbers have to be generated rather than tested one by one.',
  constraints: [
    '1 <= low.length, high.length <= 15',
    'low and high consist of digits only',
    'low <= high',
    'Neither has leading zeros, except for "0" itself',
  ],
  signature: {
    fn: 'strobogrammaticInRange',
    params: [
      { name: 'low', type: 'string' },
      { name: 'high', type: 'string' },
    ],
    ret: 'int',
  },
  tests: [
    { args: ['50', '100'], expect: 3, note: '69, 88, 96' },
    { args: ['0', '0'], expect: 1, note: 'zero itself' },
    { args: ['0', '9'], expect: 3, note: 'the one-digit ones' },
    { args: ['1', '1000'], expect: 18 },
    { args: ['2', '5'], expect: 0, note: 'no strobogrammatic number in the gap' },
    { args: ['100', '99999'], expect: 92, note: '12 of length 3, 20 of length 4, 60 of length 5' },
  ],
  demo: ['50', '100'],
  starter: {
    js: `function strobogrammaticInRange(low, high) {
  // low: string, high: string  ->  number
}
`,
    cpp: `int strobogrammaticInRange(string low, string high) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'generate-by-length',
      label: 'Generate each length, then count what lands in range',
      kind: 'optimal',
      time: 'O(5^(L/2))',
      space: 'O(L)',
      blurb:
        'Only the lengths between `low` and `high` can contribute, and for each length the strobogrammatic numbers are built by filling a rotating pair at both ends and recursing inward. Because neither bound has a leading zero, comparing two candidates is length first, then lexicographic.',
      code: {
        cpp: {
          lines: [
            'static bool le(const string& a, const string& b) {',
            '    return a.size() != b.size() ? a.size() < b.size() : a <= b;',
            '}',
            '',
            'int strobogrammaticInRange(string low, string high) {',
            "    const vector<pair<char, char>> pairs{{'0','0'},{'1','1'},{'6','9'},{'8','8'},{'9','6'}};",
            '    int total = 0;',
            '',
            '    for (int len = low.size(); len <= (int)high.size(); ++len) {',
            '        string buf(len, 0);',
            '        function<void(int, int)> fill = [&](int l, int r) {',
            '            if (l > r) {',
            '                if (le(low, buf) && le(buf, high)) ++total;',
            '                return;',
            '            }',
            '            for (auto [a, b] : pairs) {',
            "                if (l == 0 && a == '0' && len > 1) continue;",
            '                if (l == r && a != b) continue;',
            '                buf[l] = a;',
            '                buf[r] = b;',
            '                fill(l + 1, r - 1);',
            '            }',
            '        };',
            '        fill(0, len - 1);',
            '    }',
            '    return total;',
            '}',
          ],
        },
        js: {
          lines: [
            'function strobogrammaticInRange(low, high) {',
            "  const pairs = [['0','0'], ['1','1'], ['6','9'], ['8','8'], ['9','6']];",
            '  const le = (a, b) => (a.length !== b.length ? a.length < b.length : a <= b);',
            '  let total = 0;',
            '',
            '  for (let len = low.length; len <= high.length; len++) {',
            '    const buf = new Array(len);',
            '    const fill = (l, r) => {',
            '      if (l > r) {',
            "        const s = buf.join('');",
            '        if (le(low, s) && le(s, high)) total++;',
            '        return;',
            '      }',
            '      for (const [a, b] of pairs) {',
            "        if (l === 0 && a === '0' && len > 1) continue;",
            '        if (l === r && a !== b) continue;',
            '        buf[l] = a;',
            '        buf[r] = b;',
            '        fill(l + 1, r - 1);',
            '      }',
            '    };',
            '    fill(0, len - 1);',
            '  }',
            '  return total;',
            '}',
          ],
        },
      },

      run([low, high]: [string, string], c) {
        const pairs = [
          ['0', '0'],
          ['1', '1'],
          ['6', '9'],
          ['8', '8'],
          ['9', '6'],
        ]
        const le = (a: string, b: string) => (a.length !== b.length ? a.length < b.length : a <= b)
        let total = 0
        for (let len = low.length; len <= high.length; len++) {
          const buf: string[] = new Array(len)
          const fill = (l: number, r: number) => {
            c.ops++
            if (l > r) {
              const s = buf.join('')
              if (le(low, s) && le(s, high)) total++
              return
            }
            for (const [a, b] of pairs) {
              if (l === 0 && a === '0' && len > 1) continue
              if (l === r && a !== b) continue
              buf[l] = a
              buf[r] = b
              fill(l + 1, r - 1)
            }
          }
          fill(0, len - 1)
        }
        return total
      },
    },
  ],
}
