import type { Problem } from '@/lib/types'

export const verifyPreorderSequence: Problem = {
  id: 'verify-preorder-sequence-in-binary-search-tree',
  title: 'Verify Preorder Sequence in Binary Search Tree',
  group: 'Medium',
  pattern: 'Monotonic Stack',
  difficulty: 'Medium',
  leetcode:
    'https://leetcode.com/problems/verify-preorder-sequence-in-binary-search-tree/',
  statement:
    'Given an array of unique integers `preorder`, return true when it could be the preorder traversal of some binary search tree.',
  constraints: [
    '1 <= preorder.length <= 10^4',
    '1 <= preorder[i] <= 10^4',
    'All values in preorder are unique',
  ],
  signature: {
    fn: 'verifyPreorder',
    params: [{ name: 'preorder', type: 'int[]' }],
    ret: 'bool',
  },
  tests: [
    { args: [[5, 2, 1, 3, 6]], expect: true },
    { args: [[5, 2, 6, 1, 3]], expect: false, note: '1 appears after moving into the right subtree' },
    { args: [[1]], expect: true, note: 'single node' },
    { args: [[1, 2]], expect: true, note: 'right child' },
    { args: [[2, 1]], expect: true, note: 'left child' },
    { args: [[3, 1, 2, 5, 4, 6]], expect: true },
    { args: [[1, 3, 4, 2]], expect: false, note: '2 is smaller than a bound already crossed' },
    { args: [[5, 4, 3, 2, 1]], expect: true, note: 'a left-only chain' },
    { args: [[1, 2, 3, 4, 5]], expect: true, note: 'a right-only chain' },
    { args: [[10, 5, 12, 11, 7]], expect: false, note: '7 belongs left of 10 but arrives after 12' },
  ],
  // a right-only chain: the split scan rereads the whole tail at every level
  scale: (n) => [Array.from({ length: n }, (_, i) => i + 1)],
  demo: [[5, 2, 1, 3, 6]],
  starter: {
    js: `function verifyPreorder(preorder) {
  // preorder: number[]  ->  boolean
}
`,
    cpp: `bool verifyPreorder(vector<int>& preorder) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'split-recursively',
      label: 'Split at the first larger value and recurse',
      kind: 'brute',
      time: 'O(n^2)',
      space: 'O(n)',
      blurb:
        'The first value is the root, everything smaller after it is the left subtree, and the rest must be the right subtree — so nothing in the rest may be smaller than the root. Check that and recurse into both halves. Correct, but a skewed tree makes every level rescan almost the whole array.',
      code: {
        cpp: {
          lines: [
            'static bool check(const vector<int>& a, int lo, int hi) {',
            '    if (hi - lo <= 1) return true;',
            '    int root = a[lo];',
            '    int split = lo + 1;',
            '    while (split < hi && a[split] < root) ++split;',
            '    for (int i = split; i < hi; ++i)',
            '        if (a[i] < root) return false;',
            '    return check(a, lo + 1, split) && check(a, split, hi);',
            '}',
            '',
            'bool verifyPreorder(vector<int>& preorder) {',
            '    return check(preorder, 0, preorder.size());',
            '}',
          ],
        },
        js: {
          lines: [
            'function verifyPreorder(preorder) {',
            '  const check = (lo, hi) => {',
            '    if (hi - lo <= 1) return true;',
            '    const root = preorder[lo];',
            '    let split = lo + 1;',
            '    while (split < hi && preorder[split] < root) split++;',
            '    for (let i = split; i < hi; i++) {',
            '      if (preorder[i] < root) return false;',
            '    }',
            '    return check(lo + 1, split) && check(split, hi);',
            '  };',
            '  return check(0, preorder.length);',
            '}',
          ],
        },
      },

      run([preorder]: [number[]], c) {
        const check = (lo: number, hi: number): boolean => {
          if (hi - lo <= 1) return true
          const root = preorder[lo]
          let split = lo + 1
          while (split < hi && preorder[split] < root) {
            c.ops++
            split++
          }
          for (let i = split; i < hi; i++) {
            c.ops++
            if (preorder[i] < root) return false
          }
          return check(lo + 1, split) && check(split, hi)
        }
        return check(0, preorder.length)
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'stack',
      label: 'Stack of pending ancestors with a lower bound',
      kind: 'better',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'Instead of re-splitting, read the array once and let a stack remember the ancestors still waiting for a right subtree. Descending values are left children, so push them. The first value larger than the stack top means a left subtree has ended — pop everything smaller and remember the last popped node as a floor. Nothing after that may drop below it.',
      code: {
        cpp: {
          lines: [
            'bool verifyPreorder(vector<int>& preorder) {',
            '    vector<int> stack;',
            '    int lower = INT_MIN;',
            '    for (int x : preorder) {',
            '        if (x < lower) return false;',
            '        while (!stack.empty() && stack.back() < x) {',
            '            lower = stack.back();',
            '            stack.pop_back();',
            '        }',
            '        stack.push_back(x);',
            '    }',
            '    return true;',
            '}',
          ],
        },
        js: {
          lines: [
            'function verifyPreorder(preorder) {',
            '  const stack = [];',
            '  let lower = -Infinity;',
            '  for (const x of preorder) {',
            '    if (x < lower) return false;',
            '    while (stack.length && stack[stack.length - 1] < x) {',
            '      lower = stack.pop();',
            '    }',
            '    stack.push(x);',
            '  }',
            '  return true;',
            '}',
          ],
        },
      },

      run([preorder]: [number[]], c) {
        const stack: number[] = []
        let lower = -Infinity
        for (const x of preorder) {
          c.ops++
          if (x < lower) return false
          while (stack.length && stack[stack.length - 1] < x) lower = stack.pop()!
          stack.push(x)
        }
        return true
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'in-place-stack',
      label: 'Reuse the array as the stack',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'The stack never holds more values than the prefix already consumed, so it can live inside the input: keep the pending ancestors in `preorder[0..top]` and overwrite entries as they are popped. Same one pass, same floor rule, no extra memory.',
      code: {
        cpp: {
          lines: [
            'bool verifyPreorder(vector<int>& preorder) {',
            '    int top = -1;',
            '    int lower = INT_MIN;',
            '    for (int x : preorder) {',
            '        if (x < lower) return false;',
            '        while (top >= 0 && preorder[top] < x) lower = preorder[top--];',
            '        preorder[++top] = x;',
            '    }',
            '    return true;',
            '}',
          ],
        },
        js: {
          lines: [
            'function verifyPreorder(preorder) {',
            '  let top = -1;',
            '  let lower = -Infinity;',
            '  for (const x of preorder) {',
            '    if (x < lower) return false;',
            '    while (top >= 0 && preorder[top] < x) lower = preorder[top--];',
            '    preorder[++top] = x;',
            '  }',
            '  return true;',
            '}',
          ],
        },
      },

      run([preorder]: [number[]], c) {
        let top = -1
        let lower = -Infinity
        for (const x of preorder) {
          c.ops++
          if (x < lower) return false
          while (top >= 0 && preorder[top] < x) {
            c.ops++
            lower = preorder[top--]
          }
          preorder[++top] = x
        }
        return true
      },
    },
  ],
}
