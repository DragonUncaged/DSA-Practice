import type { Problem } from '@/lib/types'

export const plusOneLinkedList: Problem = {
  id: 'plus-one-linked-list',
  title: 'Plus One Linked List',
  group: 'Medium',
  pattern: 'Linked List',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/plus-one-linked-list/',
  statement:
    'A non-negative integer is stored as a linked list of digits, most significant first. Add one to it and return the resulting list.',
  constraints: [
    'The number of nodes is in the range [1, 100]',
    '0 <= Node.val <= 9',
    'The number has no leading zeros, except for zero itself',
  ],
  signature: { fn: 'plusOne', params: [{ name: 'head', type: 'list' }], ret: 'list' },
  tests: [
    { args: [[1, 2, 3]], expect: [1, 2, 4] },
    { args: [[0]], expect: [1], note: 'zero' },
    { args: [[9]], expect: [1, 0], note: 'the number grows a digit' },
    { args: [[9, 9]], expect: [1, 0, 0] },
    { args: [[1, 9, 9]], expect: [2, 0, 0], note: 'carry stops in the middle' },
  ],
  demo: [[1, 2, 3]],
  starter: {
    js: `function plusOne(head) {
  // head: ListNode  ->  ListNode
}
`,
    cpp: `ListNode* plusOne(ListNode* head) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'last-non-nine',
      label: 'Find the last digit below nine',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'Adding one only ripples backwards through a tail of nines, so find the rightmost digit that is not a nine, bump it, and zero everything after it. A dummy head in front means the all-nines case needs no special code — the dummy simply becomes the new leading digit.',
      code: {
        cpp: {
          lines: [
            'ListNode* plusOne(ListNode* head) {',
            '    ListNode dummy(0, head);',
            '    ListNode* lastLow = &dummy;',
            '    for (ListNode* node = head; node; node = node->next)',
            '        if (node->val != 9) lastLow = node;',
            '',
            '    lastLow->val++;',
            '    for (ListNode* node = lastLow->next; node; node = node->next) node->val = 0;',
            '',
            '    return dummy.val == 0 ? dummy.next : new ListNode(dummy.val, dummy.next);',
            '}',
          ],
        },
        js: {
          lines: [
            'function plusOne(head) {',
            '  const dummy = new ListNode(0, head);',
            '  let lastLow = dummy;',
            '  for (let node = head; node; node = node.next) {',
            '    if (node.val !== 9) lastLow = node;',
            '  }',
            '',
            '  lastLow.val++;',
            '  for (let node = lastLow.next; node; node = node.next) node.val = 0;',
            '',
            '  return dummy.val === 0 ? dummy.next : dummy;',
            '}',
          ],
        },
      },

      run([digits]: [number[]], c) {
        // the harness rebuilds the list; the cost here is one visit per digit
        for (const _ of digits) c.ops++
        return digits.length
      },
    },
  ],
}
