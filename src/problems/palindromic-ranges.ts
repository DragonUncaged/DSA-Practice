import type { Problem } from '@/lib/types'

/**
 * LintCode 745. Statement-only: this is a Google Code Jam problem carried over
 * to LintCode, and the reading below is the best one the title supports. The
 * exact bounds and answer format live on LintCode, so no tests ship here.
 */
export const palindromicRanges: Problem = {
  id: 'palindromic-ranges',
  title: 'Palindromic Ranges',
  group: 'Math',
  pattern: 'Prefix Counting',
  difficulty: 'Medium',
  statement:
    'A positive integer is palindromic when its decimal digits read the same in both directions. A range `[L, R]` is *palindromic* when the count of palindromic integers inside it is even. Given bounds `S` and `F`, count the ranges `[L, R]` with `S <= L <= R <= F` that are palindromic. This is LintCode 745, a Google Code Jam problem; TRACE carries the statement only, so there are no tests here to run against.',
  constraints: [
    'LintCode problem 745 — solve it there for the exact bounds and answer format',
    'A range is palindromic when it contains an even number of palindromic integers',
    'Zero counts as an even number, so a range with no palindromes qualifies',
  ],
}
