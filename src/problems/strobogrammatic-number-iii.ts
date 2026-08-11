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
    { args: ['69', '69'], expect: 1, note: 'a range of one strobogrammatic number' },
    { args: ['1000', '1000000000'], expect: 2480, note: 'every length from 4 to 9: 20 + 60 + 100 + 300 + 500 + 1500' },
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
      id: 'walk-integers',
      label: 'Test every integer between the bounds',
      kind: 'brute',
      time: 'O((high - low) * L)',
      space: 'O(L)',
      blurb:
        'Count up from `low` to `high` and run the Strobogrammatic Number check on each value. Obviously correct, and obviously doomed: the bounds can be fifteen digits apart while the numbers that pass are vanishingly rare.',
      code: {
        cpp: {
          lines: [
            'int strobogrammaticInRange(string low, string high) {',
            "    unordered_map<char, char> flip{{'0','0'},{'1','1'},{'6','9'},{'8','8'},{'9','6'}};",
            '    auto isStrobo = [&](const string& s) {',
            '        for (int l = 0, r = s.size() - 1; l <= r; ++l, --r)',
            '            if (!flip.count(s[l]) || flip[s[l]] != s[r]) return false;',
            '        return true;',
            '    };',
            '    int total = 0;',
            '    for (long long x = stoll(low); x <= stoll(high); ++x)',
            '        if (isStrobo(to_string(x))) ++total;',
            '    return total;',
            '}',
          ],
        },
        js: {
          lines: [
            'function strobogrammaticInRange(low, high) {',
            "  const flip = { 0: '0', 1: '1', 6: '9', 8: '8', 9: '6' };",
            '  const isStrobo = (s) => {',
            '    for (let l = 0, r = s.length - 1; l <= r; l++, r--) {',
            '      if (flip[s[l]] !== s[r]) return false;',
            '    }',
            '    return true;',
            '  };',
            '  let total = 0;',
            '  for (let x = Number(low); x <= Number(high); x++) {',
            '    if (isStrobo(String(x))) total++;',
            '  }',
            '  return total;',
            '}',
          ],
        },
      },

      run([low, high]: [string, string], c) {
        if (Number(high) - Number(low) > 2_000_000) throw new Error('too slow')
        const flip: Record<string, string> = { '0': '0', '1': '1', '6': '9', '8': '8', '9': '6' }
        const isStrobo = (s: string) => {
          for (let l = 0, r = s.length - 1; l <= r; l++, r--) {
            c.ops++
            if (flip[s[l]] !== s[r]) return false
          }
          return true
        }
        let total = 0
        for (let x = Number(low); x <= Number(high); x++) {
          c.ops++
          if (isStrobo(String(x))) total++
        }
        return total
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'generate-by-length',
      label: 'Generate each length, then count what lands in range',
      kind: 'better',
      time: 'O(5^(L/2))',
      space: 'O(L)',
      blurb:
        'Only the lengths between `low` and `high` can contribute, and for each length the strobogrammatic numbers are built by filling a rotating pair at both ends and recursing inward — the Strobogrammatic Number II construction, so nothing generated is wasted. Because neither bound has a leading zero, comparing two candidates is length first, then lexicographic.',
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
    // -----------------------------------------------------------------------
    {
      id: 'count-by-digit',
      label: 'Count below each bound digit by digit, without generating',
      kind: 'optimal',
      time: 'O(L^2)',
      space: 'O(L)',
      blurb:
        'Generating still touches every valid number, and there are millions of them at fifteen digits. Count instead. Every length shorter than the bound contributes a closed-form total, and for the bound\'s own length the outer pair decides most of it: a pair smaller than the bound\'s digit frees every inner position, a larger one is out, and only an equal pair needs to look deeper. The answer is `count(high) - count(low)`, plus one if `low` itself rotates.',
      code: {
        cpp: {
          lines: [
            'int strobogrammaticInRange(string low, string high) {',
            "    const vector<pair<char, char>> pairs{{'0','0'},{'1','1'},{'6','9'},{'8','8'},{'9','6'}};",
            '    auto isStrobo = [&](const string& s) {',
            '        for (int l = 0, r = s.size() - 1; l <= r; ++l, --r) {',
            '            bool ok = false;',
            '            for (auto [a, b] : pairs) if (s[l] == a && s[r] == b) ok = true;',
            '            if (!ok) return false;',
            '        }',
            '        return true;',
            '    };',
            '    // every strobogrammatic string of exactly this length, no leading zero',
            '    auto ofLength = [](int len) {',
            '        if (len == 1) return 3LL;',
            '        long long count = 4;',
            '        for (int k = 2; k <= len / 2; ++k) count *= 5;',
            '        return len % 2 ? count * 3 : count;',
            '    };',
            '    // ways to fill positions l..r once everything outside them is fixed',
            '    auto fillFree = [](int l, int r) {',
            '        long long count = 1;',
            '        for (; l < r; ++l, --r) count *= 5;',
            '        return l == r ? count * 3 : count;',
            '    };',
            '    // strobogrammatic numbers in [0, bound]',
            '    auto upTo = [&](const string& bound) {',
            '        int L = bound.size();',
            '        long long total = 0;',
            '        for (int len = 1; len < L; ++len) total += ofLength(len);',
            '        string buf(L, \' \');',
            '        function<void(int, int)> walk = [&](int l, int r) {',
            '            if (l > r) { if (buf <= bound) ++total; return; }',
            '            for (auto [a, b] : pairs) {',
            "                if (l == 0 && a == '0' && L > 1) continue;",
            '                if (l == r && a != b) continue;',
            '                if (a < bound[l]) total += fillFree(l + 1, r - 1);',
            '                else if (a == bound[l]) { buf[l] = a; buf[r] = b; walk(l + 1, r - 1); }',
            '            }',
            '        };',
            '        walk(0, L - 1);',
            '        return total;',
            '    };',
            '    return (int)(upTo(high) - upTo(low) + (isStrobo(low) ? 1 : 0));',
            '}',
          ],
        },
        js: {
          lines: [
            'function strobogrammaticInRange(low, high) {',
            "  const pairs = [['0','0'], ['1','1'], ['6','9'], ['8','8'], ['9','6']];",
            "  const flip = { 0: '0', 1: '1', 6: '9', 8: '8', 9: '6' };",
            '  const isStrobo = (s) => {',
            '    for (let l = 0, r = s.length - 1; l <= r; l++, r--) {',
            '      if (flip[s[l]] !== s[r]) return false;',
            '    }',
            '    return true;',
            '  };',
            '  // every strobogrammatic string of exactly this length, no leading zero',
            '  const ofLength = (len) => {',
            '    if (len === 1) return 3;',
            '    let count = 4;',
            '    for (let k = 2; k <= Math.floor(len / 2); k++) count *= 5;',
            '    return len % 2 ? count * 3 : count;',
            '  };',
            '  // ways to fill positions l..r once everything outside them is fixed',
            '  const fillFree = (l, r) => {',
            '    let count = 1;',
            '    for (; l < r; l++, r--) count *= 5;',
            '    return l === r ? count * 3 : count;',
            '  };',
            '  // strobogrammatic numbers in [0, bound]',
            '  const upTo = (bound) => {',
            '    const L = bound.length;',
            '    let total = 0;',
            '    for (let len = 1; len < L; len++) total += ofLength(len);',
            '    const buf = new Array(L);',
            '    const walk = (l, r) => {',
            "      if (l > r) { if (buf.join('') <= bound) total++; return; }",
            '      for (const [a, b] of pairs) {',
            "        if (l === 0 && a === '0' && L > 1) continue;",
            '        if (l === r && a !== b) continue;',
            '        if (a < bound[l]) total += fillFree(l + 1, r - 1);',
            '        else if (a === bound[l]) { buf[l] = a; buf[r] = b; walk(l + 1, r - 1); }',
            '      }',
            '    };',
            '    walk(0, L - 1);',
            '    return total;',
            '  };',
            '  return upTo(high) - upTo(low) + (isStrobo(low) ? 1 : 0);',
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
        const flip: Record<string, string> = { '0': '0', '1': '1', '6': '9', '8': '8', '9': '6' }
        const isStrobo = (s: string) => {
          for (let l = 0, r = s.length - 1; l <= r; l++, r--) {
            c.ops++
            if (flip[s[l]] !== s[r]) return false
          }
          return true
        }
        const ofLength = (len: number) => {
          if (len === 1) return 3
          let count = 4
          for (let k = 2; k <= Math.floor(len / 2); k++) count *= 5
          return len % 2 ? count * 3 : count
        }
        const fillFree = (l: number, r: number) => {
          let count = 1
          for (; l < r; l++, r--) count *= 5
          return l === r ? count * 3 : count
        }
        const upTo = (bound: string) => {
          const L = bound.length
          let total = 0
          for (let len = 1; len < L; len++) total += ofLength(len)
          const buf: string[] = new Array(L)
          const walk = (l: number, r: number) => {
            c.ops++
            if (l > r) {
              if (buf.join('') <= bound) total++
              return
            }
            for (const [a, b] of pairs) {
              c.ops++
              if (l === 0 && a === '0' && L > 1) continue
              if (l === r && a !== b) continue
              if (a < bound[l]) total += fillFree(l + 1, r - 1)
              else if (a === bound[l]) {
                buf[l] = a
                buf[r] = b
                walk(l + 1, r - 1)
              }
            }
          }
          walk(0, L - 1)
          return total
        }
        return upTo(high) - upTo(low) + (isStrobo(low) ? 1 : 0)
      },
    },
  ],
}
