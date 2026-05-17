import { text, type Problem, type Tone } from '@/lib/types'

const DEMO: [string] = ['A man, a plan!']

const isAlnum = (ch: string) => /[a-z0-9]/i.test(ch)

export const validPalindrome: Problem = {
  id: 'valid-palindrome',
  title: 'Valid Palindrome',
  group: 'String',
  pattern: 'Two Pointers',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/valid-palindrome/',
  statement:
    'A phrase is a palindrome if, after lowercasing and stripping non-alphanumeric characters, it reads the same forwards and backwards. Return `true` if `s` is one.',
  constraints: ['1 <= s.length <= 2 * 10^5', 'Printable ASCII only'],
  signature: { fn: 'isPalindrome', params: [{ name: 's', type: 'string' }], ret: 'bool' },
  tests: [
    { args: ['A man, a plan, a canal: Panama'], expect: true },
    { args: ['race a car'], expect: false },
    { args: [' '], expect: true, note: 'nothing left after cleaning still counts' },
    { args: ['0P'], expect: false, note: 'digits are compared too' },
  ],
  demo: DEMO,
  scale: (n) => ['ab'.repeat(Math.floor(n / 4)) + 'x' + 'ba'.repeat(Math.floor(n / 4))],
  starter: {
    py: `def isPalindrome(s):
    # s: str  ->  bool
    pass
`,
    js: `function isPalindrome(s) {
  // s: string  ->  boolean
}
`,
    cpp: `bool isPalindrome(string s) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'two-pointer',
      label: 'Pinch from both ends',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'No cleaned copy needed: two pointers pinch inward, each skipping punctuation and spaces as it goes, comparing lowercase letters when both stand on real characters. First mismatch ends it.',
      code: {
        py: {
          lines: [
            'def isPalindrome(s):',
            '    l, r = 0, len(s) - 1',
            '    while l < r:',
            '        if not s[l].isalnum():',
            '            l += 1',
            '        elif not s[r].isalnum():',
            '            r -= 1',
            '        elif s[l].lower() != s[r].lower():',
            '            return False',
            '        else:',
            '            l += 1',
            '            r -= 1',
            '    return True',
          ],
          map: { init: 2, skip: 5, cmp: 11, bad: 9, done: 13 },
        },
        cpp: {
          lines: [
            'bool isPalindrome(string s) {',
            '    int l = 0, r = s.size() - 1;',
            '    while (l < r) {',
            '        if (!isalnum(s[l])) l++;',
            '        else if (!isalnum(s[r])) r--;',
            '        else if (tolower(s[l]) != tolower(s[r])) return false;',
            '        else { l++; r--; }',
            '    }',
            '    return true;',
            '}',
          ],
          map: { init: 2, skip: 4, cmp: 7, bad: 6, done: 9 },
        },
        js: {
          lines: [
            'function isPalindrome(s) {',
            '  const ok = (ch) => /[a-z0-9]/i.test(ch);',
            '  let l = 0;',
            '  let r = s.length - 1;',
            '  while (l < r) {',
            '    if (!ok(s[l])) l++;',
            '    else if (!ok(s[r])) r--;',
            '    else if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;',
            '    else { l++; r--; }',
            '  }',
            '  return true;',
            '}',
          ],
          map: { init: 3, skip: 6, cmp: 9, bad: 8, done: 11 },
        },
      },

      trace(t, [s]: [string]) {
        const n = s.length
        let l = 0
        let r = n - 1

        const paint = (tone: Tone, extra: Record<number, Tone> = {}) => {
          const tones: Record<number, Tone> = {}
          for (let k = 0; k < n; k++) {
            tones[k] = k < l || k > r ? 'done' : isAlnum(s[k]) ? 'band' : 'dim'
          }
          if (l < n) tones[l] = tone
          if (r >= 0) tones[r] = tone
          Object.assign(tones, extra)
          return text(s, {
            tones,
            pointers: [
              { name: 'l', at: Math.min(l, n - 1), accent: 'a' },
              { name: 'r', at: Math.max(r, 0), accent: 'b', lane: 1 },
            ],
            title: 's — greyed characters are skipped',
          })
        }

        t.push({
          step: 'init',
          note: 'Two pointers pinch inward. Punctuation and spaces are stepped over rather than stripped into a copy.',
          view: paint('active'),
          vars: [
            ['l', l, 'a'],
            ['r', r, 'b'],
          ],
        })

        while (l < r && !t.full) {
          t.bump()
          if (!isAlnum(s[l])) {
            t.push({
              step: 'skip',
              note: `'${s[l] === ' ' ? '␣' : s[l]}' at index ${l} is not a letter or digit — the left pointer steps over it.`,
              view: paint('active'),
              vars: [['skipped', l, 'mute']],
            })
            l++
            continue
          }
          if (!isAlnum(s[r])) {
            t.push({
              step: 'skip',
              note: `'${s[r] === ' ' ? '␣' : s[r]}' at index ${r} is not a letter or digit — the right pointer steps over it.`,
              view: paint('active'),
              vars: [['skipped', r, 'mute']],
            })
            r--
            continue
          }
          const a = s[l].toLowerCase()
          const b = s[r].toLowerCase()
          if (a !== b) {
            t.push({
              step: 'bad',
              note: `'${a}' vs '${b}' — a real mismatch. Not a palindrome; nothing further can fix it.`,
              view: paint('bad'),
              vars: [
                ['left', a, 'no'],
                ['right', b, 'no'],
                ['answer', 'false', 'no'],
              ],
              badge: { text: `'${a}' ≠ '${b}'`, accent: 'no' },
            })
            return
          }
          t.push({
            step: 'cmp',
            note: `'${a}' matches '${b}' — both pointers pinch inward.`,
            view: paint('good'),
            vars: [
              ['match', `'${a}'`, 'ok'],
              ['l', l, 'a'],
              ['r', r, 'b'],
            ],
            badge: { text: `'${a}' = '${b}'`, accent: 'ok' },
          })
          l++
          r--
        }

        t.push({
          step: 'done',
          note: 'The pointers met without a mismatch — palindrome confirmed in one pass.',
          view: paint('good'),
          vars: [['answer', 'true', 'ok']],
          badge: { text: 'true', accent: 'ok' },
        })
      },

      run([s]: [string], c) {
        let l = 0
        let r = s.length - 1
        while (l < r) {
          c.ops++
          if (!isAlnum(s[l])) l++
          else if (!isAlnum(s[r])) r--
          else if (s[l].toLowerCase() !== s[r].toLowerCase()) return false
          else {
            l++
            r--
          }
        }
        return true
      },
    },
  ],
}
