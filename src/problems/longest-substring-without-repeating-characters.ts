import { combo, mapOf, text, type Problem, type Tone } from '@/lib/types'

const DEMO: [string] = ['abcabcbb']

export const longestSubstringWithoutRepeating: Problem = {
  id: 'longest-substring-without-repeating-characters',
  title: 'Longest Substring Without Repeating Characters',
  group: 'String',
  pattern: 'Sliding Window',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
  statement:
    'Given a string `s`, return the length of the longest substring that contains no repeated characters.',
  constraints: ['0 <= s.length <= 5 * 10^4', 's may contain letters, digits, symbols and spaces'],
  signature: { fn: 'lengthOfLongestSubstring', params: [{ name: 's', type: 'string' }], ret: 'int' },
  tests: [
    { args: ['abcabcbb'], expect: 3 },
    { args: ['bbbbb'], expect: 1, note: 'all the same character' },
    { args: ['pwwkew'], expect: 3, note: 'answer is a substring, not a subsequence' },
    { args: [''], expect: 0, note: 'empty string' },
    { args: ['dvdf'], expect: 3, note: 'the left edge must not move backwards' },
    { args: ['abba'], expect: 2 },
  ],
  demo: DEMO,
  // every character distinct: the worst case for the brute force, where each
  // start index really does scan to the end. A repeating alphabet would cap
  // every attempt at 26 characters and hide the quadratic entirely.
  scale: (n) => [Array.from({ length: n }, (_, i) => String.fromCharCode(0x41 + i)).join('')],
  starter: {
    py: `def lengthOfLongestSubstring(s):
    # s: str  ->  int
    pass
`,
    js: `function lengthOfLongestSubstring(s) {
  // s: string  ->  number
}
`,
    cpp: `int lengthOfLongestSubstring(string s) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'window',
      label: 'Sliding window',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(min(n, charset))',
      blurb:
        'Keep a window that is always duplicate-free. The right edge advances every step; the left edge only ever jumps forward, past the previous copy of whatever character just collided. Neither edge ever moves backwards, so the whole string is crossed twice at most.',
      code: {
        py: {
          lines: [
            'def lengthOfLongestSubstring(s):',
            '    seen = {}',
            '    best = 0',
            '    l = 0',
            '    for r, ch in enumerate(s):',
            '        if ch in seen and seen[ch] >= l:',
            '            l = seen[ch] + 1',
            '        seen[ch] = r',
            '        best = max(best, r - l + 1)',
            '    return best',
          ],
          map: { init: 4, read: 5, shrink: 7, store: 8, best: 9, done: 10 },
        },
        cpp: {
          lines: [
            'int lengthOfLongestSubstring(string s) {',
            '    unordered_map<char, int> seen;',
            '    int best = 0, l = 0;',
            '    for (int r = 0; r < s.size(); ++r) {',
            '        char ch = s[r];',
            '        if (seen.count(ch) && seen[ch] >= l) l = seen[ch] + 1;',
            '        seen[ch] = r;',
            '        best = max(best, r - l + 1);',
            '    }',
            '    return best;',
            '}',
          ],
          map: { init: 3, read: 5, shrink: 6, store: 7, best: 8, done: 10 },
        },
        js: {
          lines: [
            'function lengthOfLongestSubstring(s) {',
            '  const seen = new Map();',
            '  let best = 0;',
            '  let l = 0;',
            '  for (let r = 0; r < s.length; r++) {',
            '    const ch = s[r];',
            '    if (seen.has(ch) && seen.get(ch) >= l) l = seen.get(ch) + 1;',
            '    seen.set(ch, r);',
            '    best = Math.max(best, r - l + 1);',
            '  }',
            '  return best;',
            '}',
          ],
          map: { init: 4, read: 6, shrink: 7, store: 8, best: 9, done: 11 },
        },
      },

      trace(t, [s]: [string]) {
        const n = s.length
        const seen = new Map<string, number>()
        let l = 0
        let best = 0
        let bestFrom = 0
        let bestTo = -1

        const paint = (r: number, tone: Tone, opts: { showBest?: boolean; hit?: string } = {}) => {
          const tones: Record<number, Tone> = {}
          for (let k = 0; k < n; k++) {
            tones[k] = k < l ? 'dim' : k > r ? 'idle' : 'band'
          }
          if (r >= 0 && r < n) tones[r] = tone
          if (opts.showBest && bestTo >= bestFrom) {
            for (let k = bestFrom; k <= bestTo; k++) tones[k] = 'good'
          }
          return combo(
            text(s, {
              tones,
              pointers: [
                { name: 'l', at: l, accent: 'a' },
                { name: 'r', at: Math.min(r, n - 1), accent: 'b', lane: 1 },
              ],
              band:
                opts.showBest && bestTo >= bestFrom
                  ? { from: bestFrom, to: bestTo, label: `best ${best}`, accent: 'ok' }
                  : r >= l
                    ? { from: l, to: Math.min(r, n - 1), label: `window ${Math.min(r, n - 1) - l + 1}`, accent: 'c' }
                    : null,
              title: 's',
            }),
            mapOf(
              [...seen.entries()].map(([k, v]) => ({
                k,
                v,
                tone: (opts.hit === k ? 'bad' : v >= l ? 'band' : 'dim') as Tone,
              })),
              { title: 'last index of each character' },
            ),
          )
        }

        t.push({
          step: 'init',
          note: 'The window starts empty. Its rule never changes: everything between l and r is distinct.',
          view: paint(0, 'idle'),
          vars: [
            ['l', 0, 'a'],
            ['best', 0],
          ],
        })

        for (let r = 0; r < n; r++) {
          const ch = s[r]
          t.bump()
          const prev = seen.get(ch)
          const collides = prev !== undefined && prev >= l

          t.push({
            step: 'read',
            note: collides
              ? `'${ch}' is already inside the window, at index ${prev}. The window is no longer duplicate-free.`
              : `'${ch}' is not in the window, so the window can simply grow to include it.`,
            view: paint(r, collides ? 'bad' : 'active', { hit: collides ? ch : undefined }),
            vars: [
              ['r', r, 'b'],
              ['s[r]', ch],
              ['l', l, 'a'],
              ['duplicate', collides ? 'yes' : 'no', collides ? 'no' : 'ok'],
            ],
            badge: collides ? { text: `'${ch}' repeats`, accent: 'no' } : null,
          })

          if (collides) {
            l = prev! + 1
            t.push({
              step: 'shrink',
              note: `Jump l past that copy, to index ${l}. Note it jumps rather than creeping — every position in between would still contain the duplicate, so testing them one at a time would be wasted work.`,
              view: paint(r, 'active'),
              vars: [
                ['l', l, 'a'],
                ['r', r, 'b'],
                ['action', 'jump l', 'a'],
              ],
              badge: { text: `l -> ${l}`, accent: 'a' },
            })
          }

          seen.set(ch, r)
          const len = r - l + 1
          if (len > best) {
            best = len
            bestFrom = l
            bestTo = r
            t.push({
              step: 'best',
              note: `The window now spans ${l} to ${r}, giving "${s.slice(l, r + 1)}" — length ${len}, the longest so far.`,
              view: paint(r, 'good', { showBest: true }),
              vars: [
                ['window', `[${l}, ${r}]`, 'c'],
                ['best', best, 'ok'],
              ],
              badge: { text: `best ${best}`, accent: 'ok' },
            })
          } else {
            t.push({
              step: 'store',
              note: `Record '${ch}' at index ${r}. Window length is ${len}, which does not beat ${best}.`,
              view: paint(r, 'band'),
              vars: [
                ['window', `[${l}, ${r}]`, 'c'],
                ['length', len],
                ['best', best, 'ok'],
              ],
            })
          }
        }

        t.push({
          step: 'done',
          note:
            best > 0
              ? `Longest duplicate-free substring is "${s.slice(bestFrom, bestTo + 1)}" at length ${best}.`
              : 'The string is empty, so the answer is 0.',
          view: paint(n - 1, 'idle', { showBest: true }),
          vars: [['answer', best, 'ok']],
          badge: { text: `length ${best}`, accent: 'ok' },
        })
      },

      run([s]: [string], c) {
        const seen = new Map<string, number>()
        let best = 0
        let l = 0
        for (let r = 0; r < s.length; r++) {
          c.ops++
          const prev = seen.get(s[r])
          if (prev !== undefined && prev >= l) l = prev + 1
          seen.set(s[r], r)
          best = Math.max(best, r - l + 1)
        }
        return best
      },
    },

    {
      id: 'brute',
      label: 'Check every substring',
      kind: 'brute',
      time: 'O(n^2)',
      space: 'O(min(n, charset))',
      blurb:
        'From each starting index, walk forward until a repeat appears. Correct, but it re-reads the same characters from every start.',
      code: {
        py: {
          lines: [
            'def lengthOfLongestSubstring(s):',
            '    best = 0',
            '    for i in range(len(s)):',
            '        seen = set()',
            '        for j in range(i, len(s)):',
            '            if s[j] in seen:',
            '                break',
            '            seen.add(s[j])',
            '            best = max(best, j - i + 1)',
            '    return best',
          ],
          map: { init: 2, outer: 3, read: 6, stop: 7, grow: 9, done: 10 },
        },
        cpp: {
          lines: [
            'int lengthOfLongestSubstring(string s) {',
            '    int best = 0;',
            '    for (int i = 0; i < s.size(); ++i) {',
            '        set<char> seen;',
            '        for (int j = i; j < s.size(); ++j) {',
            '            if (seen.count(s[j])) break;',
            '            seen.insert(s[j]);',
            '            best = max(best, j - i + 1);',
            '        }',
            '    }',
            '    return best;',
            '}',
          ],
          map: { init: 2, outer: 3, read: 6, stop: 6, grow: 8, done: 11 },
        },
        js: {
          lines: [
            'function lengthOfLongestSubstring(s) {',
            '  let best = 0;',
            '  for (let i = 0; i < s.length; i++) {',
            '    const seen = new Set();',
            '    for (let j = i; j < s.length; j++) {',
            '      if (seen.has(s[j])) break;',
            '      seen.add(s[j]);',
            '      best = Math.max(best, j - i + 1);',
            '    }',
            '  }',
            '  return best;',
            '}',
          ],
          map: { init: 2, outer: 4, read: 6, stop: 6, grow: 8, done: 11 },
        },
      },

      trace(t, [s]: [string]) {
        const n = s.length
        let best = 0

        const paint = (i: number, j: number, seen: Set<string>, tone: Tone) => {
          const tones: Record<number, Tone> = {}
          for (let k = 0; k < n; k++) tones[k] = k >= i && k <= j ? 'band' : 'idle'
          if (j >= 0 && j < n) tones[j] = tone
          return combo(
            text(s, {
              tones,
              pointers: [
                { name: 'i', at: i, accent: 'a' },
                { name: 'j', at: Math.min(j, n - 1), accent: 'b', lane: 1 },
              ],
              band: j >= i ? { from: i, to: Math.min(j, n - 1), accent: 'c' } : null,
              title: 's',
            }),
            mapOf([...seen].map((k) => ({ k })), { title: 'characters in this attempt', asSet: true }),
          )
        }

        t.push({
          step: 'init',
          note: 'Try every starting index independently, growing until a character repeats.',
          view: paint(0, -1, new Set(), 'idle'),
          vars: [['best', 0]],
        })

        for (let i = 0; i < n && !t.full; i++) {
          const seen = new Set<string>()
          t.push({
            step: 'outer',
            note: `Restart from index ${i}. The set of characters is thrown away and rebuilt from scratch — that is exactly the work the sliding window avoids.`,
            view: paint(i, i - 1, seen, 'idle'),
            vars: [
              ['i', i, 'a'],
              ['best', best],
            ],
          })

          for (let j = i; j < n && !t.full; j++) {
            t.bump()
            if (seen.has(s[j])) {
              t.push({
                step: 'stop',
                note: `'${s[j]}' already appeared in this attempt. Stop and move the start forward.`,
                view: paint(i, j, seen, 'bad'),
                vars: [
                  ['i', i, 'a'],
                  ['j', j, 'b'],
                  ['reads', t.ops],
                ],
                badge: { text: `'${s[j]}' repeats`, accent: 'no' },
              })
              break
            }
            seen.add(s[j])
            const len = j - i + 1
            const win = len > best
            if (win) best = len
            t.push({
              step: 'grow',
              note: `"${s.slice(i, j + 1)}" is still duplicate-free, at length ${len}. ${win ? 'New best.' : `Best is still ${best}.`}`,
              view: paint(i, j, seen, win ? 'good' : 'band'),
              vars: [
                ['i', i, 'a'],
                ['j', j, 'b'],
                ['length', len, win ? 'ok' : 'mute'],
                ['best', best],
                ['reads', t.ops],
              ],
              badge: win ? { text: `best ${best}`, accent: 'ok' } : null,
            })
          }
        }

        t.push({
          step: 'done',
          note: `Answer ${best}, after ${t.ops} character reads. The window version reads each character at most twice.`,
          view: paint(0, -1, new Set(), 'idle'),
          vars: [
            ['answer', best, 'ok'],
            ['reads', t.ops],
          ],
        })
      },

      run([s]: [string], c) {
        let best = 0
        for (let i = 0; i < s.length; i++) {
          const seen = new Set<string>()
          for (let j = i; j < s.length; j++) {
            c.ops++
            if (seen.has(s[j])) break
            seen.add(s[j])
            best = Math.max(best, j - i + 1)
          }
        }
        return best
      },
    },
  ],
}
