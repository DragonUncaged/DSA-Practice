import type { Problem } from '@/lib/types'

/**
 * Same scaffold as Serialize and Deserialize N-ary Tree: the tree arrives in
 * LeetCode's level-order text form, and a provided `roundTrip` runs the
 * learner's Codec into a binary tree and back before re-encoding the result.
 */
export const encodeNaryTreeToBinaryTree: Problem = {
  id: 'encode-n-ary-tree-to-binary-tree',
  title: 'Encode N-ary Tree to Binary Tree',
  group: 'Hard',
  pattern: 'Design',
  difficulty: 'Hard',
  leetcode: 'https://leetcode.com/problems/encode-n-ary-tree-to-binary-tree/',
  statement:
    "Write `encode` and `decode` that turn an N-ary tree into a binary tree and back without losing anything. The classic mapping is left-child right-sibling: a node's first child becomes its binary left child, and each remaining child hangs off the previous one as a binary right child. The tests hand the tree over in LeetCode's level-order form via the provided `fromLevelOrder`, run your `Codec` there and back, and expect the same form out of `toLevelOrder`.",
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
    js: "// Provided: the N-ary Node and LeetCode's level-order form, e.g. \"[1,null,3,2,4,null,5,6]\".\nclass Node {\n  constructor(val, children) {\n    this.val = val;\n    this.children = children || [];\n  }\n}\nfunction fromLevelOrder(data) {\n  const items = JSON.parse(data);\n  if (items.length === 0) return null;\n  const root = new Node(items[0]);\n  const queue = [root];\n  let i = 2; // items[1] is the null after the root\n  while (queue.length && i < items.length) {\n    const parent = queue.shift();\n    while (i < items.length && items[i] !== null) {\n      const child = new Node(items[i++]);\n      parent.children.push(child);\n      queue.push(child);\n    }\n    i++; // the null that ends this child list\n  }\n  return root;\n}\nfunction toLevelOrder(root) {\n  if (!root) return '[]';\n  const out = [root.val, null];\n  const queue = [root];\n  while (queue.length) {\n    const node = queue.shift();\n    for (const child of node.children) { out.push(child.val); queue.push(child); }\n    out.push(null);\n  }\n  while (out.length && out[out.length - 1] === null) out.pop();\n  return JSON.stringify(out);\n}\n\nclass Codec {\n  encode(root) {\n    // root: Node | null  ->  TreeNode | null\n  }\n\n  decode(root) {\n    // root: TreeNode | null  ->  Node | null\n  }\n}\n\n// Provided: the tests check that decode(encode(root)) rebuilds the tree. Do not edit.\nfunction roundTrip(data) {\n  const codec = new Codec();\n  return toLevelOrder(codec.decode(codec.encode(fromLevelOrder(data))));\n}\n",
    cpp: "// Provided: the N-ary Node and LeetCode's level-order form, e.g. \"[1,null,3,2,4,null,5,6]\".\nclass Node {\npublic:\n    int val;\n    vector<Node*> children;\n    Node(int v = 0) : val(v) {}\n};\nstatic vector<string> splitItems(const string& data) {\n    vector<string> items;\n    string cur;\n    for (size_t i = 1; i + 1 < data.size(); ++i) {\n        if (data[i] == ',') { items.push_back(cur); cur.clear(); }\n        else cur += data[i];\n    }\n    if (!cur.empty()) items.push_back(cur);\n    return items;\n}\nstatic Node* fromLevelOrder(const string& data) {\n    vector<string> items = splitItems(data);\n    if (items.empty()) return nullptr;\n    Node* root = new Node(stoi(items[0]));\n    queue<Node*> q;\n    q.push(root);\n    size_t i = 2;  // items[1] is the null after the root\n    while (!q.empty() && i < items.size()) {\n        Node* parent = q.front(); q.pop();\n        while (i < items.size() && items[i] != \"null\") {\n            Node* child = new Node(stoi(items[i++]));\n            parent->children.push_back(child);\n            q.push(child);\n        }\n        ++i;  // the null that ends this child list\n    }\n    return root;\n}\nstatic string toLevelOrder(Node* root) {\n    if (!root) return \"[]\";\n    vector<string> out{to_string(root->val), \"null\"};\n    queue<Node*> q;\n    q.push(root);\n    while (!q.empty()) {\n        Node* node = q.front(); q.pop();\n        for (Node* child : node->children) { out.push_back(to_string(child->val)); q.push(child); }\n        out.push_back(\"null\");\n    }\n    while (!out.empty() && out.back() == \"null\") out.pop_back();\n    string s = \"[\";\n    for (size_t i = 0; i < out.size(); ++i) { if (i) s += ','; s += out[i]; }\n    return s + \"]\";\n}\n\nclass Codec {\npublic:\n    TreeNode* encode(Node* root) {\n        // your code here\n    }\n\n    Node* decode(TreeNode* root) {\n        // your code here\n    }\n};\n\n// Provided: the tests check that decode(encode(root)) rebuilds the tree. Do not edit.\nstring roundTrip(string data) {\n    Codec codec;\n    return toLevelOrder(codec.decode(codec.encode(fromLevelOrder(data))));\n}\n",
  },

  solutions: [
    {
      id: 'left-child-right-sibling',
      label: 'Left child, right sibling',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(h)',
      blurb:
        'A binary node has two pointers and an N-ary node has a list, so spend one pointer on the list\'s head and the other on the list\'s continuation: the first child becomes the left child, and every further child becomes the right child of the one before it. Decoding walks a node\'s left child and then follows right pointers to recover the child list. Nothing else is needed — this mapping is a bijection, so no alternative is shown.',
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
            'public:',
            '    // left-child right-sibling: the first child hangs to the left, and each',
            "    // further child hangs off the previous child's right",
            '    TreeNode* encode(Node* root) {',
            '        if (!root) return nullptr;',
            '        TreeNode* node = new TreeNode(root->val);',
            '        TreeNode* tail = nullptr;',
            '        for (Node* child : root->children) {',
            '            TreeNode* encoded = encode(child);',
            '            if (tail) tail->right = encoded;',
            '            else node->left = encoded;',
            '            tail = encoded;',
            '        }',
            '        return node;',
            '    }',
            '',
            '    Node* decode(TreeNode* root) {',
            '        if (!root) return nullptr;',
            '        Node* node = new Node(root->val);',
            '        for (TreeNode* sibling = root->left; sibling; sibling = sibling->right)',
            '            node->children.push_back(decode(sibling));',
            '        return node;',
            '    }',
            '};',
            '',
            '// Provided wrapper, unchanged from the starter',
            'string roundTrip(string data) {',
            '    Codec codec;',
            '    return toLevelOrder(codec.decode(codec.encode(fromLevelOrder(data))));',
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
            '  // left-child right-sibling: the first child hangs to the left, and each',
            "  // further child hangs off the previous child's right",
            '  encode(root) {',
            '    if (!root) return null;',
            '    const node = new TreeNode(root.val);',
            '    let tail = null;',
            '    for (const child of root.children) {',
            '      const encoded = this.encode(child);',
            '      if (tail) tail.right = encoded;',
            '      else node.left = encoded;',
            '      tail = encoded;',
            '    }',
            '    return node;',
            '  }',
            '',
            '  decode(root) {',
            '    if (!root) return null;',
            '    const node = new Node(root.val);',
            '    for (let sibling = root.left; sibling; sibling = sibling.right) {',
            '      node.children.push(this.decode(sibling));',
            '    }',
            '    return node;',
            '  }',
            '}',
            '',
            '// Provided wrapper, unchanged from the starter',
            'function roundTrip(data) {',
            '  const codec = new Codec();',
            '  return toLevelOrder(codec.decode(codec.encode(fromLevelOrder(data))));',
            '}',
          ],
        },
      },

      run([data]: [string], c) {
        const items = JSON.parse(data) as (number | null)[]
        type N = { val: number; children: N[] }
        type B = { val: number; left: B | null; right: B | null }
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
        const encode = (root: N | null): B | null => {
          if (!root) return null
          c.ops++
          const node: B = { val: root.val, left: null, right: null }
          let tail: B | null = null
          for (const child of root.children) {
            const e = encode(child)
            if (tail) tail.right = e
            else node.left = e
            tail = e
          }
          return node
        }
        const decode = (root: B | null): N | null => {
          if (!root) return null
          c.ops++
          const node: N = { val: root.val, children: [] }
          for (let s = root.left; s; s = s.right) node.children.push(decode(s)!)
          return node
        }
        const back = decode(encode(build()))
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
