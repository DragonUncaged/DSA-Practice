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
    { args: [[8, 4, 12, 2, 6, 10, 14], 9, 4], expect: [6, 8, 10, 12], note: 'closest values straddle the target' },
    { args: [[8, 4, 12, 2, 6, 10, 14], 6, 1], expect: [6], note: 'k of one, target on a node' },
    { args: [[8, 4, 12, 2, 6, 10, 14], 5.5, 7], expect: [2, 4, 6, 8, 10, 12, 14], note: 'every node' },
  ],
  scale: (n) => [Array.from({ length: n }, (_, i) => i), n / 2, 3],
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
      id: 'sort-by-distance',
      label: 'Collect every value and sort by distance',
      kind: 'brute',
      time: 'O(n log n)',
      space: 'O(n)',
      blurb:
        'Gather all the values, sort them by how far they sit from the target, and take the first `k`. Nothing about the tree is used — not even that an in-order walk would have handed the values back already sorted.',
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
            '    sort(vals.begin(), vals.end(), [&](int a, int b) {',
            '        return fabs(a - target) < fabs(b - target);',
            '    });',
            '    vals.resize(k);',
            '    return vals;',
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
            '  vals.sort((a, b) => Math.abs(a - target) - Math.abs(b - target));',
            '  return vals.slice(0, k);',
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
        vals.sort((a, b) => {
          c.ops++
          return Math.abs(a - target) - Math.abs(b - target)
        })
        return vals.slice(0, k)
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'inorder-window',
      label: 'Flatten in order, then shrink a window',
      kind: 'better',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'An in-order walk hands back the values already sorted, so the sort was wasted, and the `k` closest values in a sorted array are always contiguous. Start with the whole array and drop whichever end is further from the target until exactly `k` values remain — linear, with no comparator.',
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
    // -----------------------------------------------------------------------
    {
      id: 'two-stacks',
      label: 'Two lazy iterators either side of the target',
      kind: 'optimal',
      time: 'O(h + k)',
      space: 'O(h)',
      blurb:
        'The window still visits all `n` values to keep `k` of them. Instead, walk one search path and split it into two stacks: nodes at or below the target, and nodes above it. Each stack is a lazy in-order iterator — pop the top, then push one spine of its subtree to expose the next value. Take the closer of the two tops `k` times, so the work is one path plus `k` steps.',
      code: {
        cpp: {
          lines: [
            'vector<int> closestKValues(TreeNode* root, double target, int k) {',
            '    vector<TreeNode*> pred, succ;  // <= target and > target, nearest on top',
            '    for (TreeNode* n = root; n; ) {',
            '        if (n->val <= target) { pred.push_back(n); n = n->right; }',
            '        else { succ.push_back(n); n = n->left; }',
            '    }',
            '    auto nextPred = [&]() {',
            '        TreeNode* n = pred.back(); pred.pop_back();',
            '        for (TreeNode* c = n->left; c; c = c->right) pred.push_back(c);',
            '        return n->val;',
            '    };',
            '    auto nextSucc = [&]() {',
            '        TreeNode* n = succ.back(); succ.pop_back();',
            '        for (TreeNode* c = n->right; c; c = c->left) succ.push_back(c);',
            '        return n->val;',
            '    };',
            '    vector<int> out;',
            '    while ((int)out.size() < k) {',
            '        if (pred.empty()) out.push_back(nextSucc());',
            '        else if (succ.empty()) out.push_back(nextPred());',
            '        else if (target - pred.back()->val <= succ.back()->val - target) out.push_back(nextPred());',
            '        else out.push_back(nextSucc());',
            '    }',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function closestKValues(root, target, k) {',
            '  const pred = []; // values <= target, nearest on top',
            '  const succ = []; // values > target, nearest on top',
            '  for (let n = root; n; ) {',
            '    if (n.val <= target) { pred.push(n); n = n.right; }',
            '    else { succ.push(n); n = n.left; }',
            '  }',
            '  const nextPred = () => {',
            '    const n = pred.pop();',
            '    for (let c = n.left; c; c = c.right) pred.push(c);',
            '    return n.val;',
            '  };',
            '  const nextSucc = () => {',
            '    const n = succ.pop();',
            '    for (let c = n.right; c; c = c.left) succ.push(c);',
            '    return n.val;',
            '  };',
            '',
            '  const out = [];',
            '  while (out.length < k) {',
            '    if (pred.length === 0) out.push(nextSucc());',
            '    else if (succ.length === 0) out.push(nextPred());',
            '    else if (target - pred[pred.length - 1].val <= succ[succ.length - 1].val - target) out.push(nextPred());',
            '    else out.push(nextSucc());',
            '  }',
            '  return out;',
            '}',
          ],
        },
      },

      run([level, target, k]: [(number | null)[], number, number], c) {
        const { nodes, root } = buildTreeModel(level)
        const pred: number[] = []
        const succ: number[] = []
        for (let id = root; id != null; ) {
          c.ops++
          if (nodes[id].value <= target) {
            pred.push(id)
            id = nodes[id].right
          } else {
            succ.push(id)
            id = nodes[id].left
          }
        }
        const nextPred = () => {
          const id = pred.pop()!
          for (let ch = nodes[id].left; ch != null; ch = nodes[ch].right) {
            c.ops++
            pred.push(ch)
          }
          return nodes[id].value
        }
        const nextSucc = () => {
          const id = succ.pop()!
          for (let ch = nodes[id].right; ch != null; ch = nodes[ch].left) {
            c.ops++
            succ.push(ch)
          }
          return nodes[id].value
        }
        const out: number[] = []
        while (out.length < k) {
          c.ops++
          if (pred.length === 0) out.push(nextSucc())
          else if (succ.length === 0) out.push(nextPred())
          else if (target - nodes[pred[pred.length - 1]].value <= nodes[succ[succ.length - 1]].value - target)
            out.push(nextPred())
          else out.push(nextSucc())
        }
        return out
      },
    },
  ],
}
