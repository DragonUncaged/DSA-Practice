import type { Difficulty } from '@/lib/types'
import { PROBLEM_IDS } from './index'
import { toEntries, type SheetEntry } from './sheet'

/**
 * Company-wise tracks - the problems a given company is known to lean on.
 *
 * Each company is one entry in COMPANIES; adding another means appending a
 * CompanyTrack here (and one line in Sheet's TRACKS + TopNav), not reshaping
 * this module. Rows carry no trace id: a row lights up when its slugified
 * title matches a problem we have already traced, so the list grows into the
 * player as traces land.
 */

type Row = [string, Difficulty]

interface CompanyTrack {
  /** Route segment and track id suffix, e.g. 'google' -> /company/google. */
  id: string
  title: string
  /** The company's own must-do set. */
  core: Row[]
  /** Adjacent problems the same collection groups with the core set. */
  related: Row[]
}

/**
 * Google, from LintCode collection 18 (level 1). Levels 2-4 sit behind an
 * account and are deliberately out of scope, so this is 62 problems, not the
 * full collection.
 */
const GOOGLE: CompanyTrack = {
  id: 'google',
  title: 'Google',
  core: [
    ['Merge Intervals', 'Easy'],
    ['Plus One', 'Easy'],
    ['Valid Parentheses', 'Easy'],
    ['Paint Fence', 'Easy'],
    ['Add Strings', 'Easy'],
    ['Valid Word Square', 'Easy'],
    ['Flip Game', 'Easy'],
    ['Similar RGB Color', 'Easy'],
    ['Toeplitz Matrix', 'Easy'],
    ['Max Consecutive Ones', 'Easy'],
  ],
  related: [
    ['First Unique Character in a String', 'Easy'],
    ['Number of Islands', 'Easy'],
    ['Binary Tree Paths', 'Easy'],
    ['Binary Tree Longest Consecutive Sequence', 'Easy'],
    ['Longest Palindrome', 'Easy'],
    ['Valid Word Abbreviation', 'Easy'],
    ['Moving Average from Data Stream', 'Easy'],
    ['Strobogrammatic Number', 'Easy'],
    ['Guess Number Higher or Lower', 'Easy'],
    ['Bold Words in String', 'Easy'],
    ['Find Anagram Mappings', 'Easy'],
    ['Input Stream', 'Easy'],
    ['Subarray Sum Equals K', 'Easy'],
    ['Sentence Similarity', 'Easy'],
    ['Maximum Average Subarray', 'Easy'],
    ['Closest Binary Search Tree Value', 'Easy'],
    ['Palindrome Permutation', 'Easy'],
    ['Largest Triangle Area', 'Easy'],
    ['Rotated Digits', 'Easy'],
    ['Minimum Difference Between BST Nodes', 'Easy'],
    ['Largest Number At Least Twice of Others', 'Easy'],
    ['Longest Univalue Path', 'Easy'],
    ['Repeated String Match', 'Easy'],
    ['Non-decreasing Array', 'Easy'],
    ['Judge Route Circle', 'Easy'],
    ['Shortest Unsorted Continuous Subarray', 'Easy'],
    ['Student Attendance Record I', 'Easy'],
    ['Diameter of Binary Tree', 'Easy'],
    ['Reverse String II', 'Easy'],
    ['Minimum Absolute Difference in BST', 'Easy'],
    ['Longest Uncommon Subsequence I', 'Easy'],
    ['Detect Capital', 'Easy'],
    ['Relative Ranks', 'Easy'],
    ['License Key Formatting', 'Easy'],
    ['Island Perimeter', 'Easy'],
    ['Repeated Substring Pattern', 'Easy'],
    ['Find All Numbers Disappeared in an Array', 'Easy'],
    ['Number of Boomerangs', 'Easy'],
    ['Nth Digit', 'Easy'],
    ['Find the Difference', 'Easy'],
    ['Reverse Vowels of a String', 'Easy'],
    ['Power of Three', 'Easy'],
    ['Power of Two', 'Easy'],
    ['Same Number', 'Easy'],
    ['Twitch Words', 'Easy'],
    ['Insert Interval', 'Medium'],
    ['Palindromic Ranges', 'Medium'],
    // LintCode ships this one with no difficulty label; filed as Medium to
    // match how the same problem is rated everywhere else.
    ['Remove Duplicate Letters', 'Medium'],
    ['The Judges Give Problem', 'Medium'],
    ['Find Mode in Binary Search Tree', 'Medium'],
    ['Heaters', 'Medium'],
    ['Quality Inspection', 'Hard'],
  ],
}

const COMPANIES: CompanyTrack[] = [GOOGLE]

const rows = (rs: Row[]) => rs.map(([title, difficulty]) => ({ title, difficulty }))

const groupsOf = (c: CompanyTrack) => [
  { name: 'Core', items: toEntries('Core', rows(c.core), PROBLEM_IDS) },
  { name: 'Related', items: toEntries('Related', rows(c.related), PROBLEM_IDS) },
]

/**
 * Groups per company id. A new company is one more COMPANIES entry plus the
 * `Sheet` track and nav link that point at it - nothing here changes shape.
 */
export const COMPANY_GROUPS: Record<string, { name: string; items: SheetEntry[] }[]> =
  Object.fromEntries(COMPANIES.map((c) => [c.id, groupsOf(c)]))

export const COMPANY_TITLES: Record<string, string> = Object.fromEntries(
  COMPANIES.map((c) => [c.id, c.title]),
)
