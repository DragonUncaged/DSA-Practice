import type { Problem } from '@/lib/types'
import { buildTreeModel } from './tree-utils'

export const minimumAbsoluteDifferenceInBst: Problem = {
  id: 'minimum-absolute-difference-in-bst',
  title: 'Minimum Absolute Difference in BST',
  group: 'Tree',
  pattern: 'In-order Traversal',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/minimum-absolute-difference-in-bst/',
  statement:
    'Given the root of a binary search tree, return the minimum absolute difference between the values of any two different nodes. This is the same question as *Minimum Difference Between BST Nodes* — worth solving twice until the in-order reading is automatic.',
  constraints: ['2 <= nodes <= 10^4', '0 <= Node.val <= 10^5', 'The tree is a valid BST'],
  signature: {
    fn: 'getMinimumDifference',
    params: [{ name: 'root', type: 'tree' }],
    ret: 'int',
  },
  tests: [
    { args: [[4, 2, 6, 1, 3]], expect: 1 },
    { args: [[1, 0, 48, null, null, 12, 49]], expect: 1 },
    { args: [[236, 104, 701, null, 227, null, 911]], expect: 9, note: 'the pair is 227 and 236' },
    { args: [[1, null, 3]], expect: 2 },
    { args: [[5, 3, 8, 1, 4, 6, 9]], expect: 1, note: 'a full tree' },
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
    js: `function getMinimumDifference(root) {
  // root: TreeNode | null  ->  number
}
`,
    cpp: `int getMinimumDifference(TreeNode* root) {
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
        'Collect every value with any traversal, then take the absolute difference of every pair and keep the smallest. This is the statement taken literally — it works on any tree, because it never uses the fact that this one is a search tree, and that is exactly why it does quadratic work.',
      code: {
        cpp: {
          lines: [
            'int getMinimumDifference(TreeNode* root) {',
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
            'function getMinimumDifference(root) {',
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
        'Once the values are sorted the closest pair must be adjacent, so a sort followed by one sweep replaces the pair loop. The sort is the whole cost now, and it is doing a job the tree has already done: a BST is sorted data with pointers.',
      code: {
        cpp: {
          lines: [
            'int getMinimumDifference(TreeNode* root) {',
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
            'function getMinimumDifference(root) {',
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
      label: 'Sorted order comes free from in-order',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(h)',
      blurb:
        'An in-order walk visits a BST in increasing order, so the sort and the value array both disappear: the current value is always at least the previous one, their difference is already non-negative, and the answer is the smallest step between consecutive visits. This version drives the walk with an explicit stack rather than recursion, so a deep tree cannot overflow the call stack.',
      code: {
        cpp: {
          lines: [
            'int getMinimumDifference(TreeNode* root) {',
            '    int best = INT_MAX, prev = -1;',
            '    stack<TreeNode*> st;',
            '    TreeNode* node = root;',
            '    while (node || !st.empty()) {',
            '        while (node) { st.push(node); node = node->left; }',
            '        node = st.top(); st.pop();',
            '        if (prev >= 0) best = min(best, node->val - prev);',
            '        prev = node->val;',
            '        node = node->right;',
            '    }',
            '    return best;',
            '}',
          ],
        },
        js: {
          lines: [
            'function getMinimumDifference(root) {',
            '  let best = Infinity, prev = null;',
            '  const st = [];',
            '  let node = root;',
            '  while (node || st.length) {',
            '    while (node) { st.push(node); node = node.left; }',
            '    node = st.pop();',
            '    if (prev !== null) best = Math.min(best, node.val - prev);',
            '    prev = node.val;',
            '    node = node.right;',
            '  }',
            '  return best;',
            '}',
          ],
        },
      },

      run([level]: [(number | null)[]], c) {
        const model = buildTreeModel(level)
        let best = Infinity
        let prev: number | null = null
        const st: number[] = []
        let id: number | null = model.root
        while (id != null || st.length) {
          while (id != null) {
            c.ops++
            st.push(id)
            id = model.nodes[id].left
          }
          const cur = model.nodes[st.pop()!]
          if (prev !== null) best = Math.min(best, cur.value - prev)
          prev = cur.value
          id = cur.right
        }
        return best
      },
    },
  ],
}
