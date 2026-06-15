import type { Problem } from '@/lib/types'
import { buildTreeModel } from './tree-utils'

export const binaryTreePaths: Problem = {
  id: 'binary-tree-paths',
  title: 'Binary Tree Paths',
  group: 'Tree',
  pattern: 'DFS Backtracking',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/binary-tree-paths/',
  statement:
    'Given the root of a binary tree, return every root-to-leaf path as a string of values joined by `"->"`. A leaf is a node with no children. Any order is accepted.',
  constraints: ['1 <= nodes <= 100', '-100 <= Node.val <= 100', 'Any order of paths is accepted'],
  signature: { fn: 'binaryTreePaths', params: [{ name: 'root', type: 'tree' }], ret: 'string[]' },
  compare: 'set',
  tests: [
    { args: [[1, 2, 3, null, 5]], expect: ['1->2->5', '1->3'] },
    { args: [[1]], expect: ['1'], note: 'the root is itself a leaf' },
    { args: [[1, 2]], expect: ['1->2'] },
    { args: [[5, 4, 8, 11, null, 13, 4]], expect: ['5->4->11', '5->8->13', '5->8->4'] },
  ],
  demo: [[1, 2, 3, null, 5]],
  scale: (n) => [Array.from({ length: Math.min(n, 2000) }, (_, i) => i)],
  starter: {
    js: `function binaryTreePaths(root) {
  // root: TreeNode | null  ->  string[]
}
`,
    cpp: `vector<string> binaryTreePaths(TreeNode* root) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'dfs',
      label: 'Carry the path down, record it at leaves',
      kind: 'optimal',
      time: 'O(n * h)',
      space: 'O(h)',
      blurb:
        'The path to a node is the path to its parent plus this node, so build it on the way down rather than reconstructing it later. Only a leaf finishes a path, which is why the recursion records at nodes with no children and simply extends everywhere else.',
      code: {
        cpp: {
          lines: [
            'vector<string> binaryTreePaths(TreeNode* root) {',
            '    vector<string> out;',
            '    function<void(TreeNode*, string)> walk = [&](TreeNode* node, string path) {',
            '        if (!node) return;',
            '        string here = path.empty() ? to_string(node->val)',
            '                                   : path + "->" + to_string(node->val);',
            '        if (!node->left && !node->right) { out.push_back(here); return; }',
            '        walk(node->left, here);',
            '        walk(node->right, here);',
            '    };',
            '    walk(root, "");',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function binaryTreePaths(root) {',
            '  const out = [];',
            '  const walk = (node, path) => {',
            '    if (!node) return;',
            '    const here = path === "" ? String(node.val) : path + "->" + node.val;',
            '    if (!node.left && !node.right) { out.push(here); return; }',
            '    walk(node.left, here);',
            '    walk(node.right, here);',
            '  };',
            '  walk(root, "");',
            '  return out;',
            '}',
          ],
        },
      },

      run([level]: [(number | null)[]], c) {
        const model = buildTreeModel(level)
        const out: string[] = []
        const walk = (id: number | null, path: string) => {
          if (id == null) return
          c.ops++
          const nd = model.nodes[id]
          const here = path === '' ? String(nd.value) : `${path}->${nd.value}`
          if (nd.left == null && nd.right == null) {
            out.push(here)
            return
          }
          walk(nd.left, here)
          walk(nd.right, here)
        }
        walk(model.root, '')
        return out
      },
    },
  ],
}
