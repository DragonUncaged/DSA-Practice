import type { Problem } from '@/lib/types'

export const verifyPreorderSequence: Problem = {
  id: 'verify-preorder-sequence-in-binary-search-tree',
  title: 'Verify Preorder Sequence in Binary Search Tree',
  group: 'Medium',
  pattern: 'Monotonic Stack',
  difficulty: 'Medium',
  leetcode:
    'https://leetcode.com/problems/verify-preorder-sequence-in-binary-search-tree/',
  statement:
    'Given an array of unique integers `preorder`, return true when it could be the preorder traversal of some binary search tree.',
  constraints: [
    '1 <= preorder.length <= 10^4',
    '1 <= preorder[i] <= 10^4',
    'All values in preorder are unique',
  ],
  signature: {
    fn: 'verifyPreorder',
    params: [{ name: 'preorder', type: 'int[]' }],
    ret: 'bool',
  },
  tests: [
    { args: [[5, 2, 1, 3, 6]], expect: true },
    { args: [[5, 2, 6, 1, 3]], expect: false, note: '1 appears after moving into the right subtree' },
    { args: [[1]], expect: true, note: 'single node' },
    { args: [[1, 2]], expect: true, note: 'right child' },
    { args: [[2, 1]], expect: true, note: 'left child' },
    { args: [[3, 1, 2, 5, 4, 6]], expect: true },
    { args: [[1, 3, 4, 2]], expect: false, note: '2 is smaller than a bound already crossed' },
  ],
  demo: [[5, 2, 1, 3, 6]],
  starter: {
    js: `function verifyPreorder(preorder) {
  // preorder: number[]  ->  boolean
}
`,
    cpp: `bool verifyPreorder(vector<int>& preorder) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'stack',
      label: 'Stack of pending ancestors with a lower bound',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'Descending values are left children, so push them. The first value larger than the stack top means we have finished a left subtree and moved right — pop everything smaller and remember the last popped node as a floor. Nothing after that may drop below it.',
      code: {
        cpp: {
          lines: [
            'bool verifyPreorder(vector<int>& preorder) {',
            '    vector<int> stack;',
            '    int lower = INT_MIN;',
            '    for (int x : preorder) {',
            '        if (x < lower) return false;',
            '        while (!stack.empty() && stack.back() < x) {',
            '            lower = stack.back();',
            '            stack.pop_back();',
            '        }',
            '        stack.push_back(x);',
            '    }',
            '    return true;',
            '}',
          ],
        },
        js: {
          lines: [
            'function verifyPreorder(preorder) {',
            '  const stack = [];',
            '  let lower = -Infinity;',
            '  for (const x of preorder) {',
            '    if (x < lower) return false;',
            '    while (stack.length && stack[stack.length - 1] < x) {',
            '      lower = stack.pop();',
            '    }',
            '    stack.push(x);',
            '  }',
            '  return true;',
            '}',
          ],
        },
      },

      run([preorder]: [number[]], c) {
        const stack: number[] = []
        let lower = -Infinity
        for (const x of preorder) {
          c.ops++
          if (x < lower) return false
          while (stack.length && stack[stack.length - 1] < x) lower = stack.pop()!
          stack.push(x)
        }
        return true
      },
    },
  ],
}
