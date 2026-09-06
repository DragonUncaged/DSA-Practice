import type { Problem } from '@/lib/types'
import { buildTreeModel } from './tree-utils'

/**
 * The runner cannot print a circular structure, so the starter provides a
 * `sortedCircle` wrapper that calls the learner's `treeToDoublyList` and reads
 * the circle forwards and then backwards from the head — checking both links
 * and that the circle closes.
 */
export const convertBSTToSortedDoublyLinkedList: Problem = {
  id: 'convert-binary-search-tree-to-sorted-doubly-linked-list',
  title: 'Convert Binary Search Tree to Sorted Doubly Linked List',
  group: 'Medium',
  pattern: 'Tree Recursion',
  difficulty: 'Medium',
  leetcode:
    'https://leetcode.com/problems/convert-binary-search-tree-to-sorted-doubly-linked-list/',
  statement:
    'Convert a binary search tree into a sorted circular doubly linked list in place, reusing `left` as the predecessor pointer and `right` as the successor, and return the smallest node. An in-order walk visits the values in order, so keeping a pointer to the previously visited node is enough to stitch each pair together; joining the first and last node at the end closes the circle. The tests call the provided `sortedCircle`, which reads your list forwards from the head for `n` steps and then backwards from the head for `n` steps — so `[4,2,5,1,3]` should give `[1,2,3,4,5,5,4,3,2,1]`.',
  constraints: [
    'The number of nodes is in the range [0, 2000]',
    '-1000 <= Node.val <= 1000',
    'All values are unique',
  ],
  signature: { fn: 'sortedCircle', params: [{ name: 'root', type: 'tree' }], ret: 'int[]' },
  tests: [
    { args: [[4, 2, 5, 1, 3]], expect: [1, 2, 3, 4, 5, 5, 4, 3, 2, 1] },
    { args: [[2, 1, 3]], expect: [1, 2, 3, 3, 2, 1] },
    { args: [[]], expect: [], note: 'empty tree' },
    { args: [[1]], expect: [1, 1], note: 'a single node points at itself both ways' },
    { args: [[5, 3, 8, 1, 4, null, 9]], expect: [1, 3, 4, 5, 8, 9, 9, 8, 5, 4, 3, 1] },
    { args: [[3, 2, null, 1]], expect: [1, 2, 3, 3, 2, 1], note: 'a left-only chain' },
    { args: [[-1000, null, 1000]], expect: [-1000, 1000, 1000, -1000], note: 'extreme values' },
  ],
  demo: [[4, 2, 5, 1, 3]],
  starter: {
    js: `function treeToDoublyList(root) {
  // root: TreeNode | null  ->  the smallest node of the circular list, or null
  // reuse left as the predecessor and right as the successor
}

// Provided: reads the circle forwards, then backwards, from the head. Do not edit.
function sortedCircle(root) {
  const count = (t) => (t ? 1 + count(t.left) + count(t.right) : 0);
  const n = count(root);
  const head = treeToDoublyList(root);
  const out = [];
  let node = head;
  for (let i = 0; i < n && node; i++) { out.push(node.val); node = node.right; }
  node = head ? head.left : null;
  for (let i = 0; i < n && node; i++) { out.push(node.val); node = node.left; }
  return out;
}
`,
    cpp: `TreeNode* treeToDoublyList(TreeNode* root) {
    // your code here: reuse left as the predecessor and right as the successor
}

// Provided: reads the circle forwards, then backwards, from the head. Do not edit.
vector<int> sortedCircle(TreeNode* root) {
    function<int(TreeNode*)> count = [&](TreeNode* t) { return t ? 1 + count(t->left) + count(t->right) : 0; };
    int n = count(root);
    TreeNode* head = treeToDoublyList(root);
    vector<int> out;
    TreeNode* node = head;
    for (int i = 0; i < n && node; ++i) { out.push_back(node->val); node = node->right; }
    node = head ? head->left : nullptr;
    for (int i = 0; i < n && node; ++i) { out.push_back(node->val); node = node->left; }
    return out;
}
`,
  },

  solutions: [
    {
      id: 'collect-then-link',
      label: 'Collect the nodes in order, then link neighbours',
      kind: 'brute',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'An in-order walk lists the nodes sorted, so gather them into an array first and then, in a second loop, point each node\'s `right` at the next one and its `left` at the previous, closing the circle between the last and the first. Correct and easy to see, but the array holds every node just to know its neighbours.',
      code: {
        cpp: {
          lines: [
            'TreeNode* treeToDoublyList(TreeNode* root) {',
            '    vector<TreeNode*> nodes;',
            '    function<void(TreeNode*)> walk = [&](TreeNode* t) {',
            '        if (!t) return;',
            '        walk(t->left);',
            '        nodes.push_back(t);',
            '        walk(t->right);',
            '    };',
            '    walk(root);',
            '    if (nodes.empty()) return nullptr;',
            '    int n = nodes.size();',
            '    for (int i = 0; i < n; ++i) {',
            '        nodes[i]->right = nodes[(i + 1) % n];',
            '        nodes[i]->left = nodes[(i + n - 1) % n];',
            '    }',
            '    return nodes[0];',
            '}',
            '',
            'vector<int> sortedCircle(TreeNode* root) {',
            '    function<int(TreeNode*)> count = [&](TreeNode* t) { return t ? 1 + count(t->left) + count(t->right) : 0; };',
            '    int n = count(root);',
            '    TreeNode* head = treeToDoublyList(root);',
            '    vector<int> out;',
            '    TreeNode* node = head;',
            '    for (int i = 0; i < n && node; ++i) { out.push_back(node->val); node = node->right; }',
            '    node = head ? head->left : nullptr;',
            '    for (int i = 0; i < n && node; ++i) { out.push_back(node->val); node = node->left; }',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function treeToDoublyList(root) {',
            '  const nodes = [];',
            '  const walk = (t) => {',
            '    if (!t) return;',
            '    walk(t.left);',
            '    nodes.push(t);',
            '    walk(t.right);',
            '  };',
            '  walk(root);',
            '  if (nodes.length === 0) return null;',
            '  const n = nodes.length;',
            '  for (let i = 0; i < n; i++) {',
            '    nodes[i].right = nodes[(i + 1) % n];',
            '    nodes[i].left = nodes[(i + n - 1) % n];',
            '  }',
            '  return nodes[0];',
            '}',
            '',
            '// Provided wrapper, unchanged from the starter',
            'function sortedCircle(root) {',
            '  const count = (t) => (t ? 1 + count(t.left) + count(t.right) : 0);',
            '  const n = count(root);',
            '  const head = treeToDoublyList(root);',
            '  const out = [];',
            '  let node = head;',
            '  for (let i = 0; i < n && node; i++) { out.push(node.val); node = node.right; }',
            '  node = head ? head.left : null;',
            '  for (let i = 0; i < n && node; i++) { out.push(node.val); node = node.left; }',
            '  return out;',
            '}',
          ],
        },
      },

      run([level]: [(number | null)[]], c) {
        const { nodes, root } = buildTreeModel(level)
        const order: number[] = []
        const walk = (id: number | null) => {
          if (id == null) return
          c.ops++
          walk(nodes[id].left)
          order.push(id)
          walk(nodes[id].right)
        }
        walk(root)
        const n = order.length
        for (let i = 0; i < n; i++) {
          c.ops++
          nodes[order[i]].right = order[(i + 1) % n]
          nodes[order[i]].left = order[(i + n - 1) % n]
        }
        if (n === 0) return []
        const out: number[] = []
        let id = order[0]
        for (let i = 0; i < n; i++) {
          out.push(nodes[id].value)
          id = nodes[id].right!
        }
        id = nodes[order[0]].left!
        for (let i = 0; i < n; i++) {
          out.push(nodes[id].value)
          id = nodes[id].left!
        }
        return out
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'inorder-prev-pointer',
      label: 'In-order walk that links each node to the previous one',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(h)',
      blurb:
        'The array is unnecessary: an in-order walk already meets the nodes in sorted order, so it only has to remember the node it visited last. Link that node forwards to the current one and the current one back to it, and remember the very first node as the head. When the walk ends, one more pair of links between the head and the last node closes the circle.',
      code: {
        cpp: {
          lines: [
            'TreeNode* treeToDoublyList(TreeNode* root) {',
            '    TreeNode* head = nullptr;',
            '    TreeNode* prev = nullptr;',
            '    function<void(TreeNode*)> walk = [&](TreeNode* t) {',
            '        if (!t) return;',
            '        walk(t->left);',
            '        if (prev) { prev->right = t; t->left = prev; }',
            '        else head = t;',
            '        prev = t;',
            '        walk(t->right);',
            '    };',
            '    walk(root);',
            '    if (head) { head->left = prev; prev->right = head; }',
            '    return head;',
            '}',
            '',
            'vector<int> sortedCircle(TreeNode* root) {',
            '    function<int(TreeNode*)> count = [&](TreeNode* t) { return t ? 1 + count(t->left) + count(t->right) : 0; };',
            '    int n = count(root);',
            '    TreeNode* head = treeToDoublyList(root);',
            '    vector<int> out;',
            '    TreeNode* node = head;',
            '    for (int i = 0; i < n && node; ++i) { out.push_back(node->val); node = node->right; }',
            '    node = head ? head->left : nullptr;',
            '    for (int i = 0; i < n && node; ++i) { out.push_back(node->val); node = node->left; }',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function treeToDoublyList(root) {',
            '  let head = null;',
            '  let prev = null;',
            '  const walk = (t) => {',
            '    if (!t) return;',
            '    walk(t.left);',
            '    if (prev) { prev.right = t; t.left = prev; }',
            '    else head = t;',
            '    prev = t;',
            '    walk(t.right);',
            '  };',
            '  walk(root);',
            '  if (head) { head.left = prev; prev.right = head; }',
            '  return head;',
            '}',
            '',
            '// Provided wrapper, unchanged from the starter',
            'function sortedCircle(root) {',
            '  const count = (t) => (t ? 1 + count(t.left) + count(t.right) : 0);',
            '  const n = count(root);',
            '  const head = treeToDoublyList(root);',
            '  const out = [];',
            '  let node = head;',
            '  for (let i = 0; i < n && node; i++) { out.push(node.val); node = node.right; }',
            '  node = head ? head.left : null;',
            '  for (let i = 0; i < n && node; i++) { out.push(node.val); node = node.left; }',
            '  return out;',
            '}',
          ],
        },
      },

      run([level]: [(number | null)[]], c) {
        const { nodes, root } = buildTreeModel(level)
        let head: number | null = null
        let prev: number | null = null
        let n = 0
        const walk = (id: number | null) => {
          if (id == null) return
          c.ops++
          n++
          const left = nodes[id].left
          const right = nodes[id].right
          walk(left)
          if (prev != null) {
            nodes[prev].right = id
            nodes[id].left = prev
          } else head = id
          prev = id
          walk(right)
        }
        walk(root)
        if (head == null) return []
        nodes[head].left = prev
        nodes[prev!].right = head
        const out: number[] = []
        let id: number = head
        for (let i = 0; i < n; i++) {
          out.push(nodes[id].value)
          id = nodes[id].right!
        }
        id = nodes[head].left!
        for (let i = 0; i < n; i++) {
          out.push(nodes[id].value)
          id = nodes[id].left!
        }
        return out
      },
    },
  ],
}
