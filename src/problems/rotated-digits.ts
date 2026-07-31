import type { Problem } from '@/lib/types'

export const rotatedDigits: Problem = {
  id: 'rotated-digits',
  title: 'Rotated Digits',
  group: 'Math',
  pattern: 'Digit DP',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/rotated-digits/',
  statement:
    'Rotating a number turns each digit 180 degrees: `0`, `1` and `8` stay themselves, `2` and `5` swap, `6` and `9` swap, and `3`, `4`, `7` become nothing. A number is *good* when every digit survives the rotation **and** the rotated number differs from the original. Return how many numbers in `1..n` are good.',
  constraints: ['1 <= n <= 10^4', 'Every digit must be rotatable', 'The result must differ from the input'],
  signature: { fn: 'rotatedDigits', params: [{ name: 'n', type: 'int' }], ret: 'int' },
  tests: [
    { args: [10], expect: 4, note: '2, 5, 6 and 9' },
    { args: [1], expect: 0, note: '1 rotates to itself' },
    { args: [2], expect: 1 },
    { args: [3], expect: 1, note: '3 has no rotation, so only 2 counts' },
    { args: [20], expect: 9 },
    { args: [25], expect: 12, note: '25 itself is good: it rotates to 52' },
    { args: [100], expect: 40 },
    { args: [1000], expect: 316 },
    { args: [10000], expect: 2320, note: 'the largest n' },
  ],
  demo: [10],
  scale: (n) => [n],
  starter: {
    js: `function rotatedDigits(n) {
  // n: number  ->  number
}
`,
    cpp: `int rotatedDigits(int n) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'rotate-each',
      label: 'Build the rotated number and compare',
      kind: 'brute',
      time: 'O(n log n)',
      space: 'O(log n)',
      blurb:
        'Do literally what the statement says: for each number, rotate its digits one by one into a new string, stop if a digit has no rotation, and count the number when the rotated string differs from the original. It is the definition made executable — every number pays a full rotation and a string comparison, even though only two yes-or-no facts about its digits matter.',
      code: {
        cpp: {
          lines: [
            'int rotatedDigits(int n) {',
            '    const string flip = "015xx29x86";',
            '    int total = 0;',
            '    for (int x = 1; x <= n; ++x) {',
            '        string s = to_string(x), r;',
            '        bool ok = true;',
            '        for (char ch : s) {',
            '            char f = flip[ch - \'0\'];',
            '            if (f == \'x\') { ok = false; break; }',
            '            r += f;',
            '        }',
            '        if (ok && r != s) total++;',
            '    }',
            '    return total;',
            '}',
          ],
        },
        js: {
          lines: [
            'function rotatedDigits(n) {',
            '  const flip = "015xx29x86";',
            '  let total = 0;',
            '  for (let x = 1; x <= n; x++) {',
            '    const s = String(x);',
            '    let r = "", ok = true;',
            '    for (const ch of s) {',
            '      const f = flip[+ch];',
            '      if (f === "x") { ok = false; break; }',
            '      r += f;',
            '    }',
            '    if (ok && r !== s) total++;',
            '  }',
            '  return total;',
            '}',
          ],
        },
      },
      run([n]: [number], c) {
        const flip = '015xx29x86'
        let total = 0
        for (let x = 1; x <= n; x++) {
          const s = String(x)
          let r = ''
          let ok = true
          for (const ch of s) {
            c.ops++
            const f = flip[+ch]
            if (f === 'x') {
              ok = false
              break
            }
            r += f
          }
          if (ok && r !== s) total++
        }
        return total
      },
    },
    {
      id: 'digit-scan',
      label: 'Two flags per number',
      kind: 'better',
      time: 'O(n log n)',
      space: 'O(1)',
      blurb:
        'The rotated string was never needed. Each number needs two independent facts: does it contain a digit that cannot rotate, and does it contain one that changes. Peel the digits off with repeated division and set a flag for each — no string, no comparison. A number counts only when nothing was invalid and at least one digit changed.',
      code: {
        cpp: {
          lines: [
            'int rotatedDigits(int n) {',
            '    int total = 0;',
            '    for (int x = 1; x <= n; ++x) {',
            '        bool valid = true, changed = false;',
            '        for (int v = x; v > 0; v /= 10) {',
            '            int d = v % 10;',
            '            if (d == 3 || d == 4 || d == 7) valid = false;',
            '            if (d == 2 || d == 5 || d == 6 || d == 9) changed = true;',
            '        }',
            '        if (valid && changed) total++;',
            '    }',
            '    return total;',
            '}',
          ],
        },
        js: {
          lines: [
            'function rotatedDigits(n) {',
            '  let total = 0;',
            '  for (let x = 1; x <= n; x++) {',
            '    let valid = true, changed = false;',
            '    for (let v = x; v > 0; v = Math.floor(v / 10)) {',
            '      const d = v % 10;',
            '      if (d === 3 || d === 4 || d === 7) valid = false;',
            '      if (d === 2 || d === 5 || d === 6 || d === 9) changed = true;',
            '    }',
            '    if (valid && changed) total++;',
            '  }',
            '  return total;',
            '}',
          ],
        },
      },

      run([n]: [number], c) {
        let total = 0
        for (let x = 1; x <= n; x++) {
          let valid = true
          let changed = false
          for (let v = x; v > 0; v = Math.floor(v / 10)) {
            c.ops++
            const d = v % 10
            if (d === 3 || d === 4 || d === 7) valid = false
            if (d === 2 || d === 5 || d === 6 || d === 9) changed = true
          }
          if (valid && changed) total++
        }
        return total
      },
    },
    {
      id: 'digit-dp',
      label: 'Count by digit position instead of by number',
      kind: 'optimal',
      time: 'O(log n)',
      space: 'O(1)',
      blurb:
        'Visiting every number up to n is the last waste: the answer only depends on the digits of n. Count the numbers in 1..n whose digits all come from the seven rotatable digits, then subtract those built only from 0, 1 and 8 — the ones that rotate to themselves. Each count walks the digits of n once: at every position, each smaller allowed digit is followed by any allowed suffix, and the walk continues only while the digit of n is itself allowed.',
      code: {
        cpp: {
          lines: [
            'int rotatedDigits(int n) {',
            '    string s = to_string(n);',
            '    auto countAllowed = [&](const string& allowed) {',
            '        long long total = 0;',
            '        int len = s.size();',
            '        for (int i = 0; i < len; ++i) {',
            '            for (char d : allowed)',
            '                if (d < s[i]) total += (long long)pow(allowed.size(), len - i - 1);',
            '            if (allowed.find(s[i]) == string::npos) return total;',
            '        }',
            '        return total + 1;',
            '    };',
            '    return countAllowed("0125689") - countAllowed("018");',
            '}',
          ],
        },
        js: {
          lines: [
            'function rotatedDigits(n) {',
            '  const s = String(n);',
            '  const countAllowed = (allowed) => {',
            '    let total = 0;',
            '    for (let i = 0; i < s.length; i++) {',
            '      for (const d of allowed)',
            '        if (d < s[i]) total += allowed.length ** (s.length - i - 1);',
            '      if (!allowed.includes(s[i])) return total;',
            '    }',
            '    return total + 1;',
            '  };',
            '  return countAllowed("0125689") - countAllowed("018");',
            '}',
          ],
        },
      },
      run([n]: [number], c) {
        const s = String(n)
        const countAllowed = (allowed: string) => {
          let total = 0
          for (let i = 0; i < s.length; i++) {
            for (const d of allowed) {
              c.ops++
              if (d < s[i]) total += allowed.length ** (s.length - i - 1)
            }
            if (!allowed.includes(s[i])) return total
          }
          return total + 1
        }
        return countAllowed('0125689') - countAllowed('018')
      },
    },
  ],
}
