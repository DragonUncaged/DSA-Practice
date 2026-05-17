import { listOf, type Problem, type Tone } from '@/lib/types'

const DEMO: [number[], number] = [[1, 2, 3, 4, 5], 2]

export const removeNthFromEnd: Problem = {
  id: 'remove-nth-node-from-end-of-list',
  title: 'Remove Nth Node From End of List',
  group: 'Linked List',
  pattern: 'Two Pointers with a Gap',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/',
  statement: 'Remove the `n`-th node from the end of a linked list and return the head — in a single pass.',
  constraints: ['1 <= list length <= 30', '1 <= n <= list length', 'One pass encouraged'],
  signature: {
    fn: 'removeNthFromEnd',
    params: [
      { name: 'head', type: 'list' },
      { name: 'n', type: 'int' },
    ],
    ret: 'list',
  },
  tests: [
    { args: [[1, 2, 3, 4, 5], 2], expect: [1, 2, 3, 5] },
    { args: [[1], 1], expect: [], note: 'removing the only node' },
    { args: [[1, 2], 1], expect: [1], note: 'removing the tail' },
    { args: [[1, 2], 2], expect: [2], note: 'removing the head' },
  ],
  demo: DEMO,
  scale: (n) => [Array.from({ length: n }, (_, i) => i), Math.max(1, Math.floor(n / 2))],
  starter: {
    py: `def removeNthFromEnd(head, n):
    # head: ListNode | None, n: int  ->  ListNode | None
    pass
`,
    js: `function removeNthFromEnd(head, n) {
  // head: ListNode | null, n: number  ->  ListNode | null
}
`,
    cpp: `ListNode* removeNthFromEnd(ListNode* head, int n) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'gap',
      label: 'Two pointers, n apart',
      kind: 'optimal',
      time: 'O(L)',
      space: 'O(1)',
      blurb:
        'You cannot see the end coming in a singly linked list — but you can send a scout n nodes ahead. When the scout falls off the end, the trailing pointer is standing exactly one node before the victim. One pass, no counting pass first.',
      code: {
        py: {
          lines: [
            'def removeNthFromEnd(head, n):',
            '    dummy = ListNode(0, head)',
            '    lead = trail = dummy',
            '    for _ in range(n + 1):',
            '        lead = lead.next',
            '    while lead:',
            '        lead = lead.next',
            '        trail = trail.next',
            '    trail.next = trail.next.next',
            '    return dummy.next',
          ],
          map: { init: 3, lead: 5, walk: 8, cut: 9, done: 10 },
        },
        cpp: {
          lines: [
            'ListNode* removeNthFromEnd(ListNode* head, int n) {',
            '    ListNode dummy(0, head);',
            '    ListNode *lead = &dummy, *trail = &dummy;',
            '    for (int i = 0; i <= n; ++i) lead = lead->next;',
            '    while (lead) {',
            '        lead = lead->next;',
            '        trail = trail->next;',
            '    }',
            '    trail->next = trail->next->next;',
            '    return dummy.next;',
            '}',
          ],
          map: { init: 3, lead: 4, walk: 7, cut: 9, done: 10 },
        },
        js: {
          lines: [
            'function removeNthFromEnd(head, n) {',
            '  const dummy = new ListNode(0, head);',
            '  let lead = dummy;',
            '  let trail = dummy;',
            '  for (let i = 0; i <= n; i++) lead = lead.next;',
            '  while (lead) {',
            '    lead = lead.next;',
            '    trail = trail.next;',
            '  }',
            '  trail.next = trail.next.next;',
            '  return dummy.next;',
            '}',
          ],
          map: { init: 4, lead: 5, walk: 8, cut: 10, done: 11 },
        },
      },

      trace(t, [values, n]: [number[], number]) {
        const L = values.length
        const nodes = values.map((value, id) => ({ id, value }))
        // -1 stands for the dummy; positions are node indices, L means "off the end"
        let lead = -1
        let trail = -1
        const next: (number | null)[] = values.map((_, i) => (i === L - 1 ? null : i + 1))

        const view = (victim: number | null, tone: Tone) => {
          const tones: Record<number, Tone> = {}
          nodes.forEach((nd) => {
            tones[nd.id] = 'band'
          })
          if (victim != null) tones[victim] = tone
          return listOf(
            nodes,
            nodes.map((nd) => ({ from: nd.id, to: next[nd.id] })),
            {
              tones,
              pointers: [
                { name: 'trail', at: trail >= 0 && trail < L ? trail : null, accent: 'a' },
                { name: 'lead', at: lead >= 0 && lead < L ? lead : null, accent: 'b' },
              ],
              title: `list · removing ${n}-th from the end`,
            },
          )
        }

        t.push({
          step: 'init',
          note: `Both pointers start at a dummy before the head. First, the lead pointer gets a ${n + 1}-node head start.`,
          view: view(null, 'idle'),
          vars: [['n', n, 'c']],
        })

        for (let k = 0; k <= n && !t.full; k++) {
          lead++
          t.bump()
        }
        t.push({
          step: 'lead',
          note: `Lead has advanced ${n + 1} steps — the gap between the pointers is now exactly the distance we need to preserve.`,
          view: view(null, 'idle'),
          vars: [
            ['lead at', lead < L ? `index ${lead}` : 'off the end', 'b'],
            ['gap', n + 1, 'c'],
          ],
          badge: { text: `gap = ${n + 1}`, accent: 'c' },
        })

        while (lead < L && !t.full) {
          lead++
          trail++
          t.bump()
          t.push({
            step: 'walk',
            note: `March both pointers together — the gap never changes, so when lead falls off the end, trail will be just before the ${n}-th node from it.`,
            view: view(null, 'idle'),
            vars: [
              ['trail at', trail >= 0 ? `index ${trail}` : 'dummy', 'a'],
              ['lead at', lead < L ? `index ${lead}` : 'off the end', 'b'],
            ],
          })
        }

        const victim = trail + 1
        next[trail >= 0 ? trail : 0] = victim + 1 < L ? victim + 1 : null
        const result = values.filter((_, i) => i !== victim)
        t.push({
          step: 'cut',
          note: `Lead ran off the end, so trail (${trail >= 0 ? `index ${trail}` : 'the dummy'}) sits right before the victim: node ${values[victim]}. One pointer rewrite skips it — no node before it needed revisiting.`,
          view: view(victim, 'bad'),
          vars: [
            ['removed', values[victim], 'no'],
            ['result', result.join(' → ') || 'empty', 'ok'],
          ],
          badge: { text: `remove ${values[victim]}`, accent: 'no' },
        })

        t.push({
          step: 'done',
          note: `Done in a single pass: ${result.join(' → ') || 'an empty list'}.`,
          view: view(victim, 'dim'),
          vars: [['answer', `[${result.join(', ')}]`, 'ok']],
          badge: { text: 'removed', accent: 'ok' },
        })
      },

      run([values, n]: [number[], number], c) {
        // array model: same pointer walk, same op count
        const L = values.length
        let lead = 0
        for (let i = 0; i <= n; i++) {
          c.ops++
          lead++
        }
        let trail = 0
        while (lead <= L) {
          c.ops++
          lead++
          trail++
        }
        return values.filter((_, i) => i !== trail - 1)
      },
    },
  ],
}
