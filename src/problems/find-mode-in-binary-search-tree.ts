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
    { args: [[1, 1, 2]], expect: [1], note: 'the duplicate sits on the left' },
    { args: [[3, 1, 4, null, 2]], expect: [1, 2, 3, 4] },
    { args: [[-1, -1]], expect: [-1], note: 'negative values' },
    {
      args: [Array.from({ length: 1999 }, (_, i) => (i % 2 ? null : 7))],
      expect: [7],
      note: 'a right-leaning chain of 1000 equal values',
    },
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
      id: 'count-per-node',
      label: 'Count each node\'s value with a full traversal',
      kind: 'brute',
      time: 'O(n^2)',
      space: 'O(h)',
      blurb:
        'For every node, walk the whole tree counting how many nodes share its value, and keep the values whose count is the largest seen. It needs no extra structure and ignores the search-tree ordering completely, which is exactly why every node pays a full traversal — quadratic on a tree that already groups equal values together.',
      code: {
        cpp: {
          lines: [
            'vector<int> findMode(TreeNode* root) {',
            '    vector<TreeNode*> nodes;',
            '    function<void(TreeNode*)> collect = [&](TreeNode* node) {',
            '        if (!node) return;',
            '        nodes.push_back(node);',
            '        collect(node->left);',
            '        collect(node->right);',
            '    };',
            '    collect(root);',
            '    vector<int> best;',
            '    int bestCount = 0;',
            '    for (TreeNode* node : nodes) {',
            '        int count = 0;',
            '        for (TreeNode* other : nodes) if (other->val == node->val) count++;',
            '        if (count > bestCount) { bestCount = count; best = {node->val}; }',
            '        else if (count == bestCount && find(best.begin(), best.end(), node->val) == best.end())',
            '            best.push_back(node->val);',
            '    }',
            '    return best;',
            '}',
          ],
        },
        js: {
          lines: [
            'function findMode(root) {',
            '  const nodes = [];',
            '  const collect = (node) => {',
            '    if (!node) return;',
            '    nodes.push(node);',
            '    collect(node.left);',
            '    collect(node.right);',
            '  };',
            '  collect(root);',
            '  let best = [], bestCount = 0;',
            '  for (const node of nodes) {',
            '    let count = 0;',
            '    for (const other of nodes) if (other.val === node.val) count++;',
            '    if (count > bestCount) { bestCount = count; best = [node.val]; }',
            '    else if (count === bestCount && !best.includes(node.val)) best.push(node.val);',
            '  }',
            '  return best;',
            '}',
          ],
        },
      },
      run([level]: [(number | null)[]], c) {
        const model = buildTreeModel(level)
        let best: number[] = []
        let bestCount = 0
        for (const node of model.nodes) {
          let count = 0
          for (const other of model.nodes) {
            c.ops++
            if (other.value === node.value) count++
          }
          if (count > bestCount) {
            bestCount = count
            best = [node.value]
          } else if (count === bestCount && !best.includes(node.value)) best.push(node.value)
        }
        return best
      },
    },
    {
      id: 'count-map',
      label: 'Tally every value in a map',
      kind: 'better',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'One traversal tallies each value in a hash map, and a second pass over the map keeps the keys with the highest count. Linear time, and it works on any tree — but the map holds every distinct value, and a search tree could have handed the counts over in order without one.',
      code: {
        cpp: {
          lines: [
            'vector<int> findMode(TreeNode* root) {',
            '    unordered_map<int, int> count;',
            '    function<void(TreeNode*)> walk = [&](TreeNode* node) {',
            '        if (!node) return;',
            '        count[node->val]++;',
            '        walk(node->left);',
            '        walk(node->right);',
            '    };',
            '    walk(root);',
            '    int bestCount = 0;',
            '    for (auto& [v, n] : count) bestCount = max(bestCount, n);',
            '    vector<int> best;',
            '    for (auto& [v, n] : count) if (n == bestCount) best.push_back(v);',
            '    return best;',
            '}',
          ],
        },
        js: {
          lines: [
            'function findMode(root) {',
            '  const count = new Map();',
            '  const walk = (node) => {',
            '    if (!node) return;',
            '    count.set(node.val, (count.get(node.val) ?? 0) + 1);',
            '    walk(node.left);',
            '    walk(node.right);',
            '  };',
            '  walk(root);',
            '  const bestCount = Math.max(...count.values());',
            '  return [...count].filter(([, n]) => n === bestCount).map(([v]) => v);',
            '}',
          ],
        },
      },
      run([level]: [(number | null)[]], c) {
        const model = buildTreeModel(level)
        const count = new Map<number, number>()
        for (const node of model.nodes) {
          c.ops++
          count.set(node.value, (count.get(node.value) ?? 0) + 1)
        }
        let bestCount = 0
        for (const n of count.values()) {
          c.ops++
          bestCount = Math.max(bestCount, n)
        }
        return [...count].filter(([, n]) => n === bestCount).map(([v]) => v)
      },
    },
    {
      id: 'inorder-runs',
      label: 'Count runs in the in-order sequence',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(h)',
      blurb:
        'The map ignores what the BST already gives you: in-order, equal values arrive consecutively. So a single run length is enough state — extend it while the value repeats, and when it beats the best seen, restart the answer list; when it ties, append to it. Only the recursion stack and the answer itself are kept.',
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
