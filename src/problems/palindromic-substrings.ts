import { text, type Problem, type Tone } from '@/lib/types'

const DEMO: [string] = ['aabaa']

export const palindromicSubstrings: Problem = {
  id: 'palindromic-substrings',
  title: 'Palindromic Substrings',
  group: 'String',
  pattern: 'Expand Around Center',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/palindromic-substrings/',
  statement: 'Return the number of palindromic substrings in `s`. Substrings at different positions count separately.',
  constraints: ['1 <= s.length <= 1000', 'Lowercase English letters'],
  signature: { fn: 'countSubstrings', params: [{ name: 's', type: 'string' }], ret: 'int' },
  tests: [
    { args: ['abc'], expect: 3, note: 'three single letters' },
    { args: ['aaa'], expect: 6 },
    { args: ['aabaa'], expect: 9 },
    { args: ['x'], expect: 1 },
  ],
  demo: DEMO,
  scale: (n) => [Array.from({ length: n }, (_, i) => 'abcd'[i % 4]).join('')],
  starter: {
    py: `def countSubstrings(s):
    # s: str  ->  int
    pass
`,
    js: `function countSubstrings(s) {
  // s: string  ->  number
}
`,
    cpp: `int countSubstrings(string s) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'expand',
      label: 'Count while expanding',
      kind: 'optimal',
      time: 'O(n^2)',
      space: 'O(1)',
      blurb:
        'Same 2n-1 centers as Longest Palindromic Substring, but instead of tracking the widest reach, count one palindrome per successful expansion step — every ring of agreement around a center is itself a palindrome.',
      code: {
        py: {
          lines: [
            'def countSubstrings(s):',
            '    n = len(s)',
            '    count = 0',
            '    for center in range(2 * n - 1):',
            '        l = center // 2',
            '        r = l + center % 2',
            '        while l >= 0 and r < n and s[l] == s[r]:',
            '            count += 1',
            '            l -= 1',
            '            r += 1',
            '    return count',
          ],
          map: { init: 3, center: 6, ring: 8, done: 11 },
        },
        cpp: {
          lines: [
            'int countSubstrings(string s) {',
            '    int n = s.size(), count = 0;',
            '    for (int center = 0; center < 2 * n - 1; ++center) {',
            '        int l = center / 2, r = l + center % 2;',
            '        while (l >= 0 && r < n && s[l] == s[r]) {',
            '            count++;',
            '            l--; r++;',
            '        }',
            '    }',
            '    return count;',
            '}',
          ],
          map: { init: 2, center: 4, ring: 6, done: 10 },
        },
        js: {
          lines: [
            'function countSubstrings(s) {',
            '  const n = s.length;',
            '  let count = 0;',
            '  for (let center = 0; center < 2 * n - 1; center++) {',
            '    let l = center >> 1;',
            '    let r = l + (center % 2);',
            '    while (l >= 0 && r < n && s[l] === s[r]) {',
            '      count++;',
            '      l--;',
            '      r++;',
            '    }',
            '  }',
            '  return count;',
            '}',
          ],
          map: { init: 3, center: 6, ring: 8, done: 14 },
        },
      },

      trace(t, [s]: [string]) {
        const n = s.length
        let count = 0

        const paint = (lo: number, hi: number, tone: Tone) => {
          const tones: Record<number, Tone> = {}
          for (let i = 0; i < n; i++) tones[i] = 'idle'
          for (let i = lo; i <= hi; i++) if (i >= 0 && i < n) tones[i] = tone
          return text(s, { tones, title: 's' })
        }

        t.push({
          step: 'init',
          note: `${2 * n - 1} centers to try. Each ring of matching characters around a center is one more palindrome for the tally.`,
          view: paint(-1, -1, 'idle'),
          vars: [['count', 0]],
        })

        for (let center = 0; center < 2 * n - 1 && !t.full; center++) {
          let l = center >> 1
          let r = l + (center % 2)
          if (l !== r && s[l] !== s[r]) continue
          const isOdd = l === r

          t.push({
            step: 'center',
            note: isOdd ? `Odd center at '${s[l]}' (index ${l}).` : `Even center at the gap between ${l} and ${r}.`,
            view: paint(l, r, 'band'),
            vars: [
              ['center', isOdd ? `index ${l}` : `${l}|${r}`, 'b'],
              ['count', count],
            ],
          })

          while (l >= 0 && r < n && s[l] === s[r] && !t.full) {
            count++
            t.bump()
            t.push({
              step: 'ring',
              note: `"${s.slice(l, r + 1)}" mirrors perfectly — palindrome #${count}. Push one ring wider.`,
              view: paint(l, r, 'good'),
              vars: [
                ['palindrome', `"${s.slice(l, r + 1)}"`, 'ok'],
                ['count', count, 'ok'],
              ],
              badge: { text: `#${count}: "${s.slice(l, r + 1)}"`, accent: 'ok' },
            })
            l--
            r++
          }
        }

        t.push({
          step: 'done',
          note: `${count} palindromic substrings in "${s}".`,
          view: paint(-1, -1, 'idle'),
          vars: [['answer', count, 'ok']],
          badge: { text: `${count} palindromes`, accent: 'ok' },
        })
      },

      run([s]: [string], c) {
        const n = s.length
        let count = 0
        for (let center = 0; center < 2 * n - 1; center++) {
          let l = center >> 1
          let r = l + (center % 2)
          while (l >= 0 && r < n && s[l] === s[r]) {
            c.ops++
            count++
            l--
            r++
          }
        }
        return count
      },
    },
  ],
}
