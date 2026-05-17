import { arr, combo, stackOf } from '@/lib/types'
import type { PatternIntro } from './index'

const CANDS = [2, 3, 5]
const TARGET = 8

export const backtracking: PatternIntro = {
  id: 'backtracking',
  name: 'Backtracking',
  tagline: 'Try a choice, explore its whole world, undo it — the undo is the algorithm.',
  story: [
    'When the answer is "all the ways" rather than "the best way", you are exploring a tree of choices. Backtracking walks that tree with one running path: *choose* (push a candidate), *explore* (recurse with the smaller problem), *unchoose* (pop it back off). That third step is the one beginners skip — and it is the entire mechanism. Popping restores the world exactly, so the next branch starts clean.',
    'The demo hunts combinations summing to 8 from {2, 3, 5}. Watch the path stack breathe: it grows down a branch, records a hit or slams into a dead end, then shrinks back to the last open choice. No state is copied anywhere — one path, mutated and un-mutated, visits every possibility.',
    'What makes it *fast enough* is pruning: the instant the running sum overshoots, the whole subtree below dies unexplored. Good backtracking problems are all about finding the earliest possible moment to say "nothing down here can work" — sort the candidates, pass a start index to kill duplicates, check constraints before recursing, not after.',
  ],
  signals: [
    'Enumerate all combinations, permutations, subsets, or paths — not count or optimize.',
    'Choices nest: each pick creates a smaller version of the same problem.',
    'Partial solutions can be rejected early — an overshoot or contradiction kills a branch.',
    'A maze or board walk where you must unmark your trail when you retreat.',
  ],
  pseudo: {
    lines: [
      'explore(path, remaining):',
      '    remaining == 0 → record the path',
      '    remaining < 0  → dead end, back up',
      '    for c in candidates:',
      '        push c · explore · pop c',
    ],
    map: { init: 1, hit: 2, cut: 3, push: 5, pop: 5 },
  },

  trace(t) {
    const path: number[] = []
    const hits: string[] = []

    const view = (tone?: 'good' | 'bad') =>
      combo(
        arr(CANDS, { showIndex: false, title: `candidates — combinations summing to ${TARGET} (reuse allowed)` }),
        stackOf(path.length ? path.slice() : ['—'], {
          tones: tone && path.length ? { [path.length - 1]: tone } : {},
          title: `the path — sum ${path.reduce((a, b) => a + b, 0)}`,
        }),
      )

    t.push({
      step: 'init',
      note: 'One shared path, pushed into and popped out of. Every possibility will be visited by the same few cells growing and shrinking.',
      view: view(),
      vars: [['remaining', TARGET]],
    })

    const explore = (remaining: number, start: number) => {
      if (t.full) return
      if (remaining === 0) {
        hits.push(`[${path.join('+')}]`)
        t.push({
          step: 'hit',
          note: `Sum is exactly ${TARGET} — record a copy of the path, then back up to hunt for more. Recording does not stop the search.`,
          view: view('good'),
          vars: [
            ['path', path.join(' + '), 'ok'],
            ['found', hits.length, 'ok'],
          ],
          badge: { text: `hit: ${path.join('+')} = ${TARGET}`, accent: 'ok' },
        })
        return
      }
      if (remaining < 0) {
        t.push({
          step: 'cut',
          note: `Overshot by ${-remaining} — nothing below this point can recover. The entire subtree dies without being visited: that is the pruning that makes this affordable.`,
          view: view('bad'),
          vars: [['overshoot', -remaining, 'no']],
          badge: { text: 'dead end — back up', accent: 'no' },
        })
        return
      }
      for (let i = start; i < CANDS.length; i++) {
        const c = CANDS[i]
        path.push(c)
        t.bump()
        explore(remaining - c, i)
        path.pop()
      }
    }

    explore(TARGET, 0)

    t.push({
      step: 'pop',
      note: `Search complete: ${hits.join('  ')}. The start-index trick meant [3,5] was found once, never again as [5,3] — dedup by construction, not by filtering.`,
      view: view(),
      vars: [['answers', hits.join('  '), 'ok']],
      badge: { text: `${hits.length} combinations`, accent: 'ok' },
    })
  },

  ramp: ['combination-sum', 'word-search'],
}
