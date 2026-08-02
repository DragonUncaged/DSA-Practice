import type { Problem } from '@/lib/types'
import { buildTreeModel } from './tree-utils'

export const diameterOfBinaryTree: Problem = {
  id: 'diameter-of-binary-tree',
  title: 'Diameter of Binary Tree',
  group: 'Tree',
  pattern: 'DFS with Gains',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/diameter-of-binary-tree/',
  statement:
    'The diameter of a binary tree is the number of edges on the longest path between any two nodes; that path need not pass through the root. Return the diameter.',
  constraints: ['0 <= nodes <= 10^4', 'The answer is counted in edges, not nodes'],
  signature: {
    fn: 'diameterOfBinaryTree',
    params: [{ name: 'root', type: 'tree' }],
    ret: 'int',
  },
  tests: [
    { args: [[1, 2, 3, 4, 5]], expect: 3, note: 'the path 4-2-1-3 uses three edges' },
    { args: [[1, 2]], expect: 1 },
    { args: [[1]], expect: 0, note: 'a lone node has no edges' },
    { args: [[]], expect: 0 },
    { args: [[1, 2, null, 3, null, 4]], expect: 3, note: 'a straight chain' },
    { args: [[1, null, 2, null, 3]], expect: 2, note: 'a right-leaning chain' },
    {
      args: [[1, 2, 3, 4, null, null, 5, 6, null, null, 7]],
      expect: 6,
      note: 'the longest path runs through the root',
    },
    { args: [[1, 2, null, 3, 4, 5, null, null, 6]], expect: 4, note: 'the longest path avoids the root' },
    {
      args: [Array.from({ length: 1999 }, (_, i) => (i % 2 ? null : i))],
      expect: 999,
      note: 'a chain of 1000 nodes',
    },
  ],
  demo: [[1, 2, 3, 4, 5]],
  scale: (n) => [Array.from({ length: Math.min(n, 2000) }, (_, i) => i)],
  starter: {
    js: `function diameterOfBinaryTree(root) {
  // root: TreeNode | null  ->  number
}
`,
    cpp: `int diameterOfBinaryTree(TreeNode* root) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'height-per-node',
      label: 'Measure both subtree heights at every node',
      kind: 'brute',
      time: 'O(n * h)',
      space: 'O(h)',
      blurb:
        'The longest path has a highest node, where its length is the left height plus the right height. So visit every node, compute each subtree height with a separate recursion, and keep the biggest sum. Correct, but a height is recomputed for every ancestor of a node, and on a chain that adds up to quadratic work.',
      code: {
        cpp: {
          lines: [
            'int diameterOfBinaryTree(TreeNode* root) {',
            '    function<int(TreeNode*)> height = [&](TreeNode* node) {',
            '        if (!node) return 0;',
            '        return 1 + max(height(node->left), height(node->right));',
            '    };',
            '    int best = 0;',
            '    function<void(TreeNode*)> visit = [&](TreeNode* node) {',
            '        if (!node) return;',
            '        best = max(best, height(node->left) + height(node->right));',
            '        visit(node->left);',
            '        visit(node->right);',
            '    };',
            '    visit(root);',
            '    return best;',
            '}',
          ],
        },
        js: {
          lines: [
            'function diameterOfBinaryTree(root) {',
            '  const height = (node) => (node ? 1 + Math.max(height(node.left), height(node.right)) : 0);',
            '  let best = 0;',
            '  const visit = (node) => {',
            '    if (!node) return;',
            '    best = Math.max(best, height(node.left) + height(node.right));',
            '    visit(node.left);',
            '    visit(node.right);',
            '  };',
            '  visit(root);',
            '  return best;',
            '}',
          ],
        },
      },
      run([level]: [(number | null)[]], c) {
        const model = buildTreeModel(level)
        const height = (id: number | null): number => {
          if (id == null) return 0
          c.ops++
          return 1 + Math.max(height(model.nodes[id].left), height(model.nodes[id].right))
        }
        let best = 0
        const visit = (id: number | null) => {
          if (id == null) return
          c.ops++
          const nd = model.nodes[id]
          best = Math.max(best, height(nd.left) + height(nd.right))
          visit(nd.left)
          visit(nd.right)
        }
        visit(model.root)
        return best
      },
    },
    {
      id: 'depth-with-best',
      label: 'Return depth, record the through-path',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(h)',
      blurb:
        'Heights should be computed once, bottom-up, not once per ancestor. A single depth recursion does it: it returns the depth its parent needs, and on the way out updates a running best with the left depth plus the right depth — the widest path that turns at this node. Every node is visited once.',
      code: {
        cpp: {
          lines: [
            'int diameterOfBinaryTree(TreeNode* root) {',
            '    int best = 0;',
            '    function<int(TreeNode*)> depth = [&](TreeNode* node) {',
            '        if (!node) return 0;',
            '        int l = depth(node->left), r = depth(node->right);',
            '        best = max(best, l + r);',
            '        return 1 + max(l, r);',
            '    };',
            '    depth(root);',
            '    return best;',
            '}',
          ],
        },
        js: {
          lines: [
            'function diameterOfBinaryTree(root) {',
            '  let best = 0;',
            '  const depth = (node) => {',
            '    if (!node) return 0;',
            '    const l = depth(node.left), r = depth(node.right);',
            '    best = Math.max(best, l + r);',
            '    return 1 + Math.max(l, r);',
            '  };',
            '  depth(root);',
            '  return best;',
            '}',
          ],
        },
      },

      run([level]: [(number | null)[]], c) {
        const model = buildTreeModel(level)
        let best = 0
        const depth = (id: number | null): number => {
          if (id == null) return 0
          c.ops++
          const nd = model.nodes[id]
          const l = depth(nd.left)
          const r = depth(nd.right)
          best = Math.max(best, l + r)
          return 1 + Math.max(l, r)
        }
        depth(model.root)
        return best
      },
    },
  ],
}
