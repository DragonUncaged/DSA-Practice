import type { Problem } from '@/lib/types'

/**
 * LintCode 1368. Statement-only: the reading below follows the title and the
 * problem's usual framing, but LintCode defines the exact input format and the
 * literal answer string, so shipping tests here would be guesswork.
 */
export const sameNumber: Problem = {
  id: 'same-number',
  title: 'Same Number',
  group: 'Array',
  pattern: 'Hash Map',
  difficulty: 'Easy',
  statement:
    'Given an integer array `nums` and an integer `k`, decide whether the array holds two equal values whose positions are less than `k` apart, and report the answer as `"YES"` or `"NO"`. This is LintCode 1368 — the same question as *Contains Duplicate II*, answered with a word rather than a boolean. TRACE carries the statement only: LintCode owns the exact input format and answer string, so there are no tests here to run against.',
  constraints: [
    'LintCode problem 1368 — solve it there for the exact I/O contract',
    'Two equal values count only when their index distance is strictly less than k',
    'The answer is the string YES or NO',
  ],
}
