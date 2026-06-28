import type { Problem } from '@/lib/types'
import { threeSumSmaller } from './3sum-smaller'
import { binaryTreeUpsideDown } from './binary-tree-upside-down'
import { countUnivalueSubtrees } from './count-univalue-subtrees'
import { factorCombinations } from './factor-combinations'
import { flatten2DVector } from './flatten-2d-vector'
import { groupShiftedStrings } from './group-shifted-strings'
import { longestSubstringTwoDistinct } from './longest-substring-with-at-most-two-distinct-characters'
import { missingRanges } from './missing-ranges'
import { oneEditDistance } from './one-edit-distance'
import { paintHouse } from './paint-house'
import { paintHouseII } from './paint-house-ii'
import { palindromePermutation } from './palindrome-permutation'
import { palindromePermutationII } from './palindrome-permutation-ii'
import { readNCharactersGivenRead4 } from './read-n-characters-given-read4'
import { readNCharactersGivenRead4II } from './read-n-characters-given-read4-ii-call-multiple-times'
import { reverseWordsII } from './reverse-words-in-a-string-ii'
import { shortestWordDistance } from './shortest-word-distance'
import { shortestWordDistanceII } from './shortest-word-distance-ii'
import { shortestWordDistanceIII } from './shortest-word-distance-iii'
import { strobogrammaticNumber } from './strobogrammatic-number'
import { strobogrammaticNumberII } from './strobogrammatic-number-ii'
import { strobogrammaticNumberIII } from './strobogrammatic-number-iii'
import { twoSumIII } from './two-sum-iii-data-structure-design'
import { verifyPreorderSequence } from './verify-preorder-sequence-in-binary-search-tree'

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
]
