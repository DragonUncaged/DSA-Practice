/**
 * The whole problem library: data, traces, reference solutions and starters.
 *
 * This is the heavy half — importing it pulls every problem module. Only
 * `/p/[id]` and `/selftest` may. Anything that needs a title, a group, a
 * difficulty or a sheet table imports `./meta` instead; see the note there.
 */

import type { DesignProblem, PracticeProblem, Problem } from '@/lib/types'
import { threeSum } from './3sum'
import { fourSum } from './4sum'
import { addAndSearchWord } from './add-and-search-word'
import { alienDictionary } from './alien-dictionary'
import { bestTimeToBuyAndSellStock } from './best-time-to-buy-and-sell-stock'
import { binaryTreeLevelOrderTraversal } from './binary-tree-level-order-traversal'
import { binaryTreeMaximumPathSum } from './binary-tree-maximum-path-sum'
import { climbingStairs } from './climbing-stairs'
import { cloneGraph } from './clone-graph'
import { coinChange } from './coin-change'
import { combinationSum } from './combination-sum'
import { constructBinaryTree } from './construct-binary-tree-from-preorder-and-inorder-traversal'
import { containsDuplicate } from './contains-duplicate'
import { containerWithMostWater } from './container-with-most-water'
import { courseSchedule } from './course-schedule'
import { countingBits } from './counting-bits'
import { decodeWays } from './decode-ways'
import { detectCycle } from './detect-cycle-in-a-linked-list'
import { encodeAndDecodeStrings } from './encode-and-decode-strings'
import { findMedianFromDataStream } from './find-median-from-data-stream'
import { findMinimumInRotatedSortedArray } from './find-minimum-in-rotated-sorted-array'
import { graphValidTree } from './graph-valid-tree'
import { groupAnagrams } from './group-anagrams'
import { houseRobber } from './house-robber'
import { houseRobberII } from './house-robber-ii'
import { implementTrie } from './implement-trie-prefix-tree'
import { insertInterval } from './insert-interval'
import { invertBinaryTree } from './invert-binary-tree'
import { jumpGame } from './jump-game'
import { kthSmallestElementInABst } from './kth-smallest-element-in-a-bst'
import { longestCommonSubsequence } from './longest-common-subsequence'
import { longestConsecutiveSequence } from './longest-consecutive-sequence'
import { longestIncreasingSubsequence } from './longest-increasing-subsequence'
import { longestPalindromicSubstring } from './longest-palindromic-substring'
import { longestRepeatingCharacterReplacement } from './longest-repeating-character-replacement'
import { longestSubstringWithoutRepeating } from './longest-substring-without-repeating-characters'
import { lowestCommonAncestorOfABst } from './lowest-common-ancestor-of-a-bst'
import { maximumDepthOfBinaryTree } from './maximum-depth-of-binary-tree'
import { maximumProductSubarray } from './maximum-product-subarray'
import { maximumSubarray } from './maximum-subarray'
import { meetingRooms } from './meeting-rooms'
import { meetingRoomsII } from './meeting-rooms-ii'
import { mergeIntervals } from './merge-intervals'
import { mergeKSortedLists } from './merge-k-sorted-lists'
import { mergeTwoSortedLists } from './merge-two-sorted-lists'
import { minimumWindowSubstring } from './minimum-window-substring'
import { missingNumber } from './missing-number'
import { nonOverlappingIntervals } from './non-overlapping-intervals'
import { connectedComponents } from './number-of-connected-components-in-an-undirected-graph'
import { numberOf1Bits } from './number-of-1-bits'
import { numberOfIslands } from './number-of-islands'
import { pacificAtlanticWaterFlow } from './pacific-atlantic-water-flow'
import { palindromicSubstrings } from './palindromic-substrings'
import { productOfArrayExceptSelf } from './product-of-array-except-self'
import { removeNthFromEnd } from './remove-nth-node-from-end-of-list'
import { reorderList } from './reorder-list'
import { reverseBits } from './reverse-bits'
import { reverseLinkedList } from './reverse-a-linked-list'
import { rotateImage } from './rotate-image'
import { sameTree } from './same-tree'
import { searchInRotatedSortedArray } from './search-in-rotated-sorted-array'
import { serializeAndDeserializeBinaryTree } from './serialize-and-deserialize-binary-tree'
import { setMatrixZeroes } from './set-matrix-zeroes'
import { spiralMatrix } from './spiral-matrix'
import { subtreeOfAnotherTree } from './subtree-of-another-tree'
import { sumOfTwoIntegers } from './sum-of-two-integers'
import { topKFrequentElements } from './top-k-frequent-elements'
import { twoSum } from './two-sum'
import { uniquePaths } from './unique-paths'
import { validAnagram } from './valid-anagram'
import { validPalindrome } from './valid-palindrome'
import { validParentheses } from './valid-parentheses'
import { validateBinarySearchTree } from './validate-binary-search-tree'
import { wordBreak } from './word-break'
import { wordSearch } from './word-search'
import { wordSearchII } from './word-search-ii'

// --- Google company track (practice-only) ---------------------------------
import { addStrings } from './add-strings'
import { findAnagramMappings } from './find-anagram-mappings'
import { firstUniqueCharacter } from './first-unique-character-in-a-string'
import { guessNumberHigherOrLower } from './guess-number-higher-or-lower'
import { largestNumberAtLeastTwiceOfOthers } from './largest-number-at-least-twice-of-others'
import { largestTriangleArea } from './largest-triangle-area'
import { longestPalindrome } from './longest-palindrome'
import { maxConsecutiveOnes } from './max-consecutive-ones'
import { maximumAverageSubarray } from './maximum-average-subarray'
import { plusOne } from './plus-one'
import { rotatedDigits } from './rotated-digits'
import { similarRgbColor } from './similar-rgb-color'
import { subarraySumEqualsK } from './subarray-sum-equals-k'
import { toeplitzMatrix } from './toeplitz-matrix'
import { binaryTreePaths } from './binary-tree-paths'
import { boldWordsInString } from './bold-words-in-string'
import { diameterOfBinaryTree } from './diameter-of-binary-tree'
import { findModeInBinarySearchTree } from './find-mode-in-binary-search-tree'
import { judgeRouteCircle } from './judge-route-circle'
import { longestUnivaluePath } from './longest-univalue-path'
import { minimumAbsoluteDifferenceInBst } from './minimum-absolute-difference-in-bst'
import { minimumDifferenceBetweenBstNodes } from './minimum-difference-between-bst-nodes'
import { nonDecreasingArray } from './non-decreasing-array'
import { repeatedStringMatch } from './repeated-string-match'
import { sentenceSimilarity } from './sentence-similarity'
import { shortestUnsortedContinuousSubarray } from './shortest-unsorted-continuous-subarray'
import { studentAttendanceRecordI } from './student-attendance-record-i'
import { detectCapital } from './detect-capital'
import { findAllNumbersDisappearedInAnArray } from './find-all-numbers-disappeared-in-an-array'
import { findTheDifference } from './find-the-difference'
import { islandPerimeter } from './island-perimeter'
import { licenseKeyFormatting } from './license-key-formatting'
import { longestUncommonSubsequenceI } from './longest-uncommon-subsequence-i'
import { nthDigit } from './nth-digit'
import { numberOfBoomerangs } from './number-of-boomerangs'
import { powerOfThree } from './power-of-three'
import { powerOfTwo } from './power-of-two'
import { relativeRanks } from './relative-ranks'
import { repeatedSubstringPattern } from './repeated-substring-pattern'
import { reverseStringII } from './reverse-string-ii'
import { reverseVowelsOfAString } from './reverse-vowels-of-a-string'
import { heaters } from './heaters'
import { inputStream } from './input-stream'
import { palindromicRanges } from './palindromic-ranges'
import { qualityInspection } from './quality-inspection'
import { removeDuplicateLetters } from './remove-duplicate-letters'
import { sameNumber } from './same-number'
import { theJudgesGiveProblem } from './the-judges-give-problem'
import { twitchWords } from './twitch-words'
// --- end Google company track ---------------------------------------------

// --- LeetCode Premium ------------------------------------------------------
// The whole track comes in through one array; none of it carries a trace.
import { PREMIUM_PROBLEMS } from './premium-index'

/**
 * Every registered problem: the Blind 75, each with a hand-authored trace,
 * then the other tracks' problems, most of which are practice-only — tests and
 * reference solutions but no trace.
 */
export const PROBLEMS: Problem[] = [
  // Array
  twoSum,
  bestTimeToBuyAndSellStock,
  containsDuplicate,
  productOfArrayExceptSelf,
  maximumSubarray,
  maximumProductSubarray,
  findMinimumInRotatedSortedArray,
  searchInRotatedSortedArray,
  threeSum,
  fourSum,
  containerWithMostWater,
  // Binary
  sumOfTwoIntegers,
  numberOf1Bits,
  countingBits,
  missingNumber,
  reverseBits,
  // Dynamic Programming
  climbingStairs,
  coinChange,
  longestIncreasingSubsequence,
  longestCommonSubsequence,
  wordBreak,
  combinationSum,
  houseRobber,
  houseRobberII,
  decodeWays,
  uniquePaths,
  jumpGame,
  // Graph
  cloneGraph,
  courseSchedule,
  pacificAtlanticWaterFlow,
  numberOfIslands,
  longestConsecutiveSequence,
  alienDictionary,
  graphValidTree,
  connectedComponents,
  // Interval
  insertInterval,
  mergeIntervals,
  nonOverlappingIntervals,
  meetingRooms,
  meetingRoomsII,
  // Linked List
  reverseLinkedList,
  detectCycle,
  mergeTwoSortedLists,
  mergeKSortedLists,
  removeNthFromEnd,
  reorderList,
  // Matrix
  setMatrixZeroes,
  spiralMatrix,
  rotateImage,
  wordSearch,
  // String
  longestSubstringWithoutRepeating,
  longestRepeatingCharacterReplacement,
  minimumWindowSubstring,
  validAnagram,
  groupAnagrams,
  validParentheses,
  validPalindrome,
  longestPalindromicSubstring,
  palindromicSubstrings,
  encodeAndDecodeStrings,
  // Tree
  maximumDepthOfBinaryTree,
  sameTree,
  invertBinaryTree,
  binaryTreeMaximumPathSum,
  binaryTreeLevelOrderTraversal,
  serializeAndDeserializeBinaryTree,
  subtreeOfAnotherTree,
  constructBinaryTree,
  validateBinarySearchTree,
  kthSmallestElementInABst,
  lowestCommonAncestorOfABst,
  implementTrie,
  addAndSearchWord,
  wordSearchII,
  // Heap
  topKFrequentElements,
  findMedianFromDataStream,
  // Google company track (practice-only)
  plusOne,
  addStrings,
  similarRgbColor,
  toeplitzMatrix,
  maxConsecutiveOnes,
  firstUniqueCharacter,
  longestPalindrome,
  guessNumberHigherOrLower,
  findAnagramMappings,
  subarraySumEqualsK,
  maximumAverageSubarray,
  largestTriangleArea,
  rotatedDigits,
  largestNumberAtLeastTwiceOfOthers,
  binaryTreePaths,
  diameterOfBinaryTree,
  longestUnivaluePath,
  minimumDifferenceBetweenBstNodes,
  minimumAbsoluteDifferenceInBst,
  findModeInBinarySearchTree,
  sentenceSimilarity,
  boldWordsInString,
  repeatedStringMatch,
  nonDecreasingArray,
  judgeRouteCircle,
  shortestUnsortedContinuousSubarray,
  studentAttendanceRecordI,
  reverseStringII,
  longestUncommonSubsequenceI,
  detectCapital,
  relativeRanks,
  licenseKeyFormatting,
  islandPerimeter,
  repeatedSubstringPattern,
  findAllNumbersDisappearedInAnArray,
  numberOfBoomerangs,
  nthDigit,
  findTheDifference,
  reverseVowelsOfAString,
  powerOfThree,
  powerOfTwo,
  inputStream,
  twitchWords,
  removeDuplicateLetters,
  heaters,
  // Statement-only: LintCode-specific problems TRACE cannot state exactly.
  sameNumber,
  palindromicRanges,
  theJudgesGiveProblem,
  qualityInspection,
  // end Google company track

  // LeetCode Premium
  ...PREMIUM_PROBLEMS,
]

export const byId = (id: string) => PROBLEMS.find((p) => p.id === id)

/**
 * A practice-only problem ships an editor, tests and a reference solution but
 * no animation, so the player hides Trace and Brute vs Optimal for it.
 */
export const hasTrace = (problem: Problem) =>
  problem.solutions?.some((s) => s.trace != null) ?? false

/**
 * A statement-only problem — an iterator, a callback API, an interactive judge
 * — carries neither a signature nor a class shape, so there is nothing to put
 * in an editor. Everything else in the player is driven off this one question.
 */
export const hasPractice = (problem: Problem): problem is PracticeProblem =>
  problem.signature != null || problem.design != null

/** A design problem is run as a class; the runner and the test table both fork on this. */
export const isDesign = (problem: Problem): problem is DesignProblem => problem.design != null

