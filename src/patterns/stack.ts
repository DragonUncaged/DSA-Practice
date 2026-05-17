import { combo, stackOf, text } from '@/lib/types'
import type { PatternIntro } from './index'

const S = '([]){}'
const OPEN: Record<string, string> = { ')': '(', ']': '[', '}': '{' }

export const stack: PatternIntro = {
  id: 'stack',
  name: 'Stack',
  tagline: 'The most recent unfinished thing is always the next thing to finish.',
  story: [
    'Some problems have a strict last-in, first-out discipline hiding in them: the most recently opened bracket must close first, the most recent function call returns first, the most recent smaller price is the first one a falling price meets. A stack is that discipline made into a data structure — push what is unfinished, and the top is always the one thing you are allowed to finish next.',
    'Watch the bracket demo below: openers go on, and every closer is only ever compared against the top. Nothing else can matter — anything deeper is, by definition, opened earlier and must close later. That one invariant kills the need to look anywhere else.',
    'The same shape powers iterative DFS (the stack is the recursion), undo histories, and monotonic-stack tricks where you keep the stack sorted and each element pops everything it defeats. If your scratch notes while solving by hand look like "put this aside until I finish that" — it is a stack.',
  ],
  signals: [
    'Matching or nesting: brackets, tags, quotes — validity depends on the most recent opener.',
    'You keep deferring things and always resume the latest one first.',
    'Recursion you want to run iteratively — the call stack becomes your stack.',
    '"Next greater/smaller element" questions — a monotonic stack retires candidates in order.',
  ],
  pseudo: {
    lines: [
      'stack = []',
      'for ch in s:',
      '    if opener: push it',
      '    elif ch matches top: pop',
      '    else: invalid',
      'valid if stack is empty',
    ],
    map: { init: 1, push: 3, pop: 4, bad: 5, done: 6 },
  },

  trace(t) {
    const st: string[] = []

    const view = (i: number | null, tone?: 'good' | 'bad') =>
      combo(
        text(S, {
          pointers: i == null ? [] : [{ name: 'ch', at: i, accent: 'a' }],
          tones: {
            ...Object.fromEntries(S.split('').map((_, j) => [j, i != null && j < i ? 'done' : 'idle'])),
            ...(i != null && tone ? { [i]: tone } : {}),
          },
          title: 'is the bracket string balanced?',
        }),
        stackOf(st.slice(), { title: 'stack — unfinished openers' }),
      )

    t.push({
      step: 'init',
      note: 'Empty stack. Every opener waits here until its closer shows up — newest on top.',
      view: view(null),
      vars: [],
    })

    for (let i = 0; i < S.length; i++) {
      const ch = S[i]
      t.bump()
      if (OPEN[ch] == null) {
        st.push(ch)
        t.push({
          step: 'push',
          note: `'${ch}' opens something — push it. It is now the one bracket allowed to close next.`,
          view: view(i),
          vars: [['top', st[st.length - 1], 'a']],
        })
      } else {
        const top = st[st.length - 1]
        const ok = top === OPEN[ch]
        if (!ok) {
          t.push({
            step: 'bad',
            note: `'${ch}' arrived but the top is '${top ?? 'nothing'}' — the nesting is broken.`,
            view: view(i, 'bad'),
            vars: [['top', top ?? '—', 'no']],
            badge: { text: 'invalid', accent: 'no' },
          })
          return
        }
        st.pop()
        t.push({
          step: 'pop',
          note: `'${ch}' matches the top '${top}' — pop it. Only the top could ever have mattered: everything deeper opened earlier and must close later.`,
          view: view(i, 'good'),
          vars: [['popped', top, 'ok']],
        })
      }
    }

    t.push({
      step: 'done',
      note: 'End of string with an empty stack: every opener found its closer in the right order. Balanced.',
      view: view(null),
      vars: [['stack', 'empty', 'ok']],
      badge: { text: 'valid', accent: 'ok' },
    })
  },

  ramp: ['valid-parentheses'],
}
