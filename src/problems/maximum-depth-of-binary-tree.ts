import { type Problem } from '@/lib/types'
import { asTreeView, buildTreeModel } from './tree-utils'

const DEMO: [(number | null)[]] = [[3, 9, 20, null, null, 15, 7]]

export const maximumDepthOfBinaryTree: Problem = {
  id: 'maximum-depth-of-binary-tree',
  title: 'Maximum Depth of Binary Tree',
  group: 'Tree',
  pattern: 'DFS Recursion',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
  statement: 'Return the maximum depth of a binary tree — the number of nodes on the longest root-to-leaf path.',
  constraints: ['0 <= nodes <= 10^4'],
  signature: { fn: 'maxDepth', params: [{ name: 'root', type: 'tree' }], ret: 'int' },
  tests: [
    { args: [[3, 9, 20, null, null, 15, 7]], expect: 3 },
    { args: [[1, null, 2]], expect: 2 },
    { args: [[]], expect: 0, note: 'empty tree' },
    { args: [[1]], expect: 1 },
  ],
  demo: DEMO,
  scale: (n) => [Array.from({ length: Math.min(n, 2000) }, (_, i) => i)],
  starter: {
    py: `def maxDepth(root):
    # root: TreeNode | None  ->  int
    pass
`,
    js: `function maxDepth(root) {
  // root: TreeNode | null  ->  number
}
`,
    cpp: `int maxDepth(TreeNode* root) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'dfs',
      label: 'One plus the deeper child',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(h)',
      blurb:
        'A tree\'s depth is one more than the deeper of its two subtrees, and an empty tree is depth zero. That one-line recurrence, applied at every node, is the entire algorithm.',
      code: {
        py: {
          lines: [
            'def maxDepth(root):',
            '    if root is None:',
            '        return 0',
            '    return 1 + max(maxDepth(root.left),',
            '                   maxDepth(root.right))',
          ],
          map: { init: 1, leaf: 3, up: 4, done: 4 },
        },
        cpp: {
          lines: [
            'int maxDepth(TreeNode* root) {',
            '    if (!root) return 0;',
            '    return 1 + max(maxDepth(root->left),',
            '                   maxDepth(root->right));',
            '}',
          ],
          map: { init: 1, leaf: 2, up: 3, done: 3 },
        },
        js: {
          lines: [
            'function maxDepth(root) {',
            '  if (root === null) return 0;',
            '  return 1 + Math.max(maxDepth(root.left),',
            '                      maxDepth(root.right));',
            '}',
          ],
          map: { init: 1, leaf: 2, up: 3, done: 3 },
        },
      },

      trace(t, [level]: [(number | null)[]]) {
        const model = buildTreeModel(level)
        const depths = new Map<number, number>()

        const view = (focus: number | null) =>
          asTreeView(model, {
            tones: Object.fromEntries(
              model.nodes.map((nd) => [nd.id, depths.has(nd.id) ? 'done' : 'band']),
            ),
            pointers: focus != null ? [{ name: 'at', at: focus, accent: 'b' }] : [],
            title: 'tree — settled nodes know their subtree depth',
          })

        if (model.root == null) {
          t.push({
            step: 'init',
            note: 'An empty tree has depth 0 by definition — the recursion\'s base case is the whole answer.',
            view: view(null),
            vars: [['answer', 0, 'ok']],
          })
          return
        }

        t.push({
          step: 'init',
          note: 'Descend to the leaves first; every node then reports 1 + the deeper of its children on the way back up.',
          view: view(model.root),
          vars: [],
        })

        const dfs = (id: number | null, depth: number): number => {
          if (id == null || t.full) return 0
          const node = model.nodes[id]
          t.bump()
          const isLeaf = node.left == null && node.right == null
          if (isLeaf) {
            depths.set(id, 1)
            t.push({
              step: 'leaf',
              note: `${node.value} is a leaf: its two empty children report 0, so it reports 1.`,
              view: view(id),
              vars: [
                ['node', node.value, 'b'],
                ['reports', 1, 'ok'],
              ],
              badge: { text: `${node.value} → 1`, accent: 'ok' },
            })
            return 1
          }
          const l = dfs(node.left, depth + 1)
          const r = dfs(node.right, depth + 1)
          const d = 1 + Math.max(l, r)
          depths.set(id, d)
          t.push({
            step: 'up',
            note: `${node.value}: left subtree is ${l} deep, right is ${r} — report 1 + max = ${d}.`,
            view: view(id),
            vars: [
              ['node', node.value, 'b'],
              ['left', l],
              ['right', r],
              ['reports', d, 'ok'],
            ],
            badge: { text: `${node.value} → ${d}`, accent: 'ok' },
          })
          return d
        }

        const answer = dfs(model.root, 1)
        t.push({
          step: 'done',
          note: `The root reported ${answer} — the longest root-to-leaf path has ${answer} nodes. Every node was visited exactly once.`,
          view: view(null),
          vars: [['answer', answer, 'ok']],
          badge: { text: `depth ${answer}`, accent: 'ok' },
        })
      },

      run([level]: [(number | null)[]], c) {
        const model = buildTreeModel(level)
        const dfs = (id: number | null): number => {
          if (id == null) return 0
          c.ops++
          const nd = model.nodes[id]
          return 1 + Math.max(dfs(nd.left), dfs(nd.right))
        }
        return dfs(model.root)
      },
    },
  ],
}
