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
    {
      args: [[1, 2, 3, null, 4, null, 5, null, 6]],
      expect: [[6, 5], [4, 3], [2], [1]],
      note: 'right-leaning subtrees of different depths peel in step',
    },
    { args: [[-100, 100, -100]], expect: [[100, -100], [-100]], note: 'extreme values' },
  ],
  // a left spine: every round removes exactly one node
  scale: (n) => [[0, ...Array.from({ length: n - 1 }, (_, i) => [i + 1, null]).flat()]],
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
      id: 'peel-rounds',
      label: 'Peel the leaves off, round after round',
      kind: 'brute',
      time: 'O(n^2)',
      space: 'O(h)',
      blurb:
        'Do what the statement says: walk the tree, collect the leaves left to right, detach them, and repeat until the root is gone. Correct, and every round re-traverses everything that is left, so a long spine costs a full walk per node removed.',
      code: {
        cpp: {
          lines: [
            'static TreeNode* peel(TreeNode* node, vector<int>& round) {',
            '    if (!node) return nullptr;',
            '    if (!node->left && !node->right) { round.push_back(node->val); return nullptr; }',
            '    node->left = peel(node->left, round);',
            '    node->right = peel(node->right, round);',
            '    return node;',
            '}',
            '',
            'vector<vector<int>> findLeaves(TreeNode* root) {',
            '    vector<vector<int>> out;',
            '    while (root) {',
            '        vector<int> round;',
            '        root = peel(root, round);',
            '        out.push_back(round);',
            '    }',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function findLeaves(root) {',
            '  // detaches this round\'s leaves and returns what is left of the subtree',
            '  const peel = (node, round) => {',
            '    if (!node) return null;',
            '    if (!node.left && !node.right) { round.push(node.val); return null; }',
            '    node.left = peel(node.left, round);',
            '    node.right = peel(node.right, round);',
            '    return node;',
            '  };',
            '',
            '  const out = [];',
            '  while (root) {',
            '    const round = [];',
            '    root = peel(root, round);',
            '    out.push(round);',
            '  }',
            '  return out;',
            '}',
          ],
        },
      },

      run([level]: [(number | null)[]], c) {
        const { nodes } = buildTreeModel(level)
        let root = buildTreeModel(level).root
        const peel = (id: number | null, round: number[]): number | null => {
          if (id == null) return null
          c.ops++
          const node = nodes[id]
          if (node.left == null && node.right == null) {
            round.push(node.value)
            return null
          }
          node.left = peel(node.left, round)
          node.right = peel(node.right, round)
          return id
        }
        const out: number[][] = []
        while (root != null) {
          const round: number[] = []
          root = peel(root, round)
          out.push(round)
        }
        return out
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'height-buckets',
      label: 'Bucket each node by its height',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'Nothing needs to be removed. A node is peeled in round `h` exactly when its height above the leaves is `h`, so one post-order pass computes each height as one more than the taller child and drops the value into that bucket. Post-order also visits leaves left to right, so the order inside each round matches the peeling.',
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
