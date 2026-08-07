import type { Problem } from '@/lib/types'

/**
 * LintCode 745, a Google Code Jam problem. The public LintCode page carries
 * the statement, the `palindromicRanges(l, r)` signature and three examples,
 * which the tests below reproduce; the value bounds are not published beyond
 * "the answer fits in an int", so the large tests stay within that.
 */
export const palindromicRanges: Problem = {
  id: 'palindromic-ranges',
  title: 'Palindromic Ranges',
  group: 'Math',
  pattern: 'Prefix Parity',
  difficulty: 'Medium',
  leetcode: 'https://www.lintcode.com/problem/745/',
  statement:
    'A positive integer is a *palindrome* when its decimal digits, without leading zeros, read the same forwards and backwards: 5, 77, 363, 4884 and 12121 are palindromes. A range of integers `[L1, R1]` with `L1 <= R1` is *interesting* when it contains an even number of palindromes — zero counts as even. Given `l` and `r`, return how many subranges `[L1, R1]` with `l <= L1 <= R1 <= r` are interesting. This is LintCode 745, a Google Code Jam problem.',
  constraints: [
    '1 <= l <= r',
    'The answer fits in a 32-bit signed integer',
    'A range with no palindromes at all is interesting, since zero is even',
  ],
  signature: {
    fn: 'palindromicRanges',
    params: [
      { name: 'l', type: 'int' },
      { name: 'r', type: 'int' },
    ],
    ret: 'int',
  },
  tests: [
    { args: [1, 2], expect: 1, note: 'only [1, 2] holds an even count' },
    { args: [1, 7], expect: 12, note: 'every single digit is a palindrome, so even-length subranges qualify' },
    { args: [87, 88], expect: 1, note: '[87, 87] holds no palindromes at all' },
    { args: [1, 1], expect: 0, note: 'one palindrome is an odd count' },
    { args: [10, 10], expect: 1, note: 'one non-palindrome is a count of zero' },
    { args: [9, 11], expect: 2, note: '9 and 11 are palindromes, 10 is not' },
    { args: [1, 10], expect: 25 },
    { args: [999, 1001], expect: 2, note: '999 and 1001 are palindromes either side of 1000' },
    { args: [100, 200], expect: 2551 },
    { args: [1, 1000], expect: 250000 },
    { args: [1, 10000], expect: 25202050, note: 'a wide range: the pair count needs 64-bit arithmetic on the way' },
  ],
  demo: [1, 7],
  scale: (n) => [1, Math.max(2, n)],
  starter: {
    js: `function palindromicRanges(l, r) {
  // l: number, r: number  ->  number
}
`,
    cpp: `int palindromicRanges(int l, int r) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'count-every-subrange',
      label: 'Count the palindromes in every subrange',
      kind: 'brute',
      time: 'O(n^2 * d)',
      space: 'O(1)',
      blurb:
        'Fix the left end, extend the right end one number at a time, and keep a running count of palindromes as the range grows; every time the count is even, the range qualifies. Each palindrome test reads the digits of one number, so this is quadratic in the width of the range times the digit count — fine for a handful of numbers, hopeless for a million.',
      code: {
        cpp: {
          lines: [
            'int palindromicRanges(int l, int r) {',
            '    auto isPal = [](int x) {',
            '        string s = to_string(x);',
            '        return equal(s.begin(), s.begin() + s.size() / 2, s.rbegin());',
            '    };',
            '    long long total = 0;',
            '    for (int a = l; a <= r; ++a) {',
            '        int count = 0;',
            '        for (int b = a; b <= r; ++b) {',
            '            if (isPal(b)) count++;',
            '            if (count % 2 == 0) total++;',
            '        }',
            '    }',
            '    return (int)total;',
            '}',
          ],
        },
        js: {
          lines: [
            'function palindromicRanges(l, r) {',
            '  const isPal = (x) => {',
            '    const s = String(x);',
            '    return s === [...s].reverse().join("");',
            '  };',
            '  let total = 0;',
            '  for (let a = l; a <= r; a++) {',
            '    let count = 0;',
            '    for (let b = a; b <= r; b++) {',
            '      if (isPal(b)) count++;',
            '      if (count % 2 === 0) total++;',
            '    }',
            '  }',
            '  return total;',
            '}',
          ],
        },
      },
      run([l, r]: [number, number], c) {
        if (r - l > 300) throw new Error('too slow: quadratic in the width of the range')
        const isPal = (x: number) => {
          const s = String(x)
          return s === [...s].reverse().join('')
        }
        let total = 0
        for (let a = l; a <= r; a++) {
          let count = 0
          for (let b = a; b <= r; b++) {
            c.ops++
            if (isPal(b)) count++
            if (count % 2 === 0) total++
          }
        }
        return total
      },
    },
    {
      id: 'prefix-counts',
      label: 'Prefix counts, then check every pair',
      kind: 'better',
      time: 'O(n^2)',
      space: 'O(n)',
      blurb:
        'Test each number for being a palindrome once, and store a running prefix count so that the number of palindromes in any `[a, b]` is one subtraction. The subranges are still enumerated one by one, so the pair loop stays quadratic, but the palindrome test and the recount inside it are gone.',
      code: {
        cpp: {
          lines: [
            'int palindromicRanges(int l, int r) {',
            '    auto isPal = [](int x) {',
            '        string s = to_string(x);',
            '        return equal(s.begin(), s.begin() + s.size() / 2, s.rbegin());',
            '    };',
            '    int n = r - l + 1;',
            '    vector<int> prefix(n + 1, 0);',
            '    for (int i = 0; i < n; ++i) prefix[i + 1] = prefix[i] + (isPal(l + i) ? 1 : 0);',
            '    long long total = 0;',
            '    for (int a = 0; a < n; ++a)',
            '        for (int b = a + 1; b <= n; ++b)',
            '            if ((prefix[b] - prefix[a]) % 2 == 0) total++;',
            '    return (int)total;',
            '}',
          ],
        },
        js: {
          lines: [
            'function palindromicRanges(l, r) {',
            '  const isPal = (x) => {',
            '    const s = String(x);',
            '    return s === [...s].reverse().join("");',
            '  };',
            '  const n = r - l + 1;',
            '  const prefix = [0];',
            '  for (let i = 0; i < n; i++) prefix.push(prefix[i] + (isPal(l + i) ? 1 : 0));',
            '  let total = 0;',
            '  for (let a = 0; a < n; a++)',
            '    for (let b = a + 1; b <= n; b++)',
            '      if ((prefix[b] - prefix[a]) % 2 === 0) total++;',
            '  return total;',
            '}',
          ],
        },
      },
      run([l, r]: [number, number], c) {
        const isPal = (x: number) => {
          const s = String(x)
          return s === [...s].reverse().join('')
        }
        const n = r - l + 1
        const prefix = [0]
        for (let i = 0; i < n; i++) {
          c.ops++
          prefix.push(prefix[i] + (isPal(l + i) ? 1 : 0))
        }
        let total = 0
        for (let a = 0; a < n; a++)
          for (let b = a + 1; b <= n; b++) {
            c.ops++
            if ((prefix[b] - prefix[a]) % 2 === 0) total++
          }
        return total
      },
    },
    {
      id: 'prefix-parity',
      label: 'Pair up prefixes of equal parity',
      kind: 'optimal',
      time: 'O(n * d)',
      space: 'O(1)',
      blurb:
        'The pair loop only ever asked one question: do the two prefix counts have the same parity? So the subranges never need enumerating. Walk the range once, keeping the parity of the palindromes seen so far, and count how many prefixes were even and how many odd — including the empty prefix before `l`. Any two prefixes of the same parity bound an interesting range, so the answer is the number of pairs within each group.',
      code: {
        cpp: {
          lines: [
            'int palindromicRanges(int l, int r) {',
            '    auto isPal = [](int x) {',
            '        string s = to_string(x);',
            '        return equal(s.begin(), s.begin() + s.size() / 2, s.rbegin());',
            '    };',
            '    long long even = 1, odd = 0;',
            '    int parity = 0;',
            '    for (int x = l; x <= r; ++x) {',
            '        if (isPal(x)) parity ^= 1;',
            '        if (parity) odd++; else even++;',
            '    }',
            '    return (int)(even * (even - 1) / 2 + odd * (odd - 1) / 2);',
            '}',
          ],
        },
        js: {
          lines: [
            'function palindromicRanges(l, r) {',
            '  const isPal = (x) => {',
            '    const s = String(x);',
            '    return s === [...s].reverse().join("");',
            '  };',
            '  let even = 1, odd = 0, parity = 0;',
            '  for (let x = l; x <= r; x++) {',
            '    if (isPal(x)) parity ^= 1;',
            '    if (parity) odd++; else even++;',
            '  }',
            '  return (even * (even - 1)) / 2 + (odd * (odd - 1)) / 2;',
            '}',
          ],
        },
      },
      run([l, r]: [number, number], c) {
        const isPal = (x: number) => {
          const s = String(x)
          return s === [...s].reverse().join('')
        }
        let even = 1
        let odd = 0
        let parity = 0
        for (let x = l; x <= r; x++) {
          c.ops++
          if (isPal(x)) parity ^= 1
          if (parity) odd++
          else even++
        }
        return (even * (even - 1)) / 2 + (odd * (odd - 1)) / 2
      },
    },
  ],
}
