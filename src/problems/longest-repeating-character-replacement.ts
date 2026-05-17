import { combo, mapOf, text, type Problem, type Tone } from '@/lib/types'

const DEMO: [string, number] = ['AABABBA', 1]

export const longestRepeatingCharacterReplacement: Problem = {
  id: 'longest-repeating-character-replacement',
  title: 'Longest Repeating Character Replacement',
  group: 'String',
  pattern: 'Sliding Window',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/longest-repeating-character-replacement/',
  statement:
    'You may change at most `k` characters of `s`. Return the length of the longest substring you can turn into a run of one repeated letter.',
  constraints: ['1 <= s.length <= 10^5', 'Uppercase English letters', '0 <= k <= s.length'],
  signature: {
    fn: 'characterReplacement',
    params: [
      { name: 's', type: 'string' },
      { name: 'k', type: 'int' },
    ],
    ret: 'int',
  },
  tests: [
    { args: ['ABAB', 2], expect: 4 },
    { args: ['AABABBA', 1], expect: 4 },
    { args: ['AAAA', 0], expect: 4, note: 'no edits needed' },
    { args: ['ABCDE', 1], expect: 2 },
  ],
  demo: DEMO,
  scale: (n) => [Array.from({ length: n }, (_, i) => 'AB'[i % 2]).join(''), 2],
  starter: {
    py: `def characterReplacement(s, k):
    # s: str, k: int  ->  int
    pass
`,
    js: `function characterReplacement(s, k) {
  // s: string, k: number  ->  number
}
`,
    cpp: `int characterReplacement(string s, int k) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'window',
      label: 'Window where minority ≤ k',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1) — 26 letters',
      blurb:
        'A window is fixable when everything except its most common letter fits inside k edits: window length − max count ≤ k. Grow the right edge every step; when the rule breaks, slide the left edge once. The window never shrinks — it only stops growing — so the max it ever reached is the answer.',
      code: {
        py: {
          lines: [
            'def characterReplacement(s, k):',
            '    count = {}',
            '    best = l = maxf = 0',
            '    for r, ch in enumerate(s):',
            '        count[ch] = count.get(ch, 0) + 1',
            '        maxf = max(maxf, count[ch])',
            '        if r - l + 1 - maxf > k:',
            '            count[s[l]] -= 1',
            '            l += 1',
            '        best = max(best, r - l + 1)',
            '    return best',
          ],
          map: { init: 3, grow: 6, slide: 9, best: 10, done: 11 },
        },
        cpp: {
          lines: [
            'int characterReplacement(string s, int k) {',
            '    int count[26] = {0};',
            '    int best = 0, l = 0, maxf = 0;',
            '    for (int r = 0; r < s.size(); ++r) {',
            "        maxf = max(maxf, ++count[s[r] - 'A']);",
            '        if (r - l + 1 - maxf > k) {',
            "            count[s[l] - 'A']--;",
            '            l++;',
            '        }',
            '        best = max(best, r - l + 1);',
            '    }',
            '    return best;',
            '}',
          ],
          map: { init: 3, grow: 5, slide: 8, best: 10, done: 12 },
        },
        js: {
          lines: [
            'function characterReplacement(s, k) {',
            '  const count = new Array(26).fill(0);',
            '  let best = 0;',
            '  let l = 0;',
            '  let maxf = 0;',
            '  for (let r = 0; r < s.length; r++) {',
            '    maxf = Math.max(maxf, ++count[s.charCodeAt(r) - 65]);',
            '    if (r - l + 1 - maxf > k) {',
            '      count[s.charCodeAt(l) - 65]--;',
            '      l++;',
            '    }',
            '    best = Math.max(best, r - l + 1);',
            '  }',
            '  return best;',
            '}',
          ],
          map: { init: 5, grow: 7, slide: 10, best: 12, done: 15 },
        },
      },

      trace(t, [s, k]: [string, number]) {
        const n = s.length
        const count = new Map<string, number>()
        let l = 0
        let best = 0
        let maxf = 0

        const paint = (r: number, tone: Tone) => {
          const tones: Record<number, Tone> = {}
          for (let i = 0; i < n; i++) {
            tones[i] = i < l ? 'dim' : i > r ? 'idle' : 'band'
          }
          if (r < n) tones[r] = tone
          return combo(
            text(s, {
              tones,
              pointers: [
                { name: 'l', at: l, accent: 'a' },
                { name: 'r', at: Math.min(r, n - 1), accent: 'b', lane: 1 },
              ],
              band: r >= l ? { from: l, to: Math.min(r, n - 1), label: `window ${Math.min(r, n - 1) - l + 1}`, accent: 'c' } : null,
              title: 's',
            }),
            mapOf(
              [...count.entries()].filter(([, v]) => v > 0).map(([ch, v]) => ({ k: ch, v })),
              { title: 'letter counts inside the window' },
            ),
          )
        }

        t.push({
          step: 'init',
          note: `Budget: ${k} edit${k === 1 ? '' : 's'}. A window is legal when its minority characters — everything except the most frequent letter — number at most ${k}.`,
          view: paint(0, 'idle'),
          vars: [['k', k, 'c']],
        })

        for (let r = 0; r < n && !t.full; r++) {
          const ch = s[r]
          count.set(ch, (count.get(ch) ?? 0) + 1)
          maxf = Math.max(maxf, count.get(ch)!)
          t.bump()

          const minority = r - l + 1 - maxf
          t.push({
            step: 'grow',
            note: `Take '${ch}'. Window ${l}..${r}: majority letter covers ${maxf}, leaving ${minority} to edit ${minority <= k ? '— within budget' : '— over budget'}.`,
            view: paint(r, minority <= k ? 'active' : 'bad'),
            vars: [
              ['window', `${l}..${r}`, 'c'],
              ['majority count', maxf],
              ['edits needed', minority, minority <= k ? 'ok' : 'no'],
            ],
            badge: {
              text: `${minority} edit${minority === 1 ? '' : 's'} needed`,
              accent: minority <= k ? 'ok' : 'no',
            },
          })

          if (minority > k) {
            count.set(s[l], count.get(s[l])! - 1)
            l++
            t.push({
              step: 'slide',
              note: `Over budget — slide the left edge one step (dropping '${s[l - 1]}'). Note it slides rather than shrinking to legal: a smaller window can never beat the best already found, so there is no point collapsing.`,
              view: paint(r, 'active'),
              vars: [
                ['l', l, 'a'],
                ['dropped', s[l - 1], 'no'],
              ],
              badge: { text: `slide l → ${l}`, accent: 'a' },
            })
          }

          if (r - l + 1 > best) {
            best = r - l + 1
            t.push({
              step: 'best',
              note: `Window length ${best} is the longest legal one so far.`,
              view: paint(r, 'good'),
              vars: [['best', best, 'ok']],
              badge: { text: `best ${best}`, accent: 'ok' },
            })
          }
        }

        t.push({
          step: 'done',
          note: `With ${k} edit${k === 1 ? '' : 's'}, the longest achievable run is ${best}. Each edge only ever moved forward — linear time.`,
          view: paint(n - 1, 'good'),
          vars: [['answer', best, 'ok']],
          badge: { text: `length ${best}`, accent: 'ok' },
        })
      },

      run([s, k]: [string, number], c) {
        const count = new Array(26).fill(0)
        let best = 0
        let l = 0
        let maxf = 0
        for (let r = 0; r < s.length; r++) {
          c.ops++
          maxf = Math.max(maxf, ++count[s.charCodeAt(r) - 65])
          if (r - l + 1 - maxf > k) {
            count[s.charCodeAt(l) - 65]--
            l++
          }
          best = Math.max(best, r - l + 1)
        }
        return best
      },
    },
  ],
}
