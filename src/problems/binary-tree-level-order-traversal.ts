import { combo, stackOf, type Problem, type Tone } from '@/lib/types'
import { asTreeView, buildTreeModel } from './tree-utils'

const DEMO: [(number | null)[]] = [[3, 9, 20, 6, 1, 15, 7]]

export const binaryTreeLevelOrderTraversal: Problem = {
  id: 'binary-tree-level-order-traversal',
  title: 'Binary Tree Level Order Traversal',
  group: 'Tree',
  pattern: 'BFS',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
  statement: "Return the tree's node values level by level, left to right, as a list of lists.",
  constraints: ['0 <= nodes <= 2000'],
  signature: { fn: 'levelOrder', params: [{ name: 'root', type: 'tree' }], ret: 'int[][]' },
  tests: [
    { args: [[3, 9, 20, null, null, 15, 7]], expect: [[3], [9, 20], [15, 7]] },
    { args: [[1]], expect: [[1]] },
    { args: [[]], expect: [], note: 'empty tree' },
    { args: [[1, 2, 3, 4, null, null, 5]], expect: [[1], [2, 3], [4, 5]] },
  ],
  demo: DEMO,
  scale: (n) => [Array.from({ length: Math.min(n, 2000) }, (_, i) => i)],
  starter: {
    js: `function levelOrder(root) {
  // root: TreeNode | null  ->  number[][]
}
`,
    cpp: `vector<vector<int>> levelOrder(TreeNode* root) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'bfs',
      label: 'A queue, drained one level at a time',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'A queue naturally visits the tree breadth-first. The one refinement: snapshot the queue length before each round, drain exactly that many nodes — that batch is one complete level — while their children pile up behind for the next round.',
      code: {
        cpp: {
          lines: [
            'vector<vector<int>> levelOrder(TreeNode* root) {',
            '    if (!root) return {};',
            '    vector<vector<int>> out;',
            '    queue<TreeNode*> q;',
            '    q.push(root);',
            '    while (!q.empty()) {',
            '        int size = q.size();',
            '        vector<int> row;',
            '        for (int i = 0; i < size; ++i) {',
            '            TreeNode* node = q.front(); q.pop();',
            '            row.push_back(node->val);',
            '            if (node->left) q.push(node->left);',
            '            if (node->right) q.push(node->right);',
            '        }',
            '        out.push_back(row);',
            '    }',
            '    return out;',
            '}',
          ],
          map: { init: 5, row: 7, take: 11, seal: 15, done: 17 },
        },
        js: {
          lines: [
            'function levelOrder(root) {',
            '  if (root === null) return [];',
            '  const out = [];',
            '  const queue = [root];',
            '  while (queue.length) {',
            '    const size = queue.length;',
            '    const row = [];',
            '    for (let i = 0; i < size; i++) {',
            '      const node = queue.shift();',
            '      row.push(node.val);',
            '      if (node.left) queue.push(node.left);',
            '      if (node.right) queue.push(node.right);',
            '    }',
            '    out.push(row);',
            '  }',
            '  return out;',
            '}',
          ],
          map: { init: 4, row: 6, take: 10, seal: 14, done: 16 },
        },
      },

      trace(t, [level]: [(number | null)[]]) {
        const model = buildTreeModel(level)
        const done = new Set<number>()
        const queue: number[] = model.root != null ? [model.root] : []
        const out: number[][] = []

        const view = (focus: number | null, tone: Tone) =>
          combo(
            asTreeView(model, {
              tones: Object.fromEntries(
                model.nodes.map((nd) => [
                  nd.id,
                  focus === nd.id ? tone : done.has(nd.id) ? 'done' : queue.includes(nd.id) ? 'band' : 'idle',
                ]),
              ),
              title: 'tree — queued nodes highlighted',
            }),
            stackOf(queue.map((id) => model.nodes[id].value), { title: 'queue' }),
          )

        if (model.root == null) {
          t.push({
            step: 'init',
            note: 'Empty tree, empty answer.',
            view: view(null, 'idle'),
            vars: [['answer', '[]', 'ok']],
          })
          return
        }

        t.push({
          step: 'init',
          note: 'The root seeds the queue. Each round drains exactly the nodes that were present at its start — that batch is one level.',
          view: view(model.root, 'active'),
          vars: [],
        })

        while (queue.length && !t.full) {
          const size = queue.length
          const row: number[] = []
          t.push({
            step: 'row',
            note: `Round ${out.length + 1}: the queue holds ${size} node${size === 1 ? '' : 's'} — the complete level. Drain exactly ${size}.`,
            view: view(null, 'idle'),
            vars: [['level size', size, 'c']],
            badge: { text: `level of ${size}`, accent: 'c' },
          })

          for (let i = 0; i < size && !t.full; i++) {
            const id = queue.shift()!
            const node = model.nodes[id]
            row.push(node.value)
            done.add(id)
            t.bump()
            if (node.left != null) queue.push(node.left)
            if (node.right != null) queue.push(node.right)
            t.push({
              step: 'take',
              note: `Take ${node.value} into the row; its children join the back of the queue for the next level.`,
              view: view(id, 'good'),
              vars: [
                ['took', node.value, 'ok'],
                ['row', `[${row.join(', ')}]`, 'c'],
              ],
            })
          }

          out.push(row)
          t.push({
            step: 'seal',
            note: `Level ${out.length} sealed: [${row.join(', ')}].`,
            view: view(null, 'idle'),
            vars: [['levels', out.length, 'ok']],
            badge: { text: `[${row.join(', ')}]`, accent: 'ok' },
          })
        }

        t.push({
          step: 'done',
          note: `${out.length} levels: ${JSON.stringify(out)}. Every node entered and left the queue once.`,
          view: view(null, 'idle'),
          vars: [['answer', JSON.stringify(out), 'ok']],
          badge: { text: `${out.length} levels`, accent: 'ok' },
        })
      },

      run([level]: [(number | null)[]], c) {
        const model = buildTreeModel(level)
        if (model.root == null) return []
        const out: number[][] = []
        let queue = [model.root]
        while (queue.length) {
          const next: number[] = []
          const row: number[] = []
          for (const id of queue) {
            c.ops++
            const nd = model.nodes[id]
            row.push(nd.value)
            if (nd.left != null) next.push(nd.left)
            if (nd.right != null) next.push(nd.right)
          }
          out.push(row)
          queue = next
        }
        return out
      },
    },
  ],
}
