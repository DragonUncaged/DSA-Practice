import { combo, type Problem, type Tone } from '@/lib/types'
import { asTreeView, buildTreeModel, type TreeModel } from './tree-utils'

const DEMO: [(number | null)[], (number | null)[]] = [[1, 2, 3, 4], [1, 2, 3, 5]]

export const sameTree: Problem = {
  id: 'same-tree',
  title: 'Same Tree',
  group: 'Tree',
  pattern: 'Parallel DFS',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/same-tree/',
  statement: 'Return `true` if two binary trees are structurally identical with equal node values.',
  constraints: ['0 <= nodes <= 100'],
  signature: {
    fn: 'isSameTree',
    params: [
      { name: 'p', type: 'tree' },
      { name: 'q', type: 'tree' },
    ],
    ret: 'bool',
  },
  tests: [
    { args: [[1, 2, 3], [1, 2, 3]], expect: true },
    { args: [[1, 2], [1, null, 2]], expect: false, note: 'same values, different shape' },
    { args: [[1, 2, 1], [1, 1, 2]], expect: false },
    { args: [[], []], expect: true, note: 'two empty trees' },
  ],
  demo: DEMO,
  scale: (n) => {
    const a = Array.from({ length: Math.min(n, 2000) }, (_, i) => i)
    return [a, a]
  },
  starter: {
    py: `def isSameTree(p, q):
    # p, q: TreeNode | None  ->  bool
    pass
`,
    js: `function isSameTree(p, q) {
  // p, q: TreeNode | null  ->  boolean
}
`,
    cpp: `bool isSameTree(TreeNode* p, TreeNode* q) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'parallel',
      label: 'Walk both trees in lockstep',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(h)',
      blurb:
        'March through both trees simultaneously. At each pair of positions there are three cases: both empty (fine), one empty or values differ (fail immediately), or recurse into both children pairs. The first mismatch short-circuits everything above it.',
      code: {
        py: {
          lines: [
            'def isSameTree(p, q):',
            '    if p is None and q is None:',
            '        return True',
            '    if p is None or q is None or p.val != q.val:',
            '        return False',
            '    return (isSameTree(p.left, q.left) and',
            '            isSameTree(p.right, q.right))',
          ],
          map: { init: 1, both: 3, diff: 5, match: 6, done: 7 },
        },
        cpp: {
          lines: [
            'bool isSameTree(TreeNode* p, TreeNode* q) {',
            '    if (!p && !q) return true;',
            '    if (!p || !q || p->val != q->val) return false;',
            '    return isSameTree(p->left, q->left) &&',
            '           isSameTree(p->right, q->right);',
            '}',
          ],
          map: { init: 1, both: 2, diff: 3, match: 4, done: 5 },
        },
        js: {
          lines: [
            'function isSameTree(p, q) {',
            '  if (p === null && q === null) return true;',
            '  if (p === null || q === null || p.val !== q.val) return false;',
            '  return isSameTree(p.left, q.left) &&',
            '         isSameTree(p.right, q.right);',
            '}',
          ],
          map: { init: 1, both: 2, diff: 3, match: 4, done: 5 },
        },
      },

      trace(t, [levelP, levelQ]: [(number | null)[], (number | null)[]]) {
        const P = buildTreeModel(levelP)
        const Q = buildTreeModel(levelQ)
        const okP = new Set<number>()
        const okQ = new Set<number>()

        const view = (fp: number | null, fq: number | null, tone: Tone) => {
          const tonesFor = (m: TreeModel, ok: Set<number>, focus: number | null) =>
            Object.fromEntries(
              m.nodes.map((nd) => [nd.id, focus === nd.id ? tone : ok.has(nd.id) ? 'done' : 'band']),
            ) as Record<number, Tone>
          return combo(
            asTreeView(P, { tones: tonesFor(P, okP, fp), title: 'tree p' }),
            asTreeView(Q, { tones: tonesFor(Q, okQ, fq), title: 'tree q' }),
          )
        }

        t.push({
          step: 'init',
          note: 'Both trees are walked in lockstep — position by position, the same path in each.',
          view: view(P.root, Q.root, 'active'),
          vars: [],
        })

        const walk = (pi: number | null, qi: number | null): boolean => {
          if (t.full) return true
          t.bump()
          if (pi == null && qi == null) {
            t.push({
              step: 'both',
              note: 'Both positions are empty — vacuously identical here.',
              view: view(null, null, 'idle'),
              vars: [['pair', 'null vs null', 'ok']],
            })
            return true
          }
          if (pi == null || qi == null || P.nodes[pi].value !== Q.nodes[qi].value) {
            t.push({
              step: 'diff',
              note:
                pi == null || qi == null
                  ? `One tree has a node here (${pi == null ? Q.nodes[qi!].value : P.nodes[pi].value}) and the other has nothing — shapes diverge. False, immediately.`
                  : `${P.nodes[pi].value} ≠ ${Q.nodes[qi].value} — values diverge. False, immediately.`,
              view: view(pi, qi, 'bad'),
              vars: [
                ['p', pi == null ? 'null' : P.nodes[pi].value, 'no'],
                ['q', qi == null ? 'null' : Q.nodes[qi].value, 'no'],
              ],
              badge: { text: 'mismatch', accent: 'no' },
            })
            return false
          }
          okP.add(pi)
          okQ.add(qi)
          t.push({
            step: 'match',
            note: `${P.nodes[pi].value} matches ${Q.nodes[qi].value} — descend into both children pairs.`,
            view: view(pi, qi, 'good'),
            vars: [['pair', `${P.nodes[pi].value} = ${Q.nodes[qi].value}`, 'ok']],
            badge: { text: `${P.nodes[pi].value} ✓`, accent: 'ok' },
          })
          return walk(P.nodes[pi].left, Q.nodes[qi].left) && walk(P.nodes[pi].right, Q.nodes[qi].right)
        }

        const same = walk(P.root, Q.root)
        t.push({
          step: 'done',
          note: same
            ? 'Every position agreed — the trees are identical.'
            : 'The walk stopped at the first disagreement; nothing beyond it needed checking.',
          view: view(null, null, 'idle'),
          vars: [['answer', String(same), same ? 'ok' : 'no']],
          badge: { text: String(same), accent: same ? 'ok' : 'no' },
        })
      },

      run([levelP, levelQ]: [(number | null)[], (number | null)[]], c) {
        const n = Math.max(levelP.length, levelQ.length)
        for (let i = 0; i < n; i++) {
          c.ops++
          if ((levelP[i] ?? null) !== (levelQ[i] ?? null)) return false
        }
        return true
      },
    },
  ],
}
