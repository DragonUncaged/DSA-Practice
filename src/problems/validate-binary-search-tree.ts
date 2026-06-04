import { type Problem, type Tone } from '@/lib/types'
import { asTreeView, buildTreeModel } from './tree-utils'

const DEMO: [(number | null)[]] = [[5, 3, 8, 1, 6, 7, 9]]

const fmt = (x: number) => (x === -Infinity ? '-∞' : x === Infinity ? '+∞' : String(x))

export const validateBinarySearchTree: Problem = {
  id: 'validate-binary-search-tree',
  title: 'Validate Binary Search Tree',
  group: 'Tree',
  pattern: 'DFS with Bounds',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/validate-binary-search-tree/',
  statement:
    'Return `true` if the tree is a valid BST: every node in a left subtree is strictly less than its ancestor, every node in a right subtree strictly greater.',
  constraints: ['1 <= nodes <= 10^4', 'Strict inequalities — duplicates are invalid'],
  signature: { fn: 'isValidBST', params: [{ name: 'root', type: 'tree' }], ret: 'bool' },
  tests: [
    { args: [[2, 1, 3]], expect: true },
    { args: [[5, 1, 4, null, null, 3, 6]], expect: false },
    { args: [[5, 4, 6, null, null, 3, 7]], expect: false, note: 'the 3 violates a grandparent, not its parent' },
    { args: [[1]], expect: true },
    { args: [[2, 2, 2]], expect: false, note: 'duplicates fail' },
  ],
  demo: DEMO,
  scale: (n) => [Array.from({ length: Math.min(n, 2000) }, (_, i) => i)],
  starter: {
    js: `function isValidBST(root) {
  // root: TreeNode | null  ->  boolean
}
`,
    cpp: `bool isValidBST(TreeNode* root) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'bounds',
      label: 'Carry an allowed range down',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(h)',
      blurb:
        'Comparing each node with its parent misses violations against grandparents. The fix: every node inherits an allowed (low, high) range — going left tightens the ceiling to the node\'s value, going right raises the floor. A node outside its inherited range sinks the whole tree.',
      code: {
        cpp: {
          lines: [
            'bool isValidBST(TreeNode* root) {',
            '    function<bool(TreeNode*, long long, long long)> ok =',
            '        [&](TreeNode* node, long long lo, long long hi) {',
            '        if (!node) return true;',
            '        if (node->val <= lo || node->val >= hi) return false;',
            '        return ok(node->left, lo, node->val) &&',
            '               ok(node->right, node->val, hi);',
            '    };',
            '    return ok(root, LLONG_MIN, LLONG_MAX);',
            '}',
          ],
          map: { init: 9, check: 5, bad: 5, descend: 6, done: 9 },
        },
        js: {
          lines: [
            'function isValidBST(root) {',
            '  const ok = (node, lo, hi) => {',
            '    if (node === null) return true;',
            '    if (node.val <= lo || node.val >= hi) return false;',
            '    return ok(node.left, lo, node.val) &&',
            '           ok(node.right, node.val, hi);',
            '  };',
            '  return ok(root, -Infinity, Infinity);',
            '}',
          ],
          map: { init: 8, check: 4, bad: 4, descend: 5, done: 8 },
        },
      },

      trace(t, [level]: [(number | null)[]]) {
        const model = buildTreeModel(level)
        const passed = new Set<number>()

        const view = (focus: number | null, tone: Tone) =>
          asTreeView(model, {
            tones: Object.fromEntries(
              model.nodes.map((nd) => [nd.id, focus === nd.id ? tone : passed.has(nd.id) ? 'done' : 'band']),
            ),
            title: 'tree — each node must sit inside its inherited range',
          })

        t.push({
          step: 'init',
          note: 'The root may be anything: its range is (-∞, +∞). Each step left caps the ceiling; each step right lifts the floor.',
          view: view(model.root, 'active'),
          vars: [['root range', '(-∞, +∞)', 'c']],
        })

        const ok = (id: number | null, lo: number, hi: number): boolean => {
          if (id == null || t.full) return true
          const node = model.nodes[id]
          t.bump()

          if (node.value <= lo || node.value >= hi) {
            t.push({
              step: 'bad',
              note: `${node.value} must be strictly inside (${fmt(lo)}, ${fmt(hi)}) — the range its ancestors imposed — but is not. This is the violation a parent-only check would miss. False.`,
              view: view(id, 'bad'),
              vars: [
                ['node', node.value, 'no'],
                ['allowed', `(${fmt(lo)}, ${fmt(hi)})`, 'no'],
              ],
              badge: { text: `${node.value} out of range`, accent: 'no' },
            })
            return false
          }

          passed.add(id)
          t.push({
            step: 'check',
            note: `${node.value} sits inside (${fmt(lo)}, ${fmt(hi)}) ✓. Left child inherits (${fmt(lo)}, ${node.value}); right child inherits (${node.value}, ${fmt(hi)}).`,
            view: view(id, 'good'),
            vars: [
              ['node', node.value, 'ok'],
              ['allowed', `(${fmt(lo)}, ${fmt(hi)})`, 'c'],
            ],
            badge: { text: `${node.value} ∈ (${fmt(lo)}, ${fmt(hi)})`, accent: 'ok' },
          })

          return ok(node.left, lo, node.value) && ok(node.right, node.value, hi)
        }

        const valid = ok(model.root, -Infinity, Infinity)
        t.push({
          step: 'done',
          note: valid
            ? 'Every node respected its inherited range — a valid BST.'
            : 'A node escaped its range; the recursion short-circuited straight back up.',
          view: view(null, 'idle'),
          vars: [['answer', String(valid), valid ? 'ok' : 'no']],
          badge: { text: String(valid), accent: valid ? 'ok' : 'no' },
        })
      },

      run([level]: [(number | null)[]], c) {
        const model = buildTreeModel(level)
        const ok = (id: number | null, lo: number, hi: number): boolean => {
          if (id == null) return true
          c.ops++
          const nd = model.nodes[id]
          if (nd.value <= lo || nd.value >= hi) return false
          return ok(nd.left, lo, nd.value) && ok(nd.right, nd.value, hi)
        }
        return ok(model.root, -Infinity, Infinity)
      },
    },
  ],
}
