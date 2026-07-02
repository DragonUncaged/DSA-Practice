import type { Problem } from '@/lib/types'
import { buildTreeModel } from './tree-utils'

export const closestBSTValue: Problem = {
  id: 'closest-binary-search-tree-value',
  title: 'Closest Binary Search Tree Value',
  group: 'Easy',
  pattern: 'Binary Search',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/closest-binary-search-tree-value/',
  statement:
    'Given the `root` of a binary search tree and a `target` value, return the value in the tree closest to `target`. When two values are equally close, return the smaller one.',
  constraints: [
    'The number of nodes is in the range [1, 10^4]',
    '0 <= Node.val <= 10^9',
    '-10^9 <= target <= 10^9',
  ],
  signature: {
    fn: 'closestValue',
    params: [
      { name: 'root', type: 'tree' },
      { name: 'target', type: 'double' },
    ],
    ret: 'int',
  },
  tests: [
    { args: [[4, 2, 5, 1, 3], 3.714286], expect: 4 },
    { args: [[1], 4.428571], expect: 1, note: 'single node' },
    { args: [[2, 1, 3], 1.5], expect: 1, note: 'a tie goes to the smaller value' },
    { args: [[1, null, 2], 3], expect: 2, note: 'target beyond the largest value' },
    { args: [[5, 3, 6, 2, 4], 0], expect: 2, note: 'target below the smallest value' },
  ],
  demo: [[4, 2, 5, 1, 3], 3.714286],
  starter: {
    js: `function closestValue(root, target) {
  // root: TreeNode, target: number  ->  number
}
`,
    cpp: `int closestValue(TreeNode* root, double target) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'descend',
      label: 'Descend once, keeping the best seen',
      kind: 'optimal',
      time: 'O(h)',
      space: 'O(1)',
      blurb:
        'The search order of a BST already walks towards the target: go left when the target is smaller, right when it is bigger. Every node on that path is a candidate, so remembering the closest one as you go is enough — no backtracking needed.',
      code: {
        cpp: {
          lines: [
            'int closestValue(TreeNode* root, double target) {',
            '    int best = root->val;',
            '    for (TreeNode* node = root; node; ) {',
            '        double d = fabs(node->val - target);',
            '        double b = fabs(best - target);',
            '        if (d < b || (d == b && node->val < best)) best = node->val;',
            '        node = target < node->val ? node->left : node->right;',
            '    }',
            '    return best;',
            '}',
          ],
        },
        js: {
          lines: [
            'function closestValue(root, target) {',
            '  let best = root.val;',
            '  let node = root;',
            '  while (node) {',
            '    const d = Math.abs(node.val - target);',
            '    const b = Math.abs(best - target);',
            '    if (d < b || (d === b && node.val < best)) best = node.val;',
            '    node = target < node.val ? node.left : node.right;',
            '  }',
            '  return best;',
            '}',
          ],
        },
      },

      run([level, target]: [(number | null)[], number], c) {
        const { nodes, root } = buildTreeModel(level)
        let best = nodes[root!].value
        let id = root
        while (id != null) {
          c.ops++
          const node = nodes[id]
          const d = Math.abs(node.value - target)
          const b = Math.abs(best - target)
          if (d < b || (d === b && node.value < best)) best = node.value
          id = target < node.value ? node.left : node.right
        }
        return best
      },
    },
  ],
}
