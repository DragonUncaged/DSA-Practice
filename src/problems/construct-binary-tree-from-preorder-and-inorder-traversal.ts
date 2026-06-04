import { arr, combo, type Problem, type Tone } from '@/lib/types'
import { asTreeView, type TreeModel } from './tree-utils'

const DEMO: [number[], number[]] = [[3, 9, 20, 15, 7], [9, 3, 15, 20, 7]]

export const constructBinaryTree: Problem = {
  id: 'construct-binary-tree-from-preorder-and-inorder-traversal',
  title: 'Construct Binary Tree from Preorder and Inorder Traversal',
  group: 'Tree',
  pattern: 'Divide by the Root',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/',
  statement:
    'Given the `preorder` and `inorder` traversals of a tree with distinct values, rebuild the tree and return its root.',
  constraints: ['1 <= nodes <= 3000', 'All values distinct'],
  signature: {
    fn: 'buildTree',
    params: [
      { name: 'preorder', type: 'int[]' },
      { name: 'inorder', type: 'int[]' },
    ],
    ret: 'tree',
  },
  tests: [
    { args: [[3, 9, 20, 15, 7], [9, 3, 15, 20, 7]], expect: [3, 9, 20, null, null, 15, 7] },
    { args: [[-1], [-1]], expect: [-1] },
    { args: [[1, 2], [2, 1]], expect: [1, 2] },
    { args: [[1, 2, 3], [3, 2, 1]], expect: [1, 2, null, 3] },
  ],
  demo: DEMO,
  starter: {
    js: `function buildTree(preorder, inorder) {
  // preorder, inorder: number[]  ->  TreeNode | null
}
`,
    cpp: `TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'divide',
      label: 'Preorder names the root, inorder splits the rest',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'Preorder\'s first element is always the root. Find it in the inorder list: everything left of it is the left subtree, everything right is the right subtree. Recurse on both halves — with a value-to-index map so each lookup is O(1).',
      code: {
        cpp: {
          lines: [
            'TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {',
            '    unordered_map<int, int> pos;',
            '    for (int i = 0; i < inorder.size(); ++i) pos[inorder[i]] = i;',
            '    int idx = 0;',
            '    function<TreeNode*(int, int)> build = [&](int lo, int hi) -> TreeNode* {',
            '        if (lo > hi) return nullptr;',
            '        int val = preorder[idx++];',
            '        TreeNode* node = new TreeNode(val);',
            '        int mid = pos[val];',
            '        node->left = build(lo, mid - 1);',
            '        node->right = build(mid + 1, hi);',
            '        return node;',
            '    };',
            '    return build(0, inorder.size() - 1);',
            '}',
          ],
          map: { init: 3, root: 9, split: 10, done: 14 },
        },
        js: {
          lines: [
            'function buildTree(preorder, inorder) {',
            '  const pos = new Map(inorder.map((v, i) => [v, i]));',
            '  let idx = 0;',
            '  const build = (lo, hi) => {',
            '    if (lo > hi) return null;',
            '    const val = preorder[idx++];',
            '    const node = new TreeNode(val);',
            '    const mid = pos.get(val);',
            '    node.left = build(lo, mid - 1);',
            '    node.right = build(mid + 1, hi);',
            '    return node;',
            '  };',
            '  return build(0, inorder.length - 1);',
            '}',
          ],
          map: { init: 2, root: 8, split: 9, done: 13 },
        },
      },

      trace(t, [preorder, inorder]: [number[], number[]]) {
        const pos = new Map(inorder.map((v, i) => [v, i]))
        const model: TreeModel = { nodes: [], root: null }
        const idToValue = new Map<number, number>()
        let idx = 0

        const view = (focus: number | null, lo: number, hi: number, tone: Tone) =>
          combo(
            arr(preorder, {
              tones: Object.fromEntries(preorder.map((_, k) => [k, k < idx ? 'done' : k === idx ? 'active' : 'idle'])),
              pointers: idx < preorder.length ? [{ name: 'next', at: idx, accent: 'a' }] : [],
              title: 'preorder — consumed strictly left to right',
            }),
            arr(inorder, {
              tones: Object.fromEntries(
                inorder.map((_, k) => [k, k >= lo && k <= hi ? 'band' : 'dim']),
              ),
              band: lo <= hi ? { from: lo, to: hi, label: 'current slice', accent: 'c' } : null,
              title: 'inorder — the root splits each slice',
            }),
            asTreeView(model, {
              tones: Object.fromEntries(model.nodes.map((nd) => [nd.id, focus === nd.id ? tone : 'done'])),
              title: 'tree under construction',
            }),
          )

        t.push({
          step: 'init',
          note: 'Preorder hands out roots in construction order; inorder tells each root how much of the remaining values belong on its left versus right.',
          view: view(null, 0, inorder.length - 1, 'idle'),
          vars: [],
        })

        const build = (lo: number, hi: number, parent: number | null, side: 'left' | 'right' | null): number | null => {
          if (lo > hi || t.full) return null
          const val = preorder[idx++]
          const mid = pos.get(val)!
          const id = model.nodes.length
          model.nodes.push({ id, value: val, left: null, right: null })
          idToValue.set(id, val)
          if (parent == null) model.root = id
          else if (side === 'left') model.nodes[parent].left = id
          else if (side === 'right') model.nodes[parent].right = id
          t.bump()

          t.push({
            step: 'root',
            note: `Next preorder value is ${val} — the root of the current slice. In inorder it sits at index ${mid}: ${mid - lo} value${mid - lo === 1 ? '' : 's'} go left, ${hi - mid} go right.`,
            view: view(id, lo, hi, 'active'),
            vars: [
              ['root of slice', val, 'b'],
              ['left size', mid - lo, 'c'],
              ['right size', hi - mid, 'c'],
            ],
            badge: { text: `root ${val}`, accent: 'b' },
          })

          model.nodes[id].left = build(lo, mid - 1, id, 'left')
          model.nodes[id].right = build(mid + 1, hi, id, 'right')

          if (mid - lo > 0 || hi - mid > 0) {
            t.push({
              step: 'split',
              note: `Both halves under ${val} are settled.`,
              view: view(id, lo, hi, 'good'),
              vars: [['settled', val, 'ok']],
            })
          }
          return id
        }

        build(0, inorder.length - 1, null, null)

        t.push({
          step: 'done',
          note: `Tree rebuilt: ${model.nodes.length} nodes, each preorder value consumed exactly once and located in inorder by an O(1) map lookup.`,
          view: view(null, 0, -1, 'idle'),
          vars: [['answer', 'tree reconstructed', 'ok']],
          badge: { text: 'reconstructed', accent: 'ok' },
        })
      },

      run([preorder, inorder]: [number[], number[]], c) {
        const pos = new Map(inorder.map((v, i) => [v, i]))
        let idx = 0
        const build = (lo: number, hi: number): number => {
          if (lo > hi) return 0
          c.ops++
          const val = preorder[idx++]
          const mid = pos.get(val)!
          return 1 + build(lo, mid - 1) + build(mid + 1, hi)
        }
        return build(0, inorder.length - 1)
      },
    },
  ],
}
