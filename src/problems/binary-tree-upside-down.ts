import type { Problem } from '@/lib/types'

export const binaryTreeUpsideDown: Problem = {
  id: 'binary-tree-upside-down',
  title: 'Binary Tree Upside Down',
  group: 'Medium',
  pattern: 'Tree Recursion',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/binary-tree-upside-down/',
  statement:
    'Given the `root` of a binary tree, turn it upside down and return the new root. At every level the left child becomes the new root, the old root becomes its right child, and the old right child becomes its left child. Every right node is guaranteed to have a left sibling and no children of its own.',
  constraints: [
    'The number of nodes is in the range [0, 10]',
    '1 <= Node.val <= 10',
    'Every right node has a left sibling with the same parent',
    'Every right node has no children',
  ],
  signature: { fn: 'upsideDownBinaryTree', params: [{ name: 'root', type: 'tree' }], ret: 'tree' },
  tests: [
    { args: [[1, 2, 3, 4, 5]], expect: [4, 5, 2, null, null, 3, 1] },
    { args: [[]], expect: [], note: 'empty tree' },
    { args: [[1]], expect: [1], note: 'single node' },
    { args: [[1, 2, 3]], expect: [2, 3, 1] },
    {
      args: [[1, 2, 3, 4, 5, null, null, 6, 7]],
      expect: [6, 7, 4, null, null, 5, 2, null, null, 3, 1],
      note: 'three levels deep on the left spine',
    },
  ],
  demo: [[1, 2, 3, 4, 5]],
  starter: {
    js: `function upsideDownBinaryTree(root) {
  // root: TreeNode | null  ->  TreeNode | null
}
`,
    cpp: `TreeNode* upsideDownBinaryTree(TreeNode* root) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'recurse',
      label: 'Recurse down the left spine',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(h)',
      blurb:
        'The new root is the deepest left child, so recurse there first and let it come back untouched. On the way out each node hands its own left child the two children it used to own.',
      code: {
        cpp: {
          lines: [
            'TreeNode* upsideDownBinaryTree(TreeNode* root) {',
            '    if (!root || !root->left) return root;',
            '',
            '    TreeNode* newRoot = upsideDownBinaryTree(root->left);',
            '',
            '    TreeNode* left = root->left;',
            '    TreeNode* right = root->right;',
            '    left->left = right;',
            '    left->right = root;',
            '    root->left = nullptr;',
            '    root->right = nullptr;',
            '',
            '    return newRoot;',
            '}',
          ],
        },
        js: {
          lines: [
            'function upsideDownBinaryTree(root) {',
            '  if (!root || !root.left) return root;',
            '',
            '  const newRoot = upsideDownBinaryTree(root.left);',
            '',
            '  const left = root.left;',
            '  const right = root.right;',
            '  left.left = right;',
            '  left.right = root;',
            '  root.left = null;',
            '  root.right = null;',
            '',
            '  return newRoot;',
            '}',
          ],
        },
      },

      run([level]: [(number | null)[]], c) {
        // the structure is rebuilt by the harness; cost here is one visit per node
        let seen = 0
        for (const v of level) {
          c.ops++
          if (v != null) seen++
        }
        return seen
      },
    },
  ],
}
