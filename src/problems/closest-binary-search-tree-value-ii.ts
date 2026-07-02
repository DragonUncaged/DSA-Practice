import type { Problem } from '@/lib/types'
import { buildTreeModel } from './tree-utils'

export const closestBSTValueII: Problem = {
  id: 'closest-binary-search-tree-value-ii',
  title: 'Closest Binary Search Tree Value II',
  group: 'Hard',
  pattern: 'Two Pointers',
  difficulty: 'Hard',
  leetcode: 'https://leetcode.com/problems/closest-binary-search-tree-value-ii/',
  statement:
    'Given the `root` of a binary search tree, a `target` value and an integer `k`, return the `k` values closest to `target`. The set is guaranteed to be unique, and the answer may come back in any order.',
  constraints: [
    '1 <= k <= n <= 10^4',
    '0 <= Node.val <= 10^9',
    '-10^9 <= target <= 10^9',
  ],
  signature: {
    fn: 'closestKValues',
    params: [
      { name: 'root', type: 'tree' },
      { name: 'target', type: 'double' },
      { name: 'k', type: 'int' },
    ],
    ret: 'int[]',
  },
  compare: 'sorted',
  tests: [
    { args: [[4, 2, 5, 1, 3], 3.714286, 2], expect: [4, 3] },
    { args: [[1], 0, 1], expect: [1], note: 'single node' },
    { args: [[2, 1, 3], 5, 3], expect: [1, 2, 3], note: 'k equals the node count' },
    { args: [[4, 2, 5, 1, 3], 0, 2], expect: [1, 2], note: 'target below everything' },
    { args: [[4, 2, 5, 1, 3], 100, 3], expect: [3, 4, 5], note: 'target above everything' },
  ],
  demo: [[4, 2, 5, 1, 3], 3.714286, 2],
  starter: {
    js: `function closestKValues(root, target, k) {
  // root: TreeNode, target: number, k: number  ->  number[]
}
`,
    cpp: `vector<int> closestKValues(TreeNode* root, double target, int k) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'inorder-window',
      label: 'Flatten in order, then shrink a window',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'An in-order walk hands back the values sorted, and the k closest values in a sorted array are always contiguous. Start with the whole array and drop whichever end is further from the target until exactly k values remain.',
      code: {
        cpp: {
          lines: [
            'vector<int> closestKValues(TreeNode* root, double target, int k) {',
            '    vector<int> vals;',
            '    function<void(TreeNode*)> walk = [&](TreeNode* n) {',
            '        if (!n) return;',
            '        walk(n->left);',
            '        vals.push_back(n->val);',
            '        walk(n->right);',
            '    };',
            '    walk(root);',
            '',
            '    int lo = 0, hi = vals.size() - 1;',
            '    while (hi - lo + 1 > k) {',
            '        if (fabs(vals[lo] - target) > fabs(vals[hi] - target)) ++lo;',
            '        else --hi;',
            '    }',
            '    return vector<int>(vals.begin() + lo, vals.begin() + hi + 1);',
            '}',
          ],
        },
        js: {
          lines: [
            'function closestKValues(root, target, k) {',
            '  const vals = [];',
            '  const walk = (n) => {',
            '    if (!n) return;',
            '    walk(n.left);',
            '    vals.push(n.val);',
            '    walk(n.right);',
            '  };',
            '  walk(root);',
            '',
            '  let lo = 0;',
            '  let hi = vals.length - 1;',
            '  while (hi - lo + 1 > k) {',
            '    if (Math.abs(vals[lo] - target) > Math.abs(vals[hi] - target)) lo++;',
            '    else hi--;',
            '  }',
            '  return vals.slice(lo, hi + 1);',
            '}',
          ],
        },
      },

      run([level, target, k]: [(number | null)[], number, number], c) {
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

        let lo = 0
        let hi = vals.length - 1
        while (hi - lo + 1 > k) {
          c.ops++
          if (Math.abs(vals[lo] - target) > Math.abs(vals[hi] - target)) lo++
          else hi--
        }
        return vals.slice(lo, hi + 1)
      },
    },
  ],
}
