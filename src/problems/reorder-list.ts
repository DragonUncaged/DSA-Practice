import { listOf, type Problem, type Tone } from '@/lib/types'

const DEMO: [number[]] = [[1, 2, 3, 4, 5]]

export const reorderList: Problem = {
  id: 'reorder-list',
  title: 'Reorder List',
  group: 'Linked List',
  pattern: 'Middle + Reverse + Weave',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/reorder-list/',
  statement:
    'Reorder a list L0 → L1 → ... → Ln into L0 → Ln → L1 → Ln-1 → ... in place, and return the head. Node values must not be modified — only pointers.',
  constraints: ['1 <= nodes <= 5 * 10^4', 'Rewire pointers, not values'],
  signature: { fn: 'reorderList', params: [{ name: 'head', type: 'list' }], ret: 'list' },
  tests: [
    { args: [[1, 2, 3, 4]], expect: [1, 4, 2, 3] },
    { args: [[1, 2, 3, 4, 5]], expect: [1, 5, 2, 4, 3] },
    { args: [[1]], expect: [1], note: 'single node' },
    { args: [[1, 2]], expect: [1, 2] },
  ],
  demo: DEMO,
  scale: (n) => [Array.from({ length: n }, (_, i) => i)],
  starter: {
    js: `function reorderList(head) {
  // head: ListNode | null  ->  ListNode | null  (return the head)
}
`,
    cpp: `ListNode* reorderList(ListNode* head) {
    // return the head after reordering
}
`,
  },

  solutions: [
    {
      id: 'three-step',
      label: 'Find the middle, reverse the back, weave',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'Three moves you already know: slow/fast pointers find the middle, the back half reverses in place, and then the two halves interleave like shuffling two half-decks together. Each step is linear and reuses a standard pattern.',
      code: {
        cpp: {
          lines: [
            'ListNode* reorderList(ListNode* head) {',
            '    if (!head || !head->next) return head;',
            '    ListNode *slow = head, *fast = head;',
            '    while (fast->next && fast->next->next) {',
            '        slow = slow->next; fast = fast->next->next;',
            '    }',
            '    ListNode* second = slow->next;',
            '    slow->next = nullptr;',
            '    ListNode* prev = nullptr;',
            '    while (second) {',
            '        ListNode* nxt = second->next;',
            '        second->next = prev; prev = second; second = nxt;',
            '    }',
            '    ListNode *a = head, *b = prev;',
            '    while (b) {',
            '        ListNode *an = a->next, *bn = b->next;',
            '        a->next = b; b->next = an;',
            '        a = an; b = bn;',
            '    }',
            '    return head;',
            '}',
          ],
          map: { init: 3, mid: 7, rev: 12, weave: 17, done: 20 },
        },
        js: {
          lines: [
            'function reorderList(head) {',
            '  if (!head || !head.next) return head;',
            '  let slow = head;',
            '  let fast = head;',
            '  while (fast.next && fast.next.next) {',
            '    slow = slow.next;',
            '    fast = fast.next.next;',
            '  }',
            '  let second = slow.next;',
            '  slow.next = null;',
            '  let prev = null;',
            '  while (second) {',
            '    const nxt = second.next;',
            '    second.next = prev;',
            '    prev = second;',
            '    second = nxt;',
            '  }',
            '  let a = head;',
            '  let b = prev;',
            '  while (b) {',
            '    const an = a.next;',
            '    const bn = b.next;',
            '    a.next = b;',
            '    b.next = an;',
            '    a = an;',
            '    b = bn;',
            '  }',
            '  return head;',
            '}',
          ],
          map: { init: 3, mid: 9, rev: 14, weave: 23, done: 29 },
        },
      },

      trace(t, [values]: [number[]]) {
        const n = values.length
        const nodes = values.map((value, id) => ({ id, value }))
        const next: (number | null)[] = values.map((_, i) => (i === n - 1 ? null : i + 1))

        const view = (
          pointers: { name: string; at: number | null; accent: 'a' | 'b' | 'c' }[],
          tones: Record<number, Tone>,
        ) =>
          listOf(
            nodes,
            nodes.map((nd) => ({ from: nd.id, to: next[nd.id] })),
            { tones, pointers, title: 'list — boxes never move, arrows do' },
          )

        const baseTones = (): Record<number, Tone> =>
          Object.fromEntries(nodes.map((nd) => [nd.id, 'band' as Tone]))

        if (n <= 2) {
          t.push({
            step: 'init',
            note: 'With two nodes or fewer, the reorder is already the identity.',
            view: view([], baseTones()),
            vars: [['answer', values.join(' → '), 'ok']],
          })
          return
        }

        t.push({
          step: 'init',
          note: 'Step 1 of 3: find the middle with slow/fast pointers so the list can be split in half.',
          view: view([{ name: 'head', at: 0, accent: 'a' }], baseTones()),
          vars: [['length', n]],
        })

        let slow = 0
        let fast = 0
        while (next[fast] != null && next[next[fast]!] != null && !t.full) {
          slow = next[slow]!
          fast = next[next[fast]!]!
          t.bump()
        }

        const mid = slow
        const secondStart = next[mid]!
        next[mid] = null
        t.push({
          step: 'mid',
          note: `Slow stopped at ${values[mid]} while fast raced ahead — that is the midpoint. Cut the list there: front half ends at ${values[mid]}, back half starts at ${values[secondStart]}.`,
          view: view(
            [
              { name: 'slow', at: mid, accent: 'a' },
              { name: 'second', at: secondStart, accent: 'b' },
            ],
            baseTones(),
          ),
          vars: [
            ['middle', values[mid], 'a'],
            ['back half from', values[secondStart], 'b'],
          ],
          badge: { text: `split after ${values[mid]}`, accent: 'c' },
        })

        // reverse the back half
        let prev: number | null = null
        let cur: number | null = secondStart
        while (cur != null && !t.full) {
          const nxt: number | null = next[cur]
          next[cur] = prev
          prev = cur
          cur = nxt
          t.bump()
        }
        t.push({
          step: 'rev',
          note: `Step 2 of 3: the back half reverses in place (the Reverse a Linked List move). It now runs ${values[prev!]} backwards toward ${values[secondStart]}.`,
          view: view([{ name: 'tail head', at: prev, accent: 'b' }], baseTones()),
          vars: [['back half', `${values[prev!]} → ... → ${values[secondStart]}`, 'b']],
          badge: { text: 'back half reversed', accent: 'b' },
        })

        // weave
        let a: number | null = 0
        let b: number | null = prev
        while (b != null && !t.full) {
          const an: number | null = next[a!]
          const bn: number | null = next[b]
          next[a!] = b
          next[b] = an
          t.bump()
          t.push({
            step: 'weave',
            note: `Step 3 of 3: weave — ${values[a!]} now points at ${values[b]}, which points back into the front half. One node from each half, alternating.`,
            view: view(
              [
                { name: 'front', at: an, accent: 'a' },
                { name: 'back', at: bn, accent: 'b' },
              ],
              { ...baseTones(), [a!]: 'good', [b]: 'good' },
            ),
            vars: [
              ['stitched', `${values[a!]} → ${values[b]}`, 'ok'],
            ],
            badge: { text: `${values[a!]} → ${values[b]}`, accent: 'ok' },
          })
          a = an
          b = bn
        }

        // read the final order for the closing frame
        const order: number[] = []
        let p: number | null = 0
        let guard = 0
        while (p != null && guard++ <= n) {
          order.push(values[p])
          p = next[p]
        }

        t.push({
          step: 'done',
          note: `Reordered: ${order.join(' → ')}. Three linear passes, no extra memory, and no value ever moved between boxes.`,
          view: view([], Object.fromEntries(nodes.map((nd) => [nd.id, 'good' as Tone]))),
          vars: [['answer', `[${order.join(', ')}]`, 'ok']],
          badge: { text: 'reordered', accent: 'ok' },
        })
      },

      run([values]: [number[]], c) {
        // array model of the same three passes
        const n = values.length
        if (n <= 2) return values
        let slow = 0
        let fast = 0
        while (fast + 2 < n) {
          c.ops++
          slow++
          fast += 2
        }
        const front = values.slice(0, slow + 1)
        const back = values.slice(slow + 1).reverse()
        for (let i = 0; i < back.length; i++) c.ops++
        const out: number[] = []
        for (let i = 0; i < front.length; i++) {
          c.ops++
          out.push(front[i])
          if (i < back.length) out.push(back[i])
        }
        return out
      },
    },
  ],
}
