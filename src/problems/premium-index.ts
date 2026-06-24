import type { Problem } from '@/lib/types'
import { binaryTreeUpsideDown } from './binary-tree-upside-down'
import { longestSubstringTwoDistinct } from './longest-substring-with-at-most-two-distinct-characters'
import { missingRanges } from './missing-ranges'
import { oneEditDistance } from './one-edit-distance'
import { readNCharactersGivenRead4 } from './read-n-characters-given-read4'
import { readNCharactersGivenRead4II } from './read-n-characters-given-read4-ii-call-multiple-times'
import { reverseWordsII } from './reverse-words-in-a-string-ii'
import { shortestWordDistance } from './shortest-word-distance'
import { shortestWordDistanceII } from './shortest-word-distance-ii'
import { shortestWordDistanceIII } from './shortest-word-distance-iii'
import { strobogrammaticNumber } from './strobogrammatic-number'
import { twoSumIII } from './two-sum-iii-data-structure-design'

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
]
