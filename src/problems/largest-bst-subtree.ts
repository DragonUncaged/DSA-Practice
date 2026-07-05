import type { Problem } from '@/lib/types'
import { buildTreeModel } from './tree-utils'

export const largestBSTSubtree: Problem = {
  id: 'largest-bst-subtree',
  title: 'Largest BST Subtree',
  group: 'Medium',
  pattern: 'Tree Recursion',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/largest-bst-subtree/',
  statement:
    'Given the `root` of a binary tree, return the number of nodes in its largest subtree that is itself a binary search tree. A subtree always includes every descendant of its root.',
  constraints: [
    'The number of nodes is in the range [0, 10^4]',
    '-10^4 <= Node.val <= 10^4',
  ],
  signature: { fn: 'largestBSTSubtree', params: [{ name: 'root', type: 'tree' }], ret: 'int' },
  tests: [
    { args: [[10, 5, 15, 1, 8, null, 7]], expect: 3, note: 'the subtree rooted at 5' },
    {
      args: [[4, 2, 7, 2, 3, 5, null, 2, null, null, null, null, null, 1]],
      expect: 2,
    },
    { args: [[]], expect: 0, note: 'empty tree' },
    { args: [[1]], expect: 1, note: 'a single node is a BST' },
    { args: [[2, 1, 3]], expect: 3, note: 'the whole tree qualifies' },
    { args: [[3, 1, 2]], expect: 1, note: 'only the leaves qualify' },
  ],
  demo: [[10, 5, 15, 1, 8, null, 7]],
  starter: {
    js: `function largestBSTSubtree(root) {
  // root: TreeNode | null  ->  number
}
`,
    cpp: `int largestBSTSubtree(TreeNode* root) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'postorder',
      label: 'Report range and size upward',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(h)',
      blurb:
        'Checking each node against the whole tree is quadratic. Instead have every subtree report three things to its parent: its smallest value, its largest, and its size — or a failure. A node is a BST when both children succeeded and its value sits strictly between the left maximum and the right minimum.',
      code: {
        cpp: {
          lines: [
            'int largestBSTSubtree(TreeNode* root) {',
            '    int best = 0;',
            '    struct R { long long lo, hi; int size; };',
            '',
            '    function<R(TreeNode*)> walk = [&](TreeNode* node) -> R {',
            '        if (!node) return {LLONG_MAX, LLONG_MIN, 0};',
            '        R l = walk(node->left);',
            '        R r = walk(node->right);',
            '        if (l.size < 0 || r.size < 0) return {0, 0, -1};',
            '        if (node->val <= l.hi || node->val >= r.lo) return {0, 0, -1};',
            '',
            '        int size = l.size + r.size + 1;',
            '        best = max(best, size);',
            '        return {min(l.lo, (long long)node->val), max(r.hi, (long long)node->val), size};',
            '    };',
            '',
            '    walk(root);',
            '    return best;',
            '}',
          ],
        },
        js: {
          lines: [
            'function largestBSTSubtree(root) {',
            '  let best = 0;',
            '',
            '  // [smallest, largest, size]; size -1 means "not a BST"',
            '  const walk = (node) => {',
            '    if (!node) return [Infinity, -Infinity, 0];',
            '    const l = walk(node.left);',
            '    const r = walk(node.right);',
            '    if (l[2] < 0 || r[2] < 0) return [0, 0, -1];',
            '    if (node.val <= l[1] || node.val >= r[0]) return [0, 0, -1];',
            '',
            '    const size = l[2] + r[2] + 1;',
            '    best = Math.max(best, size);',
            '    return [Math.min(l[0], node.val), Math.max(r[1], node.val), size];',
            '  };',
            '',
            '  walk(root);',
            '  return best;',
            '}',
          ],
        },
      },

      run([level]: [(number | null)[]], c) {
        const { nodes, root } = buildTreeModel(level)
        let best = 0
        const walk = (id: number | null): [number, number, number] => {
          if (id == null) return [Infinity, -Infinity, 0]
          c.ops++
          const node = nodes[id]
          const l = walk(node.left)
          const r = walk(node.right)
          if (l[2] < 0 || r[2] < 0) return [0, 0, -1]
          if (node.value <= l[1] || node.value >= r[0]) return [0, 0, -1]
          const size = l[2] + r[2] + 1
          best = Math.max(best, size)
          return [Math.min(l[0], node.value), Math.max(r[1], node.value), size]
        }
        walk(root)
        return best
      },
    },
  ],
}
