import type { Problem } from '@/lib/types'

export const encodeNaryTreeToBinaryTree: Problem = {
  id: 'encode-n-ary-tree-to-binary-tree',
  title: 'Encode N-ary Tree to Binary Tree',
  group: 'Hard',
  pattern: 'Design',
  difficulty: 'Hard',
  leetcode: 'https://leetcode.com/problems/encode-n-ary-tree-to-binary-tree/',
  statement:
    "Write `encode` and `decode` that turn an N-ary tree into a binary tree and back without losing anything. The classic mapping is left-child right-sibling: a node's first child becomes its binary left child, and each remaining child hangs off the previous one as a binary right child.",
  constraints: [
    'The number of nodes is in the range [0, 10^4]',
    '0 <= Node.val <= 10^4',
    'The height is at most 1000',
    'The algorithms must be stateless — no member, global or static variables',
  ],
}
