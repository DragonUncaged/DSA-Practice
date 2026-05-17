import { arr } from '@/lib/types'
import type { PatternIntro } from './index'

const NUMS = [2, 4, 6, 9, 13, 17]
const TARGET = 23

export const twoPointers: PatternIntro = {
  id: 'two-pointers',
  name: 'Two Pointers',
  tagline: 'Two indices walk toward each other and throw away half the search at every step.',
  story: [
    'The brute force way to find a pair is to try every pair — two nested loops, `O(n^2)`. Two pointers replaces the inner loop with a single decision: stand one pointer at each end of a *sorted* array and look at the pair they straddle.',
    'The sum they see is either too small, too big, or the answer. Too small? Only moving the left pointer right can grow it — every pair using the old left value is now provably too small, so all of them vanish from consideration in one move. Too big? The same argument mirrors: move the right pointer left. One comparison retires a whole row of the pair table.',
    'That is the entire trick: sorted order turns one comparison into a proof about many pairs. The same pinch shows up on strings (palindromes), on heights (Container With Most Water), and — with both pointers moving the same direction at different speeds — on linked lists, where the fast/slow variant finds middles and cycles without counting.',
  ],
  signals: [
    'The input is sorted, or sorting it first would not break the question.',
    'You are looking for a pair, triple, or span that satisfies a condition.',
    'The obvious solution is two nested loops over the same sequence.',
    'On a linked list: you need the middle, a cycle, or the k-th node from the end in one pass.',
  ],
  pseudo: {
    lines: [
      'left = 0, right = n - 1',
      'while left < right:',
      '    sum = nums[left] + nums[right]',
      '    if sum == target: found it',
      '    if sum < target:  left += 1',
      '    else:             right -= 1',
    ],
    map: { init: 1, look: 3, found: 4, small: 5, big: 6 },
  },

  trace(t) {
    const n = NUMS.length
    let l = 0
    let r = n - 1

    const view = (tones: Record<number, 'idle' | 'dim' | 'good'> = {}) =>
      arr(NUMS, {
        pointers: [
          { name: 'left', at: l, accent: 'a' },
          { name: 'right', at: r, accent: 'b' },
        ],
        band: l < r ? { from: l, to: r, label: 'still possible' } : null,
        tones,
        title: `sorted nums — find a pair summing to ${TARGET}`,
      })

    t.push({
      step: 'init',
      note: `Start at the ends: the widest possible pair. Everything between the pointers is still in play.`,
      view: view(),
      vars: [
        ['left', l, 'a'],
        ['right', r, 'b'],
        ['target', TARGET],
      ],
    })

    while (l < r) {
      const sum = NUMS[l] + NUMS[r]
      t.bump()
      if (sum === TARGET) {
        t.push({
          step: 'found',
          note: `${NUMS[l]} + ${NUMS[r]} = ${TARGET}. Found — and every skipped pair was skipped with a proof, not a guess.`,
          view: arr(NUMS, {
            pointers: [
              { name: 'left', at: l, accent: 'a' },
              { name: 'right', at: r, accent: 'b' },
            ],
            tones: { [l]: 'good', [r]: 'good' },
            title: `sorted nums — find a pair summing to ${TARGET}`,
          }),
          vars: [
            ['sum', sum, 'ok'],
            ['target', TARGET],
          ],
          badge: { text: `${NUMS[l]} + ${NUMS[r]} = ${TARGET}`, accent: 'ok' },
        })
        return
      }
      if (sum < TARGET) {
        t.push({
          step: 'small',
          note: `${NUMS[l]} + ${NUMS[r]} = ${sum} < ${TARGET}. No pair using ${NUMS[l]} can ever be big enough — its best partner just failed. Retire it.`,
          view: view({ [l]: 'dim' }),
          vars: [
            ['sum', sum, 'no'],
            ['target', TARGET],
          ],
          badge: { text: `${sum} < ${TARGET} — left moves`, accent: 'a' },
        })
        l++
      } else {
        t.push({
          step: 'big',
          note: `${NUMS[l]} + ${NUMS[r]} = ${sum} > ${TARGET}. Same proof, mirrored: ${NUMS[r]} is too big for even the smallest remaining partner. Retire it.`,
          view: view({ [r]: 'dim' }),
          vars: [
            ['sum', sum, 'no'],
            ['target', TARGET],
          ],
          badge: { text: `${sum} > ${TARGET} — right moves`, accent: 'b' },
        })
        r--
      }
    }
  },

  ramp: [
    'valid-palindrome',
    'container-with-most-water',
    '3sum',
    'detect-cycle-in-a-linked-list',
    'remove-nth-node-from-end-of-list',
    'reorder-list',
  ],
}
