import type { Problem } from '@/lib/types'

export const convertBSTToSortedDoublyLinkedList: Problem = {
  id: 'convert-binary-search-tree-to-sorted-doubly-linked-list',
  title: 'Convert Binary Search Tree to Sorted Doubly Linked List',
  group: 'Medium',
  pattern: 'Tree Recursion',
  difficulty: 'Medium',
  leetcode:
    'https://leetcode.com/problems/convert-binary-search-tree-to-sorted-doubly-linked-list/',
  statement:
    'Convert a binary search tree into a sorted circular doubly linked list in place, reusing `left` as the predecessor pointer and `right` as the successor, and return the smallest node. An in-order walk visits the values in order, so keeping a pointer to the previously visited node is enough to stitch each pair together; joining the first and last node at the end closes the circle.',
  constraints: [
    'The number of nodes is in the range [0, 2000]',
    '-1000 <= Node.val <= 1000',
    'All values are unique',
  ],
}
