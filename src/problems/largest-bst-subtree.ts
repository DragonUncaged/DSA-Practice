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
    { args: [[5, 5]], expect: 1, note: 'equal values do not make a BST' },
    { args: [[-10000, null, 10000]], expect: 2, note: 'extreme values' },
    {
      args: [[10, 5, 15, 1, 8, null, 7, null, null, 6, 9]],
      expect: 5,
      note: 'the subtree at 5 is a BST of five nodes even though the root is not',
    },
  ],
  // a left-skewed chain of decreasing values with one bad leaf at the bottom: every ancestor's
  // check walks all the way down before failing
  scale: (n) => [[n, ...Array.from({ length: n - 1 }, (_, i) => [i === n - 2 ? n + 1 : n - 1 - i, null]).flat()]],
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
      id: 'check-each-subtree',
      label: 'Validate every subtree from scratch',
      kind: 'brute',
      time: 'O(n^2)',
      space: 'O(h)',
      blurb:
        'For each node, run a full BST check over its subtree with the usual min and max bounds, and count its nodes when it passes. Correct, and quadratic on a skewed tree: a node deep down is re-validated once by every ancestor above it.',
      code: {
        cpp: {
          lines: [
            'static bool isBST(TreeNode* node, long long lo, long long hi) {',
            '    if (!node) return true;',
            '    if (node->val <= lo || node->val >= hi) return false;',
            '    return isBST(node->left, lo, node->val) && isBST(node->right, node->val, hi);',
            '}',
            'static int size(TreeNode* node) {',
            '    return node ? 1 + size(node->left) + size(node->right) : 0;',
            '}',
            '',
            'int largestBSTSubtree(TreeNode* root) {',
            '    if (!root) return 0;',
            '    if (isBST(root, LLONG_MIN, LLONG_MAX)) return size(root);',
            '    return max(largestBSTSubtree(root->left), largestBSTSubtree(root->right));',
            '}',
          ],
        },
        js: {
          lines: [
            'function largestBSTSubtree(root) {',
            '  const isBST = (node, lo, hi) => {',
            '    if (!node) return true;',
            '    if (node.val <= lo || node.val >= hi) return false;',
            '    return isBST(node.left, lo, node.val) && isBST(node.right, node.val, hi);',
            '  };',
            '  const size = (node) => (node ? 1 + size(node.left) + size(node.right) : 0);',
            '',
            '  if (!root) return 0;',
            '  if (isBST(root, -Infinity, Infinity)) return size(root);',
            '  return Math.max(largestBSTSubtree(root.left), largestBSTSubtree(root.right));',
            '}',
          ],
        },
      },

      run([level]: [(number | null)[]], c) {
        const { nodes, root } = buildTreeModel(level)
        const isBST = (id: number | null, lo: number, hi: number): boolean => {
          if (id == null) return true
          c.ops++
          const node = nodes[id]
          if (node.value <= lo || node.value >= hi) return false
          return isBST(node.left, lo, node.value) && isBST(node.right, node.value, hi)
        }
        const size = (id: number | null): number => {
          if (id == null) return 0
          c.ops++
          return 1 + size(nodes[id].left) + size(nodes[id].right)
        }
        const largest = (id: number | null): number => {
          if (id == null) return 0
          if (isBST(id, -Infinity, Infinity)) return size(id)
          return Math.max(largest(nodes[id].left), largest(nodes[id].right))
        }
        return largest(root)
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'postorder',
      label: 'Report range and size upward',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(h)',
      blurb:
        'Checking each node against its whole subtree is quadratic. Instead have every subtree report three things to its parent in one post-order pass: its smallest value, its largest, and its size — or a failure. A node is a BST when both children succeeded and its value sits strictly between the left maximum and the right minimum. Each node is visited once.',
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
