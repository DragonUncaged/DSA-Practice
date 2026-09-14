import type { Difficulty } from '@/lib/types'
import { PROBLEM_IDS } from './index'
import { toEntries, type SheetEntry } from './sheet'

/**
 * LeetCode Premium - the 89 subscriber-only problems, taken from the folder
 * names and README headers of
 * github.com/AkashSingh3031/Complete-LeetCode-Premium-Problems.
 *
 * The source carries no structure beyond the problem number, so rows are
 * grouped by difficulty. Rows carry no trace id: one lights up when its
 * slugified title matches a problem we have already traced, and every other
 * row links out to its LeetCode page.
 */

/** Title, difficulty, and the LeetCode slug the row links out to. */
type Row = [string, Difficulty, string]

/** In problem-number order; the groups below re-sort them by difficulty. */
const PREMIUM: Row[] = [
  ['Binary Tree Upside Down', 'Medium', 'binary-tree-upside-down'],
  ['Read N Characters Given Read4', 'Easy', 'read-n-characters-given-read4'],
  ['Read N Characters Given read4 II - Call Multiple Times', 'Hard', 'read-n-characters-given-read4-ii-call-multiple-times'],
  ['Longest Substring with At Most Two Distinct Characters', 'Medium', 'longest-substring-with-at-most-two-distinct-characters'],
  ['One Edit Distance', 'Medium', 'one-edit-distance'],
  ['Missing Ranges', 'Easy', 'missing-ranges'],
  ['Two Sum III - Data structure design', 'Easy', 'two-sum-iii-data-structure-design'],
  ['Reverse Words in a String II', 'Medium', 'reverse-words-in-a-string-ii'],
  ['Shortest Word Distance', 'Easy', 'shortest-word-distance'],
  ['Shortest Word Distance II', 'Medium', 'shortest-word-distance-ii'],
  ['Shortest Word Distance III', 'Medium', 'shortest-word-distance-iii'],
  ['Strobogrammatic Number', 'Easy', 'strobogrammatic-number'],
  ['Strobogrammatic Number II', 'Medium', 'strobogrammatic-number-ii'],
  ['Strobogrammatic Number III', 'Hard', 'strobogrammatic-number-iii'],
  ['Group Shifted Strings', 'Medium', 'group-shifted-strings'],
  ['Count Univalue Subtrees', 'Medium', 'count-univalue-subtrees'],
  ['Flatten 2D Vector', 'Medium', 'flatten-2d-vector'],
  ['Meeting Rooms', 'Easy', 'meeting-rooms'],
  ['Meeting Rooms II', 'Medium', 'meeting-rooms-ii'],
  ['Factor Combinations', 'Medium', 'factor-combinations'],
  ['Verify Preorder Sequence in Binary Search Tree', 'Medium', 'verify-preorder-sequence-in-binary-search-tree'],
  ['Paint House', 'Medium', 'paint-house'],
  ['3Sum Smaller', 'Medium', '3sum-smaller'],
  ['Graph Valid Tree', 'Medium', 'graph-valid-tree'],
  ['Paint House II', 'Hard', 'paint-house-ii'],
  ['Palindrome Permutation', 'Easy', 'palindrome-permutation'],
  ['Palindrome Permutation II', 'Medium', 'palindrome-permutation-ii'],
  ['Alien Dictionary', 'Hard', 'alien-dictionary'],
  ['Closest Binary Search Tree Value', 'Easy', 'closest-binary-search-tree-value'],
  ['Encode and Decode Strings', 'Medium', 'encode-and-decode-strings'],
  ['Closest Binary Search Tree Value II', 'Hard', 'closest-binary-search-tree-value-ii'],
  ['Paint Fence', 'Medium', 'paint-fence'],
  ['Find the Celebrity', 'Medium', 'find-the-celebrity'],
  ['Wiggle Sort', 'Medium', 'wiggle-sort'],
  ['Zigzag Iterator', 'Medium', 'zigzag-iterator'],
  ['Inorder Successor in BST', 'Medium', 'inorder-successor-in-bst'],
  ['Walls and Gates', 'Medium', 'walls-and-gates'],
  ['Unique Word Abbreviation', 'Medium', 'unique-word-abbreviation'],
  ['Word Pattern II', 'Medium', 'word-pattern-ii'],
  ['Flip Game', 'Easy', 'flip-game'],
  ['Flip Game II', 'Medium', 'flip-game-ii'],
  ['Best Meeting Point', 'Hard', 'best-meeting-point'],
  ['Binary Tree Longest Consecutive Sequence', 'Medium', 'binary-tree-longest-consecutive-sequence'],
  ['Smallest Rectangle Enclosing Black Pixels', 'Hard', 'smallest-rectangle-enclosing-black-pixels'],
  ['Number of Islands II', 'Hard', 'number-of-islands-ii'],
  ['Range Sum Query 2D - Mutable', 'Hard', 'range-sum-query-2d-mutable'],
  ['Sparse Matrix Multiplication', 'Medium', 'sparse-matrix-multiplication'],
  ['Binary Tree Vertical Order Traversal', 'Medium', 'binary-tree-vertical-order-traversal'],
  ['Shortest Distance from All Buildings', 'Hard', 'shortest-distance-from-all-buildings'],
  ['Generalized Abbreviation', 'Medium', 'generalized-abbreviation'],
  ['Number of Connected Components in an Undirected Graph', 'Medium', 'number-of-connected-components-in-an-undirected-graph'],
  ['Maximum Size Subarray Sum Equals k', 'Medium', 'maximum-size-subarray-sum-equals-k'],
  ['Largest BST Subtree', 'Medium', 'largest-bst-subtree'],
  ['Nested List Weight Sum', 'Medium', 'nested-list-weight-sum'],
  ['Longest Substring with At Most K Distinct Characters', 'Medium', 'longest-substring-with-at-most-k-distinct-characters'],
  ['Moving Average from Data Stream', 'Easy', 'moving-average-from-data-stream'],
  ['Design Tic-Tac-Toe', 'Medium', 'design-tic-tac-toe'],
  ['Android Unlock Patterns', 'Medium', 'android-unlock-patterns'],
  ['Design Snake Game', 'Medium', 'design-snake-game'],
  ['Line Reflection', 'Medium', 'line-reflection'],
  ['Rearrange String k Distance Apart', 'Hard', 'rearrange-string-k-distance-apart'],
  ['Logger Rate Limiter', 'Easy', 'logger-rate-limiter'],
  ['Sort Transformed Array', 'Medium', 'sort-transformed-array'],
  ['Bomb Enemy', 'Medium', 'bomb-enemy'],
  ['Design Hit Counter', 'Medium', 'design-hit-counter'],
  ['Nested List Weight Sum II', 'Medium', 'nested-list-weight-sum-ii'],
  ['Find Leaves of Binary Tree', 'Medium', 'find-leaves-of-binary-tree'],
  ['Plus One Linked List', 'Medium', 'plus-one-linked-list'],
  ['Range Addition', 'Medium', 'range-addition'],
  ['Design Phone Directory', 'Medium', 'design-phone-directory'],
  ['Valid Word Abbreviation', 'Easy', 'valid-word-abbreviation'],
  ['Minimum Unique Word Abbreviation', 'Hard', 'minimum-unique-word-abbreviation'],
  ['Sentence Screen Fitting', 'Medium', 'sentence-screen-fitting'],
  ['Valid Word Square', 'Easy', 'valid-word-square'],
  ['Word Squares', 'Hard', 'word-squares'],
  ['Convert Binary Search Tree to Sorted Doubly Linked List', 'Medium', 'convert-binary-search-tree-to-sorted-doubly-linked-list'],
  ['Serialize and Deserialize N-ary Tree', 'Hard', 'serialize-and-deserialize-n-ary-tree'],
  ['Encode N-ary Tree to Binary Tree', 'Hard', 'encode-n-ary-tree-to-binary-tree'],
  ['Ternary Expression Parser', 'Medium', 'ternary-expression-parser'],
  ['Sequence Reconstruction', 'Medium', 'sequence-reconstruction'],
  ['Optimal Account Balancing', 'Hard', 'optimal-account-balancing'],
  ['Convex Polygon', 'Medium', 'convex-polygon'],
  ['Encode String with Shortest Length', 'Hard', 'encode-string-with-shortest-length'],
  ['Find Permutation', 'Medium', 'find-permutation'],
  ['Max Consecutive Ones II', 'Medium', 'max-consecutive-ones-ii'],
  ['Robot Room Cleaner', 'Hard', 'robot-room-cleaner'],
  ['The Maze', 'Medium', 'the-maze'],
  ['The Maze III', 'Hard', 'the-maze-iii'],
  ['The Maze II', 'Medium', 'the-maze-ii'],
]

const DIFFS: Difficulty[] = ['Easy', 'Medium', 'Hard']

/** Easy, Medium, Hard - the only grouping the source supports. */
export const PREMIUM_GROUPS: { name: string; items: SheetEntry[] }[] = DIFFS.map((name) => ({
  name,
  items: toEntries(
    name,
    PREMIUM.filter(([, d]) => d === name).map(([title, difficulty, leetcodeSlug]) => ({
      title,
      difficulty,
      leetcode: `https://leetcode.com/problems/${leetcodeSlug}/`,
    })),
    PROBLEM_IDS,
  ),
}))
