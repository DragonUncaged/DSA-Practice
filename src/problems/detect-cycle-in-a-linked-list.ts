import { listOf, type Problem, type Tone } from '@/lib/types'

const DEMO: [[number[], number]] = [[[3, 2, 0, -4, 7], 1]]

export const detectCycle: Problem = {
  id: 'detect-cycle-in-a-linked-list',
  title: 'Detect Cycle in a Linked List',
  group: 'Linked List',
  pattern: 'Floyd Tortoise & Hare',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/linked-list-cycle/',
  statement:
    'Given the `head` of a linked list, return `true` if the list contains a cycle — i.e. following `next` pointers eventually revisits a node. Use O(1) memory.',
  constraints: ['0 <= number of nodes <= 10^4', 'O(1) memory required'],
  signature: { fn: 'hasCycle', params: [{ name: 'head', type: 'cycle' }], ret: 'bool' },
  tests: [
    { args: [[[3, 2, 0, -4], 1]], expect: true },
    { args: [[[1, 2], 0]], expect: true },
    { args: [[[1], -1]], expect: false, note: 'single node, no loop' },
    { args: [[[], -1]], expect: false, note: 'empty list' },
    { args: [[[1, 2, 3, 4, 5], -1]], expect: false },
  ],
  demo: DEMO,
  scale: (n) => [[Array.from({ length: n }, (_, i) => i), -1]],
  starter: {
    js: `function hasCycle(head) {
  // head: ListNode | null  ->  boolean
}
`,
    cpp: `bool hasCycle(ListNode* head) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'floyd',
      label: 'Slow walker, fast runner',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'Send two pointers down the list, one moving a single step, the other two. On a straight track the fast one simply falls off the end. On a circular one it laps the slow one — and because it gains exactly one position per move, it cannot skip over it: they collide.',
      code: {
        cpp: {
          lines: [
            'bool hasCycle(ListNode* head) {',
            '    ListNode *slow = head, *fast = head;',
            '    while (fast && fast->next) {',
            '        slow = slow->next;',
            '        fast = fast->next->next;',
            '        if (slow == fast) return true;',
            '    }',
            '    return false;',
            '}',
          ],
          map: { init: 2, move: 5, meet: 6, done: 8 },
        },
        js: {
          lines: [
            'function hasCycle(head) {',
            '  let slow = head;',
            '  let fast = head;',
            '  while (fast && fast.next) {',
            '    slow = slow.next;',
            '    fast = fast.next.next;',
            '    if (slow === fast) return true;',
            '  }',
            '  return false;',
            '}',
          ],
          map: { init: 3, move: 6, meet: 7, done: 9 },
        },
      },

      trace(t, [[values, pos]]: [[number[], number]]) {
        const n = values.length
        const nodes = values.map((value, id) => ({ id, value }))
        const next = (i: number): number | null => (i === n - 1 ? (pos >= 0 ? pos : null) : i + 1)
        const links = nodes.map((nd) => ({ from: nd.id, to: next(nd.id) }))

        const view = (slow: number | null, fast: number | null, tone: Tone) => {
          const tones: Record<number, Tone> = {}
          nodes.forEach((nd) => {
            tones[nd.id] = pos >= 0 && nd.id >= pos ? 'band' : 'idle'
          })
          if (slow != null) tones[slow] = tone
          if (fast != null && fast === slow) tones[fast] = 'good'
          return listOf(nodes, links, {
            tones,
            pointers: [
              { name: 'slow', at: slow, accent: 'a' },
              { name: 'fast', at: fast, accent: 'b' },
            ],
            title: pos >= 0 ? `list — the tail loops back to index ${pos}` : 'list — no loop',
          })
        }

        if (n === 0) {
          t.push({
            step: 'done',
            note: 'An empty list has nowhere to loop. False.',
            view: listOf([], [], { title: 'list (empty)' }),
            vars: [['answer', 'false', 'no']],
          })
          return
        }

        let slow = 0
        let fast = 0

        t.push({
          step: 'init',
          note: 'Both pointers start at the head. The fast one moves two nodes per beat, the slow one moves one — a gain of exactly one position per beat.',
          view: view(slow, fast, 'active'),
          vars: [
            ['slow', values[slow], 'a'],
            ['fast', values[fast], 'b'],
          ],
        })

        let guard = 0
        while (guard++ < 3 * n + 6 && !t.full) {
          const fastNext = next(fast)
          if (fastNext == null || next(fastNext) == null) {
            t.push({
              step: 'done',
              note: 'The fast pointer ran off the end of the list. A cycle has no end to run off — so there is none. False.',
              view: view(slow, fast, 'dim'),
              vars: [['answer', 'false', 'no']],
              badge: { text: 'no cycle', accent: 'no' },
            })
            return
          }
          slow = next(slow)!
          fast = next(fastNext)!
          t.bump()

          if (slow === fast) {
            t.push({
              step: 'meet',
              note: `Both pointers landed on node ${values[slow]} (index ${slow}). On a straight track the fast one could never fall back onto the slow one — only a loop makes that possible. True.`,
              view: view(slow, fast, 'good'),
              vars: [
                ['met at', values[slow], 'ok'],
                ['answer', 'true', 'ok'],
              ],
              badge: { text: 'they met — cycle', accent: 'ok' },
            })
            return
          }

          t.push({
            step: 'move',
            note: `Beat ${guard}: slow is at index ${slow}, fast at ${fast}. The gap ${pos >= 0 ? 'shrinks by one each beat inside the loop' : 'just grows'}.`,
            view: view(slow, fast, 'active'),
            vars: [
              ['slow at', slow, 'a'],
              ['fast at', fast, 'b'],
            ],
          })
        }
      },

      run([[values, pos]]: [[number[], number]], c) {
        const n = values.length
        const next = (i: number): number => (i === n - 1 ? pos : i + 1)
        if (n === 0) return false
        let slow = 0
        let fast = 0
        for (;;) {
          c.ops++
          const f1 = next(fast)
          if (f1 < 0) return false
          const f2 = next(f1)
          if (f2 < 0) return false
          slow = next(slow)
          fast = f2
          if (slow === fast) return true
        }
      },
    },
  ],
}
