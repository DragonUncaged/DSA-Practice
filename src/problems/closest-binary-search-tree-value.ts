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
    { args: [[4, 2, 5, 1, 3], 3], expect: 3, note: 'target sits exactly on a node' },
    { args: [[1000000000, 0], -1000000000], expect: 0, note: 'extreme values at both ends' },
    { args: [[8, 4, 12, 2, 6, 10, 14], 7], expect: 6, note: 'the answer is not on the last level' },
  ],
  scale: (n) => [Array.from({ length: n }, (_, i) => i), n / 2],
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
      id: 'walk-everything',
      label: 'Visit every node and keep the closest',
      kind: 'brute',
      time: 'O(n)',
      space: 'O(h)',
      blurb:
        'Traverse the whole tree and compare each value with the best so far, preferring the smaller value on a tie. It never uses the ordering, so it touches all `n` nodes when the search property could have skipped almost all of them.',
      code: {
        cpp: {
          lines: [
            'int closestValue(TreeNode* root, double target) {',
            '    int best = root->val;',
            '    function<void(TreeNode*)> walk = [&](TreeNode* node) {',
            '        if (!node) return;',
            '        walk(node->left);',
            '        double d = fabs(node->val - target), b = fabs(best - target);',
            '        if (d < b || (d == b && node->val < best)) best = node->val;',
            '        walk(node->right);',
            '    };',
            '    walk(root);',
            '    return best;',
            '}',
          ],
        },
        js: {
          lines: [
            'function closestValue(root, target) {',
            '  let best = root.val;',
            '  const walk = (node) => {',
            '    if (!node) return;',
            '    walk(node.left);',
            '    const d = Math.abs(node.val - target);',
            '    const b = Math.abs(best - target);',
            '    if (d < b || (d === b && node.val < best)) best = node.val;',
            '    walk(node.right);',
            '  };',
            '  walk(root);',
            '  return best;',
            '}',
          ],
        },
      },

      run([level, target]: [(number | null)[], number], c) {
        const { nodes, root } = buildTreeModel(level)
        let best = nodes[root!].value
        const walk = (id: number | null) => {
          if (id == null) return
          c.ops++
          const node = nodes[id]
          walk(node.left)
          const d = Math.abs(node.value - target)
          const b = Math.abs(best - target)
          if (d < b || (d === b && node.value < best)) best = node.value
          walk(node.right)
        }
        walk(root)
        return best
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'descend',
      label: 'Descend once, keeping the best seen',
      kind: 'optimal',
      time: 'O(h)',
      space: 'O(1)',
      blurb:
        'The full walk ignores what a BST promises. Its search order already heads towards the target: go left when the target is smaller, right when it is bigger. Every node on that path is a candidate, so remembering the closest one as you go is enough — one root-to-leaf path instead of the whole tree.',
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
