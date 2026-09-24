import type { Difficulty } from '@/lib/types'
import { PROBLEM_IDS } from './meta'
import { toEntries, type SheetEntry } from './sheet'

/**
 * The SDE Sheet - 27 days of interview problems.
 *
 * Rows carry an optional third element: the id of one of our traced problems.
 * A row with an id (or whose slugified title matches a trace) lights up and
 * links into the player; the rest are listed and light up as traces land,
 * exactly how the Blind 75 sheet grew.
 */

type Row = [string, Difficulty] | [string, Difficulty, string]

const SDE: [string, Row[]][] = [
  [
    'Arrays',
    [
      ['Set Matrix Zeroes', 'Medium', 'set-matrix-zeroes'],
      ["Pascal's Triangle", 'Easy'],
      ['Next Permutation', 'Medium'],
      ["Maximum Subarray (Kadane's)", 'Medium', 'maximum-subarray'],
      ["Sort an Array of 0s, 1s and 2s", 'Medium'],
      ['Best Time to Buy and Sell Stock', 'Easy', 'best-time-to-buy-and-sell-stock'],
    ],
  ],
  [
    'Arrays II',
    [
      ['Rotate Image', 'Medium', 'rotate-image'],
      ['Merge Intervals', 'Medium', 'merge-intervals'],
      ['Merge Two Sorted Arrays Without Extra Space', 'Medium'],
      ['Find the Duplicate Number', 'Medium'],
      ['Repeat and Missing Number', 'Medium'],
      ['Count Inversions in an Array', 'Hard'],
    ],
  ],
  [
    'Arrays III',
    [
      ['Search a 2D Matrix', 'Medium'],
      ['Pow(x, n)', 'Medium'],
      ['Majority Element (> n/2)', 'Easy'],
      ['Majority Element II (> n/3)', 'Medium'],
      ['Unique Paths', 'Medium', 'unique-paths'],
      ['Reverse Pairs', 'Hard'],
    ],
  ],
  [
    'Arrays IV',
    [
      ['Two Sum', 'Easy', 'two-sum'],
      ['4Sum', 'Medium'],
      ['Longest Consecutive Sequence', 'Medium', 'longest-consecutive-sequence'],
      ['Largest Subarray with Zero Sum', 'Medium'],
      ['Count Subarrays with Given XOR', 'Medium'],
      [
        'Longest Substring Without Repeating Characters',
        'Medium',
        'longest-substring-without-repeating-characters',
      ],
    ],
  ],
  [
    'Linked List',
    [
      ['Reverse a Linked List', 'Easy', 'reverse-a-linked-list'],
      ['Middle of the Linked List', 'Easy'],
      ['Merge Two Sorted Lists', 'Easy', 'merge-two-sorted-lists'],
      ['Remove Nth Node From End of List', 'Medium', 'remove-nth-node-from-end-of-list'],
      ['Add Two Numbers as Lists', 'Medium'],
      ['Delete a Node in O(1)', 'Easy'],
    ],
  ],
  [
    'Linked List II',
    [
      ['Intersection of Two Linked Lists', 'Easy'],
      ['Detect Cycle in a Linked List', 'Easy', 'detect-cycle-in-a-linked-list'],
      ['Reverse Nodes in k-Group', 'Hard'],
      ['Palindrome Linked List', 'Easy'],
      ['Starting Point of the Cycle', 'Medium'],
      ['Flattening a Linked List', 'Medium'],
    ],
  ],
  [
    'Linked List & Arrays',
    [
      ['Rotate a Linked List', 'Medium'],
      ['Copy List with Random Pointer', 'Medium'],
      ['3Sum', 'Medium', '3sum'],
      ['Trapping Rain Water', 'Hard'],
      ['Remove Duplicates from Sorted Array', 'Easy'],
      ['Max Consecutive Ones', 'Easy'],
    ],
  ],
  [
    'Greedy',
    [
      ['N Meetings in One Room', 'Easy'],
      ['Minimum Number of Platforms', 'Medium'],
      ['Job Sequencing Problem', 'Medium'],
      ['Fractional Knapsack', 'Medium'],
      ['Minimum Number of Coins', 'Easy'],
      ['Activity Selection', 'Easy'],
    ],
  ],
  [
    'Recursion',
    [
      ['Subset Sums', 'Medium'],
      ['Subsets II', 'Medium'],
      ['Combination Sum', 'Medium', 'combination-sum'],
      ['Combination Sum II', 'Medium'],
      ['Palindrome Partitioning', 'Medium'],
      ['Kth Permutation Sequence', 'Hard'],
    ],
  ],
  [
    'Backtracking',
    [
      ['Print All Permutations', 'Medium'],
      ['N-Queens', 'Hard'],
      ['Sudoku Solver', 'Hard'],
      ['M-Coloring Problem', 'Hard'],
      ['Rat in a Maze', 'Medium'],
      ['Word Break II', 'Hard'],
    ],
  ],
  [
    'Binary Search',
    [
      ['Nth Root of a Number', 'Easy'],
      ['Matrix Median', 'Hard'],
      ['Single Element in a Sorted Array', 'Medium'],
      ['Search in Rotated Sorted Array', 'Medium', 'search-in-rotated-sorted-array'],
      ['Median of Two Sorted Arrays', 'Hard'],
      ['Kth Element of Two Sorted Arrays', 'Hard'],
      ['Allocate Minimum Number of Pages', 'Hard'],
      ['Aggressive Cows', 'Hard'],
    ],
  ],
  [
    'Heaps',
    [
      ['Implement a Max/Min Heap', 'Medium'],
      ['Kth Largest Element in an Array', 'Medium'],
      ['Maximum Sum Combination', 'Medium'],
      ['Find Median from Data Stream', 'Hard', 'find-median-from-data-stream'],
      ['Merge K Sorted Arrays', 'Medium'],
      ['Top K Frequent Elements', 'Medium', 'top-k-frequent-elements'],
    ],
  ],
  [
    'Stack & Queue',
    [
      ['Implement Stack Using Arrays', 'Easy'],
      ['Implement Queue Using Arrays', 'Easy'],
      ['Implement Stack Using Queue', 'Easy'],
      ['Implement Queue Using Stack', 'Easy'],
      ['Valid Parentheses', 'Easy', 'valid-parentheses'],
      ['Next Greater Element', 'Medium'],
      ['Sort a Stack', 'Easy'],
    ],
  ],
  [
    'Stack & Queue II',
    [
      ['Next Smaller Element', 'Medium'],
      ['LRU Cache', 'Medium'],
      ['LFU Cache', 'Hard'],
      ['Largest Rectangle in a Histogram', 'Hard'],
      ['Sliding Window Maximum', 'Hard'],
      ['Implement Min Stack', 'Medium'],
      ['Rotten Oranges', 'Medium'],
      ['Online Stock Span', 'Medium'],
      ['Maximum of Minimums of Every Window Size', 'Hard'],
      ['The Celebrity Problem', 'Medium'],
    ],
  ],
  [
    'Strings',
    [
      ['Reverse Words in a String', 'Medium'],
      ['Longest Palindromic Substring', 'Medium', 'longest-palindromic-substring'],
      ['Roman to Integer', 'Easy'],
      ['String to Integer (atoi)', 'Medium'],
      ['Longest Common Prefix', 'Easy'],
      ['Rabin-Karp String Matching', 'Medium'],
    ],
  ],
  [
    'Strings II',
    [
      ['Z-Function', 'Medium'],
      ['KMP / LPS Array', 'Hard'],
      ['Minimum Insertions to Make String Palindrome', 'Hard'],
      ['Valid Anagram', 'Easy', 'valid-anagram'],
      ['Count and Say', 'Medium'],
      ['Compare Version Numbers', 'Medium'],
    ],
  ],
  [
    'Binary Tree',
    [
      ['Inorder Traversal', 'Easy'],
      ['Preorder Traversal', 'Easy'],
      ['Postorder Traversal', 'Easy'],
      ['Morris Inorder Traversal', 'Medium'],
      ['Morris Preorder Traversal', 'Medium'],
      ['Left View of Binary Tree', 'Easy'],
      ['Bottom View of Binary Tree', 'Medium'],
      ['Top View of Binary Tree', 'Medium'],
      ['All Traversals in One Pass', 'Medium'],
      ['Vertical Order Traversal', 'Hard'],
      ['Root to Node Path', 'Medium'],
      ['Maximum Width of Binary Tree', 'Medium'],
    ],
  ],
  [
    'Binary Tree II',
    [
      ['Binary Tree Level Order Traversal', 'Medium', 'binary-tree-level-order-traversal'],
      ['Maximum Depth of Binary Tree', 'Easy', 'maximum-depth-of-binary-tree'],
      ['Diameter of Binary Tree', 'Easy'],
      ['Balanced Binary Tree', 'Easy'],
      ['Lowest Common Ancestor of a Binary Tree', 'Medium'],
      ['Same Tree', 'Easy', 'same-tree'],
    ],
  ],
  [
    'Binary Tree III',
    [
      ['Binary Tree Maximum Path Sum', 'Hard', 'binary-tree-maximum-path-sum'],
      [
        'Construct Binary Tree from Preorder and Inorder Traversal',
        'Medium',
        'construct-binary-tree-from-preorder-and-inorder-traversal',
      ],
      ['Construct Binary Tree from Inorder and Postorder', 'Medium'],
      ['Symmetric Tree', 'Easy'],
      ['Flatten Binary Tree to Linked List', 'Medium'],
      ['Children Sum Property', 'Medium'],
    ],
  ],
  [
    'Binary Search Tree',
    [
      ['Populate Next Right Pointers', 'Medium'],
      ['Search in a BST', 'Easy'],
      ['Construct BST from Sorted Keys', 'Easy'],
      ['Construct BST from Preorder Traversal', 'Medium'],
      ['Validate Binary Search Tree', 'Medium', 'validate-binary-search-tree'],
      ['Lowest Common Ancestor of a BST', 'Easy', 'lowest-common-ancestor-of-a-bst'],
      ['Inorder Predecessor and Successor in BST', 'Medium'],
    ],
  ],
  [
    'BST II',
    [
      ['Floor in a BST', 'Easy'],
      ['Ceil in a BST', 'Easy'],
      ['Kth Smallest Element in a BST', 'Medium', 'kth-smallest-element-in-a-bst'],
      ['Kth Largest Element in a BST', 'Medium'],
      ['Two Sum in a BST', 'Medium'],
      ['BST Iterator', 'Medium'],
      ['Largest BST in a Binary Tree', 'Hard'],
      [
        'Serialize and Deserialize Binary Tree',
        'Hard',
        'serialize-and-deserialize-binary-tree',
      ],
    ],
  ],
  [
    'Mixed Trees & Streams',
    [
      ['Binary Tree to Doubly Linked List', 'Hard'],
      ['Median in a Stream of Integers', 'Hard', 'find-median-from-data-stream'],
      ['Kth Largest Element in a Stream', 'Easy'],
      ['Distinct Numbers in a Window', 'Medium'],
      ['Kth Largest Element in an Unsorted Array', 'Medium'],
      ['Flood Fill', 'Easy'],
    ],
  ],
  [
    'Graphs',
    [
      ['Clone Graph', 'Medium', 'clone-graph'],
      ['Depth-First Search', 'Easy'],
      ['Breadth-First Search', 'Easy'],
      ['Cycle Detection in Undirected Graph (BFS)', 'Medium'],
      ['Cycle Detection in Undirected Graph (DFS)', 'Medium'],
      ['Cycle Detection in Directed Graph (DFS)', 'Medium'],
      ['Course Schedule (Cycle in Directed Graph, BFS)', 'Medium', 'course-schedule'],
      ['Topological Sort (BFS)', 'Medium'],
      ['Topological Sort (DFS)', 'Medium'],
      ['Number of Islands', 'Medium', 'number-of-islands'],
      ['Bipartite Check (BFS)', 'Medium'],
      ['Bipartite Check (DFS)', 'Medium'],
    ],
  ],
  [
    'Graphs II',
    [
      ["Strongly Connected Components (Kosaraju's)", 'Hard'],
      ["Dijkstra's Algorithm", 'Medium'],
      ['Bellman-Ford Algorithm', 'Medium'],
      ['Floyd-Warshall Algorithm', 'Medium'],
      ["Minimum Spanning Tree (Prim's)", 'Medium'],
      ["Minimum Spanning Tree (Kruskal's)", 'Medium'],
    ],
  ],
  [
    'Dynamic Programming',
    [
      ['Maximum Product Subarray', 'Medium', 'maximum-product-subarray'],
      ['Longest Increasing Subsequence', 'Medium', 'longest-increasing-subsequence'],
      ['Longest Common Subsequence', 'Medium', 'longest-common-subsequence'],
      ['0/1 Knapsack', 'Medium'],
      ['Edit Distance', 'Medium'],
      ['Maximum Sum Increasing Subsequence', 'Medium'],
      ['Matrix Chain Multiplication', 'Hard'],
    ],
  ],
  [
    'DP II',
    [
      ['Minimum Path Sum in a Matrix', 'Medium'],
      ['Coin Change', 'Medium', 'coin-change'],
      ['Subset Sum', 'Medium'],
      ['Rod Cutting', 'Medium'],
      ['Egg Dropping Puzzle', 'Hard'],
      ['Word Break', 'Medium', 'word-break'],
      ['Palindrome Partitioning II', 'Hard'],
      ['Maximum Profit in Job Scheduling', 'Hard'],
    ],
  ],
  [
    'Tries',
    [
      ['Implement Trie (Prefix Tree)', 'Medium', 'implement-trie-prefix-tree'],
      ['Implement Trie II (Prefix Counts)', 'Medium'],
      ['Longest Complete String', 'Medium'],
      ['Number of Distinct Substrings', 'Hard'],
      ['Power Set', 'Medium'],
      ['Maximum XOR of Two Numbers', 'Medium'],
      ['Maximum XOR with an Element from Array', 'Hard'],
    ],
  ],
]

/**
 * The ids rows name outright, rather than by slug. `toEntries` ignores one
 * that does not resolve (a typo would otherwise link at a problem that does
 * not exist); the sheet test asserts every one of them still does.
 */
export const SDE_EXPLICIT_IDS: string[] = SDE.flatMap(([, rows]) =>
  rows.map(([, , id]) => id).filter((id): id is string => id != null),
)

export const SDE_GROUPS: { name: string; items: SheetEntry[] }[] = SDE.map(([name, rows]) => ({
  name,
  items: toEntries(
    name,
    rows.map(([title, difficulty, id]) => ({ title, difficulty, id })),
    PROBLEM_IDS,
  ),
}))
