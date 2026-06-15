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
      id: 'depth-with-best',
      label: 'Return depth, record the through-path',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(h)',
      blurb:
        'Every path has a highest node, and at that node the path is exactly the left depth plus the right depth. So one depth recursion is enough: it returns the depth its parent needs, while updating a running best with the widest path that turns at this node.',
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
