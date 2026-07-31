import type { Problem } from '@/lib/types'
import { buildTreeModel } from './tree-utils'

export const minimumDifferenceBetweenBstNodes: Problem = {
  id: 'minimum-difference-between-bst-nodes',
  title: 'Minimum Difference Between BST Nodes',
  group: 'Tree',
  pattern: 'In-order Traversal',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/minimum-distance-between-bst-nodes/',
  statement:
    'Given the root of a binary search tree, return the smallest difference between the values of any two different nodes.',
  constraints: ['2 <= nodes <= 100', '0 <= Node.val <= 10^5', 'The tree is a valid BST'],
  signature: { fn: 'minDiffInBST', params: [{ name: 'root', type: 'tree' }], ret: 'int' },
  tests: [
    { args: [[4, 2, 6, 1, 3]], expect: 1 },
    { args: [[1, 0, 48, null, null, 12, 49]], expect: 1 },
    { args: [[5, 1, 7]], expect: 2, note: 'the closest pair is not parent and child' },
    { args: [[2, 1, 3]], expect: 1 },
    { args: [[1, null, 3]], expect: 2, note: 'the smallest tree allowed' },
    { args: [[90, 69, null, 49, 89]], expect: 1, note: 'the closest pair spans a subtree' },
    { args: [[100000, 0]], expect: 100000, note: 'the value bounds' },
    {
      args: [Array.from({ length: 199 }, (_, i) => (i % 2 ? null : (i / 2) * 1000))],
      expect: 1000,
      note: 'a right-leaning chain of 100 nodes',
    },
  ],
  demo: [[4, 2, 6, 1, 3]],
  scale: (n) => [Array.from({ length: Math.min(n, 2000) }, (_, i) => i)],
  starter: {
    js: `function minDiffInBST(root) {
  // root: TreeNode | null  ->  number
}
`,
    cpp: `int minDiffInBST(TreeNode* root) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'all-pairs',
      label: 'Compare every pair of nodes',
      kind: 'brute',
      time: 'O(n^2)',
      space: 'O(n)',
      blurb:
        'Collect every value with any traversal, then compare each value against every other and keep the smallest gap. It ignores the search-tree ordering completely, which is why it works on any tree at all, and also why it does quadratic work on a structure that already keeps its values in order.',
      code: {
        cpp: {
          lines: [
            'int minDiffInBST(TreeNode* root) {',
            '    vector<int> vals;',
            '    function<void(TreeNode*)> collect = [&](TreeNode* node) {',
            '        if (!node) return;',
            '        vals.push_back(node->val);',
            '        collect(node->left);',
            '        collect(node->right);',
            '    };',
            '    collect(root);',
            '    int best = INT_MAX;',
            '    for (size_t i = 0; i < vals.size(); ++i)',
            '        for (size_t j = i + 1; j < vals.size(); ++j)',
            '            best = min(best, abs(vals[i] - vals[j]));',
            '    return best;',
            '}',
          ],
        },
        js: {
          lines: [
            'function minDiffInBST(root) {',
            '  const vals = [];',
            '  const collect = (node) => {',
            '    if (!node) return;',
            '    vals.push(node.val);',
            '    collect(node.left);',
            '    collect(node.right);',
            '  };',
            '  collect(root);',
            '  let best = Infinity;',
            '  for (let i = 0; i < vals.length; i++)',
            '    for (let j = i + 1; j < vals.length; j++)',
            '      best = Math.min(best, Math.abs(vals[i] - vals[j]));',
            '  return best;',
            '}',
          ],
        },
      },
      run([level]: [(number | null)[]], c) {
        const model = buildTreeModel(level)
        const vals: number[] = []
        const collect = (id: number | null) => {
          if (id == null) return
          c.ops++
          vals.push(model.nodes[id].value)
          collect(model.nodes[id].left)
          collect(model.nodes[id].right)
        }
        collect(model.root)
        let best = Infinity
        for (let i = 0; i < vals.length; i++)
          for (let j = i + 1; j < vals.length; j++) {
            c.ops++
            best = Math.min(best, Math.abs(vals[i] - vals[j]))
          }
        return best
      },
    },
    {
      id: 'collect-and-sort',
      label: 'Collect the values, sort, check neighbours',
      kind: 'better',
      time: 'O(n log n)',
      space: 'O(n)',
      blurb:
        'In a sorted list the closest pair is always adjacent, so sorting the collected values cuts the pair check to one linear sweep. The sort is now the whole cost — and it is redundant, because a search tree can hand its values over already sorted.',
      code: {
        cpp: {
          lines: [
            'int minDiffInBST(TreeNode* root) {',
            '    vector<int> vals;',
            '    function<void(TreeNode*)> collect = [&](TreeNode* node) {',
            '        if (!node) return;',
            '        vals.push_back(node->val);',
            '        collect(node->left);',
            '        collect(node->right);',
            '    };',
            '    collect(root);',
            '    sort(vals.begin(), vals.end());',
            '    int best = INT_MAX;',
            '    for (size_t i = 1; i < vals.size(); ++i)',
            '        best = min(best, vals[i] - vals[i - 1]);',
            '    return best;',
            '}',
          ],
        },
        js: {
          lines: [
            'function minDiffInBST(root) {',
            '  const vals = [];',
            '  const collect = (node) => {',
            '    if (!node) return;',
            '    vals.push(node.val);',
            '    collect(node.left);',
            '    collect(node.right);',
            '  };',
            '  collect(root);',
            '  vals.sort((a, b) => a - b);',
            '  let best = Infinity;',
            '  for (let i = 1; i < vals.length; i++)',
            '    best = Math.min(best, vals[i] - vals[i - 1]);',
            '  return best;',
            '}',
          ],
        },
      },
      run([level]: [(number | null)[]], c) {
        const model = buildTreeModel(level)
        const vals: number[] = []
        const collect = (id: number | null) => {
          if (id == null) return
          c.ops++
          vals.push(model.nodes[id].value)
          collect(model.nodes[id].left)
          collect(model.nodes[id].right)
        }
        collect(model.root)
        vals.sort((a, b) => a - b)
        c.ops += vals.length * Math.ceil(Math.log2(vals.length + 1))
        let best = Infinity
        for (let i = 1; i < vals.length; i++) {
          c.ops++
          best = Math.min(best, vals[i] - vals[i - 1])
        }
        return best
      },
    },
    {
      id: 'inorder-gap',
      label: 'In-order, compare with the previous value',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(h)',
      blurb:
        'An in-order walk of a BST reads its values in sorted order for free, so the sort and the collected array both go. The smallest difference anywhere in the tree is the smallest gap between consecutive visits — one traversal, one remembered previous value, and only the recursion stack as memory.',
      code: {
        cpp: {
          lines: [
            'int minDiffInBST(TreeNode* root) {',
            '    int best = INT_MAX;',
            '    TreeNode* prev = nullptr;',
            '    function<void(TreeNode*)> walk = [&](TreeNode* node) {',
            '        if (!node) return;',
            '        walk(node->left);',
            '        if (prev) best = min(best, node->val - prev->val);',
            '        prev = node;',
            '        walk(node->right);',
            '    };',
            '    walk(root);',
            '    return best;',
            '}',
          ],
        },
        js: {
          lines: [
            'function minDiffInBST(root) {',
            '  let best = Infinity, prev = null;',
            '  const walk = (node) => {',
            '    if (!node) return;',
            '    walk(node.left);',
            '    if (prev !== null) best = Math.min(best, node.val - prev);',
            '    prev = node.val;',
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
        let best = Infinity
        let prev: number | null = null
        const walk = (id: number | null) => {
          if (id == null) return
          c.ops++
          const nd = model.nodes[id]
          walk(nd.left)
          if (prev !== null) best = Math.min(best, nd.value - prev)
          prev = nd.value
          walk(nd.right)
        }
        walk(model.root)
        return best
      },
    },
  ],
}
