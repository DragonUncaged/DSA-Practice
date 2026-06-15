import type { Problem } from '@/lib/types'
import { buildTreeModel } from './tree-utils'

export const minimumAbsoluteDifferenceInBst: Problem = {
  id: 'minimum-absolute-difference-in-bst',
  title: 'Minimum Absolute Difference in BST',
  group: 'Tree',
  pattern: 'In-order Traversal',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/minimum-absolute-difference-in-bst/',
  statement:
    'Given the root of a binary search tree, return the minimum absolute difference between the values of any two different nodes. This is the same question as *Minimum Difference Between BST Nodes* — worth solving twice until the in-order reading is automatic.',
  constraints: ['2 <= nodes <= 10^4', '0 <= Node.val <= 10^5', 'The tree is a valid BST'],
  signature: {
    fn: 'getMinimumDifference',
    params: [{ name: 'root', type: 'tree' }],
    ret: 'int',
  },
  tests: [
    { args: [[4, 2, 6, 1, 3]], expect: 1 },
    { args: [[1, 0, 48, null, null, 12, 49]], expect: 1 },
    { args: [[236, 104, 701, null, 227, null, 911]], expect: 9, note: 'the pair is 227 and 236' },
    { args: [[1, null, 3]], expect: 2 },
  ],
  demo: [[4, 2, 6, 1, 3]],
  scale: (n) => [Array.from({ length: Math.min(n, 2000) }, (_, i) => i)],
  starter: {
    js: `function getMinimumDifference(root) {
  // root: TreeNode | null  ->  number
}
`,
    cpp: `int getMinimumDifference(TreeNode* root) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'inorder-gap',
      label: 'Sorted order comes free from in-order',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(h)',
      blurb:
        'Absolute values never actually appear: an in-order walk visits a BST in increasing order, so the current value is always at least the previous one and their difference is already non-negative. Track the previous visit and keep the smallest step.',
      code: {
        cpp: {
          lines: [
            'int getMinimumDifference(TreeNode* root) {',
            '    int best = INT_MAX, prev = -1;',
            '    stack<TreeNode*> st;',
            '    TreeNode* node = root;',
            '    while (node || !st.empty()) {',
            '        while (node) { st.push(node); node = node->left; }',
            '        node = st.top(); st.pop();',
            '        if (prev >= 0) best = min(best, node->val - prev);',
            '        prev = node->val;',
            '        node = node->right;',
            '    }',
            '    return best;',
            '}',
          ],
        },
        js: {
          lines: [
            'function getMinimumDifference(root) {',
            '  let best = Infinity, prev = null;',
            '  const st = [];',
            '  let node = root;',
            '  while (node || st.length) {',
            '    while (node) { st.push(node); node = node.left; }',
            '    node = st.pop();',
            '    if (prev !== null) best = Math.min(best, node.val - prev);',
            '    prev = node.val;',
            '    node = node.right;',
            '  }',
            '  return best;',
            '}',
          ],
        },
      },

      run([level]: [(number | null)[]], c) {
        const model = buildTreeModel(level)
        let best = Infinity
        let prev: number | null = null
        const st: number[] = []
        let id: number | null = model.root
        while (id != null || st.length) {
          while (id != null) {
            c.ops++
            st.push(id)
            id = model.nodes[id].left
          }
          const cur = model.nodes[st.pop()!]
          if (prev !== null) best = Math.min(best, cur.value - prev)
          prev = cur.value
          id = cur.right
        }
        return best
      },
    },
  ],
}
