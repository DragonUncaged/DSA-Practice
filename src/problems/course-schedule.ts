import { arr, combo, stackOf, type Problem, type Tone } from '@/lib/types'

const DEMO: [number, number[][]] = [6, [[1, 0], [2, 0], [3, 1], [3, 2], [4, 3], [5, 4]]]

export const courseSchedule: Problem = {
  id: 'course-schedule',
  title: 'Course Schedule',
  group: 'Graph',
  pattern: 'Topological Sort',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/course-schedule/',
  statement:
    'There are `numCourses` courses; `prerequisites[i] = [a, b]` means course `b` must be taken before course `a`. Return `true` if every course can be finished — i.e. the prerequisite graph has no cycle.',
  constraints: ['1 <= numCourses <= 2000', '0 <= prerequisites.length <= 5000'],
  signature: {
    fn: 'canFinish',
    params: [
      { name: 'numCourses', type: 'int' },
      { name: 'prerequisites', type: 'int[][]' },
    ],
    ret: 'bool',
  },
  tests: [
    { args: [2, [[1, 0]]], expect: true },
    { args: [2, [[1, 0], [0, 1]]], expect: false, note: 'two courses requiring each other' },
    { args: [5, [[1, 4], [2, 4], [3, 1], [3, 2]]], expect: true },
    { args: [3, [[0, 1], [1, 2], [2, 0]]], expect: false, note: 'three-course cycle' },
    { args: [1, []], expect: true },
  ],
  demo: DEMO,
  scale: (n) => [n, Array.from({ length: n - 1 }, (_, i) => [i + 1, i])],
  starter: {
    js: `function canFinish(numCourses, prerequisites) {
  // numCourses: number, prerequisites: number[][]  ->  boolean
}
`,
    cpp: `bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'kahn',
      label: "Kahn's peeling",
      kind: 'optimal',
      time: 'O(V + E)',
      space: 'O(V + E)',
      blurb:
        'A course with zero unmet prerequisites can be taken right now. Take it, which unlocks its dependants, which may drop to zero themselves. If this peeling eventually takes every course, there was no cycle; a cycle is exactly the knot the peeling can never reach.',
      code: {
        cpp: {
          lines: [
            'bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {',
            '    vector<int> indeg(numCourses, 0);',
            '    vector<vector<int>> adj(numCourses);',
            '    for (auto& p : prerequisites) {',
            '        adj[p[1]].push_back(p[0]);',
            '        indeg[p[0]]++;',
            '    }',
            '    vector<int> queue;',
            '    for (int i = 0; i < numCourses; ++i)',
            '        if (indeg[i] == 0) queue.push_back(i);',
            '    int taken = 0;',
            '    while (!queue.empty()) {',
            '        int c = queue.back(); queue.pop_back();',
            '        taken++;',
            '        for (int nxt : adj[c])',
            '            if (--indeg[nxt] == 0) queue.push_back(nxt);',
            '    }',
            '    return taken == numCourses;',
            '}',
          ],
          map: { init: 10, take: 14, unlock: 16, free: 16, done: 18 },
        },
        js: {
          lines: [
            'function canFinish(numCourses, prerequisites) {',
            '  const indeg = new Array(numCourses).fill(0);',
            '  const adj = Array.from({ length: numCourses }, () => []);',
            '  for (const [a, b] of prerequisites) {',
            '    adj[b].push(a);',
            '    indeg[a]++;',
            '  }',
            '  const queue = [];',
            '  for (let i = 0; i < numCourses; i++) {',
            '    if (indeg[i] === 0) queue.push(i);',
            '  }',
            '  let taken = 0;',
            '  while (queue.length) {',
            '    const c = queue.pop();',
            '    taken++;',
            '    for (const nxt of adj[c]) {',
            '      indeg[nxt]--;',
            '      if (indeg[nxt] === 0) queue.push(nxt);',
            '    }',
            '  }',
            '  return taken === numCourses;',
            '}',
          ],
          map: { init: 10, take: 14, unlock: 17, free: 18, done: 21 },
        },
      },

      trace(t, [numCourses, prerequisites]: [number, number[][]]) {
        const indeg = new Array(numCourses).fill(0)
        const adj: number[][] = Array.from({ length: numCourses }, () => [])
        for (const [a, b] of prerequisites) {
          adj[b].push(a)
          indeg[a]++
        }
        const queue = indeg.map((d, i) => (d === 0 ? i : -1)).filter((i) => i >= 0)
        const takenSet = new Set<number>()

        const view = (focus: number | null, tone: Tone) => {
          const tones: Record<number, Tone> = {}
          for (let i = 0; i < numCourses; i++) {
            tones[i] = takenSet.has(i) ? 'done' : indeg[i] === 0 ? 'band' : 'idle'
          }
          if (focus != null) tones[focus] = tone
          return combo(
            arr(indeg.slice(), {
              tones,
              title: 'unmet prerequisites per course (index = course)',
            }),
            stackOf(queue.length ? [...queue] : [], { title: 'ready to take' }),
          )
        }

        t.push({
          step: 'init',
          note: `${numCourses} courses, ${prerequisites.length} prerequisite edges. Courses with zero unmet prerequisites (${queue.join(', ') || 'none'}) can start immediately.`,
          view: view(null, 'idle'),
          vars: [
            ['courses', numCourses],
            ['ready now', queue.length, queue.length ? 'ok' : 'no'],
          ],
        })

        let taken = 0
        while (queue.length && !t.full) {
          const c = queue.pop()!
          taken++
          takenSet.add(c)
          t.bump()
          t.push({
            step: 'take',
            note: `Course ${c} has no unmet prerequisites — take it (${taken} of ${numCourses} done). Its dependants each lose one requirement.`,
            view: view(c, 'good'),
            vars: [
              ['taken', c, 'ok'],
              ['progress', `${taken} / ${numCourses}`],
            ],
            badge: { text: `take ${c}`, accent: 'ok' },
          })

          for (const nxt of adj[c]) {
            indeg[nxt]--
            t.bump()
            if (indeg[nxt] === 0) {
              queue.push(nxt)
              t.push({
                step: 'free',
                note: `Course ${nxt} just lost its last prerequisite — it joins the ready pile.`,
                view: view(nxt, 'active'),
                vars: [
                  ['unlocked', nxt, 'c'],
                  ['ready', queue.length],
                ],
                badge: { text: `${nxt} unlocked`, accent: 'c' },
              })
            }
          }
        }

        const ok = taken === numCourses
        t.push({
          step: 'done',
          note: ok
            ? `All ${numCourses} courses were peeled off — the graph has no cycle. True.`
            : `Peeling stalled at ${taken} of ${numCourses}: the remaining courses all wait on each other in a cycle. False.`,
          view: view(null, 'idle'),
          vars: [['answer', String(ok), ok ? 'ok' : 'no']],
          badge: { text: String(ok), accent: ok ? 'ok' : 'no' },
        })
      },

      run([numCourses, prerequisites]: [number, number[][]], c) {
        const indeg = new Array(numCourses).fill(0)
        const adj: number[][] = Array.from({ length: numCourses }, () => [])
        for (const [a, b] of prerequisites) {
          c.ops++
          adj[b].push(a)
          indeg[a]++
        }
        const queue: number[] = []
        for (let i = 0; i < numCourses; i++) if (indeg[i] === 0) queue.push(i)
        let taken = 0
        while (queue.length) {
          const x = queue.pop()!
          taken++
          for (const nxt of adj[x]) {
            c.ops++
            if (--indeg[nxt] === 0) queue.push(nxt)
          }
        }
        return taken === numCourses
      },
    },
  ],
}
