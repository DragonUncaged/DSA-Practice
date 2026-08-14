import type { Problem } from '@/lib/types'
import { buildTreeModel } from './tree-utils'

export const inorderSuccessorInBST: Problem = {
  id: 'inorder-successor-in-bst',
  title: 'Inorder Successor in BST',
  group: 'Medium',
  pattern: 'Binary Search',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/inorder-successor-in-bst/',
  statement:
    'Given the `root` of a binary search tree and the value `p` of a node in it, return the in-order successor of that node — the smallest value greater than `p`. Return it as a one-element array, or an empty array when there is no successor. (LeetCode passes and returns the node itself and uses `null` for "none"; values here can be negative, so an empty array says it instead.)',
  constraints: [
    'The number of nodes is in the range [1, 10^4]',
    '-10^5 <= Node.val <= 10^5',
    'All node values are unique',
  ],
  signature: {
    fn: 'inorderSuccessor',
    params: [
      { name: 'root', type: 'tree' },
      { name: 'p', type: 'int' },
    ],
    ret: 'int[]',
  },
  tests: [
    { args: [[2, 1, 3], 1], expect: [2] },
    { args: [[5, 3, 6, 2, 4, null, null, 1], 6], expect: [], note: 'largest value has none' },
    { args: [[5, 3, 6, 2, 4, null, null, 1], 4], expect: [5], note: 'successor is an ancestor' },
    { args: [[5, 3, 6, 2, 4, null, null, 1], 2], expect: [3] },
    { args: [[2, 1, 3], 3], expect: [] },
    { args: [[1], 1], expect: [], note: 'single node' },
    { args: [[0, -5, 5, -10, -1], -1], expect: [0], note: 'negative values, successor is the root' },
    { args: [[5, 3, 6, 2, 4, null, null, 1], 1], expect: [2], note: 'the smallest value' },
    { args: [[5, 3, 6, 2, 4, null, null, 1], 5], expect: [6], note: 'successor is the right child' },
  ],
  scale: (n) => [Array.from({ length: n }, (_, i) => i), 0],
  demo: [[2, 1, 3], 1],
  starter: {
    js: `function inorderSuccessor(root, p) {
  // root: TreeNode, p: number  ->  number[]
}
`,
    cpp: `vector<int> inorderSuccessor(TreeNode* root, int p) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'flatten',
      label: 'Flatten in order and take the next value',
      kind: 'brute',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'An in-order walk lists the values sorted, so the successor is simply whatever follows `p` in that list. Correct and easy, but it materialises every node to find a single neighbour.',
      code: {
        cpp: {
          lines: [
            'vector<int> inorderSuccessor(TreeNode* root, int p) {',
            '    vector<int> vals;',
            '    function<void(TreeNode*)> walk = [&](TreeNode* n) {',
            '        if (!n) return;',
            '        walk(n->left);',
            '        vals.push_back(n->val);',
            '        walk(n->right);',
            '    };',
            '    walk(root);',
            '    for (size_t i = 0; i + 1 < vals.size(); ++i)',
            '        if (vals[i] == p) return {vals[i + 1]};',
            '    return {};',
            '}',
          ],
        },
        js: {
          lines: [
            'function inorderSuccessor(root, p) {',
            '  const vals = [];',
            '  const walk = (n) => {',
            '    if (!n) return;',
            '    walk(n.left);',
            '    vals.push(n.val);',
            '    walk(n.right);',
            '  };',
            '  walk(root);',
            '  const i = vals.indexOf(p);',
            '  return i + 1 < vals.length ? [vals[i + 1]] : [];',
            '}',
          ],
        },
      },

      run([level, p]: [(number | null)[], number], c) {
        const { nodes, root } = buildTreeModel(level)
        const vals: number[] = []
        const walk = (id: number | null) => {
          if (id == null) return
          c.ops++
          walk(nodes[id].left)
          vals.push(nodes[id].value)
          walk(nodes[id].right)
        }
        walk(root)
        const i = vals.indexOf(p)
        return i + 1 < vals.length ? [vals[i + 1]] : []
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'descend',
      label: 'Descend, remembering the last left turn',
      kind: 'optimal',
      time: 'O(h)',
      space: 'O(1)',
      blurb:
        'The list is unnecessary: one search path already passes the answer. Every time the search moves left, the node it leaves behind is bigger than `p` and smaller than anything seen before it — a running best. Moving right discards nothing. Whatever the last left turn was is the successor, found in one descent.',
      code: {
        cpp: {
          lines: [
            'vector<int> inorderSuccessor(TreeNode* root, int p) {',
            '    bool found = false;',
            '    int best = 0;',
            '    for (TreeNode* node = root; node; ) {',
            '        if (node->val <= p) {',
            '            node = node->right;',
            '        } else {',
            '            found = true;',
            '            best = node->val;',
            '            node = node->left;',
            '        }',
            '    }',
            '    return found ? vector<int>{best} : vector<int>{};',
            '}',
          ],
        },
        js: {
          lines: [
            'function inorderSuccessor(root, p) {',
            '  let best = null;',
            '  let node = root;',
            '  while (node) {',
            '    if (node.val <= p) {',
            '      node = node.right;',
            '    } else {',
            '      best = node.val;',
            '      node = node.left;',
            '    }',
            '  }',
            '  return best === null ? [] : [best];',
            '}',
          ],
        },
      },

      run([level, p]: [(number | null)[], number], c) {
        const { nodes, root } = buildTreeModel(level)
        let best: number | null = null
        let id = root
        while (id != null) {
          c.ops++
          const node = nodes[id]
          if (node.value <= p) {
            id = node.right
          } else {
            best = node.value
            id = node.left
          }
        }
        return best === null ? [] : [best]
      },
    },
  ],
}
