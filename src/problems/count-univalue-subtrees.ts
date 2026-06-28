import type { Problem } from '@/lib/types'
import { buildTreeModel } from './tree-utils'

export const countUnivalueSubtrees: Problem = {
  id: 'count-univalue-subtrees',
  title: 'Count Univalue Subtrees',
  group: 'Medium',
  pattern: 'Tree Recursion',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/count-univalue-subtrees/',
  statement:
    'Given the `root` of a binary tree, return the number of uni-value subtrees — subtrees in which every node holds the same value. A single leaf counts.',
  constraints: ['The number of nodes is in the range [0, 1000]', '-1000 <= Node.val <= 1000'],
  signature: { fn: 'countUnivalSubtrees', params: [{ name: 'root', type: 'tree' }], ret: 'int' },
  tests: [
    { args: [[5, 1, 5, 5, 5, null, 5]], expect: 4 },
    { args: [[]], expect: 0, note: 'empty tree' },
    { args: [[5, 5, 5, 5, 5, null, 5]], expect: 6, note: 'the whole tree is uni-value' },
    { args: [[1]], expect: 1, note: 'a lone leaf' },
    { args: [[1, 1, 1]], expect: 3 },
    { args: [[1, 2]], expect: 1, note: 'only the leaf qualifies' },
  ],
  demo: [[5, 1, 5, 5, 5, null, 5]],
  starter: {
    js: `function countUnivalSubtrees(root) {
  // root: TreeNode | null  ->  number
}
`,
    cpp: `int countUnivalSubtrees(TreeNode* root) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'postorder',
      label: 'Post-order, reporting uni-value upward',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(h)',
      blurb:
        'A subtree is uni-value when both children are uni-value and each child that exists carries the same value as its parent. Ask the children first and count on the way back up, so every node is visited once.',
      code: {
        cpp: {
          lines: [
            'int countUnivalSubtrees(TreeNode* root) {',
            '    int count = 0;',
            '    function<bool(TreeNode*)> walk = [&](TreeNode* node) {',
            '        if (!node) return true;',
            '        bool left = walk(node->left);',
            '        bool right = walk(node->right);',
            '        if (!left || !right) return false;',
            '        if (node->left && node->left->val != node->val) return false;',
            '        if (node->right && node->right->val != node->val) return false;',
            '        ++count;',
            '        return true;',
            '    };',
            '    walk(root);',
            '    return count;',
            '}',
          ],
        },
        js: {
          lines: [
            'function countUnivalSubtrees(root) {',
            '  let count = 0;',
            '',
            '  const walk = (node) => {',
            '    if (!node) return true;',
            '    const left = walk(node.left);',
            '    const right = walk(node.right);',
            '    if (!left || !right) return false;',
            '    if (node.left && node.left.val !== node.val) return false;',
            '    if (node.right && node.right.val !== node.val) return false;',
            '    count++;',
            '    return true;',
            '  };',
            '',
            '  walk(root);',
            '  return count;',
            '}',
          ],
        },
      },

      run([level]: [(number | null)[]], c) {
        const { nodes, root } = buildTreeModel(level)
        let count = 0
        const walk = (id: number | null): boolean => {
          if (id == null) return true
          c.ops++
          const node = nodes[id]
          const left = walk(node.left)
          const right = walk(node.right)
          if (!left || !right) return false
          if (node.left != null && nodes[node.left].value !== node.value) return false
          if (node.right != null && nodes[node.right].value !== node.value) return false
          count++
          return true
        }
        walk(root)
        return count
      },
    },
  ],
}
