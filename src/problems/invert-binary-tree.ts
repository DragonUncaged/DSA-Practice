import { treeOf, type Problem, type Tone, type TreeView } from '@/lib/types'

const DEMO: [(number | null)[]] = [[4, 2, 7, 1, 3, 6, 9]]

export const invertBinaryTree: Problem = {
  id: 'invert-binary-tree',
  title: 'Invert Binary Tree',
  group: 'Tree',
  pattern: 'DFS Recursion',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/invert-binary-tree/',
  statement:
    'Given the `root` of a binary tree, invert it — every node swaps its left and right children — and return the root. `TreeNode` is already defined for you.',
  constraints: ['0 <= number of nodes <= 100', '-100 <= Node.val <= 100', 'Input is level-order with nulls'],
  signature: { fn: 'invertTree', params: [{ name: 'root', type: 'tree' }], ret: 'tree' },
  tests: [
    { args: [[4, 2, 7, 1, 3, 6, 9]], expect: [4, 7, 2, 9, 6, 3, 1] },
    { args: [[2, 1, 3]], expect: [2, 3, 1] },
    { args: [[]], expect: [], note: 'empty tree' },
    { args: [[1]], expect: [1], note: 'single node' },
    { args: [[1, 2]], expect: [1, null, 2], note: 'lopsided' },
  ],
  demo: DEMO,
  scale: (n) => [Array.from({ length: Math.min(n, 2000) }, (_, i) => i + 1)],
  starter: {
    py: `def invertTree(root):
    # root: TreeNode | None  ->  TreeNode | None
    pass
`,
    js: `function invertTree(root) {
  // root: TreeNode | null  ->  TreeNode | null
}
`,
    cpp: `TreeNode* invertTree(TreeNode* root) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'recursive',
      label: 'Swap on the way down',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(h)',
      blurb:
        'Inverting a tree is inverting its two subtrees and then swapping them. Swap the children at the node you are standing on, recurse into both, and the whole tree mirrors itself.',
      code: {
        py: {
          lines: [
            'def invertTree(root):',
            '    if root is None:',
            '        return None',
            '    root.left, root.right = root.right, root.left',
            '    invertTree(root.left)',
            '    invertTree(root.right)',
            '    return root',
          ],
          map: { visit: 1, base: 3, swap: 4, left: 5, right: 6, done: 7 },
        },
        cpp: {
          lines: [
            'TreeNode* invertTree(TreeNode* root) {',
            '    if (!root) return nullptr;',
            '    swap(root->left, root->right);',
            '    invertTree(root->left);',
            '    invertTree(root->right);',
            '    return root;',
            '}',
          ],
          map: { visit: 1, base: 2, swap: 3, left: 4, right: 5, done: 6 },
        },
        js: {
          lines: [
            'function invertTree(root) {',
            '  if (root === null) return null;',
            '  const tmp = root.left;',
            '  root.left = root.right;',
            '  root.right = tmp;',
            '  invertTree(root.left);',
            '  invertTree(root.right);',
            '  return root;',
            '}',
          ],
          map: { visit: 1, base: 2, swap: 4, left: 6, right: 7, done: 8 },
        },
      },

      trace(t, [level]: [(number | null)[]]) {
        // build a node model from the level-order array
        type Node = { id: number; value: number; left: number | null; right: number | null }
        const nodes: Node[] = []
        let root: number | null = null

        if (level.length && level[0] != null) {
          root = 0
          nodes.push({ id: 0, value: level[0] as number, left: null, right: null })
          const queue = [0]
          let i = 1
          while (queue.length && i < level.length) {
            const parent = nodes[queue.shift()!]
            for (const side of ['left', 'right'] as const) {
              if (i >= level.length) break
              const v = level[i++]
              if (v == null) continue
              const child: Node = { id: nodes.length, value: v, left: null, right: null }
              nodes.push(child)
              parent[side] = child.id
              queue.push(child.id)
            }
          }
        }

        const swapped = new Set<number>()

        const view = (focus: number | null, tone: Tone, title?: string): TreeView => {
          const tones: Record<number, Tone> = {}
          nodes.forEach((n) => {
            tones[n.id] = swapped.has(n.id) ? 'done' : 'band'
          })
          if (focus != null) tones[focus] = tone
          return treeOf(nodes, root, {
            tones,
            pointers: focus != null ? [{ name: 'node', at: focus, accent: 'b' }] : [],
            title: title ?? 'tree',
          })
        }

        if (root == null) {
          t.push({
            step: 'base',
            note: 'The tree is empty, so there is nothing to invert.',
            view: view(null, 'idle'),
            vars: [['answer', 'null', 'no']],
          })
          return
        }

        t.push({
          step: 'visit',
          note: 'Inverting a tree means inverting both subtrees and swapping them. Start at the root and let the recursion do the rest.',
          view: view(root, 'active'),
          vars: [['root', nodes[root].value, 'b']],
        })

        const invert = (id: number | null, depth: number) => {
          if (t.full) return
          if (id == null) return
          const node = nodes[id]
          t.bump()

          t.push({
            step: 'visit',
            note: `At node ${node.value}${depth ? ` (depth ${depth})` : ''}. Its two children are about to trade places.`,
            view: view(id, 'active'),
            vars: [
              ['node', node.value, 'b'],
              ['depth', depth],
              ['left', node.left == null ? 'null' : nodes[node.left].value, 'a'],
              ['right', node.right == null ? 'null' : nodes[node.right].value, 'c'],
            ],
          })

          const tmp = node.left
          node.left = node.right
          node.right = tmp
          swapped.add(id)

          t.push({
            step: 'swap',
            note:
              node.left == null && node.right == null
                ? `${node.value} is a leaf, so swapping nothing with nothing changes nothing — but the call still had to happen to find that out.`
                : `Swapped. ${node.value} now has ${node.left == null ? 'null' : nodes[node.left].value} on its left and ${node.right == null ? 'null' : nodes[node.right].value} on its right. Every node below shifts across with them.`,
            view: view(id, 'good'),
            vars: [
              ['node', node.value, 'b'],
              ['left', node.left == null ? 'null' : nodes[node.left].value, 'a'],
              ['right', node.right == null ? 'null' : nodes[node.right].value, 'c'],
              ['nodes visited', t.ops],
            ],
            badge: { text: `swapped at ${node.value}`, accent: 'ok' },
          })

          invert(node.left, depth + 1)
          invert(node.right, depth + 1)
        }

        invert(root, 0)

        t.push({
          step: 'done',
          note: `Every one of the ${t.ops} nodes was visited exactly once and swapped its children. The tree is now its own mirror image.`,
          view: view(root, 'good', 'inverted tree'),
          vars: [
            ['answer', nodes[root].value, 'ok'],
            ['nodes visited', t.ops],
          ],
          badge: { text: 'inverted', accent: 'ok' },
        })
      },

      run([level]: [(number | null)[]], c) {
        // node count is what drives the cost; the structure is irrelevant here
        let seen = 0
        for (const v of level) {
          c.ops++
          if (v != null) seen++
        }
        return seen
      },
    },
  ],
}
