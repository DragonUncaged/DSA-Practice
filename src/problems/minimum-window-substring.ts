import { combo, mapOf, text, type Problem, type Tone } from '@/lib/types'

const DEMO: [string, string] = ['ADOBECODEBANC', 'ABC']

export const minimumWindowSubstring: Problem = {
  id: 'minimum-window-substring',
  title: 'Minimum Window Substring',
  group: 'String',
  pattern: 'Sliding Window',
  difficulty: 'Hard',
  leetcode: 'https://leetcode.com/problems/minimum-window-substring/',
  statement:
    'Return the smallest substring of `s` that contains every character of `t` (with multiplicity), or `""` if none exists.',
  constraints: ['1 <= s.length, t.length <= 10^5', 'The answer is unique when it exists'],
  signature: {
    fn: 'minWindow',
    params: [
      { name: 's', type: 'string' },
      { name: 't', type: 'string' },
    ],
    ret: 'string',
  },
  tests: [
    { args: ['ADOBECODEBANC', 'ABC'], expect: 'BANC' },
    { args: ['a', 'a'], expect: 'a' },
    { args: ['a', 'aa'], expect: '', note: 't needs two a\'s, s has one' },
    { args: ['ab', 'b'], expect: 'b' },
  ],
  demo: DEMO,
  scale: (n) => [Array.from({ length: n }, (_, i) => 'ABCDEFG'[i % 7]).join(''), 'ABC'],
  starter: {
    js: `function minWindow(s, t) {
  // s: string, t: string  ->  string
}
`,
    cpp: `string minWindow(string s, string t) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'window',
      label: 'Expand to satisfy, shrink to minimise',
      kind: 'optimal',
      time: 'O(|s| + |t|)',
      space: 'O(charset)',
      blurb:
        'The right edge expands until the window covers every needed character; then the left edge shrinks, squeezing out slack, until coverage would break — recording the window each time. A "how many requirements are still unmet" counter makes both checks O(1).',
      code: {
        cpp: {
          lines: [
            'string minWindow(string s, string t) {',
            '    unordered_map<char, int> need;',
            '    for (char ch : t) need[ch]++;',
            '    int missing = t.size(), l = 0, bestL = 0, bestLen = INT_MAX;',
            '    for (int r = 0; r < s.size(); ++r) {',
            '        if (need[s[r]] > 0) missing--;',
            '        need[s[r]]--;',
            '        if (missing == 0) {',
            '            while (need[s[l]] < 0) { need[s[l]]++; l++; }',
            '            if (r - l + 1 < bestLen) { bestLen = r - l + 1; bestL = l; }',
            '        }',
            '    }',
            '    return bestLen == INT_MAX ? "" : s.substr(bestL, bestLen);',
            '}',
          ],
          map: { init: 4, take: 7, cover: 8, shrink: 9, record: 10, done: 13 },
        },
        js: {
          lines: [
            'function minWindow(s, t) {',
            '  const need = new Map();',
            '  for (const ch of t) need.set(ch, (need.get(ch) ?? 0) + 1);',
            '  let missing = t.length;',
            '  let l = 0;',
            '  let bestL = 0;',
            '  let bestLen = Infinity;',
            '  for (let r = 0; r < s.length; r++) {',
            '    if ((need.get(s[r]) ?? 0) > 0) missing--;',
            '    need.set(s[r], (need.get(s[r]) ?? 0) - 1);',
            '    if (missing === 0) {',
            '      while ((need.get(s[l]) ?? 0) < 0) {',
            '        need.set(s[l], need.get(s[l]) + 1);',
            '        l++;',
            '      }',
            '      if (r - l + 1 < bestLen) { bestLen = r - l + 1; bestL = l; }',
            '    }',
            '  }',
            "  return bestLen === Infinity ? '' : s.slice(bestL, bestL + bestLen);",
            '}',
          ],
          map: { init: 4, take: 10, cover: 11, shrink: 14, record: 16, done: 19 },
        },
      },

      trace(t, [s, tt]: [string, string]) {
        const n = s.length
        const need = new Map<string, number>()
        for (const ch of tt) need.set(ch, (need.get(ch) ?? 0) + 1)
        let missing = tt.length
        let l = 0
        let bestL = 0
        let bestLen = Infinity

        const paint = (r: number, tone: Tone, showBest = false) => {
          const tones: Record<number, Tone> = {}
          for (let i = 0; i < n; i++) tones[i] = i < l ? 'dim' : i > r ? 'idle' : 'band'
          if (r >= 0 && r < n) tones[r] = tone
          if (showBest && bestLen !== Infinity) {
            for (let i = bestL; i < bestL + bestLen; i++) tones[i] = 'good'
          }
          return combo(
            text(s, {
              tones,
              pointers: [
                { name: 'l', at: l, accent: 'a' },
                { name: 'r', at: Math.max(0, Math.min(r, n - 1)), accent: 'b', lane: 1 },
              ],
              band:
                showBest && bestLen !== Infinity
                  ? { from: bestL, to: bestL + bestLen - 1, label: `best "${s.slice(bestL, bestL + bestLen)}"`, accent: 'ok' }
                  : r >= l
                    ? { from: l, to: Math.min(r, n - 1), accent: 'c' }
                    : null,
              title: 's',
            }),
            mapOf(
              [...need.entries()].map(([ch, v]) => ({
                k: ch,
                v,
                tone: v > 0 ? ('bad' as Tone) : v === 0 ? ('good' as Tone) : ('dim' as Tone),
              })),
              { title: 'still needed (negative = surplus)' },
            ),
          )
        }

        t.push({
          step: 'init',
          note: `Need every character of "${tt}" (${missing} requirement${missing === 1 ? '' : 's'}). The window will expand until nothing is missing, then squeeze from the left.`,
          view: paint(-1, 'idle'),
          vars: [['missing', missing, 'no']],
        })

        for (let r = 0; r < n && !t.full; r++) {
          const ch = s[r]
          const wasNeeded = (need.get(ch) ?? 0) > 0
          if (wasNeeded) missing--
          need.set(ch, (need.get(ch) ?? 0) - 1)
          t.bump()

          t.push({
            step: 'take',
            note: wasNeeded
              ? `'${ch}' was on the shopping list — ${missing} requirement${missing === 1 ? '' : 's'} left.`
              : `'${ch}' is surplus; the window swallows it and moves on.`,
            view: paint(r, wasNeeded ? 'active' : 'band'),
            vars: [
              ['took', ch, wasNeeded ? 'ok' : 'mute'],
              ['missing', missing, missing ? 'no' : 'ok'],
            ],
            badge: missing === 0 ? { text: 'covered!', accent: 'ok' } : null,
          })

          if (missing === 0) {
            while ((need.get(s[l]) ?? 0) < 0 && !t.full) {
              need.set(s[l], need.get(s[l])! + 1)
              l++
              t.bump()
            }
            t.push({
              step: 'shrink',
              note: `Squeeze from the left: every character the window can shed without breaking coverage is gone. Tightest form: "${s.slice(l, r + 1)}".`,
              view: paint(r, 'active'),
              vars: [
                ['window', `"${s.slice(l, r + 1)}"`, 'c'],
                ['length', r - l + 1],
              ],
              badge: { text: `tight: ${r - l + 1}`, accent: 'c' },
            })

            if (r - l + 1 < bestLen) {
              bestLen = r - l + 1
              bestL = l
              t.push({
                step: 'record',
                note: `"${s.slice(bestL, bestL + bestLen)}" (length ${bestLen}) is the smallest covering window so far.`,
                view: paint(r, 'good', true),
                vars: [['best', `"${s.slice(bestL, bestL + bestLen)}"`, 'ok']],
                badge: { text: `best "${s.slice(bestL, bestL + bestLen)}"`, accent: 'ok' },
              })
            }
          }
        }

        const answer = bestLen === Infinity ? '' : s.slice(bestL, bestL + bestLen)
        t.push({
          step: 'done',
          note: answer
            ? `Smallest window covering "${tt}": "${answer}". Both edges moved only forward — linear despite the nested look.`
            : `The window never achieved coverage — s simply lacks the required characters. Return "".`,
          view: paint(n - 1, 'idle', true),
          vars: [['answer', answer ? `"${answer}"` : '""', answer ? 'ok' : 'no']],
          badge: { text: answer ? `"${answer}"` : 'none', accent: answer ? 'ok' : 'no' },
        })
      },

      run([s, tt]: [string, string], c) {
        const need = new Map<string, number>()
        for (const ch of tt) need.set(ch, (need.get(ch) ?? 0) + 1)
        let missing = tt.length
        let l = 0
        let bestL = 0
        let bestLen = Infinity
        for (let r = 0; r < s.length; r++) {
          c.ops++
          if ((need.get(s[r]) ?? 0) > 0) missing--
          need.set(s[r], (need.get(s[r]) ?? 0) - 1)
          if (missing === 0) {
            while ((need.get(s[l]) ?? 0) < 0) {
              c.ops++
              need.set(s[l], need.get(s[l])! + 1)
              l++
            }
            if (r - l + 1 < bestLen) {
              bestLen = r - l + 1
              bestL = l
            }
          }
        }
        return bestLen === Infinity ? '' : s.slice(bestL, bestL + bestLen)
      },
    },
  ],
}
