import type { Problem } from '@/lib/types'
import { buildTreeModel } from './tree-utils'

export const findLeavesOfBinaryTree: Problem = {
  id: 'find-leaves-of-binary-tree',
  title: 'Find Leaves of Binary Tree',
  group: 'Medium',
  pattern: 'Tree Recursion',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/find-leaves-of-binary-tree/',
  statement:
    'Repeatedly collect the leaves of a binary tree and remove them until nothing is left, returning one group per round. The order within a group does not matter; the tests here follow the natural left-to-right post-order.',
  constraints: ['The number of nodes is in the range [1, 100]', '-100 <= Node.val <= 100'],
  signature: { fn: 'findLeaves', params: [{ name: 'root', type: 'tree' }], ret: 'int[][]' },
  tests: [
    { args: [[1, 2, 3, 4, 5]], expect: [[4, 5, 3], [2], [1]] },
    { args: [[1]], expect: [[1]], note: 'single node' },
    { args: [[1, 2]], expect: [[2], [1]], note: 'one child' },
    { args: [[1, 2, 3]], expect: [[2, 3], [1]] },
    {
      args: [[1, 2, null, 3, null, 4]],
      expect: [[4], [3], [2], [1]],
      note: 'a left spine peels one node at a time',
    },
  ],
  demo: [[1, 2, 3, 4, 5]],
  starter: {
    js: `function findLeaves(root) {
  // root: TreeNode | null  ->  number[][]
}
`,
    cpp: `vector<vector<int>> findLeaves(TreeNode* root) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'height-buckets',
      label: 'Bucket each node by its height',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'A node is removed in round `h` exactly when its height above the leaves is `h`, so no tree ever has to be rebuilt. One post-order pass computes each height as one more than the taller child and drops the value into that bucket.',
      code: {
        cpp: {
          lines: [
            'vector<vector<int>> findLeaves(TreeNode* root) {',
            '    vector<vector<int>> out;',
            '',
            '    function<int(TreeNode*)> height = [&](TreeNode* node) {',
            '        if (!node) return -1;',
            '        int h = max(height(node->left), height(node->right)) + 1;',
            '        if ((int)out.size() == h) out.push_back({});',
            '        out[h].push_back(node->val);',
            '        return h;',
            '    };',
            '',
            '    height(root);',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function findLeaves(root) {',
            '  const out = [];',
            '',
            '  const height = (node) => {',
            '    if (!node) return -1;',
            '    const h = Math.max(height(node.left), height(node.right)) + 1;',
            '    if (out.length === h) out.push([]);',
            '    out[h].push(node.val);',
            '    return h;',
            '  };',
            '',
            '  height(root);',
            '  return out;',
            '}',
          ],
        },
      },

      run([level]: [(number | null)[]], c) {
        const { nodes, root } = buildTreeModel(level)
        const out: number[][] = []
        const height = (id: number | null): number => {
          if (id == null) return -1
          c.ops++
          const node = nodes[id]
          const h = Math.max(height(node.left), height(node.right)) + 1
          if (out.length === h) out.push([])
          out[h].push(node.value)
          return h
        }
        height(root)
        return out
      },
    },
  ],
}
