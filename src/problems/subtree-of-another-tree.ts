import { combo, type Problem, type Tone } from '@/lib/types'
import { asTreeView, buildTreeModel, type TreeModel } from './tree-utils'

const DEMO: [(number | null)[], (number | null)[]] = [[3, 4, 5, 1, 2], [4, 1, 2]]

export const subtreeOfAnotherTree: Problem = {
  id: 'subtree-of-another-tree',
  title: 'Subtree of Another Tree',
  group: 'Tree',
  pattern: 'DFS + Same-Tree Check',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/subtree-of-another-tree/',
  statement:
    'Return `true` if `subRoot` appears somewhere inside `root` as a complete subtree — same shape, same values, all the way to the leaves.',
  constraints: ['1 <= root nodes <= 2000', '1 <= subRoot nodes <= 1000'],
  signature: {
    fn: 'isSubtree',
    params: [
      { name: 'root', type: 'tree' },
      { name: 'subRoot', type: 'tree' },
    ],
    ret: 'bool',
  },
  tests: [
    { args: [[3, 4, 5, 1, 2], [4, 1, 2]], expect: true },
    { args: [[3, 4, 5, 1, 2, null, null, null, null, 0], [4, 1, 2]], expect: false, note: 'extra child below breaks it' },
    { args: [[1], [1]], expect: true },
    { args: [[1, 1], [1]], expect: true },
  ],
  demo: DEMO,
  scale: (n) => [Array.from({ length: Math.min(n, 1000) }, (_, i) => i % 7), [0, 1, 2]],
  starter: {
    py: `def isSubtree(root, subRoot):
    # root, subRoot: TreeNode | None  ->  bool
    pass
`,
    js: `function isSubtree(root, subRoot) {
  // root, subRoot: TreeNode | null  ->  boolean
}
`,
    cpp: `bool isSubtree(TreeNode* root, TreeNode* subRoot) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'anchor',
      label: 'Try every matching anchor',
      kind: 'optimal',
      time: 'O(m * n)',
      space: 'O(h)',
      blurb:
        'Walk the big tree; wherever a node\'s value equals subRoot\'s root, anchor a full Same Tree comparison there. Values elsewhere cannot start a match, and a failed anchor costs only the length of the agreement before divergence.',
      code: {
        py: {
          lines: [
            'def isSubtree(root, subRoot):',
            '    def same(a, b):',
            '        if a is None and b is None:',
            '            return True',
            '        if a is None or b is None or a.val != b.val:',
            '            return False',
            '        return same(a.left, b.left) and same(a.right, b.right)',
            '    def walk(node):',
            '        if node is None:',
            '            return False',
            '        if node.val == subRoot.val and same(node, subRoot):',
            '            return True',
            '        return walk(node.left) or walk(node.right)',
            '    return walk(root)',
          ],
          map: { init: 14, anchor: 11, hit: 12, miss: 13, done: 14 },
        },
        cpp: {
          lines: [
            'bool isSubtree(TreeNode* root, TreeNode* subRoot) {',
            '    function<bool(TreeNode*, TreeNode*)> same = [&](TreeNode* a, TreeNode* b) {',
            '        if (!a && !b) return true;',
            '        if (!a || !b || a->val != b->val) return false;',
            '        return same(a->left, b->left) && same(a->right, b->right);',
            '    };',
            '    function<bool(TreeNode*)> walk = [&](TreeNode* node) {',
            '        if (!node) return false;',
            '        if (node->val == subRoot->val && same(node, subRoot)) return true;',
            '        return walk(node->left) || walk(node->right);',
            '    };',
            '    return walk(root);',
            '}',
          ],
          map: { init: 12, anchor: 9, hit: 9, miss: 10, done: 12 },
        },
        js: {
          lines: [
            'function isSubtree(root, subRoot) {',
            '  const same = (a, b) => {',
            '    if (a === null && b === null) return true;',
            '    if (a === null || b === null || a.val !== b.val) return false;',
            '    return same(a.left, b.left) && same(a.right, b.right);',
            '  };',
            '  const walk = (node) => {',
            '    if (node === null) return false;',
            '    if (node.val === subRoot.val && same(node, subRoot)) return true;',
            '    return walk(node.left) || walk(node.right);',
            '  };',
            '  return walk(root);',
            '}',
          ],
          map: { init: 12, anchor: 9, hit: 9, miss: 10, done: 12 },
        },
      },

      trace(t, [levelA, levelB]: [(number | null)[], (number | null)[]]) {
        const A = buildTreeModel(levelA)
        const B = buildTreeModel(levelB)
        const checked = new Set<number>()

        const view = (focus: number | null, tone: Tone, matched: number[] = []) =>
          combo(
            asTreeView(A, {
              tones: Object.fromEntries(
                A.nodes.map((nd) => [
                  nd.id,
                  matched.includes(nd.id) ? 'good' : focus === nd.id ? tone : checked.has(nd.id) ? 'done' : 'band',
                ]),
              ),
              title: 'root',
            }),
            asTreeView(B, {
              tones: Object.fromEntries(B.nodes.map((nd) => [nd.id, 'accent'])),
              title: 'subRoot — the pattern to find',
            }),
          )

        const same = (ai: number | null, bi: number | null): boolean => {
          if (ai == null && bi == null) return true
          if (ai == null || bi == null) return false
          if (A.nodes[ai].value !== B.nodes[bi].value) return false
          t.bump()
          return same(A.nodes[ai].left, B.nodes[bi].left) && same(A.nodes[ai].right, B.nodes[bi].right)
        }

        const collect = (m: TreeModel, id: number | null, out: number[]) => {
          if (id == null) return
          out.push(id)
          collect(m, m.nodes[id].left, out)
          collect(m, m.nodes[id].right, out)
        }

        t.push({
          step: 'init',
          note: `Search the big tree for an anchor node valued ${B.nodes[B.root!]?.value} — only there can the pattern possibly start.`,
          view: view(A.root, 'active'),
          vars: [],
        })

        const walk = (id: number | null): boolean => {
          if (id == null || t.full) return false
          const nd = A.nodes[id]
          checked.add(id)
          t.bump()

          if (nd.value === B.nodes[B.root!].value) {
            const ok = same(id, B.root)
            if (ok) {
              const matchedIds: number[] = []
              collect(A, id, matchedIds)
              t.push({
                step: 'hit',
                note: `Anchored at ${nd.value}: the full Same Tree comparison matches shape and values all the way down. Subtree found.`,
                view: view(id, 'good', matchedIds),
                vars: [
                  ['anchor', nd.value, 'ok'],
                  ['answer', 'true', 'ok'],
                ],
                badge: { text: 'subtree found', accent: 'ok' },
              })
              return true
            }
            t.push({
              step: 'anchor',
              note: `${nd.value} matches subRoot's root, so a full comparison was anchored here — but it diverged below. Keep hunting.`,
              view: view(id, 'bad'),
              vars: [['anchor', nd.value, 'no']],
              badge: { text: 'anchor failed', accent: 'no' },
            })
          }
          return walk(nd.left) || walk(nd.right)
        }

        const found = walk(A.root)
        if (!found) {
          t.push({
            step: 'miss',
            note: 'Every anchor failed — the pattern never fits.',
            view: view(null, 'idle'),
            vars: [['answer', 'false', 'no']],
            badge: { text: 'false', accent: 'no' },
          })
        }

        t.push({
          step: 'done',
          note: found ? 'Result: true.' : 'Result: false.',
          view: view(null, 'idle'),
          vars: [['answer', String(found), found ? 'ok' : 'no']],
        })
      },

      run([levelA, levelB]: [(number | null)[], (number | null)[]], c) {
        const A = buildTreeModel(levelA)
        const B = buildTreeModel(levelB)
        const same = (ai: number | null, bi: number | null): boolean => {
          c.ops++
          if (ai == null && bi == null) return true
          if (ai == null || bi == null) return false
          if (A.nodes[ai].value !== B.nodes[bi].value) return false
          return same(A.nodes[ai].left, B.nodes[bi].left) && same(A.nodes[ai].right, B.nodes[bi].right)
        }
        const walk = (id: number | null): boolean => {
          if (id == null) return false
          c.ops++
          if (same(id, B.root)) return true
          return walk(A.nodes[id].left) || walk(A.nodes[id].right)
        }
        return walk(A.root)
      },
    },
  ],
}
