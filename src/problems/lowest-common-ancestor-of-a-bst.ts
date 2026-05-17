import { type Problem, type Tone } from '@/lib/types'
import { asTreeView, buildTreeModel } from './tree-utils'

const DEMO: [(number | null)[], number, number] = [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 3, 5]

export const lowestCommonAncestorOfABst: Problem = {
  id: 'lowest-common-ancestor-of-a-bst',
  title: 'Lowest Common Ancestor of a BST',
  group: 'Tree',
  pattern: 'BST Descent',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/',
  statement:
    'Given a BST and two of its values `p` and `q`, return the value of their lowest common ancestor — the deepest node that has both in its subtree (a node counts as its own ancestor).',
  constraints: ['2 <= nodes <= 10^4', 'p and q exist in the tree'],
  signature: {
    fn: 'lowestCommonAncestor',
    params: [
      { name: 'root', type: 'tree' },
      { name: 'p', type: 'int' },
      { name: 'q', type: 'int' },
    ],
    ret: 'int',
  },
  tests: [
    { args: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 8], expect: 6 },
    { args: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 4], expect: 2, note: 'an ancestor of itself' },
    { args: [[2, 1], 1, 2], expect: 2 },
    { args: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 3, 5], expect: 4 },
  ],
  demo: DEMO,
  starter: {
    py: `def lowestCommonAncestor(root, p, q):
    # root: TreeNode | None, p: int, q: int  ->  int (the LCA's value)
    pass
`,
    js: `function lowestCommonAncestor(root, p, q) {
  // root: TreeNode | null, p: number, q: number  ->  number (the LCA's value)
}
`,
    cpp: `int lowestCommonAncestor(TreeNode* root, int p, int q) {
    // return the LCA's value
}
`,
  },

  solutions: [
    {
      id: 'descent',
      label: 'Walk toward the split point',
      kind: 'optimal',
      time: 'O(h)',
      space: 'O(1)',
      blurb:
        'In a BST, ordering tells you where p and q live. If both are smaller than the current node, the answer is entirely in the left subtree; both larger, the right. The first node where they separate — one on each side, or equal to it — is the lowest common ancestor.',
      code: {
        py: {
          lines: [
            'def lowestCommonAncestor(root, p, q):',
            '    node = root',
            '    while node:',
            '        if p < node.val and q < node.val:',
            '            node = node.left',
            '        elif p > node.val and q > node.val:',
            '            node = node.right',
            '        else:',
            '            return node.val',
            '    return -1',
          ],
          map: { init: 2, left: 5, right: 7, split: 9, done: 10 },
        },
        cpp: {
          lines: [
            'int lowestCommonAncestor(TreeNode* root, int p, int q) {',
            '    TreeNode* node = root;',
            '    while (node) {',
            '        if (p < node->val && q < node->val) node = node->left;',
            '        else if (p > node->val && q > node->val) node = node->right;',
            '        else return node->val;',
            '    }',
            '    return -1;',
            '}',
          ],
          map: { init: 2, left: 4, right: 5, split: 6, done: 8 },
        },
        js: {
          lines: [
            'function lowestCommonAncestor(root, p, q) {',
            '  let node = root;',
            '  while (node) {',
            '    if (p < node.val && q < node.val) node = node.left;',
            '    else if (p > node.val && q > node.val) node = node.right;',
            '    else return node.val;',
            '  }',
            '  return -1;',
            '}',
          ],
          map: { init: 2, left: 4, right: 5, split: 6, done: 8 },
        },
      },

      trace(t, [level, p, q]: [(number | null)[], number, number]) {
        const model = buildTreeModel(level)
        const path: number[] = []

        const view = (focus: number | null, tone: Tone) =>
          asTreeView(model, {
            tones: Object.fromEntries(
              model.nodes.map((nd) => [
                nd.id,
                focus === nd.id
                  ? tone
                  : path.includes(nd.id)
                    ? 'done'
                    : nd.value === p || nd.value === q
                      ? 'accent'
                      : 'band',
              ]),
            ),
            title: `BST · looking for the ancestor of ${p} and ${q} (violet)`,
          })

        t.push({
          step: 'init',
          note: `Find where ${p} and ${q} part ways. While both lie on the same side of the current node, descend that way; the split point is their lowest common ancestor.`,
          view: view(model.root, 'active'),
          vars: [
            ['p', p, 'c'],
            ['q', q, 'c'],
          ],
        })

        let node = model.root
        while (node != null && !t.full) {
          const nd = model.nodes[node]
          t.bump()
          path.push(node)

          if (p < nd.value && q < nd.value) {
            t.push({
              step: 'left',
              note: `Both ${p} and ${q} are smaller than ${nd.value} — their whole story happens in the left subtree.`,
              view: view(node, 'active'),
              vars: [
                ['at', nd.value, 'b'],
                ['direction', 'left', 'a'],
              ],
              badge: { text: `both < ${nd.value}: go left`, accent: 'a' },
            })
            node = nd.left
          } else if (p > nd.value && q > nd.value) {
            t.push({
              step: 'right',
              note: `Both ${p} and ${q} are larger than ${nd.value} — descend right.`,
              view: view(node, 'active'),
              vars: [
                ['at', nd.value, 'b'],
                ['direction', 'right', 'b'],
              ],
              badge: { text: `both > ${nd.value}: go right`, accent: 'b' },
            })
            node = nd.right
          } else {
            t.push({
              step: 'split',
              note:
                nd.value === p || nd.value === q
                  ? `${nd.value} is one of the two targets itself — a node is its own ancestor, so this is the LCA.`
                  : `${p} and ${q} split here: one falls left of ${nd.value}, the other right. No deeper node can hold both. LCA found.`,
              view: view(node, 'good'),
              vars: [['answer', nd.value, 'ok']],
              badge: { text: `LCA = ${nd.value}`, accent: 'ok' },
            })
            return
          }
        }

        t.push({
          step: 'done',
          note: 'Walked off the tree — inputs violated the guarantee.',
          view: view(null, 'idle'),
          vars: [['answer', -1, 'no']],
        })
      },

      run([level, p, q]: [(number | null)[], number, number], c) {
        const model = buildTreeModel(level)
        let node = model.root
        while (node != null) {
          c.ops++
          const nd = model.nodes[node]
          if (p < nd.value && q < nd.value) node = nd.left
          else if (p > nd.value && q > nd.value) node = nd.right
          else return nd.value
        }
        return -1
      },
    },
  ],
}
