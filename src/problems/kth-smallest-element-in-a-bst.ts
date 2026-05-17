import { type Problem, type Tone } from '@/lib/types'
import { asTreeView, buildTreeModel } from './tree-utils'

const DEMO: [(number | null)[], number] = [[5, 3, 6, 2, 4, null, null, 1], 3]

export const kthSmallestElementInABst: Problem = {
  id: 'kth-smallest-element-in-a-bst',
  title: 'Kth Smallest Element in a BST',
  group: 'Tree',
  pattern: 'In-order Traversal',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/',
  statement: 'Return the `k`-th smallest value in a binary search tree (1-indexed).',
  constraints: ['1 <= k <= nodes <= 10^4'],
  signature: {
    fn: 'kthSmallest',
    params: [
      { name: 'root', type: 'tree' },
      { name: 'k', type: 'int' },
    ],
    ret: 'int',
  },
  tests: [
    { args: [[3, 1, 4, null, 2], 1], expect: 1 },
    { args: [[5, 3, 6, 2, 4, null, null, 1], 3], expect: 3 },
    { args: [[7], 1], expect: 7 },
    { args: [[3, 1, 4, null, 2], 4], expect: 4 },
  ],
  demo: DEMO,
  scale: (n) => [Array.from({ length: Math.min(n, 2000) }, (_, i) => i), Math.max(1, Math.floor(n / 2))],
  starter: {
    py: `def kthSmallest(root, k):
    # root: TreeNode | None, k: int  ->  int
    pass
`,
    js: `function kthSmallest(root, k) {
  // root: TreeNode | null, k: number  ->  number
}
`,
    cpp: `int kthSmallest(TreeNode* root, int k) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'inorder',
      label: 'In-order walk, stop at k',
      kind: 'optimal',
      time: 'O(h + k)',
      space: 'O(h)',
      blurb:
        'An in-order traversal of a BST — left subtree, node, right subtree — visits values in exactly sorted order. So walk in-order, count each node as you pass it, and the k-th one you touch is the answer. No sorting, no extra array, stop the moment you hit k.',
      code: {
        py: {
          lines: [
            'def kthSmallest(root, k):',
            '    stack = []',
            '    node = root',
            '    while stack or node:',
            '        while node:',
            '            stack.append(node)',
            '            node = node.left',
            '        node = stack.pop()',
            '        k -= 1',
            '        if k == 0:',
            '            return node.val',
            '        node = node.right',
          ],
          map: { init: 2, dive: 7, visit: 9, found: 11, done: 12 },
        },
        cpp: {
          lines: [
            'int kthSmallest(TreeNode* root, int k) {',
            '    vector<TreeNode*> stack;',
            '    TreeNode* node = root;',
            '    while (!stack.empty() || node) {',
            '        while (node) { stack.push_back(node); node = node->left; }',
            '        node = stack.back(); stack.pop_back();',
            '        if (--k == 0) return node->val;',
            '        node = node->right;',
            '    }',
            '    return -1;',
            '}',
          ],
          map: { init: 2, dive: 5, visit: 7, found: 7, done: 10 },
        },
        js: {
          lines: [
            'function kthSmallest(root, k) {',
            '  const stack = [];',
            '  let node = root;',
            '  while (stack.length || node) {',
            '    while (node) {',
            '      stack.push(node);',
            '      node = node.left;',
            '    }',
            '    node = stack.pop();',
            '    k--;',
            '    if (k === 0) return node.val;',
            '    node = node.right;',
            '  }',
            '  return -1;',
            '}',
          ],
          map: { init: 2, dive: 7, visit: 10, found: 11, done: 14 },
        },
      },

      trace(t, [level, k]: [(number | null)[], number]) {
        const model = buildTreeModel(level)
        const visited: number[] = []

        const view = (focus: number | null, tone: Tone) =>
          asTreeView(model, {
            tones: Object.fromEntries(
              model.nodes.map((nd) => [
                nd.id,
                focus === nd.id ? tone : visited.includes(nd.id) ? 'done' : 'band',
              ]),
            ),
            title: `BST — in-order visits values in sorted order · counted: ${visited.length}`,
          })

        t.push({
          step: 'init',
          note: `Want the ${k}-th smallest. In-order (left, node, right) reads a BST in ascending order, so just count visits.`,
          view: view(model.root, 'active'),
          vars: [['k', k, 'c']],
        })

        const stack: number[] = []
        let node = model.root
        let remaining = k
        while ((stack.length || node != null) && !t.full) {
          while (node != null && !t.full) {
            stack.push(node)
            node = model.nodes[node].left
            t.bump()
          }
          const id = stack.pop()!
          const nd = model.nodes[id]
          visited.push(id)
          remaining--
          t.bump()

          if (remaining === 0) {
            t.push({
              step: 'found',
              note: `${nd.value} is visit number ${k} — the ${k}-th smallest. Stop here; the rest of the tree is never touched.`,
              view: view(id, 'good'),
              vars: [
                ['visit', k, 'ok'],
                ['answer', nd.value, 'ok'],
              ],
              badge: { text: `k-th = ${nd.value}`, accent: 'ok' },
            })
            return
          }

          t.push({
            step: 'visit',
            note: `Visit ${visited.length}: ${nd.value} — the ${visited.length}${visited.length === 1 ? 'st' : visited.length === 2 ? 'nd' : visited.length === 3 ? 'rd' : 'th'} smallest so far. ${remaining} to go.`,
            view: view(id, 'active'),
            vars: [
              ['visited', nd.value, 'b'],
              ['remaining', remaining, 'c'],
            ],
          })
          node = nd.right
        }

        t.push({
          step: 'done',
          note: 'Fewer than k nodes — should not happen under the constraints.',
          view: view(null, 'idle'),
          vars: [['answer', -1, 'no']],
        })
      },

      run([level, k]: [(number | null)[], number], c) {
        const model = buildTreeModel(level)
        const stack: number[] = []
        let node = model.root
        let remaining = k
        while (stack.length || node != null) {
          while (node != null) {
            c.ops++
            stack.push(node)
            node = model.nodes[node].left
          }
          const id = stack.pop()!
          c.ops++
          if (--remaining === 0) return model.nodes[id].value
          node = model.nodes[id].right
        }
        return -1
      },
    },
  ],
}
