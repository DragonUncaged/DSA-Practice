import { treeOf } from '@/lib/types'
import type { PatternIntro } from './index'

// id: value, left, right — a small tree whose subtree sums are easy to follow
const NODES = [
  { id: 0, value: 5, left: 1, right: 2 },
  { id: 1, value: 3, left: 3, right: 4 },
  { id: 2, value: 8, left: null, right: null },
  { id: 3, value: 1, left: null, right: null },
  { id: 4, value: 4, left: null, right: null },
]

export const treeDfs: PatternIntro = {
  id: 'tree-dfs',
  name: 'DFS on Trees',
  tagline: 'Solve the whole tree by trusting each child to solve its half first.',
  story: [
    'Every recursive tree solution is the same three-line thought: an empty tree has a trivial answer; otherwise ask the left child for its answer, ask the right child for its answer, and combine them with this node\'s value. The recursion is not magic — it is a *contract*: "given any subtree, I return its answer." Write the function assuming the contract already holds for smaller trees, and it holds for all of them.',
    'The demo sums a tree. Watch the order: nothing is decided on the way *down* — all the work happens on the way back *up*, as each node combines two finished reports. Depth, height-balance, sameness, inversion, path sums: they differ only in what "combine" means.',
    'Two upgrades cover the harder problems. In-order traversal (left, node, right) visits a BST in sorted order — that single fact solves validation and k-th smallest. And when the answer for a node needs more than one number from below (Maximum Path Sum), return a small tuple instead: the contract stays, the report gets richer.',
  ],
  signals: [
    'The structure is a tree, or recursively self-similar.',
    'The whole answer is some combination of the two subtree answers.',
    'A BST is involved — in-order traversal hands you sorted order for free.',
    'You keep wanting "the answer for this subtree" as a building block.',
  ],
  pseudo: {
    lines: [
      'def total(node):',
      '    if node is None: return 0',
      '    return node.val',
      '         + total(node.left)',
      '         + total(node.right)',
    ],
    map: { init: 1, leaf: 3, up: 3 },
  },

  trace(t) {
    const summed = new Map<number, number>()

    const view = (focus: number | null) =>
      treeOf(NODES, 0, {
        tones: Object.fromEntries(NODES.map((n) => [n.id, summed.has(n.id) ? 'done' : 'band'])),
        pointers: focus != null ? [{ name: 'at', at: focus, accent: 'b' }] : [],
        title: 'sum the tree — settled nodes know their subtree total',
      })

    t.push({
      step: 'init',
      note: 'Head for the leaves first. Each node will report the total of its own subtree — value plus two child reports.',
      view: view(0),
      vars: [],
    })

    const dfs = (id: number | null): number => {
      if (id == null) return 0
      const node = NODES[id]
      t.bump()
      const isLeaf = node.left == null && node.right == null
      if (isLeaf) {
        summed.set(id, node.value)
        t.push({
          step: 'leaf',
          note: `${node.value} is a leaf: its empty children report 0, so it reports ${node.value}. The base case is doing real work.`,
          view: view(id),
          vars: [
            ['node', node.value, 'b'],
            ['reports', node.value, 'ok'],
          ],
          badge: { text: `${node.value} → ${node.value}`, accent: 'ok' },
        })
        return node.value
      }
      const l = dfs(node.left)
      const r = dfs(node.right)
      const total = node.value + l + r
      summed.set(id, total)
      t.push({
        step: 'up',
        note: `${node.value} combines two finished reports: ${node.value} + ${l} + ${r} = ${total}. It never looked deeper than its own children.`,
        view: view(id),
        vars: [
          ['node', node.value, 'b'],
          ['left', l],
          ['right', r],
          ['reports', total, 'ok'],
        ],
        badge: { text: `${node.value} → ${total}`, accent: 'ok' },
      })
      return total
    }

    const answer = dfs(0)
    t.push({
      step: 'up',
      note: `The root's report is the answer: ${answer}. Every node was visited exactly once — O(n), and the "trust the children" contract held at every level.`,
      view: view(null),
      vars: [['answer', answer, 'ok']],
      badge: { text: `total ${answer}`, accent: 'ok' },
    })
  },

  ramp: [
    'maximum-depth-of-binary-tree',
    'same-tree',
    'invert-binary-tree',
    'subtree-of-another-tree',
    'lowest-common-ancestor-of-a-bst',
    'validate-binary-search-tree',
    'kth-smallest-element-in-a-bst',
    'construct-binary-tree-from-preorder-and-inorder-traversal',
    'binary-tree-maximum-path-sum',
    'serialize-and-deserialize-binary-tree',
  ],
}
