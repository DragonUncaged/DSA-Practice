import type { Problem } from '@/lib/types'
import { buildTreeModel } from './tree-utils'

export const binaryTreeVerticalOrder: Problem = {
  id: 'binary-tree-vertical-order-traversal',
  title: 'Binary Tree Vertical Order Traversal',
  group: 'Medium',
  pattern: 'BFS',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/binary-tree-vertical-order-traversal/',
  statement:
    'Given the `root` of a binary tree, return its values column by column, from the leftmost column to the rightmost. Within a column the values run top to bottom, and two nodes on the same row go left to right.',
  constraints: ['The number of nodes is in the range [0, 100]', '-100 <= Node.val <= 100'],
  signature: { fn: 'verticalOrder', params: [{ name: 'root', type: 'tree' }], ret: 'int[][]' },
  tests: [
    { args: [[3, 9, 20, null, null, 15, 7]], expect: [[9], [3, 15], [20], [7]] },
    { args: [[3, 9, 8, 4, 0, 1, 7]], expect: [[4], [9], [3, 0, 1], [8], [7]] },
    {
      args: [[3, 9, 8, 4, 0, 1, 7, null, null, null, 2, 5]],
      expect: [[4], [9, 5], [3, 0, 1], [8, 2], [7]],
      note: 'row order breaks the tie inside a column',
    },
    { args: [[]], expect: [], note: 'empty tree' },
    { args: [[1]], expect: [[1]], note: 'single node' },
    { args: [[1, 2, 3]], expect: [[2], [1], [3]] },
  ],
  demo: [[3, 9, 20, null, null, 15, 7]],
  starter: {
    js: `function verticalOrder(root) {
  // root: TreeNode | null  ->  number[][]
}
`,
    cpp: `vector<vector<int>> verticalOrder(TreeNode* root) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'bfs-columns',
      label: 'Breadth-first, bucketed by column',
      kind: 'optimal',
      time: 'O(n log n)',
      space: 'O(n)',
      blurb:
        'Give the root column 0, a left child one less and a right child one more. A breadth-first walk visits rows in order and each row left to right, so appending into a bucket per column produces exactly the required order — only the buckets themselves need sorting at the end.',
      code: {
        cpp: {
          lines: [
            'vector<vector<int>> verticalOrder(TreeNode* root) {',
            '    vector<vector<int>> out;',
            '    if (!root) return out;',
            '',
            '    map<int, vector<int>> columns;',
            '    queue<pair<TreeNode*, int>> q;',
            '    q.push({root, 0});',
            '    while (!q.empty()) {',
            '        auto [node, col] = q.front();',
            '        q.pop();',
            '        columns[col].push_back(node->val);',
            '        if (node->left) q.push({node->left, col - 1});',
            '        if (node->right) q.push({node->right, col + 1});',
            '    }',
            '',
            '    for (auto& [col, vals] : columns) out.push_back(vals);',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function verticalOrder(root) {',
            '  if (!root) return [];',
            '',
            '  const columns = new Map();',
            '  const queue = [[root, 0]];',
            '  for (let head = 0; head < queue.length; head++) {',
            '    const [node, col] = queue[head];',
            '    if (!columns.has(col)) columns.set(col, []);',
            '    columns.get(col).push(node.val);',
            '    if (node.left) queue.push([node.left, col - 1]);',
            '    if (node.right) queue.push([node.right, col + 1]);',
            '  }',
            '',
            '  return [...columns.keys()].sort((a, b) => a - b).map((c) => columns.get(c));',
            '}',
          ],
        },
      },

      run([level]: [(number | null)[]], c) {
        const { nodes, root } = buildTreeModel(level)
        if (root == null) return []
        const columns = new Map<number, number[]>()
        const queue: [number, number][] = [[root, 0]]
        for (let head = 0; head < queue.length; head++) {
          c.ops++
          const [id, col] = queue[head]
          const node = nodes[id]
          if (!columns.has(col)) columns.set(col, [])
          columns.get(col)!.push(node.value)
          if (node.left != null) queue.push([node.left, col - 1])
          if (node.right != null) queue.push([node.right, col + 1])
        }
        return [...columns.keys()].sort((a, b) => a - b).map((col) => columns.get(col)!)
      },
    },
  ],
}
