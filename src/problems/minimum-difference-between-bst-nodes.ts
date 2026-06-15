import type { Problem } from '@/lib/types'
import { buildTreeModel } from './tree-utils'

export const minimumDifferenceBetweenBstNodes: Problem = {
  id: 'minimum-difference-between-bst-nodes',
  title: 'Minimum Difference Between BST Nodes',
  group: 'Tree',
  pattern: 'In-order Traversal',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/minimum-distance-between-bst-nodes/',
  statement:
    'Given the root of a binary search tree, return the smallest difference between the values of any two different nodes.',
  constraints: ['2 <= nodes <= 100', '0 <= Node.val <= 10^5', 'The tree is a valid BST'],
  signature: { fn: 'minDiffInBST', params: [{ name: 'root', type: 'tree' }], ret: 'int' },
  tests: [
    { args: [[4, 2, 6, 1, 3]], expect: 1 },
    { args: [[1, 0, 48, null, null, 12, 49]], expect: 1 },
    { args: [[5, 1, 7]], expect: 2, note: 'the closest pair is not parent and child' },
    { args: [[2, 1, 3]], expect: 1 },
  ],
  demo: [[4, 2, 6, 1, 3]],
  scale: (n) => [Array.from({ length: Math.min(n, 2000) }, (_, i) => i)],
  starter: {
    js: `function minDiffInBST(root) {
  // root: TreeNode | null  ->  number
}
`,
    cpp: `int minDiffInBST(TreeNode* root) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'inorder-gap',
      label: 'In-order, compare with the previous value',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(h)',
      blurb:
        'An in-order walk of a BST reads its values in sorted order, and in a sorted list the closest pair is always adjacent. So the smallest difference anywhere in the tree is the smallest gap between consecutive visits — one traversal, one remembered previous value, no sorting.',
      code: {
        cpp: {
          lines: [
            'int minDiffInBST(TreeNode* root) {',
            '    int best = INT_MAX;',
            '    TreeNode* prev = nullptr;',
            '    function<void(TreeNode*)> walk = [&](TreeNode* node) {',
            '        if (!node) return;',
            '        walk(node->left);',
            '        if (prev) best = min(best, node->val - prev->val);',
            '        prev = node;',
            '        walk(node->right);',
            '    };',
            '    walk(root);',
            '    return best;',
            '}',
          ],
        },
        js: {
          lines: [
            'function minDiffInBST(root) {',
            '  let best = Infinity, prev = null;',
            '  const walk = (node) => {',
            '    if (!node) return;',
            '    walk(node.left);',
            '    if (prev !== null) best = Math.min(best, node.val - prev);',
            '    prev = node.val;',
            '    walk(node.right);',
            '  };',
            '  walk(root);',
            '  return best;',
            '}',
          ],
        },
      },

      run([level]: [(number | null)[]], c) {
        const model = buildTreeModel(level)
        let best = Infinity
        let prev: number | null = null
        const walk = (id: number | null) => {
          if (id == null) return
          c.ops++
          const nd = model.nodes[id]
          walk(nd.left)
          if (prev !== null) best = Math.min(best, nd.value - prev)
          prev = nd.value
          walk(nd.right)
        }
        walk(model.root)
        return best
      },
    },
  ],
}
