import type { Problem } from '@/lib/types'
import { buildTreeModel } from './tree-utils'

export const binaryTreeLongestConsecutive: Problem = {
  id: 'binary-tree-longest-consecutive-sequence',
  title: 'Binary Tree Longest Consecutive Sequence',
  group: 'Medium',
  pattern: 'Tree Recursion',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/binary-tree-longest-consecutive-sequence/',
  statement:
    'Given the `root` of a binary tree, return the length of the longest path whose values increase by exactly one at each step. The path may start anywhere but must always run downward, from parent to child.',
  constraints: [
    'The number of nodes is in the range [1, 3 * 10^4]',
    '-3 * 10^4 <= Node.val <= 3 * 10^4',
  ],
  signature: { fn: 'longestConsecutive', params: [{ name: 'root', type: 'tree' }], ret: 'int' },
  tests: [
    { args: [[1, null, 3, 2, 4, null, null, null, 5]], expect: 3, note: 'the path 3 - 4 - 5' },
    { args: [[2, null, 3, 2, null, 1]], expect: 2, note: 'decreasing runs do not count' },
    { args: [[1]], expect: 1, note: 'single node' },
    { args: [[1, 2, 3]], expect: 2 },
    { args: [[1, null, 2, null, 3]], expect: 3, note: 'a straight right spine' },
    { args: [[5, 4, 3]], expect: 1, note: 'no two neighbours are consecutive' },
  ],
  demo: [[1, null, 3, 2, 4, null, null, null, 5]],
  starter: {
    js: `function longestConsecutive(root) {
  // root: TreeNode | null  ->  number
}
`,
    cpp: `int longestConsecutive(TreeNode* root) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'carry-run',
      label: 'Carry the current run length downward',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(h)',
      blurb:
        'A path only ever grows downward, so each node needs one number from its parent: how long the run arriving here is. Extend it when the values are consecutive, otherwise start again at one, and keep the largest ever seen.',
      code: {
        cpp: {
          lines: [
            'int longestConsecutive(TreeNode* root) {',
            '    int best = 0;',
            '    function<void(TreeNode*, int, int)> walk = [&](TreeNode* node, int parentVal, int run) {',
            '        if (!node) return;',
            '        run = (node->val == parentVal + 1) ? run + 1 : 1;',
            '        best = max(best, run);',
            '        walk(node->left, node->val, run);',
            '        walk(node->right, node->val, run);',
            '    };',
            '    if (root) walk(root, root->val - 1, 0);',
            '    return best;',
            '}',
          ],
        },
        js: {
          lines: [
            'function longestConsecutive(root) {',
            '  let best = 0;',
            '',
            '  const walk = (node, parentVal, run) => {',
            '    if (!node) return;',
            '    run = node.val === parentVal + 1 ? run + 1 : 1;',
            '    best = Math.max(best, run);',
            '    walk(node.left, node.val, run);',
            '    walk(node.right, node.val, run);',
            '  };',
            '',
            '  if (root) walk(root, root.val - 1, 0);',
            '  return best;',
            '}',
          ],
        },
      },

      run([level]: [(number | null)[]], c) {
        const { nodes, root } = buildTreeModel(level)
        let best = 0
        const walk = (id: number | null, parentVal: number, run: number) => {
          if (id == null) return
          c.ops++
          const node = nodes[id]
          const next = node.value === parentVal + 1 ? run + 1 : 1
          best = Math.max(best, next)
          walk(node.left, node.value, next)
          walk(node.right, node.value, next)
        }
        if (root != null) walk(root, nodes[root].value - 1, 0)
        return best
      },
    },
  ],
}
