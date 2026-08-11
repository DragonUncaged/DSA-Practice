import type { Problem } from '@/lib/types'
import { buildTreeModel } from './tree-utils'

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
    { args: [[1, 2, null, 3]], expect: [3, null, 2, null, 1], note: 'a bare left spine with no siblings' },
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
      id: 'spine-list',
      label: 'Collect the left spine, then rewire from the bottom',
      kind: 'brute',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'Only the left spine moves: walk it into a list first, then work back up the list giving every node its parent as a right child and its old sibling as a left child. Correct, but the list holds every spine node just to visit them in reverse.',
      code: {
        cpp: {
          lines: [
            'TreeNode* upsideDownBinaryTree(TreeNode* root) {',
            '    vector<TreeNode*> spine;',
            '    for (TreeNode* node = root; node; node = node->left) spine.push_back(node);',
            '    if (spine.empty()) return nullptr;',
            '',
            '    for (int i = (int)spine.size() - 1; i > 0; --i) {',
            '        TreeNode* node = spine[i];',
            '        TreeNode* parent = spine[i - 1];',
            '        node->left = parent->right;',
            '        node->right = parent;',
            '    }',
            '    spine[0]->left = nullptr;',
            '    spine[0]->right = nullptr;',
            '    return spine.back();',
            '}',
          ],
        },
        js: {
          lines: [
            'function upsideDownBinaryTree(root) {',
            '  const spine = [];',
            '  for (let node = root; node; node = node.left) spine.push(node);',
            '  if (spine.length === 0) return null;',
            '',
            '  for (let i = spine.length - 1; i > 0; i--) {',
            '    const node = spine[i];',
            '    const parent = spine[i - 1];',
            '    node.left = parent.right;',
            '    node.right = parent;',
            '  }',
            '  spine[0].left = null;',
            '  spine[0].right = null;',
            '  return spine[spine.length - 1];',
            '}',
          ],
        },
      },

      run([level]: [(number | null)[]], c) {
        const { nodes, root } = buildTreeModel(level)
        const spine: number[] = []
        for (let id = root; id != null; id = nodes[id].left) {
          c.ops++
          spine.push(id)
        }
        if (!spine.length) return 0
        for (let i = spine.length - 1; i > 0; i--) {
          c.ops++
          const node = nodes[spine[i]]
          const parent = nodes[spine[i - 1]]
          node.left = parent.right
          node.right = parent.id
        }
        nodes[spine[0]].left = null
        nodes[spine[0]].right = null
        return nodes.length
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'recurse',
      label: 'Recurse down the left spine',
      kind: 'better',
      time: 'O(n)',
      space: 'O(h)',
      blurb:
        'The list was only there to reach the bottom first; the call stack does that for free. Recurse to the deepest left child and let it come back untouched as the new root, then on the way out each node hands its own left child the two children it used to own.',
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
        const { nodes, root } = buildTreeModel(level)
        const flip = (id: number | null): number | null => {
          c.ops++
          if (id == null || nodes[id].left == null) return id
          const node = nodes[id]
          const newRoot = flip(node.left)
          const left = nodes[node.left!]
          left.left = node.right
          left.right = id
          node.left = null
          node.right = null
          return newRoot
        }
        flip(root)
        return nodes.length
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'iterate',
      label: 'Walk down with three pointers',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'The recursion still spends a stack frame per level. Walking down instead, each node only needs to know its parent and the sibling it is about to adopt: remember both from the previous step, point the current node at them, then step to the old left child. No stack, no list.',
      code: {
        cpp: {
          lines: [
            'TreeNode* upsideDownBinaryTree(TreeNode* root) {',
            '    TreeNode* node = root;',
            '    TreeNode* parent = nullptr;',
            '    TreeNode* sibling = nullptr;',
            '    while (node) {',
            '        TreeNode* nextLeft = node->left;',
            '        TreeNode* nextSibling = node->right;',
            '        node->left = sibling;',
            '        node->right = parent;',
            '        parent = node;',
            '        sibling = nextSibling;',
            '        node = nextLeft;',
            '    }',
            '    return parent;',
            '}',
          ],
        },
        js: {
          lines: [
            'function upsideDownBinaryTree(root) {',
            '  let node = root;',
            '  let parent = null;',
            '  let sibling = null;',
            '  while (node) {',
            '    const nextLeft = node.left;',
            '    const nextSibling = node.right;',
            '    node.left = sibling;',
            '    node.right = parent;',
            '    parent = node;',
            '    sibling = nextSibling;',
            '    node = nextLeft;',
            '  }',
            '  return parent;',
            '}',
          ],
        },
      },

      run([level]: [(number | null)[]], c) {
        const { nodes, root } = buildTreeModel(level)
        let id = root
        let parent: number | null = null
        let sibling: number | null = null
        while (id != null) {
          c.ops++
          const node = nodes[id]
          const nextLeft = node.left
          const nextSibling = node.right
          node.left = sibling
          node.right = parent
          parent = id
          sibling = nextSibling
          id = nextLeft
        }
        return nodes.length
      },
    },
  ],
}
