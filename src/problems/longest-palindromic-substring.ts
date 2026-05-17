import { text, type Problem, type Tone } from '@/lib/types'

const DEMO: [string] = ['babcbad']

export const longestPalindromicSubstring: Problem = {
  id: 'longest-palindromic-substring',
  title: 'Longest Palindromic Substring',
  group: 'String',
  pattern: 'Expand Around Center',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/longest-palindromic-substring/',
  statement: 'Return the longest palindromic substring of `s`.',
  constraints: ['1 <= s.length <= 1000', 'These tests have a unique answer'],
  signature: { fn: 'longestPalindrome', params: [{ name: 's', type: 'string' }], ret: 'string' },
  tests: [
    { args: ['cbbd'], expect: 'bb' },
    { args: ['racecar'], expect: 'racecar' },
    { args: ['a'], expect: 'a' },
    { args: ['abb'], expect: 'bb' },
    { args: ['forgeeksskeegfor'], expect: 'geeksskeeg' },
  ],
  demo: DEMO,
  scale: (n) => [Array.from({ length: n }, (_, i) => 'abcd'[i % 4]).join('')],
  starter: {
    py: `def longestPalindrome(s):
    # s: str  ->  str
    pass
`,
    js: `function longestPalindrome(s) {
  // s: string  ->  string
}
`,
    cpp: `string longestPalindrome(string s) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'expand',
      label: 'Expand around every center',
      kind: 'optimal',
      time: 'O(n^2)',
      space: 'O(1)',
      blurb:
        'Every palindrome has a center — a character (odd length) or a gap between two (even length). There are only 2n-1 centers, so stand at each one and expand outward while the mirror characters agree. No table, no suffix machinery.',
      code: {
        py: {
          lines: [
            'def longestPalindrome(s):',
            '    best = (0, 0)',
            '    def expand(l, r):',
            '        while l >= 0 and r < len(s) and s[l] == s[r]:',
            '            l -= 1',
            '            r += 1',
            '        return (l + 1, r)',
            '    for i in range(len(s)):',
            '        for span in (expand(i, i), expand(i, i + 1)):',
            '            if span[1] - span[0] > best[1] - best[0]:',
            '                best = span',
            '    return s[best[0]:best[1]]',
          ],
          map: { init: 2, center: 8, grow: 6, best: 11, done: 12 },
        },
        cpp: {
          lines: [
            'string longestPalindrome(string s) {',
            '    int bestL = 0, bestLen = 1;',
            '    auto expand = [&](int l, int r) {',
            '        while (l >= 0 && r < s.size() && s[l] == s[r]) { l--; r++; }',
            '        if (r - l - 1 > bestLen) { bestLen = r - l - 1; bestL = l + 1; }',
            '    };',
            '    for (int i = 0; i < s.size(); ++i) {',
            '        expand(i, i);',
            '        expand(i, i + 1);',
            '    }',
            '    return s.substr(bestL, bestLen);',
            '}',
          ],
          map: { init: 2, center: 8, grow: 4, best: 5, done: 11 },
        },
        js: {
          lines: [
            'function longestPalindrome(s) {',
            '  let bestL = 0;',
            '  let bestLen = 1;',
            '  const expand = (l, r) => {',
            '    while (l >= 0 && r < s.length && s[l] === s[r]) {',
            '      l--;',
            '      r++;',
            '    }',
            '    if (r - l - 1 > bestLen) { bestLen = r - l - 1; bestL = l + 1; }',
            '  };',
            '  for (let i = 0; i < s.length; i++) {',
            '    expand(i, i);',
            '    expand(i, i + 1);',
            '  }',
            '  return s.slice(bestL, bestL + bestLen);',
            '}',
          ],
          map: { init: 3, center: 12, grow: 6, best: 9, done: 16 },
        },
      },

      trace(t, [s]: [string]) {
        const n = s.length
        let bestL = 0
        let bestLen = 1

        const paint = (lo: number, hi: number, tone: Tone, showBest = false) => {
          const tones: Record<number, Tone> = {}
          for (let i = 0; i < n; i++) tones[i] = 'idle'
          for (let i = lo; i <= hi; i++) if (i >= 0 && i < n) tones[i] = tone
          if (showBest) for (let i = bestL; i < bestL + bestLen; i++) tones[i] = 'good'
          return text(s, {
            tones,
            band:
              showBest && bestLen > 1
                ? { from: bestL, to: bestL + bestLen - 1, label: `best "${s.slice(bestL, bestL + bestLen)}"`, accent: 'ok' }
                : null,
            title: 's',
          })
        }

        t.push({
          step: 'init',
          note: `${2 * n - 1} possible centers: each character, and each gap between characters. Expand around each while the two ends mirror.`,
          view: paint(-1, -1, 'idle'),
          vars: [['centers', 2 * n - 1]],
        })

        const expand = (l0: number, r0: number, label: string) => {
          if (t.full) return
          let l = l0
          let r = r0
          let grew = false
          while (l >= 0 && r < n && s[l] === s[r] && !t.full) {
            t.bump()
            grew = true
            l--
            r++
          }
          const from = l + 1
          const to = r - 1
          const len = to - from + 1
          if (len <= 0) return

          if (grew && len >= 2) {
            t.push({
              step: 'grow',
              note: `${label}: mirrors agree out to "${s.slice(from, to + 1)}" (length ${len}), then the expansion hits a mismatch or an edge.`,
              view: paint(from, to, 'active'),
              vars: [
                ['center', label, 'c'],
                ['palindrome', `"${s.slice(from, to + 1)}"`, 'c'],
              ],
            })
          }

          if (len > bestLen) {
            bestLen = len
            bestL = from
            t.push({
              step: 'best',
              note: `"${s.slice(bestL, bestL + bestLen)}" is the longest palindrome found so far (${bestLen}).`,
              view: paint(from, to, 'good', true),
              vars: [['best', `"${s.slice(bestL, bestL + bestLen)}"`, 'ok']],
              badge: { text: `best "${s.slice(bestL, bestL + bestLen)}"`, accent: 'ok' },
            })
          }
        }

        for (let i = 0; i < n && !t.full; i++) {
          t.push({
            step: 'center',
            note: `Center ${i}: try the odd palindrome around '${s[i]}' and the even one around the gap ${i}|${i + 1}.`,
            view: paint(i, i, 'band', true),
            vars: [['center', i, 'b']],
          })
          expand(i, i, `odd center '${s[i]}'`)
          expand(i, i + 1, `even center ${i}|${i + 1}`)
        }

        t.push({
          step: 'done',
          note: `Longest palindromic substring: "${s.slice(bestL, bestL + bestLen)}" (length ${bestLen}). Each of the 2n-1 centers cost at most one expansion — O(n²) total, O(1) space.`,
          view: paint(-1, -1, 'idle', true),
          vars: [['answer', `"${s.slice(bestL, bestL + bestLen)}"`, 'ok']],
          badge: { text: `"${s.slice(bestL, bestL + bestLen)}"`, accent: 'ok' },
        })
      },

      run([s]: [string], c) {
        let bestL = 0
        let bestLen = 1
        const expand = (l: number, r: number) => {
          while (l >= 0 && r < s.length && s[l] === s[r]) {
            c.ops++
            l--
            r++
          }
          if (r - l - 1 > bestLen) {
            bestLen = r - l - 1
            bestL = l + 1
          }
        }
        for (let i = 0; i < s.length; i++) {
          c.ops++
          expand(i, i)
          expand(i, i + 1)
        }
        return s.slice(bestL, bestL + bestLen)
      },
    },
  ],
}
