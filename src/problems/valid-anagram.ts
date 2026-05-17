import { combo, mapOf, text, type Problem, type Tone } from '@/lib/types'

const DEMO: [string, string] = ['listen', 'silent']

export const validAnagram: Problem = {
  id: 'valid-anagram',
  title: 'Valid Anagram',
  group: 'String',
  pattern: 'Frequency Count',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/valid-anagram/',
  statement: 'Return `true` if `t` is an anagram of `s` — the same letters with the same multiplicities, reordered.',
  constraints: ['1 <= s.length, t.length <= 5 * 10^4', 'Lowercase English letters'],
  signature: {
    fn: 'isAnagram',
    params: [
      { name: 's', type: 'string' },
      { name: 't', type: 'string' },
    ],
    ret: 'bool',
  },
  tests: [
    { args: ['anagram', 'nagaram'], expect: true },
    { args: ['rat', 'car'], expect: false },
    { args: ['a', 'ab'], expect: false, note: 'different lengths fail instantly' },
    { args: ['aacc', 'ccac'], expect: false, note: 'same letters, wrong counts' },
  ],
  demo: DEMO,
  scale: (n) => {
    const s = Array.from({ length: n }, (_, i) => String.fromCharCode(97 + (i % 26))).join('')
    return [s, s.split('').reverse().join('')]
  },
  starter: {
    py: `def isAnagram(s, t):
    # s: str, t: str  ->  bool
    pass
`,
    js: `function isAnagram(s, t) {
  // s: string, t: string  ->  boolean
}
`,
    cpp: `bool isAnagram(string s, string t) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'count',
      label: 'Count up, count down',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1) — 26 letters',
      blurb:
        'One counter array: each letter of s increments its slot, each letter of t decrements it. Anagrams cancel to all zeros; any imbalance survives as a non-zero. No sorting, one pass over each string.',
      code: {
        py: {
          lines: [
            'def isAnagram(s, t):',
            '    if len(s) != len(t):',
            '        return False',
            '    count = {}',
            '    for ch in s:',
            '        count[ch] = count.get(ch, 0) + 1',
            '    for ch in t:',
            '        count[ch] = count.get(ch, 0) - 1',
            '        if count[ch] < 0:',
            '            return False',
            '    return True',
          ],
          map: { len: 3, up: 6, down: 8, bad: 10, done: 11 },
        },
        cpp: {
          lines: [
            'bool isAnagram(string s, string t) {',
            '    if (s.size() != t.size()) return false;',
            '    int count[26] = {0};',
            "    for (char ch : s) count[ch - 'a']++;",
            "    for (char ch : t) {",
            "        if (--count[ch - 'a'] < 0) return false;",
            '    }',
            '    return true;',
            '}',
          ],
          map: { len: 2, up: 4, down: 6, bad: 6, done: 8 },
        },
        js: {
          lines: [
            'function isAnagram(s, t) {',
            '  if (s.length !== t.length) return false;',
            '  const count = new Array(26).fill(0);',
            '  for (const ch of s) count[ch.charCodeAt(0) - 97]++;',
            '  for (const ch of t) {',
            '    if (--count[ch.charCodeAt(0) - 97] < 0) return false;',
            '  }',
            '  return true;',
            '}',
          ],
          map: { len: 2, up: 4, down: 6, bad: 6, done: 8 },
        },
      },

      trace(t, [s, tt]: [string, string]) {
        const count = new Map<string, number>()

        const view = (focus: string | null, phase: 's' | 't', idx: number, tone: Tone) => {
          const sT: Record<number, Tone> = {}
          const tT: Record<number, Tone> = {}
          s.split('').forEach((_, k) => {
            sT[k] = phase === 's' ? (k < idx ? 'done' : k === idx ? tone : 'idle') : 'done'
          })
          tt.split('').forEach((_, k) => {
            tT[k] = phase === 't' ? (k < idx ? 'done' : k === idx ? tone : 'idle') : 'idle'
          })
          return combo(
            text(s, { tones: sT, title: 's — counts up' }),
            text(tt, { tones: tT, title: 't — counts down' }),
            mapOf(
              [...count.entries()]
                .filter(([, v]) => v !== 0)
                .map(([k, v]) => ({
                  k,
                  v,
                  tone: k === focus ? tone : v > 0 ? ('band' as Tone) : ('bad' as Tone),
                })),
              { title: 'letter balance (zeros hidden)' },
            ),
          )
        }

        if (s.length !== tt.length) {
          t.push({
            step: 'len',
            note: `Lengths differ (${s.length} vs ${tt.length}) — an anagram must use every letter exactly once, so this fails before any counting.`,
            view: view(null, 's', -1, 'bad'),
            vars: [['answer', 'false', 'no']],
            badge: { text: 'length mismatch', accent: 'no' },
          })
          return
        }

        t.push({
          step: 'len',
          note: `Same length (${s.length}) ✓. Now s pushes each letter's counter up and t pulls it back down — anagrams end perfectly flat.`,
          view: view(null, 's', 0, 'idle'),
          vars: [['length', s.length, 'ok']],
        })

        for (let i = 0; i < s.length; i++) {
          const ch = s[i]
          count.set(ch, (count.get(ch) ?? 0) + 1)
          t.bump()
          if (i === s.length - 1 || i % Math.max(1, Math.floor(s.length / 4)) === 0) {
            t.push({
              step: 'up',
              note: `Counting s: '${ch}' rises to ${count.get(ch)}.`,
              view: view(ch, 's', i, 'active'),
              vars: [
                ['char', ch, 'a'],
                [`count['${ch}']`, count.get(ch)!, 'c'],
              ],
            })
          }
        }

        for (let i = 0; i < tt.length; i++) {
          const ch = tt[i]
          count.set(ch, (count.get(ch) ?? 0) - 1)
          t.bump()
          if (count.get(ch)! < 0) {
            t.push({
              step: 'bad',
              note: `'${ch}' went negative — t contains more '${ch}' than s ever supplied. Not an anagram.`,
              view: view(ch, 't', i, 'bad'),
              vars: [
                ['char', ch, 'no'],
                [`count['${ch}']`, count.get(ch)!, 'no'],
                ['answer', 'false', 'no'],
              ],
              badge: { text: `'${ch}' over-drawn`, accent: 'no' },
            })
            return
          }
          if (i === tt.length - 1 || i % Math.max(1, Math.floor(tt.length / 4)) === 0) {
            t.push({
              step: 'down',
              note: `Draining with t: '${ch}' drops to ${count.get(ch)}.`,
              view: view(ch, 't', i, 'active'),
              vars: [
                ['char', ch, 'b'],
                [`count['${ch}']`, count.get(ch)!, 'c'],
              ],
            })
          }
        }

        t.push({
          step: 'done',
          note: 'Every counter drained exactly to zero — same letters, same multiplicities. True.',
          view: view(null, 't', tt.length, 'good'),
          vars: [['answer', 'true', 'ok']],
          badge: { text: 'true', accent: 'ok' },
        })
      },

      run([s, tt]: [string, string], c) {
        if (s.length !== tt.length) return false
        const count = new Array(26).fill(0)
        for (const ch of s) {
          c.ops++
          count[ch.charCodeAt(0) - 97]++
        }
        for (const ch of tt) {
          c.ops++
          if (--count[ch.charCodeAt(0) - 97] < 0) return false
        }
        return true
      },
    },
  ],
}
