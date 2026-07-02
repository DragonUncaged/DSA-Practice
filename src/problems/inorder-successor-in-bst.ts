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
  ],
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
      id: 'descend',
      label: 'Descend, remembering the last left turn',
      kind: 'optimal',
      time: 'O(h)',
      space: 'O(1)',
      blurb:
        'Every time the search moves left, the node it leaves behind is bigger than `p` and smaller than anything seen before it — a running best. Moving right discards nothing. Whatever the last left turn was is the successor.',
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
