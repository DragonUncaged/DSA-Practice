import { combo, stackOf, text, type Problem, type Tone } from '@/lib/types'

const DEMO: [string] = ['{[()]}']
const PAIRS: Record<string, string> = { ')': '(', ']': '[', '}': '{' }

export const validParentheses: Problem = {
  id: 'valid-parentheses',
  title: 'Valid Parentheses',
  group: 'Stack',
  pattern: 'Stack',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/valid-parentheses/',
  statement:
    "Given a string `s` containing only `()[]{}`, decide whether it is valid. Brackets must close in the correct order, and every closing bracket must match the most recently opened one.",
  constraints: ['1 <= s.length <= 10^4', 's consists only of ()[]{}'],
  signature: { fn: 'isValid', params: [{ name: 's', type: 'string' }], ret: 'bool' },
  tests: [
    { args: ['()'], expect: true },
    { args: ['()[]{}'], expect: true },
    { args: ['(]'], expect: false },
    { args: ['{[()]}'], expect: true },
    { args: ['([)]'], expect: false, note: 'nesting order matters' },
    { args: [']'], expect: false, note: 'closer with nothing open' },
    { args: ['((('], expect: false, note: 'left open at the end' },
  ],
  demo: DEMO,
  scale: (n) => ['('.repeat(Math.floor(n / 2)) + ')'.repeat(Math.floor(n / 2))],
  starter: {
    js: `function isValid(s) {
  // s: string  ->  boolean
}
`,
    cpp: `bool isValid(string s) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'stack',
      label: 'Stack',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'A closing bracket only ever has one legal partner: the most recent unclosed opener. That "most recent" is exactly what a stack gives you, which is why one pass is enough.',
      code: {
        cpp: {
          lines: [
            'bool isValid(string s) {',
            '    unordered_map<char, char> pairs{{\')\', \'(\'}, {\']\', \'[\'}, {\'}\', \'{\'}};',
            '    vector<char> st;',
            '    for (char ch : s) {',
            '        if (!pairs.count(ch)) { st.push_back(ch); continue; }',
            '        if (st.empty() || st.back() != pairs[ch]) return false;',
            '        st.pop_back();',
            '    }',
            '    return st.empty();',
            '}',
          ],
          map: { init: 3, read: 4, push: 5, pop: 7, bad: 6, done: 9 },
        },
        js: {
          lines: [
            'function isValid(s) {',
            "  const pairs = { ')': '(', ']': '[', '}': '{' };",
            '  const stack = [];',
            '  for (const ch of s) {',
            '    if (!pairs[ch]) {',
            '      stack.push(ch);',
            '    } else if (stack.pop() !== pairs[ch]) {',
            '      return false;',
            '    }',
            '  }',
            '  return stack.length === 0;',
            '}',
          ],
          map: { init: 3, read: 4, push: 6, pop: 7, bad: 8, done: 11 },
        },
      },

      trace(t, [s]: [string]) {
        const stack: string[] = []
        const n = s.length

        const paint = (i: number, tone: Tone, stackTone?: Record<number, Tone>) => {
          const tones: Record<number, Tone> = {}
          for (let k = 0; k < n; k++) tones[k] = k < i ? 'done' : k > i ? 'idle' : tone
          return combo(
            text(s, {
              tones,
              pointers: i < n ? [{ name: 'i', at: i, accent: 'a' }] : [],
              title: 's',
            }),
            stackOf([...stack], { title: 'stack', tones: stackTone }),
          )
        }

        t.push({
          step: 'init',
          note: 'The stack holds every bracket that has been opened and not yet closed. Its top is always the one a closing bracket must answer to.',
          view: paint(0, 'idle'),
          vars: [['stack', '[]', 'mute']],
        })

        for (let i = 0; i < n; i++) {
          const ch = s[i]
          t.bump()

          if (!PAIRS[ch]) {
            stack.push(ch)
            t.push({
              step: 'push',
              note: `'${ch}' opens something. Push it — it now owes us a closer, and it jumps the queue ahead of everything opened before it.`,
              view: paint(i, 'active', { [stack.length - 1]: 'good' }),
              vars: [
                ['i', i, 'a'],
                ['ch', ch],
                ['depth', stack.length, 'ok'],
              ],
              badge: { text: `push ${ch}`, accent: 'ok' },
            })
            continue
          }

          const want = PAIRS[ch]
          const top = stack.length ? stack[stack.length - 1] : null

          if (top !== want) {
            t.push({
              step: 'bad',
              note:
                top == null
                  ? `'${ch}' wants to close something, but nothing is open. Invalid.`
                  : `'${ch}' needs '${want}' on top, but the top is '${top}'. The brackets cross instead of nesting, so the string is invalid.`,
              view: paint(i, 'bad', stack.length ? { [stack.length - 1]: 'bad' } : {}),
              vars: [
                ['i', i, 'a'],
                ['ch', ch],
                ['want', want, 'c'],
                ['top', top ?? 'none', 'no'],
              ],
              badge: { text: 'mismatch', accent: 'no' },
            })
            t.push({
              step: 'bad',
              note: 'Return false immediately — no later character can repair a crossed pair.',
              view: paint(i, 'bad', stack.length ? { [stack.length - 1]: 'bad' } : {}),
              vars: [['answer', 'false', 'no']],
              badge: { text: 'false', accent: 'no' },
            })
            return
          }

          t.push({
            step: 'pop',
            note: `'${ch}' matches the '${top}' on top. Pop it — that pair is now settled and can be forgotten.`,
            view: paint(i, 'good', { [stack.length - 1]: 'good' }),
            vars: [
              ['i', i, 'a'],
              ['ch', ch],
              ['matched', top, 'ok'],
            ],
            badge: { text: `${top}${ch} closed`, accent: 'ok' },
          })
          stack.pop()
        }

        const ok = stack.length === 0
        t.push({
          step: 'done',
          note: ok
            ? 'End of string with an empty stack — every opener found its closer in the right order. Valid.'
            : `End of string but ${stack.length} bracket(s) never closed. Invalid.`,
          view: paint(n, 'idle'),
          vars: [['answer', String(ok), ok ? 'ok' : 'no']],
          badge: { text: String(ok), accent: ok ? 'ok' : 'no' },
        })
      },

      run([s]: [string], c) {
        const stack: string[] = []
        for (const ch of s) {
          c.ops++
          if (!PAIRS[ch]) stack.push(ch)
          else if (stack.pop() !== PAIRS[ch]) return false
        }
        return stack.length === 0
      },
    },
  ],
}
