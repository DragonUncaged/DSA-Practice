import type { Problem } from '@/lib/types'
import { buildTreeModel } from './tree-utils'

export const findModeInBinarySearchTree: Problem = {
  id: 'find-mode-in-binary-search-tree',
  title: 'Find Mode in Binary Search Tree',
  group: 'Tree',
  pattern: 'In-order Traversal',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/find-mode-in-binary-search-tree/',
  statement:
    'Given the root of a binary search tree that may contain duplicate values, return every value that occurs most often. If several values tie, return them all, in any order.',
  constraints: [
    '1 <= nodes <= 10^4',
    'Duplicates are allowed: left <= node <= right',
    'Any order of modes is accepted',
  ],
  signature: { fn: 'findMode', params: [{ name: 'root', type: 'tree' }], ret: 'int[]' },
  compare: 'set',
  tests: [
    { args: [[1, null, 2, 2]], expect: [2] },
    { args: [[1]], expect: [1] },
    { args: [[1, null, 1]], expect: [1] },
    { args: [[2, 1, 3]], expect: [1, 2, 3], note: 'everything ties at one occurrence' },
    { args: [[6, 2, 8, 1, 2]], expect: [2] },
  ],
  demo: [[1, null, 2, 2]],
  scale: (n) => [Array.from({ length: Math.min(n, 2000) }, (_, i) => i)],
  starter: {
    js: `function findMode(root) {
  // root: TreeNode | null  ->  number[]
}
`,
    cpp: `vector<int> findMode(TreeNode* root) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'inorder-runs',
      label: 'Count runs in the in-order sequence',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(h)',
      blurb:
        'A hash map of counts works but ignores what the BST already gives you: in-order, equal values arrive consecutively. So a single run length is enough state — extend it while the value repeats, and when it beats the best seen, restart the answer list; when it ties, append to it.',
      code: {
        cpp: {
          lines: [
            'vector<int> findMode(TreeNode* root) {',
            '    vector<int> best;',
            '    int bestRun = 0, run = 0, prev = 0; bool started = false;',
            '    function<void(TreeNode*)> walk = [&](TreeNode* node) {',
            '        if (!node) return;',
            '        walk(node->left);',
            '        run = (started && node->val == prev) ? run + 1 : 1;',
            '        prev = node->val; started = true;',
            '        if (run > bestRun) { bestRun = run; best = {node->val}; }',
            '        else if (run == bestRun) best.push_back(node->val);',
            '        walk(node->right);',
            '    };',
            '    walk(root);',
            '    return best;',
            '}',
          ],
        },
        js: {
          lines: [
            'function findMode(root) {',
            '  let best = [], bestRun = 0, run = 0, prev = null;',
            '  const walk = (node) => {',
            '    if (!node) return;',
            '    walk(node.left);',
            '    run = node.val === prev ? run + 1 : 1;',
            '    prev = node.val;',
            '    if (run > bestRun) { bestRun = run; best = [node.val]; }',
            '    else if (run === bestRun) best.push(node.val);',
            '    walk(node.right);',
            '  };',
            '  walk(root);',
            '  return best;',
            '}',
          ],
        },
      },

      run([level]: [(number | null)[]], c) {
        const model = buildTreeModel(level)
        let best: number[] = []
        let bestRun = 0
        let run = 0
        let prev: number | null = null
        const walk = (id: number | null) => {
          if (id == null) return
          c.ops++
          const nd = model.nodes[id]
          walk(nd.left)
          run = nd.value === prev ? run + 1 : 1
          prev = nd.value
          if (run > bestRun) {
            bestRun = run
            best = [nd.value]
          } else if (run === bestRun) {
            best.push(nd.value)
          }
          walk(nd.right)
        }
        walk(model.root)
        return best
      },
    },
  ],
}
