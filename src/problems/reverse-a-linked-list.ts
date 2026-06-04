import { listOf, type Problem, type Tone } from '@/lib/types'

const DEMO: [number[]] = [[1, 2, 3, 4, 5]]

export const reverseLinkedList: Problem = {
  id: 'reverse-a-linked-list',
  title: 'Reverse a Linked List',
  group: 'Linked List',
  pattern: 'Pointer Rewiring',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/reverse-linked-list/',
  statement:
    'Given the `head` of a singly linked list, reverse it in place and return the new head. `ListNode` is already defined for you.',
  constraints: ['0 <= number of nodes <= 5000', '-5000 <= Node.val <= 5000', 'O(1) extra space'],
  signature: { fn: 'reverseList', params: [{ name: 'head', type: 'list' }], ret: 'list' },
  tests: [
    { args: [[1, 2, 3, 4, 5]], expect: [5, 4, 3, 2, 1] },
    { args: [[1, 2]], expect: [2, 1] },
    { args: [[]], expect: [], note: 'empty list' },
    { args: [[7]], expect: [7], note: 'single node' },
  ],
  demo: DEMO,
  scale: (n) => [Array.from({ length: n }, (_, i) => i + 1)],
  starter: {
    js: `function reverseList(head) {
  // head: ListNode | null  ->  ListNode | null
}
`,
    cpp: `ListNode* reverseList(ListNode* head) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'three-pointer',
      label: 'Rewire as you walk',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'Nothing moves. Walk the list once and flip each arrow to point backwards instead of forwards. The only catch is that flipping an arrow destroys your way onward, so you have to save the next node first.',
      code: {
        cpp: {
          lines: [
            'ListNode* reverseList(ListNode* head) {',
            '    ListNode* prev = nullptr;',
            '    ListNode* cur = head;',
            '    while (cur) {',
            '        ListNode* nxt = cur->next;',
            '        cur->next = prev;',
            '        prev = cur;',
            '        cur = nxt;',
            '    }',
            '    return prev;',
            '}',
          ],
          map: { init: 3, save: 5, flip: 6, advance: 8, done: 10 },
        },
        js: {
          lines: [
            'function reverseList(head) {',
            '  let prev = null;',
            '  let cur = head;',
            '  while (cur) {',
            '    const nxt = cur.next;',
            '    cur.next = prev;',
            '    prev = cur;',
            '    cur = nxt;',
            '  }',
            '  return prev;',
            '}',
          ],
          map: { init: 3, save: 5, flip: 6, advance: 8, done: 10 },
        },
      },

      trace(t, [values]: [number[]]) {
        const n = values.length
        const nodes = values.map((value, id) => ({ id, value }))
        // next[id] is the node this one currently points at
        const next: (number | null)[] = values.map((_, i) => (i === n - 1 ? null : i + 1))

        let prev: number | null = null
        let cur: number | null = n ? 0 : null
        let nxt: number | null = null

        const paint = (tone: Tone) => {
          const tones: Record<number, Tone> = {}
          nodes.forEach((nd) => {
            const reversed = next[nd.id] !== null && (next[nd.id] as number) < nd.id
            tones[nd.id] = reversed ? 'done' : 'band'
          })
          if (cur != null) tones[cur] = tone
          return listOf(
            nodes,
            nodes.map((nd) => ({ from: nd.id, to: next[nd.id] })),
            {
              tones,
              pointers: [
                { name: 'prev', at: prev, accent: 'a' },
                { name: 'cur', at: cur, accent: 'b' },
                { name: 'next', at: nxt, accent: 'c' },
              ],
              title: 'list',
            },
          )
        }

        t.push({
          step: 'init',
          note: 'Three names are enough: what came before, where we are, and where we were about to go. The boxes never move — only the arrows between them change.',
          view: paint('active'),
          vars: [
            ['prev', 'null', 'a'],
            ['cur', cur == null ? 'null' : values[cur], 'b'],
          ],
        })

        while (cur != null && !t.full) {
          nxt = next[cur]
          t.bump()

          t.push({
            step: 'save',
            note: `Save the next node${nxt == null ? ' — there is none, this is the tail' : ` (${values[nxt]})`} before touching anything. The moment this arrow flips, the rest of the list becomes unreachable from here.`,
            view: paint('active'),
            vars: [
              ['cur', values[cur], 'b'],
              ['next', nxt == null ? 'null' : values[nxt], 'c'],
              ['prev', prev == null ? 'null' : values[prev], 'a'],
            ],
            badge: { text: 'save next', accent: 'c' },
          })

          next[cur] = prev
          t.push({
            step: 'flip',
            note:
              prev == null
                ? `Point ${values[cur]} at null. It was the head; it is about to become the tail.`
                : `Point ${values[cur]} back at ${values[prev]}. That arrow is now reversed for good.`,
            view: paint('good'),
            vars: [
              ['cur', values[cur], 'b'],
              ['cur.next', prev == null ? 'null' : values[prev], 'a'],
            ],
            badge: { text: 'arrow reversed', accent: 'ok' },
          })

          prev = cur
          cur = nxt
          nxt = null

          t.push({
            step: 'advance',
            note:
              cur == null
                ? `Walked off the end. ${values[prev]} is the last node reached, which makes it the new head.`
                : `Shuffle all three names one node along and repeat.`,
            view: paint('active'),
            vars: [
              ['prev', prev == null ? 'null' : values[prev], 'a'],
              ['cur', cur == null ? 'null' : values[cur], 'b'],
            ],
          })
        }

        t.push({
          step: 'done',
          note:
            prev == null
              ? 'The list was empty, so there is nothing to return.'
              : `Reversed in one pass with three variables and no new nodes. The new head is ${values[prev]}.`,
          view: paint('good'),
          vars: [['new head', prev == null ? 'null' : values[prev], 'ok']],
          badge: { text: 'reversed', accent: 'ok' },
        })
      },

      run([values]: [number[]], c) {
        // the op count is what matters here, not the structure
        let prev: number | null = null
        for (let i = 0; i < values.length; i++) {
          c.ops++
          prev = i
        }
        return prev
      },
    },
  ],
}
