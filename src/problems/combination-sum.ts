import { arr, combo, stackOf, type Problem, type Tone } from '@/lib/types'

const DEMO: [number[], number] = [[2, 3, 6, 7], 7]

export const combinationSum: Problem = {
  id: 'combination-sum',
  title: 'Combination Sum',
  group: 'Dynamic Programming',
  pattern: 'Backtracking',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/combination-sum/',
  statement:
    'Given distinct candidates and a `target`, return all unique combinations where the chosen numbers sum to `target`. The same number may be chosen unlimited times.',
  constraints: ['1 <= candidates.length <= 30', 'All candidates are distinct', 'Reuse is allowed'],
  signature: {
    fn: 'combinationSum',
    params: [
      { name: 'candidates', type: 'int[]' },
      { name: 'target', type: 'int' },
    ],
    ret: 'int[][]',
  },
  compare: 'set',
  tests: [
    { args: [[2, 3, 6, 7], 7], expect: [[2, 2, 3], [7]] },
    { args: [[2, 3, 5], 8], expect: [[2, 2, 2, 2], [2, 3, 3], [3, 5]] },
    { args: [[2], 1], expect: [] },
    { args: [[1], 2], expect: [[1, 1]] },
  ],
  demo: DEMO,
  starter: {
    py: `def combinationSum(candidates, target):
    # candidates: list[int], target: int  ->  list[list[int]]
    pass
`,
    js: `function combinationSum(candidates, target) {
  // candidates: number[], target: number  ->  number[][]
}
`,
    cpp: `vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'backtrack',
      label: 'Choose, explore, un-choose',
      kind: 'optimal',
      time: 'O(k^(t/min))',
      space: 'O(t/min)',
      blurb:
        'Depth-first: pick a candidate, subtract it, recurse on what remains, then take it back and try the next. Starting each level at the current index — never earlier — is what stops [2,3] and [3,2] both appearing.',
      code: {
        py: {
          lines: [
            'def combinationSum(candidates, target):',
            '    out = []',
            '    path = []',
            '    def dig(start, remain):',
            '        if remain == 0:',
            '            out.append(path[:])',
            '            return',
            '        for i in range(start, len(candidates)):',
            '            c = candidates[i]',
            '            if c > remain:',
            '                continue',
            '            path.append(c)',
            '            dig(i, remain - c)',
            '            path.pop()',
            '    dig(0, target)',
            '    return out',
          ],
          map: { init: 15, pick: 12, found: 6, over: 11, back: 14, done: 16 },
        },
        cpp: {
          lines: [
            'vector<vector<int>> combinationSum(vector<int>& candidates, int target) {',
            '    vector<vector<int>> out;',
            '    vector<int> path;',
            '    function<void(int, int)> dig = [&](int start, int remain) {',
            '        if (remain == 0) { out.push_back(path); return; }',
            '        for (int i = start; i < candidates.size(); ++i) {',
            '            if (candidates[i] > remain) continue;',
            '            path.push_back(candidates[i]);',
            '            dig(i, remain - candidates[i]);',
            '            path.pop_back();',
            '        }',
            '    };',
            '    dig(0, target);',
            '    return out;',
            '}',
          ],
          map: { init: 13, pick: 8, found: 5, over: 7, back: 10, done: 14 },
        },
        js: {
          lines: [
            'function combinationSum(candidates, target) {',
            '  const out = [];',
            '  const path = [];',
            '  const dig = (start, remain) => {',
            '    if (remain === 0) {',
            '      out.push([...path]);',
            '      return;',
            '    }',
            '    for (let i = start; i < candidates.length; i++) {',
            '      if (candidates[i] > remain) continue;',
            '      path.push(candidates[i]);',
            '      dig(i, remain - candidates[i]);',
            '      path.pop();',
            '    }',
            '  };',
            '  dig(0, target);',
            '  return out;',
            '}',
          ],
          map: { init: 16, pick: 11, found: 6, over: 10, back: 13, done: 17 },
        },
      },

      trace(t, [candidates, target]: [number[], number]) {
        const out: number[][] = []
        const path: number[] = []

        const view = (focus: number | null, tone: Tone) => {
          const tones: Record<number, Tone> = {}
          candidates.forEach((_, k) => {
            tones[k] = focus == null ? 'idle' : k === focus ? tone : 'idle'
          })
          return combo(
            arr(candidates, { tones, title: 'candidates' }),
            stackOf(path.length ? [...path] : [], { title: `path · sum ${path.reduce((a, x) => a + x, 0)}` }),
          )
        }

        t.push({
          step: 'init',
          note: `Target ${target}. Walk down the tree of choices: each level may reuse the current candidate or move right, never left — that ordering is the duplicate-killer.`,
          view: view(null, 'idle'),
          vars: [['target', target]],
        })

        const dig = (start: number, remain: number) => {
          if (t.full) return
          if (remain === 0) {
            out.push([...path])
            t.push({
              step: 'found',
              note: `Remaining hit exactly 0 — [${path.join(', ')}] is a valid combination. Record a copy and back out to keep searching.`,
              view: view(null, 'good'),
              vars: [
                ['combination', `[${path.join(', ')}]`, 'ok'],
                ['found', out.length, 'ok'],
              ],
              badge: { text: `#${out.length}: [${path.join(', ')}]`, accent: 'ok' },
            })
            return
          }
          for (let i = start; i < candidates.length && !t.full; i++) {
            const c = candidates[i]
            t.bump()
            if (c > remain) {
              t.push({
                step: 'over',
                note: `${c} overshoots the remaining ${remain} — prune this branch without descending.`,
                view: view(i, 'bad'),
                vars: [
                  ['candidate', c, 'no'],
                  ['remaining', remain],
                ],
                badge: { text: `${c} > ${remain}`, accent: 'no' },
              })
              continue
            }
            path.push(c)
            t.push({
              step: 'pick',
              note: `Take a ${c}. Remaining drops to ${remain - c}; recursion continues from index ${i} so ${c} may be taken again but nothing earlier can.`,
              view: view(i, 'active'),
              vars: [
                ['picked', c, 'c'],
                ['remaining', remain - c],
                ['depth', path.length],
              ],
              badge: { text: `pick ${c}`, accent: 'c' },
            })
            dig(i, remain - c)
            path.pop()
            t.push({
              step: 'back',
              note: `Un-choose the ${c} — that branch is exhausted. The path shrinks and the loop tries the next candidate.`,
              view: view(i, 'dim'),
              vars: [
                ['backtracked', c, 'mute'],
                ['depth', path.length],
              ],
            })
          }
        }

        dig(0, target)

        t.push({
          step: 'done',
          note: `${out.length} combination${out.length === 1 ? '' : 's'} reach ${target}. Backtracking visited ${t.ops} choice points, pruning every branch that overshot.`,
          view: view(null, 'idle'),
          vars: [['answer', JSON.stringify(out), 'ok']],
          badge: { text: `${out.length} found`, accent: 'ok' },
        })
      },

      run([candidates, target]: [number[], number], c) {
        const out: number[][] = []
        const path: number[] = []
        const dig = (start: number, remain: number) => {
          if (remain === 0) {
            out.push([...path])
            return
          }
          for (let i = start; i < candidates.length; i++) {
            c.ops++
            if (candidates[i] > remain) continue
            path.push(candidates[i])
            dig(i, remain - candidates[i])
            path.pop()
          }
        }
        dig(0, target)
        return out
      },
    },
  ],
}
