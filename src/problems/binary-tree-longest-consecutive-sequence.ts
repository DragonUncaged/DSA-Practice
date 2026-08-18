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
    { args: [[-3, -2, null, -1, null, 0]], expect: 4, note: 'negative values, a left spine' },
    { args: [[1, 2, 2, 3, null, null, 3]], expect: 3, note: 'two equal runs on both sides' },
  ],
  // a left-skewed chain of consecutive values: the brute force re-walks it from every node
  scale: (n) => [[0, ...Array.from({ length: n - 1 }, (_, i) => [i + 1, null]).flat()]],
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
      id: 'start-everywhere',
      label: 'Start a fresh run at every node',
      kind: 'brute',
      time: 'O(n^2)',
      space: 'O(h)',
      blurb:
        'For each node, walk downward following children whose value is exactly one more, and measure how far that gets. Correct, but a node deep in a long run is re-walked by every ancestor that started a run above it, so a skewed tree makes the work quadratic.',
      code: {
        cpp: {
          lines: [
            'static int runFrom(TreeNode* node) {',
            '    int best = 1;',
            '    if (node->left && node->left->val == node->val + 1) best = max(best, 1 + runFrom(node->left));',
            '    if (node->right && node->right->val == node->val + 1) best = max(best, 1 + runFrom(node->right));',
            '    return best;',
            '}',
            '',
            'int longestConsecutive(TreeNode* root) {',
            '    if (!root) return 0;',
            '    return max({runFrom(root), longestConsecutive(root->left), longestConsecutive(root->right)});',
            '}',
          ],
        },
        js: {
          lines: [
            'function longestConsecutive(root) {',
            '  const runFrom = (node) => {',
            '    let best = 1;',
            '    if (node.left && node.left.val === node.val + 1) best = Math.max(best, 1 + runFrom(node.left));',
            '    if (node.right && node.right.val === node.val + 1) best = Math.max(best, 1 + runFrom(node.right));',
            '    return best;',
            '  };',
            '  if (!root) return 0;',
            '  return Math.max(runFrom(root), longestConsecutive(root.left), longestConsecutive(root.right));',
            '}',
          ],
        },
      },

      run([level]: [(number | null)[]], c) {
        const { nodes, root } = buildTreeModel(level)
        const runFrom = (id: number): number => {
          c.ops++
          const node = nodes[id]
          let best = 1
          if (node.left != null && nodes[node.left].value === node.value + 1) best = Math.max(best, 1 + runFrom(node.left))
          if (node.right != null && nodes[node.right].value === node.value + 1) best = Math.max(best, 1 + runFrom(node.right))
          return best
        }
        const longest = (id: number | null): number => {
          if (id == null) return 0
          return Math.max(runFrom(id), longest(nodes[id].left), longest(nodes[id].right))
        }
        return longest(root)
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'carry-run',
      label: 'Carry the current run length downward',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(h)',
      blurb:
        'Instead of restarting at every node, carry the run down. A path only ever grows downward, so each node needs one number from its parent: how long the run arriving here is. Extend it when the values are consecutive, otherwise start again at one, and keep the largest ever seen — every node is visited once.',
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
