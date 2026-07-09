import type { Problem } from '@/lib/types'
import { threeSumSmaller } from './3sum-smaller'
import { androidUnlockPatterns } from './android-unlock-patterns'
import { bestMeetingPoint } from './best-meeting-point'
import { binaryTreeLongestConsecutive } from './binary-tree-longest-consecutive-sequence'
import { binaryTreeUpsideDown } from './binary-tree-upside-down'
import { binaryTreeVerticalOrder } from './binary-tree-vertical-order-traversal'
import { bombEnemy } from './bomb-enemy'
import { closestBSTValue } from './closest-binary-search-tree-value'
import { closestBSTValueII } from './closest-binary-search-tree-value-ii'
import { countUnivalueSubtrees } from './count-univalue-subtrees'
import { designHitCounter } from './design-hit-counter'
import { designSnakeGame } from './design-snake-game'
import { designTicTacToe } from './design-tic-tac-toe'
import { factorCombinations } from './factor-combinations'
import { findTheCelebrity } from './find-the-celebrity'
import { flatten2DVector } from './flatten-2d-vector'
import { flipGame } from './flip-game'
import { flipGameII } from './flip-game-ii'
import { generalizedAbbreviation } from './generalized-abbreviation'
import { groupShiftedStrings } from './group-shifted-strings'
import { inorderSuccessorInBST } from './inorder-successor-in-bst'
import { largestBSTSubtree } from './largest-bst-subtree'
import { lineReflection } from './line-reflection'
import { loggerRateLimiter } from './logger-rate-limiter'
import { longestSubstringKDistinct } from './longest-substring-with-at-most-k-distinct-characters'
import { longestSubstringTwoDistinct } from './longest-substring-with-at-most-two-distinct-characters'
import { maximumSizeSubarraySumEqualsK } from './maximum-size-subarray-sum-equals-k'
import { missingRanges } from './missing-ranges'
import { movingAverageFromDataStream } from './moving-average-from-data-stream'
import { nestedListWeightSum } from './nested-list-weight-sum'
import { nestedListWeightSumII } from './nested-list-weight-sum-ii'
import { numberOfIslandsII } from './number-of-islands-ii'
import { oneEditDistance } from './one-edit-distance'
import { paintFence } from './paint-fence'
import { paintHouse } from './paint-house'
import { paintHouseII } from './paint-house-ii'
import { palindromePermutation } from './palindrome-permutation'
import { palindromePermutationII } from './palindrome-permutation-ii'
import { rangeSumQuery2DMutable } from './range-sum-query-2d-mutable'
import { readNCharactersGivenRead4 } from './read-n-characters-given-read4'
import { readNCharactersGivenRead4II } from './read-n-characters-given-read4-ii-call-multiple-times'
import { rearrangeStringKDistanceApart } from './rearrange-string-k-distance-apart'
import { reverseWordsII } from './reverse-words-in-a-string-ii'
import { shortestDistanceFromAllBuildings } from './shortest-distance-from-all-buildings'
import { shortestWordDistance } from './shortest-word-distance'
import { shortestWordDistanceII } from './shortest-word-distance-ii'
import { shortestWordDistanceIII } from './shortest-word-distance-iii'
import { smallestRectangleEnclosingBlackPixels } from './smallest-rectangle-enclosing-black-pixels'
import { sortTransformedArray } from './sort-transformed-array'
import { sparseMatrixMultiplication } from './sparse-matrix-multiplication'
import { strobogrammaticNumber } from './strobogrammatic-number'
import { strobogrammaticNumberII } from './strobogrammatic-number-ii'
import { strobogrammaticNumberIII } from './strobogrammatic-number-iii'
import { twoSumIII } from './two-sum-iii-data-structure-design'
import { uniqueWordAbbreviation } from './unique-word-abbreviation'
import { verifyPreorderSequence } from './verify-preorder-sequence-in-binary-search-tree'
import { wallsAndGates } from './walls-and-gates'
import { wiggleSort } from './wiggle-sort'
import { wordPatternII } from './word-pattern-ii'
import { zigzagIterator } from './zigzag-iterator'

/**
 * The LeetCode Premium track, in problem-number order. None of these carries a
 * trace: most are practice-only, and the design problems — a class, an
 * iterator, or a callback API that no single `ParamType` function can express —
 * are statement-only. `src/problems/premium.ts` lights up a row by matching its
 * slugified title against these ids.
 *
 * Kept in its own file so the Premium track is one import in `index.ts`.
 */
export const PREMIUM_PROBLEMS: Problem[] = [
  binaryTreeUpsideDown,
  readNCharactersGivenRead4,
  readNCharactersGivenRead4II,
  longestSubstringTwoDistinct,
  oneEditDistance,
  missingRanges,
  twoSumIII,
  reverseWordsII,
  shortestWordDistance,
  shortestWordDistanceII,
  shortestWordDistanceIII,
  strobogrammaticNumber,
  strobogrammaticNumberII,
  strobogrammaticNumberIII,
  groupShiftedStrings,
  countUnivalueSubtrees,
  flatten2DVector,
  factorCombinations,
  verifyPreorderSequence,
  paintHouse,
  threeSumSmaller,
  paintHouseII,
  palindromePermutation,
  palindromePermutationII,
  closestBSTValue,
  closestBSTValueII,
  paintFence,
  findTheCelebrity,
  wiggleSort,
  zigzagIterator,
  inorderSuccessorInBST,
  wallsAndGates,
  uniqueWordAbbreviation,
  wordPatternII,
  flipGame,
  flipGameII,
  bestMeetingPoint,
  binaryTreeLongestConsecutive,
  smallestRectangleEnclosingBlackPixels,
  numberOfIslandsII,
  rangeSumQuery2DMutable,
  sparseMatrixMultiplication,
  binaryTreeVerticalOrder,
  shortestDistanceFromAllBuildings,
  generalizedAbbreviation,
  maximumSizeSubarraySumEqualsK,
  largestBSTSubtree,
  nestedListWeightSum,
  longestSubstringKDistinct,
  movingAverageFromDataStream,
  designTicTacToe,
  androidUnlockPatterns,
  designSnakeGame,
  lineReflection,
  rearrangeStringKDistanceApart,
  loggerRateLimiter,
  sortTransformedArray,
  bombEnemy,
  designHitCounter,
  nestedListWeightSumII,
]
