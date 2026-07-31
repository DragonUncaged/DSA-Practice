import type { Problem } from '@/lib/types'
import { buildTreeModel } from './tree-utils'

export const longestUnivaluePath: Problem = {
  id: 'longest-univalue-path',
  title: 'Longest Univalue Path',
  group: 'Tree',
  pattern: 'DFS with Gains',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/longest-univalue-path/',
  statement:
    'Return the length, in edges, of the longest path in a binary tree where every node holds the same value. The path need not pass through the root.',
  constraints: ['0 <= nodes <= 10^4', '-1000 <= Node.val <= 1000', 'Length is counted in edges'],
  signature: { fn: 'longestUnivaluePath', params: [{ name: 'root', type: 'tree' }], ret: 'int' },
  tests: [
    { args: [[5, 4, 5, 1, 1, null, 5]], expect: 2, note: 'the two fives either side of the root' },
    { args: [[1, 4, 5, 4, 4, null, 5]], expect: 2 },
    { args: [[1]], expect: 0 },
    { args: [[]], expect: 0 },
    { args: [[1, 1, 1]], expect: 2, note: 'the whole tree is one value' },
    { args: [[1, null, 1, 1, 1, 1, 1, 1]], expect: 4, note: 'the best path turns below the root' },
    { args: [[-1, -1, -1]], expect: 2, note: 'negative values compare like any other' },
    { args: [[1, 2, 3]], expect: 0, note: 'no two adjacent nodes agree' },
    {
      args: [Array.from({ length: 1999 }, (_, i) => (i % 2 ? null : 7))],
      expect: 999,
      note: 'a right-leaning chain of 1000 sevens',
    },
  ],
  demo: [[5, 4, 5, 1, 1, null, 5]],
  scale: (n) => [Array.from({ length: Math.min(n, 2000) }, () => 7)],
  starter: {
    js: `function longestUnivaluePath(root) {
  // root: TreeNode | null  ->  number
}
`,
    cpp: `int longestUnivaluePath(TreeNode* root) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'arm-per-node',
      label: 'Measure both arms afresh at every node',
      kind: 'brute',
      time: 'O(n * h)',
      space: 'O(h)',
      blurb:
        'The best path turns at some node, so try every node as the turning point: walk down its left side while the values match, walk down its right side the same way, and add the two lengths. The walks are correct but not shared — a deep chain of equal values is re-walked from every one of its nodes.',
      code: {
        cpp: {
          lines: [
            'int longestUnivaluePath(TreeNode* root) {',
            '    function<int(TreeNode*, int)> arm = [&](TreeNode* node, int val) -> int {',
            '        if (!node || node->val != val) return 0;',
            '        return 1 + max(arm(node->left, val), arm(node->right, val));',
            '    };',
            '    int best = 0;',
            '    function<void(TreeNode*)> visit = [&](TreeNode* node) {',
            '        if (!node) return;',
            '        best = max(best, arm(node->left, node->val) + arm(node->right, node->val));',
            '        visit(node->left);',
            '        visit(node->right);',
            '    };',
            '    visit(root);',
            '    return best;',
            '}',
          ],
        },
        js: {
          lines: [
            'function longestUnivaluePath(root) {',
            '  const arm = (node, val) => {',
            '    if (!node || node.val !== val) return 0;',
            '    return 1 + Math.max(arm(node.left, val), arm(node.right, val));',
            '  };',
            '  let best = 0;',
            '  const visit = (node) => {',
            '    if (!node) return;',
            '    best = Math.max(best, arm(node.left, node.val) + arm(node.right, node.val));',
            '    visit(node.left);',
            '    visit(node.right);',
            '  };',
            '  visit(root);',
            '  return best;',
            '}',
          ],
        },
      },
      run([level]: [(number | null)[]], c) {
        const model = buildTreeModel(level)
        const arm = (id: number | null, val: number): number => {
          if (id == null || model.nodes[id].value !== val) return 0
          c.ops++
          return 1 + Math.max(arm(model.nodes[id].left, val), arm(model.nodes[id].right, val))
        }
        let best = 0
        const visit = (id: number | null) => {
          if (id == null) return
          c.ops++
          const nd = model.nodes[id]
          best = Math.max(best, arm(nd.left, nd.value) + arm(nd.right, nd.value))
          visit(nd.left)
          visit(nd.right)
        }
        visit(model.root)
        return best
      },
    },
    {
      id: 'arm-lengths',
      label: 'Longest matching arm from each node',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(h)',
      blurb:
        'The arm below a node is one more than the arm below its matching child, so compute arms bottom-up and each is measured once. Like the diameter, the answer turns at some node — there it is the left matching arm plus the right one. A child only extends an arm when its value equals its parent\'s, so the recursion returns the longer usable arm upward and records left plus right on the way out.',
      code: {
        cpp: {
          lines: [
            'int longestUnivaluePath(TreeNode* root) {',
            '    int best = 0;',
            '    function<int(TreeNode*)> arm = [&](TreeNode* node) {',
            '        if (!node) return 0;',
            '        int l = arm(node->left), r = arm(node->right);',
            '        int lu = (node->left && node->left->val == node->val) ? l + 1 : 0;',
            '        int ru = (node->right && node->right->val == node->val) ? r + 1 : 0;',
            '        best = max(best, lu + ru);',
            '        return max(lu, ru);',
            '    };',
            '    arm(root);',
            '    return best;',
            '}',
          ],
        },
        js: {
          lines: [
            'function longestUnivaluePath(root) {',
            '  let best = 0;',
            '  const arm = (node) => {',
            '    if (!node) return 0;',
            '    const l = arm(node.left), r = arm(node.right);',
            '    const lu = node.left && node.left.val === node.val ? l + 1 : 0;',
            '    const ru = node.right && node.right.val === node.val ? r + 1 : 0;',
            '    best = Math.max(best, lu + ru);',
            '    return Math.max(lu, ru);',
            '  };',
            '  arm(root);',
            '  return best;',
            '}',
          ],
        },
      },

      run([level]: [(number | null)[]], c) {
        const model = buildTreeModel(level)
        let best = 0
        const arm = (id: number | null): number => {
          if (id == null) return 0
          c.ops++
          const nd = model.nodes[id]
          const l = arm(nd.left)
          const r = arm(nd.right)
          const lu = nd.left != null && model.nodes[nd.left].value === nd.value ? l + 1 : 0
          const ru = nd.right != null && model.nodes[nd.right].value === nd.value ? r + 1 : 0
          best = Math.max(best, lu + ru)
          return Math.max(lu, ru)
        }
        arm(model.root)
        return best
      },
    },
  ],
}
