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
    { args: [[8, 9, 9, 9]], expect: [9, 0, 0, 0], note: 'the first digit absorbs a long carry' },
    { args: [[9, 0, 9]], expect: [9, 1, 0], note: 'a nine that is not part of the tail is untouched' },
  ],
  scale: (n) => [Array.from({ length: n }, () => 9)],
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
      id: 'copy-to-array',
      label: 'Copy the digits into an array and add there',
      kind: 'brute',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'Read the digits into an array, run the ordinary Plus One carry from the right, and build a fresh list from the result. Correct, and it sidesteps the linked list entirely — at the cost of a second copy of the whole number.',
      code: {
        cpp: {
          lines: [
            'ListNode* plusOne(ListNode* head) {',
            '    vector<int> digits;',
            '    for (ListNode* n = head; n; n = n->next) digits.push_back(n->val);',
            '    int i = digits.size() - 1;',
            '    while (i >= 0 && digits[i] == 9) digits[i--] = 0;',
            '    if (i >= 0) digits[i]++;',
            '    else digits.insert(digits.begin(), 1);',
            '    ListNode* out = nullptr;',
            '    for (int k = digits.size() - 1; k >= 0; --k) out = new ListNode(digits[k], out);',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function plusOne(head) {',
            '  const digits = [];',
            '  for (let n = head; n; n = n.next) digits.push(n.val);',
            '  let i = digits.length - 1;',
            '  while (i >= 0 && digits[i] === 9) digits[i--] = 0;',
            '  if (i >= 0) digits[i]++;',
            '  else digits.unshift(1);',
            '  let out = null;',
            '  for (let k = digits.length - 1; k >= 0; k--) out = new ListNode(digits[k], out);',
            '  return out;',
            '}',
          ],
        },
      },

      run([digits]: [number[]], c) {
        const out = digits.slice()
        c.ops += out.length // one read per digit
        let i = out.length - 1
        while (i >= 0 && out[i] === 9) {
          c.ops++
          out[i--] = 0
        }
        if (i >= 0) out[i]++
        else out.unshift(1)
        return out
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'reverse-add-reverse',
      label: 'Reverse, add with a carry, reverse back',
      kind: 'better',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'The carry wants to travel from the least significant digit, which is the wrong end of a singly linked list — so reverse the list, add one with an ordinary carry loop, and reverse it back. No copy, but three passes and a lot of pointer surgery for a one-digit change.',
      code: {
        cpp: {
          lines: [
            'static ListNode* reverse(ListNode* head) {',
            '    ListNode* prev = nullptr;',
            '    while (head) { ListNode* next = head->next; head->next = prev; prev = head; head = next; }',
            '    return prev;',
            '}',
            '',
            'ListNode* plusOne(ListNode* head) {',
            '    head = reverse(head);',
            '    ListNode* node = head;',
            '    int carry = 1;',
            '    while (node && carry) {',
            '        int sum = node->val + carry;',
            '        node->val = sum % 10;',
            '        carry = sum / 10;',
            '        if (carry && !node->next) node->next = new ListNode(0);',
            '        node = node->next;',
            '    }',
            '    return reverse(head);',
            '}',
          ],
        },
        js: {
          lines: [
            'function plusOne(head) {',
            '  const reverse = (node) => {',
            '    let prev = null;',
            '    while (node) { const next = node.next; node.next = prev; prev = node; node = next; }',
            '    return prev;',
            '  };',
            '',
            '  head = reverse(head);',
            '  let node = head;',
            '  let carry = 1;',
            '  while (node && carry) {',
            '    const sum = node.val + carry;',
            '    node.val = sum % 10;',
            '    carry = Math.floor(sum / 10);',
            '    if (carry && !node.next) node.next = new ListNode(0);',
            '    node = node.next;',
            '  }',
            '  return reverse(head);',
            '}',
          ],
        },
      },

      run([digits]: [number[]], c) {
        const rev = digits.slice().reverse()
        c.ops += rev.length // the first reversal
        let carry = 1
        for (let i = 0; i < rev.length && carry; i++) {
          c.ops++
          const sum = rev[i] + carry
          rev[i] = sum % 10
          carry = Math.floor(sum / 10)
          if (carry && i === rev.length - 1) rev.push(0)
        }
        c.ops += rev.length // the reversal back
        return rev.reverse()
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'last-non-nine',
      label: 'Find the last digit below nine',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'Adding one only ripples backwards through a tail of nines, so nothing needs reversing: find the rightmost digit that is not a nine, bump it, and zero everything after it. A dummy head in front means the all-nines case needs no special code — the dummy simply becomes the new leading digit. One forward pass, no extra nodes except the one the number may grow.',
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
        c.ops += digits.length
        return digits.length
      },
    },
  ],
}
