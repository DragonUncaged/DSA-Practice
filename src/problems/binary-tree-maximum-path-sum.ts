import { type Problem, type Tone } from '@/lib/types'
import { asTreeView, buildTreeModel } from './tree-utils'

const DEMO: [(number | null)[]] = [[-10, 9, 20, null, null, 15, 7]]

export const binaryTreeMaximumPathSum: Problem = {
  id: 'binary-tree-maximum-path-sum',
  title: 'Binary Tree Maximum Path Sum',
  group: 'Tree',
  pattern: 'DFS with Gains',
  difficulty: 'Hard',
  leetcode: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/',
  statement:
    'A path is any chain of connected nodes that never revisits one; it need not pass the root. Return the maximum possible sum of a path. Values may be negative.',
  constraints: ['1 <= nodes <= 3 * 10^4', '-1000 <= Node.val <= 1000'],
  signature: { fn: 'maxPathSum', params: [{ name: 'root', type: 'tree' }], ret: 'int' },
  tests: [
    { args: [[1, 2, 3]], expect: 6 },
    { args: [[-10, 9, 20, null, null, 15, 7]], expect: 42 },
    { args: [[-3]], expect: -3, note: 'a path must contain at least one node' },
    { args: [[2, -1]], expect: 2 },
  ],
  demo: DEMO,
  scale: (n) => [Array.from({ length: Math.min(n, 2000) }, (_, i) => ((i * 13) % 21) - 10)],
  starter: {
    py: `def maxPathSum(root):
    # root: TreeNode | None  ->  int
    pass
`,
    js: `function maxPathSum(root) {
  // root: TreeNode | null  ->  number
}
`,
    cpp: `int maxPathSum(TreeNode* root) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'gain',
      label: 'Each node: best arch vs best arm',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(h)',
      blurb:
        'Every path has a highest node, where it arches over. At each node, ask two different questions: for the global answer, what is the best arch through me (left arm + me + right arm)? For my parent, what is the best single arm I can offer (me + one child, never both)? Negative arms are simply declined.',
      code: {
        py: {
          lines: [
            'def maxPathSum(root):',
            "    best = float('-inf')",
            '    def gain(node):',
            '        nonlocal best',
            '        if node is None:',
            '            return 0',
            '        left = max(gain(node.left), 0)',
            '        right = max(gain(node.right), 0)',
            '        best = max(best, node.val + left + right)',
            '        return node.val + max(left, right)',
            '    gain(root)',
            '    return best',
          ],
          map: { init: 2, arms: 8, arch: 9, arm: 10, done: 12 },
        },
        cpp: {
          lines: [
            'int maxPathSum(TreeNode* root) {',
            '    int best = INT_MIN;',
            '    function<int(TreeNode*)> gain = [&](TreeNode* node) {',
            '        if (!node) return 0;',
            '        int left = max(gain(node->left), 0);',
            '        int right = max(gain(node->right), 0);',
            '        best = max(best, node->val + left + right);',
            '        return node->val + max(left, right);',
            '    };',
            '    gain(root);',
            '    return best;',
            '}',
          ],
          map: { init: 2, arms: 6, arch: 7, arm: 8, done: 11 },
        },
        js: {
          lines: [
            'function maxPathSum(root) {',
            '  let best = -Infinity;',
            '  const gain = (node) => {',
            '    if (node === null) return 0;',
            '    const left = Math.max(gain(node.left), 0);',
            '    const right = Math.max(gain(node.right), 0);',
            '    best = Math.max(best, node.val + left + right);',
            '    return node.val + Math.max(left, right);',
            '  };',
            '  gain(root);',
            '  return best;',
            '}',
          ],
          map: { init: 2, arms: 6, arch: 7, arm: 8, done: 11 },
        },
      },

      trace(t, [level]: [(number | null)[]]) {
        const model = buildTreeModel(level)
        let best = -Infinity
        const settled = new Set<number>()

        const view = (focus: number | null, tone: Tone) =>
          asTreeView(model, {
            tones: Object.fromEntries(
              model.nodes.map((nd) => [nd.id, focus === nd.id ? tone : settled.has(nd.id) ? 'done' : 'band']),
            ),
            title: `tree · best path so far: ${best === -Infinity ? '—' : best}`,
          })

        t.push({
          step: 'init',
          note: 'Post-order: children report before parents. Each node reports the best single arm upward, but privately checks the best full arch through itself against the global record.',
          view: view(model.root, 'active'),
          vars: [['best', '-∞', 'mute']],
        })

        const gain = (id: number | null): number => {
          if (id == null || t.full) return 0
          const nd = model.nodes[id]
          const left = Math.max(gain(nd.left), 0)
          const right = Math.max(gain(nd.right), 0)
          t.bump()

          const arch = nd.value + left + right
          const arm = nd.value + Math.max(left, right)
          const isRecord = arch > best

          t.push({
            step: 'arms',
            note: `${nd.value}: usable arms are left=${left}, right=${right} (negative arms declined as 0).`,
            view: view(id, 'active'),
            vars: [
              ['node', nd.value, 'b'],
              ['left arm', left, left > 0 ? 'ok' : 'mute'],
              ['right arm', right, right > 0 ? 'ok' : 'mute'],
            ],
          })

          if (isRecord) best = arch
          t.push({
            step: 'arch',
            note: `Best arch through ${nd.value}: ${nd.value} + ${left} + ${right} = ${arch}.${isRecord ? ' New global best.' : ` Global best stays ${best}.`}`,
            view: view(id, isRecord ? 'good' : 'band'),
            vars: [
              ['arch', arch, isRecord ? 'ok' : 'mute'],
              ['best', best, 'ok'],
            ],
            badge: isRecord ? { text: `best = ${best}`, accent: 'ok' } : null,
          })

          settled.add(id)
          t.push({
            step: 'arm',
            note: `Upward, ${nd.value} may offer only one arm (a path cannot fork through a parent): ${nd.value} + max(${left}, ${right}) = ${arm}.`,
            view: view(id, 'done'),
            vars: [['offers parent', arm, 'c']],
            badge: { text: `arm = ${arm}`, accent: 'c' },
          })

          return arm
        }

        gain(model.root)
        t.push({
          step: 'done',
          note: `Maximum path sum: ${best}. Every node computed its arch exactly once — linear time despite paths being quadratic in number.`,
          view: view(null, 'idle'),
          vars: [['answer', best, 'ok']],
          badge: { text: `max ${best}`, accent: 'ok' },
        })
      },

      run([level]: [(number | null)[]], c) {
        const model = buildTreeModel(level)
        let best = -Infinity
        const gain = (id: number | null): number => {
          if (id == null) return 0
          c.ops++
          const nd = model.nodes[id]
          const left = Math.max(gain(nd.left), 0)
          const right = Math.max(gain(nd.right), 0)
          best = Math.max(best, nd.value + left + right)
          return nd.value + Math.max(left, right)
        }
        gain(model.root)
        return best
      },
    },
  ],
}
