import { combo, text, type Problem, type Tone } from '@/lib/types'
import { asTreeView, buildTreeModel } from './tree-utils'

const DEMO: [(number | null)[]] = [[1, 2, 3, null, null, 4, 5]]

export const serializeAndDeserializeBinaryTree: Problem = {
  id: 'serialize-and-deserialize-binary-tree',
  title: 'Serialize and Deserialize Binary Tree',
  group: 'Tree',
  pattern: 'Preorder with Null Markers',
  difficulty: 'Hard',
  leetcode: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/',
  statement:
    'Design `serialize`, which flattens a binary tree to a string, and `deserialize`, which rebuilds the identical tree. The runner calls your single function `serdes(root)`, which must return `deserialize(serialize(root))` using your own two helpers.',
  constraints: ['0 <= nodes <= 10^4', 'Any encoding format you like'],
  signature: { fn: 'serdes', params: [{ name: 'root', type: 'tree' }], ret: 'tree' },
  tests: [
    { args: [[1, 2, 3, null, null, 4, 5]], expect: [1, 2, 3, null, null, 4, 5] },
    { args: [[]], expect: [], note: 'empty tree round-trips' },
    { args: [[1]], expect: [1] },
    { args: [[1, 2, null, 3]], expect: [1, 2, null, 3], note: 'lopsided chain' },
  ],
  demo: DEMO,
  starter: {
    py: `def serdes(root):
    # implement serialize(root) -> str and deserialize(s) -> TreeNode | None,
    # then return deserialize(serialize(root))
    pass
`,
    js: `function serdes(root) {
  // implement serialize(root) -> string and deserialize(s) -> TreeNode | null,
  // then return deserialize(serialize(root))
}
`,
    cpp: `TreeNode* serdes(TreeNode* root) {
    // implement serialize/deserialize, return deserialize(serialize(root))
}
`,
  },

  solutions: [
    {
      id: 'preorder-null',
      label: 'Preorder, with the nulls written down',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'Preorder alone is ambiguous — you cannot tell where a subtree ends. Write the nulls too ("#") and the ambiguity vanishes: the decoder consumes tokens in the exact order the encoder emitted them, rebuilding the shape without any bookkeeping beyond the token stream itself.',
      code: {
        py: {
          lines: [
            'def serdes(root):',
            '    def serialize(node):',
            '        if node is None:',
            "            return '#'",
            "        return f'{node.val},{serialize(node.left)},{serialize(node.right)}'",
            '    def deserialize(s):',
            "        tokens = iter(s.split(','))",
            '        def build():',
            '            tok = next(tokens)',
            "            if tok == '#':",
            '                return None',
            '            node = TreeNode(int(tok))',
            '            node.left = build()',
            '            node.right = build()',
            '            return node',
            '        return build()',
            '    return deserialize(serialize(root))',
          ],
          map: { emit: 5, null: 4, read: 12, done: 17 },
        },
        cpp: {
          lines: [
            'TreeNode* serdes(TreeNode* root) {',
            '    function<string(TreeNode*)> ser = [&](TreeNode* n) -> string {',
            '        if (!n) return "#";',
            '        return to_string(n->val) + "," + ser(n->left) + "," + ser(n->right);',
            '    };',
            '    string s = ser(root);',
            '    stringstream ss(s);',
            '    function<TreeNode*()> build = [&]() -> TreeNode* {',
            '        string tok;',
            '        getline(ss, tok, \',\');',
            '        if (tok == "#") return nullptr;',
            '        TreeNode* node = new TreeNode(stoi(tok));',
            '        node->left = build();',
            '        node->right = build();',
            '        return node;',
            '    };',
            '    return build();',
            '}',
          ],
          map: { emit: 4, null: 3, read: 12, done: 17 },
        },
        js: {
          lines: [
            'function serdes(root) {',
            '  const serialize = (node) =>',
            "    node === null ? '#' : `${node.val},${serialize(node.left)},${serialize(node.right)}`;",
            '  const deserialize = (s) => {',
            "    const tokens = s.split(',');",
            '    let i = 0;',
            '    const build = () => {',
            "      const tok = tokens[i++];",
            "      if (tok === '#') return null;",
            '      const node = new TreeNode(Number(tok));',
            '      node.left = build();',
            '      node.right = build();',
            '      return node;',
            '    };',
            '    return build();',
            '  };',
            '  return deserialize(serialize(root));',
            '}',
          ],
          map: { emit: 3, null: 3, read: 10, done: 17 },
        },
      },

      trace(t, [level]: [(number | null)[]]) {
        const model = buildTreeModel(level)
        const tokens: string[] = []
        const emitted = new Set<number>()

        const view = (focus: number | null, tone: Tone, consumed = -1) =>
          combo(
            asTreeView(model, {
              tones: Object.fromEntries(
                model.nodes.map((nd) => [nd.id, focus === nd.id ? tone : emitted.has(nd.id) ? 'done' : 'band']),
              ),
              title: 'tree',
            }),
            text(tokens.length ? tokens : ['∅'], {
              tones: Object.fromEntries(
                tokens.map((_, i) => [
                  i,
                  consumed >= 0 ? (i < consumed ? 'done' : i === consumed ? 'active' : 'idle') : 'band',
                ]),
              ),
              title: 'token stream',
              showIndex: false,
            }),
          )

        t.push({
          step: 'emit',
          note: 'Phase 1 — serialize: preorder walk, writing every node value and, crucially, a "#" for every empty child. The nulls are what make the string unambiguous.',
          view: view(model.root, 'active'),
          vars: [],
        })

        const ser = (id: number | null) => {
          if (t.full) return
          if (id == null) {
            tokens.push('#')
            t.bump()
            return
          }
          const nd = model.nodes[id]
          tokens.push(String(nd.value))
          emitted.add(id)
          t.bump()
          t.push({
            step: 'emit',
            note: `Emit ${nd.value}, then descend left, then right — its two subtrees will emit themselves (with their own #s) immediately after.`,
            view: view(id, 'good'),
            vars: [
              ['emitted', nd.value, 'ok'],
              ['stream', tokens.join(','), 'c'],
            ],
            badge: { text: `+ ${nd.value}`, accent: 'ok' },
          })
          ser(nd.left)
          ser(nd.right)
        }
        ser(model.root)

        t.push({
          step: 'null',
          note: `Serialized: "${tokens.join(',')}". Every subtree ends with the #s that close it — the decoder will never wonder where a branch stops.`,
          view: view(null, 'idle'),
          vars: [['encoded', `"${tokens.join(',')}"`, 'c']],
          badge: { text: 'serialized', accent: 'c' },
        })

        // deserialize
        let i = 0
        const build = (): boolean => {
          if (t.full) return false
          const tok = tokens[i++]
          if (tok === '#') return false
          t.bump()
          t.push({
            step: 'read',
            note: `Token "${tok}": mint the node, then rebuild its left subtree from the very next tokens, then its right. The stream's order IS the structure.`,
            view: view(null, 'idle', i - 1),
            vars: [
              ['token', tok, 'b'],
              ['position', i - 1],
            ],
            badge: { text: `read ${tok}`, accent: 'b' },
          })
          build()
          build()
          return true
        }
        build()

        t.push({
          step: 'done',
          note: 'Round trip complete: the rebuilt tree is structurally identical, nulls and all. Both directions are one linear pass.',
          view: view(null, 'idle'),
          vars: [['answer', 'identical tree', 'ok']],
          badge: { text: 'lossless', accent: 'ok' },
        })
      },

      run([level]: [(number | null)[]], c) {
        // serialize + parse cost model over the level array
        for (let i = 0; i < level.length; i++) c.ops += 2
        return level.filter((v) => v != null).length
      },
    },
  ],
}
