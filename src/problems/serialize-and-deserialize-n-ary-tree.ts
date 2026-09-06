import type { Problem } from '@/lib/types'

/**
 * The runner has no N-ary tree type, so the tree arrives in LeetCode's
 * level-order text form and the starter provides the Node class plus the
 * converters. The tests call a provided `roundTrip` that runs the learner's
 * Codec both ways and re-encodes the result, so the expected output is the
 * input itself.
 */
export const serializeAndDeserializeNaryTree: Problem = {
  id: 'serialize-and-deserialize-n-ary-tree',
  title: 'Serialize and Deserialize N-ary Tree',
  group: 'Hard',
  pattern: 'Design',
  difficulty: 'Hard',
  leetcode: 'https://leetcode.com/problems/serialize-and-deserialize-n-ary-tree/',
  statement:
    'Write `serialize` and `deserialize` for an N-ary tree, where a node holds a value and a list of children. Any format works as long as the round trip rebuilds the tree exactly. The trick is recording where a child list ends: either write each node as value plus child count, or emit a marker after the last child. The tests hand the tree over in LeetCode\'s level-order form via the provided `fromLevelOrder`, run your `Codec` there and back, and expect the same form out of `toLevelOrder`.',
  constraints: [
    'The number of nodes is in the range [0, 10^4]',
    '0 <= Node.val <= 10^4',
    'The height is at most 1000',
    'The algorithms must be stateless — no member, global or static variables',
  ],
  signature: { fn: 'roundTrip', params: [{ name: 'data', type: 'string' }], ret: 'string' },
  tests: [
    { args: ['[1,null,3,2,4,null,5,6]'], expect: '[1,null,3,2,4,null,5,6]' },
    {
      args: ['[1,null,2,3,4,5,null,null,6,7,null,8,null,9,10,null,null,11,null,12,null,13,null,null,14]'],
      expect: '[1,null,2,3,4,5,null,null,6,7,null,8,null,9,10,null,null,11,null,12,null,13,null,null,14]',
    },
    { args: ['[]'], expect: '[]', note: 'empty tree' },
    { args: ['[1]'], expect: '[1]', note: 'a lone root' },
    { args: ['[1,null,2,null,3,null,4]'], expect: '[1,null,2,null,3,null,4]', note: 'a chain of single children' },
    { args: ['[0,null,10000,0,10000]'], expect: '[0,null,10000,0,10000]', note: 'extreme values, repeated' },
    { args: ['[1,null,2,3,null,null,4,5]'], expect: '[1,null,2,3,null,null,4,5]', note: 'only the last child has children' },
  ],
  demo: ['[1,null,3,2,4,null,5,6]'],
  starter: {
    js: "// Provided: the N-ary Node and LeetCode's level-order form, e.g. \"[1,null,3,2,4,null,5,6]\".\nclass Node {\n  constructor(val, children) {\n    this.val = val;\n    this.children = children || [];\n  }\n}\nfunction fromLevelOrder(data) {\n  const items = JSON.parse(data);\n  if (items.length === 0) return null;\n  const root = new Node(items[0]);\n  const queue = [root];\n  let i = 2; // items[1] is the null after the root\n  while (queue.length && i < items.length) {\n    const parent = queue.shift();\n    while (i < items.length && items[i] !== null) {\n      const child = new Node(items[i++]);\n      parent.children.push(child);\n      queue.push(child);\n    }\n    i++; // the null that ends this child list\n  }\n  return root;\n}\nfunction toLevelOrder(root) {\n  if (!root) return '[]';\n  const out = [root.val, null];\n  const queue = [root];\n  while (queue.length) {\n    const node = queue.shift();\n    for (const child of node.children) { out.push(child.val); queue.push(child); }\n    out.push(null);\n  }\n  while (out.length && out[out.length - 1] === null) out.pop();\n  return JSON.stringify(out);\n}\n\nclass Codec {\n  serialize(root) {\n    // root: Node | null  ->  string\n  }\n\n  deserialize(data) {\n    // data: string  ->  Node | null\n  }\n}\n\n// Provided: the tests check that deserialize(serialize(root)) rebuilds the tree. Do not edit.\nfunction roundTrip(data) {\n  const codec = new Codec();\n  return toLevelOrder(codec.deserialize(codec.serialize(fromLevelOrder(data))));\n}\n",
    cpp: "// Provided: the N-ary Node and LeetCode's level-order form, e.g. \"[1,null,3,2,4,null,5,6]\".\nclass Node {\npublic:\n    int val;\n    vector<Node*> children;\n    Node(int v = 0) : val(v) {}\n};\nstatic vector<string> splitItems(const string& data) {\n    vector<string> items;\n    string cur;\n    for (size_t i = 1; i + 1 < data.size(); ++i) {\n        if (data[i] == ',') { items.push_back(cur); cur.clear(); }\n        else cur += data[i];\n    }\n    if (!cur.empty()) items.push_back(cur);\n    return items;\n}\nstatic Node* fromLevelOrder(const string& data) {\n    vector<string> items = splitItems(data);\n    if (items.empty()) return nullptr;\n    Node* root = new Node(stoi(items[0]));\n    queue<Node*> q;\n    q.push(root);\n    size_t i = 2;  // items[1] is the null after the root\n    while (!q.empty() && i < items.size()) {\n        Node* parent = q.front(); q.pop();\n        while (i < items.size() && items[i] != \"null\") {\n            Node* child = new Node(stoi(items[i++]));\n            parent->children.push_back(child);\n            q.push(child);\n        }\n        ++i;  // the null that ends this child list\n    }\n    return root;\n}\nstatic string toLevelOrder(Node* root) {\n    if (!root) return \"[]\";\n    vector<string> out{to_string(root->val), \"null\"};\n    queue<Node*> q;\n    q.push(root);\n    while (!q.empty()) {\n        Node* node = q.front(); q.pop();\n        for (Node* child : node->children) { out.push_back(to_string(child->val)); q.push(child); }\n        out.push_back(\"null\");\n    }\n    while (!out.empty() && out.back() == \"null\") out.pop_back();\n    string s = \"[\";\n    for (size_t i = 0; i < out.size(); ++i) { if (i) s += ','; s += out[i]; }\n    return s + \"]\";\n}\n\nclass Codec {\npublic:\n    string serialize(Node* root) {\n        // your code here\n    }\n\n    Node* deserialize(string data) {\n        // your code here\n    }\n};\n\n// Provided: the tests check that deserialize(serialize(root)) rebuilds the tree. Do not edit.\nstring roundTrip(string data) {\n    Codec codec;\n    return toLevelOrder(codec.deserialize(codec.serialize(fromLevelOrder(data))));\n}\n",
  },

  solutions: [
    {
      id: 'value-and-child-count',
      label: 'Preorder, writing each node as value plus child count',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'Preorder alone loses where one child list ends and the next begins, so write each node as its value followed by how many children it has. The reader then knows exactly how many subtrees to consume before returning to the parent — no end markers, no lookahead. Emitting a sentinel after each child list works just as well in the same time, so this is the one variant shown.',
      code: {
        cpp: {
          lines: [
            "// Provided: the N-ary Node and LeetCode's level-order form, e.g. \"[1,null,3,2,4,null,5,6]\".",
            'class Node {',
            'public:',
            '    int val;',
            '    vector<Node*> children;',
            '    Node(int v = 0) : val(v) {}',
            '};',
            'static vector<string> splitItems(const string& data) {',
            '    vector<string> items;',
            '    string cur;',
            '    for (size_t i = 1; i + 1 < data.size(); ++i) {',
            "        if (data[i] == ',') { items.push_back(cur); cur.clear(); }",
            '        else cur += data[i];',
            '    }',
            '    if (!cur.empty()) items.push_back(cur);',
            '    return items;',
            '}',
            'static Node* fromLevelOrder(const string& data) {',
            '    vector<string> items = splitItems(data);',
            '    if (items.empty()) return nullptr;',
            '    Node* root = new Node(stoi(items[0]));',
            '    queue<Node*> q;',
            '    q.push(root);',
            '    size_t i = 2;  // items[1] is the null after the root',
            '    while (!q.empty() && i < items.size()) {',
            '        Node* parent = q.front(); q.pop();',
            '        while (i < items.size() && items[i] != "null") {',
            '            Node* child = new Node(stoi(items[i++]));',
            '            parent->children.push_back(child);',
            '            q.push(child);',
            '        }',
            '        ++i;  // the null that ends this child list',
            '    }',
            '    return root;',
            '}',
            'static string toLevelOrder(Node* root) {',
            '    if (!root) return "[]";',
            '    vector<string> out{to_string(root->val), "null"};',
            '    queue<Node*> q;',
            '    q.push(root);',
            '    while (!q.empty()) {',
            '        Node* node = q.front(); q.pop();',
            '        for (Node* child : node->children) { out.push_back(to_string(child->val)); q.push(child); }',
            '        out.push_back("null");',
            '    }',
            '    while (!out.empty() && out.back() == "null") out.pop_back();',
            '    string s = "[";',
            "    for (size_t i = 0; i < out.size(); ++i) { if (i) s += ','; s += out[i]; }",
            '    return s + "]";',
            '}',
            '',
            'class Codec {',
            '    void write(Node* node, string& out) {',
            '        out += to_string(node->val) + " " + to_string(node->children.size()) + " ";',
            '        for (Node* child : node->children) write(child, out);',
            '    }',
            '    Node* read(istringstream& in) {',
            '        int val, count;',
            '        in >> val >> count;',
            '        Node* node = new Node(val);',
            '        for (int k = 0; k < count; ++k) node->children.push_back(read(in));',
            '        return node;',
            '    }',
            '',
            'public:',
            '    // preorder: each node is written as "value childCount", so the reader knows',
            '    // exactly how many subtrees follow without any end marker',
            '    string serialize(Node* root) {',
            '        string out;',
            '        if (root) write(root, out);',
            '        return out;',
            '    }',
            '',
            '    Node* deserialize(string data) {',
            '        if (data.empty()) return nullptr;',
            '        istringstream in(data);',
            '        return read(in);',
            '    }',
            '};',
            '',
            '// Provided wrapper, unchanged from the starter',
            'string roundTrip(string data) {',
            '    Codec codec;',
            '    return toLevelOrder(codec.deserialize(codec.serialize(fromLevelOrder(data))));',
            '}',
          ],
        },
        js: {
          lines: [
            "// Provided: the N-ary Node and LeetCode's level-order form, e.g. \"[1,null,3,2,4,null,5,6]\".",
            'class Node {',
            '  constructor(val, children) {',
            '    this.val = val;',
            '    this.children = children || [];',
            '  }',
            '}',
            'function fromLevelOrder(data) {',
            '  const items = JSON.parse(data);',
            '  if (items.length === 0) return null;',
            '  const root = new Node(items[0]);',
            '  const queue = [root];',
            '  let i = 2; // items[1] is the null after the root',
            '  while (queue.length && i < items.length) {',
            '    const parent = queue.shift();',
            '    while (i < items.length && items[i] !== null) {',
            '      const child = new Node(items[i++]);',
            '      parent.children.push(child);',
            '      queue.push(child);',
            '    }',
            '    i++; // the null that ends this child list',
            '  }',
            '  return root;',
            '}',
            'function toLevelOrder(root) {',
            "  if (!root) return '[]';",
            '  const out = [root.val, null];',
            '  const queue = [root];',
            '  while (queue.length) {',
            '    const node = queue.shift();',
            '    for (const child of node.children) { out.push(child.val); queue.push(child); }',
            '    out.push(null);',
            '  }',
            '  while (out.length && out[out.length - 1] === null) out.pop();',
            '  return JSON.stringify(out);',
            '}',
            '',
            'class Codec {',
            '  // preorder: each node is written as "value childCount", so the reader knows',
            '  // exactly how many subtrees follow without any end marker',
            '  serialize(root) {',
            '    const out = [];',
            '    const walk = (node) => {',
            '      out.push(node.val, node.children.length);',
            '      for (const child of node.children) walk(child);',
            '    };',
            '    if (root) walk(root);',
            "    return out.join(' ');",
            '  }',
            '',
            '  deserialize(data) {',
            "    if (data === '') return null;",
            "    const tokens = data.split(' ').map(Number);",
            '    let at = 0;',
            '    const read = () => {',
            '      const node = new Node(tokens[at++]);',
            '      const count = tokens[at++];',
            '      for (let k = 0; k < count; k++) node.children.push(read());',
            '      return node;',
            '    };',
            '    return read();',
            '  }',
            '}',
            '',
            '// Provided wrapper, unchanged from the starter',
            'function roundTrip(data) {',
            '  const codec = new Codec();',
            '  return toLevelOrder(codec.deserialize(codec.serialize(fromLevelOrder(data))));',
            '}',
          ],
        },
      },

      run([data]: [string], c) {
        // the same round trip on plain arrays: parse the level order, encode as
        // value + child count, decode, and re-encode
        const items = JSON.parse(data) as (number | null)[]
        type N = { val: number; children: N[] }
        const build = (): N | null => {
          if (!items.length) return null
          const root: N = { val: items[0] as number, children: [] }
          const queue = [root]
          let i = 2
          while (queue.length && i < items.length) {
            const parent = queue.shift()!
            while (i < items.length && items[i] !== null) {
              c.ops++
              const child: N = { val: items[i++] as number, children: [] }
              parent.children.push(child)
              queue.push(child)
            }
            i++
          }
          return root
        }
        const tokens: number[] = []
        const write = (node: N) => {
          c.ops++
          tokens.push(node.val, node.children.length)
          for (const child of node.children) write(child)
        }
        const root = build()
        if (root) write(root)
        let at = 0
        const read = (): N => {
          c.ops++
          const node: N = { val: tokens[at++], children: [] }
          const count = tokens[at++]
          for (let k = 0; k < count; k++) node.children.push(read())
          return node
        }
        const back = tokens.length ? read() : null
        if (!back) return '[]'
        const out: (number | null)[] = [back.val, null]
        const queue = [back]
        while (queue.length) {
          const node = queue.shift()!
          for (const child of node.children) {
            out.push(child.val)
            queue.push(child)
          }
          out.push(null)
        }
        while (out.length && out[out.length - 1] === null) out.pop()
        return JSON.stringify(out)
      },
    },
  ],
}
